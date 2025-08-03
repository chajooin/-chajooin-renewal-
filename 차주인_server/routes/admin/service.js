const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const moment = require('moment');

const { uuidv4, talkList, talkSend, s3UploadResize, s3Delete, send, linkMaker, common, scd, adminScd, masterMiddleware, randomKey, getFileName, sendSms, nice, niceDecode } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn } = require('../../service/returns.js');

const models = require('../../models/index.js');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

const consts = require('../../service/consts.json');

router.use(adminScd);
router.use(verify);

/* 문의/신고정산요청 미처리 카운트 */
router.post('/serviceCount', async (req, res) => {

    console.log('admin/service/serviceCount => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const csCount = await models.CS_TB.scope([
        'active',
        'waiting', 
    ]).count();

    const reportCount = await models.REPORT_TB.scope([
        'active',
        'waiting', 
    ]).count();

    const exchangeCount = await models.POINT_EXCHANGE_TB.scope([
        'waiting', 
    ]).count();

    rt.result = {
        csCount,
        reportCount,
        exchangeCount
    };


    send(req, res, rt);
});

/* 문의 리스트 */
router.post('/cslist', async (req, res) => {

    console.log('admin/service/cslist => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { page } = req.body;

    const list = await models.CS_TB.scope([
        'active',
        'user', 
        'files'
    ]).findAll({
        order: [
            ['status', 'ASC'],
            ['idx', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});

/* 문의 저장 */
router.post('/csupdate', async (req, res) => {

    console.log('admin/service/csupdate => ');

    let { nowDt, idx, status, answer, files, delete_file, del } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let row = await models.CS_TB.scope('user').findOne(
        {
            where: {
                idx: idx
            }
        }
    )


    if(del) {
        await models.CS_TB.update(
            {
                delete_dt: nowDt
            },
            {
                where: {
                    idx: idx
                }
            }
        )
        send(req, res, rt);
        return;
    }

    await models.CS_TB.update(
        {
            status: status,
            answer: answer,
            answer_dt: status === 99 ? nowDt: null
        },
        {
            where: {
                idx: idx
            }
        }
    )

    await Promise.all(
        delete_file?.map( async (x, i) => {
            s3Delete(x);

            await models.FILE_TB.destroy({
                where: {
                    file_path: x
                }
            })
        })
    )
    
    await Promise.all(
        files?.filter(item => item?.base)?.map( async (x, i) => {

            let upDataList = {
                type: consts.fileCsAdminKey,
                target_idx: idx
            };

            let urls = await s3UploadResize(x?.base, 'cs', '', x?.ext);
            upDataList.file_path = urls;

            await models.FILE_TB.create(
                upDataList
            )
        })
    )
    
    send(req, res, rt);

    if(row?.status === 1 && status === 99) {

        /** 카카오 알림톡 전송 */
        let template = await talkList('TT_9385');
            
        let msg = template?.templtContent;
        
        msg = msg?.replace("#{답변일시}", moment().format('YYYY.MM.DD HH시mm분'));
        msg = msg?.replace("#{이름}", row?.user?.name);

        msg = msg?.replace("#{고객센터전화번호}", consts?.serviceCenterTel);
        msg = msg?.replace("#{고객센터이메일}", consts?.serviceCenterEmail);

        let button = template?.buttons?.map(x => {
            if(x?.linkType !== "WL") return x;

            let linkMo = x?.linkMo?.replace("#{웹링크}", "chajooin.com/mypageCs");
            let linkPc = x?.linkPc?.replace("#{웹링크}", "chajooin.com/mypageCs");
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

/* 공지사항 리스트 */
router.post('/newslist', async (req, res) => {

    console.log('admin/setting/newslist => ');

    let { page } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    // await models.GUIDE_TB.destroy(
    //     {
    //         where: {
    //             idx: {
    //                 [Op.gte] : 500
    //             }
    //         }
    //     }
    // )
    // for(var i = 0; i < 200; i++) {
    //     await models.GUIDE_TB.create(
    //         {
    //             cate: 'GUIDE' + (i%2),
    //             title: 'GUIDE/GUIDE'+i,
    //             desc: i+'GUIDE',
    //         }
    //     )
    // }
   
    const list = await models.NEWS_TB.scope([
        'active'
    ]).findAll({
        order: [
            ['idx', 'DESC']
        ]
    });

    rt.result = list;

    send(req, res, rt);
});


/* 공지사항 저장 */
router.post('/newsupdate', async (req, res) => {


    let { nowDt, idx, title, desc, board, del } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let updateList = {
        title: title,
        desc: desc,
        board
    };
    console.log(updateList);
    let whereList = {
        idx: idx
    };
    
    if(del) {
        await models.NEWS_TB.destroy(
            {
                where: whereList
            }
        )
        send(req, res, rt);
        return;
    }
    
    if(idx) {
        await models.NEWS_TB.update(
            updateList,
            {
                where: whereList
            }
        )
    } else {
        await models.NEWS_TB.create(
            updateList
        )
    }
    

    send(req, res, rt);
});


/* FAQ 리스트 */
router.post('/faqlist', async (req, res) => {

    console.log('admin/service/faqlist => ');

    let { page } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    // await models.REPORT_TB.destroy(
    //     {
    //         where: {
    //             idx: {
    //                 [Op.gte] : 500
    //             }
    //         }
    //     }
    // )
    // for(var i = 0; i < 200; i++) {
    //     await models.FAQ_TB.create(
    //         {
    //             cate: 'FAQ' + (i%3),
    //             title: 'TEST/TEST'+i,
    //             desc: i+'TEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TEST',
    //         }
    //     )
    // }
   
    const list = await models.FAQ_TB.scope([
        'active',
        { method: ['pageing', page ] }
    ]).findAndCountAll({
        order: [
            ['idx', 'DESC']
        ]
    });

    rt.result = {
        count: list.count, 
        list: list?.rows
    }

    send(req, res, rt);
});

/* FAQ 저장 */
router.post('/faqupdate', async (req, res) => {

    console.log('admin/service/faqupdate => ');

    let { nowDt, idx, cate, title, desc, del } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let updateList = {
        cate: cate,
        title: title,
        desc: desc
    };
    
    let whereList = {
        idx: idx
    };
    
    if(del) {
        await models.FAQ_TB.destroy(
            {
                where: whereList
            }
        )
        send(req, res, rt);
        return;
    }
    
    if(idx) {
        await models.FAQ_TB.update(
            updateList,
            {
                where: whereList
            }
        )
    } else {
        await models.FAQ_TB.create(
            updateList
        )
    }
    

    send(req, res, rt);
});


/* FAQ 카테고리 저장 */
router.post('/faqcate', async (req, res) => {

    console.log('admin/service/faqcate => ');

    let { nowDt, list, deletelist } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    await models.CONFIG_TB.update(
        {
            con_fag_cate: list?.join("||")
        },
        {
            where: {
                idx: 1
            }
        }
    )

    await models.FAQ_TB.destroy(
        {
            where: {
                cate: {
                    [Op.in]: deletelist
                }
            }
        }
    )

    send(req, res, rt);
});

/* 신고 리스트 */
router.post('/reportlist', async (req, res) => {

    console.log('admin/service/reportlist => ');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }
    // await models.REPORT_TB.destroy(
    //     {
    //         where: {
    //             idx: {
    //                 [Op.gte] : 500
    //             }
    //         }
    //     }
    // )
    // for(var i = 0; i < 3000; i++) {
    //     await models.REPORT_TB.create(
    //         {
    //             u_idx: 2,
    //             target_idx: 3,
    //             title: 'TEST/TEST'+i,
    //             desc: i+'TEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TESTTEST/TEST',
    //         }
    //     )
    // }
   
    let list = await models.REPORT_TB.scope([
        'active',
        'user',
        'files'
    ]).findAll({
        order: [
            ['status', 'ASC'],
            ['idx', 'DESC']
        ]
    });

    // 종합적인 상태에 따라 전송할 정보 가공
    list = await Promise.all( 
        list?.map( async (item, index) => {
            let x = item.get({ plain: true });

            let link = linkMaker({
                board: x?.board,
                board_idx: x?.board_idx
            });

            return {...x, link}
        })
    );

    

    rt.result = list;

    send(req, res, rt);
});

/* 신고 저장 */
router.post('/reportupdate', async (req, res) => {

    console.log('admin/service/reportupdate => ');

    let { nowDt, idx, status, answer, del } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    if(del) {
        await models.REPORT_TB.update(
            {
                delete_dt: nowDt
            },
            {
                where: {
                    idx: idx
                }
            }
        )
        send(req, res, rt);
        return;
    }

    await models.REPORT_TB.update(
        {
            status: status,
            process: answer
        },
        {
            where: {
                idx: idx
            }
        }
    )

    send(req, res, rt);
});





/* 신고 저장 */
router.post('/reportupdate', async (req, res) => {

    console.log('admin/service/reportupdate => ');

    let { nowDt, idx, status, answer, files, delete_file, del } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    if(del) {
        await models.REPORT_TB.update(
            {
                delete_dt: nowDt
            },
            {
                where: {
                    idx: idx
                }
            }
        )
        send(req, res, rt);
        return;
    }
    
    await models.REPORT_TB.update(
        {
            status: status,
            answer: answer,
            answer_dt: status === 99 ? nowDt: null
        },
        {
            where: {
                idx: idx
            }
        }
    )

    await Promise.all(
        delete_file?.map( async (x, i) => {
            s3Delete(x);

            await models.FILE_TB.destroy({
                where: {
                    file_path: x
                }
            })
        })
    )
    
    await Promise.all(
        files?.filter(item => item?.base)?.map( async (x, i) => {

            let upDataList = {
                type: 4,
                target_idx: idx
            };

            let urls = await s3UploadResize(x?.base, 'report', '', x?.ext);
            upDataList.file_path = urls;

            await models.FILE_TB.create(
                upDataList
            )
        })
    )
    

    send(req, res, rt);
});




/* 이용가이드 리스트 */
router.post('/guidelist', async (req, res) => {

    console.log('admin/service/guidelist => ');

    let { page } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    // await models.GUIDE_TB.destroy(
    //     {
    //         where: {
    //             idx: {
    //                 [Op.gte] : 500
    //             }
    //         }
    //     }
    // )
    // for(var i = 0; i < 200; i++) {
    //     await models.GUIDE_TB.create(
    //         {
    //             cate: 'GUIDE' + (i%2),
    //             title: 'GUIDE/GUIDE'+i,
    //             desc: i+'GUIDE',
    //         }
    //     )
    // }
   
    const list = await models.GUIDE_TB.scope([
        'active',
        { method: ['pageing', page ] }
    ]).findAndCountAll({
        order: [
            ['idx', 'DESC']
        ]
    });

    rt.result = {
        count: list.count, 
        list: list?.rows
    }

    send(req, res, rt);
});


/* 이용가이드 저장 */
router.post('/guideupdate', async (req, res) => {

    console.log('admin/service/guideupdate => ');

    let { nowDt, idx, cate, title, desc, del } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let updateList = {
        cate: cate,
        title: title,
        desc: desc
    };
    
    let whereList = {
        idx: idx
    };
    
    if(del) {
        await models.GUIDE_TB.destroy(
            {
                where: whereList
            }
        )
        send(req, res, rt);
        return;
    }
    
    if(idx) {
        await models.GUIDE_TB.update(
            updateList,
            {
                where: whereList
            }
        )
    } else {
        await models.GUIDE_TB.create(
            updateList
        )
    }
    

    send(req, res, rt);
});


/* 이용가이드 카테고리 저장 */
router.post('/guidecate', async (req, res) => {

    console.log('admin/service/guidecate => ');

    let { nowDt, list, deletelist } = req.body;

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    await models.CONFIG_TB.update(
        {
            con_guide_cate: list?.join("||")
        },
        {
            where: {
                idx: 1
            }
        }
    )

    await models.GUIDE_TB.destroy(
        {
            where: {
                cate: {
                    [Op.in]: deletelist
                }
            }
        }
    )

    send(req, res, rt);
});

module.exports = router;
