import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MapPin,
  BarChart3,
  Bell,
  Mountain,
  ClipboardList,
  LogOut
} from 'lucide-react';

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/dangnhap');
  };

  const menuItems = [
    {
      to: `/admin/${slug}`,
      icon: <LayoutDashboard size={20} />,
      label: 'Thống kê',
      end: true,
    },
    {
      to: `/admin/${slug}/thongkenguoidung`,
      icon: <Users size={20} />,
      label: 'Tài khoản',
    },
    {
      to: `/admin/${slug}/duyetdiadiem`,
      icon: <MapPin size={20} />,
      label: 'Duyệt địa điểm',
    },
    {
      to: `/admin/${slug}/quanlybaocao`,
      icon: <BarChart3 size={20} />,
      label: 'Báo cáo',
    },
    {
      to: `/admin/${slug}/thongbaohethong`,
      icon: <Bell size={20} />,
      label: 'Thông báo hệ thống',
    },
    {
      to: `/admin/${slug}/quanlydiadiem`,
      icon: <Mountain size={20} />,
      label: 'Quản lý địa điểm',
    },
    {
      to: `/admin/${slug}/dondangky`,
      icon: <ClipboardList size={20} />,
      label: 'Đơn đăng ký',
    },
    {
      to: `/admin/${slug}/checkin`,
      icon: <MapPin size={20} />,
      label: 'Check-in / Check-out',
    }
  ];

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
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            end={item.end || false}
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.label}</span>
          </NavLink>
        ))}
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