const express = require("express");
const router = express.Router();
const taiKhoanController = require("../controllers/taiKhoanController");
const uploadAvatar = require("../middlewares/uploadAvatar");

router.get("/:id", taiKhoanController.layThongTinTaiKhoan);
router.put("/:id/hoten", taiKhoanController.capNhatHoTen);
router.put("/:id/sodienthoai", taiKhoanController.themSoDienThoai);
router.put("/:id/matkhau", taiKhoanController.doiMatKhau);
router.put("/:id/avatar", uploadAvatar.single("avatar"), taiKhoanController.capNhatAvatar);

module.exports = router;