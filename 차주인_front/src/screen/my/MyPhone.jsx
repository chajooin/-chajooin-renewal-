import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/my/my-phone.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';
import MyNavigator from "./components/MyNavigator"

import * as APIS from "../../utils/service";
import { API_URL } from '../../libs/apiUrl';
import { goBackPage, numFormat } from '../../utils/utils';
import Input from '../../component/Input';
import { close, open } from '../../redux/popupSlice';
import { selectUserInfo } from '../../redux/userSlice';

export default function MyPhone({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector(selectUserInfo)

    const [isTimer, setTimer] = useState(false)

    const [phone, setPhone] = useState("")
    const [phLock, setphLock] = useState("")
    const [phoneErr, setPhoneErr] = useState("")
    const [authNum, setAuthNum] = useState("")
    const [authNumErr, setAuthNumErr] = useState("")

    const openPopup = (msg) => {
        dispatch(
            open({
                content: msg,
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                onPress: () => {
                    dispatch(close())
                }
            })
        );
    }

    const sendAuthNum = () => {
        APIS.postData(API_URL.user.sendAuth, { hp: phone })
            .then((result) => {
                setphLock(true)
                setTimer(true)
            }).catch(e => {
                console.log(e.response.data)
                let data = e.response.data
                setPhoneErr(data.msg)
            })
    }

    const sendCheckAuth = () => {
        APIS.postData(API_URL.user.checkAuth, { certification: authNum })
            .then((result) => {
                dispatch(open({
                    content: "휴대폰 변경이 완료되었습니다.",
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    onPress: () => {
                        dispatch(close())
                        goBackPage(navigate);
                    }
                }))
            }).catch(e => {
                console.log(e.response.data)
                let data = e.response.data
                setAuthNumErr(data?.msg)
            })
    }
    return (
        <Layout header={false} footters={false} >
            <div className="myPhoneContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { navigate("/mypageInfo", { replace: true }) }} />
                    <div className="titleInfo">
                        <div className="text">휴대폰 변경</div>
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
                        { title: "내정보" },
                        { title: "휴대폰 변경", isSelect: true }
                    ]} />
                    <div className="line"></div>

                    <div className="big-title">
                        휴대폰 변경
                    </div>

                    <div className="phone-number-box">
                        <div className="title">
                            휴대폰 번호를 인증해주세요.
                        </div>
                        <div className="box">
                            <Input
                                className={`inputs input-315`}
                                placeholder="“-” 없이 숫자만 입력"
                                setValue={(v) => {
                                    setPhone(v)
                                    if (phoneErr) setPhoneErr("")
                                }}
                                value={phone}
                                error={phoneErr}
                                readOnly={phLock}
                                type="number"
                                valid="number"
                            />
                            <Button
                                styles={{ width: 80 }}
                                buttonTxt="인증요청"
                                onPress={() => {
                                    console.log("인증번호 요청")
                                    sendAuthNum()
                                }}
                                disabled={phLock}
                            />
                        </div>
                    </div>

                    <div className="phone-number-box">
                        <div className="title">
                            인증번호를 입력해 주세요.
                        </div>
                        <div className="box">
                            <Input
                                className={`inputs input-315`}
                                placeholder="인증번호 입력"
                                setValue={(v) => {
                                    setAuthNum(v)
                                    if (authNumErr) authNumErr("")
                                }}
                                value={authNum}
                                timer={isTimer}
                                timerState={() => {
                                    openPopup("인증시간이 만료되었습니다.")
                                    setphLock(false)
                                    setTimer(false)
                                }}
                                error={authNumErr}
                                readOnly={!isTimer}
                                type="number"
                            />
                            <Button
                                styles={{ width: 80 }}
                                buttonTxt="인증하기"
                                // buttonSize="large"
                                onPress={() => {
                                    sendCheckAuth()
                                }}
                                disabled={!isTimer}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </Layout >
    )
}