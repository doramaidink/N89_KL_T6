import React from "react";

const HeaderKhamPha = () => {
  return (

    <div className="header-home">

      {/* LEFT */}
      <div className="logo-group-header">
        <img src="public/img/logo.jpeg" className="logo-trangchu-header" />
        <span className="brand-name-header">Backpacking VietNam</span>
      </div>

      {/* CENTER */}
      <div className="nav-header">
        <a href="/" className="btntrangchu-headerkhampha">Trang Chủ</a>
        <a href="/khampha" className="btnkhampha-headerkhampha" >Khám Phá</a>
        <a href="/Huongdanvien" >Hướng Dẫn Viên</a>
      </div>

      {/* RIGHT */}
      <div className="actions-trangchu-header">
       <a href="/dangnhap" className="btn-outline-header">Đăng Nhập</a>
        <a href="/dangki"className="btn-primary-header">Tham Gia</a>
      </div>

    </div>
  );
};

export default HeaderKhamPha;