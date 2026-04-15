const { createPayment } = require("../services/payosService");
const bankInfo = require("../config/payosBankInfo");
const ThanhToan = require("../models/ThanhToan");

class PaymentController {
  async createPayment(req, res) {
    try {
      const { amount, guideName } = req.body;

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

      console.log("PAYOS RESULT =", result);

      const qrCode = result?.data?.qrCode || "";
      const checkoutUrl = result?.data?.checkoutUrl || "";
      const paymentLinkId =
        result?.data?.paymentLinkId || "";

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
        },
        { upsert: true, returnDocument: "after" }
      );

      return res.json({
        qrCode,
        checkoutUrl,
        orderCode,
        bankInfo,
      });
    } catch (error) {
      console.error("Lỗi createPayment:", error?.response?.data || error.message || error);
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
      });
    } catch (error) {
      return res.status(500).json({
        error: "Lỗi lấy trạng thái thanh toán",
      });
    }
  }
}

module.exports = new PaymentController();