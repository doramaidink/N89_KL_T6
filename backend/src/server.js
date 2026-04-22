const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const http = require('http'); // [MỚI] Thư viện http để chạy Socket.io
const { Server } = require("socket.io"); // [MỚI] Socket.io

const port = 5000;
const app = express();
const db = require('./config/db');
const route = require('./routes');
const { env } = require('process');

// [MỚI] Import Model Chat để lưu tin nhắn vào Database
const Chat = require('./models/Chat');

dotenv.config();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({
  extended: true
}));

app.use(cors({ origin: "http://localhost:5173" }));

// Cấu hình Static Files
app.use('/img', express.static(path.join(__dirname, '../public/img')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Khởi tạo Routes
route(app);

// [CẤU HÌNH QUAN TRỌNG]: Tạo HTTP Server để bọc App Express
const server = http.createServer(app);

// [CẤU HÌNH QUAN TRỌNG]: Khởi tạo Socket.io trên Server này
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// --- LOGIC SOCKET.IO (CHAT REALTIME) ---
io.on("connection", (socket) => {
  console.log("⚡ Người dùng kết nối:", socket.id);

  // Tham gia vào phòng chat riêng của từng nhóm (Room)
  socket.on("join_room", (groupId) => {
    socket.join(groupId);
    console.log(`👤 User vào phòng nhóm: ${groupId}`);
  });

  // Xử lý gửi tin nhắn và LƯU VÀO MONGODB
  socket.on("send_message", async (data) => {
    try {
      // data: { groupId, senderId, senderName, message }
      const newChat = await Chat.create({
        nhomId: data.groupId,
        senderId: data.senderId,
        hoTen: data.senderName,
        noiDung: data.message,
        thoiGian: new Date()
      });

      // Phát tin nhắn realtime tới tất cả người dùng trong phòng đó
      io.to(data.groupId).emit("receive_message", newChat);
      console.log(`📩 Tin nhắn từ ${data.senderName} gửi đến phòng ${data.groupId}`);
    } catch (err) {
      console.error("Lỗi lưu tin nhắn:", err);
    }

  });
  socket.on("new_member_joined", (data) => {
    // data: { groupId }
    io.to(data.groupId).emit("update_member_list");
  });

  socket.on("disconnect", () => {
    console.log("❌ Người dùng ngắt kết nối:", socket.id);
  });
});

// Kết nối DB và chạy Server (Sử dụng server.listen thay vì app.listen)
db.connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});