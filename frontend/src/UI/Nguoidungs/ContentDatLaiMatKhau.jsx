import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const ContentDatLaiMatKhau = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/login/kiem-tra-reset-token?token=${token}`
        );
        const result = await response.json();

        if (!response.ok) {
          toast.error(result.message || "Link không hợp lệ");
          navigate("/quen-mat-khau");
          return;
        }
      } catch (error) {
        toast.error("Không thể kiểm tra token");
        navigate("/quen-mat-khau");
      } finally {
        setChecking(false);
      }
    };

    if (!token) {
      toast.error("Thiếu token đặt lại mật khẩu");
      navigate("/quen-mat-khau");
      return;
    }

    checkToken();
  }, [token, navigate]);

  const handleResetPassword = async () => {
    try {
      if (!newPassword || newPassword.length < 6) {
        toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Nhập lại mật khẩu không khớp");
        return;
      }

      setLoading(true);

      const response = await fetch("http://localhost:5000/login/dat-lai-mat-khau", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          newPassword
        })
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Không thể đổi mật khẩu");
        return;
      }

      toast.success("Đổi mật khẩu thành công!");
      setTimeout(() => {
        navigate("/dangnhap");
      }, 1200);
    } catch (error) {
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="content-dangki">Đang kiểm tra liên kết...</div>;
  }

  return (
    <div className="content-dangki">
      <div className="form-dangki">
        <h2>Đổi mật khẩu</h2>
        <p className="subtitle-dangnhap">Vui lòng nhập mật khẩu mới</p>

        <div className="content-contentdangnhap">
          <label>Nhập mật khẩu mới</label>
          <div className="input-group-dangnhap">
            <img className="img-dangnhap" src="/img/locked-computer.png" alt="" />
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <label>Nhập lại mật khẩu</label>
          <div className="input-group-dangnhap">
            <img className="img-dangnhap" src="/img/locked-computer.png" alt="" />
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn-main-dangnhap"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentDatLaiMatKhau;