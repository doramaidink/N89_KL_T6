import React from 'react';
import { Search, ArrowUpRight } from 'lucide-react';

const ContentThongKe = () => {

  const chartData = [
    { day: 'Thứ hai', h: '20%' },
    { day: 'Thứ ba', h: '30%' },
    { day: 'Thứ tư', h: '45%' },
    { day: 'Thứ năm', h: '70%' },
    { day: 'Thứ sáu', h: '40%' },
    { day: 'Thứ bảy', h: '65%' },
    { day: 'Chủ nhật', h: '90%', active: true } 
  ];

  const partners = [
    { 
      name: 'Nguyễn Văn Tài', 
      id: 1, 
      img: 'https://ui-avatars.com/api/?name=Tai+Nguyen&background=064e3b&color=fff' 
    },
    { 
      name: 'Trần Vĩnh Tuệ', 
      id: 2, 
      img: 'https://ui-avatars.com/api/?name=Tue+Tran&background=27272a&color=fff' 
    },
    { 
      name: 'Nguyễn Thị Trang', 
      id: 3, 
      img: 'https://ui-avatars.com/api/?name=Trang+Nguyen&background=10b981&color=fff' 
    }
  ];

  return (
    <div className="content-container">
      {/* 1. TOP CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">TỔNG NGƯỜI DÙNG</p>
          <div className="stat-value-group">
            <h2 className="stat-number">42.8k</h2>
            <span className="stat-percent">+12%</span>
          </div>
          <div className="stat-progress-bar">
            <div className="progress-fill" style={{ width: '70%' }}></div>
          </div>
        </div>

        <div className="stat-card">
          <p className="stat-label">ĐỐI TÁC HOẠT ĐỘNG</p>
          <div className="stat-value-group">
            <h2 className="stat-number">1,204</h2>
            <span className="stat-percent">+5.4%</span>
          </div>
          <p className="stat-subtext">+24 đối tác mới trong tuần</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">TỔNG SỐ TÀI KHOẢN ĐÃ KHÓA</p>
          <div className="stat-value-group">
            <h2 className="stat-number">156</h2>
            <span style={{fontSize: '18px'}}>  </span>
          </div>
          <p className="stat-subtext text-red">Vi phạm chính sách cộng đồng</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">TỔNG ĐỐI TÁC DỪNG HỢP TÁC</p>
          <div className="stat-value-group">
            <h2 className="stat-number">42</h2>
          </div>
          <p className="stat-subtext">Kể từ đầu năm 2024</p>
        </div>
      </div>

      {/* 2. REVENUE CHART SECTION */}
      <div className="chart-section">
        <div className="chart-header">
          <div className="chart-title-area">
            <h3>Thống kê doanh thu</h3>
            <p className="sub-text">Hiệu suất 7 ngày vừa qua</p>
          </div>
          <div className="chart-actions">
            <div className="revenue-badge">
              <span className="rev-amount">2.48B</span>
              <span className="rev-label">TRONG THÁNG</span>
            </div>
            <button className="btn-detail">TẢI BÁO CÁO CHI TIẾT</button>
          </div>
        </div>

        <div className="bar-chart-container">
          <div className="bar-chart-placeholder">
            {chartData.map((item, idx) => (
              <div key={idx} className="bar-group">
                <div 
                  className="bar" 
                  style={{ 
                    height: item.h,
                    backgroundColor: item.active ? '#22c55e' : '#276749' 
                  }}
                ></div>
                <span className="bar-day">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: TRANSACTIONS & PARTNERS */}
      <div className="bottom-grid">
        {/* Bảng Giao dịch */}
        <div className="transactions-table">
          <div className="table-header">
            <h3>Giao dịch gần đây</h3>
            <button className="link-text-green">Xem tất cả</button>
          </div>
          <div className="search-box-container">
            <div className="search-icon"><Search size={16} /></div>
            <input type="text" placeholder="Tìm kiếm dữ liệu..." className="table-search" />
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>KHÁCH HÀNG</th>
                <th>DỊCH VỤ</th>
                <th>NGÀY</th>
                <th>SỐ TIỀN</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="user-cell">
                    <div className="avatar-small bg-green-dark text-green-light">NL</div>
                    <span>Nguyen Lam</span>
                  </div>
                </td>
                <td>Tour Hà Giang 3N2Đ</td>
                <td>15/05/2024</td>
                <td className="amount-text">3,250,000đ</td>
                <td>
                  <div className="status-cell">
                    <span className="dot-success"></span>
                    <span className="status-text-green">THÀNH CÔNG</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="user-cell">
                    <div className="avatar-small bg-zinc text-white">HP</div>
                    <span>Hoàng Phan</span>
                  </div>
                </td>
                <td>Tour Rừng dầu</td>
                <td>14/05/2024</td>
                <td className="amount-text">1,120,000đ</td>
                <td>
                  <div className="status-cell">
                    <span className="dot-success"></span>
                    <span className="status-text-green">THÀNH CÔNG</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Danh sách Đối tác mới */}
        <div className="partners-list">
          <div className="table-header">
             <h3 className="section-title">Đối tác mới</h3>
          </div>
          <div className="partner-items-container">
            {partners.map((p) => (
              <div key={p.id} className="partner-item">
                <div className="partner-info">
                  <div className="partner-logo">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <span className="partner-name">{p.name}</span>
                </div>
                <button className="btn-action-circle">
                  <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
          </div>
          <button className="btn-full-width">XEM TẤT CẢ ĐỐI TÁC (1,204)</button>
        </div>
      </div>
    </div>
  );
};

export default ContentThongKe;