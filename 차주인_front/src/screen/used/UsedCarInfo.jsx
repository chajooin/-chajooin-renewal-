import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Navigation, FreeMode, Thumbs, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import moment from 'moment';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Layout from "../../layout/Layout";
import CSwiper from "../../component/SwiperStyle1"
import Checkbox from '../../component/Checkbox';
import Button from '../../component/Button';
import Selector from "../../component/Select"
import Input from "../../component/Input"

import consts from "../../libs/consts"
import * as APIS from "../../utils/service";
import { API_URL } from '../../libs/apiUrl';
import { reloadWindow, selectConfig } from '../../redux/configSlice';
import { addHyphenToPhoneNumber, dateShotYearformat, numFormat, useMoveScrool } from '../../utils/utils';
import { close, loadingflas, open } from '../../redux/popupSlice';
import { Reservation } from '../../component/popups/Reservation';
import { loadUserInfo, selectUserInfo } from '../../redux/userSlice';
import { DefaultImg } from '../../component/DefaultImg';



export default function UsedCarInfo({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { element, onMoveToElement } = useMoveScrool()
    const params = new URLSearchParams(window.location.search);
    const idx = params.get("idx");

    const { configInfo: ConfigData, configSidos, configSigungus } = useSelector(selectConfig);
    const UserData = useSelector(selectUserInfo);

    const [truckInfo, setTruckInfo] = useState(null)
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [imageList, setImageList] = useState([])
    const [slideIndex, setSlideIndex] = useState(0)

    const [nomalOption, setNomalOption] = useState([]);
    const [etcOption, setEtcOption] = useState([]);

    const [fileLink, setFileLink] = useState("");

    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(false);

    const [inputName, setInputName] = useState("");
    const [inputHp, setInputHp] = useState("");
    const [inputSido, setInputSido] = useState(-1);
    const [inputSigungu, setInputSigungu] = useState(0);
    const [inputDesc, setInputDesc] = useState("");

    useEffect(() => {
        dafaFunc();
    }, [])

    useEffect(() => {
        if (truckInfo !== null) {
            console.log("🚀 ~ useEffect ~ truckInfo:", truckInfo)

            if (truckInfo?.options?.split(",").length > 0)
                setNomalOption(truckInfo?.options?.split(",").map(v => { return { values: v, names: v } }))
            if (truckInfo?.etc_options?.split(",").length > 0)
                setEtcOption(truckInfo?.etc_options?.split(",").map(v => { return { values: v, names: v } }))

            let findImgList = []
            let keyList = Object.keys(truckInfo)
            for (let i = 0; i < keyList.length; i++) {
                let key = keyList[i]
                if (key.indexOf("photo") >= 0) {
                    if (truckInfo[key] && key != "photo_9" && key != "photo_10") {
                        findImgList.push(consts.s3url + truckInfo[key])
                    }
                }
            }
            findImgList.length > 0 ? setImageList(findImgList) : setImageList([""])

        }
    }, [truckInfo])

    /**
     * 트럭정보 가져오기
     * @param {boolean} init // 조회수 올림
     */
    const dafaFunc = (init = true) => {
        dispatch(loadingflas({ loading: true }))

        APIS.postData(API_URL.usedCar.info, { idx: idx, init }).then(({ data }) => {
            setTruckInfo(data);
            setLike(data?.like_check);
            setLikeCount(data?.like_cnt);
            dispatch(loadingflas({ loading: false }))

        }).catch(e => {
            dispatch(loadingflas({ loading: false }));
            let msg = e.response?.data?.msg ? e.response?.data?.msg : "존재하지 않는 게시물입니다."
            alert(msg)
            window.close();
            navigate("/")
        })
    }

    const requestDelete = (idx) => {
        APIS.postData(API_URL.usedCar.delete, { idx: idx }).then(({ data }) => {
            window.close();
        }).catch(e => {
            console.log(e)
        })
    }

    const likeFunc = () => {
        APIS.postData(API_URL.usedCar.like, { idx: truckInfo?.idx }).then(({ data }) => {
            setLike(data?.like_check);
            setLikeCount(data?.like_cnt);
        }).catch(e => { console.log(e) })
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

    const requestConsulting = async (type) => {
        if (truckInfo?.u_idx === UserData.userInfo?.idx) {
            dispatch(
                open({
                    content: "본인 개시글 입니다.",
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    onPress: () => { dispatch(close()) },
                })
            );
            return;
        }

        if (truckInfo?.car_auth_state != 2) {
            dispatch(
                open({
                    content: "내차인증이 승인되지 않은 매물입니다.",
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    onPress: () => { dispatch(close()) },
                })
            );
            return;
        }

        let sendData = {
            idx: truckInfo?.idx,
            type: Number(type)
        };

        if (type === 1) {
            sendData.name = inputName
            sendData.hp = inputHp
            sendData.sido = inputSido !== -1 ? configSidos[inputSido] : undefined
            if (inputSido !== -1) { sendData.sigungu = configSigungus[inputSido][inputSigungu] }
            sendData.desc = inputDesc

            let isCheck = true
            for (let key in sendData) {
                if (!sendData[key]) {
                    console.log(key, "값 에러")
                    isCheck = false
                }
            }

            console.log("🚀 ~ requestConsulting ~ isCheck:", isCheck, sendData)

            if (!isCheck) {
                dispatch(
                    open({
                        content: "상담 항목을 모두 입력해주세요.",
                        onCancelPress: false,
                        titleviewer: false,
                        button: "확인",
                        onPress: () => { dispatch(close()) },
                    })
                );
                return
            };


            let rePointData = await loadPontPrice(1)

            if (!rePointData.err) {
                let isCharge = UserData.userInfo?.point < rePointData?.price
                dispatch(
                    open({
                        component: <Reservation point={UserData.userInfo?.point} usePoint={rePointData?.price} strType={"예약"} />,
                        onCancelPress: false,
                        titleviewer: true,
                        title: "예약상담 신청",
                        button: isCharge ? "충전하기" : "신청하기",
                        buttonCencle: "닫기",
                        onPress: () => {
                            dispatch(close())
                            if (isCharge) navigate("/mypagePoint")
                            else sendFunc(sendData, type)
                        },
                        onCancelPress: () => {
                            dispatch(close())
                        },
                        noneMt: true,
                    })
                );
            } else {
                dispatch(
                    open({
                        content: "잠시 후 다시시도해주세요.",
                        onCancelPress: false,
                        titleviewer: false,
                        button: "확인",
                        onPress: () => { dispatch(close()) },
                    })
                );
            }
        } else {
            sendFunc(sendData, type)
        }
    }

    /**
     * 상담 신청
     * @param {*} sendData 
     * @param {*} type  1=전화상담 2=예약상담
     */
    const sendFunc = (sendData, type = 1) => {
        APIS.postData(API_URL.usedCar.consulting, sendData)
            .then((result) => {
                console.log(result.data)
                if (result.data) {
                    dafaFunc(false);
                    dispatch(loadUserInfo())
                }

                dispatch(
                    open({
                        content: type == 1 ? "신청이 완료되었습니다." : "판매자정보를 확인해주세요.",
                        onCancelPress: false,
                        titleviewer: false,
                        button: "확인",
                        onPress: () => {
                            dispatch(close())
                            if (type == 1)
                                navigate("/mypageCalendar", { state: { type: 1 } })
                        },
                    })
                );
            })
            .catch((e) => {
                dispatch(
                    open({
                        content: e.response?.data?.msg,
                        onCancelPress: false,
                        titleviewer: false,
                        button: "확인",
                        onPress: () => { dispatch(close()) },
                    })
                );
            })
    }

    const clickConsulting = async (type = 1) => {
        if (truckInfo?.u_idx === UserData.userInfo?.idx) {
            dispatch(
                open({
                    content: "본인 개시글 입니다.",
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    onPress: () => { dispatch(close()) },
                })
            );
            return;
        }

        if (truckInfo?.car_auth_state != 2) {
            dispatch(
                open({
                    content: "내차인증이 승인되지 않은 매물입니다.",
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    onPress: () => { dispatch(close()) },
                })
            );
            return;
        }

        if (type === 1) {
            onMoveToElement();
        } else if (type === 2) {
            if (truckInfo?.status == 2) {
                dispatch(
                    open({
                        content: "판매 완료된 상품입니다.",
                        onCancelPress: false,
                        titleviewer: false,
                        button: "확인",
                        onPress: () => { dispatch(close()) },
                    })
                );
                return;
            }

            if (truckInfo?.writer?.hp) {
                document.location.href = `tel:${truckInfo?.writer?.hp}`
                return;
            }

            //전화상담
            let telPointData = await loadPontPrice(2)

            if (!telPointData.err) {
                let isCharge = UserData.userInfo?.point < telPointData?.price

                dispatch(
                    open({
                        component: <Reservation point={UserData.userInfo?.point} usePoint={telPointData?.price} strType={"전화"} />,
                        onCancelPress: false,
                        titleviewer: true,
                        title: "전화상담 신청",
                        button: isCharge ? "충전하기" : "신청하기",
                        buttonCencle: "닫기",
                        onPress: () => {
                            dispatch(close())
                            if (isCharge) navigate("/mypagePoint")
                            else requestConsulting(type);
                        },
                        onCancelPress: () => {
                            dispatch(close())
                        },
                        noneMt: true,
                    })
                );
            } else {
                dispatch(
                    open({
                        content: "잠시 후 다시시도해주세요.",
                        onCancelPress: false,
                        titleviewer: false,
                        button: "확인",
                        onPress: () => { dispatch(close()) },
                    })
                );
            }

        }
    }

    const contractFile = () => {
        APIS.postData(API_URL.commom.contract, { type: 1 }).then(({ data }) => {
            // setFileLink(data)
            window.open(data);
        }).catch(e => {
            console.log(e)
        })
    }
    return (
        <Layout header={false} footters={false}>
            <div className="usedInfoContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => {
                        window.close()
                        navigate("/", { replace: true })
                    }} />
                    <div className="titleInfo">
                        <div className="text">최초등록 {moment(truckInfo?.create_dt).format('YY/MM/DD')}</div>
                        <div className="view">
                            <img src="/images/icons/eye-line.svg" alt="" />
                            <div className='count'>{numFormat(truckInfo?.view)}</div>
                        </div>
                    </div>

                    <div className="likeInfo" onClick={likeFunc}>
                        {like ?
                            <img src="/images/icons/heart-3-fill.svg" alt="" /> :
                            <img src="/images/icons/heart-3-line-disable.svg" alt="" />
                        }

                        <div className="text">{numFormat(likeCount)}</div>
                    </div>
                </div>

                <div className="swiperBox bg_white margint60">

                    <CSwiper
                        imgStyles={{ aspectRatio: 1.6 }}
                        listsImag={imageList}
                        viewIndex={slideIndex}
                        buttonInner
                        isButton
                        isFraction
                    />

                    <div className='imgLongBox'>
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={9.3}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                        >
                            {
                                imageList.map((v, i) => {
                                    return <SwiperSlide onClick={() => { setSlideIndex(i) }}>
                                        {/* <img className='smallImg' src={v} /> */}
                                        <img className='smallImg' src={v} onError={DefaultImg} />
                                    </SwiperSlide>
                                })
                            }

                        </Swiper>
                    </div>
                </div>

                <div className="infoBox">
                    <div className="carInfoBox">
                        <div className="header-title-36">{truckInfo?.title}</div>
                        {(truckInfo?.status == 2) && <div className="state">판매완료</div>}

                        <div className="info">{dateShotYearformat(truckInfo?.year)}/{truckInfo?.month}식 · {truckInfo?.transmission} · {numFormat(truckInfo?.distance)}km · {truckInfo?.sido}</div>
                        <div className="subInfo">
                            <div className="used-circle-card">
                                <div className="circle">{numFormat(truckInfo?.price)}만원</div>
                                <div className="text">차량판매가</div>
                            </div>
                            {truckInfo?.license_sell && <div className="used-circle-card">
                                <div className="circle">
                                    <div className="number">{truckInfo?.license_type}</div>
                                    {numFormat(truckInfo?.license_price)}만원
                                </div>
                                <div className="text">넘버 판매</div>
                            </div>}

                            <div style={{ cursor: "pointer" }} className="used-circle-card" onClick={() => { window.open("https://www.carhistory.or.kr/") }}>
                                <div className="circle">
                                    <img src="/images/icons/la_tools.svg" alt="" />
                                </div>
                                <div className="text">사고이력</div>
                            </div>

                            <div className="used-circle-card">
                                {truckInfo?.car_auth_state == 1 && <div className="circle"><span>차량인증</span>심사중</div>}
                                {truckInfo?.car_auth_state == 2 && <div className="circle"><span>본인</span>인증완료</div>}
                                {truckInfo?.car_auth_state == 99 && <div className="circle"><span>차량인증</span>심사중(반려)</div>}

                                <div className="text">차량등록증</div>
                            </div>
                        </div>
                        <div className="msg">※ 사고이력 확인은 [카히스토리] 사이트에서 본인 확인 및 유료결제후 이용가능합니다.</div>
                    </div>
                </div>

                <div className="infoBox">
                    <div className="header-title-24 header-add-btn-box">
                        판매자 정보
                        <div className="seller-report-btn">
                            {
                                truckInfo?.u_idx === UserData.userInfo?.idx ?
                                    (<div class="drop-down">
                                        <button class="drop-btn" />
                                        <div class="drop-down-content">
                                            <a style={{ cursor: "pointer" }} onClick={() => { navigate(`/usedCarEdit?idx=${idx}`) }}>수정하기</a>
                                            <a style={{ cursor: "pointer" }} onClick={() => {
                                                dispatch(
                                                    open({
                                                        content: "삭제하시겠습니까?",
                                                        onCancelPress: false,
                                                        titleviewer: false,
                                                        button: "확인",
                                                        buttonCencle: "닫기",
                                                        onPress: () => {
                                                            dispatch(close());
                                                            requestDelete(params.get("idx"))
                                                        },
                                                        onCancelPress: () => { dispatch(close()); },
                                                    })
                                                );
                                            }
                                            }>삭제하기</a>
                                        </div>
                                    </div>) :
                                    (<Button
                                        titleimgs="/images/icons/alarm-warning-line.svg"
                                        buttonTxt="신고하기"
                                        buttonShape="red"
                                        buttonSize="small"
                                        onPress={() => { navigate(`/reportUsed?idx=${idx}`) }}
                                    />)
                            }
                        </div>
                    </div>
                    <div className="sellerInfoBox">
                        <div className="used-seller-info">
                            <div className="iconBox">
                                {truckInfo?.writer?.profile ?
                                    <img src={consts.s3url + truckInfo?.writer?.profile} alt="" /> :
                                    <img src="/images/icons/user-3-fill.svg" alt="" />}
                            </div>
                            <div className="detailInfoBox">
                                <div className="info">
                                    <div className="title">판매자</div>
                                    <div className="text">{truckInfo?.writer?.name}</div>
                                </div>
                                <div className="info">
                                    <div className="title">카톡ID</div>
                                    {truckInfo?.writer?.kakao_id ? <div className="text">{truckInfo?.writer?.kakao_id}</div> : <div className="text">예약/전화 상담 후 확인 가능</div>}
                                </div>
                                <div className="info">
                                    <div className="title">연락처</div>
                                    {truckInfo?.writer?.hp ? <div className="text">{addHyphenToPhoneNumber(truckInfo?.writer?.hp)}</div> : <div className="text">예약/전화 상담 후 확인 가능</div>}

                                </div>
                            </div>
                        </div>
                        <div className="used-seller-btnbox">
                            <Button buttonTxt="예약상담" buttonShape="white" onPress={() => { clickConsulting(1) }} />
                            <Button buttonTxt="전화상담" onPress={() => { clickConsulting(2) }} />
                        </div>
                    </div>
                </div>
                <div className="infoBox">
                    <div className="header-title-24">차량 기본정보</div>
                    <div className="used-default-info">
                        <div className="detailBox">
                            <div className="row">
                                <div className="title">제조사/차종</div>
                                <div className="text">{truckInfo?.maker} {truckInfo?.car}</div>
                            </div>
                            <div className="row">
                                <div className="title">주행거리</div>
                                <div className="text">{numFormat(truckInfo?.distance)}km</div>
                            </div>
                            <div className="row">
                                <div className="title">형태</div>
                                <div className="text">{truckInfo?.type}</div>
                            </div>
                            <div className="row">
                                <div className="title">차량색상</div>
                                <div className="text">{truckInfo?.color}</div>
                            </div>
                            <div className="row">
                                <div className="title">가변축</div>
                                <div className="text">{truckInfo?.axis}</div>
                            </div>
                            <div className="row">
                                <div className="title">변속기</div>
                                <div className="text">{truckInfo?.transmission}</div>
                            </div>
                            <div className="row">
                                <div className="title">등록지역</div>
                                <div className="text">{truckInfo?.sido} {truckInfo?.sigungu}</div>
                            </div>
                        </div>
                        <div className="detailBox">
                            <div className="row">
                                <div className="title">차량연식</div>
                                <div className="text">{truckInfo?.year}년 {truckInfo?.month}월</div>
                            </div>
                            <div className="row">
                                <div className="title">차량용도</div>
                                <div className="text">{truckInfo?.usage}</div>
                            </div>
                            <div className="row">
                                <div className="title">톤수</div>
                                <div className="text">{truckInfo?.ton}톤</div>
                            </div>
                            <div className="row">
                                <div className="title">적재함</div>
                                <div className="text">높이:{truckInfo?.box_height}/길이:{truckInfo?.box_width}/폭:{truckInfo?.box_area}/파렛개수:{truckInfo?.box_palette}</div>
                            </div>
                            <div className="row">
                                <div className="title">연료형태</div>
                                <div className="text">{truckInfo?.fuel}</div>
                            </div>
                            <div className="row">
                                <div className="title">차량번호</div>
                                <div className="text">{truckInfo?.car_num}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="infoBox">
                    <div className="header-title-24">차량 가격정보</div>
                    <div className="used-price-info">
                        <div className="row-price">
                            <div className="title">차량 판매가</div>
                            <div className="price">{numFormat(Number(truckInfo?.price + "0000"))}원</div>
                        </div>
                        {truckInfo?.license_sell && <div className="row-price margint12 ">
                            <div className="title">넘버 판매가</div>
                            <div className="price"><div className="number">{truckInfo?.license_type}</div>{numFormat(Number(truckInfo?.license_price + "0000"))}원</div>
                        </div>}
                        <div className="row-total border-top margint15">
                            <div className="title">총 판매가</div>
                            <div className="price">{
                                truckInfo?.license_sell ?
                                    numFormat(Number((truckInfo?.price + truckInfo?.license_price) + "0000")) :
                                    numFormat(Number(truckInfo?.price + "0000"))
                            }원</div>
                        </div>
                    </div>

                </div>
                <div className="infoBox">
                    <div className="header-title-24">차량 옵션정보</div>
                    <div className="used-option-info">
                        <div className="sub-option">
                            <div className="title">일반 옵션</div>
                            <Checkbox
                                linetype={'checkimg'}
                                values={nomalOption}
                                namevalue={ConfigData?.options?.options_option?.map((v) => {
                                    return { names: v, values: v }
                                })}
                                fontweights={400}
                                fontSizes={16}
                                sizes={24}
                                disable
                            />
                        </div>
                        <div className="sub-option">
                            <div className="title">기타 옵션</div>
                            <Checkbox
                                linetype={'checkimg'}
                                values={etcOption}
                                namevalue={ConfigData?.options?.etc_options_option?.map((v) => {
                                    return { names: v, values: v }
                                })}
                                fontweights={400}
                                fontSizes={16}
                                sizes={24}
                                disable
                            />
                        </div>
                    </div>
                </div>
                <div className="infoBox">
                    <div className="header-title-24">차량 상세 설명</div>
                    <div className="used-detail-info">
                        <div className="text" dangerouslySetInnerHTML={{ __html: String(truckInfo?.desc).replaceAll("\n", "<br>") }}>
                        </div>
                        {imageList.map((v, i) => {
                            return <img className="car-image" src={v} alt="" onError={DefaultImg} />
                        })}
                        {/* <img className="car-image" src="/images/sample/car3.png" alt="차량사진" /> */}
                    </div>
                </div>
                <div className="infoBox">
                    <div className="used-paper-call">
                        <div className="used-paper-btnBox">
                            <div className="used-paper-box">
                                <Button
                                    titleimgs="/images/icons/download-line.svg"
                                    buttonTxt="중고거래 화물표준계약서"
                                    buttonShape="white"
                                    onPress={contractFile}
                                />
                            </div>
                            <div className="used-call-box">
                                <Button buttonTxt="예약상담" buttonShape="white" onPress={() => { clickConsulting(1) }} />
                                <Button buttonTxt="전화상담" onPress={() => { clickConsulting(2) }} />
                            </div>
                        </div>

                        <div>
                            <div className="wtc-c6 "><span className='blue bold bg-gradient-blue'>본인차량 인증확인 서비스</span></div>
                            <div className="wtc-c6 margint12">[차주인 서비스]는 "자동차365" 연동을 통해 판매 등록시 <span className='bold underline'>소유주 본인인증</span> 및 <span className='bold underline'>차대번호</span>를 입력받아 본인차량임을 확인합니다.</div>
                        </div>


                        <div className="used-paper-call-info">
                            <div className="bold">
                                차주인은 중고 화물차,지입차,기사 구인구직 개인 직거래 중개 플랫폼입니다<br />
                                저희는 3가지를 기준으로 매물을 중개합니다.
                            </div>
                            <div className="info">
                                <ol>
                                    <li>1개월or2000km(엔진,미션,DPF)보증 가능한 차량</li>
                                    <li>선탑가능한 일자리(지입차)</li>
                                    <li>매출확인(지입차)</li>
                                </ol>
                            </div>
                            <div className="red">3가지 보증내용은 상위 계약서 특약에 포함되어 있습니다.</div>
                            <div className="bold">보증받고,직접보고,확인하고 구매하세요!</div>
                        </div>

                        <div ref={element} className="used-paper-call-edit">
                            <div className="header-title-24">예약 상담 신청하기</div>
                            <div className="edit-box">
                                <div className="edit-row">
                                    <div className="title">
                                        성함<span className='colorFF2323'>*</span>
                                    </div>
                                    <div className="input-box">
                                        <Input
                                            className={`inputs`}
                                            placeholder=""
                                            setValue={setInputName}
                                            value={inputName}
                                            name="name"
                                        />
                                    </div>
                                </div>
                                <div className="edit-row">
                                    <div className="title">
                                        연락처<span className='colorFF2323'>*</span>
                                    </div>
                                    <div className="input-box">
                                        <Input
                                            className={`inputs`}
                                            placeholder=""
                                            setValue={setInputHp}
                                            value={inputHp}
                                            name="name"
                                            type="number"
                                        />
                                    </div>
                                </div>
                                <div className="edit-row">
                                    <div className="title">
                                        주소<span className='colorFF2323'>*</span>
                                    </div>
                                    <div className="input-box">
                                        <Selector
                                            placeholder="시/도"
                                            subselectClass="selBox"
                                            values={inputSido}
                                            setValues={(v) => {
                                                setInputSigungu(0)
                                                setInputSido(v)
                                            }}
                                            selectData={configSidos?.map((v, i) => { return { values: i, labels: v } })}
                                        />
                                        {inputSido != -1 && <Selector
                                            placeholder="시/군/구"
                                            subselectClass="selBox"
                                            values={inputSigungu}
                                            setValues={setInputSigungu}
                                            selectData={configSigungus[inputSido]?.map((v, i) => { return { values: i, labels: v } })}
                                        />}
                                    </div>
                                </div>

                                <div className="edit-row">
                                    <div className="title">
                                        요청사항<span className='colorFF2323'>*</span>
                                    </div>
                                    <div className="input-box">
                                        <textarea
                                            className='text'
                                            value={inputDesc}
                                            onChange={(e => { setInputDesc(e.target.value) })}
                                            placeholder='상담을 원하시는 일자와 시간, 요청사항을 입력하세요.'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="infoBox">
                    <div className="used-confirm">
                        <div className="info">
                            부적절한 의도로 사용자에게 피해를 주거나<br />
                            예약신청 후 노쇼 등으로 인해 상대방에게 피해를 줄 경우<br />
                            서비스 이용에 제한이 있을 수 있습니다.
                        </div>
                        <Button buttonTxt="예약상담 신청" buttonSize="large" onPress={() => {
                            requestConsulting(1);
                        }} />
                    </div>
                </div>
            </div>
        </Layout >
    )
}
