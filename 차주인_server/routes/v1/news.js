const express = require('express');
const router = express.Router();
const cors = require('cors');
const moment = require('moment');
const app = express();
const { uuidv4, s3Upload, s3UploadResize, s3Delete, send, sendError, filterItems, kakaoApi, logFunc, common, scd, front, adminScd, getFileName, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(scd);

/* 공지사항 리스트 */
router.post('/list', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        rolling=false,
        user,
        jwt,
        nowDt 
    } = req.body;

    const list = await models.NEWS_TB.scope([
        'active'
    ]).findAll({
        raw: true,
        attributes: ['idx', 'title', 'create_dt'],
        order: [
            ['idx', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});

/* 공지사항 상세 */
router.post('/get', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        idx=0,
        user,
        jwt,
        nowDt 
    } = req.body;

    let row = await models.NEWS_TB.scope([
        'active'
    ]).findOne({
        where: {
            idx: idx || 0
        }
    });

    if(!row) {
        sendError(req, res, {code: 1, msg: '존재하지 않는 글입니다.'});
        return;
    }

    await row.update({ view: row?.view + 1 });


    let list = await models.NEWS_TB.scope([
        'active'
    ]).findAll({
        raw: true,
        attributes: ['idx', 'title', 'create_dt'],
        order: [
            ['idx', 'DESC']
        ]
    });

    let i = list?.findIndex(item => item?.idx === row?.idx);

    let prev = list?.find((item, index) => index === (i+1)) || null;
    let next = list?.find((item, index) => index === (i-1)) || null;

    rt.result = {
        prev,
        next,
        row
    };

    send(req, res, rt);
});

module.exports = router;
