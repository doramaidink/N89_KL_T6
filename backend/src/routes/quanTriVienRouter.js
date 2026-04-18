const express = require("express");
const router = express.Router();
const quanTriVienController = require("../controllers/quanTriVienController");

router.get("/:slug/thongke", quanTriVienController.thongke);
router.get("/:slug/dondangky", quanTriVienController.donDangky);
router.get("/:slug/duyetdiadiem", quanTriVienController.DuyetDiaDiem);
router.get("/:slug/quanlybaocao", quanTriVienController.QuanLyBaoCao);
router.get("/:slug/thongbaohethong", quanTriVienController.ThongBaoHeThong);
router.get("/:slug/thongkenguoidung", quanTriVienController.ThongKeNguoiDung);
router.get("/:slug/quanlydiadiem", quanTriVienController.QuanLyDiaDiem);




module.exports = router;