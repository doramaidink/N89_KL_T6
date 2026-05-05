const express = require("express");
const router = express.Router();
const nhomController = require("../controllers/nhomController");


//  Để lấy danh sách nhóm của một người dùng
router.get("/user/:userId", nhomController.layNhomCuaToi);

// Thêm route lấy chi tiết nhóm
router.get("/detail/:id", nhomController.layChiTietNhom);

router.post("/join/:id", nhomController.thamGiaNhom);






router.post("/checkin", nhomController.checkin);
router.post("/checkout", nhomController.checkout);
router.get("/lichsu/:userId", nhomController.getLichSu);

router.get("/checkin-admin", nhomController.getCheckinAdmin); 

router.post("/", nhomController.taoNhom);
router.get("/:diaDiemId", nhomController.layNhomTheoDiaDiem);

router.get("/cuatoi/:userId", nhomController.layNhomCuaToi);



module.exports = router;