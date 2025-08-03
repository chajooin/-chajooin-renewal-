import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/quick-menu.css"

import Layout from "../../layout/Layout";
import Checkbox from '../../component/Checkbox';
import Button from '../../component/Button';
import InputFileMulti from '../../component/InputFileMulti'

import * as APIS from "../../utils/service";
import { API_URL } from '../../libs/apiUrl';
import { dateMinformat } from '../../utils/utils';
import { close, open } from '../../redux/popupSlice';
import { loadUserInfo } from '../../redux/userSlice';
import { toast } from 'react-toastify';

export default function Notification({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const params = useParams();

    const [list, setList] = useState([]);

    const loadList = () => {
        APIS.postData(API_URL.user.alarm)
            .then((result) => {
                setList(result.data)
            })
            .catch(e => {
                console.log(e.responce)
            })
    }

    const delItem = (idx) => {
        if (idx) {
            APIS.postData(API_URL.user.delAlarm, { idx })
                .then((result) => {
                    loadList();
                    toast("삭제되었습니다.")
                    dispatch(loadUserInfo())
                })
                .catch(e => {
                    console.log(e.responce)
                    loadList();
                })
        } else {
            // 전체삭제
            APIS.postData(API_URL.user.delAlarm, {})
                .then((result) => {
                    loadList();
                    toast("삭제되었습니다.")
                    dispatch(loadUserInfo())
                })
                .catch(e => {
                    console.log(e.responce)
                    loadList();
                })
        }

    }

    let timer = null;
    const handleScroll = () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = window.setTimeout(() => {
            console.log(document.documentElement.scrollHeight - document.documentElement.clientHeight, window.scrollY)
            let totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let curScroll = window.scrollY

            if (totalScroll == window.scrollY) {
                //마지막
            }
        }, 500);
    };

    const initScroll = () => {
        window.addEventListener("scroll", handleScroll)
    }

    useEffect(() => {
        console.log("render!")
        // initScroll();
        loadList();

        return () => [
            window.removeEventListener("scroll", handleScroll)
        ]
    }, [])

    return (
        <Layout header={true} footters={true}>
            <div className="notificationContain">
                <div className="quick-menu-title-box">
                    <div className="title">알림</div>
                    <div className="btn-box">
                        <Button
                            buttonTxt="전체삭제"
                            buttonShape="gray"
                            // buttonSize="small"
                            onPress={() => {
                                dispatch(
                                    open({
                                        content: "알림목록에서 모두 삭제하시겠습니까?",
                                        onCancelPress: false,
                                        titleviewer: false,
                                        button: "확인",
                                        buttonCencle: "닫기",
                                        onPress: () => {
                                            dispatch(close());
                                            delItem("all");
                                        },
                                        onCancelPress: () => { dispatch(close()) },
                                    })
                                );
                            }}
                        />
                    </div>
                </div>
                <div className="list-box">
                    {
                        list.map((v, i) =>
                            <div key={`qm-nli-${i}`} className="list-item" >
                                <button className='delete-btn' onClick={() => {
                                    dispatch(
                                        open({
                                            content: "알림목록에서 삭제하시겠습니까?",
                                            onCancelPress: false,
                                            titleviewer: false,
                                            button: "확인",
                                            buttonCencle: "닫기",
                                            onPress: () => {
                                                dispatch(close());
                                                delItem(v.idx);
                                            },
                                            onCancelPress: () => { dispatch(close()) },
                                        })
                                    );
                                }} />
                                {/* <div className="message"><span className='bold'>홍길동</span>님으로부터 예약상담요청이 도착했습니다.</div> */}
                                <div onClick={() => {
                                    if (v?.c_idx) {
                                        navigate("/mypageCalendarInfo?idx=" + v?.c_idx)
                                    } else {
                                        if (v?.board == 1) {
                                            window.open("/usedCarInfo?idx=" + v?.board_idx)
                                        } else if (v?.board == 2) {
                                            window.open("/rentedCarInfo?idx=" + v?.board_idx)
                                        } else if (v?.board == 3) {
                                            window.open("/jobofferInfo?idx=" + v?.board_idx)
                                        } else if (v?.board == 4) {
                                            window.open("/jobsearchInfo?idx=" + v?.board_idx)
                                        } else if (v?.board == 5) {
                                            window.open("/boardInfo?idx=" + v?.board_idx)
                                        }
                                    }
                                }}>
                                    <div className="message" dangerouslySetInnerHTML={{ __html: v.title }}></div>
                                    <div className="title">{v.board_title}</div>
                                    <div className="sub-title">{v.board_sub_data}</div>
                                    <div className="date">{dateMinformat(v.create_dt, false)}</div>
                                </div>
                            </div>
                        )
                    }
                    {
                        list.length <= 0 &&
                        <div className='quick-menu-noneitem'>목록이 없습니다.</div>
                    }
                </div>
            </div>
        </Layout >
    )
}