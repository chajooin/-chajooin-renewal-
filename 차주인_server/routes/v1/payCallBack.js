const express = require('express');
const router = express.Router();
const { uuidv4, talkList, talkSend, s3Upload, s3UploadResize, s3Delete, send, common, scd, pointFunc } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');
const { emailCheck, nickCheck } = require('../../service/check.js');

const models = require('../../models/index.js');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");
const moment = require("moment");

/* 포인트 결제 콜백 */
router.post('/callback', async (req, res) => {

    console.log('payCallBack/callback => ');

    let rt = {
        ok: true,
        msg: '',
        result: { code: 0 }
    }

    // send(req, res, rt);
    // return;

    let tid = req.body.tid;
    let order_no = req.body.order_no;
    let custom_parameter = req.body.custom_parameter;
    let amount = req.body.amount;
    let billkey = req.body.billkey;
    let pay_info = req.body.pay_info;
    let card_info = req.body.card_info;
//console.log("pay callback:",req.body)
    custom_parameter = custom_parameter ? JSON.parse(custom_parameter) : null;

    let point = custom_parameter?.point;
    let u_idx = custom_parameter?.idx;

    if(!tid || !order_no || !custom_parameter || !amount ) {
        rt.result = { code: 1, message: '고유값 없음' };
        send(req, res, rt);
        return;
    }

    if(!u_idx || !point) {
        rt.result = { code: 1, message: '고유값 없음' };
        send(req, res, rt);
        return;
    }

    /** 결제 성공시 포인트 지급하는 부분 */
    let updateList = {
        u_idx: u_idx,
        point: point,
        price: amount,
        tid: tid
    }

    await models.POINT_CHARGE_TB.create(
       updateList
    );

    let data = {
        type: 2,
        point: point,
        amount: amount,
        title: '포인트 충전',
        delete_dt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    await pointFunc({idx: u_idx, ...data});
    /* 끝 */

    send(req, res, rt);

   
});



module.exports = router;
