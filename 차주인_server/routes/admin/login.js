const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const { uuidv4, s3Upload, s3Delete, send, common, scd, adminScd, passwordEncrypt, getFileName, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, adminSign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(adminScd);

/* 관리자 로그인 */
router.post('/login', async (req, res) => {

    console.log('auth/login => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { id, pw, nowDt } = req.body;
    
    const loginUser = await models.USER_TB.scope('active', 'admin').findOne({
        where: {
            email: id,
            password: await passwordEncrypt(pw),
        }
    });

    if(!loginUser) {
        rt.ok = false;
        rt.msg = '아이디 또는 비밀번호가 다릅니다.';
        send(req, res, rt);
        return;
    }   
    
    let token = adminSign({ idx: loginUser.idx });

    let userResult = await userReturn(loginUser.get({ plain: true }));
    console.log(userResult);

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
        accessToken: token,
        user: userResult
    }

    send(req, res, rt);
});


module.exports = router;
