const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const TU_CAM_NHANH = [
  "cờ bạc",
  "casino",
  "tài xỉu",
  "xóc đĩa",
  "đánh bài ăn tiền",
  "nhà cái",
  "bet",
  "link cược",
  "kiếm tiền online",
  "web lậu",
  "telegram",
  "zalo kéo nhóm",
];

function kiemTraNhanh(noiDung = "") {
  const text = noiDung.toLowerCase();

  const tuViPham = TU_CAM_NHANH.find((tu) => text.includes(tu));

  if (tuViPham) {
    return {
      viPham: true,
      mucDo: "nang",
      loaiViPham: "spam_quang_cao_co_bac",
      lyDo: `Phát hiện từ khóa vi phạm: ${tuViPham}`,
      hanhDong: "khoa_tai_khoan",
    };
  }

  return null;
}

function layJsonTuText(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  }
}

async function kiemDuyetBangAI({ noiDung = "", hinhAnh = [] }) {
  if (process.env.AI_MODERATION_ENABLED !== "true") {
    return {
      viPham: false,
      mucDo: "an_toan",
      loaiViPham: "",
      lyDo: "AI moderation đang tắt",
      hanhDong: "cho_phep",
    };
  }

  const checkNhanh = kiemTraNhanh(noiDung);
  if (checkNhanh) return checkNhanh;

  if (!OPENAI_API_KEY) {
    return {
      viPham: false,
      mucDo: "an_toan",
      loaiViPham: "",
      lyDo: "Chưa cấu hình OPENAI_API_KEY",
      hanhDong: "cho_phep",
    };
  }

  const content = [
    {
      type: "input_text",
      text: `
Bạn là AI kiểm duyệt cho website trekking Backpacking Việt Nam.

Nhiệm vụ:
- Kiểm tra nội dung đánh giá và hình ảnh.
- Cấm: quảng cáo cờ bạc online, casino, nhà cái, web lậu, spam link, lừa đảo, nội dung khiêu dâm, bạo lực, xúc phạm, thông tin sai lệch nguy hiểm.
- Nếu hình ảnh là banner quảng cáo cờ bạc/nhà cái/web cá cược thì vi phạm nặng và phải khóa tài khoản.
- Nếu chỉ nói tục nhẹ thì cảnh báo.
- Nếu bình thường về trải nghiệm du lịch thì cho phép.

Trả về đúng JSON, không giải thích thêm:
{
  "viPham": true hoặc false,
  "mucDo": "an_toan" | "nhe" | "vua" | "nang",
  "loaiViPham": "spam" | "co_bac" | "lua_dao" | "doc_hai" | "khieu_dam" | "bao_luc" | "xuc_pham" | "",
  "lyDo": "lý do ngắn gọn",
  "hanhDong": "cho_phep" | "canh_bao" | "an_bai" | "khoa_tai_khoan"
}

Nội dung đánh giá:
${noiDung || "(không có nội dung chữ)"}
      `,
    },
  ];

  for (const img of hinhAnh.slice(0, 3)) {
    if (typeof img === "string" && img.startsWith("data:image")) {
      content.push({
        type: "input_image",
        image_url: img,
      });
    }
  }

  const res = await axios.post(
    "https://api.openai.com/v1/responses",
    {
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );

  const outputText =
    res.data?.output_text ||
    res.data?.output?.[0]?.content?.[0]?.text ||
    "";

  const json = layJsonTuText(outputText);

  if (!json) {
    return {
      viPham: false,
      mucDo: "an_toan",
      loaiViPham: "",
      lyDo: "AI không trả về JSON hợp lệ",
      hanhDong: "cho_phep",
    };
  }

  return {
    viPham: Boolean(json.viPham),
    mucDo: json.mucDo || "an_toan",
    loaiViPham: json.loaiViPham || "",
    lyDo: json.lyDo || "",
    hanhDong: json.hanhDong || "cho_phep",
  };
}

module.exports = {
  kiemDuyetBangAI,
};