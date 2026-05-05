import React from 'react';
import { X, User, MapPin, CalendarDays, Users, Clock, ShieldAlert, Flag } from 'lucide-react'; 

const ContentChitietyeucau = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-single" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="modal-header">
          <div className="header-title">
            <ShieldAlert size={22} color="#d69e66" />
            <h2>Chi Tiết Yêu Cầu Thuê</h2>
          </div>
          <button className="btn-close-x" onClick={onClose}>
            <X size={20} color="#666" />
          </button>
        </div>
        
        <hr className="header-divider" />

        <div className="modal-body">
          
          {/* KHỐI 1: THÔNG TIN KHÁCH HÀNG */}
          <div className="info-section-dark">
            <div className="info-row">
              <User size={18} color="#a3a3a3" />
              <p><strong>Khách hàng:</strong> {request.khachHang}</p>
            </div>
            <div className="info-row">
              <CalendarDays size={18} color="#a3a3a3" />
              <p><strong>Ngày đặt:</strong> {request.ngayDat}</p>
            </div>
            <div className="info-row align-start">
              <MapPin size={18} color="#a3a3a3" />
              <p><strong>Vị trí:</strong> {request.viTri}</p>
            </div>
          </div>

          {/* KHỐI 2: THÔNG TIN NHÓM TREKKING */}
          <div className="group-info-section">
            <div className="section-title">
              <Users size={18} color="#d69e66" />
              <h4>Thông tin nhóm</h4>
            </div>
            
            <div className="group-details">
              <p className="group-name"><strong>Tên nhóm:</strong> {request.groupName || "Biệt Đội Sơn Trà"}</p>
              
              <div className="member-list">
                <p><strong>Danh sách thành viên:</strong></p>
                <ul>
                  <li>Nguyễn Văn An (Trưởng nhóm)</li>
                  <li>Trần Thế Đức</li>
                  <li>Lê Văn Hoàng</li>
                </ul>
              </div>

              <div className="time-location-grid">
                <div className="time-item">
                  <Clock size={16} color="#8c7e6d" />
                  <div>
                    <p className="label">Thời gian xuất phát:</p>
                    <p className="value">15/04/2026 - 05:30</p>
                  </div>
                </div>

                <div className="time-item">
                  <Clock size={16} color="#8c7e6d" />
                  <div>
                    <p className="label">Thời gian kết thúc:</p>
                    <p className="value">16/04/2026 - 18:00</p>
                  </div>
                </div>

                <div className="location-item full-width">
                  <Flag size={16} color="#8c7e6d" />
                  <div>
                    <p className="label">Địa điểm tập trung:</p>
                    <p className="value">Cổng phụ CV Phần mềm Quang Trung, Đà Nẵng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn-reject" onClick={onClose}>
            Từ chối
          </button>
          <button className="btn-confirm-final" onClick={onClose}>
            Xác nhận thuê
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContentChitietyeucau;