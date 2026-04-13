import React from "react";

const HeaderTaikhoan = ({ user }) => {
  const hoTen = user?.hoTen || "Người dùng";

  const getAvatarText = (name) => {
    if (!name) return "ND";
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (
      (words[0][0] || "") + (words[words.length - 1][0] || "")
    ).toUpperCase();
  };

  return (
    <div className="header-taikhoan">
      <div className="logo-group-taikhoan">
        <img src="/img/logo.jpeg" className="logo-taikhoan" alt="logo" />
        <span className="brand">Backpacking VietNam</span>
      </div>

      <div className="nav-taikhoan">
        <span className="active-taikhoan">Trang Chủ</span>
        <span>Khám Phá</span>
        <span>Hướng Dẫn Viên</span>
      </div>

      <div className="user-menu-taikhoan">
        <div className="user-info-taikhoan">
          <div className="avatar-taikhoan">{getAvatarText(hoTen)}</div>
          <span>{hoTen}</span>
          <span className="arrow-taikhoan"></span>
        </div>

        <div className="dropdown-taikhoan">
          <div><a href="/dangkihuongdanvien">Đăng ký làm đối tác</a></div>
          <div><a href="/thongtintaikhoan">Quản lý tài khoản</a></div>
          <div><a href="/baocao">Báo cáo</a></div>
          <div><a href="/nhom">Group của tôi</a></div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTaikhoan;