const express = require('express');
const router = express.Router();
const homeuserController = require('../controllers/homeuserController');

router.get('/:hoten', homeuserController.hienThiTrangChuUser);

module.exports = router;