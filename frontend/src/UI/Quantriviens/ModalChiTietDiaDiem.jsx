import React from 'react';
import { X, MapPin, Tag, User, BarChart3, Banknote, ExternalLink, FileText } from 'lucide-react';

const ModalChiTietDiaDiem = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null; // Nếu không mở thì không render gì cả

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* 1. Container chính của Modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal - Màu sắc và icon y hệt */}
        <div className="modal-header">
          <div className="header-info">
            <div className="header-icon-box">
              <FileText size={20} color="#10b981" />
            </div>
            <div>
              <h3>Chi tiết hồ sơ đề xuất địa điểm</h3>
              <p>MÃ HL SƠ: {data?.id || "#LOC-10245"}</p>
            </div>
          </div>
          <button className="close-x-btn" onClick={onClose}><X size={24} /></button>
        </div>

        {/* Body Modal - Chia Grid 2 cột y hệt ảnh */}
        <div className="modal-body scroll-custom">
          <div className="modal-grid">
            
            {/* Cột trái: Thư viện hình ảnh & Giới thiệu chi tiết */}
            <div className="modal-col-left">
              <label className="section-label">THƯ VIỆN HÌNH ẢNH</label>
              <div className="image-main-preview">
                {/* Dùng ảnh placeholder như trong thiết kế */}
                <img src="http://localhost:5173/img/thacK50/thacK50.jpg" alt="main" />
              </div>
              <div className="image-sub-list">
                <img src="http://localhost:5173/img/bienhoche/bienhoche.jpg" alt="sub1" />
                <img src="http://localhost:5173/img/bienho/bienho.jpg" alt="sub2" />
              </div>

              <label className="section-label mt-20">GIỚI THIỆU CHI TIẾT</label>
              <p className="description-text">{data?.description || "Nội dung mô tả chi tiết của địa điểm sẽ được hiển thị tại đây..."}</p>
            </div>

            {/* Cột phải: Thông số, Tags & Đối tác đề xuất */}
            <div className="modal-col-right">
              <h2 className="location-name">{data?.name || "Rừng Dâu Sơn Trà"}</h2>
              <div className="location-address">
                <MapPin size={16} color="#10b981" /> <span>Bán đảo Sơn Trà, Đà Nẵng</span>
              </div>

              {/* Info Cards (Độ khó, Vé) */}
              <div className="info-cards">
                <div className="info-card">
                  <span>ĐỘ KHÓ</span>
                  <p><BarChart3 size={16} /> Trung bình</p>
                </div>
                <div className="info-card">
                  <span>VÉ VÀO CỔNG</span>
                  <p><Banknote size={16} /> 50.000 VNĐ</p>
                </div>
              </div>

              <label className="section-label mt-20">MÔ TẢ NGẮN</label>
              <p className="description-short">{data?.type || "Khu nghỉ dưỡng sinh thái kết hợp cắm trại..."}</p>

              <label className="section-label mt-20">ĐẶC ĐIỂM ĐỊA DANH</label>
              <div className="tag-group">
                <span className="info-tag">Địa hình dốc nhẹ</span>
                <span className="info-tag">Ven biển</span>
                <span className="info-tag">Rừng nguyên sinh</span>
                <span className="info-tag">Có nguồn nước ngọt</span>
              </div>

              <label className="section-label mt-20">ĐỐI TÁC ĐỀ XUẤT</label>
              <div className="partner-card">
                <div className="partner-avatar" style={{ backgroundColor: data?.pColor || '#065f46' }}>
                  {data?.pInit || "ST"}
                </div>
                <div className="partner-info">
                  <p className="partner-name">{data?.pName || "Sơn Trà Eco Hub"}</p>
                  <p className="partner-date">Thành viên từ: 12/2023</p>
                </div>
                <ExternalLink size={16} className="ms-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal - Trạng thái & Nút bấm y hệt */}
        <div className="modal-footer">
          <div className="status-indicator">
            <span className="dot-amber">●</span> ĐANG CHỜ THẨM ĐỊNH
          </div>
          <div className="action-buttons">
            <button className="btn-reject-modal" onClick={onClose}>TỪ CHỐI</button>
            <button className="btn-approve-modal">DUYỆT ĐỊA ĐIỂM</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalChiTietDiaDiem;