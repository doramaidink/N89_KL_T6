import React from 'react';
import { Search, Plus, Map, CheckCircle2, AlertTriangle, Edit3, Eye, Filter, Download } from 'lucide-react';

const ContentQuanLyDiaDiem = () => {
  const stats = [
    { label: 'TỔNG SỐ ĐỊA ĐIỂM', value: '1.248', icon: <Map size={20} />, color: 'emerald' },
    { label: 'ĐANG HOẠT ĐỘNG', value: '1.120', icon: <CheckCircle2 size={20} />, color: 'green' },
    { label: 'ĐÃ XÓA/DỪNG HOẠT ĐỘNG', value: '28', icon: <AlertTriangle size={20} />, color: 'red' },
    { label: 'MỚI TRONG THÁNG', value: '+15', sub: '+12.5%', color: 'emerald' },
  ];

  const locations = [
    { id: '#LOC-10245', name: 'Rừng Dâu Sơn Trà', area: 'Đà Nẵng', level: 'KHÓ', price: '50.000 VNĐ', status: 'Đang hoạt động' },
    { id: '#LOC-10246', name: 'Đỉnh bàn cờ', area: 'Đà Nẵng', level: 'DỄ', price: 'Miễn Phí', status: 'Đang hoạt động' },
    { id: '#LOC-10247', name: 'Thác 9 Tầng', area: 'Gia Lai', level: 'KHÓ', price: 'Miễn phí', status: 'Đang bảo trì' },
    { id: '#LOC-10248', name: 'Thác K50', area: 'Gia Lai', level: 'TRUNG BÌNH', price: '290.000 VNĐ', status: 'Đang hoạt động' },
  ];

  return (
    <div className="quanlydiadiem-container">
      {/* Header Section */}
      <div className="qldd-header">
        <div className="qldd-header-left">
          <h2 className="qldd-title">Quản lý địa điểm</h2>
          <p className="qldd-subtitle">Quản trị danh mục các điểm đến trên toàn lãnh thổ Việt Nam</p>
        </div>
        <button className="qldd-btn-add">
          <Plus size={18} /> Thêm địa điểm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="qldd-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className={`qldd-stat-card border-${s.color}`}>
            <div className="qldd-stat-info">
              <div className="qldd-stat-label">{s.label}</div>
              <div className="qldd-stat-value">
                {s.value} {s.sub && <span className="qldd-stat-sub">{s.sub}</span>}
              </div>
            </div>
            <div className={`qldd-stat-icon text-${s.color}`}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="qldd-filter-bar">
        <div className="qldd-filter-left">
          <span className="qldd-filter-label">LỌC THEO:</span>
          <select className="qldd-select"><option>Tất cả Tỉnh/Thành</option></select>
          <select className="qldd-select"><option>Tất cả Trạng thái</option></select>
        </div>
        <div className="qldd-filter-right">
          <div className="qldd-search-box">
            <Search size={16} className="qldd-search-icon" />
            <input type="text" placeholder="Tìm kiếm địa điểm, ID, hoặc tỉnh thành..." />
          </div>
          <button className="qldd-btn-icon"><Filter size={18} /></button>
          <button className="qldd-btn-icon"><Download size={18} /></button>
        </div>
      </div>

      {/* Table Section */}
      <div className="qldd-table-wrapper custom-scrollbar">
        <table className="qldd-table">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>ID</th>
              <th>ĐỊA ĐIỂM</th>
              <th style={{ width: '120px' }}>KHU VỰC</th>
              <th style={{ width: '120px' }}>ĐỘ KHÓ</th>
              <th style={{ width: '140px' }}>GIÁ VÉ</th>
              <th style={{ width: '160px' }}>TRẠNG THÁI</th>
              <th style={{ width: '100px' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.id}>
                <td className="text-emerald font-bold">{loc.id}</td>
                <td>
                  <div className="qldd-loc-cell">
                    <div className="qldd-loc-img"></div>
                    <span className="qldd-loc-name">{loc.name}</span>
                  </div>
                </td>
                <td className="qldd-text-muted">{loc.area}</td>
                <td>
                  <span className="qldd-badge-level">{loc.level}</span>
                </td>
                <td className="qldd-text-muted">{loc.price}</td>
                <td>
                  <div className={`qldd-status status-${loc.status === 'Đang bảo trì' ? 'maintenance' : 'active'}`}>
                    <span className="qldd-dot"></span> {loc.status}
                  </div>
                </td>
                <td>
                  <div className="qldd-actions">
                    <button className="qldd-action-btn"><Edit3 size={16} /></button>
                    <button className="qldd-action-btn"><Eye size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="qldd-footer">
        <div className="qldd-footer-info">Hiển thị 1 - 10 trong số 1.248 địa điểm</div>
        <div className="qldd-pagination">
          <button className="qldd-page-nav">{'<'}</button>
          <button className="qldd-page-num active">1</button>
          <button className="qldd-page-num">2</button>
          <button className="qldd-page-num">3</button>
          <span className="qldd-page-dots">...</span>
          <button className="qldd-page-num">125</button>
          <button className="qldd-page-nav">{'>'}</button>
        </div>
      </div>
    </div>
  );
};

export default ContentQuanLyDiaDiem;