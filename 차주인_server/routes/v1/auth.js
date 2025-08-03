const express = require('express');
const router = express.Router();
const cors = require('cors');
const moment = require('moment');
const crypto = require('crypto');

const app = express();
const { randomNum, talkList, talkSend, s3Upload, s3UploadResize, s3Delete, passwordEncrypt, front, send, sendError, common, scd, adminScd, logFunc, leaveFunc, itemDeleteFunc, getFileName, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models');
const { sequelize } = require("../../models/index");
const { Op } = require("sequelize");

const consts = require('../../service/consts.json');

const KotsaSecurity = require('../../service/kosta-security.js');
const path = require('path');




/* 자동차 소유자인증 RESTful */
router.get('/carApiTest', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let {
        type,
        carOwner,
        carRegNo,
        user,
        jwt,
        nowDt
    } = req.body;


    const axios = require('axios');
    // let data = 'MIIDPgSCAQAHEVp4THVZPvZOb1IGV61p/5+MKlpq6c1l5WgPrWNiCAtWpyq6tLrLFv/zeoTnirUwNYFFdOHvE9qXG+NOxsqy/bYOCl7ZUCLRUNQuAxVg/cOA7vBCwIAIDavcAHYoJi+qGMVRJROYFt7h3reeOz4Hrt6IYDkPx78SK8Un32Be9q9j02OvHp5KVPAPBlWCb7MHi404DjWXHiHzs0FLTOKo1WFCR3mr+dHuRqxf54Ltj9cVBCf0483251fGrle6hByIRuwSV+Re5li0PYhnH6Tsm6pQSWOdNyrHgaXk22amNU0ATRVk7p5XhRei9SA8tq8IEuWVWjJjks4TLdVM59x1BIIBACBnZlNC5xBw0fbA8pLXqg2XghT+bvf0repHx8S7A4Ty+hj5p3jLQ/kdqW8D5PrHTUaFMnx/2DdjgJaMz3OLB+uQuFtYpx4j1qun00ykzTiotHYqriH4J26DUMGbT407ZbB0axpxZpxcsiLdnxz/+g429fgpQ62TA2Ambi/vYirx/qDIJ+6biyR5JGOLNX9eKx/qfOPwtDbYBFyHkFTE4SzOq2qflP4tiKnmRgifXuD0stfIarWnkCYhWzEctfD/96eS2CY5HgICu/s813XahIZCVFza38iZ1rj4ZZqz0neK5tey5l7hbCld7oAtFDtNLglIepkPKwT1dVMWtiYEhrUEggEAf47YhsYN4pn+W+wETiXK2Ppl3rIUc9QAd/moorzF2y4jcvKum/c2eWcgthW4viUpB/YiQBeM4UOcbFHoa48sS5wNc69KIVPKnTxk+XSD7+Ynz82LyU5NWzYCSY1CMHduZU+bx/Bxm4cJQ4XisHvqcB5peLsNQzb6GYA3Atkawy9ZBchv0y1/C2Xtk9LUZ1J8/epeQgwJROUme+cZ8A78mUSOOYzW6LNOwj1TzAhH6+ZaerjIFeWNrORMXM0DBWO68nUMH0WNq4BfqHn8CFDHb7jAq+hrARhd958ItM8SzecPvrcURU9XtB/xFqVEAmH7YsbxHq1uQIyfQU4hCgd95AQwUTkGloA05s9zFkbaG74wHuGSeKUXsoM6JUqmjNocWU61R/oWbvpZ+8cUgVzx4Q5+';
    let data = 'MIIDPgSCAQCrHgk8bNmK9lwq2O1wkGtsmKyja1dTAhdL0JE9oI8TYpjRbvr6iDLXxTy6BVomcMK6KmnkdcJ+kVVXBqVDWLqMTPNwB5v01Se4MSbtfQpIe8cWidk+ikbSWX5Pey5Huz4D6+oqmoECFvTPeupsUFaYgYG2ni5GG0K6txHqPItN0wjd3MNTfKZeG08o0MOTSOMrDQIXMrDCVRkb7IOYSKqrpPqFJ2389pAcG2VFbeKbMszzD688ySPWEbBhIHJL5GqfoBTBeHt0YIPmnkYV5bVG2+bn5cufwjWrroo8wmvq1W3FFyt4Tpf3A9yJBIe3nK/q4S/1n74yiB47vk45mVC+BIIBADkQm4lKtZyfKYVhWXvCV1CumAtPNNjJJM23jk/gHApT3v04V7URJ7qAuoulyi5WpdaSQyJWmvY1THEm/fE2CGklTo73HSCRItIrArBiNzdn6EXzF3Za91nQPUNj71HQ8g/w3qNnv7r2YP0TVW+IuiFt37sCZ8ZhOsj3bRCDMWnu4q5MV0uIECBdaLUrrPtkf31l2kUl3KLC2K8k7Hx2raJ3VhC8rekluKQrhRQF8HVc1aGvyLw3dk2pjnnZOSJc2lRkFFLbhE4uNzrYG1wE1sv9wa6NKJuYnOyrN/FKkf5ZQZwcHsEXoQyPogBfGifppyUE0oV2bGBqif9vADq5RAcEggEANuqMKDZJEIGgVsE1AXiNn9EczDAlJXCx4Ag1kGoVxtVyDND10gACu0hFJOH3Lgv6YuQD6hrnU4a+FboR5mkSpFBEJN0YVkiAw0FM7TsFPTTkXpXsuvyqb5WVTGtMPbC9EXLLGj077X6NxA82EwlcvWwfQbevtI0DQLlz8cGVi/pZ7BNNWDfL9gg6tyJARM1swR1JydUMCc1ioivwgCqfAX3hJPH/h7oJvsOQYEVQIvgyBRntrcpLuwEYKMMJpUK4Sz3InYV2oR3Hcy5ihNNF3KbpFKcbGwB2GohTTS++uRM3RrEE+9Ej4gCQ3F02IiFjcokMWwvOyry1coWNPlmasgQwRjno+nvM6YbX5LM/ytYwVBRdFd+Jd9NIX4BP5B8uNeuBg7U5+AQLDa0QX0KBMS7i';

    axios.post('https://open.car365.go.kr/hub/kotsa', data, {
        headers: {
            // 'cvmis_apikey': '72651AF6-5E9EE3FD-1689C48A-8AE460EE',
            'cvmis_apikey': '68B60373-FBDCEDA0-FCD3C1C2-7DA896E6', 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        transformRequest: [(data, headers) => {
            // 여기서 Axios의 기본 stringify 동작을 막고 그대로 전송
            return data;
        }]
      })
      .then(res => console.log('응답:', res.data))
      .catch(err => console.error('에러:', err));

    res.send("asdasd")
    return;
    // -------
    // let config = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: 'https://open.car365.go.kr/hub/kotsa',
    //     // url: 'https://linkstg.car365.go.kr/hub/kotsa',
    //     // url: 'http://210.91.35.175:28080/hub/kotsa',
    //     headers: {
    //         'cvmis_apikey': '72651AF6-5E9EE3FD-1689C48A-8AE460EE',
    //         // 'cvmis_apikey': '72651AF6-5E9EE3FD-1689C48A-8AE460EE', 
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     data: {asdasd:"123",asd:"asd"}
    // };

    // axios.request(config)
    //     .then((response) => {
    //         console.log(JSON.stringify(response.data));
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });

    res.send('123214');
});






router.use(scd);
router.use(front);

/* 유저 정보 */
router.post('/info', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { user, nowDt } = req.body;

    let whereList = {
        u_idx: user?.idx
    }

    const filter = await models.USER_FILTER_TB.findOne({
        raw: true,
        where: whereList
    });

    let alarm_count = await models.ALARM_TB.scope([
        'active',
    ]).count({
        where: whereList
    });

    let like_count = await models.LIKE_TB.count({
        where: whereList
    });

    let message_count = await models.MESSAGE_TB.scope([
        'activeTarget'
    ]).count({
        where: {
            target_idx: user?.idx
        }
    });

    rt.result = {
        ...user,
        filter: filter,
        alarm_count: alarm_count,
        like_count: like_count,
        message_count: message_count
    };

    send(req, res, rt);

});

/* 작설글 정보 */
router.post('/boardCount', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { user, nowDt } = req.body;

    let whereList = {
        u_idx: user?.idx
    }

    let truck_count = await models.BOARD_TRUCK_TB.scope([
        'active',
    ]).count({
        where: whereList
    });

    let jeeip_count = await models.BOARD_JEEIP_TB.scope([
        'active',
    ]).count({
        where: whereList
    });

    let recruit_count = await models.BOARD_RECRUIT_TB.scope([
        'active',
    ]).count({
        where: whereList
    });

    let job_count = await models.BOARD_JOB_TB.scope([
        'active',
    ]).count({
        where: whereList
    });

    let consulting_count = await models.CONSULTING_TB.count({
        where: {
            target_idx: user?.idx,
            read_dt: {
                [Op.is]: null
            }
        }
    });

    rt.result = {
        truck_count,
        jeeip_count,
        recruit_count,
        job_count,
        consulting_count
    };

    send(req, res, rt);

});

/* 휴대폰번호 변경(인증번호 발송) */
router.post('/updateHp', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { hp, user, jwt, nowDt } = req.body;

    if (!hp) {
        sendError(req, res, { code: 1, msg: '휴대폰 번호를 입력해주세요.' });
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

    if (checkUser) {
        sendError(req, res, { code: 2, msg: '이미 사용중인 휴대폰 번호 입니다.' });
        return;
    }

    let num = randomNum(4);
    let msg = `[차주인] 본인확인 인증번호[${num}]를 입력해주세요.`;

    let result = await sendSms(hp, msg);

    if (!result) {
        sendError(req, res, { code: 99, msg: '인증번호 발송에 실패했습니다.' });
        return;
    }

    await models.USER_TB.update(
        {
            certification: num,
            certification_hp: hp
        },
        {
            where: {
                idx: user?.idx,
            }
        }
    );

    rt.result = true;
    send(req, res, rt);
});


/* 휴대폰번호 변경(인증번호 검증) */
router.post('/updateHpCheck', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { certification, user, jwt, nowDt } = req.body;

    if (certification?.length !== 4) {
        sendError(req, res, { code: 1, msg: '인증번호를 입력해주세요.' });
        return;
    }

    if (user?.certification !== certification) {
        sendError(req, res, { code: 2, msg: '인증번호가 다릅니다.' });
        return;
    }

    // 중복 휴대폰 검사
    let checkUser = await models.USER_TB.scope([
        'active',
        'front',
    ]).findOne({
        raw: true,
        where: {
            hp: user?.certification_hp
        }
    });

    if (checkUser) {
        sendError(req, res, { code: 2, msg: '이미 사용중인 휴대폰 번호 입니다.' });
        return;
    }


    await models.USER_TB.update(
        {
            hp: user?.certification_hp,
            certification: null,
            certification_hp: null
        },
        {
            where: {
                idx: user?.idx,
            }
        }
    );

    rt.result = true;

    send(req, res, rt);
});



/* 회원정보 변경 */
router.post('/update', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { kakao_id, user, jwt, nowDt } = req.body;

    let updateList = {
        kakao_id: kakao_id || null
    };

    await models.USER_TB.update(
        updateList,
        {
            where: {
                idx: user?.idx
            }
        }
    )

    send(req, res, rt);
});


/* 프로필사진 등록 */
router.post('/profile', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { files, user, jwt, idx, nowDt } = req.body;

    if (files) {
        let urls = await s3UploadResize(files?.base, 'user', '', files?.ext);

        await models.USER_TB.update(
            {
                profile: urls
            },
            {
                where: {
                    idx: user?.idx
                }
            }
        )
    }

    send(req, res, rt);
});


/* 프로필사진 삭제 */
router.post('/profileRemove', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { user, jwt, idx, nowDt } = req.body;

    if (user?.profile) {
        s3Delete(user?.profile);

        await models.USER_TB.update(
            {
                profile: null
            },
            {
                where: {
                    idx: user?.idx
                }
            }
        )
    }

    send(req, res, rt);
});

/* 회원탈퇴 */
router.post('/leave', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { user, jwt, idx, nowDt } = req.body;

    // 회원 탈퇴처리
    await leaveFunc(user?.idx);

    send(req, res, rt);
});

/* 관심 리스트 */
router.post('/like', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: []
    }

    let { type, user, jwt, nowDt } = req.body;

    // for(var i = 0; i < 100; i++) {
    //     await models.LIKE_TB.create({
    //         u_idx: 225,
    //         board: (i%5) + 1,
    //         board_idx: (1%3) + 1
    //     })
    // }

    let list = await models.LIKE_TB.scope([
        'info'
    ]).findAll({
        where: {
            u_idx: user?.idx,
            board: type || 0
        },
        order: [
            ['idx', 'DESC']
        ]
    })

    rt.result = list;

    send(req, res, rt);
});

/* 관심 삭제 */
router.post('/likeDelete', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { idx, user, jwt, nowDt } = req.body;

    await models.LIKE_TB.destroy(
        {
            where: {
                idx: idx || 0,
                u_idx: user?.idx
            }
        }
    )

    send(req, res, rt);
});

/* 알림 리스트 */
router.post('/alarm', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: []
    }

    let { user, jwt, nowDt } = req.body;

    // for(var i = 0; i < 100; i++) {
    //     await models.LIKE_TB.create({
    //         u_idx: 225,
    //         board: (i%5) + 1,
    //         board_idx: (1%3) + 1
    //     })
    // }

    let list = await models.ALARM_TB.scope([
        'active',
        'info'
    ]).findAll({
        where: {
            u_idx: user?.idx
        },
        order: [
            ['idx', 'DESC']
        ]
    })

    rt.result = list;

    send(req, res, rt);
});

/* 알람 삭제 */
router.post('/alarmDelete', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { idx, user, jwt, nowDt } = req.body;

    let whereList = {
        u_idx: user?.idx
    }
    if (idx !== 'all') {
        whereList.idx = idx || 0;
    }

    await models.ALARM_TB.update(
        {
            delete_dt: nowDt
        },
        {
            where: whereList
        }
    )

    send(req, res, rt);
});


/* 예약상담 리스트 */
router.post('/consulting', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: []
    }

    let { type = 1, user, jwt, nowDt } = req.body;

    // for(var i = 0; i < 100; i++) {
    //     await models.LIKE_TB.create({
    //         u_idx: 225,
    //         board: (i%5) + 1,
    //         board_idx: (1%3) + 1
    //     })
    // }
    let whereList = {
        type: 1
    };

    if (type * 1 === 2) {
        whereList.u_idx = user?.idx;
    } else {
        whereList.target_idx = user?.idx;
    }

    let list = await models.CONSULTING_TB.scope([
        'info'
    ]).findAll({
        attributes: {
            exclude: ['desc', 'hp', 'sido', 'sigungu', 'update_dt', 'delete_dt']
        },
        where: whereList,
        order: [
            ['idx', 'DESC']
        ]
    })

    rt.result = list;

    send(req, res, rt);
});

/* 예약상담 상세 */
router.post('/consultingGet', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: []
    }

    let { idx, user, jwt, nowDt } = req.body;

    // for(var i = 0; i < 100; i++) {
    //     await models.LIKE_TB.create({
    //         u_idx: 225,
    //         board: (i%5) + 1,
    //         board_idx: (1%3) + 1
    //     })
    // }
    let whereList = {
        idx: idx || 0,
        [Op.or]: [
            { u_idx: user?.idx },
            { target_idx: user?.idx }
        ],
    };

    let row = await models.CONSULTING_TB.scope([
        'info'
    ]).findOne({
        where: whereList,
    })

    if (!row) {
        sendError(req, res, { code: 1, msg: '존재하지 않는 내역입니다.' });
        return;
    }

    if (row?.target_idx === user?.idx && !row?.read_dt) {
        row.update({
            read_dt: nowDt
        })
    }

    rt.result = row;

    send(req, res, rt);
});


/* 문의하기 리스트 */
router.post('/cs', async (req, res) => {

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
        'active'
    ]).findAll({
        where: {
            u_idx: user?.idx
        },
        order: [
            ['idx', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});

/* 문의하기 등록 */
router.post('/csInsert', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let {
        desc,
        user,
        jwt,
        nowDt
    } = req.body;

    if (!desc) {
        sendError(req, res, { code: 1, msg: '문의내용을 입력해주세요.' });
        return;
    }

    let updateList = {
        u_idx: user?.idx,
        desc
    }

    await models.CS_TB.create(
        updateList
    )

    send(req, res, rt);


    /** 카카오 알림톡 전송 */
    let template = await talkList('TT_9384');

    let msg = template?.templtContent;

    msg = msg?.replace("#{등록일시}", moment().format('YYYY.MM.DD HH시mm분'));
    msg = msg?.replace("#{이름}", user?.name);

    msg = msg?.replace("#{고객센터전화번호}", consts?.serviceCenterTel);
    msg = msg?.replace("#{고객센터이메일}", consts?.serviceCenterEmail);

    let button = template?.buttons?.map(x => {
        if (x?.linkType !== "WL") return x;

        let linkMo = x?.linkMo?.replace("#{웹링크}", "chajooin.com/mypageCs");
        let linkPc = x?.linkPc?.replace("#{웹링크}", "chajooin.com/mypageCs");
        return { ...x, linkMo, linkPc }
    });

    let talk_one = {
        receiver: user?.hp,
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


/* 자동차 소유자인증 hash 생성 */
router.post('/carApiHash', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let {
        type,
        carOwner,
        carRegNo,
        user,
        jwt,
        nowDt
    } = req.body;

    const { WEB_DOMAIN, API_DOMAIN } = process.env;

    if (!carOwner || !carRegNo) {
        sendError(req, res, { code: 1, msg: '필수입력값을 확인해주세요.' });
        return;
    }

    const token = sign({ idx: user?.idx, carOwner: carOwner, carRegNo: carRegNo });

    // const svcCodeArr = "00283E79700C4A714A49C1099B05A78F,00283E796FECF1798DEC7DE2280EFAE1,00283E796FFE2D88AEEF8147DB21E8A1";
    const svcCodeArr = "68B60373-FBDCEDA0-FCD3C1C2-7DA896E6";
    const insttCode = "00283E796FD1CE7FFA585EA2276162C8";
    const timeStamp = moment(nowDt).format('YYYYMMDDHHmmss');
    const encryptKey = "ts2020";
    const preHashValue = insttCode + timeStamp + encryptKey;

    const encoder = new TextEncoder();
    const data = encoder.encode(preHashValue);

    // Generate the hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashValue = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const siteURL = WEB_DOMAIN;
    const siteName = "차주인";

    // car_owner
    // car_reg_no

    const returnURLA = API_DOMAIN + "/carSuccess?token=" + token;
    const returnURLD = API_DOMAIN + "/carFail";


    rt.result = {
        hashValue,
        timeStamp,
        svcCodeArr,
        siteURL,
        siteName,
        returnURLA,
        returnURLD,
        token
    }

    console.log("rt", rt);
    send(req, res, rt);


    // 차량소유자인증 초기화
    await models.USER_TB.update(
        {
            car_owner: null,
            car_reg_no: null
        },
        {
            where: {
                idx: user?.idx
            }
        }
    );

});

/* 자동차 소유자인증 결과확인 */
router.post('/carApiCheck', async (req, res) => {

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


    if (!user?.car_owner || !user?.car_reg_no) {
        sendError(req, res, { code: 1, msg: '소유자인증에 실패했습니다.' });
        return;
    }

    rt.result = {
        carOwner: user?.car_owner,
        carRegNo: user?.car_reg_no
    }

    console.log("rt", rt);
    send(req, res, rt);

});














/* 블랙리스트 삭제 */
router.post('/blackRemove', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { idx, user, jwt, nowDt } = req.body;

    if (!idx) {
        sendError(req, res, { code: 99, msg: '잘못된 접근입니다.' });
        return;
    }

    await models.BLACKLIST_TB.destroy(
        {
            where: {
                idx: idx,
                u_idx: user?.idx
            }
        }
    )

    send(req, res, rt);
});





module.exports = router;
