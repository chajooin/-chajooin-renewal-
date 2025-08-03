import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import consts from "../libs/consts"
import { loadUserInfo, selectUserInfo } from '../redux/userSlice';

import { close, open } from '../redux/popupSlice';
import { Ismobiles } from '../utils/utils';
import { selectConfig } from '../redux/configSlice';

const ScrollTopButton = () => {
    const [visible, setVisible] = useState(false);
    const onClick = () => {
        window.scrollTo(0, 0)
    }

    useEffect(() => {
        // console.log("render!")

        const handleScroll = () => {
            let curScroll = window.scrollY
            if (curScroll > 200) {
                setVisible(true)
            } else {
                setVisible(false)
            }
        };
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return <div className='page-scroll-top-button' style={{ visibility: visible ? "visible" : "hidden" }}>
        <div className='bg-box' onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M16.1999 9.99408V24.6H13.7999V9.99408L7.36307 16.4308L5.66602 14.7338L14.9999 5.39996L24.3336 14.7338L22.6366 16.4308L16.1999 9.99408Z" fill="white" />
            </svg>
        </div>
    </div>
}

export default function Layout({
    children,
    header = null,
    actives = '',
    footters = true,
    headerTitle = "",
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const UserData = useSelector(selectUserInfo);
    const ConfigData = useSelector(selectConfig);

    const [isLogin, setLogin] = useState(localStorage.getItem("token") ? true : false)
    const [logoIndex, setLogoIndex] = useState(0);

    const goHome = () => {
        navigate('/')
    }

    const loginPopup = () => {
        dispatch(
            open({
                content: "로그인이 필요한 서비스입니다.",
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                onPress: () => {
                    dispatch(close())
                    navigate("/login")
                }
            })
        );
    }
    let interval = null;

    const lotateMobileLogo = () => {
        let num = 0;
        interval = setInterval(() => {
            num++;
            setLogoIndex(num % 2)
        }, 3000);
    }

    useEffect(() => {
        console.log("lay mount")

        window.scrollTo(0, 0);

        let token = localStorage.getItem("token");
        if (token) {
            setLogin(true)
            dispatch(loadUserInfo());
        }

        Ismobiles();
        lotateMobileLogo();

        return () => {
            console.log("lay unmount")
            if (interval) clearInterval(interval);
        }
    }, []);

    return (
        <>
            {
                header ?
                    <div className='mainHeader'>
                        <div className="topContain">
                            <div className="box">
                                <div style={{
                                    position: "absolute",
                                    left: "0px",
                                    display: "flex", flexShrink: 1, gap: 20,
                                }}>
                                    <p style={{ padding: "5px 10px", borderRadius: 100, background: "#EEE", fontSize: 14, fontWeight: 600 }}>방문자수: {JSON.stringify(ConfigData?.accessCount?.visitor || 0)}</p>
                                    <p style={{ padding: "5px 10px", borderRadius: 100, background: "#EEE", fontSize: 14, fontWeight: 600 }}>회원수: {JSON.stringify(ConfigData?.accessCount?.users || 0)}</p>
                                    <p style={{ padding: "5px 10px", borderRadius: 100, background: "#EEE", fontSize: 14, fontWeight: 600 }}>게시물: {JSON.stringify(ConfigData?.accessCount?.boards || 0)}</p>
                                </div>
                                {isLogin ?
                                    <>
                                        <div className="menu">안녕하세요 <span className='user'>{UserData.userInfo?.name}</span>님</div>
                                        <div className="login" onClick={() => {
                                            navigate('/mypage')
                                        }}>마이페이지</div>
                                    </>
                                    :
                                    <>
                                        <div className="menu" onClick={() => {
                                            navigate('/cs')
                                        }}>고객센터</div>
                                        <div className="bar"></div>
                                        <div className="menu" onClick={() => {
                                            navigate('/login')
                                        }}>로그인</div>
                                        <div className="login" onClick={() => {
                                            navigate('/login')
                                        }}>회원가입</div>
                                    </>}


                            </div>
                        </div>
                        <div className="contain">
                            <div className="box">
                                <img className="mainLogo" src="/images/log_w_slo.svg" onClick={goHome} />
                                {/* <img className="mainLogo" src={consts.s3url + configInfo.loading_img} onClick={goHome} alt="" /> */}
                                <div className="menuContain">
                                    <div className={`menuItem ${actives == "usedCar" && "select"}`} onClick={() => { navigate("/usedCar") }}>중고 화물차</div>
                                    <div className={`menuItem ${actives == "rentedCar" && "select"}`} onClick={() => { navigate("/rentedCar") }}>지입차</div>
                                    <div className={`menuItem ${actives == "jobOffer" && "select"}`} onClick={() => { navigate("/joboffer") }} >구인</div>
                                    <div className={`menuItem ${actives == "jobSearch" && "select"}`} onClick={() => { navigate("/jobsearch") }}>구직</div>
                                    <div className={`menuItem ${actives == "board" && "select"}`} onClick={() => { navigate("/board") }}>게시판</div>
                                    <div className={`menuItem ${actives == "wetarget" && "select"}`} onClick={() => { navigate("/weTarget") }}>우리의 목표</div>
                                </div>
                                <div className="quick-alamContain">
                                    <div
                                        className="box"
                                        onClick={() => {
                                            if (!isLogin)
                                                loginPopup("로그인이 필요합니다.")
                                            else
                                                navigate("/notification")
                                        }}
                                    >
                                        <img src="/images/icons/notification-3-line.svg" alt="" />
                                        {
                                            isLogin && UserData.userInfo?.alarm_count > 0 &&
                                            <div className="num">{UserData.userInfo?.alarm_count}</div>
                                        }
                                    </div>
                                    <div
                                        className="box"
                                        onClick={() => {
                                            if (!isLogin)
                                                loginPopup("로그인이 필요합니다.")
                                            else
                                                navigate("/heart")
                                        }}
                                    >
                                        <img src="/images/icons/heart-3-line.svg" alt="" />
                                        {
                                            isLogin && UserData.userInfo?.like_count > 0 && <div className="num">{UserData.userInfo?.like_count}</div>
                                        }
                                    </div>
                                    <div
                                        className="box"
                                        onClick={() => {
                                            if (!isLogin)
                                                loginPopup("로그인이 필요합니다.")
                                            else
                                                navigate("/message")
                                        }}
                                    >
                                        <img src="/images/icons/mail-line.svg" alt="" />
                                        {
                                            isLogin && UserData.userInfo?.message_count > 0 && <div className="num">{UserData.userInfo?.message_count}</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> :
                    <></>
            }

            {
                header && <>
                    <div className='mobileHeader'>
                        <img style={{ display: logoIndex === 0 ? "block" : "none" }} className="mobile-logoIcon" src="/images/m-logo1.svg" alt="로고" onClick={() => navigate('/')} />
                        <img style={{ display: logoIndex === 1 ? "block" : "none" }} className="mobile-slogan" src="/images/slogan.svg" alt="" onClick={() => navigate('/')} />
                        {/* <img className="mobile-logoIcon" src="/images/m-logo1.svg" alt="로고" onClick={() => navigate('/')} /> */}
                        {/* <img className="menuIcon" src="/images/icons/menu-line.svg" alt="메뉴" /> */}
                    </div>

                    <label id="side-menu-label" htmlFor="check-menu-btn" />

                    <input id="check-menu-btn" type="checkbox" />
                    <label className='side-menu-bg' htmlFor="check-menu-btn" />
                    <div className="side-menu">
                        <div className="logo-box">
                            <img className="mobile-logoIcon" src="/images/m-logo1.svg" alt="로고" onClick={() => navigate('/')} />
                            <label htmlFor="check-menu-btn">
                                <img src="/images/icons/x-button.svg" width="20"></img>
                            </label>
                        </div>
                        <div style={{
                            left: "0px",
                            display: "flex",
                            flexDirection: "column",
                            padding: "0px 20px",
                            flexShrink: 1, gap: 10,
                        }}>
                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: 10, borderRadius: 100, background: "#EEE",
                            }}>
                                <p style={{ fontSize: 14, fontWeight: 600 }}>방문자수:</p>
                                <p style={{ fontSize: 14, fontWeight: 600 }}>{JSON.stringify(ConfigData?.accessCount?.visitor || 0)}</p>
                            </div>
                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: 10, borderRadius: 100, background: "#EEE",
                            }}>
                                <p style={{ fontSize: 14, fontWeight: 600 }}>회원수:</p>
                                <p style={{ fontSize: 14, fontWeight: 600 }}>{JSON.stringify(ConfigData?.accessCount?.users || 0)}</p>
                            </div>
                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: 10, borderRadius: 100, background: "#EEE",
                            }}>
                                <p style={{ fontSize: 14, fontWeight: 600 }}>게시물:</p>
                                <p style={{ fontSize: 14, fontWeight: 600 }}>{JSON.stringify(ConfigData?.accessCount?.boards || 0)}</p>
                            </div>
                        </div>

                        <div className="menu-box">
                            {isLogin ?
                                <>
                                    <div className='side-menu-item' onClick={() => { navigate("/mypage") }}>마이페이지</div>
                                </> :
                                <>
                                    <div className='side-menu-item' onClick={() => { navigate("/login") }}>로그인</div>
                                    <div className='side-menu-item' onClick={() => { navigate("/cs") }}>고객센터</div>
                                </>}
                        </div>
                        <div className="side-menu-line" />
                        <div className="menu-box">
                            <div className='side-menu-item' onClick={() => { navigate("/usedCar") }}>
                                중고차
                                <img src="/images/icons/chevron-gray-right.svg" width="20"></img>
                            </div>
                            <div className='side-menu-item' onClick={() => { navigate("/rentedCar") }}>
                                지입차
                                <img src="/images/icons/chevron-gray-right.svg" width="20"></img>
                            </div>
                            <div className='side-menu-item' onClick={() => { navigate("/joboffer") }}>
                                구인
                                <img src="/images/icons/chevron-gray-right.svg" width="20"></img>
                            </div>
                            <div className='side-menu-item' onClick={() => { navigate("/jobsearch") }}>
                                구직
                                <img src="/images/icons/chevron-gray-right.svg" width="20"></img>
                            </div>
                            <div className='side-menu-item' onClick={() => { navigate("/board") }}>
                                게시판
                                <img src="/images/icons/chevron-gray-right.svg" width="20"></img>
                            </div>
                            <div className='side-menu-item' onClick={() => { navigate("/weTarget") }}>
                                우리의 목표
                                <img src="/images/icons/chevron-gray-right.svg" width="20"></img>
                            </div>
                        </div>
                    </div>

                    <div className="bottom-menu-contain">
                        <div className="menu-box" onClick={() => {
                            navigate('/')
                        }}>
                            <div className="icon-box">
                                <img src="/images/icons/home-5-fill.svg" alt="" />

                            </div>
                        </div>
                        <div className="menu-box" onClick={() => {
                            if (!isLogin)
                                loginPopup("로그인이 필요합니다.")
                            else
                                navigate('/notification')
                        }}>
                            <div className="icon-box">
                                <img src="/images/icons/notification-3-line.svg" alt="" />
                                {isLogin && UserData.userInfo?.alarm_count > 0 && <div className="count">{UserData.userInfo?.alarm_count}</div>}
                            </div>
                        </div>
                        <div className="menu-box" onClick={() => {
                            if (!isLogin)
                                loginPopup("로그인이 필요합니다.")
                            else
                                navigate('/heart')
                        }}>
                            <div className="icon-box">
                                <img src="/images/icons/heart-3-line.svg" alt="" />
                                {isLogin && UserData.userInfo?.like_count > 0 && <div className="count">{UserData.userInfo?.like_count}</div>}
                            </div>
                        </div>
                        <div className="menu-box" onClick={() => {
                            if (!isLogin)
                                loginPopup("로그인이 필요합니다.")
                            else
                                navigate('/message')
                        }}>
                            <div className="icon-box">
                                <img src="/images/icons/mail-line.svg" alt="" />
                                {isLogin && UserData.userInfo?.message_count > 0 && <div className="count">{UserData.userInfo?.message_count}</div>}
                            </div>
                        </div>
                        <div className="menu-box" onClick={() => {
                            if (!isLogin)
                                loginPopup("로그인이 필요합니다.")
                            else
                                navigate('/mypage')
                        }}>
                            <div className="icon-box">
                                <img src="/images/icons/user-line.svg" alt="" />
                            </div>
                        </div>
                    </div>
                </>
            }


            <div className={`mainwrapper pageViewer`}>
                {children}
            </div>
            <ScrollTopButton />
            {footters && <div className='mainFooter'>
                <div className="policy">
                    <div className="box">
                        <div className="menu" onClick={() => {
                            navigate("/mypagePolicy?idx=1")
                        }}>이용약관</div>
                        <div className="menuBold" onClick={() => {
                            navigate("/mypagePolicy?idx=2")
                        }}>개인정보처리방침</div>
                    </div>
                </div>
                <div className="contain">
                    <div className="box">
                        {/* <img className="footerLogo" src={consts.s3url + configInfo.loading_img} alt="" /> */}
                        <div className="media">
                            <img src="/images/icons/icon-youtube.svg" onClick={() => { window.open("http://www.youtube.com/@chajooin") }} />
                            <img src="/images/icons/icon-instar.svg" onClick={() => { window.open("https://www.instagram.com/chajooin/") }} />
                            <img src="/images/icons/icon-blog.svg" onClick={() => { window.open("https://blog.naver.com/workdrivers") }} />
                        </div>
                        <img className="footerLogo" src="/images/logo2.svg" alt="" />

                        <div className="company">
                            상호: {ConfigData.configInfo?.footer?.company} <br />
                            대표: {ConfigData.configInfo?.footer?.ceo}  |  사업자번호: {ConfigData.configInfo?.footer?.buisness_num}  |  통신판매번호: {ConfigData.configInfo?.footer?.communication_num}<br />
                            {ConfigData.configInfo?.footer?.addr} ｜ Tel: {ConfigData.configInfo?.footer?.hp} ｜  E-Mail : {ConfigData.configInfo?.footer?.email}
                        </div>
                        <div className="sign">COPYRIGHT {ConfigData.configInfo?.footer?.company} ALL RIGHT RESERVED</div>
                        <div className="sign">차주인.com은 통신판매중개자로서 통신판매의 당사자가 아니며 상품,거래정보,거래에 대해 책임을 지지 않습니다.</div>
                    </div>
                </div>

            </div>}
        </>
    )
}

