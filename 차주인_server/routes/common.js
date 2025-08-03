const express = require('express');
const cors = require('cors');
const router = express.Router();

router.use(cors());

// 더미 데이터
const terms = ['이용약관', '개인정보처리방침'];
const sidoList = ['서울특별시', '부산광역시', '대구광역시'];
const sigunguMap = {
  '서울특별시': ['강남구', '서초구', '송파구'],
  '부산광역시': ['해운대구', '수영구', '동래구'],
  '대구광역시': ['중구', '동구', '서구']
};
const dongMap = {
  '강남구': ['역삼동', '삼성동', '청담동'],
  '서초구': ['서초동', '방배동'],
  '송파구': ['잠실동', '문정동'],
  '해운대구': ['우동', '중동'],
  '수영구': ['광안동', '남천동'],
  '동래구': ['온천동', '사직동'],
  '중구': ['동인동', '삼덕동'],
  '동구': ['신암동', '신천동'],
  '서구': ['평리동', '내당동']
};
const makers = ['현대', '기아', '타타대우', '볼보', '스카니아'];
const carTypes = ['카고', '윙바디', '냉동탑'];
const carSubTypes = ['3.5톤', '5톤', '25톤'];

// GET /common/term
router.get('/term', (req, res) => {
  res.json({ ok: true, data: terms });
});

// GET /common/sido
router.get('/sido', (req, res) => {
  res.json({ ok: true, data: sidoList });
});

// GET /common/sigungu?sido=시도명
router.get('/sigungu', (req, res) => {
  const { sido } = req.query;
  const data = sigunguMap[sido] || [];
  res.json({ ok: true, data });
});

// GET /common/dong?sigungu=시군구명
router.get('/dong', (req, res) => {
  const { sigungu } = req.query;
  const data = dongMap[sigungu] || [];
  res.json({ ok: true, data });
});

// GET /common/maker
router.get('/maker', (req, res) => {
  res.json({ ok: true, data: makers });
});

// GET /common/carType
router.get('/carType', (req, res) => {
  res.json({ ok: true, data: carTypes });
});

// GET /common/carSubType
router.get('/carSubType', (req, res) => {
  res.json({ ok: true, data: carSubTypes });
});

module.exports = router; 