const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, s3Upload, s3UploadResize, s3Select, s3Delete, send, common, scd, adminScd, alarmFunc, passwordEncrypt, randomKey, getFileName, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models/index.js');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(adminScd);
router.use(verify);

/* 배너 리스트 */
router.post('/bannerlist', async (req, res) => {

    console.log('admin/setting/bannerlist => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { type=1 } = req.body;

    const list = await models.BANNER_TB.scope([
        'active',
    ]).findAll({
        raw: true,
        where: {
            type
        }
    });

    rt.result = list;
    
    send(req, res, rt);
});

/* 배너 수정 */
router.post('/bannerupdate', async (req, res) => {

    console.log('admin/setting/bannerupdate => ');

    let { nowDt, list, deleteidxs } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    await Promise.all(

        list?.map( async (x, i) => {
            
            let upDataList = {
                url: x?.url,
                type: x?.type
            };
            
            if(x?.pc_path?.base) {
                let urls = await s3UploadResize(x?.pc_path?.base, 'banner', '', x?.pc_path?.ext);
                upDataList.pc_path = urls;
            }
            if(x?.m_path?.base) {
                let urls = await s3UploadResize(x?.m_path?.base, 'banner', '', x?.m_path?.ext);
                upDataList.m_path = urls;
            }
            
            if(!isNaN(x.idx)) {
                await models.BANNER_TB.update(
                    upDataList,
                    {
                        where: {
                            idx: x.idx
                        }
                    }
                );
            } else {
                await models.BANNER_TB.create(
                    upDataList
                );
            }
            
        })
    )

    if( deleteidxs?.length > 0 ) {
        await models.BANNER_TB.update(
            {
                delete_dt: nowDt
            },
            {
                where: {
                    idx: {
                        [Op.in]: deleteidxs
                    }
                }
            }
        );
    }

    send(req, res, rt);
});


/* 팝업 리스트 */
router.post('/popuplist', async (req, res) => {

    console.log('admin/setting/popuplist => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const list = await models.POPUP_TB.scope([
        'active',
    ]).findAll({
        raw: true
    });

    rt.result = list;

    send(req, res, rt);
});

/* 팝업 수정 */
router.post('/popupupdate', async (req, res) => {

    console.log('admin/setting/popupupdate => ');

    let { nowDt, list, deleteidxs } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    await Promise.all(

        list?.map( async (x, i) => {

            let upDataList = {
                url: x?.url,
                type: x?.type,
                option_day: x?.option_day,
                status: x?.status,
                start_dt: x?.start_dt,
                end_dt: x?.end_dt
            };
            
            if(x?.pc_path?.base) {
                let urls = await s3UploadResize(x?.pc_path?.base, 'popup', '', x?.pc_path?.ext);
                upDataList.pc_path = urls;
            }
            if(x?.m_path?.base) {
                let urls = await s3UploadResize(x?.m_path?.base, 'popup', '', x?.m_path?.ext);
                upDataList.m_path = urls;
            }
            
            if(!isNaN(x.idx)) {
                await models.POPUP_TB.update(
                    upDataList,
                    {
                        where: {
                            idx: x.idx
                        }
                    }
                );
            } else {
                await models.POPUP_TB.create(
                    upDataList
                );
            }
            
        })
    )

    if( deleteidxs?.length > 0 ) {
        await models.POPUP_TB.update(
            {
                delete_dt: nowDt
            },
            {
                where: {
                    idx: {
                        [Op.in]: deleteidxs
                    }
                }
            }
        );
    }

    send(req, res, rt);
});

/* 제조사/차종 저장 */
router.post('/carUpdate', async (req, res) => {

    console.log('admin/setting/carUpdate => ');

    let { nowDt, list, deletelist=[] } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    if(deletelist?.length > 0) {
        await models.CAR_TB.destroy(
            {
                where: {
                    idx: {
                        [Op.in]: deletelist
                    }
                }
            }
        )
    }

    await Promise.all(

        list?.map( async (x, i) => {

            let upDataList = {
                order: i,
                maker: x?.maker,
                car: x?.car
            };
            
            if(!isNaN(x?.idx)) {
                await models.CAR_TB.update(
                    upDataList,
                    {
                        where: {
                            idx: x.idx
                        }
                    }
                );
            } else {
                await models.CAR_TB.create(
                    upDataList
                );
            }
        })

    )

    send(req, res, rt);
});


/* 차량형식 저장 */
router.post('/carTypeUpdate', async (req, res) => {

    console.log('admin/setting/carTypeUpdate => ');

    let { nowDt, list, deletelist=[] } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    if(deletelist?.length > 0) {
        await models.CAR_TYPE_TB.destroy(
            {
                where: {
                    idx: {
                        [Op.in]: deletelist
                    }
                }
            }
        )
    }

    await Promise.all(

        list?.map( async (x, i) => {

            let upDataList = {
                order: i,
                type: x?.type,
                sub_type: x?.sub_type
            };
            
            if(!isNaN(x?.idx)) {
                await models.CAR_TYPE_TB.update(
                    upDataList,
                    {
                        where: {
                            idx: x.idx
                        }
                    }
                );
            } else {
                await models.CAR_TYPE_TB.create(
                    upDataList
                );
            }
        })

    )

    send(req, res, rt);
});

/* 분류 저장 */
router.post('/optionUpdate', async (req, res) => {

    console.log('admin/setting/optionUpdate => ');

    let { nowDt, list, deletelist=[] } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    await Promise.all(

        list?.map( async (x, i) => {

            if(!x?.idx) return;

            let upDataList = {
                options: x?.options
            };
            
            await models.OPTION_TB.update(
                upDataList,
                {
                    where: {
                        idx: x.idx
                    }
                }
            );
            
        })

    )

    send(req, res, rt);
});


/* 약관 수정 */
router.post('/termupdate', async (req, res) => {

    console.log('admin/setting/termupdate => ');

    let { nowDt, type, desc } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    await models.TERM_TB.update(
        {
            desc: desc
        },
        {
            where: {
                type: type
            }
        }
    );

    send(req, res, rt);
});

/* 푸터 수정 */
router.post('/footerupdate', async (req, res) => {

    console.log('admin/setting/footerupdate => ');

    let { nowDt, company, addr, ceo, buisness_num, communication_num, hp, email } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    await models.CONFIG_TB.update(
        {
            con_company: company, 
            con_addr: addr, 
            con_ceo: ceo, 
            con_buisness_num: buisness_num, 
            con_communication_num: communication_num, 
            con_hp: hp, 
            con_email: email
        },
        {
            where: {
                idx: 1
            }
        }
    );

    send(req, res, rt);
});

/* 관리자 비밀번호 수정 */
router.post('/passwordupdate', async (req, res) => {

    console.log('admin/setting/passwordupdate => ');

    let { nowDt, jwt, nowpw, pw } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const loginUser = await models.USER_TB.scope('active', 'admin').findOne({
        where: {
            idx: jwt,
            password: await passwordEncrypt(nowpw),
        }
    });

    if(!loginUser) {
        rt.ok = false;
        rt.msg = '현재 비밀번호가 일치하지 않습니다.';
        send(req, res, rt);
        return;
    }   


    await models.USER_TB.update(
        {
            password: await passwordEncrypt(pw),
        },
        {
            where: {
                idx: jwt
            }
        }
    );

    send(req, res, rt);
});


// 파일 권한 얻기
router.post('/getS3Url', async (req, res) => {

    let { urls, fileName } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    if(!urls) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다.';
        send(req, res, rt);
        return;
    }

    let sign_urls = await s3Select(urls, fileName ? fileName : getFileName(urls));

    if(sign_urls === '9999') {
        rt.ok = false;
        rt.msg = '파일 읽기에 실패했습니다.';
        send(req, res, rt);
        return;
    }

    rt.result = sign_urls;

    send(req, res, rt);
});


/* 계약서 파일조회 */
router.post('/contract', async (req, res) => {

    console.log('admin/setting/contract => ');

    let { nowDt, file } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const rows = await models.CONFIG_TB.findOne({
        raw: true,
        where: {
            idx: 1
        }
    });

    rt.result = {
        file: rows.con_contract_file,
        file2: rows.con_contract_file2
    }

    send(req, res, rt);
});


/* 계약서 수정 */
router.post('/contractupdate', async (req, res) => {

    console.log('admin/setting/contractupdate => ');

    let { nowDt, file, file2 } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }
    
    let upDataList = {};

    if(file?.base) {
        let urls = await s3Upload(file?.base, 'etc', `중고거래_화물표준계약서_화물차용_${moment().unix()}`, file?.ext);
        upDataList.con_contract_file = urls;
    }
    if(file2?.base) {
        let urls = await s3Upload(file2?.base, 'etc', `중고거래_화물표준계약서_지입차용_${moment().unix()}`, file2?.ext);
        upDataList.con_contract_file2 = urls;
    }

    await models.CONFIG_TB.update(
        upDataList,
        {
            where: {
                idx: 1
            }
        }
    );

    send(req, res, rt);
});





















/* 알람 전송 */
router.post('/alarmupdate', async (req, res) => {

    console.log('admin/setting/alarmupdate => ');

    let { nowDt, type, desc, url, users, city, allcity } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let user_list = await models.USER_TB.scope([
        'active', 
        'front',  
        'compony',
    ]).findAll({
        order: [
            ['create_dt', 'DESC']
        ]
    });

    if(type === 1) {
        user_list = user_list?.filter(item => item?.c_idx && city?.includes(item?.compony?.sido) );
    } else if(type === 2) {
        user_list = user_list?.filter(item => item?.c_idx && users?.find(x => x?.idx === item?.c_idx) );
    } else if(type === 3)  {
        user_list = user_list?.filter(item => users?.find(x => x?.idx === item?.idx) );
    } else {
        user_list = [];
    }
   
    if(user_list?.length < 1) {
        rt.ok = false;
        rt.msg = '전송할 회원이 없습니다.';
        send(req, res, rt);
        return;
    }

    let alarm = {
        desc: desc,
        url: url
    }

    user_list?.map((x, i) => {
        alarmFunc(x, alarm);
    })

    let updateList = {
        type: type,
        desc: desc,
        url: url
    }

    if(type === 1) {
        updateList.title = allcity ? '전체' : city?.join(", ");
    } else {
        updateList.title = users?.map((x, i) => ( x.title ))?.join(", ");
    }

    await models.ALARM_SEND_TB.create(
        updateList
     );

    console.log('총 몇명 ? => ', user_list?.length);

    send(req, res, rt);
});


/* 알람 발송내역 리스트 */
router.post('/alarmlist', async (req, res) => {

    console.log('admin/setting/alarmlist => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const list = await models.ALARM_SEND_TB.findAll({
        raw: true,
        order: [
            ['idx', 'DESC'],
        ]
    });

    rt.result = list

    send(req, res, rt);
});

/* 칭호 리스트 */
router.post('/badgelist', async (req, res) => {

    console.log('admin/setting/badgelist => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const list = await models.BADGE_TB.findAll({
        raw: true,
        order: [
            ['type', 'ASC'],
        ]
    });

    rt.result = list

    send(req, res, rt);
});

/* 칭호 저장 */
router.post('/badgeupdate', async (req, res) => {

    console.log('admin/setting/badgeupdate => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { list, deleteidxs } = req.body;
        
    
    await Promise.all(

        list?.map( async (x, i) => {

            let upDataList = {
                type: x?.type,
                comment: x?.comment,
                title: x?.title,
                color: x?.color,
                bg_color: x?.bg_color,
                difference: x?.difference
            };
            
            if(x?.file_path?.base) {
                let urls = await s3Upload(x?.file_path?.base, 'badge', '', x?.file_path?.ext);
                upDataList.file_path = urls;
            }
            
            if(!isNaN(x.idx)) {
                await models.BADGE_TB.update(
                    upDataList,
                    {
                        where: {
                            idx: x.idx
                        }
                    }
                );
            } else {
                await models.BADGE_TB.create(
                    upDataList
                );
            }
            
        })
    )

    if( deleteidxs?.length > 0 ) {
        // 타입 4,5 칭호만 삭제가능함
        await models.BADGE_TB.destroy({
            where: {
                [Op.or] : [
                    { type: 4 },
                    { type: 5 }
                ],
                idx: {
                    [Op.in]: deleteidxs
                }
            }
        });
        // 착용중인 유저 뱃지 삭제
        await models.USER_BADGE_TB.destroy({
            where: {
                b_idx: {
                    [Op.in]: deleteidxs
                }
            }
        });
    }
    

    send(req, res, rt);
});


module.exports = router;
