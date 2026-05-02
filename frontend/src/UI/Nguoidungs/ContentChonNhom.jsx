//
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ContentChonNhom = () => {
  const navigate = useNavigate();
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin HDV đang chọn từ localStorage
  const selectedGuide = JSON.parse(localStorage.getItem("selectedGuide"));
  const user = JSON.parse(localStorage.getItem("user"));

  const getImageUrl = (image) => {
    if (!image) return "/img/default.jpg";

    if (image.startsWith("http")) return image;

    return `http://localhost:5173${image}`;
  };

  useEffect(() => {
    const fetchGroups = async () => {
      const userId = user?.id || user?._id;
      if (!userId) return;

      try {
        // 1. Lấy ID địa điểm từ thông tin thuê HDV trong máy
        const selectedPlaceId = selectedGuide?.diaDiemDuocChon?._id;

        // 2. Gọi API lấy toàn bộ nhóm của User
        const res = await axios.get(`http://localhost:5000/nhom/user/${userId}`);

        // 3. LỌC: Chỉ giữ lại các nhóm thuộc địa điểm này
        const filteredGroups = res.data.nhoms.filter(group => {
          // Kiểm tra diaDiem của nhóm có khớp với địa điểm đang thuê không
          const groupPlaceId = group.diaDiem?._id || group.diaDiem;
          return String(groupPlaceId) === String(selectedPlaceId);
        });

        setMyGroups(filteredGroups);
      } catch (error) {
        console.error("Lỗi lấy danh sách nhóm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [user, selectedGuide]);

  const handleSelectGroup = (group) => {
    // Lưu nhóm được chọn vào localStorage để xử lý ở trang thanh toán
    const updatedBooking = { ...selectedGuide, groupToHire: group };
    localStorage.setItem("selectedGuide", JSON.stringify(updatedBooking));
    navigate("/thanhtoan");
  };

  return (
    <div className="group-page">
      <div className="group-header-nav">
        <div className="group-logo">
          <img src="/img/logo.png" alt="logo" />
          <span>Backpacking VietNam</span>
        </div>
        <button className="group-back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="group-container">
        <span className="group-step-label">👥 BƯỚC 2: CHỌN NHÓM</span>
        <h1 className="group-title">Chọn nhóm của bạn</h1>
        <p className="group-sub">
          Chọn nhóm bạn muốn mời hướng dẫn viên <span className="guide-name">{selectedGuide?.hoTen}</span> tham gia cùng hành trình chinh phục các đỉnh cao tại Việt Nam.
        </p>

        <div className="group-notice-box">
          <div className="notice-icon">ℹ</div>
          <div className="notice-content">
            <h4>Lưu ý về lời mời</h4>
            <p>Sau khi gửi lời mời, hướng dẫn viên sẽ có 24h để phản hồi. Phí dịch vụ sẽ chỉ được tạm giữ sau khi hướng dẫn viên chấp nhận yêu cầu của nhóm bạn.</p>
          </div>
        </div>

        <div className="group-grid">
          {myGroups.map((g) => (
            <div className="group-card" key={g._id}>
              <div className="group-card-img">
                <img
                  src={
                    g.diaDiem?.image
                      ? `http://localhost:5173${g.diaDiem.image}`
                      : "/img/default.jpg"
                  }
                  alt={g.ten}
                />
                <span className={`status-badge ${g.nguoiTao?.id === user?.id ? "active" : "draft"}`}>
                  {g.nguoiTao?.id === user?.id ? "ACTIVE" : "MEMBER"}
                </span>
              </div>

              <div className="group-card-body">
                <h3>{g.ten}</h3>
                <div className="group-meta">
                  <p>👥 {g.thanhVien?.length || 0} thành viên</p>
                  <p>📅 Khởi hành: {g.startTime ? new Date(g.startTime).toLocaleDateString('vi-VN') : "Chưa xác định"}</p>
                </div>

                <button className="group-select-btn" onClick={() => handleSelectGroup(g)}>
                  Xác nhận và Mời <span>➤</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentChonNhom;