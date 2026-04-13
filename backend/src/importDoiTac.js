const mongoose = require("mongoose");
const dotenv = require("dotenv");

const NguoiDung = require("./models/NguoiDung");
const DoiTac = require("./models/DoiTac");
const DiaDiem = require("./models/DiaDiem");

dotenv.config();

const dataDoiTac = [
  {
    hoTen: "Nguyễn Đinh Hài",
    email: "haidayne123@gmail.com",
    matKhau: "123456",
    soDienThoai: "0905903621",

    soCCCD: "201999999829",
    diaChi: "08 Cách Mạng Tháng Tám - Pleiku - Gia Lai",
    tinhDangKy: "Gia Lai",
    gioiThieuBanThan: "Hướng dẫn viên chuyên tour tây nguyên",
    kyNangDacBiet: ["tour nhóm", "hướng dẫn dễ hiểu"],
    ngonNguHoTro: ["vi"],
    kinhNghiem: "15 năm dẫn tour tại Gia Lai",
    soNamKinhNghiem: 15,
    giaThue: 300000,

    tenDiaDiems: ["Thác K50","Chư Nâm"],
  }
];

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối MongoDB thành công");

    for (const item of dataDoiTac) {
      const diaDiems = await DiaDiem.find({
        tenDiaDiem: { $in: item.tenDiaDiems }
      });

      if (diaDiems.length !== item.tenDiaDiems.length) {
        const timThay = diaDiems.map(d => d.tenDiaDiem);
        const chuaThay = item.tenDiaDiems.filter(
          ten => !timThay.includes(ten)
        );

        console.log(`❌ Không tìm thấy địa điểm cho ${item.email}:`, chuaThay);
        continue;
      }

      let user = await NguoiDung.findOne({ email: item.email });

      // Nếu chưa có user thì tạo mới
      if (!user) {
        user = await NguoiDung.create({
          hoTen: item.hoTen,
          email: item.email,
          matKhau: item.matKhau,
          soDienThoai: item.soDienThoai,
          vaiTro: "doiTac",
          trangThai: "active",
          slug: new mongoose.Types.ObjectId().toString(),
        });

        console.log(`✔️ Đã tạo tài khoản mới: ${item.email}`);
      } else {
        // Nếu đã có user thì cập nhật thành đối tác
        user.hoTen = item.hoTen || user.hoTen;
        user.soDienThoai = item.soDienThoai || user.soDienThoai;
        user.vaiTro = "doiTac";

        if (!user.slug) {
          user.slug = new mongoose.Types.ObjectId().toString();
        }

        await user.save();
        console.log(`✔️ Đã cập nhật tài khoản thành đối tác: ${item.email}`);
      }

      // Kiểm tra đã có hồ sơ đối tác chưa
      const doiTacDaTonTai = await DoiTac.findOne({ nguoiDung: user._id });

      if (doiTacDaTonTai) {
        doiTacDaTonTai.soCCCD = item.soCCCD;
        doiTacDaTonTai.diaChi = item.diaChi;
        doiTacDaTonTai.tinhDangKy = item.tinhDangKy;
        doiTacDaTonTai.gioiThieuBanThan = item.gioiThieuBanThan;
        doiTacDaTonTai.kyNangDacBiet = item.kyNangDacBiet;
        doiTacDaTonTai.ngonNguHoTro = item.ngonNguHoTro;
        doiTacDaTonTai.kinhNghiem = item.kinhNghiem;
        doiTacDaTonTai.soNamKinhNghiem = item.soNamKinhNghiem;
        doiTacDaTonTai.giaThue = item.giaThue;
        doiTacDaTonTai.cacDiaDiemDangKy = diaDiems.map(d => d._id);
        doiTacDaTonTai.trangThaiHoSo = "da_duyet";

        await doiTacDaTonTai.save();
        console.log(`✔️ Đã cập nhật hồ sơ đối tác: ${item.email}`);
      } else {
        await DoiTac.create({
          nguoiDung: user._id,
          slug: new mongoose.Types.ObjectId().toString(),
          soCCCD: item.soCCCD,
          diaChi: item.diaChi,
          tinhDangKy: item.tinhDangKy,
          gioiThieuBanThan: item.gioiThieuBanThan,
          kyNangDacBiet: item.kyNangDacBiet,
          ngonNguHoTro: item.ngonNguHoTro,
          kinhNghiem: item.kinhNghiem,
          soNamKinhNghiem: item.soNamKinhNghiem,
          giaThue: item.giaThue,
          cacDiaDiemDangKy: diaDiems.map(d => d._id),
          trangThaiHoSo: "da_duyet",
         
        });

        console.log(`✔️ Đã tạo hồ sơ đối tác: ${item.email}`);
      }
    }

    console.log("🎉 Import đối tác thành công");
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi import:", error);
    process.exit(1);
  }
}

importData();

// chạy: node src/importDoiTac.js