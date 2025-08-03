const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, s3Upload, pointFunc, s3UploadResize, s3UploadResizeNew, s3Delete, getOptions, boardAlarmFunc, send, sendError, getBlack, itemDeleteFunc, kakaoApi, filterItems, logFunc, common, scd, frontNotCheck, alarmFunc, calculatePercentage, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn, customerReturn } = require('../../service/returns.js');
const consts = require('../../service/consts.json');

const models = require('../../models');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(scd);
router.use(frontNotCheck);

/* 게시판 리스트 */
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

    if(order === 2) orderList = [ ['view', 'DESC'], ...orderList ];

    let scopes = ['list', 'files', 'userFront', 'commentCnt', 'active'];
    if(my) {
        whereList.u_idx = user?.idx || 0;
    } 
    
    let list = await models.BOARD_TB.scope(scopes).findAll({
        attributes: {
            include: [
                [sequelize.fn('LEFT', sequelize.col('desc'), 50), 'desc']
            ]
        },
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


/* 게시판 상세조회 */
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

    let row = await models.BOARD_TB.scope([
        'active',
        'userFront',
        'comment'
    ]).findOne({
        where: {
            idx: idx || 0
        }
    });

    if(!row) {
        sendError(req, res, {code: 1, msg: '존재하지 않는 글입니다.'}); 
        return;
    }

    if(init) await row.update({ view: row?.view + 1 });
    
    let files = await row.getFiles();
    files = await Promise.all( 
        files?.map( async (x, i) => {
            return x?.get({ plain: true })?.file_path
        })
    );

    rt.result = {
        ...row.get({ plain: true }),
        files: files
    };

    send(req, res, rt);

});


/* 게시판 리스트 */
router.post('/newsList', async (req, res) => {

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

    const list = await models.NEWS_TB.scope([
        'active'
    ]).findAll({
        raw: true,
        attributes: ['idx', 'title', 'board', 'create_dt'],
        where: {
            board: 1
        },
        order: [
            ['idx', 'DESC']
        ]
    });

    rt.result = list;
    
    send(req, res, rt);

});


/* 게시판 글 등록/수정 */
router.post('/insert', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        idx,
        title,
        desc,
        files,
        delete_files,
        user,
        jwt,
        nowDt 
    } = req.body;

    if(!user) {
        sendError(req, res, {code: 1100, msg: '로그인이 필요합니다.'}); 
        return; 
    }

    let row = "";
    if(idx) {
        row = await models.BOARD_TB.findOne({
            where: {
                idx: idx,
                u_idx: user?.idx
            }
        });
        if(!row) { sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.'}); return; }
    }

    if(!title) { sendError(req, res, {code: 1, msg: '제목을 입력해주세요.'}); return; }
    if(!desc) { sendError(req, res, {code: 1, msg: '상세내용을 입력해주세요.'}); return; }
    
    
    let updateList = {
        title,
        desc
    }

    try {
        if(row) {
            row.update( updateList );
        } else {
            updateList.u_idx = user?.idx;
    
            row = await models.BOARD_TB.create(
                updateList,
            );
        }
    } catch (error) {
        console.log('error', error);
        sendError(req, res, {code: 1200, msg: '올바른 값이 아닙니다.'}); 
        return;
    }
    

    await Promise.all(
        files?.filter(item => item?.base)?.map( async (x, i) => {

            let urls = await s3UploadResizeNew({
                base64: x?.base, 
                dir: 'board',
                ext: x?.ext,
                width: 1200
            });

            if(urls) {
                let updateSubList = {
                    type: consts.fileBoardKey,
                    target_idx: row?.idx,
                    file_path: urls
                };

                await models.FILE_TB.create(
                    updateSubList
                )
            }
        })
    )

    rt.result = row?.idx;

    send(req, res, rt);

    delete_files?.map( (x, i) => {
        s3Delete(x);

        models.FILE_TB.destroy({
            where: {
                file_path: x
            }
        })
    })

});


/* 게시판 글 삭제 */
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

    let row = await models.BOARD_TB.findOne({
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


/* 게시판 댓글글 등록/수정 */
router.post('/comment', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        idx,
        b_idx,
        title,
        user,
        jwt,
        nowDt 
    } = req.body;

    if(!user) {
        sendError(req, res, {code: 1100, msg: '로그인이 필요합니다.'}); 
        return; 
    }

    let board = await models.BOARD_TB.scope([
        'active'
    ]).findOne({
        where: {
            idx: b_idx || 0
        }
    });

    if(!board) { sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.'}); return; }

    let row = "";
    if(idx) {
        row = await models.BOARD_COMMENT_TB.findOne({
            where: {
                idx: idx,
                u_idx: user?.idx,
                b_idx: b_idx || 0
            }
        });
        if(!row) { sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.'}); return; }
    }

    if(!title) { sendError(req, res, {code: 1, msg: '댓글을 입력해주세요.'}); return; }
    
    let updateList = {
        title
    }

    try {
        if(row) {
            row.update( updateList );
        } else {
            updateList.b_idx = b_idx;
            updateList.u_idx = user?.idx;
    
            row = await models.BOARD_COMMENT_TB.create(
                updateList,
            );
        }
    } catch (error) {
        console.log('error', error);
        sendError(req, res, {code: 1200, msg: '올바른 값이 아닙니다.'}); 
        return;
    }

    send(req, res, rt);

});

/* 게시판 댓글 삭제 */
router.post('/commentDelete', async (req, res) => {

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

    let row = await models.BOARD_COMMENT_TB.findOne({
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
