const QuanTriVien = require('../models/QuanTriVien');
const NguoiDung = require('../models/NguoiDung');
const DoiTac = require('../models/DoiTac');
const DiaDiem = require('../models/DiaDiem');
const BaoCao = require('../models/BaoCao');
function formatVeVao(value) {
  if (value === null || value === undefined || value === '') {
    return 'Miễn phí';
  }

  const text = String(value).trim().toLowerCase();

  if (
    text === '0' ||
    text === 'mien phi' ||
    text === 'miễn phí' ||
    text === 'free'
  ) {
    return 'Miễn phí';
  }

  const cleaned = text
    .replace(/vnđ|vnd/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '')
    .trim();

  const parsed = Number(cleaned);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return value;
  }

  return `${parsed.toLocaleString('vi-VN')} VNĐ`;
}
class QuanTriVienController {
  async thongke(req, res) {
    try {
      const { slug } = req.params;

      const admin = await QuanTriVien.findOne({ slug });
      if (!admin) {
        return res.status(404).json({
          message: 'Không tìm thấy quản trị viên'
        });
      }

      const tongNguoiDung = await NguoiDung.countDocuments();
      const tongDoiTac = await DoiTac.countDocuments();
      const tongDiaDiem = await DiaDiem.countDocuments();

      const tongTaiKhoanDaKhoa = await NguoiDung.countDocuments({
        trangThai: { $in: ['blocked', 'inactive', 'locked'] }
      });

      const tongDoiTacDungHopTac = await DoiTac.countDocuments({
        trangThaiHoSo: 'tu_choi'
      });

      const doiTacMoi = await DoiTac.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('hoTen image createdAt');

      const donDangKyChoDuyet = await DoiTac.countDocuments({
        trangThaiHoSo: 'cho_duyet'
      });

      const diaDiemChoDuyet = await DiaDiem.countDocuments({
        trangThai: 'cho_duyet'
      });

      // Thống kê 7 ngày gần nhất
      const today = new Date();
      const sevenDays = [];

      for (let i = 6; i >= 0; i--) {
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);
        start.setDate(today.getDate() - i);

        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        const soNguoiDungMoi = await NguoiDung.countDocuments({
          createdAt: { $gte: start, $lt: end }
        });

        const soDoiTacMoi = await DoiTac.countDocuments({
          createdAt: { $gte: start, $lt: end }
        });

        sevenDays.push({
          day: start.toLocaleDateString('vi-VN', { weekday: 'long' }),
          date: start.toLocaleDateString('vi-VN'),
          users: soNguoiDungMoi,
          partners: soDoiTacMoi,
          total: soNguoiDungMoi + soDoiTacMoi,
        });
      }

      return res.status(200).json({
        admin: {
          hoTen: admin.hoTen,
          email: admin.email,
          slug: admin.slug,
        },
        cards: {
          tongNguoiDung,
          tongDoiTac,
          tongTaiKhoanDaKhoa,
          tongDoiTacDungHopTac,
          tongDiaDiem,
          donDangKyChoDuyet,
          diaDiemChoDuyet,
        },
        chart: sevenDays,
        doiTacMoi,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Lỗi server khi lấy thống kê'
      });
    }
  }

  async donDangky(req, res) {
    try {
      const { slug } = req.params;

      const admin = await QuanTriVien.findOne({ slug });
      if (!admin) {
        return res.status(404).json({
          message: 'Không tìm thấy quản trị viên'
        });
      }

      const hoSoDangKy = await DoiTac.find({})
        .sort({ createdAt: -1 })
        .populate('nguoiDung', 'hoTen email vaiTro image trangThai')
        .populate('cacDiaDiemDangKy', 'tenDiaDiem khuVuc tinh image slug')
        .populate('diaDiemGiaCa.diaDiem', 'tenDiaDiem khuVuc tinh image slug');

      const applicants = hoSoDangKy.map((item) => ({
        id: `#BP-${String(item._id).slice(-6).toUpperCase()}`,
        _id: item._id,

        nguoiDung: item.nguoiDung?._id || '',
        userName: item.nguoiDung?.hoTen || '',
        userEmail: item.nguoiDung?.email || '',
        userRole: item.nguoiDung?.vaiTro || '',

        name: item.hoTen || 'Chưa có tên',
        hoTen: item.hoTen || 'Chưa có tên',
        email: item.nguoiDung?.email || '',
        phone: item.soDienThoai || '',
        soDienThoai: item.soDienThoai || '',
        soCCCD: item.soCCCD || '',
        ngaySinh: item.ngaySinh || null,

        diaChi: item.diaChi || '',
        queQuan: item.queQuan || '',
        city: item.tinhDangKy || 'Chưa cập nhật',
        tinhDangKy: item.tinhDangKy || '',

        image: item.image || '',
        anhCCCDMatTruoc: item.anhCCCDMatTruoc || '',
        anhCCCDMatSau: item.anhCCCDMatSau || '',
        anhKhuonMat: item.anhKhuonMat || '',
        lyLichTuPhap: item.lyLichTuPhap || '',

        gioiThieuBanThan: item.gioiThieuBanThan || '',
        kyNangDacBiet: item.kyNangDacBiet || [],
        ngonNguHoTro: item.ngonNguHoTro || [],
        kinhNghiem: item.kinhNghiem || '',
        soNamKinhNghiem: item.soNamKinhNghiem || 0,
        exp: `${item.soNamKinhNghiem || 0} năm`,
        giaThue: item.giaThue || 0,

        cacDiaDiemDangKy: item.cacDiaDiemDangKy || [],
        diaDiemGiaCa: item.diaDiemGiaCa || [],

        faceMatched: item.faceMatched,
        faceDistance: item.faceDistance,
        verificationStatus: item.verificationStatus,

        trangThaiHoSo: item.trangThaiHoSo || 'cho_duyet',
        status:
          item.trangThaiHoSo === 'da_duyet'
            ? 'ĐÃ DUYỆT'
            : item.trangThaiHoSo === 'tu_choi'
              ? 'TỪ CHỐI'
              : 'CHỜ DUYỆT',

        lyDoTuChoi: item.lyDoTuChoi || '',
        ngayDuyet: item.ngayDuyet || null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,

        avatar: (item.hoTen || 'UV')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(x => x[0]?.toUpperCase())
          .join('')
      }));

      return res.status(200).json({ applicants });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Lỗi server khi lấy danh sách đơn đăng ký'
      });
    }
  }
  async DuyetDiaDiem(req, res) {
    try {
      const data = await DiaDiem.find({})
        .sort({ createdAt: -1 });

      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  async QuanLyBaoCao(req, res) {
    try {
      const { slug } = req.params;

      const admin = await QuanTriVien.findOne({ slug });
      if (!admin) {
        return res.status(404).json({
          message: 'Không tìm thấy quản trị viên'
        });
      }

      const baoCaos = await BaoCao.find({})
        .sort({ createdAt: -1 })
        .populate('nguoiDung', 'hoTen email image');

      const reports = baoCaos.map((item) => ({
        id: `#REP-${String(item._id).slice(-6).toUpperCase()}`,
        _id: item._id,

        user: item.nguoiDung?.hoTen || 'Ẩn danh',
        email: item.nguoiDung?.email || '',

        type: item.loaiBaoCao,
        viTri: item.viTri || '',
        desc: item.moTa,
        image: item.hinhAnh || '',
        phanHoiAdmin: item.phanHoiAdmin || '',
        createdAt: item.createdAt,

        rawStatus: item.trangThai,
        status:
          item.trangThai === 'dang_xu_ly'
            ? 'ĐANG XỬ LÝ'
            : item.trangThai === 'da_giai_quyet'
              ? 'ĐÃ XỬ LÝ'
              : 'TỪ CHỐI',
      }));

      return res.status(200).json({
        reports
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Lỗi server khi lấy báo cáo'
      });
    }
  }
  async PhanHoiBaoCao(req, res) {
  try {
    const { slug, id } = req.params;
    const { phanHoiAdmin, trangThai } = req.body;

    const admin = await QuanTriVien.findOne({ slug });
    if (!admin) {
      return res.status(404).json({
        message: 'Không tìm thấy quản trị viên'
      });
    }

    const baoCao = await BaoCao.findByIdAndUpdate(
      id,
      {
        phanHoiAdmin: phanHoiAdmin || '',
        trangThai: trangThai || 'da_giai_quyet',
      },
      { new: true }
    ).populate('nguoiDung', 'hoTen email image');

    if (!baoCao) {
      return res.status(404).json({
        message: 'Không tìm thấy báo cáo'
      });
    }

    return res.status(200).json({
      message: 'Phản hồi báo cáo thành công',
      report: {
        id: `#REP-${String(baoCao._id).slice(-6).toUpperCase()}`,
        _id: baoCao._id,
        user: baoCao.nguoiDung?.hoTen || 'Ẩn danh',
        email: baoCao.nguoiDung?.email || '',
        type: baoCao.loaiBaoCao,
        viTri: baoCao.viTri || '',
        desc: baoCao.moTa,
        image: baoCao.hinhAnh || '',
        phanHoiAdmin: baoCao.phanHoiAdmin || '',
        createdAt: baoCao.createdAt,
        rawStatus: baoCao.trangThai,
        status:
          baoCao.trangThai === 'dang_xu_ly'
            ? 'ĐANG XỬ LÝ'
            : baoCao.trangThai === 'da_giai_quyet'
            ? 'ĐÃ XỬ LÝ'
            : 'TỪ CHỐI',
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Lỗi server khi phản hồi báo cáo'
    });
  }
}

  async ThongBaoHeThong(req, res) {
    return res.status(200).json([]);
  }

  async ThongKeNguoiDung(req, res) {
    try {
      const { slug } = req.params;

      const admin = await QuanTriVien.findOne({ slug });
      if (!admin) {
        return res.status(404).json({ message: 'Không tìm thấy quản trị viên' });
      }

      const users = await NguoiDung.find({})
        .sort({ createdAt: -1 })
        .select(
          '_id hoTen email vaiTro trangThai createdAt updatedAt ngaysinh soDienThoai image slug daDongYDieuKhoan thoiDiemDongYDieuKhoan phienBanDieuKhoan soLanViPham lyDoKhoa danhSachViPham'
        );

      const partners = await DoiTac.find({})
        .sort({ createdAt: -1 })
        .select('_id hoTen soDienThoai trangThaiHoSo createdAt');

      const tongNguoiDung = await NguoiDung.countDocuments();
      const tongDoiTacHoatDong = await DoiTac.countDocuments({
        trangThaiHoSo: { $in: ['da_duyet', 'cho_duyet'] }
      });

      const tongDichVuDangCungCap = await DiaDiem.countDocuments();

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const startCurrentMonth = new Date(currentYear, currentMonth, 1);
      const startPrevMonth = new Date(currentYear, currentMonth - 1, 1);
      const endPrevMonth = new Date(currentYear, currentMonth, 1);

      const newUsersThisMonth = await NguoiDung.countDocuments({
        createdAt: { $gte: startCurrentMonth }
      });

      const newUsersPrevMonth = await NguoiDung.countDocuments({
        createdAt: { $gte: startPrevMonth, $lt: endPrevMonth }
      });

      let phanTramTangNguoiDung = '+0%';
      if (newUsersPrevMonth > 0) {
        const percent = ((newUsersThisMonth - newUsersPrevMonth) / newUsersPrevMonth) * 100;
        phanTramTangNguoiDung = `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
      } else if (newUsersThisMonth > 0) {
        phanTramTangNguoiDung = '+100%';
      }

      const chartData = [];
      const monthLabels = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        const count = await NguoiDung.countDocuments({
          createdAt: { $gte: start, $lt: end }
        });

        chartData.push({
          m: i === 0 ? 'Hiện tại' : monthLabels[date.getMonth()],
          value: count,
          active: i === 0
        });
      }

      const userAccounts = users.map((u) => ({
        _id: u._id,
        id: `#ND-${String(u._id).slice(-6).toUpperCase()}`,

        name: u.hoTen || 'Người dùng',
        hoTen: u.hoTen || 'Người dùng',
        email: u.email || '',

        type:
          u.vaiTro === 'doiTac'
            ? 'ĐỐI TÁC'
            : u.vaiTro === 'quanTriVien'
              ? 'QUẢN TRỊ VIÊN'
              : 'NGƯỜI DÙNG',

        vaiTro: u.vaiTro || 'nguoiDung',
        status: ['inactive', 'locked', 'blocked'].includes(u.trangThai)
          ? 'Tạm khóa'
          : 'Hoạt động',
        trangThai: u.trangThai || 'active',

        date: u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '',
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,

        ngaysinh: u.ngaysinh,
        soDienThoai: u.soDienThoai || '',
        image: u.image || '',
        slug: u.slug || '',

        daDongYDieuKhoan: u.daDongYDieuKhoan,
        thoiDiemDongYDieuKhoan: u.thoiDiemDongYDieuKhoan,
        phienBanDieuKhoan: u.phienBanDieuKhoan,

        soLanViPham: u.soLanViPham || 0,
        lyDoKhoa: u.lyDoKhoa || '',
        danhSachViPham: u.danhSachViPham || [],

        avatar: (u.hoTen || 'ND')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(x => x[0]?.toUpperCase())
          .join('')
      }));

      const partnerAccounts = partners.map((p) => ({
        id: `#DT-${String(p._id).slice(-6).toUpperCase()}`,
        name: p.hoTen || 'Đối tác',
        email: p.soDienThoai || '',
        type: 'ĐỐI TÁC',
        status: p.trangThaiHoSo === 'tu_choi' ? 'Tạm khóa' : 'Hoạt động',
        date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : '',
        avatar: (p.hoTen || 'DT')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(x => x[0]?.toUpperCase())
          .join('')
      }));

      const accounts = [...userAccounts, ...partnerAccounts].sort((a, b) => {
        const da = a.date.split('/').reverse().join('');
        const db = b.date.split('/').reverse().join('');
        return db.localeCompare(da);
      });

      return res.status(200).json({
        chartData,
        tongNguoiDung,
        tongDoiTacHoatDong,
        tongDichVuDangCungCap,
        phanTramTangNguoiDung,
        accounts,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server khi lấy thống kê người dùng' });
    }
  }
  async QuanLyDiaDiem(req, res) {
    try {
      const { slug } = req.params;

      const admin = await QuanTriVien.findOne({ slug });
      if (!admin) {
        return res.status(404).json({
          message: 'Không tìm thấy quản trị viên'
        });
      }

      const diaDiems = await DiaDiem.find({})
        .sort({ createdAt: -1 })
        .select(
          '_id tenDiaDiem moTa gioiThieu doKho veVao quangduong khuVuc tinh hot image images dacDiemDiaDanh slug trangThai createdAt updatedAt'
        );

      const locations = diaDiems.map((item) => {
        const rawImages = [
          item.image,
          ...(Array.isArray(item.images) ? item.images : [])
        ].filter(Boolean);

        return {
          _id: item._id,
          id: `#LOC-${String(item._id).slice(-6).toUpperCase()}`,

          tenDiaDiem: item.tenDiaDiem || 'Chưa có tên',
          name: item.tenDiaDiem || 'Chưa có tên',

          moTa: item.moTa || '',
          gioiThieu: item.gioiThieu || [],

          doKho: item.doKho || '',
          level: item.doKho || 'Chưa rõ',

          veVao: item.veVao || '',
          price: formatVeVao(item.veVao),

          quangduong: item.quangduong || '',

          khuVuc: item.khuVuc || '',
          area: item.khuVuc || 'Chưa cập nhật',

          tinh: item.tinh || '',

          hot: item.hot || false,

          image: item.image || '',
          images: item.images || [],
          allImages: rawImages,

          dacDiemDiaDanh: item.dacDiemDiaDanh || [],

          slug: item.slug || '',

          trangThai: item.trangThai || 'cho_duyet',
          status:
            item.trangThai === 'da_duyet'
              ? 'Đang hoạt động'
              : item.trangThai === 'tu_choi'
                ? 'Từ chối'
                : 'Chờ duyệt',

          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      });

      return res.status(200).json({
        locations
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Lỗi server khi lấy danh sách địa điểm'
      });
    }
  }
  async DuyetDiaDiemAction(req, res) {
    try {
      const { id } = req.params;

      const diaDiem = await DiaDiem.findByIdAndUpdate(
        id,
        {
          trangThai: 'da_duyet'
        },
        {
          new: true
        }
      );

      if (!diaDiem) {
        return res.status(404).json({
          message: 'Không tìm thấy địa điểm'
        });
      }

      return res.status(200).json({
        message: 'Duyệt địa điểm thành công',
        data: diaDiem
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: 'Lỗi server'
      });
    }
  }

  async TuChoiDiaDiem(req, res) {
    try {
      const { id } = req.params;

      const diaDiem = await DiaDiem.findByIdAndUpdate(
        id,
        {
          trangThai: 'tu_choi'
        },
        {
          new: true
        }
      );

      if (!diaDiem) {
        return res.status(404).json({
          message: 'Không tìm thấy địa điểm'
        });
      }

      return res.status(200).json({
        message: 'Đã từ chối địa điểm',
        data: diaDiem
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: 'Lỗi server'
      });
    }
  }
  async CapNhatDiaDiem(req, res) {
    try {
      const { id } = req.params;

      const oldDiaDiem = await DiaDiem.findById(id);
      if (!oldDiaDiem) {
        return res.status(404).json({ message: "Không tìm thấy địa điểm" });
      }

      const body = req.body;

      const image = req.files?.image?.[0]
        ? `/img/${req.files.image[0].filename}`
        : oldDiaDiem.image;

      const oldImages = body.oldImages
        ? JSON.parse(body.oldImages)
        : oldDiaDiem.images || [];

      const newImages = req.files?.images
        ? req.files.images.map((file) => `/img/${file.filename}`)
        : [];

      const diaDiem = await DiaDiem.findByIdAndUpdate(
        id,
        {
          tenDiaDiem: body.tenDiaDiem,
          moTa: body.moTa,
          gioiThieu: body.gioiThieu ? JSON.parse(body.gioiThieu) : [],
          doKho: body.doKho,
          veVao: body.veVao,
          quangduong: body.quangduong,
          khuVuc: body.khuVuc,
          tinh: body.tinh,
          hot: body.hot === "true",
          image,
          images: [...oldImages, ...newImages],
          dacDiemDiaDanh: body.dacDiemDiaDanh ? JSON.parse(body.dacDiemDiaDanh) : [],
          trangThai: body.trangThai,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Cập nhật địa điểm thành công",
        data: diaDiem,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Lỗi server khi cập nhật địa điểm" });
    }
  }
  async DuyetHoSoDoiTac(req, res) {
    try {
      const { id } = req.params;

      const doiTac = await DoiTac.findById(id);
      if (!doiTac) {
        return res.status(404).json({
          message: 'Không tìm thấy hồ sơ đối tác'
        });
      }

      doiTac.trangThaiHoSo = 'da_duyet';
      doiTac.ngayDuyet = new Date();
      await doiTac.save();

      await NguoiDung.findByIdAndUpdate(
        doiTac.nguoiDung,
        {
          vaiTro: 'doiTac'
        },
        {
          new: true
        }
      );

      return res.status(200).json({
        message: 'Đã duyệt hồ sơ và chuyển tài khoản thành đối tác',
        data: doiTac
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Lỗi server khi duyệt hồ sơ'
      });
    }
  }

  async TuChoiVaXoaHoSoDoiTac(req, res) {
    try {
      const { id } = req.params;

      const doiTac = await DoiTac.findById(id);
      if (!doiTac) {
        return res.status(404).json({
          message: 'Không tìm thấy hồ sơ đối tác'
        });
      }

      await DoiTac.findByIdAndDelete(id);

      return res.status(200).json({
        message: 'Đã từ chối và xóa hồ sơ đối tác'
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Lỗi server khi từ chối hồ sơ'
      });
    }
  }
}

module.exports = new QuanTriVienController();