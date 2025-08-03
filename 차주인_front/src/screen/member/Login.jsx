import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import KakaoLogin from "react-kakao-login";

import Layout from "../../layout/Layout";

import { useropen } from '../../redux/userSlice';
import { open, close, loadingflas } from '../../redux/popupSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';

import * as APIS from "../../utils/service";
import { getKakaoInfo, openKakao } from '../../utils/kakaoLogin';
import { getNaverInfo, openNaver, parseCallBack } from '../../utils/naverLogin';
import { API_URL } from '../../libs/apiUrl';
import { randomNumberLength } from '../../utils/utils';
import { selectConfig } from '../../redux/configSlice';

export default function Login({ navigation }) {

    const { naver } = window;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { configInfo } = useSelector(selectConfig)

    const appkeyNaver = "wK8OYBcyFxxj6rQOuhGl"
    const appkeyKakao = "40e4bc36f09d62e628ff01009b3b5fa7"

    const params = useParams()

    useEffect(() => {
        let token = localStorage.getItem("token");
        console.log("🚀 ~ useEffect ~ token:", token)
        if (token) {
            navigate("/")
            return;
        }
        initializeNaverLogin();
    }, [])

    const requestLogin = (data) => {
        let {
            type, id, email, hp, name, profile
        } = data;
        APIS.postData(API_URL.login, {
            type, id, email, hp, name, profile
        }).then(result => {
            localStorage.setItem("token", result.data)
            if (window.location.hostname === "localhost") {
                window.location.href = "http://localhost:3000";
            } else {
                window.location.href = "https://chajooin.com";
            }
        }).catch(e => {
            let result = e.response

            dispatch(
                open({
                    content: <div>
                        <p style={{ width: "100%", textAlign: "center" }} className='bolds fontsize20'>{result?.data?.msg ? result.data.msg : "로그인 정보가 올바르지 않습니다."}</p>
                        {result?.data?.code === 1000 && <p className='margint12'>고객센터에 문의하세요. ({configInfo?.footer?.hp})</p>}
                        {result?.data?.data?.type && <p className='margint12 bolds'><span className='color666'>가입유형:</span> {result.data.data.type}</p>}
                        {result?.data?.data?.email && <p className='margint12 bolds'><span className='color666'>이메일:</span> {result.data.data.email}</p>}
                    </div>,
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    onPress: () => {
                        dispatch(close())
                        navigate("/login")
                    },
                })
            );
        })
    }

    const initializeNaverLogin = () => {
        const naverLogin = new naver.LoginWithNaverId({
            clientId: appkeyNaver, // 발급 받은 Client ID 입력
            // callbackUrl: 'http://localhost:3000/login', // 작성했던 Callback URL 입력 
            callbackUrl: 'https://chajooin.com/login', // TODO: 배포시 변경
            isPopup: false, // 팝업창으로 로그인을 진행할 것인지?           
            loginButton: { color: 'green', type: 1, height: 58 }, // 버튼 타입 ( 색상, 타입, 크기 변경 가능 )
            callbackHandle: false,
        });
        naverLogin.init();

        let token = localStorage.getItem("token");
        console.log("🚀 ~ initializeNaverLogin ~ token:", token)
        if (!token) {
            console.log("🚀 ~ initializeNaverLogin ~ !token:", token)
            naverLogin.logout();
        }

        naverLogin.getLoginStatus(async function (status) {
            if (status) {
                handleNaverLogin(naverLogin?.user);
            } else {
                console.log("네이버 로그인 필요")
            }
        });
    }

    //네이버 로그인 콜백
    const handleNaverLogin = (data) => {
        // return
        if (data.id) {
            requestLogin({
                id: data.id,
                type: "naver",
                email: data.email,
                hp: data.mobile.replaceAll("-", ""),
                name: data.name,
                profile: data.profile_image
            })
        } else {
            dispatch(
                open({
                    content: "로그인 정보가 올바르지 않습니다.",
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    onPress: () => { dispatch(close()) },
                })
            );
        }
    }

    //카카오 로그인 콜백
    const kakaoOnSuccess = async (data) => {
        // console.log(data)
        // return

        requestLogin({
            id: data.profile.id,
            type: "kakao",
            email: data.profile.kakao_account.email,
            hp: data.profile.kakao_account.phone_number.replaceAll("+82 ", "0").replaceAll("-", ""),
            name: data.profile.kakao_account.name,
            profile: data.profile.kakao_account.profile.profile_image_url
        })
    }
    const kakaoOnFailure = (error) => {
        dispatch(
            open({
                content: "로그인에 실패하였습니다.",
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                onPress: () => { dispatch(close()) },
            })
        );
    };

    return (
        <Layout header={true}>
            <div className="loginCotain">
                <div className="loginBox">
                    <div className="title">로그인</div>
                    <div className="info">
                        <div className="text">신규가입시 <span className='point'>2000P</span> 무료지급</div>
                        <img src="/images/icons/logo-truck.svg" alt="" />
                    </div>
                    <div className="buttonBox">
                        <KakaoLogin
                            token={appkeyKakao}
                            scopes={['phone_number', 'name', 'profile_image', 'id', 'account_email']}
                            onSuccess={kakaoOnSuccess}
                            onFail={kakaoOnFailure}
                            onLogout={console.info}
                            render={({ onClick }) => {
                                return (
                                    // <button type="button" className="btn btn1" onClick={onClick}>카카오로그인2</button>
                                    <div className="button kakao" onClick={onClick}>
                                        <img src="/images/icons/kakao.svg" alt="" />
                                        카카오로 시작하기
                                    </div>
                                );
                            }}
                        />
                        <div className="button naver" onClick={() => {
                            document.querySelector("#naverIdLogin_loginButton").click();
                        }}>
                            <img src="/images/icons/naver.svg" alt="" />
                            네이버로 시작하기
                        </div>

                        <div style={{ display: "none" }} id='naverIdLogin'></div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

