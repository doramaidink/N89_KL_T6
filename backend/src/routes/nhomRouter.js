const express = require("express");
const router = express.Router();
const nhomController = require("../controllers/nhomController");

router.post("/join/:id", nhomController.thamGiaNhom);

// Thêm route lấy chi tiết nhóm
router.get("/detail/:id", nhomController.layChiTietNhom);

//  Để lấy danh sách nhóm của một người dùng
router.get("/user/:userId", nhomController.layNhomCuaToi);

router.post("/", nhomController.taoNhom);
router.get("/:diaDiemId", nhomController.layNhomTheoDiaDiem);

router.get("/cuatoi/:userId", nhomController.layNhomCuaToi);


module.exports = router;