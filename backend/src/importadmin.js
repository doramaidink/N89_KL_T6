const mongoose = require('mongoose');
require('dotenv').config();

// ⚠️ sửa path cho đúng project của bạn
const QuanTriVien = require('./models/QuanTriVien');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log('✅ Kết nối MongoDB thành công');
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err);
    process.exit(1);
  }
}

async function importData() {
  try {
    await connectDB();

    // 🔥 check tồn tại trước (tránh lỗi duplicate)
    const existing = await QuanTriVien.findOne({
      email: 'admin2@backpacking.vn'
    });

    if (existing) {
      console.log('⚠️ Admin đã tồn tại rồi');
      await mongoose.connection.close();
      process.exit(0);
    }

    // ✅ tạo admin
    const admin = await QuanTriVien.create({
      hoTen: 'Admin hệ thống',
      email: 'admin2@backpacking.vn',
      matKhau: 'adminbackpacking',
      vaiTro: 'quanTriVien',
    });

    console.log('🎉 Import QuanTriVien thành công:', admin.email);

    // ✅ đóng kết nối
    await mongoose.connection.close();
    process.exit(0);

  } catch (err) {
    console.error('❌ Lỗi import:', err);
    await mongoose.connection.close();
    process.exit(1);
  }
}

importData();