const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, s3UploadResize, s3Delete, send, scoreFunc, alarmFunc, passwordEncrypt, leaveFunc, logFunc, itemDeleteFunc, userDestroy, randomNum, common, scd, adminScd, masterMiddleware, randomKey, getFileName, sendSms, findJson} = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models/index.js');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(adminScd);
router.use(verify);

router.post('/list', async (req, res) => {

    console.log('admin/compony/list => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { application } = req.body;

    const list = await models.COMPONY_TB.scope([
        application ? 'application' : 'active', 
        'user',  
        'users',
        { method: ['items', {count: true} ] },
        { method: ['customers', {count: true} ] },
    ]).findAll({
        order: [
            ['status', 'ASC'],
            ['create_dt', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});



router.post('/get', async (req, res) => {

    console.log('admin/compony/get => ');

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

    const user = await models.COMPONY_TB.scope([
        'user',
        'users',
        'logs',
    ]).findOne({
        where: {
            idx: idx
        }
    });

    if(!user) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다. (사무소정보 없음)';
        send(req, res, rt);
        return;
    }
    
    rt.result = user?.get({ plain: true });

    send(req, res, rt);
});


router.post('/update', async (req, res) => {

    console.log('admin/compony/update => ');

    let { leaveOptionConsts } = common();
    let { 
        idx,
        ceo,
        title,
        permit_number,
        business_number,
        addr,
        detail_addr,
        sido,
        sigungu,
        leave_option,
        compony_path,
        business_path
    } = req.body;

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

    let compony = await models.COMPONY_TB.scope('user', 'users').findOne({
        where: {
            idx: idx
        }
    });

    if(!compony) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다. (사무소정보 없음)';
        send(req, res, rt);
        return;
    }

    compony = compony?.get({ plain: true });

    let updateList = {
        ceo,
        title,
        permit_number,
        business_number,
        addr,
        detail_addr,
        sido,
        sigungu,
        leave_option
    }
    
    if(compony_path?.base) {
        let urls = await s3UploadResize(compony_path?.base, 'compony', '', compony_path?.ext);
        updateList.compony_path = urls;
    }
    if(business_path?.base) {
        let urls = await s3UploadResize(business_path?.base, 'compony', '', business_path?.ext);
        updateList.business_path = urls;
    }

    await models.COMPONY_TB.update(
        updateList,
        {
            where: {
                idx: idx
            }
        }
    )

    if(compony?.leave_option !== leave_option) {

        let users = compony?.users?.filter(item => item?.idx !== compony?.u_idx && item?.leave_option !== leave_option);

        if(users?.length < 1) {
            send(req, res, rt);
            return;
        }

        // await models.USER_TB.update(
        //     {
        //         leave_option: leave_option
        //     },
        //     {
        //         where: {
        //             idx: {
        //                 [Op.in]: users?.map(item => item.idx)
        //             }
        //         }
        //     }
        // )

        users?.map((x, i) => {
            /* 
            매물/고객 귀속설정 변경시 보낼 알림
            동의시 next 값으로 변경후 로그남기기

            let logData = {
                c_idx: compony?.c_idx,
                user: `${user?.name}(${user?.email})`,
                manager: admin ? '관리자' : `${user?.name}(${user?.email})`,
                title: 매물/고객 귀속: 직원귀속/대표 공유
            };
        
            await logFunc('COMPONY_LOG_TB', logData);
            */

            let alarm = {
                type: 2,
                desc: `${title}의 매물/고객 정보 귀속 설정이 변경되었으니 확인하세요.`,
                detail: JSON.stringify({
                    key: 'leave_option',
                    next: leave_option,
                    nextText: findJson(leaveOptionConsts, leave_option),
                })
            }

            alarmFunc(x, alarm);

            /* 
            매물/고객 담당자 변경시 보낼 알림
            동의시 next 값으로 변경
            let alarm = {
                type: 2,
                desc: `[88700 매물명 또는 고객명] 담당자가 변경되었으니 확인하세요.`,
                detail: JSON.stringify({
                    key: 'item_change', // item_change or custormer_change
                    target_idx: item?.idx,
                    next: user?.idx,
                    nextText: `${user?.name} ${user?.rank}`,
                })
            }

            alarmFunc(x, alarm);
            */
        })
        
    }

    send(req, res, rt);
});

router.post('/statusupdate', async (req, res) => {

    console.log('admin/compony/statusupdate => ');

    let { idx, status, companion_text } = req.body;

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

    let compony = await models.COMPONY_TB.scope('user').findOne({
        where: {
            idx: idx
        }
    });

    if(!compony) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다. (사무소정보 없음)';
        send(req, res, rt);
        return;
    }

    compony = compony?.get({ plain: true });

    let updateList = {
        status: status,
        companion_text: companion_text
    }

    await models.COMPONY_TB.update(
        updateList,
        {
            where: {
                idx: idx
            }
        }
    )

    if(status === 2) {
        // 승인일시 해당 사무소 고유번호 매물/고객에 부여
        updateList = {
            c_idx: compony?.idx
        }

        await models.ITEM_TB.update(
            updateList,
            {
                where: {
                    u_idx: compony?.u_idx
                }
            }
        )
        await models.CUSTOMER_TB.update(
            updateList,
            {
                where: {
                    u_idx: compony?.u_idx
                }
            }
        )

        // 이전 소속신청 내역 전부 삭제
        await models.COMPONY_APPLICATION_TB.destroy(
            {
                where: {
                    u_idx: compony?.u_idx
                }
            }
        );
        
        // 회원에 대표 부여하고 소속사무소 고유번호 부여
        await models.USER_TB.update(
            {
                c_idx: compony?.idx,
                leave_option: compony?.leave_option,
                level: 3,
                rank: '대표'
            },
            {
                where: {
                    idx: compony?.u_idx
                }
            }
        )

        // 로그 남기기
        let logData = {
            c_idx: compony?.idx,
            title: '사무소 승인',
            user: `${compony?.user?.name}(${compony?.user?.email})`,
            manager: '관리자'
        };
    
        await logFunc('COMPONY_LOG_TB', logData);
        
    }

    send(req, res, rt);
});

router.post('/delete', async (req, res) => {

    console.log('admin/compony/delete => ');

    let { idx, nowDt } = req.body;

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

    let compony = await models.COMPONY_TB.scope('user').findOne({
        where: {
            idx: idx
        }
    });

    if(!compony) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다. (사무소정보 없음)';
        send(req, res, rt);
        return;
    }

    compony = compony?.get({ plain: true });

    if(compony?.business_path) {
        await s3Delete(compony?.business_path);
    }
    if(compony?.compony_path) {
        await s3Delete(compony?.compony_path);
    }

    await models.COMPONY_TB.destroy(
        {
            where: {
                idx: idx
            }
        }
    )

    send(req, res, rt);
});


router.post('/leave', async (req, res) => {

    console.log('admin/compony/leave => ');

    let { idx, nowDt } = req.body;

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

    let compony = await models.COMPONY_TB.scope('user').findOne({
        where: {
            idx: idx
        }
    });

    if(!compony || !compony?.user) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return;
    }

    compony = compony?.get({ plain: true });

    // 회원(대표) 퇴사처리
    let result = await leaveFunc({
        idx: compony?.u_idx,
        admin: true
    });

    if(!result?.state) {
        rt.ok = false;
        rt.msg = result?.msg;
        send(req, res, rt);
        return;
    }

    send(req, res, rt);
});


module.exports = router;
