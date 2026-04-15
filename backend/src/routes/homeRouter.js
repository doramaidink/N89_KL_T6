const express = require('express')

const router = express.Router();
const homeController = require('../controllers/homeController')


router.get('/chitietdiadiem/:slug', homeController.chitietdiadiem);
router.get('/khampha', homeController.khampha);
router.get('/huongdanvien', homeController.huongdanvien);
router.get('/', homeController.home);


module.exports = router;