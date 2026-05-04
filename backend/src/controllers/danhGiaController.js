const DanhGiaDiaDiem = require("../models/DanhGiaDiaDiem");
const DiaDiem = require("../models/DiaDiem");
const NguoiDung = require("../models/NguoiDung");
const { kiemDuyetNoiDung } = require("../services/aiKiemDuyetService");
class DanhGiaController {
  async layDanhGiaTheoDiaDiem(req, res) {
    try {
      const { slug } = req.params;
      const limit = Number(req.query.limit) || 0;

      const diaDiem = await DiaDiem.findOne({ slug });
      if (!diaDiem) {
        return res.status(404).json({ message: "Không tìm thấy địa điểm" });
      }

      let query = DanhGiaDiaDiem.find({
        diaDiem: diaDiem._id,
        trangThai: "hien",
      })
        .populate("nguoiDung", "hoTen image email")
        .sort({ createdAt: -1 });

      if (limit > 0) {
        query = query.limit(limit);
      }

      const danhGias = await query;

      const thongKeRaw = await DanhGiaDiaDiem.aggregate([
        {
          $match: {
            diaDiem: diaDiem._id,
            trangThai: "hien",
          },
        },
        {
          $group: {
            _id: null,
            tongDanhGia: { $sum: 1 },
            diemTrungBinh: { $avg: "$soSao" },
          },
        },
      ]);

      const demTheoSaoRaw = await DanhGiaDiaDiem.aggregate([
        {
          $match: {
            diaDiem: diaDiem._id,
            trangThai: "hien",
          },
        },
        {
          $group: {
            _id: "$soSao",
            soLuong: { $sum: 1 },
          },
        },
      ]);

      const tongDanhGia = thongKeRaw[0]?.tongDanhGia || 0;
      const diemTrungBinh = thongKeRaw[0]?.diemTrungBinh
        ? Number(thongKeRaw[0].diemTrungBinh.toFixed(1))
        : 0;

      const demTheoSao = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      demTheoSaoRaw.forEach((item) => {
        demTheoSao[item._id] = item.soLuong;
      });

      const phanTramTheoSao = {
        1: tongDanhGia ? Math.round((demTheoSao[1] / tongDanhGia) * 100) : 0,
        2: tongDanhGia ? Math.round((demTheoSao[2] / tongDanhGia) * 100) : 0,
        3: tongDanhGia ? Math.round((demTheoSao[3] / tongDanhGia) * 100) : 0,
        4: tongDanhGia ? Math.round((demTheoSao[4] / tongDanhGia) * 100) : 0,
        5: tongDanhGia ? Math.round((demTheoSao[5] / tongDanhGia) * 100) : 0,
      };

      return res.status(200).json({
        diaDiem: {
          _id: diaDiem._id,
          tenDiaDiem: diaDiem.tenDiaDiem,
          slug: diaDiem.slug,
          image: diaDiem.image,
        },
        thongKe: {
          tongDanhGia,
          diemTrungBinh,
          demTheoSao,
          phanTramTheoSao,
        },
        danhGias,
      });
    } catch (error) {
      console.log("Lỗi layDanhGiaTheoDiaDiem:", error);
      return res.status(500).json({ message: "Lỗi server khi lấy đánh giá" });
    }
  }

  async taoHoacCapNhatDanhGia(req, res) {
    try {
      const { diaDiemSlug, nguoiDungId, soSao, noiDung, hinhAnh = [] } = req.body;

      if (!diaDiemSlug) {
        return res.status(400).json({ message: "Thiếu địa điểm" });
      }

      if (!nguoiDungId) {
        return res.status(401).json({ message: "Bạn cần đăng nhập để đánh giá" });
      }

      if (!soSao || Number(soSao) < 1 || Number(soSao) > 5) {
        return res.status(400).json({ message: "Số sao phải từ 1 đến 5" });
      }

      const diaDiem = await DiaDiem.findOne({ slug: diaDiemSlug });
      if (!diaDiem) {
        return res.status(404).json({ message: "Không tìm thấy địa điểm" });
      }

      const nguoiDung = await NguoiDung.findById(nguoiDungId);
      if (!nguoiDung) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      // AI KIỂM DUYỆT NỘI DUNG ĐÁNH GIÁ
      console.log("===== DEBUG AI ĐÁNH GIÁ =====");
      console.log("noiDung:", noiDung);
      console.log("hinhAnh:", hinhAnh);
      console.log("hinhAnh co phai mang khong:", Array.isArray(hinhAnh));
      console.log("anh dau tien:", hinhAnh?.[0]);

      const imagesForAI = Array.isArray(hinhAnh) ? hinhAnh : [];

      console.log("===== DEBUG KIỂM DUYỆT =====");
      console.log("Nội dung:", noiDung);
      console.log("Số ảnh:", imagesForAI.length);
      console.log("Ảnh đầu:", imagesForAI[0]?.slice?.(0, 40));

      const ketQuaKiemDuyet = await kiemDuyetNoiDung(noiDung, imagesForAI);

      if (!ketQuaKiemDuyet.hopLe) {
        nguoiDung.soLanViPham = (nguoiDung.soLanViPham || 0) + 1;

        if (!Array.isArray(nguoiDung.danhSachViPham)) {
          nguoiDung.danhSachViPham = [];
        }

        nguoiDung.danhSachViPham.push({
          loaiViPham: ketQuaKiemDuyet.nhomViPham,
          mucDo:
            ketQuaKiemDuyet.diemNguyHiem >= 90
              ? "nang"
              : ketQuaKiemDuyet.diemNguyHiem >= 60
                ? "vua"
                : "nhe",
          lyDo: ketQuaKiemDuyet.lyDo,
          thoiGian: new Date(),
        });

        if (ketQuaKiemDuyet.canKhoaTaiKhoan) {
          nguoiDung.trangThai = "locked";
        } else {
          nguoiDung.trangThai = "warning";
        }

        await nguoiDung.save();

        return res.status(403).json({
          message: ketQuaKiemDuyet.canKhoaTaiKhoan
            ? "Tài khoản của bạn đã bị khóa vì đăng nội dung vi phạm nghiêm trọng."
            : ketQuaKiemDuyet.lyDo ||
            "Nội dung đánh giá vi phạm tiêu chuẩn cộng đồng.",
          ketQuaKiemDuyet,
        });
      }

      const duLieuCapNhat = {
        diaDiem: diaDiem._id,
        nguoiDung: nguoiDung._id,
        soSao: Number(soSao),
        noiDung: (noiDung || "").trim(),
        hinhAnh: Array.isArray(hinhAnh) ? hinhAnh.slice(0, 5) : [],
        trangThai: "hien",
      };

      const danhGia = await DanhGiaDiaDiem.findOneAndUpdate(
        {
          diaDiem: diaDiem._id,
          nguoiDung: nguoiDung._id,
        },
        duLieuCapNhat,
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      ).populate("nguoiDung", "hoTen image email");

      return res.status(200).json({
        message: "Đánh giá thành công",
        danhGia,
      });
    } catch (error) {
      console.log("Lỗi taoHoacCapNhatDanhGia:", error);
      return res.status(500).json({ message: "Lỗi server khi lưu đánh giá" });
    }
  }
}

module.exports = new DanhGiaController();