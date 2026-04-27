import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderKhamPha = ({ user }) => { // 1. Nhận user từ props
  const navigate = useNavigate();

  return (
    <div className="header-home">
      <div className="logo-group-header">
        <img src="/img/logo.jpeg" className="logo-trangchu-header" alt="Logo" />
        <span className="brand-name-header">Backpacking VietNam</span>
      </div>

      <div className="nav-header">
        <a href="/">Trang Chủ</a>
        <a href="/khampha" className="btntrangchu-header" >Khám Phá</a>
        <a href="/Huongdanvien">Hướng Dẫn Viên</a>
      </div>

      <div className="actions-trangchu-header">
        {/* 2. Kiểm tra nếu có user thì hiện tên, không thì hiện nút đăng nhập */}
        {user ? (
          <div className="user-info-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Chào, {user.hoTen}</span>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="btn-outline-header"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <>
            <a href="/dangnhap" className="btn-outline-header">Đăng Nhập</a>
            <a href="/dangki" className="btn-primary-header">Tham Gia</a>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderKhamPha;