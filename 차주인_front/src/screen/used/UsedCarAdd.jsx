import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/used-car-add.css";

import Layout from "../../layout/Layout";
import Button from "../../component/Button"
import Checkbox from '../../component/Checkbox';
import Selector from "../../component/Select"
import Input from "../../component/Input"
import InputFile from "../../component/InputFile"

import * as APIS from "../../utils/service";
import Radios from '../../component/Radios';
import consts from "../../libs/consts"
import { selectConfig, setConfigMakerCars, setConfigMakers } from '../../redux/configSlice';
import { API_URL } from '../../libs/apiUrl';
import { findIndex, goBackPage, monthList, useInterval, yearList } from '../../utils/utils';
import { close, loadingflas, open } from '../../redux/popupSlice';
import { FastInsert } from '../../component/popups/FastInsert';
import moment from 'moment';
import { loadUserInfo, selectUserInfo } from '../../redux/userSlice';
import { AuthCarInfo, LicenseTypeInfo, PayTypeInfo } from '../../component/popups/CarOption';

export default function UsedCarAdd({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const UserData = useSelector(selectUserInfo)
    const ConfigData = useSelector(selectConfig)
    const params = new URLSearchParams(window.location.search);

    const [idx, setIdx] = useState(null)
    const [title, setTile] = useState("");
    const [maker, setMaker] = useState("")
    useEffect(() => {
        if (maker !== "") loadCar(maker)
    }, [maker])
    const [carList, setCarList] = useState([])
    const [makerCar, setMakerCar] = useState("")

    const [year, setYear] = useState("")
    useEffect(() => {
        console.log("year:::::", year)
    }, [year])
    const [month, setMonth] = useState("")
    const [carnum, setCarnum] = useState("")
    const [distance, setDistance] = useState("")
    const [usage, setUsage] = useState("")

    const [ton, setTon] = useState()
    const [carTypeIndex, setCarTypeIndex] = useState()
    const [carSubTypeIndex, setCarSubTypeIndex] = useState()

    const [color, setColor] = useState("")

    const [axis, setAxis] = useState("")
    const [boxArea, setBoxArea] = useState("")
    const [boxHeight, setBoxHeight] = useState("")
    const [boxWidth, setBoxWidth] = useState("")
    const [pallet, setPallet] = useState("")

    const [transmission, setTransmission] = useState("")
    const [fuel, setFuel] = useState("")

    const [sidoIndex, setSidoIndex] = useState(-1)
    const [sigunguIndex, setSigunguIndex] = useState(-1)

    const [price, setPrice] = useState("")

    const [sellNum, setSellNumOption] = useState(0);
    const [licenseType, setLicenseType] = useState("");
    const [numPrice, setNumPrice] = useState("");

    const [nomalOption, setNomalOption] = useState([]);
    const [etcOption, setEtcOption] = useState([]);

    const [textValue, setTextValue] = useState("")

    const [photo1, setPhoto1] = useState('');
    const [photo2, setPhoto2] = useState('');
    const [photo3, setPhoto3] = useState('');
    const [photo4, setPhoto4] = useState('');
    const [photo5, setPhoto5] = useState('');
    const [photo6, setPhoto6] = useState('');
    const [photo7, setPhoto7] = useState('');
    const [photo8, setPhoto8] = useState('');
    const [photo9, setPhoto9] = useState('');
    const [photo10, setPhoto10] = useState('');

    const [raStatus, setRaStatus] = useState(1);

    const [delFiles, setDelFiles] = useState([])

    const [policyCheck, setPolicyCheck] = useState([]);

    const [carUserName, setCarUserName] = useState("");
    const [carAuthType, setCarAuthType] = useState(1);
    const [carAuthState, seCarAuthState] = useState(0);
    const [carAuthMsg, setCarAuthMsg] = useState("")

    const loadMaker = () => {
        APIS.postData(API_URL.commom.maker, {})
            .then((result) => {
                dispatch(setConfigMakers({ makers: result.data }))
            })
            .catch((e) => {
                console.log(e)
            })
    }

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
        APIS.postData(API_URL.usedCar.insert, data)
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
     * @param {boolean} isFast true=빠른 false=일반
     * @returns 
     */
    const sellClick = async (isFast = false) => {
        console.log("일반판매")
        let sendData = {
            idx: idx,
            status: 1,
            title: "",
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
            options: "",
            etc_options: "",
            desc: "",
            // name: UserData.userInfo?.name,
            car_num: "",
            car_auth_type: 1, // 1=본인 2=서류

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
        }
        let err = [];
        try {
            if (title) sendData.title = title; else err.push("제목");
            if (maker) sendData.maker = maker; else err.push("제조사");
            if (makerCar) sendData.car = makerCar; else err.push("차종");
            if (year) sendData.year = year; else err.push("연도");
            if (month) sendData.month = moment(month).format("MM"); else err.push("월");
            if (distance) sendData.distance = Number(distance); else err.push("주행거리");
            if (usage) sendData.usage = usage; else err.push("차량용도");
            if (ton) sendData.ton = ton; else err.push("톤수");
            if (carTypeIndex >= 0) sendData.type = ConfigData?.carTypes[carTypeIndex]; else err.push("차량형식");
            if (carSubTypeIndex >= 0) sendData.sub_type = ConfigData?.subCarTypes[carTypeIndex][carSubTypeIndex]; else err.push("차량세부");
            if (color) sendData.color = color; else err.push("색상");
            if (axis) sendData.axis = axis; else err.push("가변축");
            if (boxArea) sendData.box_area = boxArea; else err.push("폭");
            if (boxHeight) sendData.box_height = boxHeight; else err.push("높이");
            if (boxWidth) sendData.box_width = boxWidth; else err.push("길이");
            if (pallet) sendData.box_palette = pallet; else err.push("파렛개수");
            if (transmission) sendData.transmission = transmission; else err.push("변속기");
            if (fuel) sendData.fuel = fuel; else err.push("연료");
            if (sidoIndex >= 0) sendData.sido = ConfigData.configSidos[sidoIndex]; else err.push("시도");
            if (sidoIndex >= 0 && sigunguIndex >= 0) sendData.sigungu = ConfigData.configSigungus[sidoIndex][sigunguIndex]; else { err.push("시군구"); }
            if (price) sendData.price = Number(price); else err.push("가격");
            if (sellNum == 0 || sellNum == 1) sendData.license_sell = sellNum == 0 ? true : false; else err.push("넘버판매");
            if (sellNum == 0) {
                if (licenseType) sendData.license_type = licenseType; else err.push("넘버타입");
                if (numPrice !== "") sendData.license_price = Number(numPrice); else err.push("넘버판매가");
            } else {
                sendData.license_type = ""
                sendData.license_price = 0
            }
            if (nomalOption) sendData.options = nomalOption.map(v => v.values); else err.push("옵션");
            if (etcOption) sendData.etc_options = etcOption.map(v => v.values); else err.push("기타");
            if (textValue) sendData.desc = textValue; else err.push("상세");
            if (photo1) sendData.photo_1 = photo1; else err.push("전면사진(넘버)");
            if (photo2) sendData.photo_2 = photo2; else err.push("후면사진(넘버)");
            if (photo3) sendData.photo_3 = photo3; else err.push("좌측면");
            if (photo4) sendData.photo_4 = photo4; else err.push("우측면");
            if (photo5) sendData.photo_5 = photo5; else err.push("적재함(내부)");
            if (photo6) sendData.photo_6 = photo6; else err.push("하부");
            if (photo7) sendData.photo_7 = photo7; else err.push("내부(운전석,조수석)");
            if (photo8) sendData.photo_8 = photo8; else err.push("계기판(킬로수)");

            sendData.car_auth_type = carAuthType;
            //서류인증시 필수 사항
            if (carAuthType == 2) { //서류인증일 경우
                if (carnum) sendData.car_num = carnum; else err.push("차량 번호");
                if (photo9) sendData.photo_9 = photo9; else err.push("사업자등록증");
                if (photo10) sendData.photo_10 = photo10; else err.push("자동차등록증");
            } else if (carAuthType == 1) {
                if (carAuthState != 2) err.push("내차인증");
            }

            if (raStatus) sendData.status = Number(raStatus)


            console.log(JSON.stringify(sendData))
        } catch (error) {
            console.log("에러", error);
            return;
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
                let fastPointData = await loadPontPrice(5)
                console.log("🚀 ~ sellClick ~ fastPointData:", fastPointData)

                let isCharge = UserData.userInfo?.point < fastPointData?.price

                if (!fastPointData?.err) {
                    dispatch(
                        open({
                            component: <FastInsert point={UserData.userInfo?.point} usePoint={fastPointData?.price} />,
                            onCancelPress: false,
                            titleviewer: true,
                            title: "빠른 판매 등록",
                            titleImg: "/images/icons/lightning.svg",
                            button: isCharge ? "충전하기" : "등록하기",
                            buttonCencle: "닫기",
                            onPress: () => {
                                dispatch(close())
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

    const fastSellClick = () => {
        console.log("빠른판매")

        dispatch(
            open({
                component: <FastInsert point={20000} usePoint={1000} />,
                onCancelPress: false,
                titleviewer: true,
                title: "빠른 판매 등록",
                titleImg: "/images/icons/lightning.svg",
                button: "등록/충전",
                buttonCencle: "닫기",
                onPress: () => { dispatch(close()) },
                onCancelPress: () => { dispatch(close()) },
                noneMt: true,
            })
        );
    }

    const [truckInfo, setTruckInfo] = useState(null)
    const [policy, setPolicy] = useState("")

    const loadPolicy = () => {
        APIS.postData(API_URL.commom.term, { type: 5 })
            .then((result) => {
                console.log(result)
                setPolicy(result.data);
            })
            .catch((e) => {
            })
    }

    useEffect(() => {
        loadMaker()
        setCarUserName(UserData.userInfo?.name)

        if (params.get("idx")) {
            console.log("수정하기");
            console.log("usedCarAdd -> params:", params.get("idx"))
            dispatch(loadingflas({ loading: true }))
            APIS.postData(API_URL.usedCar.info, { idx: params.get("idx"), init: false }).then(({ data }) => {
                dispatch(loadingflas({ loading: false }))
                setTruckInfo(data)
                if (data?.car_auth_state === 99) {
                    statePopup(data?.car_auth_msg);
                }
            }).catch(e => {
                dispatch(loadingflas({ loading: false }))
                goBackPage(navigate);
            })

        } else {
            console.log("신규등록");
            loadPolicy()
        }
    }, [])

    useEffect(() => {
        if (truckInfo !== null) {
            console.log("🚀 ~ useEffect ~ truckInfo:", truckInfo)
            setIdx(params.get("idx"))
            setTile(truckInfo?.title)
            setMaker(truckInfo?.maker)
            setMakerCar(truckInfo?.car)
            setYear(truckInfo?.year)
            setMonth(truckInfo?.month)

            setCarnum(truckInfo?.car_num)
            setDistance(truckInfo?.distance)
            setUsage(truckInfo?.usage)
            setTon(truckInfo?.ton)
            setCarTypeIndex(findIndex(truckInfo?.type, ConfigData?.carTypes))
            let eCarTypeIndex = findIndex(truckInfo?.type, ConfigData?.carTypes)
            setCarSubTypeIndex(findIndex(truckInfo?.sub_type, ConfigData?.subCarTypes[eCarTypeIndex]))
            setColor(truckInfo?.color)
            setAxis(truckInfo?.axis)
            setBoxArea(truckInfo?.box_area)
            setBoxHeight(truckInfo?.box_height)
            setBoxWidth(truckInfo?.box_width)
            setPallet(truckInfo?.box_palette)

            setTransmission(truckInfo?.transmission)
            setFuel(truckInfo?.fuel)

            setSidoIndex(findIndex(truckInfo?.sido, ConfigData.configSidos))
            let eSidoIndex = findIndex(truckInfo?.sido, ConfigData.configSidos)
            setSigunguIndex(findIndex(truckInfo?.sigungu, ConfigData.configSigungus[eSidoIndex]))

            setPrice(truckInfo?.price)
            setSellNumOption(truckInfo?.license_sell ? 0 : 1)
            if (truckInfo?.license_sell) {
                setLicenseType(truckInfo?.license_type)
                setNumPrice(truckInfo?.license_price)
            }
            setNomalOption(truckInfo?.options.split(",").filter(v => ConfigData.configInfo?.options?.options_option?.includes(v)).map(v => { return { names: v, values: v } }))
            setEtcOption(truckInfo?.etc_options.split(",").filter(v => ConfigData.configInfo?.options?.etc_options_option?.includes(v)).map(v => { return { names: v, values: v } }))
            setTextValue(truckInfo?.desc)

            if (truckInfo?.photo_1) setPhoto1(`${consts.s3url + truckInfo?.photo_1}`)
            if (truckInfo?.photo_2) setPhoto2(`${consts.s3url + truckInfo?.photo_2}`)
            if (truckInfo?.photo_3) setPhoto3(`${consts.s3url + truckInfo?.photo_3}`)
            if (truckInfo?.photo_4) setPhoto4(`${consts.s3url + truckInfo?.photo_4}`)
            if (truckInfo?.photo_5) setPhoto5(`${consts.s3url + truckInfo?.photo_5}`)
            if (truckInfo?.photo_6) setPhoto6(`${consts.s3url + truckInfo?.photo_6}`)
            if (truckInfo?.photo_7) setPhoto7(`${consts.s3url + truckInfo?.photo_7}`)
            if (truckInfo?.photo_8) setPhoto8(`${consts.s3url + truckInfo?.photo_8}`)
            if (truckInfo?.photo_9) setPhoto9(`${consts.s3url + truckInfo?.photo_9}`)
            if (truckInfo?.photo_10) setPhoto10(`${consts.s3url + truckInfo?.photo_10}`)

            if (truckInfo?.status) setRaStatus(truckInfo?.status)
            if (truckInfo?.car_auth_type) setCarAuthType(truckInfo?.car_auth_type)
            if (truckInfo?.car_auth_state) seCarAuthState(truckInfo?.car_auth_state)
            if (truckInfo?.car_auth_msg) setCarAuthMsg(truckInfo?.car_auth_msg)

        }
    }, [truckInfo])

    const submitFunc = () => {
        if (!carnum) {
            msgPopup("차량번호를 입력해주세요.")
            return
        }
        let newWindow = window.open("", "privde", "height=0, width=0");
        document.querySelector("#carOwner").value = carUserName
        document.querySelector("#carRegNo").value = carnum

        APIS.postData(API_URL.carAuth.hash, {
            carOwner: carUserName,
            carRegNo: carnum
        })
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
                console.log(result)
                newWindow.close();
            })
    }

    const confirmCar = () => {
        APIS.postData(API_URL.carAuth.carApiCheck, {}).then((result) => {
            seCarAuthState(2)
            console.log(result)
        }).catch((e) => {
            console.log("🚀 ~ APIS.postData ~ e:", e.response)
            //TODO: 다시인증하세요 표기
            msgPopup(e.response?.data?.msg);
            seCarAuthState(0)
        })
    }




    useEffect(() => {

    }, [UserData.userInfo?.car_owner])

    return (
        <Layout header={false}>
            <div className="usedCarAddContain">
                <div className="global-titleBox bg_white">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { goBackPage(navigate); }} />
                    <div className="titleInfo">
                        <div className="text">내차 팔기</div>
                    </div>
                </div>

                <div className="infoBox">
                    <div className="contents-box">
                        <div className="header-title-20">차량 정보</div>
                        <div className="detailBox">
                            <div className="row">
                                <div className="title required">제목</div>
                                <div className="value" style={{ width: "100%" }}>
                                    <Input
                                        className={`inputs`}
                                        placeholder="예) 현대 메가트럭 6.5톤 후축 카고 직거래"
                                        setValue={setTile}
                                        value={title}
                                        name="name"
                                    />
                                </div>
                            </div>
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
                            {/* <div className="row">
                                <div className="title required">차량번호</div>
                                <div className="value">
                                    <Input
                                        className={`inputs input-200`}
                                        placeholder=""
                                        setValue={setCarnum}
                                        value={carnum}
                                        name="name"
                                    />
                                </div>
                            </div> */}
                            <div className="row">
                                <div className="title required">주행거리</div>
                                <div className="value">
                                    <Input
                                        className={`inputs input-200`}
                                        placeholder=""
                                        setValue={setDistance}
                                        value={distance}
                                        name="name"
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
                                        selectData={
                                            ConfigData.configInfo?.options?.usage_option.map((v) => {
                                                return { values: v, labels: v }
                                            })
                                        } />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">톤수/형식</div>
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
                                        name="name"
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
                                        values={sellNum}
                                        setvalues={setSellNumOption}
                                        namevalue={[
                                            { names: '판매함', values: 0 },
                                            { names: '판매안함', values: 1 },
                                        ]}
                                        fontweights={400}
                                        fontSizes={16}
                                        sizes={24}
                                    />
                                    {
                                        sellNum == 0 && <div className='priceBox'>
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
                                                setValue={setNumPrice}
                                                value={numPrice}
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
                                        values={nomalOption}
                                        setvalues={setNomalOption}
                                        namevalue={ConfigData.configInfo.options?.options_option.map((v) => {
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
                                        values={etcOption}
                                        setvalues={setEtcOption}
                                        namevalue={ConfigData.configInfo.options?.etc_options_option.map((v) => {
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
                                        value={textValue}
                                        onChange={(e) => { setTextValue(e.target.value) }}
                                    />
                                </div>
                            </div>

                            {/* <div className="row">
                                <div className="title required">차량소유주</div>
                                <div className="value" style={{ width: "100%" }}>
                                    <Input
                                        className={`inputs `}
                                        placeholder="예)홍길동"
                                        setValue={setCarUserName}
                                        value={carUserName}
                                        name="name"
                                        readOnly={carAuthState != 0 || idx}
                                    />
                                </div>
                            </div> */}

                            <div className="row">
                                <div className="title required">차량번호</div>
                                <div className="value" style={{ width: "100%" }}>
                                    <Input
                                        className={`inputs `}
                                        placeholder="예)11가1111"
                                        setValue={setCarnum}
                                        value={carnum}
                                        name="name"
                                        readOnly={carAuthState == 1 || (idx && carAuthState != 99)}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">
                                    내차 인증&nbsp;
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
                                {/* <div className="value" style={{width: "100px"}}> */}
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

                        </div>
                    </div>

                    <div className="contents-box">
                        <div className="header-title-20">사진 첨부<span className='header-sub-title-14'>(촬영 가이드에 맞춰 사진을 업로드 하세요. 8가지 사항은 필수입니다.)</span></div>
                        <div className="add-image-box">
                            <InputFile type="file" placeholder="전면" subPlaceholder="(넘버노출)" value={photo1} setValue={setPhoto1} valid="image" setError={(err) => { console.log(err) }} />
                            <InputFile type="file" placeholder="후면" subPlaceholder="(넘버노출)" name="image2" value={photo2} setValue={setPhoto2} valid="image" setError={(err) => { console.log(err) }} />
                            <InputFile type="file" placeholder="좌측면 " name="image3" value={photo3} setValue={setPhoto3} valid="image" setError={(err) => { console.log(err) }} />
                            <InputFile type="file" placeholder="우측면" name="image4" value={photo4} setValue={setPhoto4} valid="image" setError={(err) => { console.log(err) }} />
                            <InputFile type="file" placeholder="적재함" subPlaceholder="(내부)" name="image5" value={photo5} setValue={setPhoto5} valid="image" setError={(err) => { console.log(err) }} />
                            <InputFile type="file" placeholder="하부" name="image6" value={photo6} setValue={setPhoto6} valid="image" setError={(err) => { console.log(err) }} />
                            <InputFile type="file" placeholder="내부" subPlaceholder="(운전석,조수석)" name="image7" value={photo7} setValue={setPhoto7} valid="image" setError={(err) => { console.log(err) }} />
                            <InputFile type="file" placeholder="계기판" subPlaceholder="(차량킬로수확인)" name="image8" value={photo8} setValue={setPhoto8} valid="image" setError={(err) => { console.log(err) }} />
                            {(carAuthType != 1 && carAuthState != 2) &&
                                <>
                                    <InputFile type="file" placeholder="사업자등록증" subPlaceholder="(개인정보 마킹)" name="image9" value={photo9} setValue={(v) => {
                                        if (typeof photo9 === "string" && v === "") {
                                            // console.log("파일 삭제합니다.");
                                            if (carAuthState == 1) {
                                                msgPopup("서류 심사중에는 사업자등록증을 삭제할수 없습니다.")
                                                return
                                            };
                                            setDelFiles(delFiles.concat({ key: "photo_9", file_path: photo9.replace(consts.s3url, "") }))
                                        }
                                        setPhoto9(v)
                                    }} valid="image" setError={(err) => { console.log(err) }} backGray
                                        disabled={carAuthState == 1} />
                                    <InputFile type="file" placeholder="자동차등록증" subPlaceholder="(개인정보 마킹)" name="image10" value={photo10} setValue={(v) => {

                                        if (typeof photo10 === "string" && v === "") {
                                            // console.log("파일 삭제합니다.");
                                            if (carAuthState == 1) {
                                                msgPopup("서류 심사중에는 자동차등록증을 삭제할수 없습니다.")
                                                return
                                            };
                                            setDelFiles(delFiles.concat({ key: "photo_10", file_path: photo10.replace(consts.s3url, "") }))
                                        }
                                        setPhoto10(v)
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
                                    { names: "상위 내용에 동의하십니까?", values: "1" },
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

                    <div className="usedadd-button-box">
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
                                    if (truckInfo?.ad)
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
                // method="post" id="provideHashFromUnfixed" name="provideHashFromUnfixed" action="https://car365.go.kr/aio365/provide/ProvideContent.do" accept-charset="EUC-KR">
                method="post" id="provideHashFromUnfixed" name="provideHashFromUnfixed" action="https://biz.car365.go.kr/bzpt/task/lnkh/kcbCert/kcbOkCert.do" 
                // accept-charset="EUC-KR"
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

const test = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://biz.car365.go.kr/bzpt/task/lnkh/kcbCert/kcbOkCert.do'; // 요청할 주소
    form.target = 'popupWindow'; // 새 창 이름

    // 전송할 데이터 추가
    const input1 = document.createElement('input');
    input1.type = 'hidden';
    input1.name = 'apiKeyArr';
    input1.value = 'AAAAAAAA-BBBBBBBB-CCCCCCCC-DDDDDDDD';
    form.appendChild(input1);

    const input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = 'carOwner';
    input2.value = '테스트사용자';
    form.appendChild(input2);

    const input3 = document.createElement('input');
    input3.type = 'hidden';
    input3.name = 'carRegNo';
    input3.value = '111가2222';
    form.appendChild(input3);

    const input4 = document.createElement('input');
    input4.type = 'hidden';
    input4.name = 'svcType';
    input4.value = 'Y';
    form.appendChild(input4);

    // 새 창(popup) 열기
    window.open('', 'popupWindow', 'width=600,height=400');

    // form body에 붙이고 전송
    document.body.appendChild(form);
    form.submit();
}