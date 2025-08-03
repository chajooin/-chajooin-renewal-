const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, s3UploadResize, s3Delete, send, sendError, pointFunc, scoreFunc, reviewScoreFunc, passwordEncrypt, leaveFunc, logFunc, itemDeleteFunc, userDestroy, randomNum, common, scd, adminScd, masterMiddleware, randomKey, getFileName, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models/index.js');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(adminScd);
router.use(verify);

/** 사용/적립 리스트 */
router.post('/list', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { type=1 } = req.body;

    const list = await models.POINT_TB.scope([
        'user',  
        'active'
    ]).findAll({
        where: {
            type
        },
        order: [
            ['create_dt', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});


/** 충전 리스트 */
router.post('/chargeList', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { leave } = req.body;

    const list = await models.POINT_CHARGE_TB.scope([
        'user',  
    ]).findAll({
        order: [
            ['create_dt', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});

/** 정산 리스트 */
router.post('/exchangeList', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { leave } = req.body;

    const list = await models.POINT_EXCHANGE_TB.scope([
        'user',  
    ]).findAll({
        order: sequelize.literal( 'CASE WHEN `status` = 1 THEN 1 ELSE 2 END ASC, idx DESC' )
    });

    rt.result = list;

    send(req, res, rt);
});

/** 포인트 상품 리스트 */
router.post('/goodsList', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const list = await models.POINT_GOODS_TB.findAll();

    rt.result = list;

    send(req, res, rt);
});

/** 포인트 상품 수정 */
router.post('/goodsUpdate', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { list } = req.body;

    list?.map((x, i) => {
        models.POINT_GOODS_TB.update(
            {
                point: x?.point || 0,
                reward: x?.idx < 5 ? (x?.reward || 0) : 0
            },
            {
                where: {
                    idx: x?.idx
                }
            }
        );
    })

    send(req, res, rt);
});

/** 포인트 지급(관리자) */
router.post('/give', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { type, users=[], point, title } = req.body;

    if(!point) {
        sendError(req, res, '잘못된 접근입니다.');
        return;
    }

    if(type === 2) {
        users = await models.USER_TB.scope([
            'active', 
            'front',  
        ]).findAll({
            attributes: ['idx'],
            raw: true
        });
    }
    
    let data = {
        type: 2,
        point: point,
        title: title
    };

    users?.map((x, i) => {
        pointFunc({idx: x?.idx, ...data});
    })

    send(req, res, rt);
});

/** 포인트 정산 상태변경 */
router.post('/exchange', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { status, idxs=[], title } = req.body;

    if(!status || idxs?.length < 1) {
        sendError(req, res, '잘못된 접근입니다.');
        return;
    }

    let updateList = {
        status,
        msg: status === 99 ? title : ''
    }

    await models.POINT_EXCHANGE_TB.update(
        updateList,
        {
            where: {
                idx: {
                    [Op.in]: idxs
                }
            }
        }
    );

    send(req, res, rt);
});



module.exports = router;
