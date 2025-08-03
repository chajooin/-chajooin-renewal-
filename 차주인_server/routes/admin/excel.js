const express = require('express');
const router = express.Router();
const cors = require('cors');
const fs = require('fs');
const csv = require('fast-csv');
const Papa = require('papaparse');
const moment = require('moment');

const app = express();
const { uuidv4, s3Upload, s3Select, s3SelectBuffer, s3Delete, send, common, scd, adminScd, alarmFunc, masterMiddleware, getFileName, sendSms, nice, kakaoApi } = require('../../service/utils.js');
const { sign, verify, refresh } = require('../../service/jwt.js');
const { userReturn, columsReturn, leasingColumsReturn, itemReturn, leasingReturn } = require('../../service/returns.js');

const models = require('../../models');
const { sequelize } = require("../../models/index"); 
const { Op } = require("sequelize");

router.use(adminScd);
router.use(verify);

/* 물류센터 엑셀 업로드  */
router.post('/uploadItemTest', async (req, res) => {
    console.log('uploadItemTest IN');

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }

    let { sub1Colums } = common();

    const iconv = require('iconv-lite');

    let dirpath = '/var/www/html/에이피링스/excel/';

    Papa.parse(fs.createReadStream(dirpath + 'code_test1.csv'), {
        header: true,
        step: function(row) {
            console.log("Row:", row.data);
        },
        complete: function() {
            console.log("All done!");
        }
    });

    // fs.createReadStream(dirpath + 'sub_list_1_test3.csv')
    // .pipe(csv.parse({ headers: false }))
    // .on('error', error => {
    //     console.error(error)
    // })
    // .on('data', row => {
    //     // const utf8String = iconv.decode(row, 'utf8');
    //     console.log("UTF8-----");
    //     console.log(row?.[0]);
        
    // })
    // .on('end', () => {
    //     console.log('end');
    // });

    // readStream.on('data', (data) => {
    //     const utf8String = iconv.decode(data, 'utf8');

    //     console.log("UTF8-----");
    //     console.log(utf8String);
    // });

    // fs.readFile('/var/www/html/에이피링스/excel/sub_list_1.csv', (err, buffer) => {
    //     if (err) {
    //         console.log('err', err);
    //         return;
    //     }

    //     console.log("CP949----");
    //     console.log(buffer);

    //     const utf8String = iconv.decode(buffer, 'cp949');

    //     console.log("UTF8-----");
    //     console.log(utf8String);
    // });

    send(req, res, rt);
});



/* 매물정보 엑셀 업로드  */
router.post('/uploadItem', async (req, res) => {

    const axios = require("axios");
    const XLSX = require("xlsx");
    const iconv = require('iconv-lite');
    
    let { idx, excel, jwt, ip } = req.body;
    let { category_2_OptionConsts } = common();

    console.log('excel/uploadItem => ', {jwt, ip});

    let rt = {
        ok: true,
        msg: '',
        result: {}
    }


    if(!excel?.base || !excel?.ext) {
        rt.ok = false;
        rt.msg = '올바른 엑셀파일이 아닙니다.';
        send(req, res, rt);
        return;
    }

    const user = await models.USER_TB.scope([
        'front',  
        'compony'
    ]).findOne({
        where: {
            idx: idx || 0
        }
    });

    if(!user) {
        rt.ok = false;
        rt.msg = '회원정보가 없습니다.';
        send(req, res, rt);
        return;
    }

    let urls = await s3Upload(excel?.base, 'excel', "", excel?.ext);
    let sign_urls = await s3Select(urls, 'test!.' + excel?.ext);

    let test = await s3SelectBuffer(urls);
    console.log(sign_urls);

    let alarm_list = [];

    console.log('sign_urls', sign_urls);

    const options = { 
        url: sign_urls,
        // url: 'https://esr-tests3.s3.ap-northeast-2.amazonaws.com/excel/a09702ca-9e0e-49e6-9dec-c357a89dbd6e.xlsx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQ3RAMZS5GK3RAM6R%2F20240105%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20240105T130224Z&X-Amz-Expires=600&X-Amz-Signature=9eeaece7cb5c4ba5291fcdbde4fcdb6fb8b1826f784a9ad18880d0808dd656ff&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22test%21.xlsx%22%3B%20filename%2A%3DUTF-8%27%27test%21.xlsx',
        responseType: "arraybuffer"
    }
    let axiosResponse = await axios(options);


    // const utf8 = iconv.decode(axiosResponse.data, 'utf8');
    // utf8?.split('\n')?.map((x, i) => {
    //     let row = x?.split('|');

    //     if(row?.length < 2) return;
        
    //     let arr = {};
    //     row?.map((xx, ii) => {
    //         let c = sub1Colums?.find((item, index) => index === ii)?.key;

    //         arr[c] = xx?.replace('\r', '');
    //     })
    //     console.log(arr);
    // })
    
    // send(req, res, rt);
    // return;

    // rt.result = urls;
    const workbook = XLSX.read(axiosResponse.data, { type: 'buffer' });
    // console.log('workbook.Sheets', workbook.Sheets[0]);

    let worksheets = workbook.SheetNames.filter((item, index) => index === 0).map((sheetName, index) => {
        return { sheetName, data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {blankrows: true}) };
    });
    
    let datas = worksheets?.[0]?.data;
    
    // Object.entries(datas?.[0]).map(([key, value]) => {
    //     console.log("`item_"+ key +"` varchar(255) DEFAULT '' COMMENT '"+value+"',");
    // })

    // console.log("json:\n", JSON.stringify(worksheets), "\n\n");
    // console.log("업로드 종료!", datas);
    
    datas?.map(async (x, i) => {

        /** 카카오 주소검색 결과로 코드생성 및 좌표값 구하기 */
        let addr_search = `${x?.['시도'] || ''} ${x?.['시군구'] || ''} ${x?.['읍면동'] || ''} ${x?.['지번'] || ''}`;
        
        let api_data = await kakaoApi('address', {
            query: addr_search,
            analyze_type: 'exact'
        })

        // console.log('api_data', api_data);
        if(!api_data || !api_data?.address?.b_code) {
            return;
        }

        let p_code = api_data?.address?.b_code;
        
        p_code += api_data?.address?.mountain_yn === 'Y' ? "1" : "0";
        p_code += api_data?.address?.main_address_no?.padStart(4, "0");
        p_code += api_data?.address?.sub_address_no?.padStart(4, "0");

        let sido = api_data?.address?.region_1depth_name;
        let sigungu = x?.['시군구'];
        let dong = x?.['읍면동'];
        let jibun = `${api_data?.address?.main_address_no}`;
        if(api_data?.address?.sub_address_no) jibun += `-${api_data?.address?.sub_address_no}`;
        
        let addr = api_data?.road_address?.address_name || api_data?.address?.address_name;

        let lat = api_data?.y;
        let lng = api_data?.x;
        
        // sido,
        // sigungu,
        // dong,
        /** 끝 */

        /** 개별 칼럼에 지정 */
        let sell_type_arr = ['매매', '전세', '월세'];

        let title = x?.['건물명'];
        let sell_type = sell_type_arr.includes(x?.['거래유형'] ) ? x?.['거래유형'] : '매매';
       
        let findData = category_2_OptionConsts.find(row => row?.title ===  x['매물종류']);

        let category_1 = findData ? findData?.category_1 : 1;
        let category_2 = findData ? findData?.idx : 1;

        let price_sell = x?.['매매가'];
        let now_price_all = x?.['현보증금'];
        let now_price_month = x?.['현월세'];
        let price_all = x?.[sell_type === '전세' ? '전세보증금' : '월세보증금'];
        let price_month = x?.['월세'];
        let price_keymoney = x?.['권리금'];
        let price_maintenance = x?.['관리비'];
        let area_supply = x?.['공급면적'];
        let area_contract = x?.['계약면적'];
        let area_private = x?.['전용면적'];
        let area_land = x?.['토지면적'];
        let area_floor = x?.['연면적'];
        let building_dong = x?.['해당동'];
        let building_dong_floor_all = x?.['해당동총층'];
        let building_floor = x?.['해당층'];
        let building_unit = x?.['해당호'];
        // let building_count = ''
        let building_floor_all = x?.['지상층'];
        let building_floor_under_all = x?.['지하층'];
        // let building_unit_all = ''
        let building_unit_empty = x?.['공실'];
        let item_direction = x?.['방향'];
        let item_direction_standard = x?.['방향기준'];
        let item_room = x?.['방'];
        let item_bathroom = x?.['욕실'];
        // let item_households = ''
        let item_car_all = x?.['총주차대수'];
        // let item_car = ''
        let item_elevator = x?.['승강기'];
        let item_usage = x?.['용도'];
        let item_date_type = '사용승인';
        let item_date = x?.['건축물일자'];
        let item_move_date = x?.['입주가능일'];
        let client_name = x?.['의뢰인'];
        let client_hp = x?.['의뢰인연락처'];
        let desc = x?.['특이사항'];

        /** 끝 */

        let updateList = {
            u_idx: user?.idx,
            c_idx: user?.compony?.idx || null,
            title,
            sell_type,
            category_1,
            category_2,
            sido,
            sigungu,
            dong,
            jibun,
            addr,
            p_code,
            lat,
            lng,
            price_sell,
            now_price_all,
            now_price_month,
            price_all,
            price_month,
            price_keymoney,
            price_maintenance,
            area_supply,
            area_contract,
            area_private,
            area_land,
            area_floor,
            building_dong,
            building_dong_floor_all,
            building_floor,
            building_unit,
            building_floor_all,
            building_floor_under_all,
            building_unit_empty,
            item_direction,
            item_direction_standard,
            item_room,
            item_bathroom,
            item_car_all,
            item_elevator,
            item_usage,
            item_date_type,
            item_date,
            item_move_date,
            client_name,
            client_hp,
            desc
        }
    
        console.log('updateList', updateList);
        await models.ITEM_TB.create(
            updateList,
        );
    })
    // xlsxFile(axiosResponse).then((sheets) => {
    //     console.log(sheets);
    // });

    send(req, res, rt);

});


module.exports = router;
