const express = require("express");
const router = express.Router();
const quanTriVienController = require("../controllers/quanTriVienController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../frontend/public/img"));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ─── Địa điểm ─────────────────────────────────────────────────────────────────
// THÊM MỚI - phải đặt TRƯỚC route /:slug/... để tránh conflict
router.post(
  "/themdiadanh",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  quanTriVienController.ThemDiaDiem
);
router.patch(
  '/doitac/:id',
  quanTriVienController.capNhatDoiTac
);

router.get("/:slug/quanlydiadiem", quanTriVienController.QuanLyDiaDiem);

router.patch(
  "/:slug/quanlydiadiem/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  quanTriVienController.CapNhatDiaDiem
);

router.patch(
  "/:slug/duyetdiadiem/:id/duyet",
  quanTriVienController.DuyetDiaDiemAction
);

router.patch(
  "/:slug/duyetdiadiem/:id/tuchoi",
  quanTriVienController.TuChoiDiaDiem
);

router.get("/:slug/duyetdiadiem", quanTriVienController.DuyetDiaDiem);

// ─── Thống kê & Dashboard ─────────────────────────────────────────────────────
router.get("/:slug/thongke", quanTriVienController.thongke);
router.get("/:slug/thongkenguoidung", quanTriVienController.ThongKeNguoiDung);
router.get("/:slug/thongbaohethong", quanTriVienController.ThongBaoHeThong);

// ─── Đơn đăng ký đối tác ──────────────────────────────────────────────────────
router.get("/:slug/dondangky", quanTriVienController.donDangky);
router.patch("/:slug/dondangky/:id/duyet", quanTriVienController.DuyetHoSoDoiTac);
router.delete("/:slug/dondangky/:id/tuchoi", quanTriVienController.TuChoiVaXoaHoSoDoiTac);

// ─── Báo cáo ──────────────────────────────────────────────────────────────────
router.get("/:slug/quanlybaocao", quanTriVienController.QuanLyBaoCao);
router.patch("/:slug/quanlybaocao/:id/phanhoi", quanTriVienController.PhanHoiBaoCao);



module.exports = router;