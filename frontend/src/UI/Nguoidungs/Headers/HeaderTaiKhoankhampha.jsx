import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderTaikhoanKhamPha = ({ user }) => {
  const navigate = useNavigate();
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
  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/uploads") || image.startsWith("/img")) {
      return `http://localhost:5000${image}`;
    }
    if (image.startsWith("/")) return image;
    return `http://localhost:5000/${image}`;
  };

  const goTrangChuUser = () => {
    navigate(`/${encodeURIComponent(hoTen)}`);
  };

  return (
    <div className="header-taikhoan">
      <div
        className="logo-group-taikhoan"
        onClick={goTrangChuUser}
        style={{ cursor: "pointer" }}
      >
        <img src="/img/logo.jpeg" className="logo-taikhoan" alt="logo" />
        <span className="brand">Backpacking VietNam</span>
      </div>

      <div className="nav-taikhoan">
        <span
          onClick={goTrangChuUser}
          style={{ cursor: "pointer" }}
        >
          Trang Chủ
        </span>

        <span
          className="active-taikhoan"
          onClick={() => navigate(`/${encodeURIComponent(hoTen)}/khamphauser`)}
          style={{ cursor: "pointer" }}
        >
          Khám Phá
        </span>

        <span
          onClick={() => navigate(`/${encodeURIComponent(hoTen)}/huongdanvienuser`)}
          style={{ cursor: "pointer" }}
        >
          Hướng Dẫn Viên
        </span>
      </div>

      <div className="user-menu-taikhoan">
        <div className="user-info-taikhoan">
          <div className="avatar-taikhoan">
            {user?.image ? (
              <img
                src={getImageUrl(user.image)}
                alt={hoTen}
                className="avatar-img-header"
              />
            ) : (
              <span>{getAvatarText(hoTen)}</span>
            )}
          </div>
          <span>{hoTen}</span>
          <span className="arrow-taikhoan"></span>
        </div>

        <div className="dropdown-taikhoan">
          <div><a href="/dangkihuongdanvien">Đăng ký làm đối tác</a></div>
          <div><a href="/thongtintaikhoan">Quản lý tài khoản</a></div>
            <div onClick={() => navigate(`/${encodeURIComponent(hoTen)}/baocao`)}> Báo cáo</div>
          <div><a href="/nhom">Group của tôi</a></div>
          <div><a href="/#">Đăng Xuất</a></div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTaikhoanKhamPha;