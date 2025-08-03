const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, s3UploadResize, s3Delete, send, talkList, talkSend, badgeFunc, dataTrashCronFunc, alarmFunc, passwordEncrypt, leaveFunc, logFunc, itemDeleteFunc, userDestroy, randomNum, common, scd, adminScd, masterMiddleware, randomKey, getFileName, sendSms, findJson} = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models/index.js');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

const consts = require('../../service/consts.json');

router.use(adminScd);
router.use(verify);

router.post('/list', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { table, trash, nowDt } = req.body;
    
    // console.log('test', test);
    // console.log('arr', arr);

    // await models.ITEM_TB.update(
    //     {
    //         status: 2,
    //         dong: dong,
    //         desc: '',
    //     },
    //     {
    //         where: {
    //             idx: 1
    //         }
    //     }
    // )
    
    let order = [
        ['idx', 'DESC']
    ];
    let scope = ['active', 'user'];
    
    if(table === 'BOARD_TRUCK_TB' || table === 'BOARD_JEEIP_TB') {
        order = [ ['ad', 'DESC'], ['end_dt', 'ASC'], ...order];
        scope = [ ...scope, 'adminlist'];
    }
    if(table === 'BOARD_TB') {
        scope = [ ...scope, 'commentCnt'];
    } else {
        scope = [ ...scope, 'notTemp'];
    }

    const list = await models[table].scope(scope).findAll({
        order: order
    });

    rt.result = list;

    send(req, res, rt);
});


router.post('/get', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { idx, table, trash, nowDt } = req.body;
    
    let scope = ['active', 'user'];
    
    if(table === 'BOARD_TRUCK_TB' || table === 'BOARD_JEEIP_TB') {
        scope = [ ...scope, 'consulting'];
    }
    if(table === 'BOARD_TB') {
        scope = [ ...scope, 'files', 'comment', 'commentCnt'];
    } else {
        scope = [ ...scope, 'likeCnt', 'notTemp'];
    }

    const row = await models[table].scope(scope).findOne({
        where: {
            idx: idx || 0
        }
    });


    if(!row) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return
    }

    rt.result = row;

    send(req, res, rt);
});

router.post('/truckUpdate', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { idx, ad, start_dt, end_dt, car_auth_state, car_auth_msg, nowDt } = req.body;

    const row = await models.BOARD_TRUCK_TB.scope('user').findOne({
        where: {
            idx: idx
        }
    });

    if(!row) { 
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return
    }

    let updateList = {
        ad,
        start_dt: ad ? moment(start_dt).format('YYYY-MM-DD HH:mm:ss') : null,
        end_dt: ad ? moment(end_dt).format('YYYY-MM-DD 23:59:59') : null
    }

    let car_auth_state_ori = row?.car_auth_state;

    if(row?.car_auth_type === 2 && car_auth_state_ori !== car_auth_state) {
        updateList.car_auth_state = car_auth_state;
        updateList.car_auth_msg = car_auth_state === 99 ? car_auth_msg : null;
    }

    row.update( updateList );

    send(req, res, rt);

    if(row?.car_auth_type === 2 && car_auth_state !== 1 && car_auth_state_ori !== car_auth_state) {
        // 승인 or 반려 알림톡 전송
        console.log('승인 or 반려 알림톡 전송');

        /** 카카오 알림톡 전송 */
        let template = await talkList(car_auth_state === 2 ? 'TU_2840' : 'TU_2841');
        
        let msg = template?.templtContent;
        
        msg = msg?.replace("#{이름}", row?.user?.name);
        msg = msg?.replace("#{차량번호}", row?.car_num);

        if(car_auth_state === 2) {
            msg = msg?.replace("#{승인일시}", moment().format('YYYY.MM.DD HH시mm분'));
        } else {
            msg = msg?.replace("#{반려일시}", moment().format('YYYY.MM.DD HH시mm분'));
            msg = msg?.replace("#{반려사유}", car_auth_msg);
        }

        msg = msg?.replace("#{고객센터전화번호}", consts?.serviceCenterTel);
        msg = msg?.replace("#{고객센터이메일}", consts?.serviceCenterEmail);

        let button = template?.buttons?.map(x => {
            if(x?.linkType !== "WL") return x;

            let urls = `chajooin.com/usedCarInfo?idx=${row?.idx}`;

            let linkMo = x?.linkMo?.replace("#{웹링크}", urls);
            let linkPc = x?.linkPc?.replace("#{웹링크}", urls);
            return {...x, linkMo, linkPc }
        });

        let talk_one = {
            receiver: row?.user?.hp,
            subject: template?.templtName,
            message: msg,
            button: button
        }

        await talkSend({
            tpl_code: template?.templtCode,
            talk_list: [talk_one]
        })
        /** 카카오 알림톡 전송 끝 */

    }
});

router.post('/jeeipUpdate', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { idx, ad, start_dt, end_dt, car_auth_state, car_auth_msg, nowDt } = req.body;

    const row = await models.BOARD_JEEIP_TB.scope('user').findOne({
        where: {
            idx: idx
        }
    });

    if(!row) { 
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return
    }

    let updateList = {
        ad,
        start_dt: ad ? moment(start_dt).format('YYYY-MM-DD HH:mm:ss') : null,
        end_dt: ad ? moment(end_dt).format('YYYY-MM-DD 23:59:59') : null
    }

    let car_auth_state_ori = row?.car_auth_state;

    if(row?.car_auth_type === 2 && car_auth_state_ori !== car_auth_state) {
        updateList.car_auth_state = car_auth_state;
        updateList.car_auth_msg = car_auth_state === 99 ? car_auth_msg : null;
    }

    row.update( updateList );

    send(req, res, rt);

    if(row?.car_auth_type === 2 && car_auth_state !== 1 && car_auth_state_ori !== car_auth_state) {
        // 승인 or 반려 알림톡 전송
        console.log('승인 or 반려 알림톡 전송');

        /** 카카오 알림톡 전송 */
        let template = await talkList(car_auth_state === 2 ? 'TU_2840' : 'TU_2841');
        
        let msg = template?.templtContent;
        
        msg = msg?.replace("#{이름}", row?.user?.name);
        msg = msg?.replace("#{차량번호}", row?.car_num);

        if(car_auth_state === 2) {
            msg = msg?.replace("#{승인일시}", moment().format('YYYY.MM.DD HH시mm분'));
        } else {
            msg = msg?.replace("#{반려일시}", moment().format('YYYY.MM.DD HH시mm분'));
            msg = msg?.replace("#{반려사유}", car_auth_msg);
        }

        msg = msg?.replace("#{고객센터전화번호}", consts?.serviceCenterTel);
        msg = msg?.replace("#{고객센터이메일}", consts?.serviceCenterEmail);

        let button = template?.buttons?.map(x => {
            if(x?.linkType !== "WL") return x;

            let urls = `chajooin.com/rentedCarInfo?idx=${row?.idx}`;

            let linkMo = x?.linkMo?.replace("#{웹링크}", urls);
            let linkPc = x?.linkPc?.replace("#{웹링크}", urls);
            return {...x, linkMo, linkPc }
        });

        let talk_one = {
            receiver: row?.user?.hp,
            subject: template?.templtName,
            message: msg,
            button: button
        }

        await talkSend({
            tpl_code: template?.templtCode,
            talk_list: [talk_one]
        })
        /** 카카오 알림톡 전송 끝 */

    }
});


router.post('/delete', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { idx=[], table, nowDt } = req.body;

    try {
        await models[table].update(
            {
                delete_dt: nowDt
            },
            {
                where: {
                    idx: {
                        [Op.in]: idx
                    }
                }
            }
        );
    } catch (error) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return
    }
    
    send(req, res, rt);
});

router.post('/commentDelete', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { idx=[], table, nowDt } = req.body;

    try {
        await models.BOARD_COMMENT_TB.update(
            {
                delete_dt: nowDt
            },
            {
                where: {
                    idx: {
                        [Op.in]: idx
                    }
                }
            }
        );
    } catch (error) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return
    }
    
    send(req, res, rt);
});



module.exports = router;
