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
      message: currentInput
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

  return (
    <div className="nhomchat">
      {/* ===== LEFT SIDEBAR ===== */}
      <div className="sidebar-nhomchat">
        <div className="header-sidebar-nhomchat">
          <div className="icon-group-nhomchat">🏔</div>
          <div>
            <h3>{groupData.ten}</h3>
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
            <button className="btn-checkin"><span>➡️</span>CHECK IN</button>
            <button className="btn-checkout"><span>⬅️</span>CHECK OUT</button>
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