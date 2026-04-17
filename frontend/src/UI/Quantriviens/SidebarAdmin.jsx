import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, BarChart3, Bell, Mountain, ClipboardList, LogOut } from 'lucide-react';

const SidebarAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo-square">
          <Mountain size={18} color="#064e3b" fill="#064e3b" /> 
        </div>
        <div className="brand-text-group">
          <h1 className="brand-main-title">Hệ thống Quản trị</h1>
          <p className="brand-sub-title">LUMINOUS PATH ADMIN</p>
        </div>
      </div>

    
      <nav className="sidebar-nav">
        <NavLink to="/thongke" className="nav-item">
          <LayoutDashboard size={20} /> <span>Thống kê</span>
        </NavLink>

        <NavLink to="/thongkenguoidung" className="nav-item">
          <Users size={20} /> <span>Tài khoản</span>
        </NavLink>

        <NavLink to="/duyetdiadiem" className="nav-item">
          <MapPin size={20} /> <span>Duyệt địa điểm</span>
        </NavLink>

        <NavLink to="/quanlybaocao" className="nav-item">
          <BarChart3 size={20} /> <span>Báo cáo</span>
        </NavLink>

        <NavLink to="/thongbaohethong" className="nav-item">
          <Bell size={20} /> <span>Thông báo</span>
        </NavLink>

        <NavLink to="/quanlydiadiem" className="nav-item">
          <Mountain size={20} /> <span>Quản lý địa điểm</span>
        </NavLink>

        <NavLink to="/dondangky" className="nav-item">
          <ClipboardList size={20} /> <span>Đơn đăng ký</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAdmin;