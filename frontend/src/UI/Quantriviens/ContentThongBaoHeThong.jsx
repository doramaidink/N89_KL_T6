import React, { useState } from 'react';
import { Send, Info, AlertTriangle, Bell, Clock } from 'lucide-react';

const ContentThongBaoHeThong = () => {
  const [doiTuong, setDoiTuong] = useState("all"); // user / doitac
  const [loaiThongBao, setLoaiThongBao] = useState("he_thong");

  const [form, setForm] = useState({
    tieuDe: "",
    noiDung: "",
    loai: "all"
  });
  const history = [
    { id: 1, title: 'Cập nhật chính sách bảo mật v2', time: '2 giờ trước', target: 'Toàn bộ người dùng', icon: <Info size={16} />, type: 'info' },
    { id: 2, title: 'Bảo trì hệ thống khu vực Miền Trung', time: 'Hôm qua', target: 'Đối tác vận chuyển', icon: <AlertTriangle size={16} />, type: 'warning' },
  ];

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/thongbao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tieuDe: form.tieuDe,
          noiDung: form.noiDung,
          loai: doiTuong,          
          loaiThongBao: loaiThongBao  
        })

      });

      const data = await res.json();

      alert("Gửi thông báo thành công!");

      // reset form
      setForm({
        tieuDe: "",
        noiDung: "",
        loai: "all"
      });

    } catch (err) {
      console.error(err);
      alert("Lỗi gửi thông báo");
    }
  };

  return (
    <div className="thongbaohethong-container">
      <div className="thongbao-stats-row">
        <div className="thongbao-stat-card border-green">
          <div className="stat-label">TỔNG THÔNG BÁO</div>
          <div className="stat-value">42.8k <span className="stat-percent">~12%</span></div>
          <div className="stat-progress"><div className="fill-green" style={{ width: '45%' }}></div></div>
        </div>
        <div className="thongbao-stat-card border-emerald">
          <div className="stat-label">TỔNG THÔNG BÁO THÁNG NÀY</div>
          <div className="stat-value">100 <span className="stat-percent">~12%</span></div>
          <div className="stat-progress"><div className="fill-emerald" style={{ width: '60%' }}></div></div>
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
            <input
              type="text"
              placeholder="Nhập tiêu đề..."
              value={form.tieuDe}
              onChange={(e) =>
                setForm({ ...form, tieuDe: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>ĐỐI TƯỢNG NHẬN</label>
            <select onChange={(e) => setDoiTuong(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="user">Người dùng</option>
              <option value="doitac">Đối tác</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>LOẠI THÔNG BÁO</label>
              <select
                value={loaiThongBao}
                onChange={(e) => setLoaiThongBao(e.target.value)}
              >
                <option value="khuyen_mai">Khuyến mãi</option>
                <option value="he_thong">Hệ thống</option>
                <option value="canh_bao">Cảnh báo</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>ĐỘ ƯU TIÊN</label>
              <select >
                <option value="all">Tất cả</option>
                <option value="user">Người dùng</option>
                <option value="doitac">Đối tác</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>NỘI DUNG CHI TIẾT</label>
            <textarea
              rows={6}
              value={form.noiDung}
              onChange={(e) =>
                setForm({ ...form, noiDung: e.target.value })
              }
            />
          </div>

          <button
            className="btn-submit-thongbao"
            onClick={handleSubmit}
          >
            Phát hành thông báo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentThongBaoHeThong;