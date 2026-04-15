import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ContentThanhToan = () => {
  const navigate = useNavigate();
  const [bankInfo, setBankInfo] = useState(null);
  const [guide, setGuide] = useState(null);
  const [qr, setQr] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("selectedGuide"));

    if (data) {
      setGuide(data);

      const fetchPayment = async () => {
        try {
          setLoading(true);
          setError("");

          const response = await fetch("http://localhost:5000/payment/create-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: Number(data.giaThue) || 1000000,
              guideName: data.hoTen || "",
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Không thể tạo mã thanh toán");
          }

          setQr(result.qrCode || "");
          setCheckoutUrl(result.checkoutUrl || "");
          setBankInfo(result.bankInfo || null);
        } catch (err) {
          console.error("Lỗi frontend payment:", err);
          setError(err.message || "Có lỗi xảy ra khi tạo mã QR");
        } finally {
          setLoading(false);
        }
      };

      fetchPayment();
    } else {
      setLoading(false);
      setError("Không tìm thấy thông tin hướng dẫn viên đã chọn");
    }
  }, []);

  const formatPrice = (price) => {
    if (!price && price !== 0) return "1.200.000đ";
    return `${Number(price).toLocaleString("vi-VN")}đ`;
  };

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

            <h1>Thanh toán vé khám phá</h1>
            <p>Mở ứng dụng ngân hàng và quét mã để thanh toán</p>

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
              ) : qr ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qr)}`}
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
              <p>Vui lòng quét mã QR bằng ứng dụng ngân hàng để thực hiện thanh toán.</p>
            </div>
          </div>

          <div className="payment-right-custom">
            <h3>THÔNG TIN GIAO DỊCH</h3>

            <div className="payment-info-item-custom">
              <span>NGƯỜI THỤ HƯỞNG</span>
              <strong>{bankInfo?.accountName || "CÔNG TY TNHH LUMINOUS GUIDE"}</strong>
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
                <strong>{guide?.diaDiemDuocChon?.tenDiaDiem || "Chưa có dữ liệu"}</strong>
              </div>
            </div>

            <div className="payment-info-item-custom">
              <span>KHU VỰC</span>
              <div className="payment-box-line-custom">
                <strong>{guide?.diaDiemDuocChon?.khuVuc || "Chưa cập nhật"}</strong>
              </div>
            </div>

            <div className="payment-info-item-custom">
              <span>NỘI DUNG CHUYỂN KHOẢN</span>
              <div className="payment-box-line-custom">
                <strong>THUEHDV</strong>
              </div>
            </div>

            {checkoutUrl && (
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