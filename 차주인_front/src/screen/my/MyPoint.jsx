import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/my/my-point.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';
import MyNavigator from "./components/MyNavigator"

import * as APIS from "../../utils/service";
import consts from "../../libs/consts"
import { Ismobiles, dateMinformat, dateformat, goBackPage, numFormat } from '../../utils/utils';
import { close, loadingflas, open } from '../../redux/popupSlice';
import { selectPointInfo, setPointList } from '../../redux/pointSlice';
import { API_URL } from '../../libs/apiUrl';
import { loadUserInfo, selectUserInfo, setUserInfoTest } from '../../redux/userSlice';
import { selectConfig } from '../../redux/configSlice';
import { ChargePoint, ExchangePoint } from '../../component/popups/Point';

export default function MyPoint({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);

    const ConfigData = useSelector(selectConfig)
    const UserData = useSelector(selectUserInfo)
    const PointData = useSelector(selectPointInfo)

    const [isLogin, setIsLogin] = useState(false)
    const [tabIndex, setTabIndex] = useState(1)
    const [isNone, setNone] = useState(false)

    const [chargeItem, setChargeItem] = useState(null)
    const [exchangeData, setExchangeData] = useState(null)

    const [sendCharge, setSendCharge] = useState(0);
    const [sendExchange, setSendExchange] = useState(0);

    const loadData = (typeIndex) => {
        setNone(false)

        APIS.postData(API_URL.point.list, { type: typeIndex })
            .then((result) => {
                if (result.data && result.data.length <= 0) {
                    dispatch(setPointList({ type: tabIndex, list: [] }))
                    setNone(true)
                } else {
                    dispatch(setPointList({ type: tabIndex, list: result.data }))
                }
            }).catch(() => {

            })
    }

    //충전하기
    const requestCharge = () => {
        console.log("충전::", chargeItem)
        if (chargeItem && sendCharge > 0) {
            // let newWindow = window.open("/payLoading", "new", "width=430, height=555, resizable=no, scrollbars=no, status=no;")
            // return
            // dispatch(loadingflas({ loading: true }))

            APIS.postData(API_URL.point.charge, { key: chargeItem.idx })
                .then((result) => {
                    let data = result.data
                    if (Ismobiles())
                        window.open(data.mobile_url, "new")
                    else
                        window.open(data.online_url, "new", "width=430, height=555, resizable=no, scrollbars=no, status=no;")

                    //결제 완료되었을때
                    dispatch(loadUserInfo())
                    loadData(tabIndex)
                }).catch(() => {
                    console.log("결제 실패")
                })
        }
    }

    const msgPopup = (text) => {
        if (text)
            dispatch(open({
                content: text,
                button: "확인",
                titleviewer: false,
                onPress: () => {
                    dispatch(close());
                }
            }))
    }

    //환전하기
    const requestExChange = () => {
        if (exchangeData && sendExchange > 0) {
            console.log("정산::", exchangeData)
            console.log("point:", exchangeData?.point)
            console.log("bank:", exchangeData?.bank)
            console.log("bank_num:", exchangeData?.bank_num)
            console.log("bank_name:", exchangeData?.bank_name)

            if (exchangeData?.point < 10000) {
                // console.log("🚀 ~ requestExChange ~ exchangeData?.point:", exchangeData?.point);
                msgPopup("1만 포인트 이상부터 정산가능합니다.");
                return;
            }
            else if (exchangeData?.bank < 0) {
                msgPopup("은행명을 선택해주세요.");
                return;
            }
            else if (!exchangeData?.bank_num || exchangeData?.bank_num == "") {
                msgPopup("계좌번호를 입력해주세요.");
                return;
            }
            else if (!exchangeData?.bank_name || exchangeData?.bank_name == "") {
                msgPopup("예금주명을 입력해주세요.");
                return;
            }

            APIS.postData(API_URL.point.exchange, { ...exchangeData })
                .then((result) => {
                    console.log("🚀 ~ .then ~ result:", result.data)
                    dispatch(
                        open({
                            content: '정산 요청되었습니다.',
                            button: "확인",
                            titleviewer: false,
                            onPress: () => {
                                dispatch(close());
                            }
                        })
                    );
                    loadData(tabIndex)
                }).catch((e) => {
                    console.log("정산 실패", e)
                    dispatch(
                        open({
                            content: `${e.response.msg ? e.response.msg : "정산요청 실패"}`,
                            button: "확인",
                            titleviewer: false,
                            onPress: () => {
                                dispatch(close());
                            }
                        })
                    );
                })
        }
    }

    const getState = (status) => {
        let index = 0

        let data = ConfigData.configInfo?.consts?.exchangeStatusConsts?.find((v, i) => {
            index = i;
            return v.idx == status
        })

        let color = ""
        if (index == 0) { color = "blue" }
        if (index == 1) { color = "" }
        if (index == 2) { color = "red" }

        return { title: data.title, color };
    }

    useEffect(() => {
        console.log("render point!")
        let token = localStorage.getItem("token");
        setIsLogin(token ? true : false);

        if (params.get("tab")) {
            let tab = Number(params.get("tab"))
            if (!isNaN(tab) && [1, 2, 3, 4].indexOf(tab) >= 0)
                setTabIndex(tab);
        }

    }, [])

    useEffect(() => {
        loadData(tabIndex)
    }, [tabIndex])

    useEffect(() => {
        requestCharge()
    }, [sendCharge])

    useEffect(() => {
        requestExChange()
    }, [sendExchange])

    return (
        <Layout header={false} footters={false} >
            <div className="myPointContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => {
                        // console.log(window.history)
                        // goBackPage(navigate);
                        navigate("/mypage", { replace: true })
                    }} />
                    <div className="titleInfo">
                        <div className="text" onClick={() => dispatch(setUserInfoTest({ value: 2 }))}>포인트</div>
                    </div>

                    {(isLogin) && <div className="quick-alamContain">
                        <div className="box" onClick={() => { navigate("/message") }}>
                            <img src="/images/icons/mail-line.svg" alt="" />
                            {Number(UserData.userInfo?.message_count) > 0 && <div className="num">{UserData.userInfo?.message_count}</div>}
                        </div>
                    </div>}
                </div>
                <div className="infoBox margint60">
                    <MyNavigator list={[
                        { title: "마이" },
                        { title: "포인트", isSelect: true }
                    ]} />
                    <div className="line"></div>

                    <div className="contents">
                        <div className="point-box">
                            <div className="info">
                                <div className="title point">나의 포인트</div>
                                <div className="price">{UserData.userInfo?.point ? numFormat(UserData.userInfo?.point, true) : 0}P</div>
                            </div>
                            <div className="btn-box" >
                            {/* <div className="btn-box" style={{ width: 148 }}> */}
                                <Button
                                    styles={{ flex: 1 }}
                                    buttonTxt="충전하기"
                                    buttonShape="white"
                                    onPress={() => {

                                        if (ConfigData.configInfo?.consts?.exchangeStatusConsts
                                            && ConfigData.configInfo?.consts?.exchangeStatusConsts?.length > 0) {

                                            setChargeItem(ConfigData.configInfo?.consts?.exchangeStatusConsts[0])
                                            dispatch(
                                                open({
                                                    title: "포인트 충전하기",
                                                    titleviewer: true,
                                                    component: <ChargePoint
                                                        items={ConfigData.configInfo?.consts?.payPriceConsts}
                                                        onChange={(item) => { setChargeItem(item) }}
                                                    />,
                                                    button: "충전하기",
                                                    onPress: () => {
                                                        dispatch(close());
                                                        setSendCharge(sendCharge + 1)
                                                    },
                                                    noneMt: true
                                                })
                                            );
                                        } else {
                                            dispatch(
                                                open({
                                                    component: '결제 준비중입니다.',
                                                    button: "확인",
                                                    alert: false,
                                                    onPress: () => {
                                                        dispatch(close());
                                                    }
                                                })
                                            );
                                        }
                                    }}
                                />
                                <Button
                                    styles={{ flex: 1 }}
                                    buttonTxt="정산신청"
                                    onPress={() => {
                                        setExchangeData({})
                                        dispatch(
                                            open({
                                                title: "정산 신청",
                                                titleviewer: true,
                                                component: <ExchangePoint
                                                    point={UserData.userInfo?.point ? UserData.userInfo?.point : 0}
                                                    banks={consts.bankList}
                                                    onChange={(data) => { setExchangeData(data) }}
                                                />,
                                                button: "정산 신청하기",
                                                alert: true,
                                                buttonCencle: "취소",
                                                onPress: () => {
                                                    dispatch(close());
                                                    setSendExchange(sendExchange + 1)
                                                },
                                                onCancelPress: () => {
                                                    dispatch(close());
                                                },
                                                noneMt: true
                                            })
                                        );

                                    }}
                                />
                            </div>
                        </div>

                        <div className="tab-menu-box">
                            {["충전내역", "지급내역", "사용내역", "정산내역"].map((v, i) => {
                            {/* {["충전내역", "지급내역", "사용내역"].map((v, i) => { */}
                                return <div
                                    className={`tab-menu ${i + 1 === tabIndex && "select"}`}
                                    onClick={() => { setTabIndex(i + 1) }}
                                >
                                    {v}
                                </div>
                            })}
                        </div>

                        <div className="list-box">
                            {tabIndex == 1 && <>
                                {PointData?.listType1?.map((v, i) => <div className="list-item">
                                    <div className="title-box">
                                        <div className="title">{dateMinformat(v?.create_dt)}</div>
                                    </div>
                                    <div className="value-box">
                                        <div className="value">{numFormat(v?.point, true)}P</div>
                                    </div>
                                </div>)}
                            </>}
                            {tabIndex == 2 && <>
                                {PointData?.listType2?.map((v, i) => <div className="list-item">
                                    <div className="title-box">
                                        <div className="title">{dateMinformat(v?.create_dt)}</div>
                                        <div className="title bold">{v?.title}</div>
                                    </div>
                                    <div className="value-box">
                                        <div className="value">{numFormat(v?.point * (i + 1), true)}P</div>
                                    </div>
                                </div>)}
                            </>}
                            {tabIndex == 3 && <>
                                {PointData?.listType3?.map((v, i) => <div className="list-item">
                                    <div className="title-box">
                                        <div className="title">{dateMinformat(v?.create_dt)}</div>
                                        <div className="title bold">{v?.title}</div>
                                    </div>
                                    <div className="value-box">
                                        <div className="value red">-{numFormat(v?.point, true)}P</div>
                                    </div>
                                </div>)}
                            </>}
                            {tabIndex == 4 && <>
                                {PointData?.listType4?.map((v, i) => <div className="list-item">
                                    <div className="title-box">
                                        <div className="title">{dateformat(v?.create_dt)}</div>
                                        <div className="title error">{v?.msg}</div>
                                    </div>
                                    <div className="value-box">
                                        <div className="value">{numFormat(v?.point, true)}원</div>
                                        <div className={`state ${getState(v?.status).color}`}>{getState(v.status).title}</div>
                                    </div>
                                </div>)}
                            </>}

                            {isNone && <div className='none-list'>내역이 없습니다.</div>}
                        </div>

                    </div>
                </div>

            </div>
        </Layout >
    )
}