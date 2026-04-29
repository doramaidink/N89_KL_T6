const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");


router.post("/create-payment", paymentController.createPayment);
router.get("/status/:orderCode", paymentController.getPaymentStatus);

// PayOS sẽ gọi vào URL này khi khách đã thanh toán
router.post("/webhook", paymentController.payosWebhook);

module.exports = router;