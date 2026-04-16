const homeRoute = require('./homeRouter');
const loginRoute = require('./loginRouter');
const homeuserRoute = require('./homeuserRouter');
const doiTacRoute = require('./doiTacRouter');
const diaDiemRoute = require('./diaDiemRouter');
const paymentRoute = require('./paymentRouter');
const danhGiaRoute = require('./danhGiaRouter');
const taiKhoanRoute = require('./taikhoanRouter');




function route(app) {

    app.use('/login', loginRoute);
    app.use('/homeuser', homeuserRoute);
    app.use('/doitac', doiTacRoute);
    app.use('/diadiem', diaDiemRoute);
    app.use("/payment", paymentRoute);
    app.use("/danhgia", danhGiaRoute);
    app.use("/taikhoan", taiKhoanRoute);
    app.use('/', homeRoute);
}
module.exports = route;