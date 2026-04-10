import React from "react";

const HeaderTaikhoan = () => {
  return (
    <div className="header-taikhoan">

      {/* LEFT */}
      <div className="logo-group-taikhoan">
        <img src="/img/logo.png" className="logo-taikhoan" />
        <span className="brand">Backpacking VietNam</span>
      </div>

      {/* CENTER */}
      <div className="nav-taikhoan">
        <span className="active-taikhoan">Trang Chủ</span>
        <span>Khám Phá</span>
        <span>Hướng Dẫn Viên</span>
      </div>

      {/* RIGHT */}
      <div className="user-menu-taikhoan">

        <div className="user-info-taikhoan">
          <div className="avatar-taikhoan">QT</div>
          <span>Quốc Thanh</span>
          <span className="arrow-taikhoan"></span>
        </div>

        {/* DROPDOWN */}
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