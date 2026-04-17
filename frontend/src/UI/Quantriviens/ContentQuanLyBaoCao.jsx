import React from 'react';
import { Search, Filter, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

const ContentQuanLyBaoCao = () => {
  const stats = [
    { label: 'TỔNG BÁO CÁO', value: '1,284', sub: '+12% tháng này', color: 'green' },
    { label: 'CHƯA XỬ LÝ', value: '42', sub: '8 sự cố nghiêm trọng', color: 'red' },
    { label: 'ĐANG GIẢI QUYẾT', value: '156', progress: 65, color: 'emerald' },
    { label: 'ĐÃ HOÀN THÀNH', value: '1,086', sub: '92% tỷ lệ giải quyết', color: 'gray' },
  ];

  const reports = [
    { id: '#REP-10245', user: 'Lê Minh Tuấn', email: 'tuan.le@backpack.vn', type: 'AN TOÀN', status: 'ĐANG XỬ LÝ', desc: 'CHECKOUT - THIẾU 2 BẠN TẠI SƠN TRÀ' },
    { id: '#REP-10238', user: 'Nguyễn Thị Hà', email: 'ha.nguyen@outlook.com', type: 'KỸ THUẬT', status: 'ĐÃ XỬ LÝ', desc: 'TÔI BỊ LỖI KHÔNG THỂ THẤY ẢNH Ở KHUNG CHAT' },
    { id: '#REP-10231', user: 'Trần Anh Đức', email: 'duc.anh@gmail.com', type: 'GÓP Ý', status: 'MỚI', desc: 'TÔI NGHĨ MÌNH NÊN THÊM MAP CÁC BẠN...' },
  ];

  return (
    <div className="quanlybaocao-container">
      <h2 className="quanlybaocao-title">Quản lý Báo cáo & Sự cố</h2>
      <p className="quanlybaocao-subtitle">Hệ thống xử lý sự cố thời gian thực dành cho cộng đồng Backpacking Vietnam. Ưu tiên giải quyết các vấn đề an toàn và kỹ thuật trọng yếu.</p>

      {/* Thẻ thống kê */}
      <div className="quanlybaocao-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="quanlybaocao-card">
            <div className="quanlybaocao-card-label">{s.label}</div>
            <div className="quanlybaocao-card-value">{s.value}</div>
            {s.sub && <div className={`quanlybaocao-card-sub text-${s.color}`}>{s.sub}</div>}
            {s.progress && (
              <div className="quanlybaocao-progress-bar">
                <div className="quanlybaocao-progress-fill" style={{ width: `${s.progress}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bộ lọc */}
      <div className="quanlybaocao-filter-bar">
        <div className="quanlybaocao-filter-group">
          <div className="quanlybaocao-select-box">
            <label>PHÂN LOẠI:</label>
            <select>
              <option>Tất cả Phân loại</option>
              <option>Tất cả người dùng</option>
              <option>Đối tác</option>
              <option>Khách hàng thân thiết</option>
            </select>
          </div>
          <div className="quanlybaocao-select-box">
            <label>MỨC ĐỘ:</label>
            <select><option>Mọi Mức độ</option></select>
          </div>
          <div className="quanlybaocao-select-box">
            <label>TRẠNG THÁI:</label>
            <select><option>Mọi Trạng thái</option></select>
          </div>
          <button className="quanlybaocao-btn-apply"><Filter size={14} /> Áp dụng</button>
        </div>
        <div className="quanlybaocao-search-wrapper">
          <Search size={16} className="quanlybaocao-search-icon" />
          <input type="text" placeholder="Tìm kiếm báo cáo..." />
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="quanlybaocao-table-wrapper custom-scrollbar">
        <table className="quanlybaocao-table">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>MÃ</th>
              <th style={{ width: '220px' }}>NGƯỜI DÙNG</th>
              <th style={{ width: '120px' }}>PHÂN LOẠI</th>
              <th style={{ width: '140px' }}>TRẠNG THÁI</th>
              <th>MÔ TẢ</th>
              <th style={{ width: '100px' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="text-emerald font-bold">{r.id}</td>
                <td>
                  <div className="quanlybaocao-user-cell">
                    <div className="quanlybaocao-user-avatar"></div>
                    <div className="quanlybaocao-user-info">
                      <div className="quanlybaocao-user-name">{r.user}</div>
                      <div className="quanlybaocao-user-email">{r.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`quanlybaocao-badge-type type-${r.type === 'AN TOÀN' ? 'danger' : r.type === 'KỸ THUẬT' ? 'tech' : 'idea'}`}>
                    • {r.type}
                  </span>
                </td>
                <td>
                  <span className={`quanlybaocao-status-text status-${r.status === 'ĐANG XỬ LÝ' ? 'processing' : r.status === 'ĐÃ XỬ LÝ' ? 'done' : 'new'}`}>
                    • {r.status}
                  </span>
                </td>
                <td className="quanlybaocao-desc-cell">{r.desc}</td>
                <td>
                  <button className="quanlybaocao-btn-reply">PHẢN HỒI</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="quanlybaocao-footer">
        <div className="quanlybaocao-footer-info">Hiển thị 1-10 trong số 1.284 báo cáo</div>
        <div className="quanlybaocao-pagination">
          <button className="quanlybaocao-page-nav">{'<'}</button>
          <button className="quanlybaocao-page-num active">1</button>
          <button className="quanlybaocao-page-num">2</button>
          <button className="quanlybaocao-page-num">3</button>
          <span className="quanlybaocao-page-dots">...</span>
          <button className="quanlybaocao-page-num">129</button>
          <button className="quanlybaocao-page-nav">{'>'}</button>
        </div>
      </div>
    </div>
  );
};

export default ContentQuanLyBaoCao;