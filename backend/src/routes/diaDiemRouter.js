const express = require('express');
const router = express.Router();
const DiaDiem = require('../models/DiaDiem');

router.get('/', async (req, res) => {
  try {
    const data = await DiaDiem.find({}).sort({ createdAt: -1 });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lỗi lấy danh sách địa điểm' });
  }
});

module.exports = router;