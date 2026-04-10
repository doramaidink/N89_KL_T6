const express = require('express')

const router = express.Router();
const loginController = require('../controllers/loginController')


router.post('/dangky', loginController.dangky);
router.post('/dangnhap', loginController.dangnhap);


module.exports = router;