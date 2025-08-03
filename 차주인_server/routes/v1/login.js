const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const { uuidv4, s3Upload, talkList, talkSend, s3UploadResize, s3UploadUrl, s3Delete, emailMasking, sendMail, passwordEncrypt, send, sendError, common, scd, adminScd, getFileName, sendSms, pointFunc } = require('../../service/utils.js');
const { sign, verify, refresh, createToken } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

const consts = require('../../service/consts.json');

router.use(scd);

/* 유저 로그인 */
router.post('/login', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: false
    }

    let { type, id, email, name, hp, profile, pw, nowDt } = req.body;

    if(!type || !id || !email || !name || !hp || (type !== 'kakao' && type !== 'naver') ) {
        sendError(req, res, {code: 1200, msg: '올바른 정보가 아닙니다.'});
        return;
    }

    hp = hp?.replace(/-/g, "");

    // 가입 검사
    const loginUser = await models.USER_TB.scope([
        'front',  
        'penaltyCheck'
    ]).findOne({
        raw: true,
        where: {
            type: type,
            id: id
        }
    });
    
    if(loginUser) {
        if(loginUser?.delete_dt) {
            sendError(req, res, {code: 2, msg: '탈퇴한 계정입니다.'});
            return;
        }
        if(loginUser?.penalty_check > 0) {
            sendError(req, res, {code: 1000, msg: '이용 제한 중입니다.'});
            return;
        }

        let token = sign({ idx: loginUser.idx });
        rt.result = token;
        send(req, res, rt);
        return;
    }

    // 중복 휴대폰 검사
    let checkUser = await models.USER_TB.scope([
        'active', 
        'front',  
    ]).findOne({
        raw: true,
        where: {
            hp: hp
        }
    });

    if(checkUser) {
        sendError(req, res, {code: 1, msg: '이미 가입된 회원입니다.', data: { type: checkUser?.type, email: checkUser?.email }});
        return;
    }   

    // 가입 처리
    let updateList = {
        type,
        id,
        email,
        name, 
        hp 
    }

    if(profile) {
        let urls = await s3UploadUrl(profile, 'user');
        if(urls) {
           updateList.profile = urls;
        }
    }
    
    try {
        const user = await models.USER_TB.create(
            updateList,
        );
            
        // 신규가입시 5000P 지급
        let data = {
            type: 2,
            point: 5000,
            title: '신규가입 포인트 지급'
        };
    
        await pointFunc({idx: user?.idx, ...data});
        console.log('✅ 포인트 지급 완료:', data);


        let token = sign({ idx: user?.idx });
        rt.result = token;
    
        send(req, res, rt);

    } catch (error) {
        sendError(req, res, {code: 1200, msg: '올바른 정보가 아닙니다.'});
        return;
    }


    /** 카카오 알림톡 전송 */
    let template = await talkList('TT_9380');
    
    let msg = template?.templtContent;
    msg = msg?.replace("#{이름}", name);
    msg = msg?.replace("#{SNS명}", type === 'kakao' ? "카카오" : type === 'naver' ? '네이버' : '-');
    msg = msg?.replace("#{계정}", email);
    msg = msg?.replace("#{고객센터전화번호}", consts?.serviceCenterTel);
    msg = msg?.replace("#{고객센터이메일}", consts?.serviceCenterEmail);

    let button = template?.buttons?.map(x => {
        if(x?.linkType !== "WL") return x;

        let linkMo = x?.linkMo?.replace("#{웹링크}", "chajooin.com");
        let linkPc = x?.linkPc?.replace("#{웹링크}", "chajooin.com");
        return {...x, linkMo, linkPc }
    });

    let talk_one = {
        receiver: hp,
        subject: template?.templtName,
        message: msg,
        button: button
    }
    await talkSend({
        tpl_code: template?.templtCode,
        talk_list: [talk_one]
    })
    /** 카카오 알림톡 전송 끝 */
});

/* 아이디찾기 */
router.post('/findid', async (req, res) => {

    console.log('login/findid => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { hp, nowDt } = req.body;

    if(!hp || hp?.legnth < 11) {
        sendError(req, res, {code: 0, msg: '올바른 휴대폰번호가 아닙니다.'});
        return;
    }
    
    const loginUser = await models.USER_TB.scope([
        'active', 
        'front',  
    ]).findAll({
        raw: true,
        attributes: ['create_dt', 'email'],
        where: {
            hp: hp,
        }
    });

    rt.result = loginUser?.map((x, i) => {
        return {
            ...x,
            email: emailMasking(x?.email)
        }
    });

    send(req, res, rt);
});

/* 비밀번호찾기 */
router.post('/findpw', async (req, res) => {

    console.log('login/findpw => ');

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { id, nowDt } = req.body;

    if(!id) {
        sendError(req, res, {code: 0, msg: '아이디를 입력해주세요.'});
        return;
    }
    
    const loginUser = await models.USER_TB.scope([
        'active', 
        'front',  
    ]).findOne({
        raw: true,
        where: {
            email: id,
        }
    });

    if(!loginUser) {
        sendError(req, res, {code: 0, msg: '가입된 아이디가 아닙니다.'});
        return;
    }


    let title = '[에이피링스] 인증번호';
    let number = '';
    for (let i = 0; i < 4; i++) {
        number += Math.floor(Math.random() * 10);
    };
    
    let body = `
    <div style="background-color: #F1F1F1; display: flex; align-items: center; justify-content: center; padding: 20px 0;">
        <div style="background-color: #fff; width: 310px; padding: 40px; margin: 0 auto;">
            <p style="font-size: 24px; font-weight: 900; line-height: 35px; margin-bottom: 20px; color: #000">요청하신 인증번호를<br/>발송해 드립니다.</p>
            <p style="font-size: 14px; margin-bottom: 10px; color: #000">아래의 인증번호를 인증번호 입력창에 입력해 주세요.</p>
            <div style="display: flex; align-items: center; justify-content: flex-start; background-color: #EEEFF4; border-radius: 4px; padding: 0 20px; margin-bottom: 20px; width: 160px; height: 44px;">
                <p style="font-size: 20px; font-weight: 700; margin: 0; padding: 0; line-height: 44px; width: 100%; text-align: center;">${number}</p>
            </div>
            <p style="color: #999; font-size: 10px; line-height: 16px;">본 메일은 발신전용 입니다.<br/>Copyright ⓒ 에이피링스. All Rights Reserved.</p>
        </div>
    </div>
    `;

    let result = await sendMail(id, title, body);

    if(!result) {
        sendError(req, res, {code: 0, msg: '인증번호 발송에 실패했습니다.'});
        return;
    }

    await models.USER_TB.update(
        {
            certification: number
        },
        {
            where: {
                email: id,
            }
        }
    );

    rt.result = '이메일로 인증번호를 전송했습니다.';

    send(req, res, rt);
});


/* 비밀번호찾기 인증번호 검증 */
router.post('/checkCertification', async (req, res) => {

    console.log('login/checkCertification => ');

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { id, certification, nowDt } = req.body;

    if(!id || !certification) {
        sendError(req, res, {code: 0, msg: '잘못된 접근입니다.'});
        return;
    }
    
    const loginUser = await models.USER_TB.scope([
        'active', 
        'front',  
    ]).findOne({
        raw: true,
        where: {
            email: id,
            certification: certification
        }
    });

    if(!loginUser) {
        sendError(req, res, {code: 0, msg: '인증번호가 일치하지 않습니다.'});
        return;
    }

    let token = createToken({ idx: loginUser.idx });

    rt.result = token;

    send(req, res, rt);
});



/* 비밀번호찾기 재설정 */
router.post('/pwReset', async (req, res) => {

    console.log('login/pwReset => ');

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { pw, authToken, nowDt } = req.body;

    const jwtUtil = require('jsonwebtoken');
    const secret = process.env.JWT_KEY;

    if(!authToken) {
        sendError(req, res, {code: 0, msg: '잘못된 접근입니다.'});
        return;
    }

    if(pw?.length < 8) {
        sendError(req, res, {code: 0, msg: '비밀번호를 입력해주세요.'});
        return;
    }

    let idx = null;

    try {
        let decoded = jwtUtil.verify(authToken, secret);
        idx = decoded?.idx;
    } catch (err) {
        sendError(req, res, {code: 0, msg: '인증시간이 만료되었습니다.'});
        return;
    }

    if(!idx) {
        sendError(req, res, {code: 0, msg: '잘못된 접근입니다.'});
        return;
    }

    await models.USER_TB.update(
        {
            password: await passwordEncrypt(pw),
            certification: null
        },
        {
            where: {
                idx: idx,
            }
        }
    );

    send(req, res, rt);
});


/* 회원가입 */
router.post('/join', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { name, sex, hp, email, pw, level=1, certificate_number, file_path, agree_marketing=0, nowDt } = req.body;

    if(!name || !sex || !hp) {
        sendError(req, res, {code: 0, msg: '본인인증 정보가 없습니다.'});
        return;
    }
    if(!email) {
        sendError(req, res, {code: 1, msg: '이메일을 입력해주세요.'});
        return;
    }
    if(pw?.length < 8) {
        sendError(req, res, {code: 2, msg: '비밀번호를 입력해주세요.'});
        return;
    }
    if(level === 2 && (!certificate_number || !file_path)) {
        sendError(req, res, {code: 3, msg: '자격증정보를 입력해주세요.'});
        return;
    }

    const loginUser = await models.USER_TB.scope([
        'front',  
    ]).findOne({
        where: {
            email: email,
        }
    });

    if(loginUser) {
        sendError(req, res, {code: 1, msg: '이미 가입한 이메일 계정입니다.'});
        return;
    }   

    let updateList = {
        name, 
        sex, 
        hp, 
        email, 
        password: await passwordEncrypt(pw),
        level,
        agree_marketing
    }

    if(level === 2) {
        updateList.certificate_number = certificate_number;
        let urls = await s3UploadResize(file_path?.base, 'user', '', file_path?.ext);
        if(!urls) {
            sendError(req, res, {code: 3, msg: '자격증사진이 올바르지않습니다.'});
            return;
        }
        updateList.file_path = urls;
    }

    try {
        const user = await models.USER_TB.create(
            updateList,
        );
    
        let token = sign({ idx: user?.idx, level: user?.level  });
        rt.result = token;
    
        send(req, res, rt);

    } catch (error) {
        sendError(req, res, {code: 0, msg: '정상적인 값이 아닙니다.'});
        return;
    }
});


/* 이메일 중복확인 */
router.post('/emailCheck', async (req, res) => {

    console.log('login/emailCheck => ');

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { email, nowDt } = req.body;

    if(!email) {
        sendError(req, res, {code: 0, msg: '이메일을 입력해주세요.'});
        return;
    }
    
    const loginUser = await models.USER_TB.scope([
        'front',  
    ]).findOne({
        where: {
            email: email,
        }
    });

    if(loginUser) {
        sendError(req, res, {code: 0, msg: '이미 가입한 이메일 계정입니다.'});
        return;
    }   

    send(req, res, rt);
});

// router.post('/test', async (req, res) => {

//     console.log('login/pwReset => ');

//     let rt = {
//         ok: true,
//         msg: '',
//         result: true
//     }

//     rt.result = await createToken({idx: 1});

//     send(req, res, rt);
// });

// router.post('/test2', async (req, res) => {

//     console.log('login/pwReset => ');

//     let rt = {
//         ok: true,
//         msg: '',
//         result: true
//     }
    
//     let { authToken, nowDt } = req.body;

//     const jwtUtil = require('jsonwebtoken');
//     const secret = process.env.JWT_KEY;

//     let decoded = jwtUtil.verify(authToken, secret);
//     console.log(decoded);

//     send(req, res, rt);
// });

module.exports = router;
