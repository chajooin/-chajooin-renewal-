const express = require('express');
const router = express.Router();
const cors = require('cors');
const moment = require('moment');
const app = express();
const { uuidv4, talkList, talkSend, s3Upload, s3UploadResize, s3Delete, send, sendError, filterItems, kakaoApi, logFunc, common, scd, front, adminScd, getFileName, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');


const models = require('../../models');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(scd);
router.use(front);

/* 문의하기 리스트 */
router.post('/list', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        user,
        jwt,
        nowDt 
    } = req.body;

    const list = await models.CS_TB.scope([
        'active',
        'files'
    ]).findAll({
        where: {
            u_idx: user?.idx
        },
        order: [
            ['status', 'ASC'],
            ['idx', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});

/* 문의하기 등록 */
router.post('/insert', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        title,
        desc,
        files,
        user,
        jwt,
        nowDt 
    } = req.body;

    if(!title || !desc) {
        sendError(req, res, {code: 99, msg: '문의유형 혹은 내용을 입력해주세요.'});
        return;
    }   

    let updateList = {
        u_idx: user?.idx,
        title,
        desc
    }

    let create_data = await models.CS_TB.create(
        updateList
    )

    await Promise.all(
        files?.filter(item => item?.base)?.map( async (x, i) => {

            let upDataList = {
                type: 1,
                target_idx: create_data?.idx
            };

            let urls = await s3UploadResize(x?.base, 'cs', '', x?.ext);
            upDataList.file_path = urls;

            await models.FILE_TB.create(
                upDataList
            )
        })
    )


    send(req, res, rt);

});



module.exports = router;
