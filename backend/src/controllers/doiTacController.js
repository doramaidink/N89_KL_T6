const DoiTac = require('../models/DoiTac');
const NguoiDung = require('../models/NguoiDung');
const DiaDiem = require('../models/DiaDiem');
const ThanhToan = require('../models/ThanhToan');
const DanhGiaDiaDiem = require('../models/DanhGiaDiaDiem');

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
      const DoiTac = require('../models/DoiTac');
      const NguoiDung = require('../models/NguoiDung');

      const TINH_MIEN_TRUNG = [
        'Tỉnh Thanh Hóa',
        'Tỉnh Nghệ An',
        'Tỉnh Hà Tĩnh',
        'Tỉnh Quảng Bình',
        'Tỉnh Quảng Trị',
        'Tỉnh Thừa Thiên Huế',
        'Thành phố Đà Nẵng',
        'Tỉnh Quảng Nam',
        'Tỉnh Quảng Ngãi',
        'Tỉnh Bình Định',
        'Tỉnh Phú Yên',
        'Tỉnh Khánh Hòa',
        'Tỉnh Ninh Thuận',
        'Tỉnh Bình Thuận',
      ];

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
      if (!tinhDangKy || !TINH_MIEN_TRUNG.includes(tinhDangKy)) {
        return res.status(400).json({
          message: 'Tỉnh/thành đăng ký chỉ được thuộc miền Trung Việt Nam'
        });
      }

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
  async dashboard(req, res) {
    try {
      const { slug } = req.params;
      // console.log("PARAM SLUG:", slug);

      const doiTac = await DoiTac.findOne({ nguoiDung: slug });
      // console.log("DOITAC FOUND:", doiTac);

      if (!doiTac) {
        return res.status(404).json({ message: 'Không tìm thấy đối tác' });
      }

      const now = new Date();
      const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const paymentsMonth = await ThanhToan.find({
        guideName: doiTac.hoTen,
        status: 'paid',
        createdAt: { $gte: startMonth }
      }).sort({ createdAt: 1 });

      const tongThuNhapThang = paymentsMonth.reduce((sum, item) => sum + Number(item.amount || 0), 0);

      const allPaid = await ThanhToan.find({
        guideName: doiTac.hoTen,
        status: 'paid'
      });

      const allPending = await ThanhToan.find({
        guideName: doiTac.hoTen,
        status: 'pending'
      }).sort({ createdAt: -1 }).limit(5);

      let diemTrungBinh = 0;
      let tongDanhGia = 0;

      if (doiTac.cacDiaDiemDangKy?.length > 0) {
        const locationIds = doiTac.cacDiaDiemDangKy.map(x => x._id);

        const ratingAgg = await DanhGiaDiaDiem.aggregate([
          {
            $match: {
              diaDiem: { $in: locationIds },
              trangThai: 'hien'
            }
          },
          {
            $group: {
              _id: null,
              tong: { $sum: 1 },
              avg: { $avg: '$soSao' }
            }
          }
        ]);

        tongDanhGia = ratingAgg[0]?.tong || 0;
        diemTrungBinh = ratingAgg[0]?.avg ? Number(ratingAgg[0].avg.toFixed(1)) : 0;
      }

      const miniChart = [];
      for (let i = 5; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

        const monthRevenue = await ThanhToan.aggregate([
          {
            $match: {
              guideName: doiTac.hoTen,
              status: 'paid',
              createdAt: { $gte: start, $lt: end }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        miniChart.push({
          value: monthRevenue[0]?.total || 0
        });
      }

      return res.status(200).json({
        doiTac: {
          hoTen: doiTac.hoTen,
          image: doiTac.image,
        },
        stats: {
          tongThuNhapThang,
          diemTrungBinh,
          tongDanhGia,
          yeuCauMoi: allPending.length,
        },
        miniChart,
        yeuCauGanDay: allPending.map((item) => ({
          id: item._id,
          khachHang: `Đơn #${item.orderCode}`,
          viTri: doiTac.cacDiaDiemDangKy?.[0]?.tenDiaDiem || 'Chưa rõ',
          ngayDat: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '',
          trangThai: item.status === 'pending' ? 'Đang chờ' : 'Đã xác nhận'
        }))
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server khi lấy dashboard đối tác' });
    }
  }

  async layHoSo(req, res) {
    try {
      const { slug } = req.params;

      const doiTac = await DoiTac.findOne({ slug })
        .populate('cacDiaDiemDangKy', 'tenDiaDiem');

      if (!doiTac) {
        return res.status(404).json({ message: 'Không tìm thấy hồ sơ đối tác' });
      }

      return res.status(200).json({
        doiTac
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server khi lấy hồ sơ đối tác' });
    }
  }

  async capNhatHoSo(req, res) {
    try {
      const { slug } = req.params;
      const {
        hoTen,
        soDienThoai,
        diaChi,
        tinhDangKy,
        soNamKinhNghiem,
        gioiThieuBanThan,
        ngonNguHoTro,
        kinhNghiem,
        giaThue
      } = req.body;

      const doiTac = await DoiTac.findOne({ slug });
      if (!doiTac) {
        return res.status(404).json({ message: 'Không tìm thấy đối tác' });
      }

      doiTac.hoTen = hoTen ?? doiTac.hoTen;
      doiTac.soDienThoai = soDienThoai ?? doiTac.soDienThoai;
      doiTac.diaChi = diaChi ?? doiTac.diaChi;
      doiTac.tinhDangKy = tinhDangKy ?? doiTac.tinhDangKy;
      doiTac.soNamKinhNghiem = Number(soNamKinhNghiem ?? doiTac.soNamKinhNghiem);
      doiTac.gioiThieuBanThan = gioiThieuBanThan ?? doiTac.gioiThieuBanThan;
      doiTac.ngonNguHoTro = typeof ngonNguHoTro === 'string'
        ? ngonNguHoTro.split(',').map(x => x.trim()).filter(Boolean)
        : (ngonNguHoTro || doiTac.ngonNguHoTro);
      doiTac.kinhNghiem = kinhNghiem ?? doiTac.kinhNghiem;
      doiTac.giaThue = Number(giaThue ?? doiTac.giaThue);

      await doiTac.save();

      await NguoiDung.findByIdAndUpdate(doiTac.nguoiDung, {
        hoTen: doiTac.hoTen,
        image: doiTac.image
      });

      return res.status(200).json({
        message: 'Cập nhật hồ sơ thành công',
        doiTac
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server khi cập nhật hồ sơ đối tác' });
    }
  }

  async layDiaDiemCuaDoiTac(req, res) {
    try {
      const { slug } = req.params;

      const doiTac = await DoiTac.findOne({ slug })
        .populate('cacDiaDiemDangKy', 'tenDiaDiem khuVuc doKho veVao image images slug');

      if (!doiTac) {
        return res.status(404).json({ message: 'Không tìm thấy đối tác' });
      }

      return res.status(200).json({
        locations: doiTac.cacDiaDiemDangKy || []
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server khi lấy địa điểm của đối tác' });
    }
  }

  async themDiaDiem(req, res) {
    try {
      const { slug } = req.params;
      const {
        tenDiaDiem,
        moTa,
        gioiThieu,
        doKho,
        veVao,
        quangduong,
        khuVuc,
        tinh,
        dacDiemDiaDanh = [],
        images = [],
        image = ''
      } = req.body;

      const doiTac = await DoiTac.findOne({ slug });
      if (!doiTac) {
        return res.status(404).json({ message: 'Không tìm thấy đối tác' });
      }

      const diaDiem = await DiaDiem.create({
        tenDiaDiem,
        moTa,
        gioiThieu: Array.isArray(gioiThieu) ? gioiThieu : [gioiThieu].filter(Boolean),
        doKho,
        veVao,
        quangduong,
        khuVuc,
        tinh,
        dacDiemDiaDanh: Array.isArray(dacDiemDiaDanh) ? dacDiemDiaDanh : [],
        images: Array.isArray(images) ? images : [],
        image
      });

      doiTac.cacDiaDiemDangKy.push(diaDiem._id);
      await doiTac.save();

      return res.status(201).json({
        message: 'Thêm địa điểm thành công',
        diaDiem
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server khi thêm địa điểm' });
    }
  }
  async layHoSo(req, res) {
    try {
      const { slug } = req.params;

      const doiTac = await DoiTac.findOne({ slug })
        .populate('cacDiaDiemDangKy', 'tenDiaDiem image images');

      if (!doiTac) {
        return res.status(404).json({ message: 'Không tìm thấy hồ sơ đối tác' });
      }

      return res.status(200).json({ doiTac });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server khi lấy hồ sơ đối tác' });
    }
  }
}
module.exports = new doiTacController();