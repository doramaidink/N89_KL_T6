const express = require('express');
const router = express.Router();
const homeuserController = require('../controllers/homeuserController');
const uploadBaoCao = require("../middlewares/uploadBaoCao");

router.get("/:hoten/baocao", homeuserController.layBaoCaoCuaUser);
router.post(
  "/:hoten/baocao",
  uploadBaoCao.single("hinhAnh"),
  homeuserController.taoBaoCao
);
router.get('/:hoten', homeuserController.hienThiTrangChuUser);

module.exports = router;