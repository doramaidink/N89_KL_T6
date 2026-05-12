const mongoose = require('mongoose');
require('dotenv').config();

const NguoiDung = require('./models/NguoiDung');
const DoiTac = require('./models/DoiTac');

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

    // =========================
    // TẠO NGƯỜI DÙNG 1
    // =========================
    const nguoiDung1Id = new mongoose.Types.ObjectId();
    const doiTac1Id = new mongoose.Types.ObjectId();

    const nguoiDung1 = await NguoiDung.create({
      _id: nguoiDung1Id,
      slug: nguoiDung1Id.toString(),

      hoTen: 'Trần Hoài',
      email: 'tranhoainemaycha@gmail.com',
      matKhau: '123456',
      ngaysinh: new Date('2001-05-12'),
      vaiTro: 'doiTac',
      trangThai: 'active',
      soDienThoai: '0901634631',
      image: 'img/huongdanvien/huongdanvien9/face.jpg',

      daDongYDieuKhoan: true,
      thoiDiemDongYDieuKhoan: new Date(),
      phienBanDieuKhoan: 'v1.0',
    });

    await DoiTac.create({
      _id: doiTac1Id,
      slug: doiTac1Id.toString(),

      nguoiDung: nguoiDung1._id,

      hoTen: 'Trần Hoài',
      soDienThoai: '0901634631',
      soCCCD: '063254151289',
      ngaySinh: new Date('2001-05-12'),
      diaChi: '25 trần Tịnh - Huế',
      queQuan: 'Huế',
      tinhDangKy: 'Huế',

      image: 'img/huongdanvien/huongdanvien9/face.jpg',
      thuMucAnh: 'img/huongdanvien',
      anhCCCDMatTruoc: 'img/huongdanvien/huongdanvien9/face.jpg',
      anhCCCDMatSau: 'img/huongdanvien/huongdanvien9/face.jpg',
      anhKhuonMat: 'img/huongdanvien/huongdanvien9/face.jpg',

      lyLichTuPhap: '',
      gioiThieuBanThan: 'Hướng dẫn viên chuyên hikking',
      kyNangDacBiet: [ 'nhiếp ảnh'],
      ngonNguHoTro: ['Tiếng Việt', 'English'],
      kinhNghiem: '4 năm dẫn tour miền Trung',
      soNamKinhNghiem: 4,
      giaThue: 500000,

      cacDiaDiemDangKy: [
        new mongoose.Types.ObjectId('69dbbd91b00ae5b5b701a349'),
      ],

      diaDiemGiaCa: [
        {
          diaDiem: new mongoose.Types.ObjectId('69dbbd91b00ae5b5b701a349'),
          mucGia: 200000,
          kinhNghiem: 'Đã dẫn 3 tour',
        },  
      ],

      faceMatched: true,
      faceDistance: 0.3,
      verificationStatus: 'da_xac_thuc',
      trangThaiHoSo: 'da_duyet',
      lyDoTuChoi: '',
      ngayDuyet: new Date(),
    });

    // =========================
    // TẠO NGƯỜI DÙNG 2
    // =========================
    const nguoiDung2Id = new mongoose.Types.ObjectId();
    const doiTac2Id = new mongoose.Types.ObjectId();

    const nguoiDung2 = await NguoiDung.create({
      _id: nguoiDung2Id,
      slug: nguoiDung2Id.toString(),

      hoTen: 'Đinh Thị Anh',
      email: 'thianh24@gmail.com',
      matKhau: '123456',
      ngaysinh: new Date('2002-08-20'),
      vaiTro: 'doiTac',
      trangThai: 'active',
      soDienThoai: '0222366527',
      image: 'img/huongdanvien/huongdanvien10/face.jpg',

      daDongYDieuKhoan: true,
      thoiDiemDongYDieuKhoan: new Date(),
      phienBanDieuKhoan: 'v1.0',
    });

    await DoiTac.create({
      _id: doiTac2Id,
      slug: doiTac2Id.toString(),

      nguoiDung: nguoiDung2._id,

      hoTen: 'Đinh Thị Anh',
      soDienThoai: '0222366527',
      soCCCD: '065654321098',
      ngaySinh: new Date('2002-08-20'),
      diaChi: '22 Văn An - Gia Lai',
      queQuan: 'Gia Lai',
      tinhDangKy: 'Gia Lai',

      image: 'img/huongdanvien/huongdanvien10/face.jpg',
      thuMucAnh: 'img/huongdanvien',
      anhCCCDMatTruoc: 'img/huongdanvien/huongdanvien10/face.jpg',
      anhCCCDMatSau: 'img/huongdanvien/huongdanvien10/face.jpg',
      anhKhuonMat: 'img/huongdanvien/huongdanvien10/face.jpg',

      lyLichTuPhap: '',
      gioiThieuBanThan: 'Chuyên tour Chilling',
      kyNangDacBiet: ['hướng dẫn Chilling'],
      ngonNguHoTro: ['Tiếng Việt'],
      kinhNghiem: '3 năm',
      soNamKinhNghiem: 3,

      cacDiaDiemDangKy: [
        new mongoose.Types.ObjectId('69d69b89b44af2d624e6a095'),
         new mongoose.Types.ObjectId('69d69b89b44af2d624e6a096'),
     
      ],

      diaDiemGiaCa: [
        {
          diaDiem: new mongoose.Types.ObjectId('69d69b89b44af2d624e6a095'),
          mucGia: 200000,
          kinhNghiem: 'Đã dẫn 5+ tour',
        },
        {
          diaDiem: new mongoose.Types.ObjectId('69d69b89b44af2d624e6a096'),
          mucGia: 300000,
          kinhNghiem: 'Đã dẫn 5+ tour',
        },
      ],

      faceMatched: true,
      faceDistance: 0.25,
      verificationStatus: 'da_xac_thuc',
      trangThaiHoSo: 'da_duyet',
      lyDoTuChoi: '',
      ngayDuyet: new Date(),
    });

    console.log('🎉 Import NguoiDung + DoiTac thành công');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi import:', err);
    process.exit(1);
  }
}

importData();