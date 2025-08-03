const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const moment = require('moment');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());  
const router = express.Router();
const cron = require('node-cron');


// const server = require("http").createServer(app);
// const io = require("socket.io")(server, {cors : {origin : "*"}});

const { send, sendError, talkList, talkSend, talkHistoryDetail, pointFunc, common, getOptions, s3Upload, s3Select, pass, saveAlram, workdummy, scd, numFormat, payRequest } = require('./service/utils.js');

const models = require('./models');
const { sequelize } = require("./models/index");

const { sign, verify, refresh, decryptToken, destroyToken } = require('./service/jwt.js');
const { columsReturn, leasingColumsReturn, transactionColumsReturn } = require('./service/returns.js');

require('dotenv').config();

const { Op } = require("sequelize");
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 1000 * 60, // 1분 간격
    max: 10000, // windowMs동안 최대 호출 횟수
    handler(req, res) { // 제한 초과 시 콜백 함수 
        res.status(500).send('잠시후 다시 시도해주세요.');
    },
 });


app.use(cors());
app.use(helmet());
app.use(apiLimiter);








app.use(express.json({limit: '100mb'}));

app.use((req, res, next) => {

    let nowDt = moment().format('YYYY-MM-DD HH:mm:ss');

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.startsWith('::ffff:')) {     
        ip = ip.substring(7);
    }

    req.body.nowDt = nowDt;
    req.body.ip = ip;

    next();
})

/** 공용 */
app.use("/base", require("./routes/v1/base"));

/** 관리자 API */
app.use("/admin/login", require("./routes/admin/login"));
app.use("/admin/auth", require("./routes/admin/auth"));
app.use("/admin/member", require("./routes/admin/member"));
app.use("/admin/board", require("./routes/admin/board"));
app.use("/admin/point", require("./routes/admin/point"));
app.use("/admin/setting", require("./routes/admin/setting"));
app.use("/admin/service", require("./routes/admin/service"));


app.use("/admin/compony", require("./routes/admin/compony"));
app.use("/admin/item", require("./routes/admin/item"));
app.use("/admin/excel", require("./routes/admin/excel"));


/** 사용자 API */
app.use("/v1/main", require("./routes/v1/main"));
app.use("/v1/login", require("./routes/v1/login"));
app.use("/v1/auth", require("./routes/v1/auth"));
app.use("/v1/truck", require("./routes/v1/truck"));
app.use("/v1/jeeip", require("./routes/v1/jeeip"));
app.use("/v1/recruit", require("./routes/v1/recruit"));
app.use("/v1/job", require("./routes/v1/job"));
app.use("/v1/board", require("./routes/v1/board"));

app.use("/v1/message", require("./routes/v1/message"));

app.use("/v1/point", require("./routes/v1/point"));
app.use("/v1/payCallBack", require("./routes/v1/payCallBack"));

app.use("/v1/news", require("./routes/v1/news"));
app.use("/v1/faq", require("./routes/v1/faq"));

// app.use("/v1/compony", require("./routes/v1/compony"));
// app.use("/v1/item", require("./routes/v1/item"));
// app.use("/v1/customer", require("./routes/v1/customer"));
// app.use("/v1/mediation", require("./routes/v1/mediation"));
// app.use("/v1/cs", require("./routes/v1/cs"));
// app.use("/v1/news", require("./routes/v1/news"));
// app.use("/v1/faq", require("./routes/v1/faq"));
// app.use("/v1/guide", require("./routes/v1/guide"));
// app.use("/v1/alarm", require("./routes/v1/alarm"));
// app.use("/v1/schedule", require("./routes/v1/schedule"));

/** 사용자 API 대표권한 */
// app.use("/v1/master", require("./routes/v1/master"));

// 크론 매분
// cron.schedule('0 */1 * * *', async () => {
//     console.log('매일 정시 크론');
// });


// 소켓
// io.on('connection', function(socket){
// 	console.log("SOCKETIO connection EVENT: ", socket.id, " client connected");

//     socket.on('joinRoom', function(data) {
//         console.log(socket.rooms);
//     });

//     socket.on('leaveRoom', function(data) {

//         let roomName = data?.roomName;

//         if(roomName) {
//             socket.leave(roomName);
//         }

//         console.log(socket.rooms);
//     });

// 	socket.on('disconnect', function(){
//     	// 클라이언트의 연결이 끊어졌을 때 호출됩니다.
// 		console.log('server disconnected');
// 	});
// });

// 공용
app.get('/', (req, res) => res.send('carmaster'));



// 사용자 라우트
app.get('/user', (req, res) => {
    res.json({ message: 'User route is working!' });
});

// 테스트
app.get('/test', async (req, res) => {

    console.log('in test', req.query);
    // [2025-07-29] sign 함수 미정의로 임시 주석처리
// 원래 기능 복구/확인 필요: sign 함수(토큰 생성/암호화?)
// 외주 개발자에게 확인 필요, 또는 이후 GPT와 구현 가능
// const token = sign({ idx: 1, carOwner: '홍길동', carRegNo: '123나1234' });
//console.log('token', token);

    //const token = sign({ idx: 1, carOwner: '홍길동', carRegNo: '123나1234' });
   // console.log('token', token);

   // let decrypt = decryptToken(token);
   // console.log('decrypt', decrypt);


    // models.USER_TB.update(
    //     {
    //         login_dt: req.body.nowDt
    //     },
    //     {
    //         where: {
    //             idx: user.idx
    //         }
    //     }
    // )
    
    
    res.send('carmaster');
    return;
    // V66610000000
    const axios = require('axios');
    
    var api_url = 'http://211.236.84.211/tsOpenAPI/minGamInfoService/getMinGamInfo';
    var sender = {
        params: {
            insttCode: '00283E796FD1CE7FFA585EA2276162C8',
            svcCode: '00283E79700C4A714A49C1099B05A78F',
            vhcleNo: '339누8292'
        }
    }
        
    await axios.get(api_url, sender).then(({ data })=>{
        console.log('data', data);
    })
    
    return;

    // await talkHistoryDetail({mid: "847934448"});

    let test = await talkList('TT_9380');
    console.log('test', test);
    
    let msg = test?.templtContent;
    msg = msg?.replace("#{이름}", "이종환");
    msg = msg?.replace("#{SNS명}", "카카오");
    msg = msg?.replace("#{계정}", "test@test.com");
    msg = msg?.replace("#{고객센터전화번호}", "1588-9999");
    msg = msg?.replace("#{고객센터이메일}", "test2@test2.com");

    console.log('msg', msg);

    let button = test?.buttons?.map(x => {
        if(x?.linkType !== "WL") return x;

        let linkMo = x?.linkMo?.replace("#{웹링크}", "chajooin.com");
        let linkPc = x?.linkPc?.replace("#{웹링크}", "chajooin.com");
        return {...x, linkMo, linkPc }
    });

    // let button = [
    //     {
    //         name: "채널 추가",
    //         linkType: "AC",
    //         linkTypeName: "채널 추가"
    //     },
    //     {
    //         name: "상세보기",
    //         linkType: "WL",
    //         linkTypeName: "웹링크",
    //         linkMo: "https://chajooin.com",
    //         linkPc: "https://chajooin.com"
    //     }
    // ];

    let talk_one = {
        receiver: '01097738021',
        subject: test?.templtName,
        message: msg,
        button: button
    }
    await talkSend({
        tpl_code: test?.templtCode,
        talk_list: [talk_one]
    })

    res.send('carmaster');

});


// 자동차 소유자 인증 성공 callback
app.get('/carSuccess', async (req, res) => {

    console.log('in carSuccess', req.query);
    let { token, callback } = req.query;

    if(!token || !callback) {
        res.send('carmaster');
        return;
    }

    let decrypt = decryptToken(token);
    console.log('decrypt', decrypt);
    
    if(!decrypt || !decrypt?.idx || !decrypt?.carOwner || !decrypt?.carRegNo) {
        res.send('carmaster');
        return;
    }

    res.send('carmaster');

    models.USER_TB.update(
        {
            car_owner: decrypt?.carOwner,
            car_reg_no: decrypt?.carRegNo,
        },
        {
            where: {
                idx: decrypt?.idx
            }
        }
    )

});

// 자동차 소유자 인증 실패 callback
app.get('/carFail', async (req, res) => {

    console.log('in carFail', req.query);
    // if(!callback)

    // models.USER_TB.update(
    //     {
    //         login_dt: req.body.nowDt
    //     },
    //     {
    //         where: {
    //             idx: user.idx
    //         }
    //     }
    // )
    

    res.send('carmaster');
    return;

});


/* 약관 */
app.post('/term', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { type=1 } = req.body;

    const rows = await models.TERM_TB.findOne(
        {
            raw: true,
            where: {
                type: type
            },
            order: [
                ['idx', 'ASC']
            ]
        }
    );

    rt.result = rows?.desc;

    send(req, res, rt);
});


/* 시도 시군구 동 가져오기 */
app.post('/sido', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const rows = await models.DONG_TB.scope('sido').findAll({
        raw: true,
        order: [
            ['idx', 'ASC']
        ]
    });

    rt.result = rows?.map((item) => item.title);

    send(req, res, rt);
});
app.post('/sigungu', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { sido="" } = req.body;

    const rows = await models.DONG_TB.scope( { method: ['sigungu', sido ] } ).findAll({
        raw: true,
        order: [
            ['title', 'ASC']
        ]
    });

    rt.result = rows?.map((item) => item.title);

    send(req, res, rt);
});
app.post('/dong', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { sido="", sigungu="" } = req.body;

    const rows = await models.DONG_TB.scope( { method: ['dong', sido, sigungu ] } ).findAll({
        raw: true,
        order: [
            ['title', 'ASC']
        ]
    });

    rt.result = rows?.map((item) => item.title);

    send(req, res, rt);
});


/* 제조사 */
app.post('/carAll', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const list = await models.CAR_TB.findAll(
        {
            raw: true,
            order: [
                ['order', 'ASC']
            ]
        }
    );

    rt.result = await Promise.all( 
        list?.map( async (x, i) => {
            return {...x, car: x?.car?.split(',')}
        })
    );

    send(req, res, rt);
});
app.post('/maker', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const list = await models.CAR_TB.findAll(
        {
            raw: true,
            order: [
                ['order', 'ASC']
            ]
        }
    );

    rt.result = await Promise.all( 
        list?.map( async (x, i) => {
            return x?.maker
        })
    );

    send(req, res, rt);
});
app.post('/car', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { maker="" } = req.body;

    const row = await models.CAR_TB.findOne(
        {
            raw: true,
            where: {
                maker: maker
            }
        }
    );

    rt.result = row?.car?.split(',') || [];

    send(req, res, rt);
});


/* 차량형식 */
app.post('/cartypeAll', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const list = await models.CAR_TYPE_TB.findAll(
        {
            raw: true,
            order: [
                ['order', 'ASC']
            ]
        }
    );

    rt.result = await Promise.all( 
        list?.map( async (x, i) => {
            return {...x, sub_type: x?.sub_type?.split(',')}
        })
    );

    send(req, res, rt);
});
app.post('/carType', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const list = await models.CAR_TYPE_TB.findAll(
        {
            raw: true,
            order: [
                ['order', 'ASC']
            ]
        }
    );

    rt.result = await Promise.all( 
        list?.map( async (x, i) => {
            return x?.type
        })
    );

    send(req, res, rt);
});
app.post('/carSubType', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { type="" } = req.body;

    const row = await models.CAR_TYPE_TB.findOne(
        {
            raw: true,
            where: {
                type: type
            }
        }
    );

    rt.result = row?.sub_type?.split(',') || [];

    send(req, res, rt);
});

/* 기타 분류 */
app.post('/option', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    const list = await models.OPTION_TB.findAll(
        {
            raw: true,
        }
    );

    rt.result = await Promise.all( 
        list?.map( async (x, i) => {
            return {...x, options: x?.options?.split(',')}
        })
    );

    send(req, res, rt);
});


app.post('/carSubType', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { type="" } = req.body;

    const row = await models.CAR_TYPE_TB.findOne(
        {
            raw: true,
            where: {
                type: type
            }
        }
    );

    rt.result = row?.sub_type?.split(',') || [];

    send(req, res, rt);
});


app.post('/test', async (req, res) => {

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }


    let { payPriceConsts } = common();
    let { key } = req.body;

    let pay_info = payPriceConsts?.find(x => x?.idx === key);

    if(!pay_info) {
        sendError(req, res, {code: 1200, msg: '잘못된 접근입니다.'});
        return;
    }

    let loginUser = await models.USER_TB.findOne(
        {
            where: {
                idx: 225
            }
        }
    );
    
    let payresult = await payRequest({
        service_name: "차주인",
        user_id: `${loginUser?.type}_${loginUser?.id}`,
        user_name: loginUser?.name,
        order_no: moment().unix() + "_" + loginUser?.idx,
        // amount: pay_info?.price,
        amount: 1000,
        product_name: `포인트충전_${numFormat(pay_info?.point)}P`,
        autopay_flag: "N",
        callbackUrl: "http://ec2-43-200-183-10.ap-northeast-2.compute.amazonaws.com:4000/v1/payCallBack/callback",
        custom_parameter: JSON.stringify({ idx: loginUser?.idx, point: pay_info?.point })
    });

    if(payresult?.error) {
        rt.ok = false;
        rt.msg = '잘못된 접근입니다. - ' + payresult?.data?.code;
        send(req, res, rt);
        return;
    }

    rt.result = payresult?.data;

    send(req, res, rt);
});

const commonRouter = require('./routes/common');
app.use('/common', commonRouter);

const boardRouter = require('./routes/board');
app.use('/board', boardRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


// io.listen(4000, () => {
//     console.log('Socket Up and running at 4000')
// });
