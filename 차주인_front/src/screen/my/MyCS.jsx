import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/my/my-cs.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';

import * as APIS from "../../utils/service";
import { goBackPage, numFormat } from '../../utils/utils';
import MyNavigator from './components/MyNavigator';
import ArcodianMenu from './components/MyArcodionMenu';
import { API_URL } from '../../libs/apiUrl';
import { close, loadingflas, open } from '../../redux/popupSlice';
import { selectConfig } from '../../redux/configSlice';
import moment from 'moment';

export default function MyCS({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const ConfigData = useSelector(selectConfig);

    const [csList, setCsList] = useState([])
    const [desc, setdesc] = useState([])

    const commentState = (state, text = "") => {
        return <div className={`comment-state ${state && "success"}`}>
            {text ? text : state ? "답변완료" : "미답변"}
        </div>
    }

    const commentBox = (text, date) => {
        return <div className='cs-comment'>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="corner-down-right-line">
                    <path id="Vector" d="M4.16613 11.6659L4.16602 4.16604L5.83268 4.16602L5.83277 9.99927L14.3093 9.99935L11.0178 6.70791L12.1963 5.5294L17.4997 10.8327L12.1963 16.136L11.0178 14.9575L14.3093 11.666L4.16613 11.6659Z" fill="#999999" />
                </g>
            </svg>
            <div className="comment-box">
                {commentState(true, "답변")}
                <div className="text" dangerouslySetInnerHTML={{ __html: text }}>
                    {/* {text} */}
                </div>
                <div className="date">
                    {date}
                </div>
            </div>
        </div>
    }

    const sendCS = () => {
        dispatch(
            open({
                content: "문의하시겠습니까?",
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                buttonCencle: "닫기",
                onPress: () => {
                    dispatch(close());
                    dispatch(loadingflas({ loading: true }))
                    APIS.postData(API_URL.cs.insert, { desc: desc })
                        .then(result => {
                            console.log(result.data)
                            setdesc("");
                            dispatch(loadingflas({ loading: false }))
                            loadInfo()
                        })
                        .catch(e => {
                            console.log(e)
                            dispatch(loadingflas({ loading: false }))
                        })
                },
                onCancelPress: () => { dispatch(close()); },
            })
        );
    }

    const loadInfo = () => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.cs.list)
            .then(result => {
                console.log(result.data)
                setCsList(result.data)
                dispatch(loadingflas({ loading: false }))
            })
            .catch(e => {
                console.log(e)
                setCsList([])
                dispatch(loadingflas({ loading: false }))
            })
    }

    useEffect(() => {
        loadInfo()
    }, [])

    return (
        <Layout header={false} footters={false}>
            <div className="myCSContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { navigate("/mypage", { replace: true }) }} />
                    <div className="titleInfo">
                        <div className="text">문의하기</div>
                    </div>
                </div>

                <div className="infoBox margint60">
                    <MyNavigator list={[
                        { title: "마이" },
                        { title: "문의하기", isSelect: true }
                    ]} />

                    <div className="contents">
                        <div className="line" />

                        <div className="input-contain">
                            <div className="help">불편하신 점이나 건의사항이 있으시면 문의주세요.</div>
                            <div className="text">
                                <textarea
                                    className="text-box"
                                    placeholder='내용을 입력해주세요.'
                                    value={desc}
                                    onChange={(e) => { setdesc(e.target.value) }}
                                />
                            </div>
                            <div className="btn-box">
                                <Button
                                    styles={{ width: 120 }}
                                    buttonTxt="보내기"
                                    onPress={sendCS}
                                />
                            </div>
                        </div>

                        <div className="list-contain">
                            {csList.map((v) => {
                                return <ArcodianMenu
                                    beforeComponet={commentState(v?.answer ? true : false)}
                                    title={v?.desc?.slice(0, 100)}
                                    subStr={moment(v?.create_dt).format("YYYY.MM.DD")}
                                >
                                    <div dangerouslySetInnerHTML={{ __html: v?.desc.replaceAll("\n", "<br>") }}></div>
                                    {v?.answer && commentBox(v?.answer.replaceAll("\n", "<br>"), moment(v?.answer_dt).format("YYYY.MM.DD HH:mm"))}
                                </ArcodianMenu>
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </Layout >
    )
}