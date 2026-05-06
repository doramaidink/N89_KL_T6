import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContentChonLoaiNhom = () => {
  const navigate = useNavigate();
  // Quản lý loại nhóm được chọn (mặc định là đã có nhóm - highlight)
  const [selection, setSelection] = useState("hasGroup");

  const selectedPlace = JSON.parse(localStorage.getItem("selectedGuide"))?.diaDiemDuocChon;
  console.log("SELECTED PLACE:", selectedPlace);
  const handleContinue = () => {

    // ĐÃ CÓ NHÓM
    if (selection === "hasGroup") {
      navigate("/chonnhom");
    }

    // CHƯA CÓ NHÓM
    else {

      localStorage.setItem("autoOpenCreateGroup", "true");

      const slug = selectedPlace?.slug;

      if (!slug) {
        alert("Không tìm thấy địa điểm");
        return;
      }

      const savedUser =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(localStorage.getItem("authUser")) ||
        JSON.parse(localStorage.getItem("currentUser"));

      if (savedUser?.hoTen) {
        navigate(`/${encodeURIComponent(savedUser.hoTen)}/chitietdiadiemuser/${slug}`);
      } else {
        navigate(`/chitietdiadiem/${slug}`);
      }
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
            {selection === "noGroup" && (
              <div
                style={{
                  color: "#ff5b5b",
                  marginBottom: "15px",
                  fontWeight: "600",
                  fontSize: "15px"
                }}
              >
                ⚠ Bạn cần tạo nhóm tại địa điểm này trước khi thanh toán
              </div>
            )}
          </div>
        </div>

        {/* Thông tin chuyến đi đã chọn */}
        <div className="hire-selected-trip">
          <div className="trip-info-box">
            <img
              src={
                selectedPlace?.image?.includes("localhost:5000")
                  ? selectedPlace.image.replace("localhost:5000", "localhost:5173")
                  : selectedPlace?.image
              }
              alt={selectedPlace?.tenDiaDiem}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/img/default.jpg";
              }}
            />
            <div className="trip-text">
              <span>CHUYẾN ĐI ĐÃ CHỌN</span>
              <h4>{selectedPlace?.tenDiaDiem || "Địa điểm trekking"}</h4>
              <p>📍 {selectedPlace?.khuVuc || "Việt Nam"}</p>
            </div>
          </div>

          <button className="hire-main-btn" onClick={handleContinue}>
            {
              selection === "hasGroup"
                ? "Tiếp tục chọn nhóm"
                : "Tạo nhóm ngay"
            }
            <span>→</span>
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