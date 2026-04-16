const express = require("express");
const router = express.Router();
const danhGiaController = require("../controllers/danhGiaController");

router.get("/diadiem/:slug", danhGiaController.layDanhGiaTheoDiaDiem);
router.post("/", danhGiaController.taoHoacCapNhatDanhGia);

module.exports = router;