import React, { useEffect, useState } from 'react';
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";




const ContentDangki = () => {
  const [step, setStep] = useState("register"); // register | otp
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
 useEffect(() => {
       
        const script = document.createElement("script");
        script.src = "/js/validator.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.Validator) {
                window.Validator({
                    form: '#form-1',
                    errorSelector: '.form-message',
                    rules: [
                        window.Validator.isRequired('#fullname'),
                        window.Validator.isMinLength('#fullname', 6),
                        window.Validator.isRequired('#register-v2-password'),
                        window.Validator.isRequired('#ngaysinh'),
                        window.Validator.isRequired('#SDT'),
                         window.Validator.isMinLength('#SDT',10),
                        window.Validator.isMinLength('#register-v2-password', 6),
                        window.Validator.isRequired('#register-v2-confirm-password'),
                        window.Validator.isNLPassword('#register-v2-confirm-password', function () {
                            return document.querySelector('#form-1 #register-v2-password').value;
                        }),
                    ],
                    onSubmit: async function (data) {
                        // Call API
                       try {
                        setServerError("");
                          // tạo OTP giả
                          const fakeOTP = "123456"; // hoặc Math.random()

                          // lưu OTP
                          localStorage.setItem("fakeOTP", fakeOTP);

                          // lưu form
                          localStorage.setItem("formData", JSON.stringify(data));

                          console.log("OTP của bạn là:", fakeOTP); // xem trong console

                          setStep("otp");

                        } catch (error) {
                          console.error(error);
                          alert("Không gửi được OTP");
                        }
                    }
                });
            }
        };
       
        return () => {
            document.body.removeChild(script);
        };
    }, []);
          const handleVerifyOTP = async () => {
          
            const inputs = document.querySelectorAll(".otp-box-dangki input");
            let otp = "";
            inputs.forEach(i => otp += i.value);

            const savedOTP = localStorage.getItem("fakeOTP");

            if (otp === savedOTP) {
              try {
                const data = JSON.parse(localStorage.getItem("formData"));

                await fetch("http://localhost:5000/login/dangky", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });

               toast.success("Đăng ký thành công!");
              setTimeout(() => {
              navigate("/dangnhap");
              }, 1500);

              } catch (err) {
                console.error(err);
              }
            } else {
              alert("OTP sai!");
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
              <div id="recaptcha-container"></div>
             <div className="group-contentdangki">
               <label > Họ Và Tên</label>
            <div className="congroup-contentdangki">
              <img className="imguser-contentdangki" src="/public/img/user.png" alt="" />
              <input id="fullname" name="hoTen" placeholder="Nguyễn Văn A" type="text" />
                 <span className="form-message"></span>
            </div>   
            
             </div>
              <div className="group2-contentdangki">

              {/* NGÀY SINH */}
              <div className="group-contentdangki">
              <label>Ngày sinh</label>
              <div  className="congroup2-contentdangki">
              <img
              className="imguser-contentdangki"
              src="/img/calendar.png"
              alt=""
              />
              <input id="ngaysinh" name="ngaysinh" type="date" />
              <span className="form-message"></span>
              </div>
             
              </div>

              {/* SỐ ĐIỆN THOẠI */}
              <div className="group-contentdangki">
              <label>Số điện thoại</label>
              <div  className="congroup2-contentdangki">
              <img
              className="imguser-contentdangki"
              src="/img/telephone.png"
              alt=""
              />
              <input id='SDT' name="soDienThoai" placeholder="0901 234 567" type="text" />
             <span className="form-message"></span>
              </div>
              
              </div>

              </div>
               <div className="group-contentdangki">
               <label > Mật Khẩu</label>
            <div className="congroup-contentdangki">
              <img className="imguser-contentdangki" src="/public/img/locked-computer.png" alt="" />
              <input id="register-v2-password"  name="passWord" placeholder="******" type="text" />
               <span className="form-message"></span>
            </div>   
             </div>
               <div className="group-contentdangki">
               <label > Nhập lại mật khẩu</label>
            <div className="congroup-contentdangki">
              <img className="imguser-contentdangki" src="/public/img/locked-computer.png" alt="" />
              <input  name="confirmPassword" id="register-v2-confirm-password" placeholder="******" type="text" />
               <span className="form-message"></span>
            </div>   
             </div>
             <button  type="submit" className="dangkyngay-contentdangki">Đăng ký ngay</button>
          </div>
          <div className="footer-contentdangki">
             <p>Đã có tài khoản?</p> <a href="">Đăng nhập ngay</a>
          </div>
        </form>
        
      ) : (
        <div className="otp-wrapper-dangki">
    <div className="form-dangki">
      
      {/* ICON */}
      <div className="otp-icon-dangki">📱</div>

      <h2>XÁC THỰC OTP</h2>
      <p className="subtitle-dangki">
        Mã xác thực đã được gửi đến <br />
        <b>+84 392 *** 789</b>
      </p>

      {/* INPUT OTP */}
      <div className="otp-box-dangki">
        <input maxLength="1" />
        <input maxLength="1" />
        <input maxLength="1" />
        <input maxLength="1" />
        <input maxLength="1" />
        <input maxLength="1" />
      </div>

      {/* BUTTON */}
      <button onClick={handleVerifyOTP} className="btn-main-contentdangki">
        XÁC NHẬN →
      </button>

      {/* COUNTDOWN */}
      <div className="countdown-dangki">
        <span>00</span> : <span>52</span>
      </div>

      <p className="resend1-dangki">
        Bạn không nhận được mã?
      </p>
      <p className="resend-dangki"> <span>Gửi lại mã ngay</span>
      </p>
    </div>
  </div>
      )}
    </div>
  );
};

export default ContentDangki;