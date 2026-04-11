import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  reload
} from "firebase/auth";
import { auth } from "../../firebase";

const ContentDangki = () => {
  const [step, setStep] = useState("register");
  const [serverError, setServerError] = useState("");
  const [emailPreview, setEmailPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/js/validator.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Validator) {
        window.Validator({
          form: "#form-1",
          errorSelector: ".form-message",
          rules: [
            window.Validator.isRequired("#fullname"),
            window.Validator.isMinLength("#fullname", 6),
            window.Validator.isRequired("#email"),
            window.Validator.isEmail("#email") ,
            window.Validator.isRequired("#register-v2-password"),
            window.Validator.isRequired("#ngaysinh"),
            window.Validator.isMinLength("#register-v2-password", 6),
            window.Validator.isRequired("#register-v2-confirm-password"),
            window.Validator.isNLPassword(
              "#register-v2-confirm-password",
              function () {
                return document.querySelector("#form-1 #register-v2-password").value;
              }
            ),
          ].filter(Boolean),
          onSubmit: async function (data) {
            try {
              setLoading(true);
              setServerError("");

              const email = (data.email || "").trim().toLowerCase();

              const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                data.passWord
              );

              const actionCodeSettings = {
                // đổi đúng domain frontend của bạn
                url: `http://localhost:5173/xac-nhan-email`,
                handleCodeInApp: true,
              };

              await sendEmailVerification(
                userCredential.user,
                actionCodeSettings
              );

              localStorage.setItem(
                "pendingRegisterData",
                JSON.stringify({
                  ...data,
                  email,
                })
              );

              setEmailPreview(email);
              setStep("verify-email");

              toast.success("Đã gửi email xác nhận. Hãy kiểm tra hộp thư.");
            } catch (error) {
              console.error(error);

              if (error.code === "auth/email-already-in-use") {
                setServerError("Email này đã được sử dụng");
              } else if (error.code === "auth/invalid-email") {
                setServerError("Email không hợp lệ");
              } else if (error.code === "auth/weak-password") {
                toast.error("Mật khẩu quá yếu");
              } else {
                toast.error("Không thể gửi email xác nhận");
              }
            } finally {
              setLoading(false);
            }
          },
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckVerifiedEmail = async () => {
    try {
      setCheckingEmail(true);

      const user = auth.currentUser;
      if (!user) {
        toast.error("Không tìm thấy phiên xác thực email");
        return;
      }

      await reload(user);

      if (!user.emailVerified) {
        toast.error("Email vẫn chưa được xác nhận");
        return;
      }

      const data = JSON.parse(localStorage.getItem("pendingRegisterData") || "{}");

      if (!data.email) {
        toast.error("Không tìm thấy dữ liệu đăng ký");
        setStep("register");
        return;
      }

      const registerRes = await fetch("http://localhost:5000/login/dangky", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const registerResult = await registerRes.json();

      if (!registerRes.ok) {
        if (registerResult.field === "email") {
          setServerError(registerResult.message);
          setStep("register");
        } else {
          toast.error(registerResult.message || "Đăng ký thất bại");
        }
        return;
      }

      localStorage.removeItem("pendingRegisterData");
      toast.success("Xác nhận email thành công! Đăng ký hoàn tất.");

      setTimeout(() => {
        navigate("/dangnhap");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Không thể kiểm tra xác nhận email");
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        toast.error("Không tìm thấy tài khoản Firebase hiện tại");
        return;
      }

      const actionCodeSettings = {
        url: `http://localhost:5173/xac-nhan-email?email=${encodeURIComponent(user.email || "")}`,
        handleCodeInApp: false,
      };

      await sendEmailVerification(user, actionCodeSettings);
      toast.success("Đã gửi lại email xác nhận");
    } catch (error) {
      console.error(error);
      toast.error("Không thể gửi lại email xác nhận");
    }
  };

  return (
    <div className="content-dangki">
      {step === "register" ? (
        <form id="form-1" method="POST" className="form-dangki">
          <div className="header-contentdangki">
            <h2>Đăng ký tài khoản</h2>
            <p>Bắt đầu hành trình khám phá Việt Nam cùng chúng tôi</p>
          </div>

          <div className="content-contentdangki">
            <div className="group-contentdangki">
              <label>Họ Và Tên</label>
              <div className="congroup-contentdangki">
                <img className="imguser-contentdangki" src="/img/user.png" alt="" />
                <input id="fullname" name="hoTen" placeholder="Nguyễn Văn A" type="text" />
                <span className="form-message"></span>
              </div>
            </div>

            <div className="group2-contentdangki">
              <div className="group-contentdangki">
                <label>Ngày sinh</label>
                <div className="congroup2-contentdangki">
                  <img className="imguser-contentdangki" src="/img/calendar.png" alt="" />
                  <input id="ngaysinh" name="ngaysinh" type="date" />
                  <span className="form-message"></span>
                </div>
              </div>

              <div className="group-contentdangki">
                <label>Email</label>
                <div className="congroup2-contentdangki">
                  <img className="imguser-contentdangki" src="/img/mail.png" alt="" />
                  <input
                    id="email"
                    name="email"
                    placeholder="example@gmail.com"
                    type="email"
                  />
                  <span className="form-message">{serverError}</span>
                </div>
              </div>
            </div>

            <div className="group-contentdangki">
              <label>Mật Khẩu</label>
              <div className="congroup-contentdangki">
                <img className="imguser-contentdangki" src="/img/locked-computer.png" alt="" />
                <input
                  id="register-v2-password"
                  name="passWord"
                  placeholder="******"
                  type="password"
                />
                <span className="form-message"></span>
              </div>
            </div>

            <div className="group-contentdangki">
              <label>Nhập lại mật khẩu</label>
              <div className="congroup-contentdangki">
                <img className="imguser-contentdangki" src="/img/locked-computer.png" alt="" />
                <input
                  name="confirmPassword"
                  id="register-v2-confirm-password"
                  placeholder="******"
                  type="password"
                />
                <span className="form-message"></span>
              </div>
            </div>

            <button
              type="submit"
              className="dangkyngay-contentdangki"
              disabled={loading}
            >
              {loading ? "Đang gửi email xác nhận..." : "Đăng ký ngay"}
            </button>
          </div>

          <div className="footer-contentdangki">
            <p>Đã có tài khoản?</p> <a href="/dangnhap">Đăng nhập ngay</a>
          </div>
        </form>
      ) : (
        <div className="otp-wrapper-dangki">
          <div className="form-dangki">
            <div className="otp-icon-dangki">✉️</div>

            <h2>XÁC NHẬN EMAIL</h2>
            <p className="subtitle-dangki">
              Chúng tôi đã gửi email xác nhận đến <br />
              <b>{emailPreview}</b>
            </p>

            <div style={{ marginTop: 20, marginBottom: 20, lineHeight: 1.7 }}>
              <p>1. Mở email của bạn</p>
              <p>2. Xem các hộp thư bên trong nếu không thấy bạn có thể và thư rác để kiểm tra</p>
              <p>3. Bấm vào link xác nhận</p>
              <p>4. Nếu đã bấm link, quay lại đây và nhấn nút bên dưới</p>
            </div>

            <button
              onClick={handleCheckVerifiedEmail}
              className="btn-main-contentdangki"
              disabled={checkingEmail}
            >
              {checkingEmail ? "Đang kiểm tra..." : "TÔI ĐÃ XÁC NHẬN EMAIL"}
            </button>

            <p className="resend1-dangki" style={{ marginTop: 20 }}>
              Bạn chưa nhận được email?
            </p>
            <p className="resend-dangki">
              <span onClick={handleResendEmail} style={{ cursor: "pointer" }}>
                Gửi lại email xác nhận
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDangki;