import React from 'react';
import { Search, Filter, Download, Users, FileText, Check, X, Eye } from 'lucide-react';

const ContentDonDangKy = () => {
  const stats = [
    { label: 'TỔNG ỨNG VIÊN', value: '1,284', icon: <Users size={24} />, color: 'emerald' },
    { label: 'CHỜ DUYỆT', value: '48', icon: <FileText size={24} />, color: 'red' },
  ];

  const applicants = [
    { id: '#BP-8921', name: 'Nguyễn Văn An', email: 'an.nguyen@email.com', city: 'Hà Nội', exp: '5 năm', status: 'CHỜ DUYỆT' },
    { id: '#BP-8922', name: 'Trần Thị Mai', email: 'mai.tran@email.com', city: 'Đà Nẵng', exp: '3 năm', status: 'CHỜ DUYỆT' },
    { id: '#BP-8923', name: 'Lê Hoàng Nam', email: 'nam.le@email.com', city: 'TP. Hồ Chí Minh', exp: '8 năm', status: 'CHỜ DUYỆT' },
    { id: '#BP-8924', name: 'Phạm Thanh Thảo', email: 'thao.pham@email.com', city: 'Lâm Đồng', exp: '2 năm', status: 'CHỜ DUYỆT' },
  ];

  return (
    <div className="dondangky-container">
      <div className="ddk-stats-row">
        {stats.map((s, i) => (
          <div key={i} className="ddk-stat-card">
            <div className="ddk-stat-content">
              <div className="ddk-stat-label">{s.label}</div>
              <div className="ddk-stat-value">{s.value}</div>
            </div>
            <div className={`ddk-stat-icon-wrapper bg-${s.color}`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="ddk-search-bar">
        <div className="ddk-search-wrapper">
          <Search size={18} className="ddk-search-icon" />
          <input type="text" placeholder="Tìm kiếm hồ sơ ứng viên..." />
        </div>
      </div>

      {/* Table Section */}
      <div className="ddk-table-box">
        <div className="ddk-table-header">
          <div className="ddk-table-title">
            <h3>Danh sách hồ sơ ứng tuyển</h3>
            <span>Cập nhật lúc 09:42 sáng nay</span>
          </div>
          <div className="ddk-table-actions">
            <button className="ddk-icon-btn"><Filter size={18} /></button>
            <button className="ddk-icon-btn"><Download size={18} /></button>
          </div>
        </div>

        <div className="ddk-table-wrapper custom-scrollbar">
          <table className="ddk-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>ID</th>
                <th>HỌ TÊN ỨNG VIÊN</th>
                <th style={{ width: '150px' }}>TỈNH THÀNH</th>
                <th style={{ width: '150px' }}>KINH NGHIỆM</th>
                <th style={{ width: '150px' }}>TRẠNG THÁI</th>
                <th style={{ width: '150px' }}>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((item) => (
                <tr key={item.id}>
                  <td className="ddk-id-cell">{item.id}</td>
                  <td>
                    <div className="ddk-user-info">
                      <div className="ddk-avatar"></div>
                      <div>
                        <div className="ddk-name">{item.name}</div>
                        <div className="ddk-email">{item.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="ddk-text-light">{item.city}</td>
                  <td className="ddk-text-light">{item.exp}</td>
                  <td>
                    <span className="ddk-status-badge">
                      <span className="ddk-dot"></span> {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="ddk-actions">
                      <button className="btn-view-cv">Xem CV</button>
                      <button className="btn-action-ok"><Check size={14} /></button>
                      <button className="btn-action-no"><X size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="ddk-table-footer">
          <div className="ddk-footer-info">Hiển thị 1-4 trong số 48 hồ sơ</div>
          <div className="ddk-pagination">
            <button className="ddk-page-nav">{'<'}</button>
            <button className="ddk-page-num active">1</button>
            <button className="ddk-page-num">2</button>
            <button className="ddk-page-num">3</button>
            <button className="ddk-page-nav">{'>'}</button>
          </div>
        </div>
      </div>

      <div className="ddk-system-footer">
        <span>SYSTEM ENGINE V4.0.2</span>
        <span className="ddk-secure"><span className="ddk-dot-small"></span> NETWORK SECURE</span>
      </div>
    </div>
  );
};

export default ContentDonDangKy;