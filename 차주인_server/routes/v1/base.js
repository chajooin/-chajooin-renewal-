const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, s3Upload, pointFunc, s3Select, s3UploadResize, s3Delete, getOptions, boardAlarmFunc, send, sendError, getBlack, itemDeleteFunc, kakaoApi, filterItems, logFunc, common, scd, front, adminScd, getFileName, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn, customerReturn } = require('../../service/returns.js');
const consts = require('../../service/consts.json');

const models = require('../../models');
const { sequelize } = require("../../models/index");
const { Op } = require("sequelize");

const addAccessCount = async () => {
    try {
        let today = moment().format("YYYYMMDD")

        let accessData = await models.ACCESS_COUNT_TB.findOne({
            where: {
                date: today
            }
        })

        if (!accessData) {
            await models.ACCESS_COUNT_TB.create({
                date: today,
                count: 1
            })
        } else {
            await accessData.update({
                count: (accessData.count + 1)
            })
        }
    } catch (e) {
        // console.log("[addAccessCount] error", e.message);
    }
}
router.use(scd);

/* 설정값 */
router.post('/config', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let consts = common();
    let options = await getOptions();

    const rows = await models.CONFIG_TB.findOne({
        raw: true,
        where: {
            idx: 1
        }
    });

    rt.result = {
        options,
        consts: consts,
        fag_cate: rows?.con_fag_cate?.split('||') || [],
        footer: {
            company: rows?.con_company,
            addr: rows?.con_addr,
            ceo: rows?.con_ceo,
            buisness_num: rows?.con_buisness_num,
            communication_num: rows?.con_communication_num,
            hp: rows?.con_hp,
            email: rows?.con_email
        }
    }
    addAccessCount();
    send(req, res, rt);
});

/* 중고거래 화물표준계약서 다운로드 */
router.post('/contract', async (req, res) => {

    let { type } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const rows = await models.CONFIG_TB.findOne({
        raw: true,
        where: {
            idx: 1
        }
    });

    let files;

    if (type * 1 === 1) {
        files = rows?.con_contract_file;
    } else if (type * 1 === 2) {
        files = rows?.con_contract_file2;
    }

    if (!files) {
        sendError(req, res, { code: 1200, msg: '파일 다운로드에 실패했습니다.' });
        return;
    }

    let sign_urls = await s3Select(files, getFileName(files));

    if (sign_urls === '9999') {
        sendError(req, res, { code: 1200, msg: '파일 다운로드에 실패했습니다.' });
        return;
    }

    rt.result = sign_urls;

    send(req, res, rt);
});


/* 상품별 포인트 가격 */
router.post('/pointGoods', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let {
        type
    } = req.body;

    const row = await models.POINT_GOODS_TB.findOne({
        where: {
            idx: type || 0
        }
    });

    if (!row) {
        sendError(req, res, { code: 1200, msg: '가격정보가 없습니다.' });
        return;
    }

    rt.result = row?.point;

    send(req, res, rt);
});

router.post('/accessCount', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let totalVisitor = await models.ACCESS_COUNT_TB.findOne({
        raw: true,
        attributes: [
            [
                models.sequelize.fn("sum", models.sequelize.col("count")),
                "total_count",
            ],
        ]
    })

    const userCount = await models.USER_TB.scope([
        'active',
        'front',
    ]).count();

    const truckCount = await models.BOARD_TRUCK_TB.scope([
        'active',
        'user',
    ]).count();

    const jeeipCount = await models.BOARD_JEEIP_TB.scope([
        'active',
        'user',
    ]).count();

    const boardCount = await models.BOARD_TB.scope([
        'active',
        'user',
    ]).count();
    const recCount = await models.BOARD_RECRUIT_TB.scope([
        'active',
        'user',
    ]).count();
    const jobCount = await models.BOARD_JOB_TB.scope([
        'active',
        'user',
    ]).count();

    rt.result = {
        visitor: Number(totalVisitor.total_count),
        users: userCount,
        boards: (truckCount + jeeipCount + boardCount + recCount + jobCount)
    }

    send(req, res, rt);
})


module.exports = router;
