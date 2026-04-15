const DoiTac = require('../models/DoiTac');
const NguoiDung = require('../models/NguoiDung');

class doiTacController {
  async dangKyHuongDanVien(req, res) {
    try {
      const {
        nguoiDung,
        hoTen,
        soDienThoai,
        soCCCD,
        ngaySinh,
        diaChi,
        queQuan,
        tinhDangKy,
        gioiThieuBanThan,
        kyNangDacBiet,
        ngonNguHoTro,
        kinhNghiem,
        soNamKinhNghiem,
        giaThue,
        cacDiaDiemDangKy,
        diaDiemGiaCa
      } = req.body;

      if (!nguoiDung) {
        return res.status(400).json({ message: 'Thiếu id người dùng' });
      }

      const user = await NguoiDung.findById(nguoiDung);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      const daCoHoSo = await DoiTac.findOne({ nguoiDung });
      if (daCoHoSo) {
        return res.status(400).json({ message: 'Bạn đã gửi hồ sơ hướng dẫn viên rồi' });
      }

      if (!req.files?.anhCCCDMatTruoc?.[0]) {
        return res.status(400).json({ message: 'Thiếu ảnh CCCD mặt trước' });
      }

      if (!req.files?.anhCCCDMatSau?.[0]) {
        return res.status(400).json({ message: 'Thiếu ảnh CCCD mặt sau' });
      }

      if (!req.files?.anhKhuonMat?.[0]) {
        return res.status(400).json({ message: 'Thiếu ảnh selfie' });
      }

      const anhCCCDMatTruoc = `/img/huongdanvien/${req.files.anhCCCDMatTruoc[0].filename}`;
      const anhCCCDMatSau = `/img/huongdanvien/${req.files.anhCCCDMatSau[0].filename}`;
      const anhKhuonMat = `/img/huongdanvien/${req.files.anhKhuonMat[0].filename}`;
      const lyLichTuPhap = req.files?.lyLichTuPhap?.[0]
        ? `/img/huongdanvien/${req.files.lyLichTuPhap[0].filename}`
        : '';

      let dsDiaDiem = [];
      if (cacDiaDiemDangKy) {
        if (typeof cacDiaDiemDangKy === 'string') {
          try {
            dsDiaDiem = JSON.parse(cacDiaDiemDangKy);
          } catch (error) {
            dsDiaDiem = [];
          }
        } else {
          dsDiaDiem = cacDiaDiemDangKy;
        }
      }

      let dsKyNang = [];
      if (kyNangDacBiet) {
        dsKyNang = typeof kyNangDacBiet === 'string'
          ? kyNangDacBiet.split(',').map(item => item.trim()).filter(Boolean)
          : kyNangDacBiet;
      }

      let dsNgonNgu = [];
      if (ngonNguHoTro) {
        dsNgonNgu = typeof ngonNguHoTro === 'string'
          ? ngonNguHoTro.split(',').map(item => item.trim()).filter(Boolean)
          : ngonNguHoTro;
      }

      let dsDiaDiemGiaCa = [];
      if (diaDiemGiaCa) {
        if (typeof diaDiemGiaCa === 'string') {
          try {
            dsDiaDiemGiaCa = JSON.parse(diaDiemGiaCa);
          } catch (error) {
            dsDiaDiemGiaCa = [];
          }
        } else {
          dsDiaDiemGiaCa = diaDiemGiaCa;
        }
      }

      const hoSo = await DoiTac.create({
        nguoiDung,
        hoTen: hoTen || user.hoTen || '',
        soDienThoai: soDienThoai || user.soDienThoai || '',
        soCCCD,
        ngaySinh: ngaySinh || null,
        diaChi,
        queQuan,
        tinhDangKy,
        gioiThieuBanThan,
        kyNangDacBiet: dsKyNang,
        ngonNguHoTro: dsNgonNgu,
        kinhNghiem,
        soNamKinhNghiem: Number(soNamKinhNghiem || 0),
        giaThue: Number(giaThue || 0),

        cacDiaDiemDangKy: dsDiaDiem,
        diaDiemGiaCa: dsDiaDiemGiaCa,

        image: anhKhuonMat,
        thuMucAnh: 'img/huongdanvien',
        anhCCCDMatTruoc,
        anhCCCDMatSau,
        anhKhuonMat,
        lyLichTuPhap,

        verificationStatus: 'cho_xac_thuc',
        trangThaiHoSo: 'cho_duyet',
      });

      return res.status(201).json({
        message: 'Gửi hồ sơ thành công',
        data: hoSo
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Lỗi server khi đăng ký hướng dẫn viên'
      });
    }
  }

  async duyetHoSoHuongDanVien(req, res) {
    try {
      const { id } = req.params;

      const hoSo = await DoiTac.findById(id);
      if (!hoSo) {
        return res.status(404).json({ message: 'Không tìm thấy hồ sơ' });
      }

      hoSo.trangThaiHoSo = 'da_duyet';
      hoSo.ngayDuyet = new Date();
      await hoSo.save();

      await NguoiDung.findByIdAndUpdate(hoSo.nguoiDung, {
        vaiTro: 'doiTac',
        image: hoSo.image
      });

      return res.status(200).json({
        message: 'Duyệt hồ sơ thành công',
        data: hoSo
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server khi duyệt hồ sơ' });
    }
  }

  async layHuongDanVienTheoDiaDiem(req, res) {
    try {
      const { diaDiemId } = req.params;

      const ds = await DoiTac.find({
        trangThaiHoSo: 'da_duyet',
        cacDiaDiemDangKy: diaDiemId
      })
        .populate('nguoiDung', 'hoTen email image')
        .populate('cacDiaDiemDangKy', 'tenDiaDiem image')
        .sort({ createdAt: -1 });

      return res.status(200).json(ds);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server khi lấy hướng dẫn viên theo địa điểm' });
    }
  }
}

module.exports = new doiTacController();