const axios = require("axios");

const TU_KHOA_CHAN_NHANH = [
  "nổ hũ",
  "bài bạc",
  "cờ bạc",
  "casino",
  "tài xỉu",
  "xóc đĩa",
  "rút tiền ngay",
  "nhận thưởng",
  "đăng ký nhận tiền",
  "web lậu",
  "link vào",
  "telegram",
];

function kiemTraNhanh(noiDung = "") {
  const text = noiDung.toLowerCase();

  const tuTrung = TU_KHOA_CHAN_NHANH.filter((tu) =>
    text.includes(tu.toLowerCase())
  );

  if (tuTrung.length > 0) {
    return {
      hopLe: false,
      trangThai: "vi_pham",
      hanhDong: "chan",
      diemNguyHiem: 90,
      lyDo: `Nội dung có dấu hiệu quảng cáo/cờ bạc/spam: ${tuTrung.join(", ")}`,
      ketQuaAI: { type: "rule_fast_check", tuTrung },
    };
  }

  return null;
}

async function phanTichBangAI(noiDung = "") {
  if (!process.env.OPENAI_API_KEY) {
    return {
      hopLe: true,
      trangThai: "an_toan",
      hanhDong: "cho_phep",
      diemNguyHiem: 0,
      lyDo: "",
      ketQuaAI: { type: "no_openai_key" },
    };
  }

  try {
    const prompt = `
Bạn là AI kiểm duyệt nội dung cho website du lịch/trekking tại Việt Nam.

Hãy phân loại nội dung người dùng gửi.

Cần CHẶN nếu nội dung thuộc một trong các nhóm:
1. Quảng cáo cờ bạc, casino, nổ hũ, tài xỉu, cá độ, game đổi thưởng.
2. Quảng cáo web lừa đảo, vay tiền, kiếm tiền nhanh, spam link.
3. Nội dung khiêu dâm, bạo lực, xúc phạm, đe dọa.
4. Nội dung không liên quan đến đánh giá địa điểm du lịch.
5. Nội dung dụ người dùng truy cập website/app/nhóm ngoài.

Nội dung cần kiểm duyệt:
"${noiDung}"

Chỉ trả về JSON đúng định dạng sau, không giải thích thêm:
{
  "hopLe": true hoặc false,
  "diemNguyHiem": số từ 0 đến 100,
  "nhomViPham": "none | co_bac | lua_dao | spam | khieu_dam | bao_luc | xuc_pham | khong_lien_quan",
  "lyDo": "lý do ngắn gọn bằng tiếng Việt"
}
`;

    const response = await axios.post(
      "https://api.openai.com/v1/responses",
      {
        model: "gpt-4.1-mini",
        input: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response.data?.output_text ||
      response.data?.output?.[0]?.content?.[0]?.text ||
      "";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return {
        hopLe: false,
        trangThai: "cho_admin_duyet",
        hanhDong: "chan",
        diemNguyHiem: 70,
        lyDo: "AI không trả về đúng định dạng, tạm chặn để đảm bảo an toàn.",
        ketQuaAI: { raw: text },
      };
    }

    if (!parsed.hopLe || Number(parsed.diemNguyHiem) >= 60) {
      return {
        hopLe: false,
        trangThai: "vi_pham",
        hanhDong: "chan",
        diemNguyHiem: Number(parsed.diemNguyHiem) || 80,
        lyDo: parsed.lyDo || "Nội dung có dấu hiệu vi phạm.",
        ketQuaAI: parsed,
      };
    }

    return {
      hopLe: true,
      trangThai: "an_toan",
      hanhDong: "cho_phep",
      diemNguyHiem: Number(parsed.diemNguyHiem) || 0,
      lyDo: "",
      ketQuaAI: parsed,
    };
  } catch (error) {
    console.log("Lỗi AI kiểm duyệt:", error.response?.data || error.message);

    return {
      hopLe: true,
      trangThai: "an_toan",
      hanhDong: "cho_phep",
      diemNguyHiem: 0,
      lyDo: "",
      ketQuaAI: { type: "ai_error", error: error.message },
    };
  }
}

async function kiemDuyetNoiDung(noiDung = "") {
  const noiDungSach = String(noiDung || "").trim();

  if (!noiDungSach) {
    return {
      hopLe: true,
      trangThai: "an_toan",
      hanhDong: "cho_phep",
      diemNguyHiem: 0,
      lyDo: "",
      ketQuaAI: { type: "empty_content" },
    };
  }

  const ketQuaNhanh = kiemTraNhanh(noiDungSach);
  if (ketQuaNhanh) return ketQuaNhanh;

  return await phanTichBangAI(noiDungSach);
}
async function phanTichAnhBangAI(images = []) {
  if (!process.env.OPENAI_API_KEY || !images.length) return null;

  try {
    const inputs = images.slice(0, 3).map((img) => ({
      type: "input_image",
      image_url: img, // base64 từ frontend
    }));

    const prompt = `
Bạn là AI kiểm duyệt nội dung.

Hãy xem ảnh và xác định có phải:
- quảng cáo cờ bạc
- casino
- game đổi thưởng
- spam web
- lừa đảo

Chỉ trả JSON:
{
  "viPham": true hoặc false,
  "diemNguyHiem": số 0-100,
  "lyDo": "mô tả ngắn"
}
`;

    const response = await axios.post(
      "https://api.openai.com/v1/responses",
      {
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt },
              ...inputs,
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response.data?.output_text ||
      response.data?.output?.[0]?.content?.[0]?.text ||
      "";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return null;
    }

    return parsed;
  } catch (error) {
    console.log("Lỗi AI ảnh:", error.message);
    return null;
  }
}

module.exports = {
  kiemDuyetNoiDung,
  phanTichAnhBangAI,
};