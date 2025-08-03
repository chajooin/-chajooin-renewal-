const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, s3Upload, pointFunc, s3UploadResize, s3Delete, boardAlarmFunc, getOptions, send, sendError, getBlack, itemDeleteFunc, kakaoApi, filterItems, logFunc, common, scd, front, frontNotCheck, adminScd, getFileName, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn, customerReturn } = require('../../service/returns.js');

const models = require('../../models');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

const consts = require('../../service/consts.json');

router.use(scd);
router.use(frontNotCheck);

/* 메인페이지 데이터 */
router.post('/data', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { user } = req.body;

    const banner_list = await models.BANNER_TB.scope([
        'active',
    ]).findAll({
        raw: true
    });

    const popup_list = await models.POPUP_TB.scope([
        'active',
    ]).findAll({
        raw: true
    });

    const news_list = await models.NEWS_TB.scope([
        'active'
    ]).findAll({
        raw: true,
        attributes: ['idx', 'title', 'create_dt'],
        order: [
            ['idx', 'DESC']
        ],
        limit: 3
    });

    let truck_list = await models.BOARD_TRUCK_TB.scope([
        'active',
        'notTemp',
        'list'
    ]).findAll({
        raw: true,
        where: {
            ad: 1
        },
        order: sequelize.literal('rand()'),
    });
    let jeeip_list = await models.BOARD_JEEIP_TB.scope([
        'active',
        'notTemp',
        'list'
    ]).findAll({
        raw: true,
        where: {
            ad: 1
        },
        order: sequelize.literal('rand()'),
    });


    if(truck_list?.length < 1) {
        truck_list = await models.BOARD_TRUCK_TB.scope([
            'active',
            'notTemp',
            'list'
        ]).findAll({
            raw: true,
            where: {
                status: 1
            },
            order: sequelize.literal('rand()'),
            limit: 4
        });
    }

    if(jeeip_list?.length < 1) {
        jeeip_list = await models.BOARD_JEEIP_TB.scope([
            'active',
            'notTemp',
            'list'
        ]).findAll({
            raw: true,
            where: {
                status: 1
            },
            order: sequelize.literal('rand()'),
            limit: 4
        });
    }


    rt.result = {
        popup_list: popup_list,
        main_banner: banner_list?.filter(x => x?.type === 1),
        partner_banner: banner_list?.filter(x => x?.type === 2),
        truck_list: truck_list,
        jeeip_list: jeeip_list,
        news_list: news_list
    }

    send(req, res, rt);
});

/* 나의조건 매칭 데이터 */
router.post('/filterData', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { user } = req.body;

    if(!user) {
        sendError(req, res, {code: 1100, msg: '로그인이 필요합니다.'});
        return;
    }
    
    const filter = await models.USER_FILTER_TB.findOne({
        raw: true,
        where: {
            u_idx: user?.idx
        }
    });
   
    if(!filter) {
        sendError(req, res, {code: 1, msg: '필터설정이 필요합니다.'});
        return;
    }

    let whereList = {};
    let whereListJeeip = {};

    if(filter?.usage) {
        whereList.usage = filter?.usage;
    }
    if(filter?.type) {
        whereList.type = filter?.type;
    }
    if(filter?.sub_type) {
        whereList.sub_type = filter?.sub_type;
    }
    if(filter?.min_year || filter?.max_year) {
        whereList.year = {
            [Op.gte]: filter?.min_year,
            [Op.lte]: filter?.max_year
        }
    }
    if(filter?.min_distance || filter?.max_distance) {
        whereList.distance = {
            [Op.gte]: filter?.min_distance,
            [Op.lte]: filter?.max_distance
        }
    }
    if(filter?.min_price || filter?.max_price) {
        whereList.price = {
            [Op.gte]: filter?.min_price,
            [Op.lte]: filter?.max_price
        }
    }
    if(filter?.truck_license_type) {
        whereList.license_type = {
            [Op.in]: filter?.truck_license_type?.split(',') || []
        };
    }

    let truck_list = await models.BOARD_TRUCK_TB.scope([
        'active',
        'notTemp',
    ]).findAll({
        raw: true,
        where: whereList,
        order: sequelize.literal('rand()'),
    });

    if(filter?.item) {
        whereListJeeip.item = {
            [Op.in]: filter?.item?.split(',') || []
        };
    }
    if(filter?.go_sido) {
        whereListJeeip.go_sido = filter?.go_sido;
    }
    if(filter?.min_pay || filter?.max_pay) {
        whereListJeeip.pay = {
            [Op.gte]: filter?.min_pay || 0,
            [Op.lte]: filter?.max_pay || 9999999999
        }
    }
    if(filter?.jeeip_license_type) {
        whereListJeeip.license_type = {
            [Op.in]: filter?.jeeip_license_type?.split(',') || []
        };
    }
    
    let jeeip_list = await models.BOARD_JEEIP_TB.scope([
        'active',
        'notTemp',
    ]).findAll({
        raw: true,
        where: whereListJeeip,
        order: sequelize.literal('rand()'),
    });
    
    if(filter?.unloading) {
        let filter_unloading = filter?.unloading?.split(',') || [];
        jeeip_list = jeeip_list?.filter(item => {
            let unloading = item?.unloading?.split(",");
            return (unloading?.find(x => filter_unloading?.includes(x)))
        })
    }
    
    
    rt.result = {
        truck_list: truck_list,
        jeeip_list: jeeip_list
    }

    send(req, res, rt);


    // let test = await models.BOARD_TRUCK_TB.scope([
    //     'active',
    //     'notTemp',
    // ]).findOne({
    //     raw: true,
    //     where: {
    //         idx: 11
    //     }
    // });

    // boardAlarmFunc({
    //     data: test,
    //     type: consts.boardTruckKey
    // });

    // let test2 = await models.BOARD_JEEIP_TB.scope([
    //     'active',
    //     'notTemp',
    // ]).findOne({
    //     raw: true,
    //     where: {
    //         idx: 6
    //     }
    // });

    // boardAlarmFunc({
    //     data: test2,
    //     type: consts.boardJeeipKey
    // });
});


/* 나의조건 필터저장 */
router.post('/filterSave', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: true
    }

    let { 
        usage,
        type,
        sub_type,
        min_year,
        max_year,
        min_distance,
        max_distance,
        min_price,
        max_price,
        truck_license_type,
        item,
        go_sido,
        min_pay,
        max_pay,
        unloading,
        jeeip_license_type,
        user 
    } = req.body;

    let option = await getOptions();

    if(!user) {
        sendError(req, res, {code: 1100, msg: '로그인이 필요합니다.'});
        return;
    }

    if(!option?.usage_option?.includes(usage)) { sendError(req, res, {code: 1, msg: '차량용도를 선택해주세요.'}); return; }
    if(!type) { sendError(req, res, {code: 1, msg: '차량형식을 선택해주세요.'}); return; }
    if(!sub_type) { sendError(req, res, {code: 1, msg: '세부차량형식을 선택해주세요.'}); return; }
    if(!min_year || !max_year) { sendError(req, res, {code: 1, msg: '연식을 선택해주세요.'}); return; }
    if(!min_distance && !max_distance) { sendError(req, res, {code: 1, msg: '주행거리를 선택해주세요.'}); return; }
    if(!min_price && !max_price) { sendError(req, res, {code: 1, msg: '차량가격을 선택해주세요.'}); return; }

    if(!item || item?.filter(x => option?.item_option?.includes(x))?.length < 1) { sendError(req, res, {code: 1, msg: '운송품목을 선택해주세요.'}); return; }
    if(!min_pay && !max_pay) { sendError(req, res, {code: 1, msg: '급여를 선택해주세요.'}); return; }
    if(!unloading || unloading?.filter(x => option?.unloading_option?.includes(x))?.length < 1) { sendError(req, res, {code: 1, msg: '상하차방법을 선택해주세요.'}); return; }
    // if(!jeeip_license_type || jeeip_license_type?.length < 1) { sendError(req, res, {code: 1, msg: '넘버승계를 선택해주세요.'}); return; }

    const filter = await models.USER_FILTER_TB.findOne({
        where: {
            u_idx: user?.idx
        }
    });
    
    let updateList = {
        usage: usage || null,
        type: type || null,
        sub_type: sub_type || null,
        min_year: min_year || 0,
        max_year: max_year || 9999,
        min_distance: min_distance || 0,
        max_distance: max_distance || 999999999,
        min_price: min_price || 0,
        max_price: max_price || 999999999,
        truck_license_type: truck_license_type?.join(",") || null,
        item: item?.filter(x => option?.item_option?.includes(x))?.join(",") || null,
        go_sido,
        min_pay: min_pay || 0,
        max_pay: max_pay || 999999999,
        unloading: unloading?.filter(x => option?.unloading_option?.includes(x))?.join(",") || null,
        jeeip_license_type: jeeip_license_type?.join(",") || null,
    };
    
    if(filter) {
        filter.update( updateList );
    } else {
        updateList.u_idx = user?.idx;

        await models.USER_FILTER_TB.create(updateList);
    }


    send(req, res, rt);
});


module.exports = router;
