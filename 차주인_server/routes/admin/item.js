const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, s3UploadResize, s3Delete, send, reviewFunc, scoreFunc, badgeFunc, dataTrashCronFunc, alarmFunc, passwordEncrypt, leaveFunc, logFunc, itemDeleteFunc, userDestroy, randomNum, common, scd, adminScd, masterMiddleware, randomKey, getFileName, sendSms, findJson} = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models/index.js');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(adminScd);
router.use(verify);

router.post('/list', async (req, res) => {

    console.log('admin/item/list => ');
    let { badgeConsts } = common();

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { trash, nowDt } = req.body;
    await scoreFunc();

    
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
   

    const list = await models.ITEM_TB.scope([
        trash ? 'delete' : 'active', 
        'user',
        'compony', 
    ]).findAll({
        order: [
            ['idx', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});


router.post('/customer', async (req, res) => {

    console.log('admin/item/customer => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { trash } = req.body;

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


    const list = await models.CUSTOMER_TB.scope([
        trash ? 'delete' : 'active', 
        'user',
        'compony', 
        'citys',
        'meetings',
    ]).findAll({
        order: [
            ['idx', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});


module.exports = router;
