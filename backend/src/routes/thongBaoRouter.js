const express = require("express");
const router = express.Router();

const thongBaoController = require("../controllers/thongBaoController");

router.post("/", thongBaoController.createThongBao);
router.get("/", thongBaoController.getThongBao);

module.exports = router;