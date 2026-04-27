const express = require('express');
const router = express.Router();

const doiTacController = require('../controllers/doiTacController');
const uploadHuongDanVien = require('../middlewares/uploadHuongDanVien');

router.post(
  '/dang-ky-huong-dan-vien',
  uploadHuongDanVien.fields([
    { name: 'anhCCCDMatTruoc', maxCount: 1 },
    { name: 'anhCCCDMatSau', maxCount: 1 },
    { name: 'anhKhuonMat', maxCount: 1 },
    { name: 'lyLichTuPhap', maxCount: 1 },
  ]),
  doiTacController.dangKyHuongDanVien
);
router.get('/:slug/dashboard', doiTacController.dashboard);
router.get('/:slug/hoso', doiTacController.layHoSo);
router.put('/:slug/hoso', doiTacController.capNhatHoSo); 
router.get('/:slug/diadiem', doiTacController.layDiaDiemCuaDoiTac);
router.post('/:slug/diadiem', doiTacController.themDiaDiem);

router.get('/theo-dia-diem/:diaDiemId', doiTacController.layHuongDanVienTheoDiaDiem);
router.put('/duyet/:id', doiTacController.duyetHoSoHuongDanVien);

module.exports = router;