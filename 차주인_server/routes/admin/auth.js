const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const { uuidv4, s3Upload, s3Delete, send, common, scd, adminScd, masterMiddleware, getFileName, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(adminScd);
router.use(verify);


/* 관리자 정보 */
router.post('/info', async (req, res) => {

   
    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let {jwt, authenticationkey, nowDt} = req.body;

    const loginUser = await models.USER_TB.scope('active', 'admin').findOne({
        where: {
            idx: jwt
        }
    });

    if(!loginUser) {
        rt.ok = false;
        rt.msg = '회원정보가 없습니다.';
        send(req, res, rt);
        return;
    }   

    let userResult = await userReturn(loginUser.get({ plain: true }));


    await models.USER_TB.update(
        {
            login_dt: nowDt
        },
        {
            where: {
                idx: userResult.idx
            }
        }
    )

    rt.result ={
        code: "0000",
        user: userResult
    }

    send(req, res, rt);
});


/* 마스터 비밀번호 체크 */
router.use(masterMiddleware).post('/check', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { jwt, pw } = req.body;

    const user = await models.USER_TB.scope('active').findOne({
        raw: true,
        where: {
            idx: jwt,
            password: sequelize.fn('password', pw)
        }
    });

    if(!user) {
        rt.ok = false;
        rt.msg = '비밀번호가 다릅니다.';
        send(req, res, rt);
        return;
    }

    send(req, res, rt);
});

/* 마스터 비밀번호 변경 */
router.use(masterMiddleware).post('/updatePw', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { jwt, pw } = req.body;

    await models.USER_TB.scope('active').update(
        {
            password: sequelize.fn('password', pw)
        },
        {
            where: {
                idx: jwt
            }
        }
    );

    send(req, res, rt);
});

module.exports = router;
