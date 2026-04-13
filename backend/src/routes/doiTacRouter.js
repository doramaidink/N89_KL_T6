const express = require('express');
const router = express.Router();

const {
  doiTacController,
  uploadFront,
  uploadBack,
  uploadFace,
  uploadJudicial,
} = require('../controllers/doiTacController');

router.post('/ocr-cccd-front', uploadFront.single('cccdImage'), doiTacController.ocrCCCDFront);
router.post('/ocr-cccd-back', uploadBack.single('cccdImage'), doiTacController.ocrCCCDBack);
router.post('/upload-face', uploadFace.single('faceImage'), doiTacController.uploadFace);
router.post('/upload-judicial-record', uploadJudicial.single('lyLichFile'), doiTacController.uploadJudicialRecord);
router.post('/create', doiTacController.create);

module.exports = router;