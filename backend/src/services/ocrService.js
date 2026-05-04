const Tesseract = require("tesseract.js");

async function docChuTuAnh(imageBase64) {
  try {
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return "";
    }

    if (!imageBase64.startsWith("data:image")) {
      console.log("Ảnh không phải base64 data:image nên bỏ qua OCR");
      return "";
    }

    const result = await Tesseract.recognize(imageBase64, "eng+vie", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(`OCR đang đọc ảnh: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    return result.data.text || "";
  } catch (error) {
    console.log("Lỗi OCR:", error.message);
    return "";
  }
}

module.exports = {
  docChuTuAnh,
};