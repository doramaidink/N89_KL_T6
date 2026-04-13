const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs');

function normalizeText(text = '') {
  return text
    .replace(/\r/g, '')
    .replace(/[|]/g, 'I')
    .replace(/[_~`"]/g, '')
    .replace(/[§$€¢£¥®™©]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cleanValue(value = '') {
  return value
    .replace(/^[:\-\s]+/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function removeVietnamese(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function isLikelyLabel(line = '') {
  const lower = removeVietnamese(line).toLowerCase();

  return (
    lower.includes('can cuoc') ||
    lower.includes('cong dan') ||
    lower.includes('identity') ||
    lower.includes('card') ||
    lower.includes('ho va ten') ||
    lower.includes('date of birth') ||
    lower.includes('gioi tinh') ||
    lower.includes('sex') ||
    lower.includes('quoc tich') ||
    lower.includes('nationality') ||
    lower.includes('que quan') ||
    lower.includes('place of origin') ||
    lower.includes('noi thuong tru') ||
    lower.includes('place of residence')
  );
}

function cleanName(value = '') {
  return cleanValue(value)
    .replace(/^[^A-Za-zÀ-Ỹà-ỹ]+/, '')
    .replace(/[^A-Za-zÀ-Ỹà-ỹ\s]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cleanAddressValue(value = '') {
  let v = cleanValue(value);

  v = v.replace(/Nơi thường trú\s*\/?\s*Place of residence/gi, '').trim();
  v = v.replace(/Quê quán\s*\/?\s*Place of origin/gi, '').trim();

  return v;
}

async function preprocessImage(imagePath) {
  const outputPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '-processed.png');

  await sharp(imagePath)
    .grayscale()
    .normalize()
    .sharpen()
    .resize({ width: 1800 })
    .threshold(150)
    .toFile(outputPath);

  return outputPath;
}

async function detectText(imagePath) {
  const processedPath = await preprocessImage(imagePath);

  const result = await Tesseract.recognize(processedPath, 'vie+eng');

  try {
    fs.unlinkSync(processedPath);
  } catch (e) {}

  return result?.data?.text || '';
}

function parseFrontCCCD(rawText = '') {
  const text = normalizeText(rawText);

  console.log('====== RAW FRONT OCR ======');
  console.log(text);
  console.log('===========================');

  const lines = rawText
    .split('\n')
    .map(line => normalizeText(line))
    .filter(Boolean);

  let soCCCD = '';
  let ngaySinh = '';
  let hoTen = '';

  const cccdMatch = text.match(/\b\d{12}\b/);
  if (cccdMatch) soCCCD = cccdMatch[0];

  const dobMatch = text.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
  if (dobMatch) ngaySinh = dobMatch[1].replace(/-/g, '/');

  // Ưu tiên tìm theo nhãn
  for (let i = 0; i < lines.length; i++) {
    const lower = removeVietnamese(lines[i]).toLowerCase();

    if (lower.includes('ho va ten')) {
      const sameLine = lines[i].split(':')[1];
      if (sameLine && cleanName(sameLine)) {
        hoTen = cleanName(sameLine);
        break;
      }

      if (lines[i + 1] && !isLikelyLabel(lines[i + 1])) {
        hoTen = cleanName(lines[i + 1]);
        if (hoTen) break;
      }
    }
  }

  // Fallback: tìm dòng in hoa giống tên người
  if (!hoTen) {
    const candidates = lines.filter(line => {
      const clean = cleanName(line);
      return (
        clean &&
        clean.length >= 5 &&
        !isLikelyLabel(clean) &&
        !/\d/.test(clean)
      );
    });

    const best = candidates.find(line => line === line.toUpperCase()) || candidates[0] || '';
    hoTen = cleanName(best);
  }

  return {
    hoTen,
    soCCCD: cleanValue(soCCCD),
    ngaySinh: cleanValue(ngaySinh),
  };
}

function parseBackCCCD(rawText = '') {
  const text = normalizeText(rawText);

  console.log('====== RAW BACK OCR ======');
  console.log(text);
  console.log('===========================');

  const lines = rawText
    .split('\n')
    .map(line => normalizeText(line))
    .filter(Boolean);

  let queQuan = '';
  let diaChi = '';

  for (let i = 0; i < lines.length; i++) {
    const lower = removeVietnamese(lines[i]).toLowerCase();

    if (lower.includes('que quan') || lower.includes('place of origin')) {
      const sameLine = lines[i].split(':')[1];
      if (sameLine && cleanAddressValue(sameLine)) {
        queQuan = cleanAddressValue(sameLine);
      } else if (lines[i + 1] && !isLikelyLabel(lines[i + 1])) {
        queQuan = cleanAddressValue(lines[i + 1]);
      }
    }

    if (lower.includes('noi thuong tru') || lower.includes('place of residence')) {
      const sameLine = lines[i].split(':')[1];
      if (sameLine && cleanAddressValue(sameLine)) {
        diaChi = cleanAddressValue(sameLine);
      } else if (lines[i + 1] && !isLikelyLabel(lines[i + 1])) {
        diaChi = cleanAddressValue(lines[i + 1]);
      }
    }
  }

  // fallback: lấy các dòng cuối nhưng bỏ nhãn
  if (!diaChi) {
    const candidates = lines
      .filter(line => !isLikelyLabel(line))
      .filter(line => line.length > 8);

    diaChi = cleanAddressValue(candidates.slice(-2).join(' '));
  }

  return {
    queQuan: cleanAddressValue(queQuan),
    diaChi: cleanAddressValue(diaChi),
  };
}

module.exports = {
  detectText,
  parseFrontCCCD,
  parseBackCCCD,
};