const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const moment = require('moment');
const app = express();
const cron = require('node-cron');

// const server = require("http").createServer(app);
// const io = require("socket.io")(server, {cors : {origin : "*"}});

const { 
    send, 
    adFunc, 
    reviewFunc, 
    badgeFunc, 
    badgeWeek1Func, 
    badgeWeek2Func, 
    scheduleAlarmFunc,
    dataStateCronFunc,
    dataTrashCronFunc
} = require('./service/utils.js');

const models = require('./models');
const { sequelize } = require("./models/index");

const { sign, verify, refresh } = require('./service/jwt.js');
const { columsReturn, leasingColumsReturn, transactionColumsReturn } = require('./service/returns.js');


const { Op } = require("sequelize");
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 1000 * 60, // 1분 간격
    max: 10000, // windowMs동안 최대 호출 횟수
    handler(req, res) { // 제한 초과 시 콜백 함수 
        res.status(500).send('잠시후 다시 시도해주세요.');
    },
 });

require('dotenv').config();

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

// 크론 매분
cron.schedule('* * * * *', async () => {
    adFunc(); // 광고 기간지난거 마감처리
});

// 크론 한시간마다
cron.schedule('00 * * * *', async () => {
    
});

// 크론 매일 09시
cron.schedule('0 9 * * *', async () => {
});

// 크론 매일 자정
cron.schedule('0 0 * * *', async () => {
    console.log('매일 자정 크론', moment().format('YYYY-MM-DD HH:mm:ss'));
    recruitEndFunc(); // 구인 모집기간 마감처리
});

// 크론 월요일 자정에 한번
cron.schedule('5 0 * * Monday,Thursday', async () => {
    console.log('월요일 자정', moment().format('YYYY-MM-DD HH:mm:ss'));
});


// 공용
app.get('/', (req, res) => res.send('Success!!'));

app.listen(4001, () => console.log('Server Up and running at 4001'));

// io.listen(4000, () => {
//     console.log('Socket Up and running at 4000')
// });
