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
router.use(front);

/* 쪽지 보내기 */
router.post('/send', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        target_idx,
        desc,
        user,
        jwt,
        nowDt 
    } = req.body;

    if(!target_idx) {
        sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.(수신자 없음)'}); 
        return;
    }
    if(!desc) {
        sendError(req, res, {code: 1, msg: '내용을 입력해주세요.'}); 
        return;
    }

    let row = await models.USER_TB.scope('front').findOne({
        raw: true,
        where: {
            idx: target_idx || 0
        }
    });

    if(!row) {
        sendError(req, res, {code: 2, msg: '수신자가 존재하지 않습니다.'}); 
        return;
    }

    let updateList = {
        u_idx: user?.idx,
        target_idx: row?.idx,
        desc
    }

    try {
        await models.MESSAGE_TB.create( updateList );
    } catch (error) {
        sendError(req, res, {code: 1200, msg: '비정삭적인 값입니다.'}); 
        return;
    }

    send(req, res, rt);
});


/* 쪽지 리스트 */
router.post('/list', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        type=1,
        user,
        jwt,
        nowDt 
    } = req.body;
    
    let whereList = {};
    let scopes = ['user'];

    if(type*1 === 1) {
        whereList.target_idx = user?.idx;
        scopes = [...scopes, 'activeTarget'];
    } else {
        whereList.u_idx = user?.idx;
        scopes = [...scopes, 'active'];
    }

    let list = await models.MESSAGE_TB.scope(scopes).findAll({
        where: whereList,
        order: [
            ['idx', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});


/* 쪽지 삭제 */
router.post('/delete', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        idx,
        user,
        jwt,
        nowDt 
    } = req.body;

    let row = await models.MESSAGE_TB.findOne({
        where: {
            idx: idx || 0,
            [Op.or] : [
                { u_idx: user?.idx },
                { target_idx: user?.idx }
            ]
        }
    });

    if(!row) {
        sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.'}); 
        return;
    }

    let updateList = {};

    if(row?.u_idx === user?.idx) {
        updateList.delete_dt = nowDt;
    }
    if(row?.target_idx === user?.idx) {
        updateList.delete_dt2 = nowDt;
    }

    await row.update( updateList );

    send(req, res, rt);
});

module.exports = router;
