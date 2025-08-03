import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import Layout from "../../layout/Layout";
import Checkbox from '../../component/Checkbox';
import Button from '../../component/Button';
import InputFileMulti from '../../component/InputFileMulti'

import * as APIS from "../../utils/service";
import { API_URL } from '../../libs/apiUrl';
import { close, open } from '../../redux/popupSlice';
import { toast } from 'react-toastify';
import { goBackPage } from '../../utils/utils';

export default function Report({ type, navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);

    const [idx, setIdx] = useState("")
    const [option, setOptin] = useState([]);
    const [desc, setDesc] = useState("")
    const [fileVal, setFileVal] = useState([]);

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

    const sendReport = () => {
        if (option.length <= 0) {
            msgPopup("신고사유를 선택해주세요.")
            return;
        }

        if (desc.length <= 0) {
            msgPopup("신고내용을 작성해주세요.")
            return;
        }


        let sendData = {
            idx: idx,
            title: option.map(v => v.names),
            desc: desc,
            files: fileVal
        }

        dispatch(
            open({
                content: "신고하시겠습니까?",
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                buttonCencle: "닫기",
                onPress: () => {
                    dispatch(close());
                    requestReport(type, sendData)
                },
                onCancelPress: () => { dispatch(close()); },
            })
        );
    }

    const requestReport = (type, sendData) => {
        // jeeip/truck
        if (type === "truck") {
            APIS.postData(API_URL.usedCar.report, sendData)
                .then((result) => {
                    toast("신고되었습니다.");
                })
                .catch(() => { msgPopup("잠시 후 다시시도해 주세요.") })
        } else if (type === "jeeip") {
            APIS.postData(API_URL.rentedCar.report, sendData)
                .then((result) => {
                    toast("신고되었습니다.");
                })
                .catch(() => { msgPopup("잠시 후 다시시도해 주세요.") })
        } else if (type === "joboffer") {
            APIS.postData(API_URL.jobOffer.report, sendData)
                .then((result) => {
                    toast("신고되었습니다.");
                })
                .catch(() => { msgPopup("잠시 후 다시시도해 주세요.") })
        } else if (type === "jobsearch") {
            APIS.postData(API_URL.jobSearch.report, sendData)
                .then((result) => {
                    toast("신고되었습니다.");
                })
                .catch(() => { msgPopup("잠시 후 다시시도해 주세요.") })
        }
    }

    useEffect(() => {
        if (!params.get("idx")) goBackPage(navigate);
        else setIdx(params.get("idx"))
    }, [])

    return (
        <Layout header={false} footters={false}>
            <div className="report-contain">
                <div className="global-titleBox bg_white">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { goBackPage(navigate); }} />
                    <div className="titleInfo">
                        <div className="text">신고하기</div>
                    </div>
                </div>

                <div className="report-contents-box bg_white">
                    <div className="header-title-32">신고하기</div>
                    <div className="contents-box">
                        <div className="title">신고사유<span className="sub-title">(중복 선택 가능)</span><span className='red'>*</span></div>
                        <div className="list-box">
                            <Checkbox
                                linetype={'checkimg'}
                                values={option}
                                setvalues={setOptin}
                                namevalue={[
                                    { names: '광고/홍보/허위 게시물', values: 0 },
                                    { names: '알선업체 및 중간업자', values: 1 },
                                    { names: '일방적인 노쇼', values: 2 },
                                    { names: '불쾌감을 주는 언행(욕설,음란,비방 등)', values: 3 },
                                    { names: '기타 사유', values: 4 },
                                ]}
                                flexrows="column"
                                fontweights={400}
                                fontSizes={16}
                                sizes={24}
                            />
                        </div>
                    </div>

                    <div className="contents-box">
                        <div className="title">신고내용<span className="sub-title">(상세하게 작성해 주세요.)<span className='red'>*</span></span></div>
                        <textarea
                            className="text-box"
                            value={desc}
                            onChange={(e) => { setDesc(e.target.value) }}
                            placeholder='내용을 입력해주세요.'
                        />
                    </div>

                    <div className="contents-box">
                        <div className="title">관련 이미지</div>

                        <InputFileMulti
                            type="file"
                            multiple={true}
                            placeholder="입력해주세요."
                            name="ipf3"
                            // label="*상세사진 (10개까지 등록 가능)"
                            value={fileVal} setValue={setFileVal}
                            valid="image" />
                    </div>

                    <Button buttonTxt="신고하기" buttonSize="large" onPress={() => {
                        sendReport()
                    }} />
                </div>

            </div>
        </Layout >
    )
}