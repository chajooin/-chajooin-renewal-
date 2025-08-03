import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/my/my-qna.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';

import * as APIS from "../../utils/service";
import { goBackPage, numFormat } from '../../utils/utils';
import MyNavigator from './components/MyNavigator';
import ArcodianMenu from './components/MyArcodionMenu';
import { selectConfig } from '../../redux/configSlice';
import { API_URL } from '../../libs/apiUrl';
import { loadingflas } from '../../redux/popupSlice';

export default function MyFAQ({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const ConfigData = useSelector(selectConfig);

    const [cate, setCate] = useState(ConfigData.configInfo?.fag_cate[0]);
    const [faqList, setfaqList] = useState([])

    useEffect(() => {
        if (cate) {
            dispatch(loadingflas({ loading: true }))
            setfaqList([])
            APIS.postData(API_URL.noti.faq, { cate: cate })
                .then((result => {
                    setfaqList(result.data);
                    dispatch(loadingflas({ loading: false }))
                }))
                .catch(e => {
                    setfaqList([])
                    dispatch(loadingflas({ loading: false }))
                })
        }
    }, [cate])
    return (
        <Layout header={false} footters={false} >
            <div className="myQNAContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { navigate("/mypage", { replace: true }) }} />
                    <div className="titleInfo">
                        <div className="text">자주하는 질문</div>
                    </div>
                </div>

                <div className="infoBox margint60">
                    <MyNavigator list={[
                        { title: "마이" },
                        { title: "자주하는 질문", isSelect: true }
                    ]} />

                    <div className="contents">
                        <div className="line" />

                        <div className="menu-box">
                            {ConfigData.configInfo?.fag_cate?.map((v, i) => {
                                return <div
                                    className={`menu-item ${cate == v && "select"}`}
                                    onClick={() => { setCate(v) }}
                                >
                                    {v}
                                </div>
                            })}
                            {/* {["전체", "회원", "결제", "카테고리", "결제취소", "기타"].map((v, i) => {
                                return <div
                                    className={`menu-item ${index === i && "select"}`}
                                    onClick={() => { setIndex(i) }}
                                >
                                    {v}
                                </div>
                            })} */}
                        </div>

                        <div className="list-box">
                            {faqList.map((v) => {
                                return <ArcodianMenu title={v?.title} >
                                    <div dangerouslySetInnerHTML={{ __html: v?.desc }}></div>
                                </ArcodianMenu>
                            })}
                        </div>

                    </div>

                </div>
            </div>
        </Layout >
    )
}