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

/* 구인글 리스트 */
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
        scopes = [...scopes, 'notTemp'];
        // whereList.status = 1;

    } else {
        whereList.u_idx = user?.idx || 0;
    }
    
    let list = await models.BOARD_RECRUIT_TB.scope(scopes).findAll({
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
            idx: null, // 있으면 수정 없으면 등록 
            status: (i%2) + 1, // 상태  
            company: `교촌치킨${i}`,
            title: `${i} - 냉탑칸막이 1톤 교천치킨매장 기사님 급구합니다.`, // 제목
            go_sido: (i%2) === 1 ? "서울" : '경기', // 등록지역 시/도
            go_sigungu: (i%2) === 1 ? "마포구" : '하남시', // 등록지역 시/군/구
            item: options?.item_option[i%options?.item_option?.length],
            section: `운행구간입니다. ~~부터 운행지 ${i}번 까지`,
            unloading: options?.unloading_option[i%options?.unloading_option?.length],
            work: `${i%12}시부터 22시까지`,
            dayoff: "일휴무, 토일 휴무",
            pay: i,
            deadline_type: (i%3) + 1,
            deadline: (i%3) + 1 === 3 ? moment().add(i, 'D').format('YYYY-MM-DD') : null,
            ton: options?.ton_option[i%options?.ton_option?.length],
            certificate: options?.certificate_option[i%options?.certificate_option?.length],
            cargo_option: (i%2),
            danger_option: (i%2),
            health_option: (i%2),
            machinery_option: (i%2),
            worktype: options?.worktype_option[i%options?.worktype_option?.length],
            gender: options?.gender_option[i%options?.gender_option?.length],
            education: options?.education_option[i%options?.education_option?.length],
            career: options?.career_option[i%options?.career_option?.length],
            desc: `${i} 이 차는 이렇습니다. 저렇습니다. ${i}`, // 차량 상세 설명
        }

        await models.BOARD_RECRUIT_TB.create(
            test,
        );
    }
    /** 더미데이터 생성기 끝 */

});


/* 구인글 상세조회 */
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

    let row = await models.BOARD_RECRUIT_TB.scope([
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
    if(row?.status === 99 && (row?.u_idx !== user?.idx) ) {
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
            board: consts.boardRecruitKey,
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


/* 구인글 등록/수정 */
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
        company,
        go_sido,
        go_sigungu,
        item,
        section,
        unloading=[],
        work,
        dayoff,
        pay,
        deadline_type,
        deadline,
        ton,
        certificate,
        cargo_option,
        danger_option,
        health_option,
        machinery_option,
        worktype,
        gender,
        education,
        career,
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
        row = await models.BOARD_RECRUIT_TB.findOne({
            where: {
                idx: idx,
                u_idx: user?.idx
            }
        });
        if(!row) { sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.'}); return; }
    }


    if(!title) { sendError(req, res, {code: 1, msg: '제목을 입력해주세요.'}); return; }
    if(!company) { sendError(req, res, {code: 1, msg: '업체명을 입력해주세요.'}); return; }
    if(!go_sido) { sendError(req, res, {code: 1, msg: '출근지를 선택해주세요.'}); return; }
    if(!go_sigungu) { sendError(req, res, {code: 1, msg: '출근지를 선택해주세요.'}); return; }

    // if(!option?.item_option?.includes(item)) { sendError(req, res, {code: 1, msg: '운송품목을 선택해주세요.'}); return; }

    if(!section) { sendError(req, res, {code: 1, msg: '운행구간을 입력해주세요.'}); return; }
    if(unloading?.length < 1) { sendError(req, res, {code: 1, msg: '상하차형태를 선택해주세요.'}); return; }
    if(!work) { sendError(req, res, {code: 1, msg: '근무시간을 입력해주세요.'}); return; }
    if(!dayoff) { sendError(req, res, {code: 1, msg: '휴무를 입력해주세요.'}); return; }
    if(!pay) { sendError(req, res, {code: 1, msg: '월급여를 입력해주세요.'}); return; }

    if(!deadline_type) { sendError(req, res, {code: 1, msg: '접수마감을 선택해주세요.'}); return; }
    if(deadline_type*1 === 3 && !moment(deadline).isValid()) { sendError(req, res, {code: 1, msg: '접수마감일을 입력해주세요.'}); return; }

    if(!ton) { sendError(req, res, {code: 1, msg: '톤수를 입력해주세요.'}); return; }
    if(!option?.certificate_option?.includes(certificate)) { sendError(req, res, {code: 1, msg: '적합면허를 선택해주세요.'}); return; }
    if(!option?.worktype_option?.includes(worktype)) { sendError(req, res, {code: 1, msg: '근무형태를 선택해주세요.'}); return; }
    if(!option?.gender_option?.includes(gender)) { sendError(req, res, {code: 1, msg: '성별을 선택해주세요.'}); return; }
    if(!option?.education_option?.includes(education)) { sendError(req, res, {code: 1, msg: '학력을 선택해주세요.'}); return; }
    if(!option?.career_option?.includes(career)) { sendError(req, res, {code: 1, msg: '경력을 선택해주세요.'}); return; }

    if(!desc) { sendError(req, res, {code: 1, msg: '상세내용을 입력해주세요.'}); return; }
    
    if(!boardStatusConsts?.find(x => x?.idx === status*1) && status*1 !== 99 ) { sendError(req, res, {code: 1, msg: '등록 상태를 선택해주세요.'}); return; }

    let updateList = {
        status,
        title,
        company,
        go_sido,
        go_sigungu,
        // item,
        section,
        unloading: unloading?.join(","),
        work,
        dayoff,
        pay: pay || 0,
        deadline_type: deadline_type || 1,
        deadline: deadline_type*1 === 3 ? moment(deadline).format('YYYY-MM-DD') : null,
        ton: ton,
        certificate,
        cargo_option,
        danger_option,
        health_option,
        machinery_option,
        worktype,
        gender,
        education,
        career,
        desc
    }

    try {
        if(row) {
            row.update( updateList );
        } else {
    
            updateList.u_idx = user?.idx;
    
            row = await models.BOARD_RECRUIT_TB.create(
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


/* 구인글 글 삭제 */
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

    let row = await models.BOARD_RECRUIT_TB.findOne({
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

/* 구인글 관심 ON/OFF */
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
            board: consts.boardRecruitKey,
            board_idx: idx || 0
        }
    });
   
    if(like) {
        await like.destroy();
        rt.result.like_check = false;
    } else {
        await models.LIKE_TB.create({
            u_idx: user?.idx,
            board: consts.boardRecruitKey,
            board_idx: idx || 0
        });
        rt.result.like_check = true;
    }

    let cnt = await models.LIKE_TB.count({
        where: {
            board: consts.boardRecruitKey,
            board_idx: idx || 0
        }
    });

    rt.result.like_cnt = cnt;

    send(req, res, rt);
});


/* 구인글 신고하기 */
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


    let row = await models.BOARD_RECRUIT_TB.scope([
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
        board: consts.boardRecruitKey,
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


/* 구인글 글 삭제 */
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

    let row = await models.BOARD_JEEIP_TB.findOne({
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

module.exports = router;
