import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/my/my-withdrawal.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';
import MyNavigator from "./components/MyNavigator"

import * as APIS from "../../utils/service";
import { goBackPage, numFormat } from '../../utils/utils';
import { close, open } from '../../redux/popupSlice';
import { API_URL } from '../../libs/apiUrl';

export default function MyWithdrawal({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const params = useParams();
    const [policy, setPolicy] = useState("")

    const sendWithdrawal = () => {
        APIS.postData(API_URL.user.widthdrawal, {})
            .then((result) => {
                localStorage.setItem("token", "")
                navigate("/")
            })
            .catch((e) => {
                dispatch(
                    open({
                        component: '다시 시도해주세요',
                        button: "확인",
                        alert: false,
                        onPress: () => {
                            dispatch(close());
                        },
                    })
                );
            })
    }

    useEffect(() => {
        APIS.postData(API_URL.commom.term, { type: 4 })
            .then((result) => {
                console.log(result)
                setPolicy(result.data)
            })
            .catch((e) => {
                setPolicy("")
            })
    }, [])

    return (
        <Layout header={false} footters={false} >
            <div className="myWithdrawalContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { navigate("/mypage", { replace: true }) }} />
                    <div className="titleInfo">
                        <div className="text">회원탈퇴</div>
                    </div>
                </div>

                <div className="infoBox margint60">
                    <MyNavigator list={[
                        { title: "마이" },
                        { title: "회원탈퇴", isSelect: true },
                    ]} />

                    <div className="line"></div>

                    <div className="info-text" dangerouslySetInnerHTML={{ __html: policy }}></div>

                    <Button
                        buttonTxt="탈퇴하기"
                        buttonSize="large"
                        onPress={() => {
                            dispatch(
                                open({
                                    component: '탈퇴 하시겠습니까?',
                                    button: "아니오",
                                    buttonCencle: "탈퇴",
                                    alert: false,
                                    onPress: () => {
                                        dispatch(close());
                                    },
                                    onCancelPress: () => {
                                        dispatch(close());
                                        sendWithdrawal();
                                    }
                                })
                            );
                        }}
                    />

                </div>
            </div>
        </Layout >
    )
}