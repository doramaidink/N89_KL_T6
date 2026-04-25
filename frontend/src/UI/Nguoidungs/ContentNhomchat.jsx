import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("http://localhost:5000");

const ContentNhomchat = ({ user }) => {
  const { groupId } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const chatEndRef = useRef(null);
  //Checkin-Checkout
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [canCheckOut, setCanCheckOut] = useState(false);

  useEffect(() => {
    if (!groupData) return;

    const checkTime = () => {
      const now = new Date();
      const start = new Date(groupData.startTime);
      const end = new Date(groupData.endTime);

      // ✅ Điều kiện mở nút Check-in: Khi đã đến hoặc sau giờ khởi hành
      // Bạn có thể chỉnh lại: now >= start
      setCanCheckIn(now >= start);

      // ✅ Điều kiện mở nút Check-out: Khi đã đến hoặc sau giờ kết thúc
      setCanCheckOut(now >= end);
    };

    checkTime(); // Kiểm tra ngay khi load dữ liệu nhóm
    const interval = setInterval(checkTime, 60000); // Kiểm tra lại mỗi phút (60000ms)

    return () => clearInterval(interval);
  }, [groupData]);

  // 1. Tách hàm initPage ra ngoài để có thể gọi từ bất kỳ useEffect nào
  const initPage = async () => {
    try {
      console.log("Đang tải dữ liệu cho nhóm ID:", groupId); // Kiểm tra log này ở Console
      const res = await axios.get(`http://localhost:5000/nhom/detail/${groupId}`);

      if (res.data.nhom) {
        setGroupData(res.data.nhom);
        setMessages(res.data.tinNhan || []);
        socket.emit("join_room", groupId);
      }
    } catch (err) {
      console.error("Lỗi API detail nhóm:", err);
      // Nếu lỗi, hãy thông báo cho người dùng thay vì để họ đợi mãi
      toast.error("Không thể tải thông tin nhóm!");
    }
  };

  // 2. Chạy initPage khi ID nhóm thay đổi (Vào trang lần đầu)
  useEffect(() => {
    if (groupId) {
      initPage();
    }
  }, [groupId]);

  // 3. Lắng nghe cập nhật danh sách thành viên Realtime
  useEffect(() => {
    const handleUpdateMembers = () => {
      console.log("⚡ Phát hiện thành viên mới tham gia, đang cập nhật danh sách...");
      initPage(); // Gọi lại hàm lấy dữ liệu để cập nhật bảng thành viên
    };

    socket.on("update_member_list", handleUpdateMembers); //

    return () => {
      socket.off("update_member_list", handleUpdateMembers);
    };
  }, [groupId]);

  // 4. Lắng nghe tin nhắn mới từ Socket
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage); //

    return () => socket.off("receive_message", handleReceiveMessage);
  }, []);

  // 5. Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 6. Hàm xử lý gửi tin nhắn
  const handleSend = () => {
    if (!currentInput.trim() || !user) return;

    const msgData = {
      groupId,
      senderId: user.id || user._id, // Ưu tiên ID từ login
      senderName: user.hoTen,        // Đảm bảo lấy đúng tên
      message: currentInput,
      vaiTro: user.vaiTro,
    };

    socket.emit("send_message", msgData); //
    setCurrentInput("");
  };

  if (!groupData) {
    return (
      <div className="loading-chat" style={{ color: 'white', textAlign: 'center', padding: '50px' }}>
        <div className="spinner"></div> {/* Thêm icon xoay nếu muốn */}
        <p>Đang tải dữ liệu hành trình...</p>
      </div>
    );
  }

  //Checkin-checkout tọa độ gps, tạo mã checkin, checkout
  // const handleCheckIn = () => {
  //   if (!navigator.geolocation) {
  //     toast.error("Trình duyệt không hỗ trợ định vị!");
  //     return;
  //   }

  //   // Lấy tọa độ hiện tại của người dùng
  //   navigator.geolocation.getCurrentPosition(async (position) => {
  //     const { latitude, longitude } = position.coords;

  //     try {
  //       // Giả sử bạn lấy vị trí đối tác từ thông tin member trong groupData
  //       // Ở đây tôi ví dụ gửi tọa độ người dùng lên, Backend sẽ so sánh với vị trí HDV
  //       const res = await axios.post("http://localhost:5000/nhom/checkin", {
  //         groupId: groupId,
  //         userLocation: { lat: latitude, lng: longitude },
  //         partnerLocation: { lat: 10.762622, lng: 106.660172 } // Tọa độ mẫu của HDV
  //       });

  //       // Sau khi thành công, hiện mã xác nhận
  //       alert(`Xác thực vị trí thành công! MÃ CHECKOUT CỦA NHÓM: ${res.data.code}`);
  //       initPage(); // Refresh để cập nhật trạng thái nút
  //     } catch (error) {
  //       toast.error(error.response?.data?.message || "Check-in thất bại!");
  //     }
  //   });
  // };

  // const handleCheckOut = async () => {
  //   const code = prompt("Vui lòng nhập mã Checkout gồm 6 chữ số:"); //
  //   if (!code) return;

  //   try {
  //     const res = await axios.post("http://localhost:5000/nhom/checkout", {
  //       groupId: groupId,
  //       inputCode: code
  //     });
  //     toast.success(res.data.message);
  //     initPage();
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Mã sai hoặc lỗi hệ thống!");
  //   }
  // };

  return (
    <div className="nhomchat">
      {/* ===== LEFT SIDEBAR ===== */}
      <div className="sidebar-nhomchat">
        <div className="header-sidebar-nhomchat">
          <div className="icon-group-nhomchat">🏔</div>
          <div>
            <h3>{groupData.ten}</h3>
            <div style={{
              fontSize: '13px',
              color: '#ffcc00',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>📍</span>
              {/* Kiểm tra groupData.diaDiem trước khi hiển thị */}
              {groupData?.diaDiem?.tenDiaDiem || "Đang tải địa điểm..."}
            </div>
            <span className="status-nhomchat">ĐANG HOẠT ĐỘNG</span>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">THAO TÁC NHANH</p>
          <div className="sidebar-item"><span>🔗</span> Mời thành viên</div>
          <div className="sidebar-item"><span>🖼</span> Kho ảnh nhóm</div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">THÔNG TIN CHUYẾN ĐI</p>
          <div className="sidebar-item"><span>📍</span> Điểm hẹn</div>
          <div className="sidebar-item"><span>📝</span> Mô tả chuyến đi</div>
          <div className="sidebar-item"><span>📋</span> Cam kết</div>
        </div>
      </div>

      {/* ===== CHAT MAIN CONTENT ===== */}
      <div className="chat-nhomchat">
        <div className="chat-header-info">HÔM NAY</div>

        <div className="chat-window">
          {messages.map((m, idx) => (
            <div key={idx} className={`msg ${m.senderId === user?.id ? "right-nhomchat" : "left-nhomchat"}`}>
              <div className="chat-avatar">👤</div>
              <div className="msg-content">
                {m.senderId !== user?.id && <p className="name-nhomchat">{m.hoTen}</p>}
                {m.senderRole === "huongDanVien" && (
                  <span style={{
                    fontSize: "10px",
                    color: "#4ade80",
                    fontWeight: "bold"
                  }}>
                    🌟 HDV
                  </span>
                )}
                <div className="bubble-nhomchat">{m.noiDung}</div>
                <span className="msg-time">
                  {new Date(m.thoiGian).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT CHAT */}
        <div className="input-wrapper-nhomchat">
          <div className="custom-input-group">
            <button className="btn-add-file">+</button>
            <input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhắn tin cho nhóm..."
            />
            <button className="btn-send-message" onClick={handleSend}>➤</button>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDEBAR ===== */}
      <div className="info-nhomchat">
        <div className="attendance-box">
          <p className="title-box-nhomchat">ĐIỂM DANH</p>
          <div className="attendance-buttons">
            <button
              className={`btn-checkin ${!canCheckIn ? "disabled-btn" : ""}`}
              disabled={!canCheckIn}
              onClick={() => {/* Xử lý checkin */ }}
            >
              <span>➡️</span>CHECK IN
            </button>
            <button
              className={`btn-checkout ${!canCheckOut ? "disabled-btn" : ""}`}
              disabled={!canCheckOut}
              onClick={() => {/* Xử lý checkout */ }}
            >
              <span>⬅️</span>CHECK OUT
            </button>
          </div>
        </div>

        <div className="box-nhomchat">
          <p className="title-box-nhomchat">HÀNH TRÌNH</p>
          <div className="trip-item-nhomchat">
            <div className="icon-circle-nhomchat">🚌</div>
            <div>
              <p className="trip-label">ĐỊA ĐIỂM TẬP TRUNG</p>
              <h4>{groupData?.lichTrinh?.timeStart || "08:00 AM"}</h4>
              <span>{groupData?.lichTrinh?.location || "Chưa cập nhật địa điểm"}</span>
            </div>
          </div>

          <div className="trip-item-nhomchat">
            <div className="icon-circle-nhomchat">🏁</div>
            <div>
              <p className="trip-label">ĐỊA ĐIỂM CHIA TAY</p>
              <h4>{groupData?.lichTrinh?.timeEnd || "05:00 PM"}</h4>
              <span>Hoàn thành hành trình</span>
            </div>
          </div>
        </div>

        <div className="box-nhomchat">
          <p className="title-box-nhomchat">
            THÀNH VIÊN ({groupData?.thanhVien?.length || 0})
          </p>
          <div className="member-list-nhomchat">

            {/* 1. Hiển thị Trưởng nhóm (Người tạo) */}
            <div className="member-item">
              <div className="member-avatar-wrapper">
                <img
                  src={groupData.nguoiTao?.id?.image ? `http://localhost:5000${groupData.nguoiTao.id.image}` : "/img/default-user.jpg"}
                  alt="Leader"
                />
                <div className="online-status"></div>
              </div>
              <div className="member-info">
                <p>{groupData.nguoiTao?.hoTen}</p>
                <span className="member-role">Trưởng nhóm (Lead)</span>
              </div>
            </div>

            {/* 2. Hiển thị các thành viên khác */}
            {groupData.thanhVien?.map((member) => {
              // Nếu là trưởng nhóm thì không hiển thị lại ở danh sách thành viên thường
              if (member._id === groupData.nguoiTao?.id?._id) return null;

              return (
                <div className="member-item" key={member._id}>
                  <div className="member-avatar-wrapper">
                    <img
                      src={member.image ? `http://localhost:5000${member.image}` : "/img/default-user.jpg"}
                      alt={member.hoTen}
                    />
                  </div>
                  <div className="member-info">
                    <p>{member.hoTen}</p>
                    <span style={{ fontSize: '11px', color: '#888' }}>Thành viên</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentNhomchat;