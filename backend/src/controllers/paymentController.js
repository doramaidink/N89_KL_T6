const crypto = require("crypto");
const { createPayment } = require("../services/payosService");
const bankInfo = require("../config/payosBankInfo");
const ThanhToan = require("../models/ThanhToan");
const LoiMoi = require("../models/LoiMoi");

function sortObject(obj) {
  return Object.keys(obj || {})
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

function createSignature(data, checksumKey) {
  const sortedData = sortObject(data);

  const dataString = Object.entries(sortedData)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHmac("sha256", checksumKey)
    .update(dataString)
    .digest("hex");
}

function verifyPayOSWebhook(body) {
  const { data, signature } = body;

  if (!data || !signature) return false;

  const mySignature = createSignature(data, process.env.PAYOS_CHECKSUM_KEY);

  return mySignature === signature;
}

async function taoLoiMoiSauThanhToan(payment) {
  if (payment.daTaoLoiMoi) return;

  if (!payment.doiTacId || !payment.nguoiGuiId) return;

  const existed = await LoiMoi.findOne({
    doiTacId: payment.doiTacId,
    nguoiGuiId: payment.nguoiGuiId,
    nhomId: payment.nhomId || null,
    trangThai: "cho_xac_nhan",
  });

  if (!existed) {
    await LoiMoi.create({
      nhomId: payment.nhomId || null,
      doiTacId: payment.doiTacId,
      nguoiGuiId: payment.nguoiGuiId,
      loaiLoiMoi: payment.loaiLoiMoi || "tao_moi",
    });
  }

  payment.daTaoLoiMoi = true;
  await payment.save();
}

class PaymentController {
  async createPayment(req, res) {
    try {
      const {
        amount,
        guideName,
        doiTacId,
        nguoiGuiId,
        nhomId,
        loaiLoiMoi,
      } = req.body;

      const safeAmount = Number(amount);

      if (!safeAmount || safeAmount < 1000) {
        return res.status(400).json({
          error: "Số tiền không hợp lệ",
        });
      }

      const orderCode = Number(Date.now().toString().slice(-6));

      const paymentData = {
        orderCode,
        amount: safeAmount,
        description: "THUEHDV",
        items: [
          {
            name: "Thue huong dan vien",
            quantity: 1,
            price: safeAmount,
          },
        ],
        cancelUrl: "http://localhost:5173/thanhtoan",
        returnUrl: `http://localhost:5173/thanhtoan?orderCode=${orderCode}`,
      };

      const result = await createPayment(paymentData);

      const qrCode = result?.data?.qrCode || "";
      const checkoutUrl = result?.data?.checkoutUrl || "";
      const paymentLinkId = result?.data?.paymentLinkId || "";

      if (!qrCode && !checkoutUrl) {
        return res.status(400).json({
          error: "Không lấy được mã QR hoặc link thanh toán",
          raw: result,
        });
      }

      await ThanhToan.findOneAndUpdate(
        { orderCode },
        {
          orderCode,
          guideName: guideName || "",
          amount: safeAmount,
          status: "pending",
          paymentLinkId,
          doiTacId: doiTacId || null,
          nguoiGuiId: nguoiGuiId || null,
          nhomId: nhomId || null,
          loaiLoiMoi: loaiLoiMoi || "tao_moi",
        },
        { upsert: true, new: true }
      );

      return res.json({
        qrCode,
        checkoutUrl,
        orderCode,
        bankInfo,
        status: "pending",
      });
    } catch (error) {
      console.error(
        "Lỗi createPayment:",
        error?.response?.data || error.message || error
      );

      return res.status(500).json({
        error: "Lỗi tạo thanh toán",
        detail: error?.response?.data || error.message,
      });
    }
  }

  async getPaymentStatus(req, res) {
    try {
      const { orderCode } = req.params;

      const payment = await ThanhToan.findOne({
        orderCode: Number(orderCode),
      });

      if (!payment) {
        return res.status(404).json({
          error: "Không tìm thấy đơn thanh toán",
        });
      }

      return res.json({
        orderCode: payment.orderCode,
        status: payment.status,
        amount: payment.amount,
        guideName: payment.guideName,
        daTaoLoiMoi: payment.daTaoLoiMoi,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Lỗi lấy trạng thái thanh toán",
      });
    }
  }

 async payosWebhook(req, res) {
  try {
    console.log("===== PAYOS WEBHOOK HIT =====");
    console.log("BODY:", JSON.stringify(req.body, null, 2));

    const body = req.body;
    const data = body.data || {};
    const orderCode = Number(data.orderCode);

    console.log("orderCode từ webhook:", orderCode);

    if (!orderCode) {
      return res.status(200).json({
        success: true,
        message: "Webhook không có orderCode",
      });
    }

    const payment = await ThanhToan.findOne({ orderCode });

    console.log("payment tìm được:", payment);

    if (!payment) {
      return res.status(200).json({
        success: true,
        message: "Không tìm thấy đơn trong DB",
      });
    }

    // TẠM THỜI CHO UPDATE TRƯỚC ĐỂ TEST LUỒNG
    // Sau khi chạy ổn rồi mình bật verify signature lại sau
    if (body.success === true || body.code === "00") {
      payment.status = "paid";
      payment.reference = data.reference || "";
      payment.transactionDateTime = data.transactionDateTime || "";
      await payment.save();

      await taoLoiMoiSauThanhToan(payment);

      console.log("ĐÃ UPDATE PAYMENT SANG PAID:", payment.orderCode);
    }

    return res.status(200).json({
      success: true,
      message: "Webhook xử lý thành công",
    });
  } catch (error) {
    console.error("Lỗi PayOS webhook:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi xử lý webhook",
    });
  }
}
}

module.exports = new PaymentController();