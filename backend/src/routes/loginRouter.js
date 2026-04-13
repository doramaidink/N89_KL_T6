const express = require('express')

const router = express.Router();
const loginController = require('../controllers/loginController')
const validateRegister = require('../middlewares/validateRegister');


router.post('/dangky',validateRegister, loginController.dangky);
router.post('/dangnhap', loginController.dangnhap);
router.post('/quen-mat-khau', loginController.quenMatKhau);
router.get('/kiem-tra-reset-token', loginController.kiemTraResetToken);
router.post('/dat-lai-mat-khau', loginController.datLaiMatKhau);


module.exports = router;