import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ContentDangnhap = () => {
     const navigate = useNavigate();
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/js/validator.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.Validator) {
                window.Validator({
                    form: '#form-2',
                    errorSelector: '.form-message',
                    rules: [
                        window.Validator.isRequired("#email"),
                        window.Validator.isEmail("#email") ,
                        window.Validator.isRequired('#login-v2-password'),
                        window.Validator.isMinLength('#login-v2-password', 6),
                    ],
                    onSubmit: async function (data) {
                        // Call API
                        try {
                            const response = await fetch("http://localhost:5000/login/dangnhap", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(data)
                            });

                            const result = await response.json();

                            if (!response.ok) {
                                toast.error(result.message);
                                return;
                            }

                            toast.success("Đăng nhập thành công!");
                            localStorage.setItem("user", JSON.stringify(result.user));

                            // Nhận vai trò từ backend
                            const role = result.user.vaiTro;
                            const slug = result.user.slug;  

                            setTimeout(() => {
                                if (role === "nguoiDung") {
                                    navigate(`/user/${slug}`);
                                 } 
                                //else if (role === "doanhNghiep") {
                                //     navigate(`/ManageBookings/${slug}`);
                                // } else if (role === "quanTriVien") {
                                //     navigate(`/admin/${slug}/accounts`);
                                // } 
                                else {
                                    toast.error("Vai trò không hợp lệ!");
                                }
                            }, 1000);

                        } catch (error) {
                            toast.error("Lỗi kết nối server!");
                        }
                    }
                });
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);
  return (
    <div className="content-dangnhap">
      <div>
        <form id="form-2" className="form-dangnhap">
          <h2>Đăng nhập tài khoản</h2>
          <p className="subtitle-dangnhap">
            Chào mừng bạn quay trở lại với hành trình
          </p>

          <div className="content-contentdangnhap">
            {/* SĐT */}
            <label>SỐ ĐIỆN THOẠI</label>
            <div className="input-group-dangnhap">
             <img className="img-dangnhap" src="/img/mail.png" alt="" />
              <input  id="email" name="email" type="email" placeholder="Nhập email" />
              <span className="form-message"></span>
            </div>

            {/* PASSWORD */}
            <div className="password-row-dangnhap">
              <label>MẬT KHẨU</label>
              <span className="forgot-dangnhap">Quên mật khẩu?</span>
            </div>

            <div className="input-group-dangnhap">
               <img className="img-dangnhap" src="/img/locked-computer.png" alt="" />
              <input  name="passWord" className="login-v2-input" type="password" id="login-v2-password" placeholder="Nhập mật khẩu" />
              <span className="form-message"></span>
            </div>

            <button  type="submit" className="btn-main-dangnhap">ĐĂNG NHẬP NGAY</button>
          </div>

          <p className="login-link-dangnhap">
            Chưa có tài khoản? <span  onClick={() => navigate("/dangki")}>Đăng ký ngay</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ContentDangnhap;