import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContentChonLoaiNhom = () => {
  const navigate = useNavigate();
  // Quản lý loại nhóm được chọn (mặc định là đã có nhóm - highlight)
  const [selection, setSelection] = useState("hasGroup");

  const selectedPlace = JSON.parse(localStorage.getItem("selectedGuide"))?.diaDiemDuocChon;

  const handleContinue = () => {
    if (selection === "hasGroup") {
      // Nếu chọn "Tôi đã có nhóm" -> Chuyển sang trang chọn nhóm
      navigate("/chonnhom");
    } else {
      // Nếu chọn "Tôi chưa có nhóm" -> Chuyển thẳng sang thanh toán
      navigate("/thanhtoan");
    }
  };

  return (
    <div className="hire-page">
      <div className="hire-header-nav">
        <div className="hire-logo">
          <img src="/img/logo.png" alt="logo" />
          <span>Backpacking VietNam</span>
        </div>
        <button className="hire-back-btn" onClick={() => navigate(-1)}>
          <span>←</span> Back
        </button>
      </div>

      <div className="hire-container">
        <span className="hire-step-label">👥 BƯỚC 1: XÁC NHẬN THÀNH VIÊN</span>
        <h1 className="hire-title">Bạn đã có nhóm trekking chưa?</h1>
        <p className="hire-sub">
          Để đảm bảo trải nghiệm tốt nhất trên những cung đường hùng vĩ của Việt Nam, hãy cho chúng tôi biết kế hoạch di chuyển của bạn.
        </p>

        <div className="hire-grid">
          {/* Card 1: Đã có nhóm */}
          <div className={`hire-card ${selection === "hasGroup" ? "highlight" : ""}`}
            onClick={() => setSelection("hasGroup")}>
            <div className="hire-card-icon-box">👥</div>
            <h3>Tôi đã có nhóm</h3>
            <p>Hướng dẫn viên sẽ tham gia vào nhóm hiện tại của bạn. Chúng tôi sẽ tạo lời mời đến HDV.</p>
            <div className="hire-avatar-group">
              <img src="/img/user1.jpg" alt="" />
              <img src="/img/user2.jpg" alt="" />
              <img src="/img/user3.jpg" alt="" />
              <span className="more-count">+4</span>
            </div>
            <div className="hire-card-number">1</div>
          </div>

          {/* Card 2: Chưa có nhóm */}
          <div className={`hire-card ${selection === "noGroup" ? "highlight" : ""}`}
            onClick={() => setSelection("noGroup")}>
            <div className="hire-card-icon-box plain">👤+</div>
            <h3>Tôi chưa có nhóm</h3>
            <p>Hướng dẫn viên sẽ tạo nhóm mới và mời bạn tham gia cùng những người khác.</p>
            <div className="hire-badge-promo">✨ CƠ HỘI GẶP GỠ BẠN BÈ MỚI</div>
            <div className="hire-card-number">2</div>
          </div>
        </div>

        {/* Thông tin chuyến đi đã chọn */}
        <div className="hire-selected-trip">
          <div className="trip-info-box">
            <img
              src={selectedPlace?.image || "http://localhost:5000/img/default.jpg"}
              alt={selectedPlace?.tenDiaDiem}
              onError={(e) => {
                e.target.onerror = null; // ✅ Dòng này để ngắt vòng lặp ngay lập tức
                e.target.src = "http://localhost:5000/img/default.jpg"; // ✅ Gọi về cổng 5000
              }}
            />
            <div className="trip-text">
              <span>CHUYẾN ĐI ĐÃ CHỌN</span>
              <h4>{selectedPlace?.tenDiaDiem || "Địa điểm trekking"}</h4>
              <p>📍 {selectedPlace?.khuVuc || "Việt Nam"}</p>
            </div>
          </div>

          {/* SỬA TẠI ĐÂY: Gọi hàm handleContinue */}
          <button className="hire-main-btn" onClick={handleContinue}>
            Tiếp tục {selection === "hasGroup" ? "chọn nhóm" : "thanh toán"} <span>→</span>
          </button>
        </div>

        <div className="hire-info-footer">
          <div className="info-why">
            <h4><span className="icon-shield">🛡</span> Tại sao phải chọn nhóm?</h4>
            <p>"Việc biết trước cấu trúc nhóm giúp hướng dẫn viên chuẩn bị trang thiết bị an toàn và bộ đàm phù hợp cho từng thành viên..."</p>
            <ul>
              <li>✔ Tối ưu hóa chi phí vận chuyển cho nhóm đông.</li>
              <li>✔ Kết nối những người đi cùng sở thích.</li>
            </ul>
          </div>
          <div className="info-tips">
            <div className="tip-box">
              <h5>MẸO AN TOÀN</h5>
              <p>Các nhóm trekking tại Việt Nam thường có giới hạn tối đa 12 người để đảm bảo kiểm soát an ninh tốt nhất trong rừng quốc gia.</p>
              <a href="#">Xem quy định về quy mô nhóm ↗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentChonLoaiNhom;