import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Plus, Users, Handshake } from 'lucide-react';

const ContentThongKeNguoiDung = () => {
  const accountData = [
    { id: '#VN-10245', name: 'Nguyen Văn Lâm', email: 'vanlam.nguyen@gmail.com', type: 'NGƯỜI DÙNG', status: 'Hoạt động', date: '12/03/2024', avatar: 'NL' },
    { id: '#VN-10246', name: 'Hoi An Echo Tour', email: 'booking@hoianecho.com', type: 'ĐỐI TÁC', status: 'Hoạt động', date: '08/03/2024', avatar: 'HA' },
    { id: '#VN-10247', name: 'Trần Minh Hoàng', email: 'tmhoang99@hotmail.com', type: 'NGƯỜI DÙNG', status: 'Tạm khóa', date: '05/03/2024', avatar: 'TH' },
    { id: '#VN-10248', name: 'Phạm Thu Thảo', email: 'thao.pt@gmail.com', type: 'NGƯỜI DÙNG', status: 'Hoạt động', date: '01/03/2024', avatar: 'PT' },
  ];

  const chartData = [
    { m: 'Tháng 1', h: '40%' },
    { m: 'Tháng 2', h: '55%' },
    { m: 'Tháng 3', h: '45%' },
    { m: 'Tháng 4', h: '75%' },
    { m: 'Tháng 5', h: '65%' },
    { m: 'Hiện tại', h: '95%', active: true },
  ];

  return (
    <div className="user-stats-container">
      {/* 1. Dashboard Overview */}
      <div className="user-overview-grid">
        {/* Khối biểu đồ bên trái */}
        <div className="chart-main-card">
          <div className="chart-header-inline">
            <div className="title-group">
              <h3>Thống kê</h3>
              <p className="sub-text">Số lượng tài khoản mới đăng ký qua các tháng</p>
            </div>
            <div className="legend-item">
              <span className="dot-legend"></span>
              <span>Người dùng mới</span>
            </div>
          </div>
          
          <div className="user-bar-chart">
            {chartData.map((item, idx) => (
              <div key={idx} className="user-bar-group">
                <div className="bar-track">
                  <div 
                    className={`user-bar ${item.active ? 'active-bar' : ''}`} 
                    style={{ height: item.h }}
                  ></div>
                </div>
                <span className="bar-month">{item.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Khối 2 Card nhỏ bên phải */}
        <div className="side-stats-column">
          <div className="small-stat-card">
            <div className="card-top">
              <span className="card-label">TỔNG NGƯỜI DÙNG</span>
              <Users size={18} className="text-emerald" />
            </div>
            <div className="card-body">
              <h2 className="main-number">24,582</h2>
              <p className="trend-text">+12.5% <span className="zinc-text">so với tháng trước</span></p>
            </div>
          </div>

          <div className="small-stat-card">
            <div className="card-top">
              <span className="card-label">ĐỐI TÁC ĐANG HOẠT ĐỘNG</span>
              <Handshake size={18} className="text-emerald" />
            </div>
            <div className="card-body">
              <h2 className="main-number">842</h2>
              <p className="trend-text"> ⓘ  Đang cung cấp 1.2k dịch vụ </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Account List Section */}
      <div className="account-list-section">
        <div className="list-header">
          <h3>Danh sách tài khoản</h3>
          <div className="header-actions">
            <div className="tab-buttons">
              <button className="tab-btn active">Tất cả</button>
              <button className="tab-btn">Người dùng</button>
              <button className="tab-btn">Đối tác</button>
            </div>

            <NavLink to="/dangki" className="btn-create-acc">
            <button className="btn-create-acc">
              <Plus size={15} /> Tạo Tài khoản
            </button>
            </NavLink>
          </div>
        </div>

        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon-inner" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tài khoản theo tên hoặc email..." 
            className="user-search-input" 
          />
        </div>

        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>TÊN NGƯỜI DÙNG</th>
                <th>LOẠI TÀI KHOẢN</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY THAM GIA</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {accountData.map((acc, idx) => (
                <tr key={idx}>
                  <td className="zinc-text">{acc.id}</td>
                  <td>
                    <div className="user-info-cell">
                      <div className={`avatar-box ${acc.type === 'ĐỐI TÁC' ? 'bg-partner' : 'bg-user'}`}>
                        {acc.avatar}
                      </div>
                      <div className="name-email">
                        <span className="user-name-txt">{acc.name}</span>
                        <span className="user-email-txt">{acc.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-type ${acc.type === 'ĐỐI TÁC' ? 'type-partner' : 'type-user'}`}>
                      {acc.type}
                    </span>
                  </td>
                  <td>
                    <div className="status-cell">
                      <span className={`status-dot ${acc.status === 'Hoạt động' ? 'dot-active' : 'dot-locked'}`}></span>
                      <span className={acc.status === 'Hoạt động' ? 'text-active' : 'text-locked'}>{acc.status}</span>
                    </div>
                  </td>
                  <td className="zinc-text">{acc.date}</td>
                  <td><button className="btn-detail-link">Xem chi tiết</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentThongKeNguoiDung;