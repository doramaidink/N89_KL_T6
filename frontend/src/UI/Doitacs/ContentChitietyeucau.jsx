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
              <p>
                <strong>Khách hàng:</strong> {request.nhomId?.nguoiTao?.hoTen || "Không rõ"}
              </p>
            </div>
            <div className="info-row">
              <CalendarDays size={18} color="#a3a3a3" />
              <strong>Ngày đặt:</strong>{" "}
              {request.createdAt
                ? new Date(request.createdAt).toLocaleString("vi-VN")
                : "Không rõ"}
            </div>
            <div className="info-row align-start">
              <MapPin size={18} color="#a3a3a3" />
              <p>
                <strong>Vị trí:</strong> {request.nhomId?.diaDiem?.tenDiaDiem || "Không rõ"}
              </p>
            </div>
          </div>

          {/* KHỐI 2: THÔNG TIN NHÓM TREKKING */}
          <div className="group-info-section">
            <div className="section-title">
              <Users size={18} color="#d69e66" />
              <h4>Thông tin nhóm</h4>
            </div>

            <div className="group-details">
              <p className="group-name">
                <strong>Tên nhóm:</strong> {request.nhomId?.ten || "Không rõ"}
              </p>

              <div className="member-list">
                <p><strong>Danh sách thành viên:</strong></p>
                <ul>
                  {request.nhomId?.thanhVien?.length > 0 ? (
                    request.nhomId.thanhVien.map((tv, index) => (
                      <li key={index}>
                        {tv.user?.hoTen || "Không rõ"}
                      </li>
                    ))
                  ) : (
                    <li>Không có thành viên</li>
                  )}
                </ul>
              </div>

              <div className="time-location-grid">
                <div className="time-item">
                  <Clock size={16} color="#8c7e6d" />
                  <div>
                    <p className="label">Thời gian xuất phát:</p>
                    <p className="value">
                      {request.nhomId?.startTime
                        ? new Date(request.nhomId.startTime).toLocaleString("vi-VN")
                        : "Không rõ"}
                    </p>
                  </div>
                </div>

                <div className="time-item">
                  <Clock size={16} color="#8c7e6d" />
                  <div>
                    <p className="label">Thời gian kết thúc:</p>
                    <p className="value">
                      {request.nhomId?.endTime
                        ? new Date(request.nhomId.endTime).toLocaleString("vi-VN")
                        : "Không rõ"}
                    </p>
                  </div>
                </div>

                <div className="location-item full-width">
                  <Flag size={16} color="#8c7e6d" />
                  <div>
                    <p className="label">Địa điểm tập trung:</p>
                    <p className="value">
                      {request.nhomId?.lichTrinh?.location || "Không rõ"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

         
      </div>
    </div>
  );
};

export default ContentChitietyeucau;