const mongoose = require("mongoose");
const dotenv = require("dotenv");
const DiaDiem = require("./models/DiaDiem");

dotenv.config();

const dataDiaDiem = [
  {
    tenDiaDiem: "Núi zzzz ",
    moTa: "Núi zzzzlà điểm trekking còn khá hoang sơ, nổi bật với địa hình núi rừng hùng vĩ và cảnh quan thiên nhiên nguyên sinh. Đây là lựa chọn phù hợp cho những ai muốn khám phá những cung đường ít người biết đến.",
    gioiThieu: [
      "Núi zzzz nằm tại tỉnh Quảng Nam, thuộc khu vực miền Trung Việt Nam, nơi vẫn giữ được vẻ đẹp tự nhiên gần như nguyên vẹn. Khu vực này có địa hình đồi núi xen kẽ rừng rậm, tạo nên những cung đường trekking đầy thử thách nhưng cũng rất hấp dẫn đối với người yêu thích khám phá.",
      "Trên hành trình chinh phục, du khách sẽ băng qua những cánh rừng xanh mát, suối nhỏ và các sườn núi dốc. Không khí trong lành, ít dấu chân du lịch đại trà giúp nơi đây mang lại cảm giác yên bình và tách biệt hoàn toàn với sự ồn ào của thành phố.",
      "Ngoài cảnh quan thiên nhiên, khu vực quanh Núi zzzz còn gắn liền với đời sống của người dân địa phương, mang đậm nét văn hóa miền núi. Đây không chỉ là hành trình trekking mà còn là cơ hội để trải nghiệm thiên nhiên và tìm lại sự cân bằng, thư giãn trong không gian hoang sơ."
    ],
    doKho: "Dêzz",
    veVao: "freezzz",
    tinh: "Quảng Namzzz",
    quangduong: "6-8kmzzz",
    khuVuc: "Quảng Namzzz",
    hot: false,
    trangThai: "cho_duyet",

    image: "/img/núi bằng am/núi bằng am.jpg",
    images: [
      "/img/núi bằng am/núi bằng am1.jpg",
      "/img/núi bằng am/núi bằng am2.jpg",
    ],

    dacDiemDiaDanh: [
      "Trong rừng",
      "Leo cao",
    ]
  },

  {
    tenDiaDiem: "mmm",
    moTa: "mmmmmmmlà ngọn núi lửa đã tắt nổi bật với địa hình hùng vĩ và cung trekking thử thách. Đây là điểm đến lý tưởng cho những ai yêu thích khám phá thiên nhiên hoang sơ của Tây Nguyên.",
    gioiThieu: [
      "mmmmmm nằm tại tỉnh Gia Lai, gần thành phố Pleiku, là một trong những ngọn núi cao và đẹp của khu vực Tây Nguyên. Với độ cao khoảng 1.400m, nơi đây từng là núi lửa cổ nên địa hình khá đặc biệt, gồm các sườn dốc, rừng rậm và những đoạn đường đất đỏ bazan đặc trưng.",
      "Hành trình trekking Chư Nâm thường mất khoảng 1 ngày, phù hợp với người có thể lực khá. Trên đường đi, bạn sẽ băng qua rừng thông, rừng nguyên sinh và các đoạn dốc khá “gắt”, đòi hỏi sự kiên trì và sức bền.",
      "Khi lên đến đỉnh, bạn sẽ được chiêm ngưỡng toàn cảnh núi rừng Tây Nguyên rộng lớn, đặc biệt có thể nhìn thấy Biển Hồ T’Nưng từ trên cao. Khoảnh khắc săn mây vào sáng sớm hoặc ngắm hoàng hôn tại đây là trải nghiệm rất đáng nhớ đối với dân trekking."
    ],
    doKho: "Caommm",
    veVao: "Miễn phímmm",
    tinh: "Gia Laimmm",
    quangduong: "20km",
    khuVuc: "Gia Laimmmm",
    hot: false,
    trangThai: "cho_duyet",
    image: "/img/chư nâm/chư nâm.jpg",
    images: [
      "/img/chư nâm/chư nâm1.jpg",
      "/img/chư nâm/chư nâm2.jpg",
      "/img/chư nâm/chư nâm3.jpg",
    ],

    dacDiemDiaDanh: [
      "rừng",
      "đồi",
      "Cung đường nguy hiểm"
    ]
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