const { docChuTuAnh } = require("./ocrService");

const TU_KHOA_VI_PHAM = [
  //chửi tục
  "địt", "đụ", "lồn", "cặc", "đéo", "địt mẹ", "đụ mẹ",
  "mẹ mày", "óc chó", "ngu như chó", "con chó",
  "đồ chó", "mất dạy", "súc vật", "thằng ngu", "con điên",
   "vcl","vl","clm","dm","đm","đmm","cc","vlz","vãi lồn",
  "vãi cặc","đồ khốn","đồ ngu dốt","thằng chó","con chó cái",
  "cút đi","biến đi","im mồm","câm mồm","ngu vãi",
  "óc heo","não cá vàng","đần độn","vô học","rẻ rách",
  "rác rưởi","đồ bẩn","đồ hèn","đồ thất bại","phế vật",
    "fuck","shit","bitch","asshole","dumbass",
  "idiot","stupid","moron","retard","loser",
  "trash","garbage","piece of shit",
  "son of a bitch","motherfucker",
  "shut up","get lost","go to hell",
  "fucking idiot","dumb bitch",

  //cờ bạc
  "casino", "tài xỉu", "xóc đĩa", "bài bạc", "cờ bạc", "cá cược", "nhà cái",
  "game đổi thưởng", "nổ hũ", "slot", "jackpot", "bet", "betting",
  "roulette", "baccarat", "poker", "đánh bài ăn tiền",
  "web cá cược", "app cá cược", "nạp tiền", "rút tiền", "rút tiền thật",
  "thưởng 100k", "tặng 68k", "68k", "trải nghiệm 68k",
  "khuyến mãi", "mã km", "nhận thưởng", "nạp lần đầu",
  "hoa hồng", "kiếm tiền nhanh", "f168", "fb88", "bk8", "w88", "vn88", "188bet", "12bet", "m88",
  "fun88", "bet88", "shbet", "dafabet", "cmd368", "kubet", "sbobet", "188bet", "m88", "fun88", "bet88", "shbet", "dafabet", "cmd368", "kubet",
  "web lậu", "phim lậu", "app lậu", "tải lậu", "xem phim free",
  "link xem phim", "xem miễn phí", "bypass bản quyền",
  "crack", "hack app", "key lậu",
  "tặng thưởng", "nhận 100k", "nhận 200k", "thưởng tân thủ", "bonus", "freebet",
  "hoàn trả", "hoàn cược", "hoàn tiền cược", "nạp rút nhanh", "rút siêu tốc",
  "tỷ lệ kèo", "kèo thơm", "kèo ngon", "kèo chuẩn", "kèo vip", "soi kèo",
  "tips cược", "tip kèo", "đặt kèo", "kèo bóng", "kèo tài xỉu", "kèo châu á",
  "kèo châu âu", "kèo over under", "đổi thưởng", "đổi xu", "đổi điểm",
  "nạp thẻ", "nạp momo", "nạp banking", "banking 24/7", "rút momo",
  "tài khoản cược", "tạo tài khoản cược", "link đăng ký", "link ref",
  "referral", "mã giới thiệu", "mã ref", "nhập mã", "code thưởng",
  "khuyến mãi nạp đầu", "nạp đầu nhận", "thưởng nạp đầu", "thưởng nạp",
  "thưởng sinh nhật", "thưởng tuần", "thưởng ngày", "đua top", "event cược",
  "vwin", "sv88", "zbet", "ae888", "tf88", "sv388", "hb88", "jb88", "ae88",
  "bk88", "tk88", "cf68", "qq88", "vb88", "b29", "loto", "xoso", "xổ số đổi thưởng",
  "xsmb đổi thưởng", "xsmn đổi thưởng", "xsmt đổi thưởng", "keno", "lô đề",
  "đánh đề", "ghi đề", "số đề", "bao lô", "nuôi lô", "bắt đề", "chốt số", "xem phim hd free", "xem phim không quảng cáo", "xem phim tốc độ cao",
  "tải apk mod", "apk mod", "mod apk", "hack game", "mod game",
  "full crack", "full bản quyền free", "tải miễn phí 100%", "bẻ khóa",
  "keygen", "serial key", "activate free", "kích hoạt free",
  "download free", "download tốc độ cao", "link tải nhanh",
  "leak", "rò rỉ", "bản leak", "bản nội bộ", "private link",
   "casino","bet","betting","online betting","sports betting",
  "live casino","slot machine","slots","jackpot","poker",
  "blackjack","roulette","baccarat","gambling site",
  "betting site","online casino","real money game",
  "win money","earn money fast","instant cash",
  "deposit now","withdraw now","fast withdrawal",
  "high payout","guaranteed win","fixed match",
  "bet tips","bet prediction","odds","high odds",
  "free bet","bonus bet","signup bonus","welcome bonus",
  "deposit bonus","no deposit bonus","cashback",
  "referral bonus","invite bonus","earn commission",
    "f168","fb88","bk8","w88","vn88","188bet","12bet","m88",
  "fun88","bet88","dafabet","cmd368","kubet",
  "vip betting","premium betting","exclusive betting",
  //spam, quảng cáo
  "click vào", "truy cập ngay", "link vào", "đăng ký ngay",
  "đăng ký nhận tiền", "telegram", "zalo kéo nhóm",
  "ib mình", "inbox mình", "liên hệ admin", "hotline",
  "kết bạn zalo", "join group", "kéo nhóm", "share link",
  "quảng cáo", "ads", "promo", "sale", "giảm giá",
  "add mình","add zalo","kết bạn ngay","chat ngay","nt mình",
  "để lại sđt","để lại số","comment sđt","inb để biết thêm",
  "ib để nhận","ib để lấy link","inbox nhận code","nhắn tin nhận link",
  "tham gia nhóm","join ngay","vào group","group kín","group vip",
  "kéo mem","tăng mem","buff follow","buff like","tăng tương tác",
  "seeding","đẩy top","lên xu hướng","viral","trending",
  "sub kênh","follow kênh","like share","share giúp","tag bạn bè",
  "link bio","link dưới cmt","link dưới mô tả","link trong bio",
    "pirated","piracy","illegal download","free download",
  "watch free","watch online free","movie streaming free",
  "cracked software","software crack","keygen",
  "license bypass","bypass license","full version free",
  "mod apk","mod game","hack version",
  "torrent","torrent download","magnet link",
  "leaked content","private leak","download link",
    "click here","visit now","join now","sign up now",
  "register now","get started now","limited offer",
  "special offer","promotion","promo code",
  "discount code","buy now","order now",
  "subscribe now","follow now","share now",
  "dm me","message me","contact me","call now",
  "whatsapp me","telegram me","join telegram",
  "join group","private group","vip group",
  "link in bio","check bio","link below",
  "comment below","drop your number",
    "scam","fraud","fake investment","guaranteed profit",
  "risk free","no risk","double your money",
  "make money fast","get rich quick","easy money",
  "instant profit","100% profit","daily profit",
  "investment plan","crypto investment",
  "forex signal","copy trade","copy trading",
  "earn passive income","high return",
  "withdraw fee","verification fee",
  "unlock fee","transfer fee",
  "send money first","advance payment",

  //Lừa đảo
  "lừa đảo", "scam", "đầu tư siêu lợi nhuận", "cam kết lợi nhuận",
  "nhận tiền nhanh", "chuyển khoản trước", "đặt cọc",
  "hoàn tiền 100%", "việc nhẹ lương cao", "tuyển ctv",
   "đầu tư cam kết","lợi nhuận 1%/ngày","lợi nhuận 3%/ngày",
  "lãi suất cao","lãi khủng","lãi đảm bảo","không rủi ro",
  "gửi tiền nhận lãi","uỷ thác đầu tư","quỹ nội bộ","quỹ kín",
  "forex signal","tín hiệu forex","copy trade","copy trading",
  "đánh vàng","đánh coin","coin rác","kèo coin","airdop",
  "airdrop","presale","ido","ico","staking lãi cao",
  "rút trước phí sau","phí xác minh","phí mở khoá","phí giải ngân",
  "thu hộ","chuyển hộ","trung gian nhận tiền","ví điện tử trung gian",
  "tài khoản trung gian","đổi tiền","đổi usdt","đổi coin",

  //Phân biệt
  "bắc kỳ chó", "nam kỳ chó", "trung kỳ chó",
  "đồ mọi", "mọi rợ", "dân đen", "bọn mọi",
  "bọn bắc kỳ", "bọn nam kỳ", "bọn trung kỳ",
  "bọn dân tộc", "ngu như dân", "đồ nhà quê",
    "da đen bẩn","da vàng hạ đẳng","da trắng thượng đẳng",
  "kỳ thị","phân biệt","đồ thiểu số","đồ thiểu năng",
  "đồ khuyết tật","ngu bẩm sinh","bọn nhập cư",
  "bọn ngoại lai","đồ ăn bám","dân tỉnh lẻ",
  "dân quê mùa","dân thành phố rác","dân miền núi ngu",
  "đồ tôn giáo","cực đoan","tà đạo","dị giáo",
  //Nhạy cảm
  "sex", "khiêu dâm", "clip nóng", "xxx", "18+",
  "gái gọi", "bán dâm", "mại dâm", "hiếp dâm",
  "bạo lực", "giết người", "đâm chém",
   "porn","xxx video","sex video","clip 18","clip 18+",
  "ảnh nóng","video nóng","web đen","web sex",
  "escort","call girl","sugar baby","sugar daddy",
  "gái xinh 18","gái teen","gái gọi cao cấp",
  "bạo hành","tra tấn","hành hạ","đánh đập",
  "giết","giết nó","đập nó","chém nó","đâm nó",
  "tự tử","kích động tự tử","hướng dẫn tự tử",
    ".xyz",".top",".site",".live",".click",".link",".club",
  ".online",".store",".fun",".win",".pro",".app",".cc",
  "http://","https://","www.","bit.ly","tinyurl","goo.gl",
  "shortlink","rút gọn link","link rút gọn",
    "porn","pornography","xxx","adult content",
  "nsfw","sex video","hot video",
  "nude","naked","escort","call girl",
  "prostitute","sex service","adult site",
  "18+","explicit","erotic",
   "boost followers","buy followers","buy likes",
  "fake followers","increase followers",
  "grow fast","viral trick","trending hack",
  "engagement boost","auto like",
  "auto follow","bot followers",
    "limited time","only today","act now",
  "don’t miss out","exclusive deal",
  "special deal","offer ends soon",
  "hurry up","best deal ever",
  "cheap price","lowest price"

];

function boDauTiengViet(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function chuanHoaText(text = "") {
  const raw = String(text || "").toLowerCase();
  const noAccent = boDauTiengViet(raw).toLowerCase();

  return {
    raw,
    noAccent,
    full: `${raw} ${noAccent}`,
  };
}

function kiemTraTuKhoa(text = "") {
  const { full } = chuanHoaText(text);

  const tuTrung = TU_KHOA_VI_PHAM.filter((tu) => {
    const tuRaw = tu.toLowerCase();
    const tuNoAccent = boDauTiengViet(tuRaw).toLowerCase();

    return full.includes(tuRaw) || full.includes(tuNoAccent);
  });

  if (!tuTrung.length) {
    return null;
  }

  const laCoBac =
    tuTrung.includes("f168") ||
    tuTrung.includes("68k") ||
    tuTrung.includes("casino") ||
    tuTrung.includes("tài xỉu") ||
    tuTrung.includes("nổ hũ") ||
    tuTrung.includes("cá cược") ||
    tuTrung.includes("nhà cái") ||
    tuTrung.includes("game đổi thưởng") ||
    tuTrung.includes("rút tiền thật") ||
    tuTrung.includes("khuyến mãi");

  const laTucTieu = tuTrung.some((tu) =>
    [
      "địt",
      "đụ",
      "lồn",
      "cặc",
      "đéo",
      "mẹ mày",
      "óc chó",
      "ngu như chó",
      "mất dạy",
    ].includes(tu)
  );

  const laPhanBiet = tuTrung.some((tu) =>
    ["mọi", "đồ mọi", "bắc kỳ chó", "nam kỳ chó", "trung kỳ chó"].includes(tu)
  );

  let nhomViPham = "spam";
  let diemNguyHiem = 75;
  let canKhoaTaiKhoan = false;

  if (laCoBac) {
    nhomViPham = "co_bac_web_lau";
    diemNguyHiem = 95;
    canKhoaTaiKhoan = true;
  } else if (laPhanBiet) {
    nhomViPham = "phan_biet";
    diemNguyHiem = 90;
    canKhoaTaiKhoan = true;
  } else if (laTucTieu) {
    nhomViPham = "tuc_tieu_xuc_pham";
    diemNguyHiem = 80;
    canKhoaTaiKhoan = false;
  }

  return {
    hopLe: false,
    trangThai: "vi_pham",
    hanhDong: "chan",
    diemNguyHiem,
    nhomViPham,
    lyDo: `Phát hiện nội dung vi phạm: ${tuTrung.join(", ")}`,
    canKhoaTaiKhoan,
    canXoaNoiDung: true,
    tuTrung,
  };
}

async function kiemDuyetNoiDung(noiDung = "", hinhAnh = []) {
  const noiDungText = String(noiDung || "").trim();

  // 1. Kiểm duyệt chữ trong comment/đánh giá
  const ketQuaText = kiemTraTuKhoa(noiDungText);

  if (ketQuaText) {
    return {
      ...ketQuaText,
      nguonViPham: "noi_dung_text",
      vanBanOCR: "",
    };
  }

  // 2. OCR đọc chữ trong ảnh
  let vanBanOCR = "";

  if (Array.isArray(hinhAnh) && hinhAnh.length > 0) {
    for (const img of hinhAnh.slice(0, 5)) {
      const textAnh = await docChuTuAnh(img);
      vanBanOCR += " " + textAnh;
    }
  }

  console.log("===== OCR TEXT ẢNH =====");
  console.log(vanBanOCR);

  // 3. Kiểm duyệt chữ đọc được trong ảnh
  const ketQuaAnh = kiemTraTuKhoa(vanBanOCR);

  if (ketQuaAnh) {
    return {
      ...ketQuaAnh,
      nguonViPham: "hinh_anh_ocr",
      vanBanOCR,
      lyDo: `Ảnh chứa nội dung vi phạm: ${ketQuaAnh.tuTrung.join(", ")}`,
    };
  }

  // 4. Nếu không vi phạm
  return {
    hopLe: true,
    trangThai: "an_toan",
    hanhDong: "cho_phep",
    diemNguyHiem: 0,
    nhomViPham: "none",
    lyDo: "",
    canKhoaTaiKhoan: false,
    canXoaNoiDung: false,
    nguonViPham: "none",
    vanBanOCR,
  };
}

module.exports = {
  kiemDuyetNoiDung,
};