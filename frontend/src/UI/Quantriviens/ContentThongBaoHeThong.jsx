import React from 'react';
import { Send, Info, AlertTriangle, Bell, Clock } from 'lucide-react';

const ContentThongBaoHeThong = () => {
  const history = [
    { id: 1, title: 'Cập nhật chính sách bảo mật v2', time: '2 giờ trước', target: 'Toàn bộ người dùng', icon: <Info size={16} />, type: 'info' },
    { id: 2, title: 'Bảo trì hệ thống khu vực Miền Trung', time: 'Hôm qua', target: 'Đối tác vận chuyển', icon: <AlertTriangle size={16} />, type: 'warning' },
  ];

  return (
    <div className="thongbaohethong-container">
      <div className="thongbao-stats-row">
        <div className="thongbao-stat-card border-green">
          <div className="stat-label">TỔNG THÔNG BÁO</div>
          <div className="stat-value">42.8k <span className="stat-percent">~12%</span></div>
          <div className="stat-progress"><div className="fill-green" style={{width: '45%'}}></div></div>
        </div>
        <div className="thongbao-stat-card border-emerald">
          <div className="stat-label">TỔNG THÔNG BÁO THÁNG NÀY</div>
          <div className="stat-value">100 <span className="stat-percent">~12%</span></div>
          <div className="stat-progress"><div className="fill-emerald" style={{width: '60%'}}></div></div>
        </div>
        <div className="thongbao-history-card">
          <div className="history-header">
            <Clock size={16} /> Lịch sử thông báo gần đây
          </div>
          <div className="history-list">
            {history.map(item => (
              <div key={item.id} className="history-item">
                <div className={`history-icon icon-${item.type}`}>{item.icon}</div>
                <div className="history-info">
                  <div className="history-title">{item.title}</div>
                  <div className="history-meta">{item.time} • {item.target}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="thongbao-form-box">
        <div className="form-header">
          <h3>Gửi thông báo hệ thống</h3>
          <Send size={18} className="text-muted" />
        </div>
        
        <div className="form-body">
          <div className="form-group">
            <label>TIÊU ĐỀ THÔNG BÁO</label>
            <input type="text" placeholder="Nhập tiêu đề ngắn gọn..." />
          </div>

          <div className="form-group">
            <label>ĐỐI TƯỢNG NHẬN</label>
            <select>
              <option>Tất cả người dùng</option>
              <option>Đối tác</option>
              <option>Khách hàng thân thiết</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>LOẠI THÔNG BÁO</label>
              <select>
                <option>Khuyến mãi</option>
                <option>Hệ thống</option>
                <option>Cảnh báo</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>ĐỘ ƯU TIÊN</label>
              <select>
                <option>Bình thường</option>
                <option>Cao</option>
                <option>Khẩn cấp</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>NỘI DUNG CHI TIẾT</label>
            <textarea placeholder="Viết nội dung thông báo tại đây..." rows={6}></textarea>
          </div>

          <button className="btn-submit-thongbao">
            Phát hành thông báo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentThongBaoHeThong;