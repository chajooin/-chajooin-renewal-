import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/my/my-noti-info.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';
import MyNavigator from './components/MyNavigator';

import * as APIS from "../../utils/service";
import { goBackPage, numFormat } from '../../utils/utils';
import { selectUserInfo } from '../../redux/userSlice';
import { API_URL } from '../../libs/apiUrl';
import { loadingflas } from '../../redux/popupSlice';
import moment from 'moment';


const checkToken = () => {
    let token = localStorage.getItem("token")
    return token ? true : false
}

export default function MyNotiInfo({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector(selectUserInfo)

    const params = new URLSearchParams(window.location.search);

    const [idx, setIdx] = useState("");
    const [notiInfo, setNotiInfo] = useState();



    const loadData = () => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.noti.info, { idx })
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                setNotiInfo(result.data)
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
                goBackPage(navigate);
            })
    }

    useEffect(() => {
        if (params.get("idx")) {
            setIdx(params.get("idx"))
        }
    }, [])

    useEffect(() => {
        if (idx)
            loadData();
    }, [idx])

    return (
        <Layout header={false} footters={false}>
            <div className="myNotiInfoContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { navigate("/mypageNoti", { replace: true }) }} />
                    <div className="titleInfo">
                        <div className="text">공지사항 상세</div>
                    </div>
                    {checkToken() && <div className="quick-alamContain">
                        <div className="box" onClick={() => { navigate("/message") }}>
                            <img src="/images/icons/mail-line.svg" alt="" />
                            {userInfo?.message_count > 0 && <div className="num">{userInfo?.message_count}</div>}
                        </div>
                    </div>}
                </div>
                <div className="infoBox margint60">
                    <MyNavigator list={[
                        { title: "마이" },
                        { title: "공지사항", },
                        { title: "공지사항 상세", isSelect: true }
                    ]} />
                    <div className="line"></div>

                    <div className="contents">
                        <div className="title-box">
                            <div className="title">{notiInfo?.row?.title}</div>
                            <div className="date">{moment(notiInfo?.row?.create_dt).format("YYYY.MM.DD HH.mm")}</div>
                        </div>

                        <div className="text-box" dangerouslySetInnerHTML={{ __html: notiInfo?.row?.desc }}>
                        </div>

                        <div className="navi-box">
                            <div className="navi-item">
                                <div className="text">이전글</div>
                                {notiInfo?.prev ? <div className="title" onClick={() => { setIdx(notiInfo?.prev?.idx) }}>
                                    {notiInfo?.prev?.title}
                                </div> : <div className="title none">이전글이 없습니다.</div>}
                            </div>
                            <div className="navi-item">
                                <div className="text">다음글</div>
                                {notiInfo?.next ? <div className="title" onClick={() => { setIdx(notiInfo?.next?.idx) }}>
                                    {notiInfo?.next?.title}
                                </div> : <div className="title none">다음글이 없습니다.</div>}
                            </div>
                        </div>

                        <div className="btn-box">
                            <Button
                                styles={{ width: 120 }}
                                buttonTxt="목록"
                                buttonShape="white"
                                onPress={() => {
                                    navigate("/mypageNoti")
                                }}
                            />
                        </div>
                    </div>

                </div>

            </div>
        </Layout >
    )
}