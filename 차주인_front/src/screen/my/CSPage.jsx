import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/page-my.css"

import consts from "../../libs/consts"
import Layout from "../../layout/Layout";
import Button from '../../component/Button';

import * as APIS from "../../utils/service";
import { numFormat } from '../../utils/utils';
import { close, open } from '../../redux/popupSlice';
import { API_URL } from '../../libs/apiUrl';
import { loadUserInfo, setUserBoard, setUserInfo } from '../../redux/userSlice';
import InputFile from '../../component/InputFile';
import InputFileBox from '../../component/InputFileBox';

// const test = { "base": "", "ext": "png" }

export default function CSPage({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        
    }, [])

    return (
        <Layout header={true} >
            <div className="pageMyContain">
                <div className="quick-menu-title-box">
                    <div className="title">고객센터</div>
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
                </div>
            </div>
        </Layout >
    )
}