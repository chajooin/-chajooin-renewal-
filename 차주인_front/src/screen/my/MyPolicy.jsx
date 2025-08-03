import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/my/my-policy.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';

import * as APIS from "../../utils/service";
import { goBackPage, numFormat } from '../../utils/utils';
import MyNavigator from './components/MyNavigator';
import consts from "../../libs/consts"
import { API_URL } from '../../libs/apiUrl';
import { close, loadingflas, open } from '../../redux/popupSlice';
import { selectUserInfo } from '../../redux/userSlice';

export default function MyPolicy({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const UserInfo = useSelector(selectUserInfo)
    const policyData = consts.policyList.find(v => v.type == params.get("idx"))

    const [isLogin, setIsLogin] = useState(false)
    const [policyHTML, setPolicy] = useState("")

    const goHomePopup = (msg) => {
        dispatch(
            open({
                content: msg,
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                onPress: () => {
                    dispatch(close())
                    navigate("/")
                }
            })
        );
    }

    useEffect(() => {
        console.log("render policy!", policyData)
        let token = localStorage.getItem("token");
        setIsLogin(token ? true : false);



        if (policyData) {
            APIS.postData(API_URL.commom.term, { type: policyData.type })
                .then((result) => {
                    console.log(result.data)
                    setPolicy(result.data)
                })
                .catch(e => {
                    console.log(e)
                    goHomePopup("잠시 후 다시 시도하세요.")
                })
        } else {
            goHomePopup("올바르지 않은 요청입니다.")
        }
    }, [])

    return (
        <Layout header={false} footters={false}>
            <div className="myPolicyContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { navigate("/mypage", { replace: true }) }} />
                    <div className="titleInfo">
                        <div className="text">{policyData.title}</div>
                    </div>

                    {isLogin && <div className="quick-alamContain">
                        <div className="box" onClick={() => { navigate("/message") }}>
                            <img src="/images/icons/mail-line.svg" alt="" />
                            {UserInfo.userInfo?.message_count > 0 && <div className="num">{UserInfo.userInfo?.message_count}</div>}
                        </div>
                    </div>}

                </div>

                <div className="infoBox margint60">
                    <MyNavigator list={[
                        { title: "마이" },
                        { title: policyData.title, isSelect: true }
                    ]} />
                    <div className="line"></div>

                    <div className="contents" dangerouslySetInnerHTML={{ __html: policyHTML }}></div>
                </div>

            </div>
        </Layout >
    )
}