require('dotenv').config();

const moment = require('moment');
const models = require('../models');
const { Op } = require("sequelize");
const { sequelize } = require("../models/index"); 
const { dummy, issuedummy } = require("./utils");

const isJson = (str) => {
    try {
        var json = JSON.parse(str);
        return (typeof json === 'object');
    } catch (e) {
        return false;
    }
}

module.exports.userReturn = async (user="") => {

    let row = user;
    
    return row;
}

// 한 매물에 대한 AI 고객매칭 정보 리턴
module.exports.customerReturn = async ({
    user,
    compony,
    item, 
    customer
}) => {

    let row = {};

    let mediation = await models.MEDIATION_TB.findOne({
        raw: true,
        where: {
            [Op.or] : [
                { u_idx: item?.u_idx },
                { u_idx: customer?.u_idx }
            ],
            [Op.or] : [
                { target_idx: item?.u_idx },
                { target_idx: customer?.u_idx }
            ],
            i_idx: item?.idx,
            c_idx: customer?.idx
        }
    });

    let send = await models.CUSTOMER_ITEM_TB.scope('item').findAll({
        where: {
            c_idx: customer?.idx
        }
    });
    let sendList = customer?.u_idx === user?.idx ? send : send?.filter(x => x?.u_idx === user?.idx );

    let returns = {
        state: false,
        idx: customer?.idx,
        u_idx: customer?.u_idx,
        c_idx: customer?.c_idx,
        user: customer?.user,
        compony: customer?.compony
    };

    if(item?.u_idx === customer?.u_idx) { // 내가 담당자인 것들
        returns = {...customer, state: true };
    } else if(customer?.u_idx !== item?.u_idx && customer?.c_idx === item?.c_idx) { // 내가 담당자가 아니고 같은 소속인것들
        if(compony?.share_option === 1) returns = {...customer, state: true };
    } else if(mediation?.status === 2) { // 다른 소속이지만 공동중개 승인된경우
        returns = {...customer, state: true };
    }

    row = {
        ...returns,

        send: send?.length, 
        sendList: sendList?.map(x => x?.item),
        thisSend: send?.find(x => x?.i_idx === item?.idx) ? true : false, 
        mediation: mediation
    };

    return row;
}



// 한 고객에 대한 AI 매물매칭 정보 리턴
module.exports.itemReturn = async ({
    user,
    compony,
    item, 
    customer
}) => {

    let row = {};

    let mediation = await models.MEDIATION_TB.findOne({
        raw: true,
        where: {
            [Op.or] : [
                { u_idx: item?.u_idx },
                { u_idx: customer?.u_idx }
            ],
            [Op.or] : [
                { target_idx: item?.u_idx },
                { target_idx: customer?.u_idx }
            ],
            i_idx: item?.idx,
            c_idx: customer?.idx
        }
    });

    let send = await models.CUSTOMER_ITEM_TB.scope('customer').findAll({
        where: {
            i_idx: item?.idx
        }
    });
    let sendList = item?.u_idx === user?.idx ? send : send?.filter(x => x?.u_idx === user?.idx );

    let returns = {
        state: false,
        idx: item?.idx,
        u_idx: item?.u_idx,
        c_idx: item?.c_idx,
        user: item?.user,
        compony: item?.compony
    };

    if(item?.u_idx === customer?.u_idx) { // 내가 담당자인 것들
        returns = {...item, state: true };
    } else if(customer?.u_idx !== item?.u_idx && customer?.c_idx === item?.c_idx) { // 내가 담당자가 아니고 같은 소속인것들
        if(compony?.share_option === 1) returns = {...item, state: true };
    } else if(mediation?.status === 2) { // 다른 소속이지만 공동중개 승인된경우
        returns = {...item, state: true };
    }

    row = {
        ...returns,

        send: send?.length, 
        sendList: sendList?.map(x => x?.customer),
        thisSend: send?.find(x => x?.c_idx === customer?.idx) ? true : false, 
        mediation: mediation
    };

    return row;
}


module.exports.alarmReturn = (data) => {
    let row = data;

    row.detail = isJson(row?.detail) ? JSON.parse(row?.detail) : null;

    return row;
}



module.exports.columsReturn = () => {
    /* 
        칼럼 옵션들 
        size: 칼럼 가로크기
        default: 기본값으로 노출
        detail: 상세페이지에서 노출
        infowindow: 인포윈도우에서 노출
        leasing: Leasing 상세페이지에서 노출
        admin: 관리자에게만 노출
        order: 정렬 가능한 칼럼
        format: 데이터 형식
        unit: 단위
        formatDate: 날짜 포맷 형식
        insertFormat: DB등록시 포맷 형식
        inputFormat: 입력시 포맷 형식
        alarmMsg: 값 변경이 있을시 전송할 알림메시지
    */
    return [
        {idx: 1, size: 'm', key: "item_A", comment: "관리_허가대장_PK", default: true},
        {idx: 2, size: 'xl', key: "item_B", comment: "대지_위치", default: true, infowindow:true, detail: true, leasing: true, order: true},
        {idx: 3, size: 'l', key: "item_C", comment: "대권역", detail: true, order: true},
        {idx: 4, size: 'l', key: "item_D", comment: "권역", detail: true, order: true},
        {idx: 5, size: 'm', key: "item_E", comment: "주소1", order: true},
        {idx: 6, size: 'm', key: "item_F", comment: "주소2", order: true},
        {idx: 7, size: 'm', key: "item_G", comment: "주소3", order: true},
        {idx: 8, size: 'm', key: "item_H", comment: "켄달여부"},

        {idx: 9, size: 'm', key: "item_I", comment: "건축허가월", order: true, infowindow:true, detail: true, formatDate: 'YYYY-MM-DD', inputFormat: 'num', alarmMsg: '“물건명”이(가) 건축허가를 득했습니다.'},
        {idx: 10, size: 'm', key: "item_J", comment: "착공", order: true, infowindow:true, formatDate: 'YYYY-MM-DD', inputFormat: 'num', alarmMsg: '“물건명”이(가) 실제 착공했습니다.'},
        {idx: 11, size: 'm', key: "item_K", comment: "사용승인월", order: true, infowindow:true, formatDate: 'YYYY-MM-DD', inputFormat: 'num', alarmMsg: '“물건명”이(가) 사용승인을 득했습니다.'},

        {idx: 12, size: 'l', key: "item_L", comment: "준공예정(yyyymm)", default: true, infowindow:true, detail: true, formatDate: 'YY-MM', inputFormat: 'num'},
        {idx: 13, size: 'm', key: "item_M", comment: "사용승인연도"},
        {idx: 14, size: 'l', key: "item_N", comment: "연면적(평)", default: true, infowindow: true, order: true, detail: true, format: 'int', unit: '평', insertFormat: 'int', inputFormat: 'num'},
        {idx: 15, size: 'xl', key: "item_O", comment: "건물_명", detail: true, leasing: true},
        {idx: 16, size: 'l', key: "item_P", comment: "투자자/소유주", default: true, infowindow:true, detail: true, order: true},
        {idx: 17, size: 'l', key: "item_Q", comment: "자산운용사", default: true, infowindow:true, detail: true, order: true},
        {idx: 18, size: 'l', key: "item_R", comment: "시공사", detail: true},
        {idx: 19, size: 'l', key: "item_S", comment: "설계사무소", detail: true},
        {idx: 20, size: 'm', key: "item_T", comment: "PM", default: true, detail: true},
        {idx: 21, size: 'm', key: "item_U", comment: "LM", default: true, detail: true},
        {idx: 22, size: 'm', key: "item_V", comment: "Dry_Cold", default: true, infowindow:true },
        {idx: 23, size: 'm', key: "item_W", comment: "Cold %", default: true, infowindow:true, format: 'int', unit: '%', inputFormat: 'float'},
        {idx: 24, size: 'm', key: "item_X", comment: "전용률(%)", detail: true, format: 'int', unit: '%', inputFormat: 'float'},
        {idx: 25, size: 'm', key: "item_Y", comment: "Latitude", admin: true, inputFormat: 'coord'},
        {idx: 26, size: 'm', key: "item_Z", comment: "Longitude", admin: true, inputFormat: 'coord'},
        {idx: 27, size: 'm', key: "item_AA", comment: "상온임대료", leasing: true},
        {idx: 28, size: 'm', key: "item_AB", comment: "상온관리비", leasing: true},
        {idx: 29, size: 'm', key: "item_AC", comment: "상온 RF"},
        {idx: 30, size: 'm', key: "item_AD", comment: "저온임대료", leasing: true},
        {idx: 31, size: 'm', key: "item_AE", comment: "저온관리비", leasing: true},
        {idx: 32, size: 'm', key: "item_AF", comment: "저온 RF"},
        {idx: 33, size: 'm', key: "item_AG", comment: "시군구_코드"},
        {idx: 34, size: 'm', key: "item_AH", comment: "법정동_코드"},
        {idx: 35, size: 'm', key: "item_AI", comment: "대지_구분_코드"},
        {idx: 36, size: 'm', key: "item_AJ", comment: "번"},
        {idx: 37, size: 'm', key: "item_AK", comment: "지"},
        {idx: 38, size: 'm', key: "item_AL", comment: "특수지_명", detail: true},
        {idx: 39, size: 'm', key: "item_AM", comment: "블록"},
        {idx: 40, size: 'm', key: "item_AN", comment: "로트"},
        {idx: 41, size: 'm', key: "item_AO", comment: "지목_코드_명", detail: true},
        {idx: 42, size: 'm', key: "item_AP", comment: "지역_코드_명", detail: true},
        {idx: 43, size: 'l', key: "item_AQ", comment: "지구_코드_명", detail: true},
        {idx: 44, size: 'l', key: "item_AR", comment: "구역_코드_명", detail: true},
        {idx: 45, size: 'm', key: "item_AS", comment: "지목코드"},
        {idx: 46, size: 'm', key: "item_AT", comment: "지역_코드"},
        {idx: 47, size: 'm', key: "item_AU", comment: "지구_코드"},
        {idx: 48, size: 'm', key: "item_AV", comment: "구역_코드"},
        {idx: 46, size: 'm', key: "item_AW", comment: "건축_구분_코드"},
        {idx: 47, size: 'm', key: "item_AX", comment: "건축_구분_코드_명"},
        {idx: 48, size: 'm', key: "item_AY", comment: "대지_면적(㎡)", order: true, format: 'int', unit: '㎡', inputFormat: 'float'},
        {idx: 49, size: 'm', key: "item_AZ", comment: "건축_면적(㎡)", order: true, format: 'int', unit: '㎡', inputFormat: 'float'},
        {idx: 50, size: 'm', key: "item_BA", comment: "건폐_율(%)", detail: true, format: 'int', unit: '%', inputFormat: 'float'},
        {idx: 51, size: 'm', key: "item_BB", comment: "연면적(㎡)", order: true, detail: true, format: 'int', unit: '㎡', inputFormat: 'float'},
        {idx: 52, size: 'l', key: "item_BC", comment: "용적률 산정 연면적(㎡)", order: true, format: 'int', unit: '㎡', inputFormat: 'float'},
        {idx: 53, size: 'm', key: "item_BD", comment: "용적률(%)", detail: true, format: 'int', unit: '%', inputFormat: 'float'},
        {idx: 54, size: 'm', key: "item_BE", comment: "대지_면적(평)", order: true, detail: true, format: 'int', unit: '평', insertFormat: 'int', inputFormat: 'float'},
        {idx: 55, size: 'm', key: "item_BF", comment: "건축_면적(평)", order: true, detail: true, format: 'int', unit: '평', insertFormat: 'int', inputFormat: 'float'},
        {idx: 56, size: 'm', key: "item_BG", comment: "주_건축물_수", detail: true},
        {idx: 57, size: 'm', key: "item_BH", comment: "부속_건축물_동_수"},
        {idx: 58, size: 'm', key: "item_BI", comment: "주_용도_코드"},
        {idx: 59, size: 'm', key: "item_BJ", comment: "주_용도_코드_명"},
        {idx: 60, size: 'm', key: "item_BK", comment: "세대_수(세대)"},
        {idx: 61, size: 'm', key: "item_BL", comment: "호_수(호)"},
        {idx: 62, size: 'm', key: "item_BM", comment: "가구_수(가구)"},
        {idx: 63, size: 'm', key: "item_BN", comment: "총_주차_수"},
        {idx: 64, size: 'm', key: "item_BO", comment: "착공_예정_일", order: true, formatDate: 'YYYY-MM-DD', inputFormat: 'num'},
        {idx: 65, size: 'm', key: "item_BP", comment: "착공_연기_일", order: true, formatDate: 'YYYY-MM-DD', inputFormat: 'num'},
        {idx: 66, size: 'm', key: "item_BQ", comment: "생성_일자", order: true, formatDate: 'YYYY-MM-DD', inputFormat: 'num'}
    ]
}



module.exports.leasingColumsReturn = () => {
   /* 
        칼럼 옵션들 
        size: 칼럼 가로크기
        default: 기본값으로 노출
        detail: 상세페이지에서 노출
        order: 정렬 가능한 칼럼
        format: 데이터 형식
        unit: 단위
        formatDate: 날짜 포맷 형식
        insertFormat: DB등록시 포맷 형식
        inputFormat: 입력시 포맷 형식
    */
    return [
        {idx: 1, size: 'm', key: "item_A", comment: "관리_허가대장_PK"},
        {idx: 2, size: 'm', key: "item_B", comment: "Leasing_PK", order: true, insertFormat: 'int'},
        {idx: 3, size: 'xl', key: "item_C", comment: "대지_위치", default: true, detail: true, order: true},
        {idx: 4, size: 'l', key: "item_D", comment: "연면적(평)", default: true, order: true, detail: true, format: 'int', unit: '평', insertFormat: 'int'},
        {idx: 5, size: 'm', key: 'item_E', comment: "유효/무효 (1/0)", },
        {idx: 6, size: 'm', key: 'item_F', comment: "층별", },
        {idx: 7, size: 'm', key: 'item_G', comment: "임차인", },
        {idx: 8, size: 'm', key: 'item_H', comment: "화주사", },
        {idx: 9, size: 'm', key: 'item_I', comment: "업종", },
        {idx: 10, size: 'm', key: 'item_J', comment: "보세여부", },
        {idx: 11, size: 'm', key: 'item_K', comment: "층고(m)"},
        {idx: 12, size: 'm', key: 'item_L', comment: "설비", },
        {idx: 13, size: 'm', key: 'item_M', comment: "상온/저온", },
        {idx: 14, size: 'm', key: 'item_N', comment: "NLA(Sqm)", order: true, format: 'int', unit: '㎡', inputFormat: 'float'},
        {idx: 15, size: 'm', key: 'item_O', comment: "NLA(Py)", order: true, format: 'int', unit: '평', inputFormat: 'float' },
        {idx: 16, size: 'm', key: 'item_P', comment: "GFA(Sqm)", order: true, format: 'int', unit: '㎡', inputFormat: 'float'},
        {idx: 17, size: 'm', key: 'item_Q', comment: "GFA(Py)", order: true, format: 'int', unit: '평', inputFormat: 'float' },
        {idx: 18, size: 'm', key: 'item_R', comment: "보증금", order: true, format: 'int', unit: '원', inputFormat: 'num'},
        {idx: 19, size: 'm', key: 'item_S', comment: "평당 보증금", order: true, format: 'int', unit: '원', inputFormat: 'num'},
        {idx: 20, size: 'm', key: 'item_T', comment: "월 상온임대료", order: true, format: 'int', unit: '원', inputFormat: 'num'},
        {idx: 21, size: 'm', key: 'item_U', comment: "월 상온관리비", order: true, format: 'int', unit: '원', inputFormat: 'num'},
        {idx: 22, size: 'm', key: 'item_V', comment: "평당 상온임대료", order: true, format: 'int', unit: '원', inputFormat: 'num'},
        {idx: 23, size: 'm', key: 'item_W', comment: "평당상온관리비", order: true, format: 'int', unit: '원', inputFormat: 'num'},
        {idx: 24, size: 'm', key: 'item_X', comment: "월 저온임대료", order: true, format: 'int', unit: '원', inputFormat: 'num'},
        {idx: 25, size: 'm', key: 'item_Y', comment: "월 저온관리비", order: true, format: 'int', unit: '원', inputFormat: 'num'},
        {idx: 26, size: 'm', key: 'item_Z', comment: "평당 저온임대료", order: true, format: 'int', unit: '원', inputFormat: 'num'},
        {idx: 27, size: 'm', key: 'item_AA', comment: "평당 저온관리비", order: true, format: 'int', unit: '원', inputFormat: 'num'},
        {idx: 28, size: 'm', key: 'item_AB', comment: "상온 Net-effective", },
        {idx: 29, size: 'm', key: 'item_AC', comment: "저온 Net-effective", },
        {idx: 30, size: 'm', key: 'item_AD', comment: "임대개시", },
        {idx: 31, size: 'm', key: 'item_AE', comment: "임대만기", },
        {idx: 32, size: 'm', key: 'item_AF', comment: "Fit", },
        {idx: 33, size: 'm', key: 'item_AG', comment: "RF", },
        {idx: 34, size: 'm', key: 'item_AH', comment: "TI", },
        {idx: 35, size: 'm', key: 'item_AI', comment: "인상", }
    ]
}

module.exports.transactionColumsReturn = () => {
    /* 
        칼럼 옵션들 
        size: 칼럼 가로크기
        default: 기본값으로 노출
        detail: 상세페이지에서 노출
        order: 정렬 가능한 칼럼
        format: 데이터 형식
        unit: 단위
        formatDate: 날짜 포맷 형식
        insertFormat: DB등록시 포맷 형식
        inputFormat: 입력시 포맷 형식
    */
    return [
        {idx: 1, size: 'm', key: "item_A", comment: "관리_허가대장_PK"},
        // {idx: 2, size: 'xl', key: "item_B", comment: "대지_위치", detail: true, order: true},
        // {idx: 3, size: 'l', key: "item_C", comment: "연면적(평)", order: true, detail: true, format: 'int', unit: '평', insertFormat: 'int'},
        // {idx: 4, size: 'm', key: 'item_D', comment: "유효/무효 (1/0)", },
        {idx: 5, size: 'm', key: 'item_E', comment: "거래날짜", default: true, inputFormat: 'num'},
        // {idx: 6, size: 'm', key: 'item_F', comment: "거래분기"},
        // {idx: 7, size: 'm', key: 'item_G', comment: "거래년도"},
        {idx: 8, size: 'm', key: 'item_H', comment: "거래 Type", default: true},
        {idx: 9, size: 'l', key: 'item_I', comment: "거래금액", default: true, format: 'int', unit: '억원', inputFormat: 'num'},
        {idx: 10, size: 'l', key: 'item_J', comment: "평당 거래 금액", default: true, format: 'int', unit: '만원', insertFormat: 'int', inputFormat: 'num'},
        {idx: 11, size: 'm', key: 'item_K', comment: "Cap Rate", default: true},
        {idx: 12, size: 'm', key: 'item_L', comment: "대출", default: true},
        {idx: 13, size: 'm', key: 'item_M', comment: "매도자", default: true},
        {idx: 14, size: 'm', key: 'item_N', comment: "매수자", default: true},
    ]
}


module.exports.leasingReturn = async (data) => {
    /* 
        숫자형 칼럼들 변환시켜서 Return
    */
    let returnData = {
        ...data,
        item_B: data?.item_B * 1,
        item_D: data?.item_D * 1,
        item_N: data?.item_N * 1,
        item_O: data?.item_O * 1,
        item_P: data?.item_P * 1,
        item_Q: data?.item_Q * 1,
        item_R: data?.item_R * 1,
        item_S: data?.item_S * 1,
        item_T: data?.item_T * 1,
        item_U: data?.item_U * 1,
        item_V: data?.item_V * 1,
        item_W: data?.item_W * 1,
        item_X: data?.item_X * 1,
        item_Y: data?.item_Y * 1,
        item_Z: data?.item_Z * 1
       
    };

    return returnData;
}



module.exports.projectReturn = async (project={}) => {

    const dataProcessFunc = (data) => {
        
        let row = data;

        row.briefing = row.briefing || '';
        row.progress = isJson(row.progress) ? JSON.parse(row.progress) : [];
        row.work = isJson(row.work) ? JSON.parse(row.work) : [];
        row.issue = isJson(row.issue) ? JSON.parse(row.issue) : issuedummy();

        row.users = row?.users?.length > 0 ? row.users.map((x, i) => {
            return {...x.USER_TB, password: ''}
        }) : [];

        row.publishs = row?.publishs?.length > 0 ? row.publishs.map((x, i) => {
            return {
                idx: x.idx,
                briefing: x.briefing || '',
                progress: isJson(x.progress) ? JSON.parse(x.progress) : [],
                work: isJson(x.work) ? JSON.parse(x.work) : [],
                issue: isJson(x.issue) ? JSON.parse(x.issue) : issuedummy(),
                create_dt: x.create_dt
            }
        }) : [];

        return row;
    }

    let returnData = project;

    if(Array.isArray(returnData)) {
        for(let i=0; returnData.length > i; i++) {

            returnData[i] = dataProcessFunc(returnData[i]);
            // returnData[i] = dataProcessFunc(returnData[i]);
        }
        
    } else {
       
        returnData = dataProcessFunc(returnData);
        // returnData = dataProcessFunc(returnData);
    }

    return returnData;
}
