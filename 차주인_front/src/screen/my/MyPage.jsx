import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/page-my.css"

import consts from "../../libs/consts"
import Layout from "../../layout/Layout";
import Button from '../../component/Button';

import * as APIS from "../../utils/service";
import { numFormat } from '../../utils/utils';
import { close, loadingflas, open } from '../../redux/popupSlice';
import { API_URL } from '../../libs/apiUrl';
import { loadUserInfo, setUserBoard, setUserInfo } from '../../redux/userSlice';
import InputFile from '../../component/InputFile';
import InputFileBox from '../../component/InputFileBox';

// const test = { "base": "", "ext": "png" }

export default function MyPage({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { userInfo, boardCount } = useSelector(s => s.userReducer);
    const [proFile, setProFile] = useState('');

    const delProfile = () => {
        dispatch(
            open({
                content: "프로필 사진을 삭제하시겠습니까?",
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                buttonCencle: "닫기",
                onPress: () => {
                    APIS.postData(API_URL.user.delProfile)
                        .then((result) => {
                            dispatch(close())
                            if (result.data)
                                dispatch(loadUserInfo())

                        }).catch(e => console.log("프로필 삭제 실패"))
                },
                onCancelPress: () => { dispatch(close()) },
            })
        );
    }

    useEffect(() => {
        APIS.postData(API_URL.user.boardCount)
            .then((result) => {
                console.log("asdasasdfasd::", result)
                dispatch(setUserBoard({
                    truck_count: result.data.truck_count,
                    jeeip_count: result.data.jeeip_count,
                    recruit_count: result.data.recruit_count,
                    job_count: result.data.job_count,
                    consulting_count: result.data.consulting_count

                }))
            })
            .catch((result) => {
                console.log(result)
            })

    }, [])

    useEffect(() => {
        console.log("🚀 ~ MyPage ~ boardCount:", boardCount)
    }, [boardCount])

    useEffect(() => {
        if (proFile) {
            //프로필 사진 등록시 바로 변경
            dispatch(loadingflas({ loading: true }));
            APIS.postData(API_URL.user.editProfile, {
                files: proFile
            }).then((result) => {
                // true 로 올거임?
                if (result.data)
                    dispatch(loadUserInfo())
                else
                    console.log("프로필 등록 실패")
                dispatch(loadingflas({ loading: false }));
            }).catch(e => {
                dispatch(loadingflas({ loading: false }));
                console.log("프로필 등록 실패")
            })
        }
    }, [proFile])


    // const test = { "base": "", "ext": "png" }

    return (
        <Layout header={true} >

            <div className="pageMyContain">

                <div className="quick-menu-title-box">
                    <div className="title">마이페이지</div>
                </div>

                <div className="user-info">
                    <div className="profile-img">
                        <img className="profile"
                            src={
                                userInfo?.profile ? consts.s3url + userInfo.profile : "/images/icons/default-avatar.png"
                            }
                            alt="" />


                        {
                            userInfo?.profile ?
                                <img className="edit-poto" src="/images/icons/delete-bin-line.svg" alt=""
                                    onClick={() => { delProfile() }} /> :
                                <InputFileBox
                                    type="file"
                                    labelType="box"
                                    value={proFile}
                                    setValue={setProFile}
                                    valid="image"
                                    setError={(msg) => {
                                        console.log(msg)
                                    }}
                                >
                                    <img className="edit-poto" src="/images/icons/camera.svg" alt="" />
                                </InputFileBox>
                        }
                    </div>


                    <div className="box">
                        <div className="info">
                            <div className="name">{userInfo?.name}</div>
                            <div className={`user-id ${userInfo?.type}`}>
                                {userInfo?.email}
                            </div>
                        </div>
                        <div className="btn-box">
                            <Button
                                titleimgs="/images/icons/edit-info.svg"
                                buttonTxt="정보수정"
                                buttonShape="blue"
                                buttonSize="small"
                                onPress={() => { navigate('/mypageInfo') }}
                            />
                        </div>
                    </div>
                </div>

                <div className="view-box1">
                    <div className="card" onClick={() => {
                        navigate("/mypagePoint")
                    }}>
                        <div className="title point">포인트</div>
                        <div className="value">{numFormat(userInfo?.point, true)}</div>
                    </div>
                    <div className="card" onClick={() => {
                        navigate("/mypageCalendar")
                    }}>
                        <div className="title calendar">예약상담</div>
                        <div className="value">{numFormat(boardCount?.consulting_count)}</div>
                    </div>
                </div>

                <div className="view-box2">
                    <div className="card" onClick={() => {
                        navigate("/usedCar", { state: { isMyView: true } })
                    }}>
                        <div className="title">{boardCount.truck_count}</div>
                        <div className="value">등록한 화물차</div>
                    </div>
                    <div className="card" onClick={() => {
                        navigate("/rentedCar", { state: { isMyView: true } })
                    }}>
                        <div className="title">{boardCount.jeeip_count}</div>
                        <div className="value">등록한 지입차</div>
                    </div>
                    <div className="card" onClick={() => {
                        navigate("/joboffer", { state: { isMyView: true } })
                    }}>
                        <div className="title">{boardCount.recruit_count + boardCount.job_count}</div>
                        <div className="value">등록한 구인/구직</div>
                    </div>
                </div>

                <div className="list-menu">
                    <div className="menu-item" onClick={() => {
                        navigate("/mypageNoti")
                    }}>
                        <div className="title">공지사항</div>
                        <img src="/images/icons/array-right.svg" alt="" />
                    </div>
                    <div className="menu-item" onClick={() => {
                        navigate("/mypageFaq")
                    }}>
                        <div className="title">자주하는 질문</div>
                        <img src="/images/icons/array-right.svg" alt="" />
                    </div>
                    <div className="menu-item" onClick={() => {
                        navigate("/mypageCs")
                    }}>
                        <div className="title">문의하기</div>
                        <img src="/images/icons/array-right.svg" alt="" />
                    </div>
                </div>

                <div className="list-menu">
                    <div className="menu-item" onClick={() => {
                        navigate("/mypagePolicy?idx=1")
                    }}>
                        <div className="title">이용약관</div>
                        <img src="/images/icons/array-right.svg" alt="" />
                    </div>
                    <div className="menu-item" onClick={() => {
                        navigate("/mypagePolicy?idx=2")
                    }}>
                        <div className="title">개인정보 처리방침</div>
                        <img src="/images/icons/array-right.svg" alt="" />
                    </div>
                    <div className="menu-item" onClick={() => { navigate("/mypageWithdrawal") }}>
                        <div className="title">탈퇴하기</div>
                        <img src="/images/icons/array-right.svg" alt="" />
                    </div>
                </div>

                <div className="logout-btn" onClick={() => {
                    dispatch(
                        open({
                            content: "로그아웃 하시겠습니까?",
                            onCancelPress: false,
                            titleviewer: false,
                            button: "확인",
                            buttonCencle: "닫기",
                            onPress: () => {
                                dispatch(close())
                                localStorage.setItem("token", "")
                                navigate("/")

                            },
                            onCancelPress: () => { dispatch(close()) },
                        })
                    );
                }}>
                    <div className="text">로그아웃</div>
                </div>
            </div>
        </Layout >
    )
}