const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, s3Upload, pointFunc, consultingTalkSend, s3UploadResizeNew, s3Delete, getOptions, boardAlarmFunc, send, sendError, getBlack, itemDeleteFunc, kakaoApi, filterItems, logFunc, common, scd, frontNotCheck, alarmFunc, calculatePercentage, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn, customerReturn } = require('../../service/returns.js');
const consts = require('../../service/consts.json');

const models = require('../../models');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(scd);
router.use(frontNotCheck);

/* 중고화물차 리스트 */
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

    if(order*1 === 2) orderList = [ ['view', 'DESC'], ...orderList ];
    else if(order*1 === 3) orderList = [ ['like_cnt', 'DESC'], ...orderList ];
    else if(order*1 === 4) orderList = [ [ sequelize.literal('( price + license_price)') , 'ASC'], ...orderList ];
    else if(order*1 === 5) orderList = [ [ sequelize.literal('( price + license_price)') , 'DESC'], ...orderList ];

    let scopes = ['list', 'active', 'likeCnt'];
    let whereList = {};
    if(!my) {
        scopes = [...scopes, 'notTemp'];
    } else {
        whereList.u_idx = user?.idx || 0;
    }
    
    let list = await models.BOARD_TRUCK_TB.scope(scopes).findAll({
        raw: true,
        order: orderList,
        where: whereList
    });

    rt.result = list;
    send(req, res, rt);
});


/* 중고화물차 상세조회 */
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

    let row = await models.BOARD_TRUCK_TB.scope([
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
            board: consts.boardTruckKey,
            board_idx: row?.idx
        }
    });
   
    let consulting = await models.CONSULTING_TB.findAll({
        raw: true,
        where: {
            u_idx: user?.idx || 0,
            board: consts.boardTruckKey,
            board_idx: row?.idx
        }
    });

    let consulting_data = {
        call: consulting?.length > 0 ? true : false,
        reservation: consulting?.filter(x => x?.type === 1)?.length > 0 ? true : false
    };


    rt.result = {
        ...row.get({ plain: true }),
        like_check: like?.idx ? true : false,
        consulting_pay: consulting_data,
        writer: {
            name: writer?.name,
            profile: writer?.profile,
            kakao_id: consulting?.length > 0 ? (writer?.kakao_id || '-') : null,
            hp: consulting?.length > 0 ? writer?.hp : null
        }
    };

    send(req, res, rt);


    /** 더미데이터 생성기 */
    return;
    let options = await getOptions();

    for(var i = 1; i <= 10000; i++) {
        let test = {
            idx: null, // 있으면 수정 없으면 등록 
            status: (i%2) + 1, // 상태  
            title: `중고화물차${i} 판매중!!!`, // 제목
            maker: (i%2) === 1 ? "기아" : '현대', // 제조사(API)
            car: (i%2) === 1 ? "기아1" : '메가트럭', // 차량모델(API)
            year: `20${i%20}`, // 연식 연도 YYYY
            month: `0${i%9}`, // 연식 월 MM
            distance: 100 * i, // 주행거리 km
            usage: options?.usage_option[i%options?.usage_option?.length], // 차량용도 config usage_option 값중 하나
            type: (i%2) === 1 ? "카고" : '윙바디/탑', // 차량형식(API)
            sub_type: (i%2) === 1 ? "파워게이트" : '저상형 윙바디', // 세부차량형식(API)
            ton: options?.ton_option[i%options?.ton_option?.length], // 톤 수 config ton_option 값중 하나거나 직접입력한 소수점 한자리까지
            axis: options?.axis_option[i%options?.axis_option?.length], // 가변축 config axis_option 값중 하나
            color: options?.color_option[i%options?.color_option?.length], // 차량색상 config color_option 값중 하나
            box_area: options?.box_area_option[i%options?.box_area_option?.length], // 적재함 넓이 config box_area_option 값중 하나
            box_height: options?.box_height_option[i%options?.box_height_option?.length], // 적재함 놃이 config box_height_option 값중 하나
            box_width: options?.box_width_option[i%options?.box_width_option?.length], // 적재함 길이 config box_width_option 값중 하나
            transmission: options?.transmission_option[i%options?.transmission_option?.length], // 변속기 config transmission_option 값중 하나
            fuel: options?.fuel_option[i%options?.fuel_option?.length], // 연료형태 config fuel_option 값중 하나
            sido: (i%2) === 1 ? "서울" : '경기', // 등록지역 시/도
            sigungu: (i%2) === 1 ? "마포구" : '하남시', // 등록지역 시/군/구
            price: (i*10) + 100, // 차량판매가(만원단위)
            license_sell: (i%2), // 넘버 판매 여부(true=판매 false=판매안함)
            license_type: (i%2) ? (i < 500 ? "개인넘버" : "법인넘버") : "", // 넘버종류 config license_option 값중 하나
            license_price: (i%2) ? (i*10) + 100 : 0, // 넘버가격(만원단위)
            options: "차량일반옵션1", // 일반 옵션 리스트 config options_option 값중 여러개
            etc_options: "차량기타옵션1,차량기타옵션2", // 기타 옵션 리스트 config etc_options_option 값중 여러개
            desc: `${i} 이 차는 이렇습니다. 저렇습니다. ${i}`, // 차량 상세 설명
            name: `홍길동${i}`, // 차량 소유자 이름(차량 소유자 인증 통과)
            car_num: `12가${(i+"").padStart(4, "0")}`, // 차량 등록번호(차량 소유자 인증 통과)
        }

        await models.BOARD_TRUCK_TB.create(
            test,
        );
    }
     /** 더미데이터 생성기 끝 */
    
});


/* 중고화물차 등록/수정 */
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
        maker,
        car,
        year,
        month,
        distance=0,
        usage,
        type,
        sub_type,
        ton=0,
        axis,
        color,
        box_area,
        box_height,
        box_width,
        box_palette,
        transmission,
        fuel,
        sido,
        sigungu,
        price=0,
        license_sell,
        license_type,
        license_price=0,
        options=[],
        etc_options=[],
        desc,
        photo_1,
        photo_2,
        photo_3,
        photo_4,
        photo_5,
        photo_6,
        photo_7,
        photo_8,
        photo_9,
        photo_10,
        ad,
        delete_files,
        name,
        car_num,
        car_token,
        car_auth_type,
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
    let goods = await models.POINT_GOODS_TB.findOne({
        where: {
            idx: 5
        }
    });
    
    let row = "";
    if(idx) {
        row = await models.BOARD_TRUCK_TB.findOne({
            where: {
                idx: idx,
                u_idx: user?.idx
            }
        });
        if(!row) { sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.'}); return; }
    }

    if(!title) { sendError(req, res, {code: 1, msg: '제목을 입력해주세요.'}); return; }
    if(!maker) { sendError(req, res, {code: 1, msg: '제조사를 선택해주세요.'}); return; }
    if(!car) { sendError(req, res, {code: 1, msg: '차종을 선택해주세요.'}); return; }
    if(!year) { sendError(req, res, {code: 1, msg: '차량연식을 입력해주세요.'}); return; }
    if(!month) { sendError(req, res, {code: 1, msg: '차량연식을 입력해주세요.'}); return; }

    if(!type) { sendError(req, res, {code: 1, msg: '차량형식을 선택해주세요.'}); return; }
    if(!sub_type) { sendError(req, res, {code: 1, msg: '세부차량형식을 선택해주세요.'}); return; }
    if(!ton) { sendError(req, res, {code: 1, msg: '톤수를 입력해주세요.'}); return; }
    if(!sido) { sendError(req, res, {code: 1, msg: '등록지역을 선택해주세요.'}); return; }
    if(!sigungu) { sendError(req, res, {code: 1, msg: '등록지역을 선택해주세요.'}); return; }
    if(!price) { sendError(req, res, {code: 1, msg: '차량판매가를 입력해주세요.'}); return; }

    // if(!name) { sendError(req, res, {code: 1, msg: '차량소유주를 입력해주세요.'}); return; }
    // if(!car_num) { sendError(req, res, {code: 1, msg: '차량번호를 입력해주세요.'}); return; }

    if(!boardStatusConsts?.find(x => x?.idx === status*1) && status*1 !== 99 ) { sendError(req, res, {code: 1, msg: '등록 상태를 선택해주세요.'}); return; }
    
    if(!option?.usage_option?.includes(usage)) { sendError(req, res, {code: 1, msg: '차량용도를 선택해주세요.'}); return; }
    if(!option?.axis_option?.includes(axis)) { sendError(req, res, {code: 1, msg: '가변축을 선택해주세요.'}); return; }
    if(!option?.color_option?.includes(color)) { sendError(req, res, {code: 1, msg: '차량색상을 선택해주세요.'}); return; }

    if(!box_area) { sendError(req, res, {code: 1, msg: '적재함 넓이를 입력해주세요.'}); return; }
    if(!box_height) { sendError(req, res, {code: 1, msg: '적재함 높이를 입력해주세요.'}); return; }
    if(!box_width) { sendError(req, res, {code: 1, msg: '적재함 길이를 입력해주세요.'}); return; }
    if(!box_palette) { sendError(req, res, {code: 1, msg: '파렛수를 입력해주세요.'}); return; }

    // if(!option?.box_area_option?.includes(box_area)) { sendError(req, res, {code: 1, msg: '적재함 넓이를 선택해주세요.'}); return; }
    // if(!option?.box_height_option?.includes(box_height)) { sendError(req, res, {code: 1, msg: '적재함 높이를 선택해주세요.'}); return; }
    // if(!option?.box_width_option?.includes(box_width)) { sendError(req, res, {code: 1, msg: '적재함 길이를 선택해주세요.'}); return; }

    if(!option?.transmission_option?.includes(transmission)) { sendError(req, res, {code: 1, msg: '변속기를 선택해주세요.'}); return; }
    if(!option?.fuel_option?.includes(fuel)) { sendError(req, res, {code: 1, msg: '연료형태를 선택해주세요.'}); return; }

    if(license_sell && !option?.license_option?.includes(license_type)) { sendError(req, res, {code: 1, msg: '넘버종류를 선택해주세요.'}); return; }
    if(license_sell && !license_price) { sendError(req, res, {code: 1, msg: '넘버가격을 입력해주세요.'}); return; }
    

    if(!idx) {
        if(!car_auth_type && car_auth_type !== 1 && car_auth_type !== 2) {
            sendError(req, res, {code: 1, msg: '차량소유자 인증종류를 선택해주세요.'}); 
            return;
        }
        if(car_auth_type === 1 && (!user?.car_owner || !user?.car_reg_no)) {
            sendError(req, res, {code: 1, msg: '차량소유자 인증을 진행해주세요.'}); 
            return;
        }
      
        if(car_auth_type === 2 && (!car_num)) {
            sendError(req, res, {code: 1, msg: '차량번호를 입력해주세요.'}); 
            return;
        }
        if(car_auth_type === 2 && (!photo_9 || !photo_10)) {
            sendError(req, res, {code: 1, msg: '서류인증 자료를 첨부해주세요.'}); 
            return;
        }
    }

    let updateList = {
        status,
        title,
        maker,
        car,
        year,
        month,
        distance,
        usage,
        type,
        sub_type,
        ton: ton,
        axis,
        color,
        box_area,
        box_height,
        box_width,
        box_palette,
        transmission,
        fuel,
        sido,
        sigungu,
        price,
        license_sell,
        license_type: license_sell ? license_type : null,
        license_price: license_sell ? license_price : 0,
        options: options?.join(","),
        etc_options: etc_options?.join(","),
        desc
        
    }

    if(ad && (!idx || !row?.ad)) {

        if(user?.point < goods?.point) {
            sendError(req, res, {code: 1, msg: '보유포인트가 부족합니다.'}); 
            return;
        }

        updateList.ad = true;
        updateList.start_dt = nowDt;
        updateList.end_dt = moment().add(30, 'd').format('YYYY-MM-DD 23:59:59');
    }

    await Promise.all(
        delete_files?.map( async (x, i) => {
            s3Delete(x?.file_path);
            updateList[x?.key] = null;
        })
    )
    let photos = {
        photo_1,
        photo_2,
        photo_3,
        photo_4,
        photo_5,
        photo_6,
        photo_7,
        photo_8,
        photo_9,
        photo_10
    }

    for(var i = 1; i <= 10; i++) {
        let one = photos[`photo_${i}`];
        if(one) {
            let urls = await s3UploadResizeNew({
                base64: one?.base, 
                dir: 'board',
                ext: one?.ext
            });
            if(urls) { updateList[`photo_${i}`] = urls; }
        }
    }
    
    try {
        if(row) {
            if(row?.car_auth_type === 2 && row?.car_auth_state === 99) {
                updateList.name = '법인인증';
                updateList.car_num = car_num;
                updateList.car_auth_state = 1;
            }

            row.update( updateList );
        } else {
    
            updateList.u_idx = user?.idx;
            updateList.car_auth_type = car_auth_type;

            if(car_auth_type === 1) {
                updateList.name = user?.car_owner;
                updateList.car_num = user?.car_reg_no;
                updateList.car_auth_state = 2;
            } else {
                updateList.name = '법인인증';
                updateList.car_num = car_num;
                updateList.car_auth_state = 1;
            }
            
            row = await models.BOARD_TRUCK_TB.create(
                updateList,
            );
            
        }
    } catch (error) {
        console.log('error', error);
        sendError(req, res, {code: 1200, msg: '올바른 값이 아닙니다.'}); 
        return;
    }
    
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
    
    if(updateList.ad) {

        let data = {
            idx: user?.idx,
            type: 1,
            point: goods?.point,
            title: goods?.title
        };
    
        await pointFunc(data);
    }

    
    rt.result = row?.idx;

    send(req, res, rt);


    // 조건 매칭 매물 전송
    if(!idx) {
        boardAlarmFunc({
            data: row,
            type: consts.boardTruckKey
        });
    }
    
});


/* 중고화물차 글 삭제 */
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

    let row = await models.BOARD_TRUCK_TB.findOne({
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

/* 중고화물차 관심 ON/OFF */
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
            board: consts.boardTruckKey,
            board_idx: idx || 0
        }
    });
   
    if(like) {
        await like.destroy();
        rt.result.like_check = false;
    } else {
        await models.LIKE_TB.create({
            u_idx: user?.idx,
            board: consts.boardTruckKey,
            board_idx: idx || 0
        });
        rt.result.like_check = true;
    }

    let cnt = await models.LIKE_TB.count({
        where: {
            board: consts.boardTruckKey,
            board_idx: idx || 0
        }
    });

    rt.result.like_cnt = cnt;

    send(req, res, rt);
});


/* 중고화물차 상담신청 */
router.post('/consulting', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        idx,
        type,
        name,
        hp,
        sido,
        sigungu,
        desc,
        user,
        jwt,
        nowDt 
    } = req.body;

    if(!user) {
        sendError(req, res, {code: 1100, msg: '로그인이 필요합니다.'}); 
        return; 
    }

    // 입력값 검사
    if(type*1 !== 1 && type*1 !== 2) {
        sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.'}); 
        return; 
    }
    if(type*1 === 1 && (!name || !hp || !sido || !sigungu || !desc)) {
        sendError(req, res, {code: 1200, msg: '필수내용을 입력해주세요.'}); 
        return; 
    }

    let row = await models.BOARD_TRUCK_TB.scope([
        'active',
        'notTemp',
    ]).findOne({
        where: {
            idx: idx || 0
        }
    });

    // 게시물 검사
    if(!row) {
        sendError(req, res, {code: 1, msg: '존재하지 않는 글입니다.'}); 
        return; 
    }
    if(row?.status !== 1) {
        sendError(req, res, {code: 2, msg: '이미 판매완료된 게시물입니다.'}); 
        return;
    }

    let consulting = await models.CONSULTING_TB.findAll({
        raw: true,
        where: {
            u_idx: user?.idx || 0,
            board: consts.boardTruckKey,
            board_idx: row?.idx
        }
    });

    /* 신청내역 검사 */
    if(type !== 1 && consulting?.length > 0) { // 이미 전화상담 내역이 있는경우 중단
        send(req, res, rt);
        return;
    }
    if(type*1 === 1 && consulting?.filter(x => x?.type === 1)?.length > 0) { // 이미 예약상담 내역이 있는경우 중단
        sendError(req, res, {code: 3, msg: '이미 예약상담을 신청 하셨습니다.'}); 
        return;
    }

    let goods = await models.POINT_GOODS_TB.findOne({
        where: {
            idx: type*1 === 1 ? 1 : 2
        }
    });

    if(user?.point < goods?.point) {
        sendError(req, res, {code: 2000, msg: '보유 포인트가 부족합니다.'}); 
        return;
    }

    let create_data = "";
    let updateList = {
        type: type,
        u_idx: user?.idx,
        target_idx: row?.u_idx,
        board: consts.boardTruckKey,
        board_idx: row?.idx 
    }
    if(type*1 === 1) {
        updateList.name = name;
        updateList.hp = hp;
        updateList.sido = sido;
        updateList.sigungu = sigungu;
        updateList.desc = desc;
    }

    // 상담 등록
    try {
        create_data = await models.CONSULTING_TB.create( updateList );
    } catch (error) {
        sendError(req, res, {code: 1200, msg: '잠시후 다시 시도해주세요.'}); 
        return;
    }

    // 포인트 차감
    let data = {
        idx: user?.idx,
        type: 1,
        point: goods?.point,
        title: goods?.title
    };

    await pointFunc(data);
    
    // 리워드 지급
    if(goods?.reward > 0) {
        data = {
            idx: row?.u_idx,
            type: 2,
            point: calculatePercentage(goods?.reward, goods?.point),
            title: `${goods?.title}(리워드)`
        };

        await pointFunc(data);
    }

    send(req, res, rt);

    // 예약상담 알림전송
    if(type*1 === 1) {
        await alarmFunc({
            u_idx: row?.u_idx,
            alarm: {
                c_idx: create_data?.idx,
                board: consts.boardTruckKey,
                board_idx: row?.idx,
                title: `<bold>${name}</bold>님으로부터 예약상담요청이 도착했습니다.`
            }
        })

        /** 카카오 알림톡 전송 */
        await consultingTalkSend(create_data?.idx);
        /** 카카오 알림톡 전송 끝 */
    }
});


/* 중고화물차 신고하기 */
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


    let row = await models.BOARD_TRUCK_TB.scope([
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
        board: consts.boardTruckKey,
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
