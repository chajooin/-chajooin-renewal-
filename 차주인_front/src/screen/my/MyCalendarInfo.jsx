import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import "../../css/my/my-calendar-info.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';

import * as APIS from "../../utils/service";
import { addHyphenToPhoneNumber, goBackPage, numFormat } from '../../utils/utils';
import MyNavigator from './components/MyNavigator';
import { API_URL } from '../../libs/apiUrl';
import { close, loadingflas, open } from '../../redux/popupSlice';
import { MessageSend } from '../../component/popups/MessageBox';
import { selectUserInfo } from '../../redux/userSlice';

export default function MyCalendarInfo({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { userInfo } = useSelector(selectUserInfo)

    const params = new URLSearchParams(window.location.search);

    const [infoData, setInfoData] = useState({})
    const [tabIndex, setTabIndex] = useState(1) // 0=받은 1=보낸

    const [message, setMessage] = useState();
    const [isSend, setIsSend] = useState(false);

    useEffect(() => {
        console.log(location.state)
        if (location.state?.tabIndex) {
            setTabIndex(location.state?.tabIndex)
        }


        if (params.get("idx")) {
            APIS.postData(API_URL.calendar.info, { idx: params.get("idx") })
                .then((result) => {
                    console.log("🚀 ~ .then ~ result:", result.data)
                    setInfoData(result.data)
                })
                .catch(e => {
                    console.log(e)
                })
        }
        else
            goBackPage(navigate);
    }, [])


    const msgPopup = (msg) => {
        dispatch(
            open({
                content: msg,
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                onPress: () => { dispatch(close()); },
            })
        );
    }

    const requestMessage = () => {
        let sendData = {
            target_idx: infoData?.u_idx,
            desc: message,
        }
        console.log(sendData);
        dispatch(loadingflas({ loading: true }))

        APIS.postData(API_URL.user.sendMessage, sendData)
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                msgPopup("쪽지를 보냈습니다.")
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
            })
    }

    useEffect(() => {
        if (isSend) {
            setIsSend(false);
            requestMessage()
        }
    }, [isSend])

    const sendMessage = () => {
        console.log("쪽지 보내요.")
        dispatch(
            open({
                component: <MessageSend
                    onChange={setMessage}
                    noneMt
                />,
                button: "쪽지보내기",
                buttonCencle: "닫기",
                onPress: () => {
                    dispatch(close());
                    setIsSend(true);
                },
                onCancelPress: () => {
                    dispatch(close());
                }
            })
        );
    }

    return (
        <Layout header={false} footters={false} >
            <div className="myCalendarInfoContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { navigate("/mypageCalendar", { replace: true }) }} />
                    <div className="titleInfo">
                        <div className="text">예약상담</div>
                    </div>

                    {<div className="quick-alamContain">
                        <div className="box" onClick={() => { navigate("/message") }}>
                            <img src="/images/icons/mail-line.svg" alt="" />
                            {userInfo?.message_count > 0 && <div className="num">{userInfo?.message_count}</div>}
                        </div>
                    </div>}
                </div>

                <div className="infoBox margint60">
                    <MyNavigator list={[
                        { title: "마이" },
                        { title: "예약상담" },
                        { title: "상세보기", isSelect: true }
                    ]} />

                    <div className="line"></div>

                    <div className="contents">
                        {tabIndex == 0 && <div className="name-text"><span className='bolds'>{infoData?.name}</span>님으로부터 예약상담요청이 도착했습니다.</div>}
                        <div className="title">{infoData?.board_title}</div>
                        <div className="sub-info">{infoData?.board_sub_data}</div>

                        <div className="row-box">
                            <div className="row">
                                <div className="r-name">성함</div>
                                <div className="r-value">{infoData?.name}</div>
                            </div>
                            <div className="row">
                                <div className="r-name">연락처</div>
                                <div className="r-value">{addHyphenToPhoneNumber(infoData?.hp)}</div>
                            </div>
                            <div className="row">
                                <div className="r-name">주소</div>
                                <div className="r-value">{infoData?.sido} {infoData?.sigungu}</div>
                            </div>
                            <div className="row">
                                <div className="r-name ttop">요청사항</div>
                                <div className="r-value" dangerouslySetInnerHTML={{ __html: String(infoData?.desc).replaceAll("\n", "<br>") }}>
                                </div>
                            </div>
                        </div>

                        <div className="btn-box">
                            <Button
                                styles={{ flex: 1 }}
                                buttonTxt="쪽지보내기"
                                buttonShape="white"
                                buttonSize="large"
                                onPress={() => {
                                    sendMessage()
                                }}
                            />
                            <Button
                                styles={{ flex: 1 }}
                                buttonTxt="전화하기"
                                buttonSize="large"
                                onPress={() => {
                                    document.location.href = `tel:${infoData?.hp}`
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}