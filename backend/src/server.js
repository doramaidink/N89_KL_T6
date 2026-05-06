const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const port = 5000;
const app = express();
const db = require('./config/db');
const route = require('./routes');

// Import Model Chat
const Chat = require('./models/Chat');
const { kiemDuyetNoiDung } = require("./services/aiKiemDuyetService");
const NguoiDung = require("./models/NguoiDung");

dotenv.config();

// --- MIDDLEWARE ---
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

// --- CẤU HÌNH STATIC FILES (SỬA LẠI TẠI ĐÂY) ---
// Đảm bảo rằng đường dẫn này trỏ thẳng đến thư mục chứa các folder 'chư nâm', 'núi bằng am'
// Nếu thư mục 'public' nằm ngang hàng với thư mục 'src', dùng path.join(__dirname, '../public')
app.use(express.static(path.join(__dirname, '../public')));

//truy cập trực tiếp qua /img/... như trong database
app.use('/img', express.static(path.join(__dirname, '../public/img')));

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
// --- KHỞI TẠO ROUTES ---
route(app);

// Tạo HTTP Server và Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

// --- LOGIC SOCKET.IO ---
io.on("connection", (socket) => {
  console.log("⚡ Người dùng kết nối:", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data.groupId);

    console.log(
      data.vaiTro === "doiTac"
        ? `🌟 HDV vào nhóm: ${data.groupId}`
        : `👤 User vào nhóm: ${data.groupId}`
    );
  });

 socket.on("send_message", async (data) => {
  try {
    const {
      groupId,
      senderId,
      senderName,
      message,
      vaiTro,
      hinhAnh = []
    } = data;

    // ===== KIỂM DUYỆT AI =====
    const ketQua = await kiemDuyetNoiDung(message, hinhAnh);

    if (!ketQua.hopLe) {
      socket.emit("message_blocked", {
        message: ketQua.lyDo
      });
 
      return;
    }

    // ===== LƯU DB =====
    const newMessage = await Chat.create({
      nhomId: groupId,
      senderId,
      hoTen: senderName,
      noiDung: message,
      hinhAnh
    });

    // ===== GỬI CHO NHÓM =====
    io.to(groupId).emit("receive_message", newMessage);

  } catch (err) {
    console.log(err);
  }
});
  socket.on("new_member_joined", (data) => {
    io.to(data.groupId).emit("update_member_list");
  });

  socket.on("disconnect", () => {
    console.log("❌ Người dùng ngắt kết nối:", socket.id);
  });
});

// --- KẾT NỐI DB VÀ CHẠY SERVER ---
db.connectDB().then(() => {
  server.listen(port, () => {
    console.log(`✅ Server đang chạy tại: http://localhost:${port}`);
  });
});