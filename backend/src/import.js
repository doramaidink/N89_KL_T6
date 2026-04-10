const mongoose = require("mongoose");
const dotenv = require("dotenv");
const DiaDiem = require("./models/DiaDiem");

dotenv.config();

const dataDiaDiem = [
  {
    tenDiaDiem: "Rừng Dâu Sơn Trà",
    moTa:  "Khám phá vẻ đẹp hoang sơ và kỳ bí của tiểu khu Rừng Dâu tại bán đảo Sơn Trà. Một trải nghiệm trekking đích thực cho những người yêu thiên nhiên.",
    gioiThieu:[
    "Rừng Dâu Sơn Trà là một trong những địa điểm trekking 'ẩn mình' hấp dẫn nhất tại Đà Nẵng. Nằm sâu trong khu bảo tồn thiên nhiên, nơi đây sở hữu hệ sinh thái đa dạng với những cây cổ thụ hàng trăm năm tuổi và thảm thực vật đặc hữu. ",
     "Tên gọi 'Rừng Dâu' bắt nguồn từ sự hiện diện của loài cây dâu rừng cổ thụ mọc xen kẽ giữa những hốc đá. Đây là khu vực có địa hình dốc, đá trơn trượt và đòi hỏi kỹ năng di chuyển tốt, đặc biệt là trong mùa mưa."],
    doKho: "Rất cao",
    veVao: "Miễn phí",
    quangduong: "10km",
    khuVuc: "Sơn Trà - Đà Nẵng",
    hot: false,

    image: "/img/rungdau/rungdau.jpg",
    images: [
      "/img/rungdau/rungdau1.jpg",
      "/img/rungdau/rungdau2.jpg",
      "/img/rungdau/rungdau3.jpg",
    ],

    dacDiemDiaDanh: [
      "Trong rừng",
      "Khó tiếp cận",
      "Đường đi hiểm trở"
    ]
  },

  {
    tenDiaDiem: "Đỉnh Bàn Cờ",
    moTa: "Địa điểm cao nhất tại Sơn Trà",
    gioiThieu:[
      "Đỉnh Bàn Cờ là điểm cao nhất của bán đảo Sơn Trà, nơi bạn có thể ngắm toàn cảnh thành phố Đà Nẵng và biển Đông. Đây là một trong những địa điểm hikking phổ biến nhất tại Đà Nẵng, thu hút cả dân địa phương lẫn du khách.",
      "Đường lên Đỉnh Bàn Cờ khá dễ đi, phù hợp với mọi đối tượng, kể cả những người mới bắt đầu. Trên đường đi, bạn sẽ được chiêm ngưỡng cảnh quan thiên nhiên tuyệt đẹp với rừng cây xanh mướt và những tảng đá lớn tạo nên khung cảnh hùng vĩ. Đỉnh Bàn Cờ cũng là nơi lý tưởng để ngắm bình minh hoặc hoàng hôn, mang đến trải nghiệm khó quên cho những ai yêu thích thiên nhiên và nhiếp ảnh.",
      "1 Địa điểm nhất định phải đi khi đến Đà Nẵng, đặc biệt là những người yêu thích trekking và khám phá thiên nhiên. Hãy chuẩn bị sẵn máy ảnh để ghi lại những khoảnh khắc tuyệt đẹp tại đây!"
    ],
    doKho: "Trung bình",
    veVao: "Miễn phí",
    quangduong: "12km",
    khuVuc: "Sơn Trà - Đà Nẵng",
    hot: true,

    image: "/img/dinhbanco/dinhbanco.jpg",
    images: [
      "/img/dinhbanco/dinhbanco1.jpg",
      "/img/dinhbanco/dinhbanco2.jpg",
      "/img/dinhbanco/dinhbanco3.jpg",
      "/img/dinhbanco/dinhbanco4.jpg",
    ],

    dacDiemDiaDanh: [
      "View đẹp",
      "Gần trung tâm",
      "Dễ đi",
      "Ngắm bình minh",
      "Ngắm hoàng hôn"
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