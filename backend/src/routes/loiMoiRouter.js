const express = require("express");
const router = express.Router();
const loiMoiController = require("../controllers/loiMoiController");

router.post("/", loiMoiController.taoLoiMoi);
router.get("/", loiMoiController.getLoiMoi);
router.post("/:loiMoiId/accept", loiMoiController.acceptLoiMoi);
router.delete("/:loiMoiId/reject", loiMoiController.rejectLoiMoi);
router.get("/thongke", loiMoiController.getThongKe);

module.exports = router;