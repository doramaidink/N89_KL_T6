import React from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { LayoutDashboard, User, MapPinPlus, Users, HelpCircle, LogOut } from "lucide-react";

const SidebarDoitac = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/dangnhap");
  };

  return (
    <div className="sidebar-doitac">
      <div className="sidebar-doitac-name">
        <h4>Cổng đối tác</h4>
      </div>

      <nav className="sidebar-doitac-menu">
        <NavLink to={`/doitac/${slug}`} end className={({ isActive }) => isActive ? "menu-doitac active" : "menu-doitac"}>
          <span className="menu-doitac-icon"><LayoutDashboard size={20} /></span>
          <span className="menu-doitac-label">Bảng điều khiển</span>
        </NavLink>

        <NavLink to={`/doitac/${slug}/hoso`} className={({ isActive }) => isActive ? "menu-doitac active" : "menu-doitac"}>
          <span className="menu-doitac-icon"><User size={20} /></span>
          <span className="menu-doitac-label">Hồ sơ</span>
        </NavLink>

        <NavLink to={`/doitac/${slug}/themdiadiem`} className={({ isActive }) => isActive ? "menu-doitac active" : "menu-doitac"}>
          <span className="menu-doitac-icon"><MapPinPlus size={20} /></span>
          <span className="menu-doitac-label">Đăng tải địa điểm</span>
        </NavLink>

        <NavLink to={`/doitac/${slug}/loimoinhom`} className={({ isActive }) => isActive ? "menu-doitac active" : "menu-doitac"}>
          <span className="menu-doitac-icon"><Users size={20} /></span>
          <span className="menu-doitac-label">Lời mời nhóm</span>
        </NavLink>
      </nav>

      <div className="sidebar-doitac-footer">
        {/*
        <button className="doitac-footer-btn">
          <HelpCircle size={20} className="doitac-footer-icon"/>
          <span>Hỗ trợ</span>
        </button>
        */}
        <button className="doitac-footer-btn" onClick={handleLogout}>
          <LogOut size={20} className="doitac-footer-icon"/>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarDoitac;