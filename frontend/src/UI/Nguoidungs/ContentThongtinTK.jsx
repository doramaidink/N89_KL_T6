import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const API = "http://localhost:5000";

const ContentThongtinTK = ({ user, setUser }) => {
  const [thongTin, setThongTin] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hoTenMoi, setHoTenMoi] = useState("");
  const [matKhauXacNhanTen, setMatKhauXacNhanTen] = useState("");

  const [soDienThoai, setSoDienThoai] = useState("");

  const [matKhauHienTai, setMatKhauHienTai] = useState("");
  const [matKhauMoi, setMatKhauMoi] = useState("");
  const [xacNhanMatKhauMoi, setXacNhanMatKhauMoi] = useState("");
  const [dangTaiAvatar, setDangTaiAvatar] = useState(false);
  const uploadInputRef = useRef(null);

  const userId = user?.id || user?._id;

  const getImageSrc = (img) => {
    if (!img) return "/img/anhgioithieu.jpg";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads") || img.startsWith("/img")) {
      return `${API}${img}`;
    }
    return img;
  };

  const fetchThongTin = async () => {
    try {
      if (!userId) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/taikhoan/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Không tải được thông tin tài khoản");
        setLoading(false);
        return;
      }

      setThongTin(data.user);
      setHoTenMoi(data.user.hoTen || "");
      setSoDienThoai(data.user.soDienThoai || "");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThongTin();
  }, [userId]);

  const capNhatLocalUser = (newUser) => {
    const updatedUser = {
      ...user,
      ...newUser,
      id: newUser._id || newUser.id || user?.id,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleCapNhatHoTen = async () => {
    try {
      if (!hoTenMoi.trim()) {
        toast.warning("Vui lòng nhập họ tên");
        return;
      }

      if (!matKhauXacNhanTen.trim()) {
        toast.warning("Vui lòng nhập mật khẩu xác nhận");
        return;
      }

      const res = await fetch(`${API}/taikhoan/${userId}/hoten`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hoTen: hoTenMoi,
          matKhauXacNhanTen,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Không cập nhật được họ tên");
        return;
      }

      setThongTin(data.user);
      capNhatLocalUser(data.user);
      setMatKhauXacNhanTen("");
      toast.success("Cập nhật tên hiển thị thành công");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi kết nối server");
    }
  };

  const handleThemSoDienThoai = async () => {
    try {
      if (!soDienThoai.trim()) {
        toast.warning("Vui lòng nhập số điện thoại");
        return;
      }

      const res = await fetch(`${API}/taikhoan/${userId}/sodienthoai`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soDienThoai }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Không lưu được số điện thoại");
        return;
      }

      setThongTin(data.user);
      capNhatLocalUser(data.user);
      toast.success("Lưu số điện thoại thành công");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi kết nối server");
    }
  };

  const handleDoiMatKhau = async () => {
    try {
      if (!matKhauHienTai || !matKhauMoi || !xacNhanMatKhauMoi) {
        toast.warning("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      const res = await fetch(`${API}/taikhoan/${userId}/matkhau`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matKhauHienTai,
          matKhauMoi,
          xacNhanMatKhauMoi,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Không đổi được mật khẩu");
        return;
      }

      setMatKhauHienTai("");
      setMatKhauMoi("");
      setXacNhanMatKhauMoi("");
      toast.success("Đổi mật khẩu thành công");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi kết nối server");
    }
  };

  const handleChonAvatar = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.warning("Vui lòng chọn file ảnh");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.warning("Ảnh phải nhỏ hơn 5MB");
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);

      setDangTaiAvatar(true);

      const res = await fetch(`${API}/taikhoan/${userId}/avatar`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Không cập nhật được avatar");
        return;
      }

      setThongTin(data.user);
      capNhatLocalUser(data.user);
      toast.success("Cập nhật avatar thành công");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tải avatar");
    } finally {
      setDangTaiAvatar(false);
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  };

  const handleDangXuat = () => {
    localStorage.removeItem("user");
    window.location.href = "/dangnhap";
  };

  if (loading) {
    return <div className="taikhoan-container">Đang tải thông tin tài khoản...</div>;
  }

  if (!userId) {
    return <div className="taikhoan-container">Bạn chưa đăng nhập.</div>;
  }

  return (
    <div className="taikhoan-container">
      <div className="sidebar-taikhoan">
        <div className="profile-taikhoan">
          <div className="avatar-box-taikhoan">
            <img
              src={getImageSrc(thongTin?.image)}
              alt="avatar"
              className="avatar-img-taikhoan"
            />

            <button
              type="button"
              className="avatar-plus-btn"
              onClick={() => uploadInputRef.current?.click()}
              title="Thay đổi avatar"
            >
              +
            </button>
          </div>

          <div className="ten-taikhoan">
            <h4>{thongTin?.hoTen || "Người dùng"}</h4>
            <p>THÀNH VIÊN HẠNG VÀNG</p>
          </div>
        </div>

        <div className="menu-taikhoan">
          <div className="item-taikhoan active-taikhoan">Thông tin cá nhân</div>
          <div
            className="item-taikhoan"
            onClick={() => (window.location.href = "/thongbao")}
          >
            Thông báo
          </div>
          <div className="item-taikhoan">Lịch sử chuyến đi</div>
          <div className="item-taikhoan">Hóa đơn</div>
          <div className="item-taikhoan logout-taikhoan" onClick={handleDangXuat}>
            Đăng xuất
          </div>
        </div>
      </div>

      <div className="content-taikhoan">
        <div className="card-taikhoan">
          <div className="nhaptt-taikhoan">
            <img src="/img/doiten.png" alt="" />
            <h3>Đổi tên hiển thị</h3>
          </div>

          <input
            value={hoTenMoi}
            onChange={(e) => setHoTenMoi(e.target.value)}
            placeholder="Nhập họ tên mới"
          />
          <input
            type="password"
            value={matKhauXacNhanTen}
            onChange={(e) => setMatKhauXacNhanTen(e.target.value)}
            placeholder="Mật khẩu xác nhận"
          />

          <button className="btn-primary-taikhoan" onClick={handleCapNhatHoTen}>
            Cập nhật
          </button>
        </div>

        <div className="card-taikhoan">
          <div className="nhaptt-taikhoan">
            <img src="/img/dienthoai.png" alt="" />
            <h3>Thêm số điện thoại</h3>
          </div>

          <input
            value={soDienThoai}
            onChange={(e) => setSoDienThoai(e.target.value)}
            placeholder="Nhập số điện thoại"
          />

          <button className="btn-primary-taikhoan" onClick={handleThemSoDienThoai}>
            Lưu số điện thoại
          </button>
        </div>

        <div className="card-taikhoan">
          <div className="nhaptt-taikhoan">
            <img src="/img/baomat.png" alt="" />
            <h3>Thay đổi mật khẩu</h3>
          </div>

          <input
            type="password"
            value={matKhauHienTai}
            onChange={(e) => setMatKhauHienTai(e.target.value)}
            placeholder="Mật khẩu hiện tại"
          />
          <input
            type="password"
            value={matKhauMoi}
            onChange={(e) => setMatKhauMoi(e.target.value)}
            placeholder="Mật khẩu mới"
          />
          <input
            type="password"
            value={xacNhanMatKhauMoi}
            onChange={(e) => setXacNhanMatKhauMoi(e.target.value)}
            placeholder="Xác nhận mật khẩu mới"
          />

          <div className="row-taikhoan">
            <button className="btn-primary-taikhoan" onClick={handleDoiMatKhau}>
              Lưu thay đổi
            </button>
            <button
              className="btn-outline-taikhoan"
              onClick={() => {
                setMatKhauHienTai("");
                setMatKhauMoi("");
                setXacNhanMatKhauMoi("");
              }}
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>

      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChonAvatar}
      />
      {dangTaiAvatar && (
        <div className="avatar-uploading-inline">Đang tải ảnh...</div>
      )}

    </div>
  );
};

export default ContentThongtinTK;