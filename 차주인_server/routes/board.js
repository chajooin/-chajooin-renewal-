const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const { uuidv4, s3Upload, s3Delete, send, common, scd, getFileName, sendSms, nice, niceDecode } = require('../service/utils.js');
const { sign, verify, refresh } = require('../service/jwt.js');

router.use(scd);

// 메모리상 게시글 저장소
const posts = [
  { id: 1, title: '샘플 글입니다', content: '테스트 게시글입니다.' }
];
let nextId = 2;

// 게시판 목록 GET API
router.get('/board', (req, res) => {
  res.json([
    { id: 1, title: '샘플 게시글', content: '테스트입니다.' }
  ]);
});

// 게시판 목록 GET API (테스트용)
router.get('/board/list', (req, res) => {
  res.json(posts);
});

// 포스트 목록 GET API (테스트용)
router.get('/post/list', (req, res) => {
  res.json(posts);
});

// 게시글 작성 POST API
router.post('/post/write', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ ok: false, msg: 'title, content 필수' });
  }
  const newPost = { id: nextId++, title, content };
  posts.push(newPost);
  res.json({ ok: true, id: newPost.id });
});

// 게시글 상세 조회 API
router.get('/post/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.json({ ok: false, message: '게시글이 없습니다' });
  }
  res.json(post);
});

/* 유저 테스트 */
router.post('/test', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {
            content: '/board/test',
            data: req.body
        }
    }

    send(req, res, rt);
});

module.exports = router;
