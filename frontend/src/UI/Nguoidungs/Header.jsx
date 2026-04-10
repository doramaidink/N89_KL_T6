import React from "react";

const Header = () => {
  return (

    <div className="header-home">

      {/* LEFT */}
      <div className="logo-group-header">
        <img src="/img/logo.png" className="logo-trangchu-header" />
        <span className="brand-name-header">Backpacking VietNam</span>
      </div>

      {/* CENTER */}
      <div className="nav-header">
        <span className="btntrangchu-header">Trang Chủ</span>
        <span className="btnkhampha-header" >Khám Phá</span>
        <span>Hướng Dẫn Viên</span>
      </div>

      {/* RIGHT */}
      <div className="actions-trangchu-header">
       <a href="/dangnhap" className="btn-outline-header">Đăng Nhập</a>
        <a href="/dangki"className="btn-primary-header">Tham Gia</a>
      </div>

    </div>
  );
};

export default Header;