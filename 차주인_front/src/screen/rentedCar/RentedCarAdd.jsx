import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import "../../css/page-rented-add.css"

import Layout from "../../layout/Layout";
import Button from "../../component/Button"
import Checkbox from '../../component/Checkbox';
import Selector from "../../component/Select"
import Input from "../../component/Input"
import InputFile from "../../component/InputFile"

import * as APIS from "../../utils/service";
import Radios from '../../component/Radios';
import consts from "../../libs/consts";
import { API_URL } from '../../libs/apiUrl';
import { selectConfig } from '../../redux/configSlice';
import { selectUserInfo } from '../../redux/userSlice';
import { findIndex, goBackPage, Ismobiles, monthList, pathToFilename, yearList } from '../../utils/utils';
import InputFileBox from '../../component/InputFileBox';
import { FastInsert } from '../../component/popups/FastInsert';
import { close, loadingflas, open } from '../../redux/popupSlice';
import { AuthCarInfo, LicenseTypeInfo, PayTypeInfo } from '../../component/popups/CarOption';

export default function RentedCarAdd({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const UserData = useSelector(selectUserInfo);
    const ConfigData = useSelector(selectConfig);
    const params = new URLSearchParams(window.location.search);


    const [policyCheck, setPolicyCheck] = useState([]);
    const [idx, setIdx] = useState(null);
    const [title, setTile] = useState("");
    const [item, setItem] = useState("");
    // const [gosido, setGosido] = useState("");
    // const [gosigungu, setGosigungu] = useState("");
    const [gosidoIndex, setGosidoIndex] = useState(-1)
    const [gosigunguIndex, setGosigunguIndex] = useState(-1)

    const [section, setSection] = useState("");
    const [unloading, setUnloading] = useState([]);
    const [unloading2, setUnloading2] = useState([]);
    const [work, setWork] = useState("");
    const [dayoff, setDayoff] = useState("");
    const [pay, setPay] = useState("");
    const [paytype, setPaytype] = useState("");
    const [offer, setOffer] = useState("");
    const [jeeipPrice, setJeeipPrice] = useState("");
    const [insurancePrice, setInsurancePrice] = useState("");
    const [halbu, setHalbu] = useState("");
    const [age, setAge] = useState("");
    const [passenger, setPassenger] = useState("");


    const [maker, setMaker] = useState("");
    useEffect(() => {
        if (maker !== "") loadCar(maker)
    }, [maker])
    const [carList, setCarList] = useState([]);
    const [makerCar, setMakerCar] = useState("");

    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [distance, setDistance] = useState("");

    const [usage, setUsage] = useState("");
    const [ton, setTon] = useState("");
    const [carTypeIndex, setCarTypeIndex] = useState()
    const [carSubTypeIndex, setCarSubTypeIndex] = useState()
    const [axis, setAxis] = useState("");
    const [color, setColor] = useState("");
    const [boxArea, setBoxArea] = useState("");
    const [boxHeight, setBoxHeight] = useState("");
    const [boxWidth, setBoxWidth] = useState("");
    const [pallet, setPallet] = useState("");
    const [transmission, setTransmission] = useState("");
    const [fuel, setFuel] = useState("");
    const [sidoIndex, setSidoIndex] = useState(-1)
    const [sigunguIndex, setSigunguIndex] = useState(-1)

    const [price, setPrice] = useState("");
    const [licenseSell, setLicenseSell] = useState(0);
    const [licenseType, setLicenseType] = useState("");
    const [licensePrice, setLicensePrice] = useState("");
    const [options, setOptions] = useState([]);
    const [etcOptions, setEtcOptions] = useState([]);
    const [desc, setDesc] = useState("");
    const [name, setName] = useState("");
    const [carNum, setCarNum] = useState("");

    const [raStatus, setRaStatus] = useState(1);

    const [file, setFile] = useState("")
    const [fileName, setFileName] = useState("");
    const [fileVal1, setFileVal1] = useState("");
    const [fileVal2, setFileVal2] = useState("");
    const [fileVal3, setFileVal3] = useState("");
    const [fileVal4, setFileVal4] = useState("");
    const [fileVal5, setFileVal5] = useState("");
    const [fileVal6, setFileVal6] = useState("");
    const [fileVal7, setFileVal7] = useState("");
    const [fileVal8, setFileVal8] = useState("");
    const [fileVal9, setFileVal9] = useState("");
    const [fileVal10, setFileVal10] = useState("");

    const [delFiles, setDelFiles] = useState([]);

    const [carAuthType, setCarAuthType] = useState(1);
    const [carAuthState, seCarAuthState] = useState(0);

    useEffect(() => {
        console.log("delfiles:::", delFiles)
    }, [delFiles])
    const loadCar = (maker) => {
        APIS.postData(API_URL.commom.car, { maker })
            .then((result) => {
                setMakerCar(result.data[0])
                setCarList(result.data)
            })
            .catch((e) => {
                console.log(e)
            })
    }

    const insertCar = (data) => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.rentedCar.insert, data)
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                console.log(result.data)
                goBackPage(navigate);
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
                console.log(e)
            })
    }

    const msgPopup = (msg) => {
        dispatch(
            open({
                content: msg,
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                buttonCencle: "닫기",
                onPress: () => { dispatch(close()); },
                onCancelPress: () => { dispatch(close()); },
            })
        );
    }

    const statePopup = (msg) => {
        dispatch(
            open({
                component: <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12
                }}>
                    <p>내차인증이 <span style={{ color: "red", fontWeight: 700 }}>반려</span>되었습니다.</p>
                    <b>사유: {msg}</b>
                </div>,
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                buttonCencle: "닫기",
                onPress: () => { dispatch(close()); },
                onCancelPress: () => { dispatch(close()); },
            })
        );
    }

    /**
     * 1=중고화물차 예약상담 
     * 2=중고화물차 전화상담
     * 3=지입차 예약상담
     * 4=지입차 전화상담
     * 5=중고화물차 광고(30일)
     * 6=지입차 광고(30일)
     * @param { number } type 포인트 타입
     * @returns {Promise<{price:number, err: string | null }>}
     */
    const loadPontPrice = (type = 1) => {
        return new Promise((resolve, reject) => {
            APIS.postData(API_URL.commom.pointPrice, { type })
                .then((result) => {
                    resolve({ price: result.data, err: null })
                })
                .catch((e => {

                    if (e?.response?.data) {
                        let data = e.response.data
                        console.log(data.code, data.msg)
                        resolve({ price: 0, err: data.msg })
                    } else {
                        resolve({ price: 0, err: "포인트정보를 가져올수없습니다." })
                    }
                }))
        })
    }

    /**
     * 등록하기
     * @param {boolean} isFast default=false, true=빠른 false=일반
     * @returns 
     */
    const sellClick = async (isFast = false) => {
        let sendData = {
            idx: idx,
            status: 1,
            title: "",
            item: "",
            go_sido: "",
            go_sigungu: "",
            section: "",
            unloading: [],
            unloading_2: [],
            work: "",
            dayoff: "",
            pay: 0,
            paytype: "",
            offer: "",
            jeeip_price: "",
            insurance_price: "",
            halbu_price: "",
            age: "",
            passenger: "",
            maker: "",
            car: "",
            year: "",
            month: "",
            distance: 0,
            usage: "",
            type: "",
            sub_type: "",
            ton: "",
            axis: "",
            color: "",
            box_area: "",
            box_height: "",
            box_width: "",
            box_palette: "",
            transmission: "",
            fuel: "",
            sido: "",
            sigungu: "",
            price: 0,
            license_sell: false,
            license_type: "",
            license_price: 0,
            options: [],
            etc_options: [],
            desc: "",
            name: "",
            car_num: "",
            car_auth_type: 1,

            file_path: {},
            photo_1: {},
            photo_2: {},
            photo_3: {},
            photo_4: {},
            photo_5: {},
            photo_6: {},
            photo_7: {},
            photo_8: {},
            photo_9: {},
            photo_10: {},
            ad: isFast,

            delete_files: delFiles
            // delete_files: []
        }
        let err = [];
        console.log({ unloading, unloading2 })

        if (title) sendData.title = title; else err.push("제목")
        if (raStatus) sendData.status = Number(raStatus); else err.push("상태")
        if (item) sendData.item = item; else err.push("운송품목")
        if (gosidoIndex >= 0) sendData.go_sido = ConfigData.configSidos[gosidoIndex]; else err.push("출근지(시/도)")
        if (gosigunguIndex >= 0 && gosidoIndex >= 0) sendData.go_sigungu = ConfigData.configSigungus[gosidoIndex][gosigunguIndex]; else err.push("출근지(시/군/구)")
        if (section) sendData.section = section; else err.push("운행구간")
        if (unloading?.length > 0) sendData.unloading = unloading.map(v => v.values); else err.push("상차형태")
        if (unloading2?.length > 0) sendData.unloading_2 = unloading2.map(v => v.values); else err.push("하차형태")
        if (work) sendData.work = work; else err.push("근무시간")
        if (dayoff) sendData.dayoff = dayoff; else err.push("휴무")
        if (pay) sendData.pay = Number(pay); else err.push("급여")
        if (paytype) sendData.paytype = paytype; else err.push("지급방식")
        if (offer) sendData.offer = offer; else err.push("제공사항")
        if (jeeipPrice) sendData.jeeip_price = jeeipPrice; else err.push("지입료")
        if (insurancePrice) sendData.insurance_price = insurancePrice;
        if (halbu) sendData.halbu_price = halbu;
        if (age) sendData.age = age; else err.push("나이제한")
        if (passenger) sendData.passenger = passenger; else err.push("선탑가능시간")
        if (maker) sendData.maker = maker; else err.push("제조사")
        if (makerCar) sendData.car = makerCar; else err.push("차종")
        if (year) sendData.year = year; else err.push("연도")
        if (month) sendData.month = moment(month).format("MM"); else err.push("월")
        if (distance) sendData.distance = Number(distance); else err.push("주행거리")
        if (usage) sendData.usage = usage; else err.push("차량용도")
        if (carTypeIndex >= 0) sendData.type = ConfigData?.carTypes[carTypeIndex]; else err.push("형식")
        if (carSubTypeIndex >= 0) sendData.sub_type = ConfigData?.subCarTypes[carTypeIndex][carSubTypeIndex]; else err.push("세부형식")
        if (ton) sendData.ton = ton; else err.push("톤")
        if (axis) sendData.axis = axis; else err.push("가변축")
        if (color) sendData.color = color; else err.push("색상")
        if (boxArea) sendData.box_area = boxArea; else err.push("폭")
        if (boxHeight) sendData.box_height = boxHeight; else err.push("높이")
        if (boxWidth) sendData.box_width = boxWidth; else err.push("길이")
        if (pallet) sendData.box_palette = pallet; else err.push("파렛개수");
        if (transmission) sendData.transmission = transmission; else err.push("변속기")
        if (fuel) sendData.fuel = fuel; else err.push("연료")
        if (sidoIndex >= 0) sendData.sido = ConfigData.configSidos[sidoIndex]; else err.push("시/도(등록지)")
        if (sigunguIndex >= 0 && sidoIndex >= 0) sendData.sigungu = ConfigData.configSigungus[sidoIndex][sigunguIndex]; else err.push("시/군/구(등록지)")
        if (price) sendData.price = Number(price); else err.push("차량판매가")
        if (licenseSell == 1 || licenseSell == 0) sendData.license_sell = licenseSell == 1 ? true : false; else err.push("넘버판매")
        if (licenseSell == 1) {
            if (licenseType) sendData.license_type = licenseType; else err.push("넘버종류")
            if (licensePrice) sendData.license_price = Number(licensePrice); else err.push("넘버가격")
        } else {
            sendData.license_type = ""
            sendData.license_price = 0
        }
        if (options) sendData.options = options.map(v => v.values); else err.push("옵션")
        if (etcOptions) sendData.etc_options = etcOptions.map(v => v.values); else err.push("기타옵션")
        if (desc) sendData.desc = desc; else err.push("상세설명")
        if (name) sendData.name = name; else err.push("소유주")
        if (carNum) sendData.car_num = carNum; else err.push("차량번호")
        if (file) sendData.file_path = file; else err.push("세금계산서")
        if (fileVal1) sendData.photo_1 = fileVal1; else err.push("전면사진(넘버)")
        if (fileVal2) sendData.photo_2 = fileVal2; else err.push("후면사진(넘버)")
        if (fileVal3) sendData.photo_3 = fileVal3; else err.push("좌측면")
        if (fileVal4) sendData.photo_4 = fileVal4; else err.push("우측면")
        if (fileVal5) sendData.photo_5 = fileVal5; else err.push("적재함(내부)")
        if (fileVal6) sendData.photo_6 = fileVal6; else err.push("하부")
        if (fileVal7) sendData.photo_7 = fileVal7; else err.push("내부(운전석,조수석)")
        if (fileVal8) sendData.photo_8 = fileVal8; else err.push("계기판(킬로수)")

        sendData.car_auth_type = carAuthType;

        //서류인증시 필수 사항
        if (carAuthType == 2) { //서류인증일 경우
            if (fileVal9) sendData.photo_9 = fileVal9; else err.push("사업자등록증");
            if (fileVal10) sendData.photo_10 = fileVal10; else err.push("자동차등록증");
        } else if (carAuthType == 1) {
            if (carAuthState != 2) err.push("내차인증");
        }


        if (err.length > 0) {
            console.log("입력값을 확인해주세요.", err);
            dispatch(
                open({
                    component: <div>
                        <p>입력값을 확인해주세요.</p><br />
                        <p>[ {err.map((val, i) => {
                            if (i !== 0)
                                return ", " + val
                            return val
                        })} ]</p>
                    </div>,
                    // content: "차량정보를 입력해주세요.",
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    buttonCencle: "닫기",
                    onPress: () => { dispatch(close()) },
                    onCancelPress: () => { dispatch(close()) },
                })
            );
        } else {
            if (!idx && policyCheck?.length < 1) {
                msgPopup("서비스 이용 알림 및 약관에 동의해주세요.");
                return;
            }
            if (isFast) {
                let fastPointData = await loadPontPrice(6)
                console.log("🚀 ~ sellClick ~ fastPointData:", fastPointData)

                if (!fastPointData?.err) {
                    dispatch(
                        open({
                            component: <FastInsert point={UserData?.userInfo?.point} usePoint={fastPointData.price} />,
                            onCancelPress: false,
                            titleviewer: true,
                            title: "빠른 판매 등록",
                            titleImg: "/images/icons/lightning.svg",
                            button: "등록",
                            buttonCencle: "닫기",
                            onPress: () => {
                                dispatch(close());
                                insertCar(sendData);
                            },
                            onCancelPress: () => { dispatch(close()) },
                            noneMt: true,
                        })
                    );
                } else {
                    msgPopup("잠시후에 다시시도하세요.")
                }
            } else {
                if (carAuthState == 99) {
                    dispatch(
                        open({
                            content: `위 정보로 재 신청 하시겠습니까?`,
                            onCancelPress: false,
                            titleviewer: false,
                            button: "확인",
                            buttonCencle: "닫기",
                            onPress: () => {
                                dispatch(close());
                                insertCar(sendData);
                            },
                            onCancelPress: () => { dispatch(close()) },
                        })
                    );
                } else {
                    dispatch(
                        open({
                            content: `${idx ? "수정" : "등록"}하시겠습니까?`,
                            onCancelPress: false,
                            titleviewer: false,
                            button: "확인",
                            buttonCencle: "닫기",
                            onPress: () => {
                                dispatch(close());
                                insertCar(sendData);
                            },
                            onCancelPress: () => { dispatch(close()) },
                        })
                    );
                }

            }
        }
    }
    const [jeeipInfo, setJeeipInfo] = useState(null)
    const [policy, setPolicy] = useState("")

    const loadPolicy = () => {
        APIS.postData(API_URL.commom.term, { type: 6 })
            .then((result) => {
                console.log(result)
                setPolicy(result.data);
            })
            .catch((e) => {
            })
    }

    useEffect(() => {
        console.log("jeeip render!")
        setName(UserData.userInfo?.name)

        dispatch(loadingflas({ loading: false }))
        if (params.get("idx")) {
            console.log("수정하기");
            dispatch(loadingflas({ loading: true }))
            APIS.postData(API_URL.rentedCar.info, { idx: params.get("idx"), init: false }).then(({ data }) => {
                dispatch(loadingflas({ loading: false }))
                setJeeipInfo(data);
                if (data?.car_auth_state === 99) {
                    statePopup(data?.car_auth_msg);
                }
            }).catch(e => {
                dispatch(loadingflas({ loading: false }))
                goBackPage(navigate);
            })

        } else {
            console.log("신규등록");
            loadPolicy();
        }
    }, []);

    useEffect(() => {
        if (jeeipInfo !== null) {
            setIdx(jeeipInfo?.idx)
            setTile(jeeipInfo?.title)
            setItem(jeeipInfo?.item)
            setGosidoIndex(findIndex(jeeipInfo?.go_sido, ConfigData?.configSidos))
            let eGoSidoIndex = findIndex(jeeipInfo?.go_sido, ConfigData.configSidos)
            setGosigunguIndex(findIndex(jeeipInfo?.go_sigungu, ConfigData?.configSigungus[eGoSidoIndex]))
            setSection(jeeipInfo?.section)
            setUnloading(jeeipInfo?.unloading?.split(",")?.filter(v => ConfigData.configInfo?.options?.unloading_option?.includes(v)).map(v => { return { names: v, values: v } }))
            setUnloading2(jeeipInfo?.unloading_2?.split(",")?.filter(v => ConfigData.configInfo?.options?.unloading_option?.includes(v)).map(v => { return { names: v, values: v } }))
            setWork(jeeipInfo?.work)
            setDayoff(jeeipInfo?.dayoff)
            setPay(jeeipInfo?.pay)
            setPaytype(jeeipInfo?.paytype)
            setOffer(jeeipInfo?.offer)
            setJeeipPrice(jeeipInfo?.jeeip_price)
            setInsurancePrice(jeeipInfo?.insurance_price)
            setHalbu(jeeipInfo?.halbu_price)
            setAge(jeeipInfo?.age)
            setPassenger(jeeipInfo?.passenger)

            setMaker(jeeipInfo?.maker)
            setMakerCar(jeeipInfo?.car)
            setYear(jeeipInfo?.year)
            setMonth(Number(jeeipInfo?.month))
            setDistance(jeeipInfo?.distance)
            setUsage(jeeipInfo?.usage)
            setTon(jeeipInfo?.ton)
            setCarTypeIndex(findIndex(jeeipInfo?.type, ConfigData?.carTypes))
            let eCarTypeIndex = findIndex(jeeipInfo?.type, ConfigData?.carTypes)
            setCarSubTypeIndex(findIndex(jeeipInfo?.sub_type, ConfigData?.subCarTypes[eCarTypeIndex]))
            setAxis(jeeipInfo?.axis)
            setColor(jeeipInfo?.color)
            setBoxArea(jeeipInfo?.box_area)
            setBoxHeight(jeeipInfo?.box_height)
            setBoxWidth(jeeipInfo?.box_width)
            setPallet(jeeipInfo?.box_palette)
            setTransmission(jeeipInfo?.transmission)
            setFuel(jeeipInfo?.fuel)
            setSidoIndex(findIndex(jeeipInfo?.sido, ConfigData?.configSidos))
            let eSidoIndex = findIndex(jeeipInfo?.sido, ConfigData.configSidos)
            setSigunguIndex(findIndex(jeeipInfo?.sigungu, ConfigData?.configSigungus[eSidoIndex]))
            setPrice(jeeipInfo?.price)
            setLicenseSell(jeeipInfo?.license_sell ? 1 : 0)
            if (jeeipInfo?.license_sell) {
                setLicenseType(jeeipInfo?.license_type)
                setLicensePrice(jeeipInfo?.license_price)
            }
            setOptions(jeeipInfo?.options.split(",").filter(v => ConfigData.configInfo?.options?.options_option?.includes(v)).map((v) => { return { values: v, labels: v } }))
            setEtcOptions(jeeipInfo?.etc_options.split(",").filter(v => ConfigData.configInfo?.options?.etc_options_option?.includes(v)).map((v) => { return { values: v, labels: v } }))

            setDesc(jeeipInfo?.desc)
            // setName(jeeipInfo?.name)
            setCarNum(jeeipInfo?.car_num)

            setFile(jeeipInfo?.file_path)
            setFileName(jeeipInfo?.file_path)
            if (jeeipInfo?.photo_1) setFileVal1(`${consts.s3url + jeeipInfo?.photo_1}`)
            if (jeeipInfo?.photo_2) setFileVal2(`${consts.s3url + jeeipInfo?.photo_2}`)
            if (jeeipInfo?.photo_3) setFileVal3(`${consts.s3url + jeeipInfo?.photo_3}`)
            if (jeeipInfo?.photo_4) setFileVal4(`${consts.s3url + jeeipInfo?.photo_4}`)
            if (jeeipInfo?.photo_5) setFileVal5(`${consts.s3url + jeeipInfo?.photo_5}`)
            if (jeeipInfo?.photo_6) setFileVal6(`${consts.s3url + jeeipInfo?.photo_6}`)
            if (jeeipInfo?.photo_7) setFileVal7(`${consts.s3url + jeeipInfo?.photo_7}`)
            if (jeeipInfo?.photo_8) setFileVal8(`${consts.s3url + jeeipInfo?.photo_8}`)
            if (jeeipInfo?.photo_9) setFileVal9(`${consts.s3url + jeeipInfo?.photo_9}`)
            if (jeeipInfo?.photo_10) setFileVal10(`${consts.s3url + jeeipInfo?.photo_10}`)

            setRaStatus(jeeipInfo?.status)

            if (jeeipInfo?.car_auth_type) setCarAuthType(jeeipInfo?.car_auth_type)
            if (jeeipInfo?.car_auth_state) seCarAuthState(jeeipInfo?.car_auth_state)

        }
    }, [jeeipInfo])

    const submitFunc = () => {
        if (!carNum) {
            msgPopup("차량번호를 입력해주세요.")
            return
        }
        let newWindow = window.open("", "privde", "height=0, width=0");
        document.querySelector("#carOwner").value = name
        document.querySelector("#carRegNo").value = carNum

        APIS.postData(API_URL.carAuth.hash, {
            carOwner: name,
            carRegNo: carNum
        })
        // APIS.postData("/v1/auth/carApiTest", {
        //     carOwner: name,
        //     carRegNo: carNum
        // })
            .then((result) => {
                let {
                    hashValue,
                    timeStamp,
                    siteURL,
                    siteName,
                    svcCodeArr,
                    returnURLA,
                    returnURLD,
                } = result.data

                document.querySelector("#hashValue").value = hashValue;
                document.querySelector("#timeStamp").value = timeStamp;
                document.querySelector("#siteURL").value = siteURL;
                document.querySelector("#siteName").value = siteName;
                document.querySelector("#svcCodeArr").value = svcCodeArr;
                document.querySelector("#apiKeyArr").value = svcCodeArr;
                document.querySelector("#returnURL").value = returnURLA
                document.querySelector("#returnURLA").value = returnURLA
                document.querySelector("#returnURLD").value = returnURLD

                // return
                // window.open("", "privde", "height=0, width=0");
                document.provideHashFromUnfixed.target = "privde";
                document.provideHashFromUnfixed.submit();

                // dispatch(loadUserInfo());
                seCarAuthState(1);

            })
            .catch((result) => {
                newWindow.close();
            })
    }

    const confirmCar = () => {
        APIS.postData(API_URL.carAuth.carApiCheck, {}).then((result) => {
            seCarAuthState(2)
        }).catch((e) => {
            console.log("🚀 ~ APIS.postData ~ e:", e.response)
            msgPopup(e.response?.data?.msg);
            seCarAuthState(0)
        })
    }

    return (
        <Layout header={false}>
            <div className="rentedCarAddContain">
                <div className="global-titleBox bg_white">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { goBackPage(navigate); }} />
                    <div className="titleInfo">
                        <div className="text">지입차 직거래</div>
                    </div>
                </div>

                <div className="infoBox">
                    <div className="contents-box">
                        <div className="header-title-20">지입 정보</div>
                        <div className="detailBox">
                            <div className="row">
                                <div className="title required">제목</div>
                                <div className="value" style={{ width: "100%" }}>
                                    <Input
                                        className={`inputs`}
                                        placeholder="예) 현대 메가트럭 6.5톤 후축 카고 직거래"
                                        setValue={setTile}
                                        value={title}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">품목</div>
                                <div className="value">
                                    <Selector
                                        className="selector-200"
                                        placeholder="품목선택"
                                        subselectClass="selector-200"
                                        values={item}
                                        setValues={setItem}
                                        selectData={ConfigData.configInfo?.options?.item_option?.map((v) => {
                                            return { values: v, labels: v }
                                        })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">출근지</div>
                                <div className="value">
                                    <Selector
                                        className="selector-200"
                                        placeholder="시/도"
                                        subselectClass="selector-200"
                                        values={gosidoIndex}
                                        setValues={(v) => {
                                            setGosigunguIndex(0)
                                            setGosidoIndex(v)
                                        }}
                                        selectData={ConfigData.configSidos?.map((v, i) => { return { values: i, labels: v } })} />
                                    <Selector
                                        className="selector-200"
                                        placeholder="시/군/구"
                                        subselectClass="selector-200"
                                        values={gosigunguIndex}
                                        setValues={setGosigunguIndex}
                                        selectData={ConfigData.configSigungus[gosidoIndex]?.map((v, i) => {
                                            return { values: i, labels: v }
                                        })}
                                        disabled={gosidoIndex < 0}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">운행구간</div>
                                <div className="value" style={{ width: "100%" }}>
                                    <Input
                                        className={`inputs`}
                                        placeholder=""
                                        setValue={setSection}
                                        value={section}
                                        name="name"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">상차 형태</div>
                                <div className="value">
                                    <Checkbox
                                        linetype={'checkimg'}
                                        values={unloading}
                                        setvalues={setUnloading}
                                        namevalue={ConfigData.configInfo?.options?.unloading_option?.map((v) => {
                                            return { names: v, values: v }
                                        })}
                                        fontweights={400}
                                        fontSizes={16}
                                        sizes={24}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">하차 형태</div>
                                <div className="value">
                                    <Checkbox
                                        linetype={'checkimg'}
                                        values={unloading2}
                                        setvalues={setUnloading2}
                                        namevalue={ConfigData.configInfo?.options?.unloading_option?.map((v) => {
                                            return { names: v, values: v }
                                        })}
                                        fontweights={400}
                                        fontSizes={16}
                                        sizes={24}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">근무시간</div>
                                <div className="value" style={{ width: "100%" }}>
                                    <Input
                                        className={`inputs`}
                                        placeholder="ex)09~18시"
                                        setValue={setWork}
                                        value={work}
                                        name="name"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="title required">휴무</div>
                                <div className="value" style={{ width: "100%" }}>
                                    <Input
                                        className={`inputs`}
                                        placeholder="ex)일휴무, 토일 휴무"
                                        setValue={setDayoff}
                                        value={dayoff}
                                        name="name"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="title required">
                                    월급여&nbsp;
                                    <a style={{ cursor: "pointer" }} onClick={() => {
                                        dispatch(
                                            open({
                                                component: <PayTypeInfo />,
                                                onCancelPress: false,
                                                titleviewer: true,
                                                title: "지급방식",
                                                button: "확인",
                                                onPress: () => {
                                                    dispatch(close())
                                                },
                                                noneMt: true,
                                            })
                                        );
                                    }}>
                                        <img src="/images/icons/questionnaire-fill.svg" alt="" />
                                    </a>
                                </div>
                                <div className="value" style={{ width: "100%" }}>
                                    <Input
                                        className={`inputs`}
                                        placeholder=""
                                        setValue={setPay}
                                        value={pay}
                                        type="number"
                                    />
                                    <div className='unit'>만원</div>
                                    <Selector
                                        style={{ width: "80px" }}
                                        placeholder="선택"
                                        values={paytype}
                                        setValues={setPaytype}
                                        selectData={ConfigData.configInfo?.options?.paytype_option?.map((v) => {
                                            return { labels: v, values: v }
                                        })} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="title required">제공사항</div>
                                <div className="value" style={{ width: "100%" }}>
                                    <Input
                                        className={`inputs`}
                                        placeholder="예) 유류비 비원, 상여금 지원 등"
                                        setValue={setOffer}
                                        value={offer}
                                        name="name"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="title required">지입료</div>
                                <div className="value">
                                    <Input
                                        className={`inputs input-200`}
                                        placeholder=""
                                        setValue={setJeeipPrice}
                                        value={jeeipPrice}
                                    />
                                    {/* <span className='unit'>만원</span> */}
                                </div>
                            </div>

                            <div className="row">
                                <div className="title">보험료</div>
                                <div className="value">
                                    <Input
                                        className={`inputs input-200`}
                                        placeholder=""
                                        setValue={setInsurancePrice}
                                        value={insurancePrice}
                                    />
                                    {/* <span className='unit'>만원</span> */}
                                </div>
                            </div>

                            <div className="row">
                                <div className="title">할부금</div>
                                <div className="value">

                                    <Input
                                        className={`inputs input-200`}
                                        placeholder=""
                                        setValue={setHalbu}
                                        value={halbu}
                                    />
                                    {/* <span className='unit'>만원</span> */}
                                </div>
                            </div>

                            <div className="row">
                                <div className="title required">나이제한</div>
                                <div className="value">
                                    <Selector
                                        className="selector-200"
                                        placeholder="선택"
                                        subselectClass="selector-200"
                                        values={age}
                                        setValues={setAge}
                                        selectData={ConfigData.configInfo?.options?.age_option?.map((v) => {
                                            return { labels: v, values: v }
                                        })} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="title required">선탑가능시간</div>
                                <div className="value column">
                                    <Input
                                        className={`inputs`}
                                        placeholder="ex) 월~금, 오후1시~오후6시"
                                        setValue={setPassenger}
                                        value={passenger}
                                    />
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className="contents-box">
                        <div className="header-title-20">차량 정보</div>
                        <div className="detailBox">
                            <div className="row">
                                <div className="title required">제조사/차종</div>
                                <div className="value">
                                    <Selector
                                        className="selector-200"
                                        placeholder="제조사"
                                        subselectClass="selector-200"
                                        values={maker}
                                        setValues={setMaker}
                                        selectData={
                                            ConfigData.configMakers?.map((v) => {
                                                return { values: v, labels: v }
                                            })
                                        } />
                                    {carList.length > 0 && <Selector
                                        className="selector-200"
                                        placeholder="차종"
                                        subselectClass="selector-200"
                                        values={makerCar}
                                        setValues={setMakerCar}
                                        selectData={carList.map((v) => {
                                            return { values: v, labels: v }
                                        })} />}
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">차량연식</div>
                                <div className="value">
                                    <Selector
                                        placeholder="연도"
                                        subselectClass="selector-200"
                                        values={year}
                                        setValues={setYear}
                                        selectData={yearList().map((v) => {
                                            return { values: v, labels: v + "년" }
                                        })} />
                                    <Selector
                                        placeholder="월"
                                        subselectClass="selector-200"
                                        values={month}
                                        setValues={setMonth}
                                        selectData={monthList().map((v) => {
                                            return { values: v, labels: v + "월" }
                                        })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">주행거리</div>
                                <div className="value">
                                    <Input
                                        className={`inputs input-200`}
                                        placeholder=""
                                        setValue={setDistance}
                                        value={distance}
                                        type="number"
                                    />
                                    <span className='unit'>km</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">차량용도</div>
                                <div className="value">
                                    <Selector
                                        placeholder="선택"
                                        subselectClass="selector-200"
                                        values={usage}
                                        setValues={setUsage}
                                        selectData={ConfigData.configInfo?.options?.usage_option?.map((v) => {
                                            return { labels: v, values: v }
                                        })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">형태/톤수</div>
                                <div className="value">
                                    <Selector
                                        placeholder="톤"
                                        subselectClass="selector-140"
                                        values={ton}
                                        setValues={setTon}
                                        selectData={ConfigData.configInfo?.options?.ton_option.map((v) => {
                                            return { values: v, labels: v + "톤" }
                                        })} />
                                    <Selector
                                        placeholder="형식"
                                        subselectClass="selector-140"
                                        values={carTypeIndex}
                                        setValues={(value) => {
                                            setCarTypeIndex(value)
                                            setCarSubTypeIndex(0)
                                        }}
                                        selectData={ConfigData?.carTypes?.map((v, i) => { return { values: i, labels: v } })} />
                                    <Selector
                                        placeholder="세부"
                                        subselectClass="selector-140"
                                        values={carSubTypeIndex}
                                        setValues={setCarSubTypeIndex}
                                        selectData={carTypeIndex >= 0 ? ConfigData?.subCarTypes[carTypeIndex] ? ConfigData?.subCarTypes[carTypeIndex].map((v, i) => { return { values: i, labels: v } }) : [] : []}
                                        disabled={carTypeIndex < 0}
                                    />

                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">가변축</div>
                                <div className="value">
                                    <Selector
                                        placeholder="선택"
                                        subselectClass="selector-200"
                                        values={axis}
                                        setValues={setAxis}
                                        selectData={
                                            ConfigData?.configInfo?.options?.axis_option?.map((v, i) => {
                                                return { values: v, labels: v }
                                            })
                                        } />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">차량색상</div>
                                <div className="value">
                                    <Selector
                                        className="selector-200"
                                        placeholder="선택"
                                        subselectClass="selector-200"
                                        values={color}
                                        setValues={setColor}
                                        selectData={
                                            ConfigData?.configInfo?.options?.color_option?.map((v, i) => {
                                                return { values: v, labels: v }
                                            })
                                        } />
                                </div>
                            </div>

                            {/* <div className="row">
                                <div className="title required">적재함</div>
                                <div className="value">
                                    <Selector
                                        placeholder="넓이"
                                        subselectClass="selector-140"
                                        values={boxArea}
                                        setValues={setBoxArea}
                                        selectData={
                                            ConfigData?.configInfo?.options?.box_area_option?.map((v, i) => {
                                                return { values: v, labels: v }
                                            })
                                        } />
                                    <Selector
                                        placeholder="높이"
                                        subselectClass="selector-140"
                                        values={boxHeight}
                                        setValues={setBoxHeight}
                                        selectData={
                                            ConfigData?.configInfo?.options?.box_height_option?.map((v, i) => {
                                                return { values: v, labels: v }
                                            })
                                        } />
                                    <Selector
                                        placeholder="길이"
                                        subselectClass="selector-140"
                                        values={boxWidth}
                                        setValues={setBoxWidth}
                                        selectData={
                                            ConfigData?.configInfo?.options?.box_width_option?.map((v, i) => {
                                                return { values: v, labels: v }
                                            })
                                        } />
                                </div>
                            </div> */}
                            <div className="row">
                                <div className="title required">적재함</div>
                                <div className="value box-data" style={{ width: "100%" }}>
                                    <div className="box-per-50">
                                        <Input
                                            className={`inputs input-per-25`}
                                            placeholder="높이"
                                            setValue={setBoxHeight}
                                            value={boxHeight}
                                            name="name"
                                        />
                                        <Input
                                            className={`inputs input-per-25`}
                                            placeholder="길이"
                                            setValue={setBoxWidth}
                                            value={boxWidth}
                                            name="name"
                                        />
                                    </div>
                                    <div className="box-per-50">
                                        <Input
                                            className={`inputs input-per-25`}
                                            placeholder="폭"
                                            setValue={setBoxArea}
                                            value={boxArea}
                                            name="name"
                                        />
                                        <Input
                                            className={`inputs input-per-25`}
                                            placeholder="파렛개수"
                                            setValue={setPallet}
                                            value={pallet}
                                            name="name"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="title required">변속기/연료</div>
                                <div className="value">
                                    <Selector
                                        className="selector-200"
                                        placeholder="변속기"
                                        subselectClass="selector-200"
                                        values={transmission}
                                        setValues={setTransmission}
                                        selectData={
                                            ConfigData?.configInfo?.options?.transmission_option?.map((v, i) => {
                                                return { values: v, labels: v }
                                            })
                                        } />
                                    <Selector
                                        className="selector-200"
                                        placeholder="연료"
                                        subselectClass="selector-200"
                                        values={fuel}
                                        setValues={setFuel}
                                        selectData={
                                            ConfigData?.configInfo?.options?.fuel_option?.map((v, i) => {
                                                return { values: v, labels: v }
                                            })
                                        } />
                                </div>
                            </div>

                            <div className="row">
                                <div className="title required">등록지역</div>
                                <div className="value">
                                    <Selector
                                        className="selector-200"
                                        placeholder="시/도"
                                        subselectClass="selector-200"
                                        values={sidoIndex}
                                        setValues={(v) => {
                                            setSigunguIndex(0)
                                            setSidoIndex(v)
                                        }}
                                        selectData={ConfigData.configSidos?.map((v, i) => { return { values: i, labels: v } })} />
                                    <Selector
                                        className="selector-200"
                                        placeholder="시/군/구"
                                        subselectClass="selector-200"
                                        values={sigunguIndex}
                                        setValues={setSigunguIndex}
                                        selectData={ConfigData.configSigungus[sidoIndex]?.map((v, i) => {
                                            return { values: i, labels: v }
                                        })}
                                        disabled={sidoIndex < 0}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="title required">차량판매가</div>
                                <div className="value">
                                    <Input
                                        className={`inputs input-200`}
                                        placeholder=""
                                        setValue={setPrice}
                                        value={price}
                                        type="number"
                                    />
                                    <span className='unit'>만원</span>
                                </div>
                            </div>

                            <div className="row">
                                <div className="title top required">
                                    넘버 판매가&nbsp;
                                    <a style={{ cursor: "pointer" }} onClick={() => {
                                        dispatch(
                                            open({
                                                component: <LicenseTypeInfo />,
                                                onCancelPress: false,
                                                titleviewer: true,
                                                title: "넘버 판매가",
                                                button: "확인",
                                                onPress: () => {
                                                    dispatch(close())
                                                },
                                                noneMt: true,
                                            })
                                        );
                                    }}>
                                        <img src="/images/icons/questionnaire-fill.svg" alt="" />
                                    </a>
                                </div>
                                <div className="value column">
                                    <Radios
                                        linetype={'checkimg'}
                                        values={licenseSell}
                                        setvalues={setLicenseSell}
                                        namevalue={[
                                            { names: '판매함', values: 1 },
                                            { names: '판매안함', values: 0 },
                                        ]}
                                        fontweights={400}
                                        fontSizes={16}
                                        sizes={24}
                                    />
                                    {
                                        licenseSell == 1 && <div className='priceBox'>
                                            <Selector
                                                placeholder="면허종류"
                                                subselectClass="selector-200 multi"
                                                values={licenseType}
                                                setValues={setLicenseType}
                                                selectData={
                                                    ConfigData?.configInfo?.options?.license_option?.map((v, i) => {
                                                        return { values: v, labels: v }
                                                    })
                                                } />
                                            <Input
                                                className={`inputs input-50`}
                                                placeholder=""
                                                setValue={setLicensePrice}
                                                value={licensePrice}
                                                name="name"
                                                type="number"
                                            />
                                            <span className='unit'>만원</span>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="row">
                                <div className="title top required">차량 옵션</div>
                                <div className="value column">
                                    <div className="value-title">
                                        일반 옵션
                                    </div>
                                    <Checkbox
                                        linetype={'checkimg'}
                                        values={options}
                                        setvalues={setOptions}
                                        namevalue={ConfigData.configInfo?.options?.options_option.map((v) => {
                                            return { names: v, values: v }
                                        })}
                                        fontweights={400}
                                        fontSizes={16}
                                        sizes={24}
                                    />
                                    <div className="value-title">
                                        기타 옵션
                                    </div>
                                    <Checkbox
                                        linetype={'checkimg'}
                                        values={etcOptions}
                                        setvalues={setEtcOptions}
                                        namevalue={ConfigData.configInfo?.options?.etc_options_option.map((v) => {
                                            return { names: v, values: v }
                                        })}
                                        fontweights={400}
                                        fontSizes={16}
                                        sizes={24}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="title top required">차량 상세 설명</div>
                                <div className="value" style={{ width: "100%" }}>
                                    <textarea
                                        className="text-box"
                                        placeholder='내용을 입력해주세요.'
                                        value={desc}
                                        onChange={(e) => { setDesc(e.target.value) }}
                                    />
                                </div>
                            </div>
                            {/* <div className="row">
                                <div className="title required">차량소유주</div>
                                <div className="value column">
                                    <Input
                                        className={`inputs`}
                                        placeholder="예)홍길동"
                                        setValue={setName}
                                        value={name}
                                        readOnly={carAuthState != 0 || idx}
                                    />
                                </div>
                            </div> */}
                            <div className="row">
                                <div className="title required">차량번호</div>
                                <div className="value column">
                                    <Input
                                        className={`inputs`}
                                        placeholder="예)11가1111"
                                        setValue={setCarNum}
                                        value={carNum}
                                        readOnly={carAuthState == 1 || (idx && carAuthState != 99)}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="title required">
                                    내차 인증
                                    <a style={{ cursor: "pointer" }} onClick={() => {
                                        dispatch(
                                            open({
                                                component: <AuthCarInfo />,
                                                onCancelPress: false,
                                                titleviewer: true,
                                                title: "내차 인증",
                                                button: "확인",
                                                onPress: () => {
                                                    dispatch(close())
                                                },
                                                noneMt: true,
                                            })
                                        );
                                    }}>
                                        <img src="/images/icons/questionnaire-fill.svg" alt="" />
                                    </a>
                                </div>
                                {idx ?
                                    <div className="value" style={{ width: carAuthState == 99 ? "100%" : "100px" }}>
                                        {carAuthState == 1 && <Button
                                            buttonTxt="심사중입니다."
                                            buttonSize="small"
                                            disabled
                                        />}
                                        {carAuthState == 2 && <Button
                                            buttonTxt="인증완료"
                                            buttonSize="small"
                                            disabled
                                        />}
                                        {carAuthState == 99 &&
                                            <div className="value" style={{
                                                width: "100%",
                                                flexDirection: "column",
                                                alignItems: "normal",
                                                padding: "10px 0px"
                                            }}>
                                                <div style={{ width: 100 }}>
                                                    <Button
                                                        buttonTxt="반려"
                                                        buttonSize="small"
                                                        disabled
                                                    />
                                                </div>
                                                <div>
                                                    <span className='header-sub-title-14'>반려사항 수정 후 [수정하기]로 재신청</span>
                                                </div>
                                            </div>}

                                    </div> :
                                    <div className="value" style={{
                                        width: "100%",
                                        flexDirection: "column",
                                        alignItems: "normal",
                                        padding: "10px 0px"
                                    }}>
                                        <div>
                                            <Radios
                                                linetype={'checkimg'}
                                                values={carAuthType}
                                                setvalues={setCarAuthType}
                                                namevalue={[
                                                    { names: '개인인증', values: 1 },
                                                    { names: '법인인증', values: 2 },
                                                ]}
                                                fontweights={400}
                                                fontSizes={16}
                                                sizes={24}
                                            />
                                        </div>
                                        {
                                            carAuthType == 1 ?
                                                <div style={{ width: 100 }}>
                                                    {carAuthState == 0 && <Button
                                                        buttonTxt="인증하기"
                                                        buttonSize="small"
                                                        onPress={submitFunc}
                                                    />}
                                                    {carAuthState == 1 && <Button
                                                        buttonTxt="결과확인"
                                                        buttonSize="small"
                                                        buttonShape="white"
                                                        onPress={confirmCar}
                                                    />}
                                                    {carAuthState == 2 && <Button
                                                        buttonTxt="인증완료"
                                                        buttonSize="small"
                                                        disabled
                                                    />}
                                                </div> :
                                                <div>
                                                    <span className='header-sub-title-14'>사업자등록증, 자동차등록증을 등록해주세요.</span>
                                                </div>
                                        }
                                    </div>}
                            </div>

                            <div className="row">
                                <div className="title required">
                                    세금계산서&nbsp;
                                    <a target="_blank" href={Ismobiles() ? "https://blog.naver.com/workdrivers/223458975424" : "https://blog.naver.com/workdrivers/223458356632"}><img src="/images/icons/questionnaire-fill.svg" alt="" /></a>
                                </div>
                                <div className="value">
                                    <InputFileBox
                                        type="file"
                                        labelType="box"
                                        value={file}
                                        setValue={setFile}
                                        valid="file"
                                        setError={(msg) => {
                                            console.log(msg)
                                        }}
                                        setFileName={(fileName) => {
                                            setFileName(fileName);
                                        }}
                                    >
                                        <div
                                            style={{ width: "100px", cursor: "pointer", userSelect: "none" }}
                                            className='default-button small normalbutton'>
                                            첨부하기
                                        </div>
                                    </InputFileBox>

                                    {fileName && <div style={{ display: "flex", alignItems: "center" }}>
                                        <p>{pathToFilename(fileName)}</p>
                                        <img
                                            style={{ width: 16, height: 16, cursor: "pointer" }}
                                            src="/images/icons/x-input.svg" alt=""
                                            onClick={() => {
                                                setFile("");
                                                setFileName("");
                                            }}
                                        />
                                    </div>}

                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="contents-box">
                        <div className="header-title-20">사진 첨부<span className='header-sub-title-14'>(촬영 가이드에 맞춰 사진을 업로드 하세요. 옵션을 제외한 8가지 사항은 필수입니다.)</span></div>
                        <div className="add-image-box">
                            <InputFile type="file" placeholder="전면" subPlaceholder="(넘버노출)" value={fileVal1} setValue={setFileVal1} valid="image" />
                            <InputFile type="file" placeholder="후면" subPlaceholder="(넘버노출)" name="image2" value={fileVal2} setValue={setFileVal2} valid="image" />
                            <InputFile type="file" placeholder="좌측면 " name="image3" value={fileVal3} setValue={setFileVal3} valid="image" />
                            <InputFile type="file" placeholder="우측면" name="image4" value={fileVal4} setValue={setFileVal4} valid="image" />
                            <InputFile type="file" placeholder="적재함" subPlaceholder="(내부)" name="image5" value={fileVal5} setValue={setFileVal5} valid="image" />
                            <InputFile type="file" placeholder="하부" name="image6" value={fileVal6} setValue={setFileVal6} valid="image" />
                            <InputFile type="file" placeholder="내부" subPlaceholder="(운전석,조수석)" name="image7" value={fileVal7} setValue={setFileVal7} valid="image" />
                            <InputFile type="file" placeholder="계기판" subPlaceholder="(차량킬로수확인)" name="image8" value={fileVal8} setValue={setFileVal8} valid="image" />
                            {(carAuthType != 1 && carAuthState != 2) &&
                                <>
                                    <InputFile type="file" placeholder="사업자등록증" subPlaceholder="(개인정보 마킹)" name="image9" value={fileVal9} setValue={(v) => {
                                        if (typeof fileVal9 === "string" && v === "") {
                                            // console.log("파일 삭제합니다.");
                                            if (carAuthState == 1) {
                                                msgPopup("서류 심사중에는 사업자등록증을 삭제할수 없습니다.")
                                                return
                                            };
                                            setDelFiles(delFiles.concat({ key: "photo_9", file_path: fileVal9.replace(consts.s3url, "") }))
                                        }
                                        setFileVal9(v)
                                    }} valid="image" setError={(err) => { console.log(err) }} backGray
                                        disabled={carAuthState == 1} />
                                    <InputFile type="file" placeholder="자동차등록증" subPlaceholder="(개인정보 마킹)" name="image10" value={fileVal10} setValue={(v) => {

                                        if (typeof fileVal10 === "string" && v === "") {
                                            // console.log("파일 삭제합니다.");
                                            if (carAuthState == 1) {
                                                msgPopup("서류 심사중에는 자동차등록증을 삭제할수 없습니다.")
                                                return
                                            };
                                            setDelFiles(delFiles.concat({ key: "photo_10", file_path: fileVal10.replace(consts.s3url, "") }))
                                        }
                                        setFileVal10(v)
                                    }} valid="image" setError={(err) => { console.log(err) }} backGray
                                        disabled={carAuthState == 1} />
                                </>
                            }
                        </div>
                    </div>
                    {!idx && (
                        <div className="contents-box-g20">
                            <div className="header-title-20">서비스 이용 알림 및 약관 동의</div>
                            <p style={{ whiteSpace: 'pre', lineHeight: 1.8 }}>{policy}</p>

                            <Checkbox
                                linetype={'checkimg'}
                                values={policyCheck}
                                setvalues={setPolicyCheck}
                                flexrows="column"
                                namevalue={[
                                    { names: "위 내용에 동의합니다.", values: "1" },
                                ]}
                                fontweights={400}
                                fontSizes={16}
                                sizes={24}
                            />
                        </div>
                    )}

                    <div className="contents-box-g20">
                        <div className="header-title-20">등록 상태</div>
                        <Radios
                            linetype={'checkimg'}
                            values={raStatus}
                            setvalues={setRaStatus}
                            namevalue={ConfigData.configInfo?.consts?.boardStatusConsts.map((v) => {
                                return { names: v.title, values: v.idx }
                            })}
                            fontweights={400}
                            fontSizes={16}
                            sizes={24}
                        />
                    </div>

                    <div className="rentedadd-button-box">
                        <Button
                            buttonTxt="취소"
                            buttonShape="gray"
                            buttonSize="large"
                            onPress={() => {
                                goBackPage(navigate);
                            }}
                        />
                        <Button
                            buttonTxt={idx ? "수정하기" : "일반 판매"}
                            buttonSize="large"
                            onPress={() => {
                                sellClick()
                            }}
                        />
                        <Button
                            titleimgs="/images/icons/simple-icons_lightning.svg"
                            buttonTxt="빠른 판매"
                            buttonShape="black"
                            buttonSize="large"
                            onPress={() => {
                                if (idx) {
                                    if (jeeipInfo?.ad)
                                        msgPopup("이미 빠른 판매 상태입니다.")
                                    else
                                        sellClick(true)
                                } else {
                                    sellClick(true)
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <form
                style={{ height: 0, overflow: "hidden" }}
                // method="post" id="provideHashFromUnfixed" name="provideHashFromUnfixed" action="https://car365.go.kr/aio365/provide/ProvideContent.do" accept-charset="EUC-KR"
                method="post" id="provideHashFromUnfixed" name="provideHashFromUnfixed" action="https://biz.car365.go.kr/bzpt/task/lnkh/kcbCert/kcbOkCert.do" 
                target={"popupWindow"}
                >
                {/* <form method="post" id="provideHashFromUnfixed" name="provideHashFromUnfixed" action="http://14.35.194.170:8080/aio365/provide/ProvideContent.do" accept-charset="EUC-KR"> */}
                <input type="text" id="hashValue" name="hashValue" value="" />
                <input type="text" id="timeStamp" name="timeStamp" value="" />

                <input type="text" id="siteURL" name="siteURL" value="" />
                <input type="text" id="siteName" name="siteName" value="" />
                {/* <input type="text" id="insttCode" name="insttCode" value="" /> */}
                <input type="text" id="svcCodeArr" name="svcCodeArr" value="" />
                <input type="text" id="apiKeyArr" name="apiKeyArr" value="" />
                <input type="text" id="svcType" name="svcType" value="Y" />
                <input type="text" id="returnURL" name="returnURL" value="" />
                <input type="text" id="returnURLA" name="returnURLA" value="" />
                <input type="text" id="returnURLD" name="returnURLD" value="" />

                <input type="text" id="carOwner" name="carOwner" value="" />
                <input type="text" id="carRegNo" name="carRegNo" value="" />

                <button type="button" onClick={submitFunc}>전송</button>
            </form>
        </Layout >
    )
}