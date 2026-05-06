import React, { useState, useEffect } from "react";
import ContentTaonhom from './ContentTaonhom';
import { UserPlus, Check, X, MapPin, Calendar, Users, ShieldCheck, Zap, Search, Trees, Sparkles } from "lucide-react";

const ContentLoimoinhom = () => {
  const [showAll, setShowAll] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [invitations, setInvitations] = useState([]);

  const [stats, setStats] = useState({ moi: 0, daChapNhan: 0 });

  const [myGroups, setMyGroups] = useState([]);

  // sắp xếp mới nhất trước
  const sortedInvitations = [...invitations].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  //  chỉ hiển thị 3 hoặc tất cả
  const displayedInvitations = showAll
    ? sortedInvitations
    : sortedInvitations.slice(0, 3);

  const sortedGroups = [...myGroups].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const displayedGroups = showAll
    ? sortedGroups
    : sortedGroups.slice(0, 3);

  const currentMonth = new Date().getMonth() + 1;



  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        console.log("USER:", user);

        // 🔥 FIX CHUẨN
        const doiTacId = user?.doiTacId;

        if (!doiTacId) {
          console.error("❌ Không có doiTacId chuẩn");
          return;
        }
        console.log(user);

        if (!doiTacId) {
          console.error("Không có doiTacId");
          return;
        }

        const res = await fetch(
          `http://localhost:5000/loimoi?doiTacId=${doiTacId}`
        );

        const text = await res.text();
        console.log("RAW RESPONSE:", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Response không phải JSON!");
        }
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
        { method: "POST" }
      );

      // ❗ remove khỏi list
      setInvitations(prev => prev.filter(i => i._id !== item._id));

      // 🔥 GỌI LẠI THỐNG KÊ
      fetchThongKe();

      // 🔥 LOG RESPONSE THÔ
      console.log("RESPONSE:", res);

      const data = await res.json();

      // 🔥 LOG DATA
      console.log("DATA:", data);

      // 🔥 LOG NHOM ID
      console.log("NHOM ID:", data.nhomId);

      if (!data.nhomId) {
        console.error("❌ nhomId bị undefined");
        return;
      }

      window.location.href = `/nhomchat/${data.nhomId}`;

    } catch (err) {
      console.error("ERROR:", err);
    }
  };
  // const handleAccept = async (item) => {
  //   try {
  //     const res = await fetch(
  //       `http://localhost:5000/loimoi/${item._id}/accept`,
  //       {
  //         method: "POST",
  //       }
  //     );

  //     const data = await res.json();

  //     setInvitations(prev => prev.filter(i => i._id !== item._id));

  //     alert("Đã tham gia nhóm!");
  //     console.log("DATA:", data);
  //     console.log("NHOM ID:", data.nhomId);

  //     // ❗ chuyển sang chat
  //     window.location.href = `/nhomchat/${data.nhomId}`;

  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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

  useEffect(() => {
    const fetchStats = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const doiTacId = user?.doiTacId || user?.id;

      const res = await fetch(
        `http://localhost:5000/loimoi/thongke?doiTacId=${doiTacId}`
      );

      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchMyGroups = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      const res = await fetch(
        `http://localhost:5000/nhom/cuatoi/${userId}`
      );

      const data = await res.json();
      setMyGroups(data.nhoms || []);
    };

    fetchMyGroups();
  }, []);

  const fetchThongKe = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const doiTacId = user?.doiTacId || user?.id;

      const res = await fetch(
        `http://localhost:5000/loimoi/thongke?doiTacId=${doiTacId}`
      );

      const data = await res.json();
      setStats(data);

    } catch (err) {
      console.error("Lỗi thống kê:", err);
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
        <div className="loimoi-header">
          <div>
            <h2>Lời mời tham gia nhóm</h2>
            <p>
              Bạn có <span>{invitations.length}</span> lời mời mới...
            </p>
          </div>

          {invitations.length > 3 && (
            <button
              className="view-all-btn"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Thu gọn" : "Xem tất cả"}
            </button>
          )}
        </div>
        <button className="btn-create-group" onClick={() => setIsCreating(true)}>
          <UserPlus size={18} /> Tạo nhóm mới
        </button>
      </div>
      <div className="loimoi-grid">
        {/* DANH SÁCH LỜI MỜI */}
        <div className="loimoi-list">
          {displayedInvitations.map((item) => (
            <div className="invite-card" key={item._id}>

              {/* IMAGE */}
              <div className="invite-image">
                <img
                  src={
                    item.doiTacId?.image
                      ? `http://localhost:5173/${item.nhomId.diaDiem.image}`
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
            <h4>Thống kê tháng {currentMonth}</h4>

            <div className="stat-row flex gap-4">

              <div className="stat-item flex flex-col items-center justify-center">
                <label className="text-sm text-green-200">LỜI MỜI MỚI</label>
                <div className="stat-value text-3xl font-bold text-white">
                  {stats.moi}
                </div>
              </div>

              <div className="stat-item flex flex-col items-center justify-center">
                <label className="text-sm text-green-200">ĐÃ XÁC NHẬN</label>
                <div className="stat-value text-3xl font-bold text-white">
                  {stats.daChapNhan}
                </div>
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
          {displayedGroups.map(group => (
            <div className="group-mini-card" key={group._id}>

              <div className="group-card-top">
                <div className="group-title-area">
                  <h4>{group.ten}</h4>
                </div>
              </div>

              <div className="group-card-body">
                <p className="group-location">
                  📍 {group.diaDiem?.tenDiaDiem}
                </p>

                <p className="text-white">
                  👤 {group.nguoiTao?.id?.hoTen || "Không rõ"}
                </p>

                <p className="text-white">
                  🕒 {group.startTime
                    ? new Date(group.startTime).toLocaleString("vi-VN")
                    : "Chưa có thời gian"}
                </p>

                <div className="stat-info">
                  <label>Thành viên:</label>
                  <span>{group.thanhVien.length} người</span>
                </div>
              </div>

              <button
                className="btn-view-group"
                onClick={() => window.location.href = `/nhomchat/${group._id}`}
              >
                Xem chi tiết
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentLoimoinhom;