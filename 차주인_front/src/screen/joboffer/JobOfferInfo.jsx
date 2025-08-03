import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import { open, close, loadingflas } from '../../redux/popupSlice';

import "../../css/page-joboffer-info.css"

import Layout from "../../layout/Layout";
import Button from "../../component/Button";

import * as APIS from "../../utils/service";
import consts from "../../libs/consts"
import { API_URL } from '../../libs/apiUrl';
import moment from 'moment';
import { addHyphenToPhoneNumber, goBackPage, numFormat } from '../../utils/utils';
import { selectUserInfo } from '../../redux/userSlice';
import { DefaultImg, DefaultPfofile } from '../../component/DefaultImg';
import { MessageSend } from '../../component/popups/MessageBox';
import { toast } from 'react-toastify';

export default function JobOfferInfo({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const UserData = useSelector(selectUserInfo)

    const [offerInfo, setOfferInfo] = useState({});
    const [like, setLike] = useState(0)
    const [likeCheck, setLikeCheck] = useState(false)

    const [message, setMessage] = useState();
    const [isSend, setIsSend] = useState(false);

    const loadData = (init = true) => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.jobOffer.info, { idx: params.get("idx"), init })
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                setOfferInfo(result.data)
                setLike(result?.data?.like_cnt)
                setLikeCheck(result?.data?.like_check)
                console.log(result.data)
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
                let msg = e.response?.data?.msg ? e.response?.data?.msg : "존재하지 않는 게시물입니다."
                alert(msg)
                window.close();
                navigate("/")
            })
    }

    const requestLike = () => {
        APIS.postData(API_URL.jobOffer.like, { idx: params.get("idx") })
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                console.log(result.data)
                setLikeCheck(result?.data?.like_check)
                setLike(result?.data?.like_cnt)
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
            })
    }

    const requestDelete = (idx) => {
        APIS.postData(API_URL.jobOffer.delete, { idx })
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
            target_idx: offerInfo?.u_idx,
            desc: message,
        }
        console.log(sendData)

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
        console.log("asdasd");
        if (offerInfo?.u_idx === UserData.userInfo?.idx) {
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


            <div className="jobOfferInfoContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => {
                        window.close();
                        navigate("/", { replace: true })
                    }} />
                    <div className="titleInfo">
                        <div className="text">최초등록 {moment(offerInfo?.create_dt).format("YY-MM-DD")}</div>
                        <div className="view">
                            <img src="/images/icons/eye-line.svg" alt="" />
                            <div className='count'>{offerInfo?.view}</div>
                        </div>
                    </div>

                    <div className="likeInfo" onClick={requestLike}>
                        {likeCheck ? <img src="/images/icons/heart-3-fill.svg" alt="" /> : <img src="/images/icons/heart-3-line-disable.svg" alt="" />}
                        <div className="text">{like}</div>
                    </div>
                </div>

                <div className="infoBox margint60">
                    <div className="header-title-24 header-add-btn-box">
                        구인 정보
                        <div className="offer-report-btn">
                            {
                                offerInfo?.u_idx === UserData.userInfo?.idx ?
                                    (<div class="drop-down">
                                        <button class="drop-btn" />
                                        <div class="drop-down-content">
                                            <a style={{ cursor: "pointer" }} onClick={() => { navigate(`/jobofferEdit?idx=${offerInfo?.idx}`) }}>수정하기</a>
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
                                        onPress={() => { navigate(`/reportJoboffer?idx=${params.get("idx")}`) }}
                                    />
                            }
                        </div>
                    </div>
                    <div className="offerInfoBox">
                        <div className="job-offer-info">
                            <div className="iconBox">
                                <img src={consts.s3url + offerInfo?.writer?.profile} alt="" onError={DefaultPfofile} />
                            </div>
                            <div className="detailInfoBox">
                                <div className="info">
                                    <div className="title">담당자</div>
                                    <div className="text">{offerInfo?.writer?.name}</div>
                                </div>
                                <div className="info">
                                    <div className="title">카톡ID</div>
                                    <div className="text">{offerInfo?.writer?.kakao_id}</div>
                                </div>
                                <div className="info">
                                    <div className="title">연락처</div>
                                    <div className="text">{offerInfo?.writer?.hp && addHyphenToPhoneNumber(offerInfo?.writer?.hp)}</div>
                                </div>
                            </div>
                        </div>
                        {offerInfo?.u_idx !== UserData.userInfo?.idx && <div className="job-offer-btnbox">
                            <Button buttonTxt="쪽지문의" buttonShape="white" onPress={sendMessage} />
                            <Button buttonTxt="전화문의" onPress={() => {
                                if (offerInfo?.u_idx === UserData.userInfo?.idx) {
                                    toast("본인 게시글입니다.")
                                    return;
                                }
                                document.location.href = `tel:${offerInfo?.writer?.hp}`
                            }} />
                        </div>}

                    </div>
                </div>

                <div className="infoBox mt-4">
                    <div className="offer-info-box">
                        <div className="job-info">
                            <div className="header-title-24">구인 정보</div>
                            <div className="list">
                                <div className="row">
                                    <div className="title">업체</div>
                                    <div className="text">{offerInfo?.company}</div>
                                </div>
                                {/* <div className="row">
                                    <div className="title">품목</div>
                                    <div className="text">{offerInfo?.item}</div>
                                </div> */}
                                <div className="row">
                                    <div className="title">출근지</div>
                                    <div className="text">{offerInfo?.go_sido} {offerInfo?.go_sigungu}</div>
                                </div>
                                <div className="row">
                                    <div className="title">운행구간</div>
                                    <div className="text">{offerInfo?.section}</div>
                                </div>
                                <div className="row">
                                    <div className="title">상하차 형태</div>
                                    <div className="text">{offerInfo?.unloading}</div>
                                </div>
                                <div className="row">
                                    <div className="title">근무시간</div>
                                    <div className="text">{offerInfo?.work}</div>
                                </div>
                                <div className="row">
                                    <div className="title">휴무</div>
                                    <div className="text">{offerInfo?.dayoff}</div>
                                </div>
                                <div className="row">
                                    <div className="title">급여</div>
                                    <div className="text">{numFormat(offerInfo?.pay)}만원</div>
                                </div>
                                <div className="row">
                                    <div className="title">접수마감</div>
                                    <div className="text">{offerInfo?.deadline_type == 3 ? offerInfo?.deadline : offerInfo?.deadline_type == 1 ? "채용시" : "상시모집"}</div>
                                </div>
                            </div>
                        </div>
                        <div className="job-info">
                            <div className="header-title-24">자격 요건</div>
                            <div className="list">
                                <div className="row">
                                    <div className="title">차량톤수</div>
                                    <div className="text">{offerInfo?.ton}</div>
                                </div>
                                <div className="row">
                                    <div className="title">적합면허</div>
                                    <div className="text">{offerInfo?.certificate}</div>
                                </div>
                                <div className="row">
                                    <div className="title">화물운송종사자격</div>
                                    <div className="text">{offerInfo?.cargo_option ? "필요" : "필요없음"}</div>
                                </div>
                                <div className="row">
                                    <div className="title">위험물운송자증</div>
                                    <div className="text">{offerInfo?.danger_option ? "필요" : "필요없음"}</div>
                                </div>
                                <div className="row">
                                    <div className="title">보건증</div>
                                    <div className="text">{offerInfo?.health_option ? "필요" : "필요없음"}</div>
                                </div>
                                <div className="row">
                                    <div className="title">건설기계조종사면허</div>
                                    <div className="text">{offerInfo?.machinery_option ? "필요" : "필요없음"}</div>
                                </div>
                                <div className="row">
                                    <div className="title">근무형태</div>
                                    <div className="text">{offerInfo?.worktype}</div>
                                </div>
                                <div className="row">
                                    <div className="title">성별</div>
                                    <div className="text">{offerInfo?.gender}</div>
                                </div>
                                <div className="row">
                                    <div className="title">학력</div>
                                    <div className="text">{offerInfo?.education}</div>
                                </div>
                                <div className="row">
                                    <div className="title">경력</div>
                                    <div className="text">{offerInfo?.career}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="infoBox mt-4">
                    <div className="header-title-24">상세 내용</div>
                    <div className='detail-text' dangerouslySetInnerHTML={{ __html: offerInfo?.desc?.replaceAll("\n", "<br>") }}>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

