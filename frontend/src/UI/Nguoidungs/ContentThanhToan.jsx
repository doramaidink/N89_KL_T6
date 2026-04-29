import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ContentThanhToan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bankInfo, setBankInfo] = useState(null);
  const [guide, setGuide] = useState(null);
  const [qr, setQr] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dùng để tránh hiện thông báo nhiều lần
  const daBaoThanhCong = useRef(false);

  const formatPrice = (price) => {
    if (!price && price !== 0) return "1.200.000đ";
    return `${Number(price).toLocaleString("vi-VN")}đ`;
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("selectedGuide"));
    const user = JSON.parse(localStorage.getItem("user"));

    const orderCodeFromUrl = searchParams.get("orderCode");

    if (data) {
      setGuide(data);
    }

    if (!data) {
      setLoading(false);
      setError("Không tìm thấy thông tin hướng dẫn viên đã chọn");
      return;
    }

    const fetchPayment = async () => {
      try {
        setLoading(true);
        setError("");

        // Nếu PayOS redirect về có orderCode thì không tạo QR mới
        if (orderCodeFromUrl) {
          setOrderCode(orderCodeFromUrl);
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/payment/create-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: Number(data.giaThue) || 1000000,
              guideName: data.hoTen || "",

              // Các id này backend dùng để sau khi paid thì tạo lời mời
              doiTacId: data?._id,
              nguoiGuiId: user?._id || user?.id,
              nhomId: data?.groupToHire?._id || null,
              loaiLoiMoi: data?.groupToHire ? "co_nhom" : "tao_moi",
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Không thể tạo mã thanh toán");
        }

        setQr(result.qrCode || "");
        setCheckoutUrl(result.checkoutUrl || "");
        setBankInfo(result.bankInfo || null);
        setOrderCode(result.orderCode || "");
        setPaymentStatus(result.status || "pending");
      } catch (err) {
        console.error("Lỗi tạo thanh toán:", err);
        setError(err.message || "Có lỗi xảy ra khi tạo mã QR");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [searchParams]);

  useEffect(() => {
    if (!orderCode) return;

    /*
      PHẦN NÀY THAY CHO NÚT FAKE

      Trước đây bạn có nút fake kiểu:
      button onClick={handleFakePaymentSuccess}

      Bây giờ bỏ nút đó đi.

      Cứ mỗi 3 giây, frontend sẽ gọi backend:
      GET /payment/status/:orderCode

      Nếu backend trả về status = "paid"
      nghĩa là PayOS webhook đã báo thanh toán thành công.
    */

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/payment/status/${orderCode}`
        );

        const result = await response.json();

        if (!response.ok) return;

        setPaymentStatus(result.status);

        /*
          Khi đã thanh toán:
          1. Hiện thông báo
          2. Xóa selectedGuide khỏi localStorage
          3. Chuyển hướng 
        */
        if (result.status === "paid" && !daBaoThanhCong.current) {
          daBaoThanhCong.current = true;

          alert("Bạn đã thanh toán thành công!");

          localStorage.removeItem("selectedGuide");

          // Đổi đường dẫn fake cũ
          navigate("/nhom");
        }
      } catch (err) {
        console.error("Lỗi kiểm tra trạng thái thanh toán:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderCode, navigate]);

  return (
    <div className="payment-page-custom">
      <div className="payment-wrapper-custom">
        <div className="payment-topbar-custom">
          <div className="payment-brand-custom">
            <img src="/img/logo.jpeg" alt="logo" />
            <span>Backpacking VietNam</span>
          </div>

          <button
            className="payment-back-btn-custom"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

        <div className="payment-content-custom">
          <div className="payment-left-custom">
            <div
              className="payment-back-link-custom"
              onClick={() => navigate(-1)}
            >
              ← QUAY LẠI
            </div>

            <h1>Thanh toán thuê hướng dẫn viên</h1>

            {paymentStatus === "paid" ? (
              <p style={{ color: "#16a34a", fontWeight: 700 }}>
                Thanh toán thành công
              </p>
            ) : (
              <p>Mở ứng dụng ngân hàng và quét mã để thanh toán</p>
            )}

            <div className="payment-qr-box-custom">
              {loading ? (
                <div className="payment-loading-custom">
                  <div className="spinner-custom"></div>
                  <p>Đang tạo QR...</p>
                </div>
              ) : error ? (
                <div className="payment-error-custom">
                  <p>{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="retry-btn-custom"
                  >
                    Thử lại
                  </button>
                </div>
              ) : paymentStatus === "paid" ? (
                <div className="payment-success-custom">
                  <h2>✅ Đã thanh toán</h2>
                  <p>Đơn thanh toán #{orderCode} đã được xác nhận.</p>
                </div>
              ) : qr ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
                    qr
                  )}`}
                  alt="QR PayOS"
                  className="payment-qr-image-custom"
                />
              ) : checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="payment-link-custom"
                >
                  Mở trang thanh toán
                </a>
              ) : (
                <div className="payment-error-custom">
                  <p>Không lấy được mã thanh toán.</p>
                </div>
              )}
            </div>

            <div className="payment-note-custom">
              <span>ⓘ</span>
              <p>
                Sau khi thanh toán thành công, hệ thống sẽ tự đổi trạng thái sang
                đã thanh toán và chuyển trang.
              </p>
            </div>
          </div>

          <div className="payment-right-custom">
            <h3>THÔNG TIN GIAO DỊCH</h3>

            <div className="payment-info-item-custom">
              <span>TRẠNG THÁI</span>
              <div className="payment-box-line-custom">
                <strong>
                  {paymentStatus === "paid"
                    ? "Đã thanh toán"
                    : paymentStatus === "cancelled"
                    ? "Đã hủy"
                    : paymentStatus === "failed"
                    ? "Thất bại"
                    : "Chưa thanh toán"}
                </strong>
              </div>
            </div>

            <div className="payment-info-item-custom">
              <span>MÃ ĐƠN</span>
              <div className="payment-box-line-custom">
                <strong>{orderCode || "Đang tạo..."}</strong>
              </div>
            </div>

            <div className="payment-info-item-custom">
              <span>NGƯỜI THỤ HƯỞNG</span>
              <strong>
                {bankInfo?.accountName || "CÔNG TY TNHH LUMINOUS GUIDE"}
              </strong>
            </div>

            <div className="payment-info-item-custom">
              <span>NGÂN HÀNG</span>
              <div className="payment-box-line-custom">
                <strong>{bankInfo?.bankName || "MB BANK (MBBANK)"}</strong>
              </div>
            </div>

            <div className="payment-info-item-custom">
              <span>SỐ TÀI KHOẢN</span>
              <div className="payment-box-line-custom">
                <strong>{bankInfo?.accountNumber || "0934920019"}</strong>
              </div>
            </div>

            <div className="payment-info-item-custom">
              <span>HƯỚNG DẪN VIÊN</span>
              <div className="payment-box-line-custom">
                <strong>{guide?.hoTen || "Chưa có dữ liệu"}</strong>
              </div>
            </div>

            <div className="payment-info-item-custom">
              <span>SỐ TIỀN</span>
              <div className="payment-box-line-custom">
                <strong>{formatPrice(guide?.giaThue)}</strong>
              </div>
            </div>

            <div className="payment-info-item-custom">
              <span>ĐỊA ĐIỂM</span>
              <div className="payment-box-line-custom">
                <strong>
                  {guide?.diaDiemDuocChon?.tenDiaDiem || "Chưa có dữ liệu"}
                </strong>
              </div>
            </div>

            <div className="payment-info-item-custom">
              <span>KHU VỰC</span>
              <div className="payment-box-line-custom">
                <strong>
                  {guide?.diaDiemDuocChon?.khuVuc || "Chưa cập nhật"}
                </strong>
              </div>
            </div>

            <div className="payment-info-item-custom">
              <span>NỘI DUNG CHUYỂN KHOẢN</span>
              <div className="payment-box-line-custom">
                <strong>THUEHDV</strong>
              </div>
            </div>

            {checkoutUrl && paymentStatus !== "paid" && (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="payment-link-custom"
              >
                GẶP SỰ CỐ? THANH TOÁN Ở ĐÂY
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentThanhToan;