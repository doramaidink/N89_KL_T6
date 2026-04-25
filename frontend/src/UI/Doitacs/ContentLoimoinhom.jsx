import React, { useState, useEffect } from "react";
import ContentTaonhom from './ContentTaonhom';
import { UserPlus, Check, X, MapPin, Calendar, Users, ShieldCheck, Zap, Search, Trees, Sparkles } from "lucide-react";

const ContentLoimoinhom = () => {
  const [showAll, setShowAll] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        console.log("USER:", user);

        // 🔥 FIX CHUẨN
        const doiTacId = user?.doiTacId || user?.id;

        if (!doiTacId) {
          console.error("Không có doiTacId");
          return;
        }

        const res = await fetch(
          `http://localhost:5000/loimoi?doiTacId=${doiTacId}`
        );

        const data = await res.json();
        setInvitations(data.loiMois || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInvites();
  }, []);

  const handleAccept = async (item) => {
    try {
      const res = await fetch(
        `http://localhost:5000/loimoi/${item._id}/accept`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      alert("Đã tham gia nhóm!");

      // ❗ chuyển sang chat
      window.location.href = `/nhomchat/${data.nhomId}`;

    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (item) => {
    try {
      await fetch(
        `http://localhost:5000/loimoi/${item._id}/reject`,
        {
          method: "DELETE",
        }
      );

      alert("Đã từ chối");

      // ❗ cập nhật UI ngay
      setInvitations((prev) =>
        prev.filter((i) => i._id !== item._id)
      );

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="loimoi-content">
      {isCreating && (
        <div className="taonhom-overlay">
          <div className="taonhom-backdrop" onClick={() => setIsCreating(false)}></div>
          <div className="taonhom-popup-container">
            <ContentTaonhom onCancel={() => setIsCreating(false)} />
          </div>
        </div>
      )}

      <div className="loimoi-header-main">
        {/* TITLE */}
        <div>
          <h2>Lời mời tham gia nhóm</h2>
          <p>Bạn có <span>4</span> lời mời mới từ các cộng đồng leo núi và trekking.</p>
        </div>
        <button className="btn-create-group" onClick={() => setIsCreating(true)}>
          <UserPlus size={18} /> Tạo nhóm mới
        </button>
      </div>
      <div className="loimoi-grid">
        {/* DANH SÁCH LỜI MỜI */}
        <div className="loimoi-list">
          {invitations.map((item) => (
            <div className="invite-card" key={item._id}>

              {/* IMAGE */}
              <div className="invite-image">
                <img
                  src={
                    item.doiTacId?.image
                      ? `http://localhost:5000/${item.doiTacId.image}`
                      : "/img/default.jpg"
                  }
                  alt="place"
                />
              </div>

              {/* CONTENT */}
              <div className="invite-content">

                {/* TITLE */}
                <div className="invite-title-row">
                  <h3>{item.nhomId?.ten}</h3>

                  <span className="invite-price">
                    {item.nhomId?.thanhVien?.length || 0} / {item.nhomId?.soLuong} người
                  </span>
                </div>

                {/* META */}
                <div className="invite-meta">
                  <span>
                    📍 {item.nhomId?.diaDiem?.tenDiaDiem || "Chưa rõ"}
                  </span>

                  <span>
                    👤 {item.nhomId?.nguoiTao?.hoTen}
                  </span>
                </div>

                {/* GUIDE */}
                <div className="invite-sender">
                  <div className="sender-avatar">
                    <img
                      src={
                        item.doiTacId?.image
                          ? `http://localhost:5000/${item.doiTacId.image}`
                          : "/img/default.jpg"
                      }
                      alt="avatar"
                    />
                  </div>

                  <div className="sender-info">
                    <label>HƯỚNG DẪN VIÊN</label>
                    <p>{item.doiTacId?.hoTen}</p>
                  </div>
                </div>

                {/* ACTION */}
                <div className="invite-actions">
                  <button
                    className="btn-accept"
                    onClick={() => handleAccept(item)}
                  >
                    ✔ Chấp nhận
                  </button>

                  <button
                    className="btn-decline"
                    onClick={() => handleReject(item)}
                  >
                    ✖ Từ chối
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* THỐNG KÊ & GỢI Ý */}
        <div className="loimoi-sidebar">
          <div className="stat-box">
            <h4>Thống kê tháng 10</h4>
            <div className="stat-row">
              <div className="stat-item">
                <label>LỜI MỜI MỚI</label>
                <div className="stat-value">12</div>
              </div>
              <div className="stat-item">
                <label>ĐÃ XÁC NHẬN</label>
                <div className="stat-value">04</div>
              </div>
            </div>
          </div>

          <div className="suggestion-box">
            <label className="suggest-label">Gợi ý cho bạn</label>
            <div className="suggest-item">
              <div className="suggest-icon"><ShieldCheck size={18} /></div>
              <div>
                <h5>Nâng cấp Hồ sơ Hướng dẫn...</h5>
                <p>Tăng 40% tỉ lệ nhận lời mời</p>
              </div>
            </div>
            <div className="suggest-item">
              <div className="suggest-icon blue"><Zap size={18} /></div>
              <div>
                <h5>Bật chế độ Sẵn sàng</h5>
                <p>Nhận thông báo tức thì khi có nhóm mới</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* DANH SÁCH NHÓM */}
      <div className="my-groups-section">
        <div className="section-header">
          <h3>Nhóm của tôi</h3>
          <button className="view-all" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Thu gọn" : "Xem tất cả"}
          </button>
        </div>
        <div className="my-groups-grid">
          <div className="group-mini-card">
            <div className="group-card-top">
              <div className="group-icon-circle">
                <Search size={18} color="#10b981" />
              </div>
              <div className="group-title-area">
                <h4>Khám Phá Hà Giang</h4>
                <span className="badge-role leader">TRƯỞNG NHÓM</span>
              </div>
            </div>

            <div className="group-card-body">
              <p className="group-location">
                <MapPin size={14} /> Đèo Mã Pì Lèng, Hà Giang
              </p>
              <div className="group-stat-row">
                <div className="stat-info">
                  <label>Tiếp theo:</label>
                  <span>22/10 | 07:00</span>
                </div>
              </div>
              <div className="stat-info">
                <label>Thành viên:</label>
                <span>12 người</span>
              </div>
            </div>
            <button className="btn-view-group">Xem chi tiết</button>
          </div>

          <div className="group-mini-card">
            <div className="group-card-top">
              <div className="group-icon-circle">
                <Trees size={20} color="#10b981" />
              </div>
              <div className="group-title-area">
                <h4>Cắm Trại Đà Lạt</h4>
                <span className="badge-role leader">THÀNH VIÊN</span>
              </div>
            </div>
            <div className="group-card-body">
              <p className="group-location"><MapPin size={14} /> Hồ Tuyền Lâm, Đà Lạt</p>
              <div className="group-stat-row">
                <div className="stat-info">
                  <label>Tiếp theo:</label>
                  <span>25/10 | 16:00</span>
                </div>
              </div>
              <div className="stat-info">
                <label>Thành viên:</label>
                <span>15 người</span>
              </div>
            </div>
            <button className="btn-view-group">Xem chi tiết</button>
          </div>

          {!showAll && (
            <div className="find-more-card">
              <div className="sparkle-icon-circle">
                <Sparkles size={28} />
              </div>
              <h4>Tìm kiếm thêm?</h4>
              <p>Khám phá hàng trăm nhóm khác đang chờ bạn.</p>
              <button
                className="btn-view-all-community"
                onClick={() => setShowAll(true)}
              >
                XEM TẤT CẢ CỘNG ĐỒNG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentLoimoinhom;