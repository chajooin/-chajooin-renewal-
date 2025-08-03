const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, s3Upload, recruitEndFunc, s3UploadResize, s3UploadResizeNew, s3Delete, getOptions, boardAlarmFunc, send, sendError, getBlack, itemDeleteFunc, kakaoApi, filterItems, logFunc, common, scd, frontNotCheck, alarmFunc, calculatePercentage, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn, customerReturn } = require('../../service/returns.js');
const consts = require('../../service/consts.json');

const models = require('../../models');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(scd);
router.use(frontNotCheck);

/* 구직글 리스트 */
router.post('/list', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        order,
        my,
        user,
        jwt,
        nowDt 
    } = req.body;

    let orderList = [
        ['idx', 'DESC']
    ];
    let whereList = {};

    if(order*1 === 2) orderList = [ ['view', 'DESC'], ...orderList ];

    let scopes = ['list', 'active', 'likeCnt'];

    if(!my) {
        scopes = [...scopes, 'notTemp'] ;
        whereList.status = 1;
    } else {
        whereList.u_idx = user?.idx || 0;
    }
    
    let list = await models.BOARD_JOB_TB.scope(scopes).findAll({
        raw: true,
        order: orderList,
        where: whereList
    });

    rt.result = list;
    send(req, res, rt);


    /** 더미데이터 생성기 */
    return;
    let options = await getOptions();
    
    for(var i = 1; i <= 2000; i++) {
        let test = {
            u_idx: (i%2) === 1 ? 225 : 230,
            status: (i%2) + 1, // 상태  
            title: `${i} - 프랜차이즈 구합니다. 구직글입니다. 테스트입니다.`, // 제목
            go_sido: (i%2) === 1 ? "서울" : '경기', // 등록지역 시/도
            go_sigungu: (i%2) === 1 ? "마포구" : '하남시', // 등록지역 시/군/구
            item: options?.item_option[i%options?.item_option?.length],
            unloading: options?.unloading_option[i%options?.unloading_option?.length],
            work: `${i%12}시부터 22시까지`,
            dayoff: "일휴무, 토일 휴무",
            pay: i,
            ton: options?.ton_option[i%options?.ton_option?.length],
            cargo_option: (i%2),
            danger_option: (i%2),
            health_option: (i%2),
            machinery_option: (i%2),
            gender: (i%2) === 1 ? "남성" : '여성',
            age: (i%20) + 30,
            education: options?.education_option[i%options?.education_option?.length],
            career_option: (i%2) + 1,
            career: ((i%2 + 1) === 2) ? (i%40) : 0,
            desc: `${i} 구직 내용입니다. ~~일을 희망합니다 ${i}`, // 차량 상세 설명
        }

        await models.BOARD_JOB_TB.create(
            test,
        );
    }
    /** 더미데이터 생성기 끝 */

});


/* 구직글 상세조회 */
router.post('/get', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        idx,
        init,
        user,
        jwt,
        nowDt 
    } = req.body;

    let row = await models.BOARD_JOB_TB.scope([
        'active',
        'likeCnt'
    ]).findOne({
        where: {
            idx: idx || 0
        }
    });

    if(!row) {
        sendError(req, res, {code: 1, msg: '존재하지 않는 글입니다.'}); 
        return;
    }
    if(row?.status !== 1 && (row?.u_idx !== user?.idx) ) {
        sendError(req, res, {code: 1, msg: '존재하지 않는 글입니다.'}); 
        return;
    }

    if(init) await row.update({ view: row?.view + 1 });
     
    let writer = await row.getUser();
    writer = writer?.get({ plain: true });

    let like = await models.LIKE_TB.findOne({
        raw: true,
        where: {
            u_idx: user?.idx || 0,
            board: consts.boardJobKey,
            board_idx: row?.idx
        }
    });


    rt.result = {
        ...row.get({ plain: true }),
        like_check: like?.idx ? true : false,
        writer:  {
            name: writer?.name,
            profile: writer?.profile,
            kakao_id: writer?.kakao_id || '-',
            hp: writer?.hp
        }
    };

    send(req, res, rt);

});


/* 구직글 등록/수정 */
router.post('/insert', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        idx,
        status,
        title,
        gender,
        age,
        education,
        career_option,
        career,
        cargo_option,
        danger_option,
        health_option,
        machinery_option,
        ton,
        item,
        go_sido,
        go_sigungu,
        unloading=[],
        work,
        dayoff,
        pay,
        desc,
        user,
        jwt,
        nowDt 
    } = req.body;

    if(!user) {
        sendError(req, res, {code: 1100, msg: '로그인이 필요합니다.'}); 
        return; 
    }

    let option = await getOptions();
    let { boardStatusConsts } = common();
    
    let row = "";
    if(idx) {
        row = await models.BOARD_JOB_TB.findOne({
            where: {
                idx: idx,
                u_idx: user?.idx
            }
        });
        if(!row) { sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.'}); return; }
    }

    if(!title) { sendError(req, res, {code: 1, msg: '제목을 입력해주세요.'}); return; }
    if(!gender) { sendError(req, res, {code: 1, msg: '성별을 선택해주세요.'}); return; }
    if(!age) { sendError(req, res, {code: 1, msg: '나이를 입력해주세요.'}); return; }
    if(!option?.education_option?.includes(education)) { sendError(req, res, {code: 1, msg: '학력을 선택해주세요.'}); return; }
    if(!career_option) { sendError(req, res, {code: 1, msg: '경력을 선택해주세요.'}); return; }
    if(career_option === 2 && !career) { sendError(req, res, {code: 1, msg: '경력년수를 입력해주세요.'}); return; }
    if(!ton) { sendError(req, res, {code: 1, msg: '톤수를 입력해주세요.'}); return; }
    if(!option?.item_option?.includes(item)) { sendError(req, res, {code: 1, msg: '운송품목을 선택해주세요.'}); return; }
    if(!go_sido) { sendError(req, res, {code: 1, msg: '출근지를 선택해주세요.'}); return; }
    if(!go_sigungu) { sendError(req, res, {code: 1, msg: '출근지를 선택해주세요.'}); return; }
    if(unloading?.length < 1) { sendError(req, res, {code: 1, msg: '상하차형태를 선택해주세요.'}); return; }
    if(!work) { sendError(req, res, {code: 1, msg: '근무시간을 입력해주세요.'}); return; }
    if(!dayoff) { sendError(req, res, {code: 1, msg: '휴무를 입력해주세요.'}); return; }
    if(!pay) { sendError(req, res, {code: 1, msg: '월급여를 입력해주세요.'}); return; }
    if(!desc) { sendError(req, res, {code: 1, msg: '상세내용을 입력해주세요.'}); return; }
    
    if(!boardStatusConsts?.find(x => x?.idx === status*1) && status*1 !== 99 ) { sendError(req, res, {code: 1, msg: '등록 상태를 선택해주세요.'}); return; }
    
    
    let updateList = {
        status,
        title,
        gender,
        age,
        education,
        career_option,
        career: career_option === 2 ? career : 0,
        cargo_option,
        danger_option,
        health_option,
        machinery_option,
        ton: ton,
        item,
        go_sido,
        go_sigungu,
        unloading: unloading?.join(","),
        work,
        dayoff,
        pay: pay || 0,
        desc,
    }

    try {
        if(row) {
            row.update( updateList );
        } else {
    
            updateList.u_idx = user?.idx;
    
            row = await models.BOARD_JOB_TB.create(
                updateList,
            );
        }
    } catch (error) {
        console.log('error', error);
        sendError(req, res, {code: 1200, msg: '올바른 값이 아닙니다.'}); 
        return;
    }
   
    rt.result = row?.idx;
    send(req, res, rt);

});


/* 구직글 글 삭제 */
router.post('/delete', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        idx,
        user,
        jwt,
        nowDt 
    } = req.body;

    let row = await models.BOARD_JOB_TB.findOne({
        where: {
            idx: idx || 0,
            u_idx: user?.idx || 0
        }
    });

    if(!row) { sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.'}); return; }

    await row.update({
        delete_dt: nowDt
    });
    
    send(req, res, rt);
    
});

/* 구직글 관심 ON/OFF */
router.post('/like', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { 
        idx,
        user,
        jwt,
        nowDt 
    } = req.body;

    if(!user) {
        sendError(req, res, {code: 1100, msg: '로그인이 필요합니다.'}); 
        return; 
    }

    let like = await models.LIKE_TB.findOne({
        where: {
            u_idx: user?.idx || 0,
            board: consts.boardJobKey,
            board_idx: idx || 0
        }
    });
   
    if(like) {
        await like.destroy();
        rt.result.like_check = false;
    } else {
        await models.LIKE_TB.create({
            u_idx: user?.idx,
            board: consts.boardJobKey,
            board_idx: idx || 0
        });
        rt.result.like_check = true;
    }

    let cnt = await models.LIKE_TB.count({
        where: {
            board: consts.boardJobKey,
            board_idx: idx || 0
        }
    });

    rt.result.like_cnt = cnt;

    send(req, res, rt);
});


/* 구직글 신고하기 */
router.post('/report', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        idx,
        title=[],
        desc,
        files,
        user,
        jwt,
        nowDt 
    } = req.body;

    if(!user) {
        sendError(req, res, {code: 1100, msg: '로그인이 필요합니다.'}); 
        return; 
    }
    if(title?.length < 1) {
        sendError(req, res, {code: 1, msg: '신고사유를 선택해주세요.'}); 
        return; 
    }
    if(!desc) {
        sendError(req, res, {code: 1, msg: '신고내용을 입력해주세요.'}); 
        return; 
    }


    let row = await models.BOARD_JOB_TB.scope([
        'active',
        'notTemp',
    ]).findOne({
        where: {
            idx: idx || 0
        }
    });

    if(!row) {
        sendError(req, res, {code: 2, msg: '존재하지 않는 글입니다.'}); 
        return; 
    }


    let updateList = {
        u_idx: user?.idx,
        target_idx: row?.u_idx,
        title: title?.join(","),
        desc,
        board: consts.boardJobKey,
        board_idx: row?.idx
    }

    let item = await models.REPORT_TB.create(
        updateList,
    );

    await Promise.all(
        files?.filter(item => item?.base)?.map( async (x, i) => {

            let urls = await s3UploadResizeNew({
                base64: x?.base, 
                dir: 'report',
                ext: x?.ext,
                width: 1200
            });

            if(urls) {
                let updateSubList = {
                    type: consts.fileReportKey,
                    target_idx: row?.idx,
                    file_path: urls
                };

                await models.FILE_TB.create(
                    updateSubList
                )
            }
        })
    )

    send(req, res, rt);
});


module.exports = router;
