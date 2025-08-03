import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Swiper as OrgSwiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import Layout from "../../layout/Layout";

import { Link, useNavigate } from 'react-router-dom';
import Swiper from "../../component/SwiperStyle1"
import Selector from "../../component/Select"
import consts from "../../libs/consts"

import * as APIS from "../../utils/service";
import { bannerOpen } from '../../redux/bannerSlice';
import { setHomeInfo } from '../../redux/homeSlice';
import { API_URL } from '../../libs/apiUrl';
import { dateformat, findIndex, Ismobiles, numFormat, yearList } from '../../utils/utils';
import Radios from '../../component/Radios';
import Checkbox from '../../component/Checkbox';
import { close, open } from '../../redux/popupSlice';
import userInfo, { setUserInfo } from '../../redux/userSlice';
import { DefaultImg } from '../../component/DefaultImg';
import Button from '../../component/Button';

const MoveBox = ({
    elId,
    onLeft,
    onRight
}) => {

    const el = document.querySelector(elId)

    return <div className="move-arrow-box">
        <button style={{ width: 62, height: 62 }} onClick={() => {
            if (onLeft) onLeft(el)
        }}>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 36 36" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.5607 6.43934C24.1464 7.02513 24.1464 7.97487 23.5607 8.56066L14.1213 18L23.5607 27.4393C24.1464 28.0251 24.1464 28.9749 23.5607 29.5607C22.9749 30.1464 22.0251 30.1464 21.4393 29.5607L10.9393 19.0607C10.3536 18.4749 10.3536 17.5251 10.9393 16.9393L21.4393 6.43934C22.0251 5.85355 22.9749 5.85355 23.5607 6.43934Z" fill="#666" />
            </svg> */}
            <img style={{ width: "100%", height: "100%" }} src="/images/icons/slide-arrow-left.svg" ></img>
        </button>
        <button style={{ width: 62, height: 62, marginLeft: "calc(100% - 124px)" }} onClick={() => {
            if (onRight) onRight(el)
        }}>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 36 36" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4393 6.43934C13.0251 5.85355 13.9749 5.85355 14.5607 6.43934L25.0607 16.9393C25.6464 17.5251 25.6464 18.4749 25.0607 19.0607L14.5607 29.5607C13.9749 30.1464 13.0251 30.1464 12.4393 29.5607C11.8536 28.9749 11.8536 28.0251 12.4393 27.4393L21.8787 18L12.4393 8.56066C11.8536 7.97487 11.8536 7.02513 12.4393 6.43934Z" fill="#666" />
            </svg> */}
            <img style={{ width: "100%", height: "100%" }} src="/images/icons/slide-arrow-right.svg" ></img>
        </button>
    </div>
}

const FreightCard = ({ className, img, title, subTitle, price, isLight, onClick }) => {
    return <div className={`freight-card ${className && className}`} onClick={() => {
        onClick && onClick();
    }}>
        <img src={img} alt="" onError={DefaultImg} />
        {isLight && <img className="lightning" src="/images/icons/lightning.svg" alt="" onError={DefaultImg} />}
        <div className="info">
            <div className="infoTitle fontsize20 bolds">
                {title}
            </div>
            <div className="infoSubTitle fontsize14 margint4 color666">
                {subTitle}
            </div>

            <div className="infoPrice fontsize16 margint12 bolds">
                {price}만원
            </div>
        </div>
    </div>
}

export default function Home({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { homeInfo } = useSelector(s => s.homeReducer)
    const { configInfo, carTypes, subCarTypes, configSidos } = useSelector(s => s.configReducer)
    const { userInfo } = useSelector(s => s.userReducer)

    const [isLogin, setLogin] = useState(false);
    const [tabIndex, setTabIndex] = useState(0)

    const [usedSwiper, setUsedSwiper] = useState(null);
    const [el_recommend, set_el_recommend] = useState(null);
    const [recommandData, setRecommandData] = useState({
        jeeip_list: [],
        truck_list: []
    })

    const [usageOption, setUsageOption] = useState(-1)
    const [carTypeIndex, setCarTypeIndex] = useState(-1)
    const [carSubTypeIndex, setCarSubTypeIndex] = useState(-1)
    const [usedStartYear, setUsedStartYear] = useState(-1)
    const [usedEndYear, setUsedEndYear] = useState(-1)
    const [usedStartDistance, setUsedStartDistance] = useState(-1)
    const [usedEndDistance, setUsedEndDistance] = useState(-1)
    const [usedMinPrice, setUsedMinPrice] = useState(-1)
    const [usedMaxPrice, setUsedMaxPrice] = useState(-1)
    const [truckCheckNum, setTruckCheckNum] = useState([]);

    const [checkItem, setCheckItem] = useState([]);
    const [selSido, setSelSido] = useState(-1)
    const [minPay, setMinPay] = useState(-1)
    const [maxPay, setMaxPay] = useState(-1)
    const [checkUnloading, setCheckUnloading] = useState([]);
    const [checkNum, setCheckNum] = useState([]);

    const [resetFilter, setResetFilter] = useState(false);

    const setFilterData = () => {
        // console.log(userInfo?.filter)
        if (userInfo?.filter?.usage) setUsageOption(userInfo?.filter?.usage)
        if (userInfo?.filter?.type) setCarTypeIndex(findIndex(userInfo?.filter?.type, carTypes))
        let eCarTypeIndex = findIndex(userInfo?.filter?.type, carTypes)
        if (userInfo?.filter?.sub_type && eCarTypeIndex >= 0) {
            setCarSubTypeIndex(findIndex(userInfo?.filter?.sub_type, subCarTypes[eCarTypeIndex]))
        }
        if (userInfo?.filter?.min_year) setUsedStartYear(userInfo?.filter?.min_year)
        if (userInfo?.filter?.max_year) setUsedEndYear(userInfo?.filter?.max_year)
        if (userInfo?.filter?.min_distance || userInfo?.filter?.min_distance == 0) setUsedStartDistance(userInfo?.filter?.min_distance)
        if (userInfo?.filter?.max_distance) setUsedEndDistance(userInfo?.filter?.max_distance)
        if (userInfo?.filter?.min_price || userInfo?.filter?.min_price == 0) setUsedMinPrice(userInfo?.filter?.min_price)
        if (userInfo?.filter?.max_price) setUsedMaxPrice(userInfo?.filter?.max_price)
        if (userInfo?.filter?.truck_license_type) setTruckCheckNum(userInfo?.filter?.truck_license_type?.split(",").map(v => { return { values: v, labels: v } }))
        //values, labels
        if (userInfo?.filter?.item) setCheckItem(userInfo?.filter?.item?.split(",").map(v => { return { values: v, labels: v } }))
        // if (userInfo?.filter?.sido) setSelSido(userInfo?.filter?.sido)
        if (userInfo?.filter?.go_sido) setSelSido(userInfo?.filter?.go_sido)
        if (userInfo?.filter?.min_pay) setMinPay(userInfo?.filter?.min_pay)
        if (userInfo?.filter?.max_pay) setMaxPay(userInfo?.filter?.max_pay)
        if (userInfo?.filter?.unloading) setCheckUnloading(userInfo?.filter?.unloading?.split(",").map(v => { return { values: v, labels: v } }))
        if (userInfo?.filter?.jeeip_license_type) setCheckNum(userInfo?.filter?.jeeip_license_type?.split(",").map(v => { return { values: v, labels: v } }))
    }

    const sendMainFilter = () => {
        console.log("🚀 ~ sendMainFilter ~ usedStartYear:", usedStartYear)
        let sendData = {
            usage: usageOption != -1 ? usageOption : undefined,
            type: carTypeIndex != -1 ? carTypes[carTypeIndex] : undefined,
            sub_type: carSubTypeIndex != -1 ? subCarTypes[carTypeIndex][carSubTypeIndex] : undefined,
            min_year: usedStartYear != -1 ? usedStartYear.toString() : undefined,
            max_year: usedEndYear != -1 ? usedEndYear.toString() : undefined,
            min_distance: usedStartDistance != -1 ? usedStartDistance.toString() : undefined,
            max_distance: usedEndDistance != -1 ? usedEndDistance.toString() : undefined,
            min_price: usedMinPrice != -1 ? usedMinPrice.toString() : undefined,
            max_price: usedMaxPrice != -1 ? usedMaxPrice.toString() : undefined,
            item: checkItem.map(v => v.values),
            go_sido: selSido != -1 ? selSido : undefined,
            min_pay: minPay != -1 ? minPay : undefined,
            max_pay: maxPay != -1 ? maxPay : undefined,
            unloading: checkUnloading.map(v => v.values),
            jeeip_license_type: checkNum.map(v => v.values),
            truck_license_type: truckCheckNum.map(v => v.values)
        }
        // return;
        APIS.postData(API_URL.home.filterSave, sendData)
            .then((result) => {
                if (result.data) {
                    window.location.reload();
                }
                loadHome();

            }).catch((result) => {
                dispatch(
                    open({
                        content: result.response?.data?.msg,
                        onCancelPress: false,
                        titleviewer: false,
                        button: "확인",
                        onPress: () => { dispatch(close()) },
                    })
                );
            })
    }

    const loadHome = () => {
        APIS.postData(API_URL.home.info, {}).then(result => {
            let homeData = result.data
            dispatch(setHomeInfo({ homeInfo: homeData }));

            if (homeData?.popup_list) {
                setTimeout(() => {
                    dispatch(
                        bannerOpen({
                            bannerList: homeData?.popup_list
                        })
                    );
                }, 10)
            }
        }).catch(e => {
            console.log("홈정보 가져오기 실패!")
        })

        if (localStorage.getItem("token")) {
            setLogin(true)
            loadRecommand();
        }
    }

    const loadRecommand = () => {
        APIS.postData(API_URL.home.filterData, {}).then(result => {
            let trucks = result.data.truck_list ? result.data.truck_list : []
            let jeeips = result.data.jeeip_list ? result.data.jeeip_list : []
            setRecommandData({
                truck_list: trucks,
                jeeip_list: jeeips,
            });
        }).catch(e => {
            console.log(e)
        })
    }



    useEffect(() => {
        set_el_recommend(document.querySelector(".main-swiper-box"))
        if (localStorage.getItem("token")) {
            setLogin(true)
        }

        loadHome();
    }, [])

    // useEffect(() => {
    //     setUsedEndYear(usedStartYear)
    // }, [usedStartYear])

    useEffect(() => {
        console.log("홈 정보!!", homeInfo)
    }, [homeInfo])

    useEffect(() => {
        console.log("🚀 ~ Home ~ subCarTypes:", subCarTypes)
    }, [subCarTypes])

    return (
        <Layout header={true}>
            <div className="mainContain">
                <div className="bgboxW">
                    <div className="slideBox">
                        <Swiper
                            listsImag={homeInfo?.main_banner?.map((v, i) => {
                                return consts.s3url + v.pc_path;
                            })}
                            listsImagMobile={homeInfo?.main_banner?.map((v, i) => {
                                return consts.s3url + v.m_path;
                            })}
                            imgStyles={{
                                height: "auto",
                                aspectRatio: 3,
                                minHeight: 170,
                                objectFit: "cover",
                                cursor: "pointer"
                            }}
                            onItemClick={(index) => {
                                console.log(homeInfo?.main_banner[index].url)
                                let mb_url = homeInfo?.main_banner[index]?.url
                                if (mb_url) {
                                    if (mb_url.indexOf("http") >= 0) {
                                        console.log("여기")
                                        window.open(mb_url, "__blank")
                                    } else {
                                        navigate(mb_url)
                                    }
                                }
                            }}
                            isPagenation
                        />
                    </div>
                </div>

                <div className="bgboxW">
                    <div className="menuBox webCardMenu">
                        <div className="card">
                            <div className="title fontsize24">
                                <span className='bolds fontsize24'>화물차 거래</span>를 찾으시나요?
                            </div>
                            <div className="buttonBox">
                                <div className="button bgSearch" onClick={() => { navigate("/usedCar") }}>
                                    <img src="/images/icons/search.svg" alt="" />
                                    <div className='fontsize16 bolds color3B4894'>매물 확인</div>
                                </div>
                                <div className="button bgAction" onClick={() => { navigate("/usedCarAdd") }}>
                                    <img src="/images/icons/hand-cursor.svg" alt="" />
                                    <div className='fontsize16 bolds colorFF2323'>판매 신청</div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="title fontsize24">
                                <span className='bolds fontsize24'>지입차 거래</span>를 찾으시나요?
                            </div>

                            <div className="buttonBox">
                                <div className="button bgSearch" onClick={() => { navigate("/rentedCar") }}>
                                    <img src="/images/icons/search.svg" alt="" />
                                    <div className='fontsize16 bolds color3B4894'>매물 확인</div>
                                </div>
                                <div className="button bgAction" onClick={() => { navigate("/rentedCarAdd") }}>
                                    <img src="/images/icons/hand-cursor.svg" alt="" />
                                    <div className='fontsize16 bolds colorFF2323'>판매 신청</div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="title fontsize24">
                                <span className='bolds fontsize24'>기사 구인구직</span>을 찾으시나요?
                            </div>

                            <div className="buttonBox">
                                <div className="button bgSearch" onClick={() => { navigate("/joboffer") }}>
                                    <img src="/images/icons/contacts.svg" alt="" />
                                    <div className='fontsize16 bolds color3B4894'>구인 찾기</div>
                                </div>
                                <div className="button bgAction" onClick={() => { navigate("/jobsearch") }}>
                                    <img src="/images/icons/briefcase.svg" alt="" />
                                    <div className='fontsize16 bolds colorFF2323'>구직 찾기</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bgboxN">
                    <div className="freightBox">
                        <div className='title fontsize32 color2F3444 bolds'>추천 화물차</div>
                        <div className="main-swiper-contain">
                            {
                                homeInfo?.truck_list?.length <= 0 ?
                                    <div className="color999" style={{ width: "100%", textAlign: "center" }}> 추천 목록이 없습니다.</div> :
                                    <div className={`main-swiper-box ${homeInfo?.truck_list?.length < 5 && "one-line"}`}>
                                        {
                                            homeInfo?.truck_list?.map((v, i) => {
                                                return <FreightCard
                                                    key={`FreightCard-item-${i}`}
                                                    img={consts.s3url + v?.thumb}
                                                    title={v?.title}
                                                    subTitle={`${v?.year.slice(-2)}/${v?.month}식 · ${v?.transmission} · ${numFormat(v?.distance)}km · ${v?.sido}`}
                                                    price={numFormat(v?.price + v?.license_price, true)}
                                                    onClick={() => {
                                                        window.open("/usedCarInfo?idx=" + v?.idx)
                                                    }}
                                                    isLight={v?.ad ? true : false}
                                                // isLight
                                                />
                                            })
                                        }
                                    </div>
                            }
                        </div>
                    </div>
                </div>

                {/* 모바일용 */}
                <div className="bgboxN">
                    <div className="menuBox mobileCardMenu">
                        <div className="card">
                            <div className="title fontsize24">
                                <span className='bolds fontsize24'>화물차 거래</span>를 찾으시나요?
                            </div>

                            <div className="buttonBox">
                                <div className="button bgSearch" onClick={() => { navigate("/usedCar") }}>
                                    <img src="/images/icons/search.svg" alt="" />
                                    <div className='fontsize16 bolds color3B4894'>매물 확인</div>
                                </div>
                                <div className="button bgAction" onClick={() => { navigate("/usedCarAdd") }}>
                                    <img src="/images/icons/hand-cursor.svg" alt="" />
                                    <div className='fontsize16 bolds colorFF2323'>판매 신청</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bgboxW">
                    <div className="salecarBox">
                        <div className='title fontsize32 color2F3444 bolds'>
                            추천 지입차
                        </div>
                        {
                            homeInfo?.jeeip_list?.length <= 0 ?
                                <div className="color999" style={{ width: "100%", textAlign: "center" }}> 추천 목록이 없습니다.</div> :
                                <div id="scb-cho-trucks-box" className="scrollBox">
                                    <div className="rowBox">
                                        {homeInfo?.jeeip_list?.map((v, i) => {
                                            return <div className="salecarCard" onClick={() => {
                                                window.open("/rentedCarInfo?idx=" + v?.idx)
                                            }}>
                                                <div className="infoBox">
                                                    <div className="info">
                                                        <div className='content-f'>
                                                            <div className="type fontsize14 color3B4894">{v?.type}</div>
                                                            <div className="price margint12">
                                                                <span className='fontsize20 color666'>
                                                                    <span className='fontsize36 color3B4894 bolds'>{numFormat(v?.price + v?.license_price, true)}</span> 만원
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className='content-s'>
                                                            <div className='cinfo'>
                                                                <div className='ci-title fontsize16 color666'>운행지역</div>
                                                                <div className='ci-text fontsize16 bolds'>{`${v?.go_sido}${v?.go_sigungu && " " + v?.go_sigungu}`}</div>
                                                            </div>
                                                            <div className='cinfo'>
                                                                <div className='ci-title fontsize16 color666'>시간</div>
                                                                <div className='ci-text fontsize16 bolds'>{v?.work}</div>
                                                            </div>
                                                            <div className='cinfo'>
                                                                <div className='ci-title fontsize16 color666'>급여</div>
                                                                <div className='ci-text fontsize16 bolds'>{numFormat(v.pay)}만원[{v.paytype}]</div>
                                                            </div>
                                                            <div className='cinfo'>
                                                                <div className='ci-title fontsize16 color666'>인수금</div>
                                                                <div className='ci-text fontsize16 bolds'>{numFormat(v.price)}만원</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="adBox fontsize16 color2F3444">{v.title}</div>
                                                </div>
                                                <div className="photo">
                                                    {v?.ad ? <img className="lightning" src="/images/icons/lightning.svg" alt="" /> : <></>}
                                                    <img className="thumb" style={{ objectFit: "cover", }} src={consts.s3url + v.thumb} alt="" onError={DefaultImg} />
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                        }

                    </div>
                </div>

                {/* 모바일용 */}
                <div className="bgboxW">
                    <div className="menuBox mobileCardMenu">
                        <div className="card">
                            <div className="title fontsize24">
                                <span className='bolds fontsize24'>지입차 거래</span>를 찾으시나요?
                            </div>

                            <div className="buttonBox">
                                <div className="button bgSearch" onClick={() => { navigate("/rentedCar") }}>
                                    <img src="/images/icons/search.svg" alt="" />
                                    <div className='fontsize16 bolds color3B4894'>매물 확인</div>
                                </div>
                                <div className="button bgAction" onClick={() => { navigate("/rentedCarAdd") }}>
                                    <img src="/images/icons/hand-cursor.svg" alt="" />
                                    <div className='fontsize16 bolds colorFF2323'>판매 신청</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bgboxN">
                    <div className="recommandBox">
                        {isLogin ? <>
                            {(userInfo?.filter && !resetFilter) ?
                                <>
                                    {/* {false ? <> */}
                                    <div className='title-btn'>
                                        <div className='.ttitle fontsize32 color2F3444 bolds'>{userInfo?.name}님의 조건에 맞는 차량정보입니다.</div>
                                        <div className="reset-btn fontsize14 color3B4894 bolds"
                                            onClick={() => {
                                                setResetFilter(true)
                                                setFilterData()
                                            }}>
                                            조건 재설정
                                            <img className="reset" src="/images/icons/loop-left-line.svg" alt="" />
                                        </div>
                                    </div>

                                    <div className="conditionBox">
                                        <div className='title fontsize24 bolds'>화물차</div>
                                        <div style={{
                                            position: "relative",
                                            width: "100%"
                                        }}>
                                            {recommandData.truck_list.length > 2 && <MoveBox
                                                elId="#scb-truck-box"
                                                onLeft={(el) => {
                                                    if (el.scrollLeft % 1220 == 0)
                                                        el?.scrollTo(el.scrollLeft - 1220, 0);
                                                    else {
                                                        el?.scrollTo((el.scrollLeft - (el.scrollLeft % 1220)), 0);
                                                    }
                                                }}
                                                onRight={(el) => {
                                                    if (el.scrollLeft % 1220 == 0)
                                                        el?.scrollTo(el.scrollLeft + 1220, 0);
                                                    else {
                                                        el?.scrollTo((el.scrollLeft + ((1220 - el.scrollLeft % 1220))), 0);
                                                    }
                                                }}
                                            />}
                                            <div id="scb-truck-box" className="scrollBox">
                                                <div className="contents" style={{ width: recommandData.truck_list.length <= 0 ? "100%" : "" }}>
                                                    {recommandData.truck_list.length > 0 ? recommandData.truck_list.map((v, i) => {
                                                        return <div className="conditionCard" onClick={() => [
                                                            window.open("/usedCarInfo?idx=" + v?.idx)
                                                        ]}>
                                                            <img src={consts.s3url + v.photo_3} alt="" onError={DefaultImg} />
                                                            <div className="reInfo">
                                                                <div className='title fontsize20 bolds'>{v?.title}</div>
                                                                <div className='suTitle fontsize14 color666'>{v?.year?.slice(-2)}/{v?.month}식 · {v?.transmission} · {numFormat(v?.distance)}km · {v?.sido}</div>
                                                                <div className='price'>
                                                                    {v?.license_sell == 1 ? <div className='option fontsize14 color3B4894'>{v?.license_type}</div> : <div></div>}
                                                                    <div className='bolds'>{numFormat(v?.price + v?.license_price)}만원</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }) : <p className="main_filter_placeholder color999">조건에 맞는 차량정보가 없습니다.</p>}
                                                </div>
                                            </div>
                                        </div>


                                        <div className='title fontsize24 bolds'>지입차</div>
                                        <div style={{
                                            position: "relative",
                                            width: "100%"
                                        }}>
                                            {recommandData.jeeip_list.length > 2 && <MoveBox
                                                elId="#scb-jeeip-box"
                                                onLeft={(el) => {
                                                    if (el.scrollLeft % 1220 == 0)
                                                        el?.scrollTo(el.scrollLeft - 1220, 0);
                                                    else {
                                                        el?.scrollTo((el.scrollLeft - (el.scrollLeft % 1220)), 0);
                                                    }
                                                }}
                                                onRight={(el) => {
                                                    if (el.scrollLeft % 1220 == 0)
                                                        el?.scrollTo(el.scrollLeft + 1220, 0);
                                                    else {
                                                        el?.scrollTo((el.scrollLeft + ((1220 - el.scrollLeft % 1220))), 0);
                                                    }
                                                }}
                                            />}
                                            <div id="scb-jeeip-box" className="scrollBox">
                                                <div className="contents" style={{ width: recommandData.jeeip_list.length <= 0 ? "100%" : "" }}>
                                                    {recommandData.jeeip_list.length > 0 ? recommandData.jeeip_list.map((v, i) => {
                                                        return <div className="conditionCard" onClick={() => [
                                                            window.open("/rentedCarInfo?idx=" + v?.idx)
                                                        ]}>
                                                            <img src={consts.s3url + v.photo_3} alt="" onError={DefaultImg} />
                                                            <div className="reInfo">
                                                                <div className='title fontsize20 bolds'>{v?.title}</div>
                                                                <div className='suTitle fontsize14 color666'>{v?.year?.slice(-2)}/{v?.month}식 · {v?.transmission} · {numFormat(v?.distance)}km · {v?.sido}</div>
                                                                <div className='price'>
                                                                    {v?.license_sell == 1 ? <div className='option fontsize14 color3B4894'>{v?.license_type}</div> : <div></div>}
                                                                    <div className='bolds'>{numFormat(v?.price + v?.license_price)}만원</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }) : <p className="main_filter_placeholder color999" >조건에 맞는 차량정보가 없습니다.</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="moreBox" onClick={() => {
                                            navigate("/usedCar")
                                        }}>
                                            <span className="fontsize16 color3B4894 bolds">차량전체 보기</span>
                                            <img className="r-arrow" src="/images/icons/chevron-right.svg" alt="" />
                                        </div>
                                    </div>
                                </> :
                                <>
                                    <div className='title fontsize32 color2F3444 bolds'>나의 조건에 맞는 차량 찾기</div>
                                    <div className="findBox">
                                        <div className="tabSelector">
                                            <div
                                                className={`tab fontsize20 bolds ${tabIndex == 0 && "select"}`}
                                                onClick={() => { setTabIndex(0) }}
                                            >
                                                중고 화물차
                                            </div>
                                            <div
                                                className={`tab fontsize20 bolds ${tabIndex == 1 && "select"}`}
                                                onClick={() => { setTabIndex(1) }}
                                            >
                                                지입차
                                            </div>
                                        </div>

                                        <div className="tabBody">
                                            {
                                                tabIndex == 0 ?
                                                    <>
                                                        <div className="tabBodyRow">
                                                            <div className="tbrTitle font-size">차량용도</div>
                                                            <div className="tbrInfo">
                                                                <Selector
                                                                    subselectClass="selBox"
                                                                    placeholder="선택"
                                                                    values={usageOption}
                                                                    setValues={setUsageOption}
                                                                    selectData={configInfo.options?.usage_option.map((v, i) => { return { values: v, labels: v } })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="tabBodyRow">
                                                            <div className="tbrTitle font-size">형식</div>
                                                            <div className="tbrInfo">
                                                                <Selector subselectClass="selBox"
                                                                    placeholder="형식"
                                                                    values={carTypeIndex}
                                                                    setValues={(value) => {
                                                                        setCarTypeIndex(value)
                                                                        setCarSubTypeIndex(0)
                                                                    }}
                                                                    selectData={carTypes?.map((v, i) => { return { values: i, labels: v } })} />
                                                                <Selector subselectClass="selBox"
                                                                    placeholder="세부형식"
                                                                    values={carSubTypeIndex}
                                                                    setValues={setCarSubTypeIndex}
                                                                    selectData={carTypeIndex >= 0 ? subCarTypes[carTypeIndex] ? subCarTypes[carTypeIndex].map((v, i) => { return { values: i, labels: v } }) : [] : []}
                                                                    disabled={carTypeIndex < 0} />

                                                            </div>
                                                        </div>
                                                        <div className="tabBodyRow">
                                                            <div className="tbrTitle font-size">연식</div>
                                                            <div className="tbrInfo">
                                                                <Selector subselectClass="selBox"
                                                                    placeholder="연도 선택"
                                                                    values={usedStartYear}
                                                                    setValues={setUsedStartYear}
                                                                    selectData={yearList().map((v, i) => { return { values: v, labels: v } })} />
                                                                <Selector subselectClass="selBox"
                                                                    placeholder="연도 선택"
                                                                    values={usedEndYear}
                                                                    setValues={setUsedEndYear}
                                                                    // disabled={usedStartYear < 0}
                                                                    selectData={yearList().map((v, i) => { return { values: v, labels: v } })} />
                                                            </div>
                                                        </div>
                                                        <div className="tabBodyRow">
                                                            <div className="tbrTitle font-size">주행거리</div>
                                                            <div className="tbrInfo">
                                                                <Selector
                                                                    subselectClass="selBox"
                                                                    placeholder="최소 거리"
                                                                    values={usedStartDistance}
                                                                    setValues={setUsedStartDistance}
                                                                    selectData={consts.dirveLength.map((v, i) => { return { values: v, labels: `${numFormat(v)} km` } })} />
                                                                <Selector
                                                                    subselectClass="selBox"
                                                                    placeholder="최대 거리"
                                                                    values={usedEndDistance}
                                                                    setValues={setUsedEndDistance}
                                                                    selectData={consts.dirveLength.map((v, i) => { return { values: v, labels: `${numFormat(v)} km` } })} />
                                                            </div>
                                                        </div>
                                                        <div className="tabBodyRow">
                                                            <div className="tbrTitle font-size">차량가격</div>
                                                            <div className="tbrInfo">
                                                                <Selector subselectClass="selBox"
                                                                    placeholder="최소 금액"
                                                                    values={usedMinPrice}
                                                                    setValues={setUsedMinPrice}
                                                                    selectData={consts.priceList.map((v) => { return { values: v, labels: `${numFormat(v)} 만원` } })} />
                                                                <Selector subselectClass="selBox"
                                                                    placeholder="최대 금액"
                                                                    values={usedMaxPrice}
                                                                    setValues={setUsedMaxPrice}
                                                                    selectData={consts.priceList.map((v) => { return { values: v, labels: `${numFormat(v)} 만원` } })} />
                                                            </div>
                                                        </div>

                                                        <div className="tabBodyRow">
                                                            <div className="tbrTitle font-size">넘버승계</div>
                                                            <div className="tbrInfo">
                                                                <Checkbox
                                                                    linetype={'checkimg'}
                                                                    values={truckCheckNum}
                                                                    setvalues={setTruckCheckNum}
                                                                    namevalue={configInfo.options?.license_option?.map((v, i) => {
                                                                        return { names: v, values: v }
                                                                    })}
                                                                    fontweights={400}
                                                                    fontSizes={16}
                                                                    sizes={24}
                                                                />
                                                            </div>
                                                        </div>
                                                    </> :
                                                    <>
                                                        <div className="tabBodyRow">
                                                            <div className="tbrTitle font-size">운송품목</div>
                                                            <div className="tbrInfo">
                                                                <Checkbox
                                                                    linetype={'checkimg'}
                                                                    values={checkItem}
                                                                    setvalues={setCheckItem}
                                                                    namevalue={configInfo.options?.item_option?.map((v, i) => {
                                                                        return { names: v, values: v }
                                                                    })}
                                                                    fontweights={400}
                                                                    fontSizes={16}
                                                                    sizes={24}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="tabBodyRow">
                                                            <div className="tbrTitle font-size">지역</div>
                                                            <div className="tbrInfo">
                                                                <Selector
                                                                    subselectClass="selBox"
                                                                    placeholder="지역 선택"
                                                                    values={selSido}
                                                                    setValues={setSelSido}
                                                                    selectData={configSidos?.map((v) => { return { values: v, labels: v } })} />
                                                            </div>
                                                        </div>
                                                        <div className="tabBodyRow">
                                                            <div className="tbrTitle font-size">급여</div>
                                                            <div className="tbrInfo">
                                                                <Selector
                                                                    subselectClass="selBox"
                                                                    placeholder="최소 금액"
                                                                    values={minPay}
                                                                    setValues={setMinPay}
                                                                    selectData={consts.payList.map((v) => { return { values: v, labels: numFormat(v) + "만원" } })}
                                                                />
                                                                <Selector
                                                                    subselectClass="selBox"
                                                                    placeholder="최대 금액"
                                                                    values={maxPay}
                                                                    setValues={setMaxPay}
                                                                    selectData={consts.payList.map((v) => { return { values: v, labels: numFormat(v) + "만원" } })}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="tabBodyRow">
                                                            <div className="tbrTitle font-size">상하차 방법</div>
                                                            <div className="tbrInfo">
                                                                <Checkbox
                                                                    linetype={'checkimg'}
                                                                    values={checkUnloading}
                                                                    setvalues={setCheckUnloading}
                                                                    namevalue={configInfo.options?.unloading_option?.map((v, i) => {
                                                                        return { names: v, values: v }
                                                                    })}
                                                                    fontweights={400}
                                                                    fontSizes={16}
                                                                    sizes={24}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="tabBodyRow">
                                                            <div className="tbrTitle font-size">넘버승계</div>
                                                            <div className="tbrInfo">
                                                                <Checkbox
                                                                    linetype={'checkimg'}
                                                                    values={checkNum}
                                                                    setvalues={setCheckNum}
                                                                    namevalue={configInfo.options?.license_option?.map((v, i) => {
                                                                        return { names: v, values: v }
                                                                    })}
                                                                    fontweights={400}
                                                                    fontSizes={16}
                                                                    sizes={24}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                            }
                                        </div>

                                        <div className="tabFooter">
                                            <div className="tabInfo fontsize16 color2F3444">조건에 맞는 차량이 등록되면 알림으로 확인하실 수 있습니다.</div>
                                            <div className="tabBtn  fontsize16 colorFFF bolds">
                                                {userInfo?.filter && (
                                                    <Button
                                                        buttonTxt="취소"
                                                        onPress={() => {
                                                            setResetFilter(false);
                                                        }}
                                                        buttonShape="gray"
                                                    />
                                                )}

                                                <Button
                                                    buttonTxt={"확인"}
                                                    onPress={sendMainFilter}
                                                />
                                            </div>

                                        </div>

                                    </div>
                                </>}
                        </> : <>
                            <div className='title fontsize32 color2F3444 bolds'>나의 조건에 맞는 차량 찾기</div>
                            <div className="loginBox">
                                <div className="infoText fontsize24 bolds">로그인하시고 서비스를 이용하세요.</div>
                                <div
                                    className="joinBtn fontsize16 bolds colorFFF"
                                    onClick={() => { navigate("/login") }}
                                >로그인/회원가입</div>
                            </div>
                        </>}






                    </div>
                </div >

                {/* 모바일용 */}
                < div className="bgboxW" >
                    <div className="menuBox mobileCardMenu margint32">
                        <div className="card">
                            <div className="title fontsize24">
                                <span className='bolds fontsize24'>기사 구인구직</span>을 찾으시나요?
                            </div>

                            <div className="buttonBox">
                                <div className="button bgSearch" onClick={() => { navigate("/joboffer") }}>
                                    <img src="/images/icons/contacts.svg" alt="" />
                                    <div className='fontsize16 bolds color3B4894'>구인 찾기</div>
                                </div>
                                <div className="button bgAction" onClick={() => { navigate("/jobsearch") }}>
                                    <img src="/images/icons/briefcase.svg" alt="" />
                                    <div className='fontsize16 bolds colorFF2323'>구직 찾기</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >

                <div className="bgboxW">

                    <div className="partnerBox">
                        <div className='title fontsize32 color2F3444 bolds '>파트너</div>

                        <div className="pSlideBox">
                            <Swiper
                                listsImag={homeInfo?.partner_banner?.map((v, i) => {
                                    return consts.s3url + v.pc_path
                                })}
                                isButton
                                imgStyles={{
                                    height: "auto",
                                    aspectRatio: 6,
                                    objectFit: "cover",
                                    cursor: "pointer",
                                }}
                                onItemClick={(index) => {
                                    let mb_url = homeInfo?.partner_banner[index]?.url
                                    if (mb_url) {
                                        if (mb_url.indexOf("http") >= 0) {
                                            window.open(mb_url, "__blank")
                                        } else {
                                            navigate(mb_url)
                                        }
                                    }

                                }}
                                isPagenation
                                autoplay={{
                                    delay: 3000
                                }}
                            />
                        </div>

                        <div className="notiBox">
                            <div className="callBox">
                                <div className='fontsize24 bolds'>전화상담</div>
                                <div className="callInfo">
                                    <div className="iconBox">
                                        <img src="/images/icons/call.svg" alt="" />
                                    </div>
                                    <div className="tellInfo">
                                        <div className='fontsize36 bolds'>{configInfo?.footer?.hp}</div>
                                        <div className='fontsize16 color666'>평일 09:00~18:00</div>
                                    </div>
                                </div>
                            </div>
                            <div className="listBox">
                                <div className="fontsize24 bolds">공지사항</div>
                                <div className="list">
                                    {homeInfo?.news_list?.map((v, i) => {
                                        return <div className="listItem" onClick={() => {
                                            navigate(`/mypageNotiInfo?idx=${v.idx}`)
                                        }}>
                                            <div className="text fontsize16">{v.title}</div>
                                            <div className="date fontsize14 color666">{dateformat(v.create_dt)}</div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="reportBox">
                            <div className="infoText">
                                <div className="repoTitle bolds fontsize32">국토부 물류신고센터</div>
                                <div className="repoInfo">
                                    <div className='infoText'>지입사기 및 부당행위 시 국토부 물류신고센터 도움을 받으세요!</div>
                                    <div className='infoText'>신고처리 과정에서 신원이 노출될 수 있습니다.</div>
                                    <div className='infoText'>신원 노출을 원하지 않는 경우 전화상담(1855-3954)을 이용하여 주세요.</div>
                                    <div className='infoText'>상담 요청이 많은 경우 통화 연결이 어려울 수 있습니다.</div>
                                    <div className='infoText'>logis112@koila.or.kr 으로 연락처를 남겨주시면 연락드리도록 하겠습니다.</div>
                                </div>

                            </div>
                            <div className="reportBtn" onClick={() => { window.open("https://www.nlic.go.kr/nlic/koilaReportProcess1.action", "_blank") }}>
                                <img src="/images/icons/alarm-warning-white.svg" alt="" />
                                <div className='fontsize20 bolds colorFFF'>신고하기</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        </Layout >
    )
}

