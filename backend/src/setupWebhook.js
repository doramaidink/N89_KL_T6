require("dotenv").config();
const axios = require("axios");

async function setupWebhook() {
  try {
    const webhookUrl =
      "https://smock-extrude-opposing.ngrok-free.dev/payment/webhook"; // Thay bằng URL webhook của bạn

    const response = await axios.post(
      "https://api-merchant.payos.vn/confirm-webhook",
      {
        webhookUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.PAYOS_CLIENT_ID,
          "x-api-key": process.env.PAYOS_API_KEY,
        },
      }
    );

    console.log("✅ Đăng ký webhook thành công:");
    console.log(response.data);
  } catch (error) {
    console.error("❌ Lỗi đăng ký webhook:");
    console.error(error.response?.data || error.message);
  }
}

setupWebhook();