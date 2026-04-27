const ThongBao = require("../models/ThongBao");

//  Tạo thông báo (admin)
exports.createThongBao = async (req, res) => {
    try {
        const { tieuDe, noiDung, loai, loaiThongBao } = req.body;

        const thongBao = await ThongBao.create({
            tieuDe,
            noiDung,
            loai,
            loaiThongBao
        });

        res.json({ message: "Tạo thông báo thành công", thongBao });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

//  Lấy thông báo
exports.getThongBao = async (req, res) => {
    try {
        const { type } = req.query;

        let filter = {};

        if (type === "user") {
            filter.loai = { $in: ["user", "all"] };
        } 
        else if (type === "doitac") {
            filter.loai = { $in: ["doitac", "all"] };
        }
        else {
            filter = {}; // lấy hết (debug)
        }

        const thongBaos = await ThongBao.find(filter)
            .sort({ createdAt: -1 });

        res.json(thongBaos);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};