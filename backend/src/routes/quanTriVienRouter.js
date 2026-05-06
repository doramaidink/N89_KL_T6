const express = require("express");
const router = express.Router();
const quanTriVienController = require("../controllers/quanTriVienController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/img");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.patch(
  "/:slug/quanlydiadiem/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  quanTriVienController.CapNhatDiaDiem
);

router.get("/:slug/thongke", quanTriVienController.thongke);
router.get("/:slug/dondangky", quanTriVienController.donDangky);
router.get("/:slug/duyetdiadiem", quanTriVienController.DuyetDiaDiem);
router.get("/:slug/quanlybaocao", quanTriVienController.QuanLyBaoCao);
router.get("/:slug/thongbaohethong", quanTriVienController.ThongBaoHeThong);
router.get("/:slug/thongkenguoidung", quanTriVienController.ThongKeNguoiDung);
router.get("/:slug/quanlydiadiem", quanTriVienController.QuanLyDiaDiem);
router.patch("/:slug/duyetdiadiem/:id/duyet", quanTriVienController.DuyetDiaDiemAction);
router.patch("/:slug/duyetdiadiem/:id/tuchoi", quanTriVienController.TuChoiDiaDiem);
router.patch("/:slug/quanlydiadiem/:id", quanTriVienController.CapNhatDiaDiem);
router.patch("/:slug/dondangky/:id/duyet", quanTriVienController.DuyetHoSoDoiTac);
router.delete("/:slug/dondangky/:id/tuchoi", quanTriVienController.TuChoiVaXoaHoSoDoiTac);
router.patch("/:slug/quanlybaocao/:id/phanhoi", quanTriVienController.PhanHoiBaoCao);



module.exports = router;