const axios = require("axios");
const crypto = require("crypto");

const PAYOS_API = "https://api-merchant.payos.vn/v2/payment-requests";

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

function createSignature(data, checksumKey) {
  const sortedData = sortObject(data);
  const dataString = Object.entries(sortedData)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHmac("sha256", checksumKey)
    .update(dataString)
    .digest("hex");
}

async function createPayment(data) {
  const signData = {
    amount: data.amount,
    cancelUrl: data.cancelUrl,
    description: data.description,
    orderCode: data.orderCode,
    returnUrl: data.returnUrl,
  };

  const signature = createSignature(signData, process.env.PAYOS_CHECKSUM_KEY);

  const payload = {
    ...data,
    signature,
  }; 

  console.log("PAYOS PAYLOAD =", payload);

  const response = await axios.post(PAYOS_API, payload, {
    headers: {
      "x-client-id": process.env.PAYOS_CLIENT_ID,
      "x-api-key": process.env.PAYOS_API_KEY,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

module.exports = { createPayment };