const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, s3UploadResize, s3Delete, send, scoreFunc, reviewScoreFunc, passwordEncrypt, leaveFunc, logFunc, itemDeleteFunc, userDestroy, randomNum, common, scd, adminScd, masterMiddleware, randomKey, getFileName, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models/index.js');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(adminScd);
router.use(verify);

/** 회원 리스트 */
router.post('/list', async (req, res) => {

    console.log('admin/member/list => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { leave } = req.body;

    const list = await models.USER_TB.scope([
        leave ? 'delete' : 'active', 
        'front',  
    ]).findAll({
        order: [
            ['create_dt', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});

/** 회원 상세정보 */
router.post('/get', async (req, res) => {

    console.log('admin/member/get => ');

    let { idx } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    if(!idx) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return;
    }

    const user = await models.USER_TB.scope([
        'front',
        'penaltyCheck'
    ]).findOne({
        where: {
            idx: idx
        }
    });

    if(!user) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다. (회원정보 없음)';
        send(req, res, rt);
        return;
    }

    const report = await models.REPORT_TB.count({
        where: {
            target_idx: user?.idx
        }
    });

    const penalty = await models.PENALTY_TB.findAll({
        where: {
            u_idx: user?.idx
        },
        order: [
            ['create_dt', 'DESC']
        ]
    });

    const point_charge = await models.POINT_CHARGE_TB.findAll({
        where: {
            u_idx: user?.idx
        },
        order: [
            ['create_dt', 'DESC']
        ]
    });
    const point_exchange = await models.POINT_EXCHANGE_TB.findAll({
        where: {
            u_idx: user?.idx
        },
        order: [
            ['create_dt', 'DESC']
        ]
    });
    const point_log = await models.POINT_TB.scope(['active']).findAll({
        where: {
            u_idx: user?.idx
        },
        order: [
            ['create_dt', 'DESC']
        ]
    });
    
    rt.result = {
        ...await userReturn(user?.get({ plain: true })),
        report: report,
        penalty: penalty,
        point_charge,
        point_exchange,
        point_log
    }

    send(req, res, rt);
});

// 회원 패널티 등록
router.post('/penalty', async (req, res) => {

    console.log('admin/member/penalty => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let {
        idx,
        penalty_date,
        penalty,
        row_penalty,
    } = req.body;

    if(!idx) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return;
    }

    let user = await models.USER_TB.scope([
        'front'
    ]).findOne({
        where: {
            idx: idx
        }
    });

    if(!user) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다. (회원정보 없음)';
        send(req, res, rt);
        return;
    }

    let updateList = {
        u_idx: user?.idx,
        end_dt: moment(penalty_date).format('YYYY-MM-DD 23:59:59'),
        title: penalty
    }

    await models.PENALTY_TB.create( updateList );
    
    send(req, res, rt);

});

// 회원 패널티 삭제
router.post('/penaltyDelete', async (req, res) => {

    console.log('admin/member/penaltyDelete => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let {
        idx
    } = req.body;

    if(!idx) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return;
    }


    await models.PENALTY_TB.destroy({
        where: {
            idx: idx
        }
    });
    
    send(req, res, rt);

});

/* 회원 삭제 */
router.post('/delete', async (req, res) => {

    console.log('admin/member/delete => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { idx, nowDt } = req.body;

    idx?.map(async (x, i) => {
        await userDestroy(x);
    })

    send(req, res, rt);
});


// 관리자 회원 검색용 리스트
router.post('/searchlist', async (req, res) => {

    console.log('admin/member/searchlist => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { type, stx } = req.body;

    const list = await models.USER_TB.scope([
        'active', 
        'front',  
    ]).findAll({
        order: [
            ['create_dt', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});












router.post('/update', async (req, res) => {

    console.log('admin/member/update => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let {
        idx,
        pw,
        hp,
        certificate_number,
        file_path,
    } = req.body;

    if(!idx) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return;
    }

    const user = await models.USER_TB.scope('front').findOne({
        raw: true,
        where: {
            idx: idx
        }
    });

    if(!user) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다. (회원정보 없음)';
        send(req, res, rt);
        return;
    }

    let upDataList = {
        hp: hp
    };

    if(pw) {
        upDataList.password = await passwordEncrypt(pw);
    }

    if(user?.level !== 1) {
        upDataList.certificate_number = certificate_number;
        if(file_path?.base) {
            let urls = await s3UploadResize(file_path?.base, 'user', '', file_path?.ext);
            upDataList.file_path = urls;
        }
    }

    console.log(upDataList);

    await models.USER_TB.update(
        upDataList,
        {
            where: {
                idx: idx
            }
        }
    );
    
    send(req, res, rt);

});


// 회원 영구, 특별칭호 수정
router.post('/badgeupdate', async (req, res) => {

    console.log('admin/member/badgeupdate => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let {
        idx,
        row_badge,
    } = req.body;

    if(!idx) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return;
    }

    let user = await models.USER_TB.scope([
        'front',  
        'badges'
    ]).findOne({
        where: {
            idx: idx
        }
    });

    if(!user) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다. (회원정보 없음)';
        send(req, res, rt);
        return;
    }

    user = user?.get({ plain: true });
    console.log('user', user);
    
    let arr = user?.badges?.filter(item => item.type === 4 || item.type === 5)?.map(item => item.idx);

    console.log('arr', arr);
    // 착용중인 유저 뱃지 삭제
    await models.USER_BADGE_TB.destroy({
        where: {
            idx: {
                [Op.in]: arr
            }
        }
    });

    let updateList = [];

    await Promise.all(
        updateList = row_badge?.map((x, i) => {
            return {
                u_idx: idx,
                b_idx: x
            }
        })
    )
     
    console.log('updateList', updateList);

    if(updateList?.length > 0) {
        await models.USER_BADGE_TB.bulkCreate(updateList);
    }
    
    send(req, res, rt);

});



/* 회원 탈퇴 */
router.post('/leave', async (req, res) => {

    console.log('admin/member/leave => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { idx, delete_option=true, nowDt } = req.body;

    let user = await models.USER_TB.scope('front', 'compony').findOne({
        where: {
            idx: idx,
        }
    });

    if(!user) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다. (회원정보 없음)';
        send(req, res, rt);
        return;
    };

    // 퇴사 당사자 회원정보
    user = user?.get({ plain: true });

    // 회원 퇴사처리
    let result = await leaveFunc({
        idx: idx,
        admin: true
    });

    if(!result?.state) {
        rt.ok = false;
        rt.msg = result?.msg;
        send(req, res, rt);
        return;
    }

    if(delete_option) {

        // 회원 탈퇴처리에 따른 매물/고객 삭제
        result = await itemDeleteFunc({
            u_idx: idx,
            idx: 'all',
            table: ["ITEM_TB", "CUSTOMER_TB"],
            nowDt: nowDt
        })

        // 탈퇴일 부여
        await models.USER_TB.update(
            {
                delete_dt: nowDt,
                delete_reason: '관리자가 탈퇴'
            },
            {
                where: {
                    idx: idx
                }
            }
        );

        if(user?.level !== 3 && user?.c_idx) {
            let logData = {
                c_idx: user?.c_idx,
                title: '회원 탈퇴',
                user: `${user?.name}(${user?.email})`,
                manager: '관리자'
            };
        
            await logFunc('COMPONY_LOG_TB', logData);
        }
    
    }

    send(req, res, rt);
});

/* 회원 복구 */
router.post('/restore', async (req, res) => {

    console.log('admin/member/restore => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { idx, nowDt } = req.body;
    
    let user = await models.USER_TB.scope('front').findOne({
        raw: true,
        where: {
            idx: idx,
        }
    });

    if(!user) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다. (회원정보 없음)';
        send(req, res, rt);
        return;
    }

    // 탈퇴일 제거
    await models.USER_TB.update(
        {
            delete_dt: null,
            delete_reason: null
        },
        {
            where: {
                idx: idx
            }
        }
    );

    let updateList = {
        trash_dt: null
    }
    let whereList = {
        u_idx: idx,
        trash_dt: moment(user?.delete_dt).format('YYYY-MM-DD HH:mm:ss')
    }

    await models.ITEM_TB.scope('active').update(
        updateList,
        {
            where: whereList
        }
    );
    await models.CUSTOMER_TB.scope('active').update(
        updateList,
        {
            where: whereList
        }
    );

    send(req, res, rt);
});




router.post('/reviewUpdate', async (req, res) => {

    console.log('admin/member/reviewUpdate => ');

    let { 
        idx=0,
        type1,
        type2,
        kind,
        pro,
        cooperative,
        conscientious,
        accurate,
        not_condition,
        not_transaction,
        not_kind,
        not_cooperative,
        jwt,
        nowDt 
    } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const review = await models.REVIEW_TB.findOne({
        where: {
            idx: idx,
        }
    });

    if(!review) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return;
    }

    let updateList = {
        type1,
        type2,
        kind,
        pro,
        cooperative,
        conscientious,
        accurate,
        not_condition,
        not_transaction,
        not_kind,
        not_cooperative,
    };

    let score = reviewScoreFunc(updateList);
    updateList.score = score;

    score = -(review?.score) + score;

    review.update(updateList);
    
    await models.USER_TB.update(
        {
            score: sequelize.literal(`score + ${score}`) 
        },
        {
            where: {
                idx: review?.target_idx
            }
        }
    )


    send(req, res, rt);
});


router.post('/reviewDelete', async (req, res) => {

    console.log('admin/member/reviewDelete => ');

    let { 
        idx=0,
        jwt,
        nowDt 
    } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const review = await models.REVIEW_TB.findOne({
        where: {
            idx: idx,
        }
    });

    if(!review) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return;
    }


    review.destroy();
    
    await models.USER_TB.update(
        {
            score: sequelize.literal(`score - ${review?.score}`) 
        },
        {
            where: {
                idx: review?.target_idx
            }
        }
    )


    send(req, res, rt);
});


module.exports = router;
