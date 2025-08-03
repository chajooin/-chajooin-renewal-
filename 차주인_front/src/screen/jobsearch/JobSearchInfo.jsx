import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import { open, close, loadingflas } from '../../redux/popupSlice';

import "../../css/page-jobsearch-info.css"

import Layout from "../../layout/Layout";
import Button from "../../component/Button";

import * as APIS from "../../utils/service";
import consts from "../../libs/consts"
import { API_URL } from '../../libs/apiUrl';
import moment from 'moment';
import { selectUserInfo } from '../../redux/userSlice';
import { MessageSend } from '../../component/popups/MessageBox';
import { DefaultImg, DefaultPfofile } from '../../component/DefaultImg';
import { addHyphenToPhoneNumber, goBackPage } from '../../utils/utils';
import { toast } from 'react-toastify';

export default function JobOfferInfo({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const UserData = useSelector(selectUserInfo)

    const params = new URLSearchParams(window.location.search);

    const [searchData, setSearData] = useState({});
    const [like, setLike] = useState(0)
    const [likeCheck, setLikeCheck] = useState(false)

    const [message, setMessage] = useState();
    const [isSend, setIsSend] = useState(false);

    const loadData = (init = true) => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.jobSearch.info, { idx: params.get("idx"), init })
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                setSearData(result.data)
                setLike(result?.data?.like_cnt)
                setLikeCheck(result?.data?.like_check)
                console.log(result.data)
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
                // goBackPage(navigate);
                let msg = e.response?.data?.msg ? e.response?.data?.msg : "존재하지 않는 게시물입니다."
                alert(msg)
                window.close();
                navigate("/")
            })
    }

    const requestLike = () => {
        APIS.postData(API_URL.jobSearch.like, { idx: params.get("idx") })
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                setLikeCheck(result?.data?.like_check)
                setLike(result?.data?.like_cnt)
                console.log(result.data)
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
            })
    }

    const requestDelete = (idx) => {
        APIS.postData(API_URL.jobSearch.delete, { idx })
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                alert("삭제되었습니다.")
                goBackPage(navigate);
                console.log(result.data)
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
            })
    }

    const requestMessage = () => {
        let sendData = {
            target_idx: searchData?.u_idx,
            desc: message,
        }
        console.log(sendData);
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.user.sendMessage, sendData)
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
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
        if (searchData?.u_idx === UserData.userInfo?.idx) {
            toast("본인 게시글입니다.")
            return;
        }
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

    useEffect(() => {
        loadData()
    }, [])

    return (
        <Layout header={false} footters={false}>


            <div className="jobSearchInfoContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => {
                        window.close();
                        navigate("/", { replace: true })
                    }} />
                    <div className="titleInfo">
                        <div className="text">최초등록 {moment(searchData?.create_dt).format("YY-MM-DD")}</div>
                        <div className="view">
                            <img src="/images/icons/eye-line.svg" alt="" />
                            <div className='count'>{searchData?.view}</div>
                        </div>
                    </div>

                    <div className="likeInfo" onClick={requestLike}>
                        {likeCheck ? <img src="/images/icons/heart-3-fill.svg" alt="" /> : <img src="/images/icons/heart-3-line-disable.svg" alt="" />}
                        <div className="text">{like}</div>
                    </div>
                </div>

                <div className="infoBox margint60">
                    <div className="header-title-24 header-add-btn-box">
                        구직 정보
                        <div className="search-report-btn">
                            {
                                searchData?.u_idx === UserData.userInfo?.idx ?
                                    (<div class="drop-down">
                                        <button class="drop-btn" />
                                        <div class="drop-down-content">
                                            <a style={{ cursor: "pointer" }} onClick={() => { navigate(`/jobsearchEdit?idx=${searchData?.idx}`) }}>수정하기</a>
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
                                    </div>) : <Button
                                        titleimgs="/images/icons/alarm-warning-line.svg"
                                        buttonTxt="신고하기"
                                        buttonShape="red"
                                        buttonSize="small"
                                        onPress={() => { navigate(`/reportJobsearch?idx=${params.get("idx")}`) }}
                                    />
                            }
                        </div>
                    </div>
                    <div className="searchInfoBox">
                        <div className="job-search-info">
                            <div className="iconBox">
                                <img src={consts.s3url + searchData?.writer?.profile} alt="" onError={DefaultPfofile} />
                            </div>
                            <div className="detailInfoBox">
                                <div className="info">
                                    <div className="title">담당자</div>
                                    <div className="text">{searchData?.writer?.name}</div>
                                </div>
                                <div className="info">
                                    <div className="title">카톡ID</div>
                                    <div className="text">{searchData?.writer?.kakao_id}</div>
                                </div>
                                <div className="info">
                                    <div className="title">연락처</div>
                                    <div className="text">{addHyphenToPhoneNumber(searchData?.writer?.hp)}</div>
                                </div>
                            </div>
                        </div>
                        {searchData?.u_idx !== UserData.userInfo?.idx && <div className="job-search-btnbox">
                            <Button buttonTxt="쪽지문의" buttonShape="white" onPress={sendMessage} />
                            <Button buttonTxt="전화문의" onPress={() => {
                                if (searchData?.u_idx === UserData.userInfo?.idx) {
                                    toast("본인 게시글입니다.")
                                    return;
                                }
                                document.location.href = `tel:${searchData?.writer?.hp}`
                            }} />
                        </div>}

                    </div>
                </div>

                <div className="infoBox mt-4">
                    <div className="search-info-box">
                        <div className="job-info">
                            <div className="header-title-24">프로필 정보</div>
                            <div className="list">
                                <div className="row">
                                    <div className="title">성별</div>
                                    <div className="text">{searchData?.gender}세</div>
                                </div>
                                <div className="row">
                                    <div className="title">나이</div>
                                    <div className="text">{searchData?.age}세</div>
                                </div>
                                <div className="row">
                                    <div className="title">학력</div>
                                    <div className="text">{searchData?.education}</div>
                                </div>
                                <div className="row">
                                    <div className="title">경력</div>
                                    <div className="text">{searchData?.career_option == 1 ? "신입" : `${searchData?.career}년`}</div>
                                </div>
                                <div className="row">
                                    <div className="title">화물운송종사자격</div>
                                    <div className="text">{searchData?.cargo_option ? "있음" : "없음"}</div>
                                </div>
                                <div className="row">
                                    <div className="title">위험물운송자증</div>
                                    <div className="text">{searchData?.danger_option ? "있음" : "없음"}</div>
                                </div>
                                <div className="row">
                                    <div className="title">보건증</div>
                                    <div className="text">{searchData?.health_option ? "있음" : "없음"}</div>
                                </div>
                                <div className="row">
                                    <div className="title">건설기계조종사면허</div>
                                    <div className="text">{searchData?.machineruy_option ? "있음" : "없음"}</div>
                                </div>
                            </div>
                        </div>
                        <div className="job-info">
                            <div className="header-title-24">희망 조건</div>
                            <div className="list">
                                <div className="row">
                                    <div className="title">운행차량</div>
                                    <div className="text">{searchData?.type} {searchData?.ton} 톤</div>
                                </div>
                                <div className="row">
                                    <div className="title">품목</div>
                                    <div className="text">{searchData?.item}</div>
                                </div>
                                <div className="row">
                                    <div className="title">출근지</div>
                                    <div className="text">{searchData?.go_sido} {searchData?.go_sigungu}</div>
                                </div>
                                <div className="row">
                                    <div className="title">상하차형태</div>
                                    <div className="text">{searchData?.unloading}</div>
                                </div>
                                <div className="row">
                                    <div className="title">근무시간</div>
                                    <div className="text">{searchData?.work}</div>
                                </div>
                                <div className="row">
                                    <div className="title">근무요일</div>
                                    <div className="text">{searchData?.work}</div>
                                </div>
                                <div className="row">
                                    <div className="title">급여</div>
                                    <div className="text">{searchData?.work}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="infoBox mt-4">
                    <div className="header-title-24">상세 내용</div>
                    <div className='detail-text' dangerouslySetInnerHTML={{ __html: searchData?.desc?.replaceAll("\n", "<br>") }}>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

