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

/* FAQ 리스트 */
router.post('/list', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        cate,
        user,
        jwt,
        nowDt 
    } = req.body;

    const list = await models.FAQ_TB.scope([
        'active',
    ]).findAll({
        where: {
            cate: cate
        },
        order: [
            ['idx', 'DESC']
        ]
    });
    
    rt.result = list;

    send(req, res, rt);
});


module.exports = router;
