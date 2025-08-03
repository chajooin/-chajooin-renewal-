const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const { uuidv4, s3Upload, s3UploadResize, s3Delete, passwordEncrypt, pointFunc, front, send, sendError, common, scd, numFormat, payRequest } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

const moment = require("moment");

router.use(scd);
router.use(front);


/* 포인트내역 */
router.post('/list', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { type=1, user, nowDt } = req.body;

    let list = [];

    if(type*1 === 1) {
        list = await models.POINT_CHARGE_TB.findAll({
            where: {
                u_idx: user?.idx
            },
            order: [
                ['create_dt', 'DESC']
            ]
        });
    } else if (type*1 === 2) {
        list = await models.POINT_TB.scope(['active']).findAll({
            where: {
                u_idx: user?.idx,
                type: 2
            },
            order: [
                ['create_dt', 'DESC']
            ]
        });
    } else if (type*1 === 3) {
        list = await models.POINT_TB.scope(['active']).findAll({
            where: {
                u_idx: user?.idx,
                type: 1
            },
            order: [
                ['create_dt', 'DESC']
            ]
        });
    } else if (type*1 === 4) {
        list = await models.POINT_EXCHANGE_TB.findAll({
            where: {
                u_idx: user?.idx,
            },
            order: [
                ['create_dt', 'DESC']
            ]
        });
    }

    rt.result = list;

    send(req, res, rt);

});



/* 포인트 정산신청 */
router.post('/exchange', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { point, bank, bank_num, bank_name, user, nowDt } = req.body;

    if(point < 10000) {
        sendError(req, res, {code: 1, msg: '1만 포인트 이상 정산 가능합니다.'});
        return;
    }
    if(user?.point < point) {
        sendError(req, res, {code: 2, msg: '보유 포인트가 부족합니다.'});
        return;
    }
    if(!bank || !bank_num || !bank_name) {
        sendError(req, res, {code: 3, msg: '계좌정보를 입력해주세요.'});
        return;
    }

    let updateList = {
        u_idx: user?.idx,
        point,
        bank,
        bank_num,
        bank_name
    }

    await models.POINT_EXCHANGE_TB.create( updateList );

    let data = {
        type: 1,
        point: point,
        title: '정산 포인트 차감',
        delete_dt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    await pointFunc({idx: user?.idx, ...data});

    send(req, res, rt);

});


/* 포인트 충전요청(결제창 호출) */
router.post('/charge', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }


    let { payPriceConsts } = common();
    let { key, user } = req.body;

    let pay_info = payPriceConsts?.find(x => x?.idx === key);

    if(!pay_info) {
        sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.'});
        return;
    }
    
    let payresult = await payRequest({
        service_name: "차주인",
        user_id: `${user?.type}_${user?.id}`,
        user_name: user?.name,
        order_no: moment().unix() + "_" + user?.idx,
        amount: pay_info?.price,
        // amount: 100,
        product_name: `포인트충전_${numFormat(pay_info?.point)}P`,
        autopay_flag: "N",
        //callbackUrl: "http://ec2-43-200-183-10.ap-northeast-2.compute.amazonaws.com:4000/v1/payCallBack/callback",
        callbackUrl: "https://api.chajooin.com/v1/payCallBack/callback",
        custom_parameter: JSON.stringify({ idx: user?.idx, point: pay_info?.point })
    });

    if(payresult?.error) {
        sendError(req, res, {code: 1200, msg: `결제창 호출 실패(${payresult?.data?.code})`});
        return;
    }

    rt.result = payresult?.data;

    send(req, res, rt);
});

module.exports = router;
