const Tesseract = require('tesseract.js');

function normalizeText(text = '') {
  return text
    .replace(/\r/g, '')
    .replace(/[|]/g, 'I')
    .trim();
}

function cleanValue(value = '') {
  return value
    .replace(/^[:\-\s]+/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function detectText(imagePath) {
  const result = await Tesseract.recognize(imagePath, 'vie+eng');
  return result?.data?.text || '';
}

function parseFrontCCCD(rawText = '') {
  const text = normalizeText(rawText);
  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  let soCCCD = '';
  let ngaySinh = '';
  let hoTen = '';

  const cccdMatch = text.match(/\b\d{12}\b/);
  if (cccdMatch) soCCCD = cccdMatch[0];

  const dobMatch = text.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);
  if (dobMatch) ngaySinh = dobMatch[1];

  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();

    if (
      lower.includes('ho va ten') ||
      lower.includes('họ và tên')
    ) {
      const sameLine = lines[i].split(':')[1];
      if (sameLine && sameLine.trim()) {
        hoTen = cleanValue(sameLine);
      } else if (lines[i + 1]) {
        hoTen = cleanValue(lines[i + 1]);
      }
      break;
    }
  }

  if (!hoTen) {
    const upperLine = lines.find(line =>
      /^[A-ZÀÁẠẢÃĂẮẰẶẲẴÂẤẦẬẨẪĐÈÉẸẺẼÊẾỀỆỂỄÌÍỊỈĨÒÓỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠÙÚỤỦŨƯỨỪỰỬỮỲÝỴỶỸ\s]{6,}$/.test(line)
    );
    if (upperLine) hoTen = cleanValue(upperLine);
  }

  return {
    hoTen,
    soCCCD,
    ngaySinh,
  };
}

function parseBackCCCD(rawText = '') {
  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  let queQuan = '';
  let diaChi = '';

  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();

    if (lower.includes('quê quán') || lower.includes('que quan')) {
      const sameLine = lines[i].split(':')[1];
      if (sameLine && sameLine.trim()) {
        queQuan = cleanValue(sameLine);
      } else if (lines[i + 1]) {
        queQuan = cleanValue(lines[i + 1]);
      }
    }

    if (
      lower.includes('nơi thường trú') ||
      lower.includes('noi thuong tru') ||
      lower.includes('thường trú') ||
      lower.includes('thuong tru')
    ) {
      const sameLine = lines[i].split(':')[1];
      if (sameLine && sameLine.trim()) {
        diaChi = cleanValue(sameLine);
      } else if (lines[i + 1]) {
        diaChi = cleanValue(lines[i + 1]);
      }
    }
  }

  return {
    queQuan,
    diaChi,
  };
}

module.exports = {
  detectText,
  parseFrontCCCD,
  parseBackCCCD,
};