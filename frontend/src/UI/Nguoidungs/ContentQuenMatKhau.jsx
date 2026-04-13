import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ContentQuenMatKhau = () => {
  const [step, setStep] = useState("enter-email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendReset = async () => {
    try {
      if (!email.trim()) {
        toast.error("Vui lòng nhập email");
        return;
      }

      setLoading(true);

      const response = await fetch("http://localhost:5000/login/quen-mat-khau", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Không thể gửi email");
        return;
      }

      toast.success(result.message);
      setStep("email-sent");
    } catch (error) {
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-quenmatkhau">
      {step === "enter-email" ? (
        <div className="form-quenmatkhau">
          <h2>Quên mật khẩu</h2>
          <p className="subtitle-dangnhap">Hãy xác nhận lại email để đổi mật khẩu</p>

          <div className="content-contentdangnhap">
            <label>Email</label>
            <div className="input-group-dangnhap">
              <img className="img-dangnhap" src="/img/mail.png" alt="" />
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn-main-dangnhap"
              onClick={handleSendReset}
              disabled={loading}
            >
              {loading ? "ĐANG GỬI..." : "XÁC NHẬN"}
            </button>
          </div>

          <p className="login-link-dangnhap">
            Chưa có tài khoản? <span onClick={() => navigate("/dangki")}>Đăng ký ngay</span>
          </p>
        </div>
      ) : (
        <div className="form-xacnhanemail">
          <div className="otp-icon-dangki">✉️</div>

          <h2>XÁC NHẬN EMAIL</h2>
          <p className="subtitle-dangki">
            Chúng tôi đã gửi email xác nhận đến <br />
            <b>{email}</b>
          </p>

          <div style={{ marginTop: 20, marginBottom: 20, lineHeight: 1.7 }}>
            <p>1. Mở email của bạn</p>
            <p>2. Xem cả hộp thư đến và thư rác để kiểm tra</p>
            <p>3. Bấm vào link xác nhận trong email</p>
            <p>4. Sau đó bạn sẽ được chuyển sang màn hình đổi mật khẩu</p>
          </div>

          <button
            onClick={() => navigate("/dangnhap")}
            className="btn-main-contentdangki"
          >
            QUAY VỀ ĐĂNG NHẬP
          </button>

          <p className="resend1-dangki" style={{ marginTop: 20 }}>
            Bạn chưa nhận được email?
          </p>
          <p className="resend-dangki">
            <span onClick={handleSendReset} style={{ cursor: "pointer" }}>
              Gửi lại email xác nhận
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentQuenMatKhau;