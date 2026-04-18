const homeRoute = require('./homeRouter');
const loginRoute = require('./loginRouter');
const homeuserRoute = require('./homeuserRouter');
const doiTacRoute = require('./doiTacRouter');
const diaDiemRoute = require('./diaDiemRouter');
const paymentRoute = require('./paymentRouter');
const danhGiaRoute = require('./danhGiaRouter');
const taiKhoanRoute = require('./taikhoanRouter');
const quanTriVienRoute = require('./quanTriVienRouter');




function route(app) {

    app.use('/login', loginRoute);
    app.use('/homeuser', homeuserRoute);
    app.use('/doitac', doiTacRoute);
    app.use('/diadiem', diaDiemRoute);
    app.use("/payment", paymentRoute);
    app.use("/danhgia", danhGiaRoute);
    app.use("/taikhoan", taiKhoanRoute);
    //Quan tri vien
    app.use("/quantrivien", quanTriVienRoute);


    app.use('/', homeRoute);
}
module.exports = route;