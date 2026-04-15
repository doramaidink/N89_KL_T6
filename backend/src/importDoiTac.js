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

      hoTen: 'Mai Lên Tuấn Kiệt',
      email: 'maikiet@gmail.com',
      matKhau: '123456',
      ngaysinh: new Date('1995-05-12'),
      vaiTro: 'doiTac',
      trangThai: 'active',
      soDienThoai: '0901634267',
      image: 'img/huongdanvien/huongdanvien7/face.jpg',

      daDongYDieuKhoan: true,
      thoiDiemDongYDieuKhoan: new Date(),
      phienBanDieuKhoan: 'v1.0',
    });

    await DoiTac.create({
      _id: doiTac1Id,
      slug: doiTac1Id.toString(),

      nguoiDung: nguoiDung1._id,

      hoTen: 'Mai Lê tuần Kiệt',
      soDienThoai: '0901634267',
      soCCCD: '063254155789',
      ngaySinh: new Date('1995-05-12'),
      diaChi: '23 Nguyễn Văn Trỗi - Đà Nẵng',
      queQuan: 'Đà Nẵng',
      tinhDangKy: 'Thanh Hóa',

      image: 'img/huongdanvien/huongdanvien7/face.jpg',
      thuMucAnh: 'img/huongdanvien',
      anhCCCDMatTruoc: 'img/huongdanvien/huongdanvien7/face.jpg',
      anhCCCDMatSau: 'img/huongdanvien/huongdanvien7/face.jpg',
      anhKhuonMat: 'img/huongdanvien/huongdanvien7/face.jpg',

      lyLichTuPhap: '',
      gioiThieuBanThan: 'Hướng dẫn viên chuyên trekking',
      kyNangDacBiet: ['leo núi', 'nhiếp ảnh'],
      ngonNguHoTro: ['Tiếng Việt', 'English'],
      kinhNghiem: '5 năm dẫn tour miền Trung',
      soNamKinhNghiem: 5,
      giaThue: 500000,

      cacDiaDiemDangKy: [
        new mongoose.Types.ObjectId('69dbbfcb0e54fe3dc1444f9e'),
        new mongoose.Types.ObjectId('69dbbfcb0e54fe3dc1444f9f'),
      ],

      diaDiemGiaCa: [
        {
          diaDiem: new mongoose.Types.ObjectId('69dbbfcb0e54fe3dc1444f9e'),
          mucGia: 200000,
          kinhNghiem: 'Đã dẫn 3 tour',
        },
        {
          diaDiem: new mongoose.Types.ObjectId('69dbbfcb0e54fe3dc1444f9f'),
          mucGia: 500000,
          kinhNghiem: 'Đã dẫn 5 tour',
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

      hoTen: 'Trần Thế Đức',
      email: 'trantheduc@gmail.com',
      matKhau: '123456',
      ngaysinh: new Date('1996-08-20'),
      vaiTro: 'doiTac',
      trangThai: 'active',
      soDienThoai: '0222366668',
      image: 'img/huongdanvien/huongdanvien8/face.jpg',

      daDongYDieuKhoan: true,
      thoiDiemDongYDieuKhoan: new Date(),
      phienBanDieuKhoan: 'v1.0',
    });

    await DoiTac.create({
      _id: doiTac2Id,
      slug: doiTac2Id.toString(),

      nguoiDung: nguoiDung2._id,

      hoTen: 'Trần Thế Đức',
      soDienThoai: '0222366668',
      soCCCD: '065654321098',
      ngaySinh: new Date('1996-08-20'),
      diaChi: '56 Thái Bằng- Quảng trị',
      queQuan: 'Quảng Trị',
      tinhDangKy: 'Ninh Thuận',

      image: 'img/huongdanvien/huongdanvien8/face.jpg',
      thuMucAnh: 'img/huongdanvien',
      anhCCCDMatTruoc: 'img/huongdanvien/huongdanvien8/face.jpg',
      anhCCCDMatSau: 'img/huongdanvien/huongdanvien8/face.jpg',
      anhKhuonMat: 'img/huongdanvien/huongdanvien8/face.jpg',

      lyLichTuPhap: '',
      gioiThieuBanThan: 'Chuyên tour sinh thái',
      kyNangDacBiet: ['hướng dẫn sinh tồn'],
      ngonNguHoTro: ['Tiếng Việt'],
      kinhNghiem: '3 năm',
      soNamKinhNghiem: 3,
      giaThue: 400000,

      cacDiaDiemDangKy: [
        new mongoose.Types.ObjectId('69dbc317beca0978b9c19bde'),
         new mongoose.Types.ObjectId('69dbbd91b00ae5b5b701a34a'),
     
      ],

      diaDiemGiaCa: [
        {
          diaDiem: new mongoose.Types.ObjectId('69dbc317beca0978b9c19bde'),
          mucGia: 200000,
          kinhNghiem: 'Đã dẫn 5+ tour',
        },
        {
          diaDiem: new mongoose.Types.ObjectId('69dbbd91b00ae5b5b701a34a'),
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