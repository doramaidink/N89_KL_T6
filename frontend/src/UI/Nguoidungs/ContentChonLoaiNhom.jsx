import React from "react";
import { useNavigate } from "react-router-dom";

const ContentChonLoaiNhom = () => {
  const navigate = useNavigate();

  return (
    <div className="hire-page">
      <div className="hire-container">
        <h1 className="hire-title">Bạn đã có nhóm trekking chưa?</h1>
        <p className="hire-sub">
          Chọn cách bạn muốn bắt đầu hành trình cùng hướng dẫn viên
        </p>

        <div className="hire-grid">
          {/* Đã có nhóm */}
          <div className="hire-card">
            <div className="hire-icon">👥</div>
            <h3>Tôi đã có nhóm</h3>
            <p>Chọn nhóm có sẵn để thuê hướng dẫn viên</p>

            <button
              className="hire-btn"
              onClick={() => navigate("/chonnhom")}
            >
              Tiếp tục
            </button>
          </div>

          {/* Chưa có nhóm */}
          <div className="hire-card">
            <div className="hire-icon">✨</div>
            <h3>Tôi chưa có nhóm</h3>
            <p>Hệ thống sẽ tạo nhóm mới cho bạn sau khi thanh toán</p>

            <button
              className="hire-btn green"
              onClick={() => navigate("/thanhtoan")}
            >
              Tạo nhóm & thuê ngay
            </button>
          </div>
        </div>

        {/* Gợi ý */}
        <div className="hire-tip">
          <h4>Tại sao nên có nhóm?</h4>
          <ul>
            <li>✔ Trải nghiệm trekking an toàn hơn</li>
            <li>✔ Dễ chia sẻ chi phí</li>
            <li>✔ Kết nối bạn bè cùng đam mê</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentChonLoaiNhom;