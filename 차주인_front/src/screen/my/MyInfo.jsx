import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/my/my-info.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';
import Input from '../../component/Input';
import MyNavigator from "./components/MyNavigator"

import * as APIS from "../../utils/service";
import { addHyphenToPhoneNumber, goBackPage, numFormat } from '../../utils/utils';
import { loadUserInfo, selectUserInfo } from '../../redux/userSlice';
import { API_URL } from '../../libs/apiUrl';

export default function MyInfo({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector(selectUserInfo)

    const [kakaoID, setKakaoID] = useState()

    const saveBtnClick = () => {
        APIS.postData(API_URL.user.saveInfo, {
            kakao_id: kakaoID
        })
            .then(() => {
                dispatch(loadUserInfo())
            }).catch(e => {
                let data = e.responce.data
                console.log(data.msg)
            })
    }
    useEffect(() => {
        console.log("render MyInfo!")
        console.log("userInfo", userInfo)

        if (userInfo?.kakao_id) setKakaoID(userInfo?.kakao_id)

    }, [])

    return (
        <Layout header={false} footters={false}>
            <div className="myInfoContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { navigate("/mypage", { replace: true }) }} />
                    <div className="titleInfo">
                        <div className="text">내정보</div>
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
                        { title: "내정보", isSelect: true },
                    ]} />
                    <div className="line"></div>
                    <div className="my-info-box">
                        <div className="item">
                            <div className="title">이메일</div>
                            <div className="value">{userInfo?.email}</div>
                        </div>
                        <div className="item">
                            <div className="title">이름</div>
                            <div className="value">{userInfo?.name}</div>
                        </div>
                        <div className="item">
                            <div className="title">핸드폰번호</div>
                            <div className="value">
                                {userInfo?.hp && addHyphenToPhoneNumber(userInfo?.hp)}
                                <div className="pass-change-btn">
                                    <Button
                                        buttonTxt="변경하기"
                                        buttonSize="small"
                                        onPress={() => {
                                            navigate("/mypageInfoPhone")
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div className="item">
                            <div className="title col">비밀번호 변경</div>
                            <div className="value col">
                                <Input
                                    className={`inputs input-400`}
                                    placeholder="비밀번호(4자리 이상 영문,숫자,특수문자)"
                                    setValue={() => { }}
                                    value={''}
                                />
                                <Input
                                    className={`inputs input-400`}
                                    placeholder="비밀번호 재입력"
                                    setValue={() => { }}
                                    value={''}
                                />
                            </div>
                        </div> */}
                        <div className="item">
                            <div className="title col">카카오톡 ID</div>
                            <div className="value col">
                                <Input
                                    className={`inputs input-400`}
                                    placeholder=""
                                    setValue={setKakaoID}
                                    value={kakaoID}
                                />
                                <div className="helper">
                                    회원간 카카오톡 채팅을 원하시는 경우에만 입력하세요.
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button buttonTxt="저장" buttonSize="large" onPress={saveBtnClick} />

                    <div className="withdrawal-text">
                        <p className="helper">차주인서비스를 더 이상이용하지 않으신다면</p>
                        <p className="withdrawal-btn" onClick={() => { navigate("/mypageWithdrawal") }}>회원탈퇴하기</p>
                    </div>
                </div>
            </div>
        </Layout >
    )
}