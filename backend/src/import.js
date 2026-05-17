const mongoose = require("mongoose");
const dotenv = require("dotenv");
const DiaDiem = require("./models/DiaDiem");

dotenv.config();

const dataDiaDiem = [
  {
    tenDiaDiem: "Mũi Đôi",
    moTa: "Mũi Đôi là điểm cực Đông trên đất liền của Việt Nam, thuộc bán đảo Hòn Gốm, xã Vạn Thạnh, tỉnh Khánh Hòa. Nơi đây nổi tiếng với vẻ đẹp hoang sơ của những bãi đá tự nhiên, biển xanh trong và khung cảnh bình minh tuyệt đẹp – là nơi được nhiều người lựa chọn để chinh phục và đón ánh mặt trời đầu tiên trên đất liền Việt Nam.",
    gioiThieu: [
      "Mũi Đôi còn được gọi là Mũi Bà Dầu, nổi bật với hai khối đá lớn nằm sát nhau hướng ra biển nên người dân địa phương gọi là “Mũi Đôi”. Đây là địa điểm mang ý nghĩa đặc biệt đối với những người yêu thích khám phá và chinh phục các cột mốc địa lý của Việt Nam.",
      "Hành trình đến Mũi Đôi thường bắt đầu từ Đầm Môn, nơi du khách sẽ đi bộ xuyên qua những đồi cát, bãi đá và các đoạn đường ven biển. Cung đường trekking mang đến nhiều trải nghiệm thú vị khi người tham gia được ngắm nhìn thiên nhiên hoang sơ, những bãi biển nhỏ và khung cảnh biển trời rộng lớn.",
      "Điểm nổi bật nhất tại Mũi Đôi là cột mốc cực Đông được đặt trên các tảng đá sát biển. Nhiều du khách lựa chọn cắm trại qua đêm để đón bình minh và lưu giữ khoảnh khắc mặt trời xuất hiện đầu tiên trên đất liền Việt Nam, tạo nên một trải nghiệm đáng nhớ cho hành trình khám phá."
    ],
    doKho: "Khó",
    veVao: "50.000 VNĐ",
    tinh: "Khánh Hòa",
    quangduong: "14-18km",
    khuVuc: "làng chài Đầm Môn",
    hot: false,
    trangThai: "cho_duyet",
    image: "/img/MuiDoi/MuiDoi.jpg",
    images: [
      "/img/MuiDoi/MuiDoi1.jpg",
      "/img/MuiDoi/MuiDoi2.jpg",

    ],

    dacDiemDiaDanh: [
      "Biển",
      "Cung đường nguy hiểm"
    ],
    toaDo: {
      lat: 12.6489,
      lng: 109.4625
    }
  }
];

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("Kết nối MongoDB thành công");
    const dataFixed = dataDiaDiem.map(item => ({
      ...item,
      slug: new mongoose.Types.ObjectId().toString()
    }));
    await DiaDiem.insertMany(dataFixed);
    console.log("Import địa điểm thành công");

    process.exit();
  } catch (error) {
    console.error("Lỗi import:", error);
    process.exit(1);
  }
}

importData();
//khởi chạy : node src/import.js