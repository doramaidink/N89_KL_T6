import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("http://localhost:5000");

const ContentNhomchat = ({ user }) => {



  const handleChangeCheckoutCode = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    const newCode = [...inputCheckoutCode];
    newCode[index] = value.slice(-1);

    setInputCheckoutCode(newCode);

    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }

    if (!value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };
  const handleChangeCode = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // chỉ cho số

    const newCode = [...inputCheckinCode];
    newCode[index] = value;

    setInputCheckinCode(newCode);

    // auto focus sang ô tiếp theo
    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const { groupId } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const chatEndRef = useRef(null);

  //checkin-checkout time
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [canCheckOut, setCanCheckOut] = useState(false);
  //Checkin-Checkout
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const [inputCheckinCode, setInputCheckinCode] = useState(["", "", "", "", "", ""]);
  const [inputCheckoutCode, setInputCheckoutCode] = useState(["", "", "", "", "", ""]);





  const handleCheckIn = () => {
    if (!inputCheckinCode) {
      alert("Nhập mã checkin");
      return;
    }

    if (!navigator.geolocation) {
      alert("Không hỗ trợ GPS");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const finalCode = inputCheckinCode.join("");
      const isValid = inputCheckinCode.every(d => d !== "");
      if (finalCode.length < 6) {
        alert("Nhập đủ 6 số");
        return;
      }

      const payload = {
        nhomId: groupId,
        userId: user._id || user.id,
        role: user.vaiTro === "doiTac" ? "hdv" : "user",
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        code: finalCode
      };

      console.log("🚀 CHECKIN PAYLOAD:", payload);

      try {
        await axios.post("http://localhost:5000/nhom/checkin", payload);
        alert("Checkin thành công");
        setShowCheckinModal(false);
      } catch (err) {
        console.log(err);

        alert(
          err.response?.data?.message || "Checkin lỗi"
        );
      }
    });
  };

  const handleCheckOut = async () => {
    const finalCode = inputCheckoutCode.join("");

    const isValid = inputCheckoutCode.every(d => d !== "");
    if (!isValid) {
      alert("Nhập đủ 6 số");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await axios.post("http://localhost:5000/nhom/checkout", {
          nhomId: groupId,
          userId: user._id || user.id,
          role: user.vaiTro === "doiTac" ? "hdv" : "user",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          code: finalCode
        });

        alert("Checkout thành công");
        setShowCheckoutModal(false);

        if (user.vaiTro === "doiTac") {
          window.location.href = "/doitac/:id/loimoinhom";
        } else {
          window.location.href = "/lichsuchuyendi";
        }
      } catch (err) {
        console.log(err);

        alert(
          err.response?.data?.message || "Checkout lỗi"
        );
      }
    });
  };

  useEffect(() => {
    if (!groupData) return;

    const checkTime = () => {
      const now = new Date();
      const start = new Date(groupData.startTime);
      const end = new Date(groupData.endTime);

      // Điều kiện mở nút Check-in: Khi đã đến hoặc sau giờ khởi hành
      // Bạn có thể chỉnh lại: now >= start
      setCanCheckIn(now >= start);

      // Điều kiện mở nút Check-out: Khi đã đến hoặc sau giờ kết thúc
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
        socketRef.current.emit("join_room", {
          groupId,
          vaiTro: user?.vaiTro
        });
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

    socketRef.current.on("update_member_list", handleUpdateMembers); //

    return () => {
      socketRef.current.off("update_member_list", handleUpdateMembers);
    };
  }, [groupId]);

  // 4. Lắng nghe tin nhắn mới từ Socket
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socketRef.current.on("receive_message", handleReceiveMessage); //

    return () => socket.off("receive_message", handleReceiveMessage);
  }, []);

  // 5. Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  //xử lý ảnh
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  const handleSelectImages = async (e) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 5);

    const base64Images = await Promise.all(
      validFiles.map((file) => fileToBase64(file))
    );

    setSelectedImages(base64Images);
    setPreviewImages(base64Images);
  };

  // 6. Hàm xử lý gửi tin nhắn
  const handleSend = () => {
    if ((!currentInput.trim() && selectedImages.length === 0) || !user) return;

    const msgData = {
      groupId,
      senderId: user.id || user._id,
      senderName: user.hoTen,
      message: currentInput.trim(),
      vaiTro: user.vaiTro,
      hinhAnh: selectedImages,
    };

    socketRef.current.emit("send_message", msgData);

    setCurrentInput("");
    setSelectedImages([]);
    setPreviewImages([]);
  };
  useEffect(() => {
    const handleBlocked = (data) => {
      alert(data.message || "Tin nhắn bị chặn vì vi phạm tiêu chuẩn cộng đồng.");
    };

    socketRef.current.on("message_blocked", handleBlocked);

    return () => {
      socketRef.current.off("message_blocked", handleBlocked);
    };
  }, []);
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
                <div className="bubble-nhomchat">
                  {m.noiDung && <div>{m.noiDung}</div>}

                  {Array.isArray(m.hinhAnh) && m.hinhAnh.length > 0 && (
                    <div className="chat-image-list">
                      {m.hinhAnh.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="Ảnh chat"
                          className="chat-image-item"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <span className="msg-time">
                  {new Date(m.thoiGian).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {previewImages.length > 0 && (
          <div className="chat-preview-images">
            {previewImages.map((img, index) => (
              <div className="chat-preview-item" key={index}>
                <img src={img} alt="preview" />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = previewImages.filter((_, i) => i !== index);
                    setPreviewImages(newImages);
                    setSelectedImages(newImages);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {/* INPUT CHAT */}
        <div className="input-wrapper-nhomchat">
          <div className="custom-input-group">
            <label className="btn-add-file">
              +
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleSelectImages}
              />
            </label>
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
              onClick={() => setShowCheckinModal(true)}
            >
              <span>➡️</span>CHECK IN
            </button>
            <button
              className={`btn-checkout ${!canCheckOut ? "disabled-btn" : ""}`}
              disabled={!canCheckOut}
              onClick={() => setShowCheckoutModal(true)}
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
                <p>{groupData.nguoiTao?.id?.hoTen}</p>
                <span className="member-role">Trưởng nhóm (Lead)</span>
              </div>
            </div>

            {/* 2. Hiển thị các thành viên khác */}
            {groupData.thanhVien?.map((member, index) => {
              // Chuẩn hóa dữ liệu
              const memberId = member.user?._id || member._id;
              const name = member.user?.hoTen || member.hoTen || "Ẩn danh";
              const image = member.user?.image || member.image;

              // tránh trùng trưởng nhóm
              if (memberId === groupData.nguoiTao?.id?._id) return null;

              return (
                <div className="member-item" key={`${memberId}-${index}`}>
                  <div className="member-avatar-wrapper">
                    <img
                      src={
                        image
                          ? `http://localhost:5000${image}`
                          : "/img/default-user.jpg"
                      }
                      alt={name}
                    />
                  </div>

                  <div className="member-info">
                    <p>{name}</p>

                    <span style={{ fontSize: "11px", color: "#4ade80" }}>
                      {member.role === "huong_dan_vien"
                        ? "🌟 Hướng dẫn viên"
                        : member.role === "truong_nhom"
                          ? "👑 Trưởng nhóm"
                          : "👤 Thành viên"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {showCheckinModal && (
        <div className="modal-overlay">
          <div className="modal-checkin">
            <button
              className="btn-close"
              onClick={() => setShowCheckinModal(false)}
            >
              ✖
            </button>
            <h2>TẠO MÃ CHECKIN</h2>

            {/* <div className="code-box">
              {checkinCode.split("").map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </div> */}
            <div className="code-input-group">
              {inputCheckinCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChangeCode(e, index)}
                  className="code-input-box"
                />
              ))}
            </div>

            <button onClick={handleCheckIn}>
              XÁC NHẬN
            </button>
          </div>

        </div>
      )}

      {showCheckoutModal && (
        <div className="modal-overlay">
          <div className="modal-checkin">
            <button
              className="btn-close"
              onClick={() => setShowCheckoutModal(false)}
            >
              ✖
            </button>
            <h2>NHẬP MÃ CHECKOUT</h2>

            <div className="code-input-group">
              {inputCheckoutCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChangeCheckoutCode(e, index)}
                  className="code-input-box"
                />
              ))}
            </div>

            <button onClick={handleCheckOut}>
              XÁC NHẬN
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default ContentNhomchat;