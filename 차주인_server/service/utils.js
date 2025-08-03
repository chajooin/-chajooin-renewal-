require('dotenv').config();

const moment = require('moment');
const models = require('../models');
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize"); 
const { sequelize } = require("../models/index"); 

const jwtUtil = require('jsonwebtoken');

const consts = require('./consts.json');
const secret = process.env.JWT_KEY;

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

module.exports.randomKey = (length = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
  
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    return str;
};


module.exports.randomNum = (length = 8) => {
    const chars = '0123456789';
    let str = '';
  
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    return str;
};

module.exports.calculatePercentage = (per, val) => {

    if(!per*1 || !val*1) return 0;

    let v = Math.floor( ((per*1) / 100) * (val*1) );
    
    return isNaN(v) ? 0 : v;
}
  
module.exports.dummy = () => {
    return {
        issue: {
            title: '진행중',
            className: 'ing_btn_big',
            state: 2,
            items: [
                {idx: 1, title: 'Aws신청 요청1', create_dt: '2023-04-10', type: '개발', state: 1, cnt: 12, bookmark: true, u_idx: 5, user: {profile: '', name: 'PNSOFT'}  },
                {idx: 2, title: 'Aws신청 요청2', create_dt: '2023-05-10', type: '개발', state: 1, cnt: 2, bookmark: false, u_idx: 5, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 3, title: 'Aws신청 요청3', create_dt: '2023-04-20', type: '개발', state: 1, cnt: 121, bookmark: true, u_idx: 4, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 4, title: 'Aws신청 요청4', create_dt: '2023-04-20', type: '개발', state: 1, cnt: 121, bookmark: false, u_idx: 4, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 5, title: 'Aws신청 요청5', create_dt: '2023-04-20', type: '개발', state: 2, cnt: 121, bookmark: false, u_idx: 4, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 6, title: 'Aws신청 요청6', create_dt: '2023-04-20', type: '개발', state: 2, cnt: 121, bookmark: false, u_idx: 5, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 7, title: 'Aws신청 요청7', create_dt: '2023-04-20', type: '개발', state: 2, cnt: 121, bookmark: true, u_idx: 5, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
            ],
        },
        todo: {
            title: '보류',
            className: 'before_btn_big',
            state: 1,
            items: [
                {idx: 8, title: 'Aws신청 요청8', create_dt: '2023-04-20', type: '개발', state: 2, cnt: 121, bookmark: false, u_idx: 1, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 9, title: 'Aws신청 요청9', create_dt: '2023-04-20', type: '개발', state: 2, cnt: 121, bookmark: true,u_idx: 1,  user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 10, title: 'Aws신청 요청10', create_dt: '2023-04-20', type: '개발', state: 2, cnt: 121, bookmark: true,u_idx: 1,  user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 11, title: 'Aws신청 요청11', create_dt: '2023-04-20', type: '개발', state: 2, cnt: 121, bookmark: true, u_idx: 4, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 12, title: 'Aws신청 요청12', create_dt: '2023-04-20', type: '개발', state: 2, cnt: 121, bookmark: false,u_idx: 4,  user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 13, title: 'Aws신청 요청13', create_dt: '2023-04-20', type: '개발', state: 3, cnt: 121, bookmark: false,u_idx: 5,  user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 14, title: 'Aws신청 요청14', create_dt: '2023-04-20', type: '개발', state: 3, cnt: 121, bookmark: true, u_idx: 1, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 15, title: 'Aws신청 요청15', create_dt: '2023-04-20', type: '개발', state: 3, cnt: 121, bookmark: true, u_idx: 1, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
            ],
        },
        done: {
            title: '완료',
            className: 'done_btn_big',
            state: 3,
            items: [
                {idx: 16, title: 'Aws신청 요청16', create_dt: '2023-04-20', type: '개발', state: 2, cnt: 121, bookmark: false, u_idx: 1, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
                {idx: 17, title: 'Aws신청 요청17', create_dt: '2023-04-20', type: '개발', state: 2, cnt: 121, bookmark: true, u_idx: 1, user: {profile: 'pms/c7e744c1-aaf7-45cf-8d73-b5fb48ee6259.png', name: 'PNSOFT'}  },
            ],
        },
    }
}


module.exports.send = async (req, res, rt) => {
    if(!rt.ok) {
        res.status(500).send(rt.msg);
    } else {
        res.json(rt.result);
    }
}

module.exports.sendError = async (req, res, msg) => {
    res.status(500).send(msg);
}

module.exports.s3Upload = async (base64, dir, name="", ext="") => {
  
    const AWS = require('aws-sdk');
    const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;
  
    AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });
  
    const s3 = new AWS.S3();
  
    const base64Data = new Buffer.from(base64.split("base64,")[1], 'base64');
  
    const mime = base64.split(';')[0];

    let type = mime.split('/')[1];
    let mimetype = mime.split(':')[1];

    if(type === 'svg+xml') type = 'svg';
  
    const userId = 1;
  
    const params = {
      Bucket: S3_BUCKET,
      Key: dir + '/' + (name ? name : uuidv4())+`.${ ext ? ext : type}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: mimetype
    }
  
    let location = '';
    let key = '';
    try {
      const { Location, Key } = await s3.upload(params).promise();
      location = Location;
      key = Key;
    } catch (error) {
       console.log(error)
    }
    
    return key;
    
    // To delete, see: https://gist.github.com/SylarRuby/b3b1430ca633bc5ffec29bbcdac2bd52
}


module.exports.s3UploadResizeNew = async ({
    base64, 
    dir, 
    name="",
    ext="",
    width
}) => {
  
    const AWS = require('aws-sdk');
    const sharp = require('sharp');
    
    const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;
  
    AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });
  
    const s3 = new AWS.S3();
    
    try {
        let base64Data = new Buffer.from(base64.split("base64,")[1], 'base64');
    
        const mime = base64.split(';')[0];

        let type = mime.split('/')[1];
        let mimetype = mime.split(':')[1];

        if(type === 'svg+xml') type = 'svg';

        if(type === 'png' || type === 'jpeg' || type === 'jpg') {

            const fileBuffer = await sharp(base64Data);
            const { width } = await fileBuffer.metadata();
            if(width > 1200) {
                base64Data = await fileBuffer.resize({ width: 1200, fit: "contain" }).withMetadata().toBuffer();
            }
        }
        
        const params = {
            Bucket: S3_BUCKET,
            Key: dir + '/' + (name ? name : uuidv4())+`.${ ext ? ext : type}`,
            Body: base64Data,
            ContentEncoding: 'base64',
            ContentType: mimetype
        }

        let location = '';
        let key = '';
        try {
            const { Location, Key } = await s3.upload(params).promise();
            location = Location;
            key = Key;
        } catch (error) {
            console.log(error)
        }
        
        return key;

    } catch (error) {
        return '';
    }
    
}

module.exports.s3UploadResize = async (base64, dir, name="", ext="") => {
  
    const AWS = require('aws-sdk');
    const sharp = require('sharp');
    
    const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;
  
    AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });
  
    const s3 = new AWS.S3();
    
    try {
        let base64Data = new Buffer.from(base64.split("base64,")[1], 'base64');
    
        const mime = base64.split(';')[0];

        let type = mime.split('/')[1];
        let mimetype = mime.split(':')[1];

        if(type === 'svg+xml') type = 'svg';

        if(type === 'png' || type === 'jpeg' || type === 'jpg') {

            const fileBuffer = await sharp(base64Data);
            const { width } = await fileBuffer.metadata();
            if(width > 1200) {
                base64Data = await fileBuffer.resize({ width: 1200, fit: "contain" }).withMetadata().toBuffer();
            }
        }
        
        const params = {
            Bucket: S3_BUCKET,
            Key: dir + '/' + (name ? name : uuidv4())+`.${ ext ? ext : type}`,
            Body: base64Data,
            ContentEncoding: 'base64',
            ContentType: mimetype
        }

        let location = '';
        let key = '';
        try {
            const { Location, Key } = await s3.upload(params).promise();
            location = Location;
            key = Key;
        } catch (error) {
            console.log(error)
        }
        
        return key;

    } catch (error) {
        return '';
    }
    
}


module.exports.s3UploadUrl = async (url, dir, name="") => {
  
    const AWS = require('aws-sdk');
    const axios = require('axios');
    
    const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;
  
    AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });
  
    const s3 = new AWS.S3();
  
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const fileData = response.data;

    let ext = url?.split('.').slice(-1);

    const params = {
        Bucket: S3_BUCKET,
        Key: dir + '/' + (name ? name : uuidv4())+`.${ext}`,
        Body: fileData
    };
  
    let location = '';
    let key = '';
    try {
      const { Location, Key } = await s3.upload(params).promise();
      location = Location;
      key = Key;
    } catch (error) {
       console.log(error)
    }
    
    return key;
    
    // To delete, see: https://gist.github.com/SylarRuby/b3b1430ca633bc5ffec29bbcdac2bd52
}


module.exports.s3Select = async (key, filename) => {

    const AWS = require('aws-sdk');

    const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;

    AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });

    const s3 = new AWS.S3();

    var params = { 
        Bucket: S3_BUCKET, 
        Key: key
    };

    // console.log("param => ", params);
    let code = "0000";
    await s3.headObject(params).promise().then(async (data) => {
        // console.log("result => ", data)
        // 만일 객체가 있으면 getSignedUrl을 통해 객체 url을 가져온다.
        var containsSpecialChars = /[^\u0000-\u00ff]/g.test(filename);
        var contentDisposition;
        if (containsSpecialChars) {
            contentDisposition = 'attachment; filename*=UTF-8\'\''+ encodeURIComponent(filename);
        } else {
            contentDisposition = 'attachment; filename="'+ filename + '"; filename*=UTF-8\'\''+ encodeURIComponent(filename);
        }
        
        params = { 
            Bucket: S3_BUCKET, 
            Key: key,
            Expires: 600,
            ResponseContentDisposition: contentDisposition
        };
        
        const obj_url = s3.getSignedUrl('getObject', params); 
        // console.log('obj_url: ', obj_url);
        code = obj_url;
    }).catch((error) => {
        console.log(error);
        code = "9999";
    });

    return code;
}



module.exports.s3SelectBuffer = async (key, filename) => {

    const AWS = require('aws-sdk');
    const XLSX = require("xlsx");
    const iconv = require('iconv-lite');


    const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;

    AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });

    const s3 = new AWS.S3();

    var params = { 
        Bucket: S3_BUCKET, 
        Key: key
    };

    const file = s3.getObject(params).createReadStream();

    return new Promise((resolve, reject) => {
        const buffers = [];
    
        file.on('data', function (data) {
          buffers.push(data);
        });
    
        file.on('end', function () {
          const buffer = Buffer.concat(buffers);
          const workbook = XLSX.read(buffer, { type: 'buffer' });
          const workSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[workSheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, { defval: ''});
          resolve(data);
        });
    
        file.on('error', (err) => {
          reject(err);
        });
    });

}


module.exports.s3Delete = async (key) => {
    if(!key) return;

    const AWS = require('aws-sdk');
    const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;
    AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });
    const s3 = new AWS.S3();
    // var params = { Bucket: S3_BUCKET, Key: 'img/'+key };
    var params = { Bucket: S3_BUCKET, Key: key };
    console.log("param => ", params);

    await s3.deleteObject(params).promise().then((data) => {
        console.log('Delete Success! : ', data);
    }).catch((error) => {
        console.error('Delete error! : ', error);
    });

    // s3.deleteObject(params, function(err, data) {
    //     console.log("s3_del => ", data);

    //     if (err) {
    //         console.log(err, err.stack);  // error
    //     } else {
    //         console.log("s3 delete!!"); // delete Success
    //     }
    // });
}




// 포인트 사용 / 지급
module.exports.pointFunc = async (data) => {

    if(!data?.idx || !data?.type || !data?.point) return;

    const row = await models.USER_TB.scope([
        'front',  
    ]).findOne({
        where: {
            idx: data?.idx || 0
        }
    });

    if(!row) return;

    let updateList = {
        u_idx: row?.idx,
        type: data?.type,
        title: data?.title,
        point: data?.point,
        before_point: row?.point,
        delete_dt: data?.delete_dt || null
    }

    await models.POINT_TB.create(
       updateList
    );

    let point = data?.type === 1 ? row?.point - data?.point : row?.point + data?.point;
    
    await row.update({
        point: point
    })

    if(data?.type === 2 && data?.title === '포인트 충전') { 
        /** 포인트 충전 카카오 알림톡 전송 */
        let template = await this.talkList('TT_9382');
        
        let msg = template?.templtContent;
        
        msg = msg?.replace("#{구매일시}", moment().format('YYYY.MM.DD HH시mm분'));
        msg = msg?.replace("#{이름}", row?.name);
        msg = msg?.replace("#{구매포인트}", `${this.numFormat(data?.point)}P`);
        msg = msg?.replace("#{결제금액}", `${this.numFormat(data?.amount)}원`);

        msg = msg?.replace("#{고객센터전화번호}", consts?.serviceCenterTel);
        msg = msg?.replace("#{고객센터이메일}", consts?.serviceCenterEmail);

        let button = template?.buttons?.map(x => {
            if(x?.linkType !== "WL") return x;

            let linkMo = x?.linkMo?.replace("#{웹링크}", "chajooin.com/mypagePoint");
            let linkPc = x?.linkPc?.replace("#{웹링크}", "chajooin.com/mypagePoint");
            return {...x, linkMo, linkPc }
        });

        let talk_one = {
            receiver: row?.hp,
            subject: template?.templtName,
            message: msg,
            button: button
        }
        await this.talkSend({
            tpl_code: template?.templtCode,
            talk_list: [talk_one]
        })
    } else if(data?.type === 1) {
        /** 포인트 사용 카카오 알림톡 전송 */
        let template = await this.talkList('TT_9383');
        
        let msg = template?.templtContent;
        
        msg = msg?.replace("#{사용일시}", moment().format('YYYY.MM.DD HH시mm분'));
        msg = msg?.replace("#{이름}", row?.name);
        msg = msg?.replace("#{사용포인트}", `${this.numFormat(data?.point)}P`);
        msg = msg?.replace("#{사용내역}", data?.title);
        msg = msg?.replace("#{잔액포인트}", `${this.numFormat(point)}P`);

        msg = msg?.replace("#{고객센터전화번호}", consts?.serviceCenterTel);
        msg = msg?.replace("#{고객센터이메일}", consts?.serviceCenterEmail);

        let button = template?.buttons?.map(x => {
            if(x?.linkType !== "WL") return x;

            let linkMo = x?.linkMo?.replace("#{웹링크}", "chajooin.com/mypagePoint?tab=3");
            let linkPc = x?.linkPc?.replace("#{웹링크}", "chajooin.com/mypagePoint?tab=3");
            return {...x, linkMo, linkPc }
        });

        let talk_one = {
            receiver: row?.hp,
            subject: template?.templtName,
            message: msg,
            button: button
        }
        await this.talkSend({
            tpl_code: template?.templtCode,
            talk_list: [talk_one]
        })
    }
}

// 알람 전송 (알림톡 전송도 추가해야함)
module.exports.alarmFunc = async ({u_idx, alarm}) => {

    if(!u_idx) return;

    let updateList = {
        u_idx: u_idx,
        ...alarm
    }

    await models.ALARM_TB.create(
       updateList
    );
}

// 조건 맞는 게시물 등록시 알람
module.exports.boardAlarmFunc = async ({data, type}) => {

    if(!data) return;

    // sequelize.literal( 'CASE WHEN `isCheck` = "N" THEN 1 ELSE 0 END DESC, createDate DESC, updateDate DESC', );
    let whereList = null;

    if(type === consts.boardTruckKey) {

        whereList = {
            usage: data?.usage,
            type: data?.type,
            sub_type: data?.sub_type,
            min_year: {
                [Op.lte]: data?.year
            },
            max_year: {
                [Op.gte]: data?.year
            },
            min_distance: {
                [Op.lte]: data?.distance
            },
            max_distance: {
                [Op.gte]: data?.distance
            },
            min_price: {
                [Op.lte]: data?.price
            },
            max_price: {
                [Op.gte]: data?.price
            }
        }
    
    } else if(type === consts.boardJeeipKey) {

        whereList = {
            min_pay: {
                [Op.lte]: data?.pay
            },
            max_pay: {
                [Op.gte]: data?.pay
            }
        }
    }
    
    if(!whereList) return;

    console.log('whereList', whereList);
    let filters = await models.USER_FILTER_TB.findAll({
        raw: true,
        where: whereList
    });

    if(type === consts.boardJeeipKey) {

        console.log('filter before' + type, filters?.length);
        // 2차가공
        filters = filters?.filter(x => {
            let filter_go_sido = x?.go_sido;
            let filter_item = x?.item?.split(',') || [];
            let filter_unloading = x?.unloading?.split(',') || [];
            let filter_jeeip_license_type = x?.jeeip_license_type?.split(',') || null;
            let unloading = data?.unloading?.split(",");

            return (
                (filter_go_sido ? filter_go_sido === data?.go_sido : true) &&
                (filter_item?.includes(data?.item)) &&
                (filter_jeeip_license_type ? filter_jeeip_license_type?.includes(data?.license_type) : !data?.license_sell ) &&
                (unloading?.find(x => filter_unloading?.includes(x)))
            )
        })
       
    }

    filters?.map((x, i) => {
        
        this.alarmFunc({
            u_idx: x?.u_idx,
            alarm: {
                board: type,
                board_idx: data?.idx,
                title: "조건에 일치하는 매물이 등록되었습니다."
            }
        })

    })
   
    console.log('filter after' + type, filters?.length);
}


// 회원탈퇴
module.exports.leaveFunc = async (idx) => {

    if(!idx) return false;

    let nowDt = moment().format('YYYY-MM-DD HH:mm:ss');

    // 댓글 삭제
    await models.BOARD_COMMENT_TB.update(
        {
            delete_dt: nowDt,
        },
        {
            where: {
                u_idx: idx
            }
        }
    );
    // 지입글 삭제
    await models.BOARD_JEEIP_TB.update(
        {
            delete_dt: nowDt,
        },
        {
            where: {
                u_idx: idx
            }
        }
    );
    // 구인글 삭제
    await models.BOARD_JOB_TB.update(
        {
            delete_dt: nowDt,
        },
        {
            where: {
                u_idx: idx
            }
        }
    );
    // 구직글 삭제
    await models.BOARD_RECRUIT_TB.update(
        {
            delete_dt: nowDt,
        },
        {
            where: {
                u_idx: idx
            }
        }
    );
    // 게시글 삭제
    await models.BOARD_TB.update(
        {
            delete_dt: nowDt,
        },
        {
            where: {
                u_idx: idx
            }
        }
    );
    // 중고화물차 삭제
    await models.BOARD_TRUCK_TB.update(
        {
            delete_dt: nowDt,
        },
        {
            where: {
                u_idx: idx
            }
        }
    );

    // 탈퇴일 부여
    await models.USER_TB.update(
        {
            delete_dt: nowDt,
        },
        {
            where: {
                idx: idx
            }
        }
    );
    
    return true;
}

// 회원삭제(회원관련된 정보 DB에서 삭제)
module.exports.userDestroy = async (idx) => {

    if(!idx) return false;

    let user = await models.USER_TB.scope('front').findOne({
        raw: true,
        where: {
            idx: idx,
            delete_dt: {
                [Op.ne]: null
            }
        }
    });

    if(!user) {
        return false;
    }

    let nowDt = moment().format('YYYY-MM-DD HH:mm:ss');

    /* 회원과 관련된 모든정보 삭제 */
    await models.ALARM_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.CS_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.LIKE_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.PENALTY_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.POINT_CHARGE_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.POINT_EXCHANGE_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.POINT_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.REPORT_TB.destroy(
        {
            where: {
                [Op.or] : [
                    { u_idx: idx },
                    { target_idx: idx }
                ],
            }
        }
    );
    await models.MESSAGE_TB.destroy(
        {
            where: {
                [Op.or] : [
                    { u_idx: idx },
                    { target_idx: idx }
                ],
            }
        }
    );
    await models.CONSULTING_TB.destroy(
        {
            where: {
                [Op.or] : [
                    { u_idx: idx },
                    { target_idx: idx }
                ],
            }
        }
    );
    await models.USER_FILTER_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );

    // 게시판 관련
    await models.BOARD_COMMENT_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.BOARD_JEEIP_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.BOARD_JOB_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.BOARD_RECRUIT_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.BOARD_TB.destroy(
        {
            where: {
                u_idx: idx
            }
        }
    );
    await models.BOARD_TRUCK_TB.destroy(
        {
            where: {
                    u_idx: idx
            }
        }
    );
    /* 회원과 관련된 모든정보 삭제 끝 */


    // 회원테이블에서 삭제
    await models.USER_TB.destroy(
        {
            where: {
                idx: idx
            }
        }
    );
    
}

module.exports.logFunc = async (table, data) => {

    if(!table || !data) return;

    await models[table].create(data);
}


module.exports.getFileName = (url) => {
    
    let urls = url.split("/");
    return urls[urls.length - 1];
};


module.exports.common = () => {

    return {
        limit: 20,
        searchRange: 0,
        userTypeConsts: [
            {idx: 'kakao', title: '카카오'},
            {idx: 'naver', title: '네이버'},
        ],
        exchangeStatusConsts: [
            {idx: 1, title: '정산요청'},
            {idx: 2, title: '정산완료'},
            {idx: 99, title: '정산실패'},
        ],
        csStatusConsts: [
            {idx: 1, title: '미처리'},
            {idx: 99, title: '답변완료'},
        ],
        reportStatusConsts: [
            {idx: 1, title: '미처리'},
            {idx: 99, title: '처리완료'},
        ],
        boardStatusConsts: [
            {idx: 1, title: '진행중'},
            {idx: 2, title: '완료'},
            {idx: 99, title: '임시저장'},
        ],
        payPriceConsts: [
            {idx: 1, point: 11000, price: 10000},
            {idx: 2, point: 33000, price: 30000},
            {idx: 3, point: 55000, price: 50000},
            {idx: 4, point: 110000, price: 100000},
        ],

    };
}

module.exports.getOptions = async () => {

    const list = await models.OPTION_TB.findAll(
        {
            raw: true
        }
    );

    return {
        color_option: list?.find(x => x?.idx === 1)?.options?.split(','), // 차량색상
        paytype_option: list?.find(x => x?.idx === 2)?.options?.split(','), // 지급방식
        item_option: list?.find(x => x?.idx === 3)?.options?.split(','), // 운송품목
        unloading_option: list?.find(x => x?.idx === 4)?.options?.split(','), // 상하차방법
        options_option: list?.find(x => x?.idx === 5)?.options?.split(','), // 차량일반옵션
        etc_options_option: list?.find(x => x?.idx === 6)?.options?.split(','), // 차량기타옵션
        ton_option: ["0.5", "1", "1.2", "1.4", "1.5", "2.5", "3.5", "4", "4.5", "5", "5.5", "6.5", "7.5", "8.5", "9.5", "11", "12", "13", "14", "15", "16", "17", "18", "21", "23", "25", "27"], // 톤 수
        usage_option: ['자가용', '영업용', '개별화물', '개별용달', '기타'], // 차량용도
        axis_option: ['전축', '후축', '없음'], // 가변축
        transmission_option: ['오토', '수동', '기타'], // 변속기
        fuel_option: ['가솔린', '디젤', 'LPG', '전기', '기타'], // 연료형태
        license_option: ['개인넘버', '법인넘버'], // 넘버종류
        license_msg_option: ['개인 양도양수 가능', '회사와 협의후 양도양수 가능'], // 넘버종류별 메시지
        box_area_option: ['일반', '광폭', '기타'], // 적재함 넓이
        box_height_option: ['일반', '저상', '고상'], // 적재함 높이
        box_width_option: ['일반', '단축', '증축', '장축', '초장축', '극초장축'], // 적재함 길이
        age_option: ['무관', '65세 이하', '60세 이하', '55세 이하', '45세 이하', '40세 이하', '35세 이하', '30세 이하'], // 나이제한
        certificate_option: ['2종보통', '1종보통', '1종대형', '대형견인차', '소형견인차', '구난차', '건설기계조종사'], // 자격(면허증)
        worktype_option: ['면접후결정','정규직','계약직','스페어','알바','기타'], // 근무형태
        education_option: ['학력무관', '고등학교졸업', '대학졸업(2,3년)', '대학교졸업(4년)', '대학원', '석사졸업', '대학원', '박사졸업'], // 학력
        career_option: ['무관', '신입', '경력'], // 경력
        gender_option: ['남성', '여성', '무관'], // 성별
    };
}


module.exports.linkMaker = ({
    board,
    board_idx
}) => {

    const { WEB_DOMAIN } = process.env;

    if(!board || !board_idx) return '';

    let urls = WEB_DOMAIN;

    if(board === consts.boardTruckKey) {
        urls += `/usedCarInfo?idx=${board_idx}`;
    } else if(board === consts.boardJeeipKey) {
        urls += `/rentedCarInfo?idx=${board_idx}`;
    } else if(board === consts.boardRecruitKey) {
        urls += `/jobofferInfo?idx=${board_idx}`;
    } else if(board === consts.boardJobKey) {
        urls += `/jobsearchInfo?idx=${board_idx}`;
    } else if(board === consts.boardKey) {
        urls += `/board?idx=${board_idx}`;
    }

    return urls;
}


module.exports.adminScd = (req, res, next) => {
    
    const { ADMIN_SCD } = process.env;
    if(req.header('scd') !== ADMIN_SCD) {
        res.status(404).send("사이트에 연결할 수 없음");
        
    } else {
        next();
    }
}

module.exports.scd = (req, res, next) => {
    
    const { SCD, ADMIN_SCD } = process.env;
    if(req.header('scd') !== SCD && req.header('scd') !== ADMIN_SCD) {
        res.status(404).send("사이트에 연결할 수 없음");
    } else {
        next();
    }
}

module.exports.master = async (req, res, next) => {

    let { jwt } = req.body;

    const user = await models.USER_TB.scope([
        'active', 
        'front',  
    ]).findOne({
        raw: true,
        where: {
            idx: jwt
        }
    });

    if(user?.level !== 3) {
        // res.status(500).send({code: 99, msg: "권한이 없습니다."});
        this.sendError(req, res, {code: 99, msg: '권한이 없습니다.'});
    } else {
        req.body.user = {...user, penalty: user?.penalty?.split("|") };
        next();
    }
}


module.exports.front = async (req, res, next) => {

    let decoded = null;
    const token = req.headers.authorization;

    if (!token || token === 'null' || token === 'undefined') {
        this.sendError(req, res, {code: 1100, msg: '로그인이 필요합니다.'});
        return;
    }

    try {
        decoded = jwtUtil.verify(token, secret);
        let idx = decoded?.idx;

        const user = await models.USER_TB.scope([
            'active', 
            'front',
            'penaltyCheck'  
        ]).findOne({
            raw: true,
            where: {
                idx: idx
            }
        });
    
        if(!user) {
            // res.status(500).send({code: 99, msg: "로그인이 필요합니다."});
            this.sendError(req, res, {code: 1100, msg: '로그인이 필요합니다.'});
        } else if(user?.penalty_check > 0) {
            // res.status(500).send({code: 98, msg: "이용 제한 중입니다."});
            this.sendError(req, res, {code: 1000, msg: '이용 제한 중입니다.'});
        } else {
            req.body.user = user;
            next();

            models.USER_TB.update(
                {
                    login_dt: req.body.nowDt
                },
                {
                    where: {
                        idx: user.idx
                    }
                }
            )
        }

    } catch (err) {
        this.sendError(req, res, {code: 1100, msg: '로그인이 필요합니다.'});
    }
}

module.exports.frontNotCheck = async (req, res, next) => {

    let decoded = null;
    const token = req.headers.authorization;

    if (!token || token === 'null' || token === 'undefined') {
        next();
        return;
    }

    try {
        decoded = jwtUtil.verify(token, secret);
        let idx = decoded?.idx;

        const user = await models.USER_TB.scope([
            'active', 
            'front',
            'penaltyCheck'  
        ]).findOne({
            raw: true,
            where: {
                idx: idx
            }
        });
    
        if(!user) {
            next();
        } else if(user?.penalty_check > 0) {
            next();
        } else {
            req.body.user = user;
            next();

            models.USER_TB.update(
                {
                    login_dt: req.body.nowDt
                },
                {
                    where: {
                        idx: user.idx
                    }
                }
            )
        }

    } catch (err) {
        next();
    }
}


module.exports.masterMiddleware = (req, res, next) => {

    if(req.body?.grade < 10) {
        res.status(500).send("권한이 없습니다.");
    } else {
        next();
    }
}

module.exports.kakaoApi = async (type, sender) => {

    var axios = require('axios');
    const { KAKAO_KEY } = process.env;

    var api_url = 'https://dapi.kakao.com/';

    if(type === 'address') api_url += '/v2/local/search/address.json';

    var sender = {
        params: sender,
        headers: {
            Authorization: `KakaoAK ${KAKAO_KEY}`
        }
    }
        

    let result = "";

    await axios.get(api_url, sender).then((res)=>{
        if(type === 'address') result = res.data?.documents?.[0];
    }).catch(() => {
        
    })

    return result;
};

module.exports.sendSms = async (hp, content) => {

    var axios = require('axios');
    const { ALIGO_KEY, ALIGO_ID, ALIGO_HP } = process.env;

    var api_url = 'https://apis.aligo.in/send/';
    var sender = new URLSearchParams({
        key: ALIGO_KEY,
        user_id: ALIGO_ID,
        sender: ALIGO_HP,
        receiver: hp,
        msg: content,
    })
        
    let result = "";

    await axios.post(api_url, sender).then((res)=>{
        result = res?.data?.result_code;
    })

    return result;
};

module.exports.talkList = async (code=null) => {

    var axios = require('axios');
    const { ALIGO_KEY, ALIGO_SENDER_KEY, ALIGO_ID, ALIGO_HP } = process.env;

    var api_url = 'https://kakaoapi.aligo.in/akv10/template/list/';
    var params = {
        apikey: ALIGO_KEY,
        userid: ALIGO_ID,
        senderkey: ALIGO_SENDER_KEY  
    };
    if(code) params.tpl_code = code;

    var sender = new URLSearchParams(params);
        
    let result = "";

    await axios.post(api_url, sender).then(({ data })=>{
        if(data?.code !== 0) return;

        result = code ? data?.list?.[0] : data?.list;
    })

    return result;
};

module.exports.talkSend = async ({
    tpl_code,
    talk_list=[]
}) => {

    var axios = require('axios');
    const { ALIGO_KEY, ALIGO_SENDER_KEY, ALIGO_ID, ALIGO_HP } = process.env;

    var api_url = 'https://kakaoapi.aligo.in/akv10/alimtalk/send/';
    var params = {
        apikey: ALIGO_KEY,
        userid: ALIGO_ID,
        senderkey: ALIGO_SENDER_KEY,
        sender: ALIGO_HP,
        tpl_code: tpl_code,
        // testMode: 'Y'
    };

    for(var i = 0; i < talk_list?.length; i++) {
        params['receiver_' + (i+1)] = talk_list[i]?.receiver;
        params['subject_' + (i+1)] = talk_list[i]?.subject;
        params['message_' + (i+1)] = talk_list[i]?.message;
        if(talk_list[i]?.button) {
            params['button_' + (i+1)] = JSON.stringify(
                {
                    button: talk_list[i]?.button
                }
            )
        }
    }

    var sender = new URLSearchParams(params);
        
    await axios.post(api_url, sender).then(({ data })=>{
        
    })

    return;
};


module.exports.talkHistoryDetail = async ({
    mid
}) => {

    var axios = require('axios');
    const { ALIGO_KEY, ALIGO_SENDER_KEY, ALIGO_ID, ALIGO_HP } = process.env;

    var api_url = 'https://kakaoapi.aligo.in/akv10/history/detail/ ';
    var params = {
        apikey: ALIGO_KEY,
        userid: ALIGO_ID,
        mid: mid,
    };

    var sender = new URLSearchParams(params);
        
    let result = "";
    
    await axios.post(api_url, sender).then(({ data })=>{
        console.log('data', data);
        result = data;
    })

    return result;

};


module.exports.consultingTalkSend = async (idx) => {

    if(!idx) return;

    let consulting = await models.CONSULTING_TB.scope('user').findOne({
        where: {
            idx: idx
        }
    });

    if(!consulting) return;

    /** 카카오 알림톡 전송 */
    let template = await this.talkList('TT_9381');
    
    let msg = template?.templtContent;
    
    msg = msg?.replace("#{예약상담신청일시}", moment(consulting?.create_dt).format('YYYY.MM.DD HH시mm분'));
    msg = msg?.replace("#{이름}", consulting?.name);
    msg = msg?.replace("#{주소}", `${consulting?.sido} ${consulting?.sigungu}`);

    msg = msg?.replace("#{고객센터전화번호}", consts?.serviceCenterTel);
    msg = msg?.replace("#{고객센터이메일}", consts?.serviceCenterEmail);

    let button = template?.buttons?.map(x => {
        if(x?.linkType !== "WL") return x;

        let linkMo = x?.linkMo?.replace("#{웹링크}", "chajooin.com/mypageCalendar");
        let linkPc = x?.linkPc?.replace("#{웹링크}", "chajooin.com/mypageCalendar");
        return {...x, linkMo, linkPc }
    });

    let talk_one = {
        receiver: consulting?.targetUser?.hp,
        subject: template?.templtName,
        message: msg,
        button: button
    }
    await this.talkSend({
        tpl_code: template?.templtCode,
        talk_list: [talk_one]
    })
    /** 카카오 알림톡 전송 끝 */
};


module.exports.sendPush = async (token, title, msg, push_data) => {
    return;
    //  https://ssmuniverse.page.link/ycjPG6Te7D3PTZGy9

    let message = {
        token: token,
        notification: {
            title: title,
            body: msg,
        },
        data: push_data,
        apns: {
            headers: {},
            payload: {
                aps: {
                    sound: 'default',
                    'content-available': 1
                }
            }
        }
    };

    console.log(message);

    fb_admin.messaging().send(message).then((response) => {
        console.log('Successfully sent message: : ', response)
    }).catch((err) => {
        console.log('Error Sending message!!! : ', err)
    })
};

module.exports.sendPushArr = async (tokens, title, msg, push_data) => {
    return;
    let message = {
        tokens: tokens,
        notification: {
            title: title,
            body: msg,
        },
        data: push_data,
        apns: {
            headers: {},
            payload: {
                aps: {
                    sound: 'default',
                    'content-available': 1
                }
            }
        }
    }
    // console.log(message);
    fb_admin.messaging().sendMulticast(message).then((response) => {
        console.log('Successfully sent message: : ', response)
    }).catch((err) => {
        console.log('Error Sending message!!! : ', err)
    })
};


module.exports.sendMail = async (email, title, body) => {

    var axios = require('axios');
    var mailer = require('nodemailer');
    const { NODEMAILER_USER, NODEMAILER_PASS } = process.env;
    
    console.log({
        user: NODEMAILER_USER,  // 네이버 아이디
        pass: NODEMAILER_PASS,  // 네이버 비밀번호
    })
    
    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: NODEMAILER_USER,  // 네이버 아이디
            pass: NODEMAILER_PASS,  // 네이버 비밀번호
        },
    });

    
    const mailOptions = {
        from: NODEMAILER_USER,  // 네이버 아이디
        to: email,  // 수신자 아이디
        subject: title,
        html: body,
    };
    let result = false;
    
    // 두번째 인자로 콜백 함수를 넣어주면 await x
    await transporter.sendMail(mailOptions).then((info) => {
        console.log('info', info.response);
        result = true;
    }).catch((err) => {
        console.log('err', err);
        result = false;
    })
    
    return result;
};

module.exports.numFormat = (num, cut=0) => {
    if (num) {
        if(cut) num = Math.floor( num / cut) * cut; // 1000 = 백원단위 절삭
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return 0;
    }
};

module.exports.findJson = (object, val) => {
    let title = "정보없음";

    object.forEach((one, index) => {
        if((one.idx*1) === (val*1)) {
            title = one.title;
        }
    })
    return title;
};

module.exports.patternSpcInstar = async (value) => {
    // 인스타용 허용글자
    let pattern = /[^0-9a-zA-Z._]+/g; // 인스타용 허용글자
    return pattern.test(value);
};
module.exports.patternNick = async (nick) => {
     /**
        1. 한글 최소 2글자 이상 최대 8글자 제한
        2. 영문 최소 2글자 이상 최대 15글자 제한
        3. 한글 + 영문 + 숫자 혼용 최대 15글자 제한
        4. 숫자만 사용 최대 8글자 제한
        5. 자음,모음,특수기호 허용 x
    */

    let regx = /[^0-9a-zA-Z가-힣]+/g; // 모음과 자음은 제외

    if(regx.test(nick) || nick.length < 3 || nick.length > 15) return true;

    let regxKor = /[가-힣]/; // 한글
    let regxEng = /[a-zA-Z]/; // 영어
    let regxNum = /[0-9]/; // 숫자

    let korCheck = regxKor.test(nick);
    let engCheck = regxEng.test(nick);
    let numCheck = regxNum.test(nick);

    // 영어만 작성한경우
    if((!korCheck && engCheck && !numCheck)) {
        return nick.length > 15 ? true : false;
    } 

    // 나머지 
    return nick.length > 8 ? true : false;
};
module.exports.regPassword = async (value) => {
    let result = [true, '0000'];
    let patternNum = /[0-9]/;
    let patternSpc = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim; // 특수문자 모두
    let patternEng = /[a-zA-Z]/;
    
    if(value.length < 7 || value.length > 20) return [false, '비밀번호는 7~20자리 사이로 입력해주세요.'];
    if(!patternNum.test(value)) return [false, '비밀번호에는 숫자가 포함되어야 합니다.'];
    if(!patternSpc.test(value)) return [false, '비밀번호에는 특수문자가 포함되어야 합니다.'];
    if(!patternEng.test(value)) return [false, '비밀번호에는 영문이 포함되어야 합니다.'];

    return result
};


module.exports.passwordEncrypt = async (password) => {

    if(!password) return '';

    const pwR = await sequelize.query(`SELECT password(:pw) as pw`, { 
        plain: true, 
        raw: true,
        replacements: { pw: password },
        type: QueryTypes.SELECT
    });

    return pwR?.pw;

};


module.exports.emailMasking = (email) => {

    if(!email) return '';

    try {
        let first = email.split('@')[0]; 
        let second = email.split('@')[1]; 
        let dm = second.split('.')[0];
    
        let len = email.split('@')[0].length < 3 ? email.split('@')[0].length : 2;
    
        let em = email.replace(new RegExp('.(?=.{0,' + len + '}@)', 'g'), '*');
        // em = em.replace(dm, '*'.repeat(dm.length));
    
        return em;
    } catch (e) {
        return "";
    }
    
};

module.exports.adFunc = async () => {

    let nowDt = moment().format('YYYY-MM-DD HH:mm:ss');

    await sequelize.query(`
        UPDATE 
            CARMASTER.BOARD_TRUCK_TB 
        SET 
            ad = 0
        WHERE ad = 1
        AND end_dt < '${nowDt}'
    `);
    await sequelize.query(`
        UPDATE 
            CARMASTER.BOARD_JEEIP_TB 
        SET 
            ad = 0
        WHERE ad = 1
        AND end_dt < '${nowDt}'
    `);

};

module.exports.recruitEndFunc = async () => {

    let nowDt = moment().format('YYYY-MM-DD');

    let rt = await sequelize.query(`
        UPDATE 
            CARMASTER.BOARD_RECRUIT_TB 
        SET 
            status = 2
        WHERE status = 1
        AND deadline_type = 3
        AND deadline < '${nowDt}'
    `);
};


// 일반결제 페이지 요청
module.exports.payRequest = async ( param ) => {

    var axios = require('axios');
    const { WEB_DOMAIN, PAYLETTER_ID, PAYLETTER_KEY, PAYLETTER_TEST_KEY } = process.env;

    // let key = PAYLETTER_TEST_KEY; // 테스트 결제용 키
    // let client_id = 'pay_test'; // 테스트 결제용 ID
    // let pay_url = 'https://testpgapi.payletter.com/';

    let key = PAYLETTER_KEY; // 실 결제용 키
    let client_id = PAYLETTER_ID; // 실 결제용 ID
    let pay_url = 'https://pgapi.payletter.com/';

    let result = null;
   
    await axios({
        method: "post", // 요청 방식
        url: pay_url + "v1.0/payments/request", // 요청 주소
        headers : {
            'Content-Type' : "application/json",
            'Authorization' : `PLKEY ${key}`
        },
        data: {
            pgcode : "creditcard",
            client_id : client_id,
            user_id : param?.user_id,
            user_name : param?.user_name,    
            service_name : param?.service_name,    
            order_no : param?.order_no,
            amount : param?.amount,
            product_name : param?.product_name,    
            autopay_flag : param?.autopay_flag,    
            receipt_flag : "Y",
            custom_parameter : param?.custom_parameter,    
            callback_url : param?.callbackUrl,
            return_url : WEB_DOMAIN + '/payLoading',
            cancel_url : WEB_DOMAIN + '/payFail'
        }// 제공 데이터(body)
    }).then(( res ) => {
        console.log('data', res?.data);
        result = {
            error: false,
            data: res?.data
        };
    }).catch((err) => {
        console.log('err', err?.response?.data);
        result = {
            error: true,
            data: err?.response?.data
        };
    });

    return result;
};
