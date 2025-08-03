import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/quick-menu.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';
import { MessageBox } from "../../component/popups/MessageBox"

import * as APIS from "../../utils/service";
import consts from "../../libs/consts"
import { close, open } from '../../redux/popupSlice';
import { API_URL } from '../../libs/apiUrl';
import { loadUserInfo } from '../../redux/userSlice';
import { dateMinformat } from '../../utils/utils';

export default function PageHeart({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const params = useParams();

    const [tabIndex, setTabIndex] = useState(1)
    const [list, setList] = useState([])
    const [sendMsg, setSendMsg] = useState({ idx: 0, msg: "" })
    const [isSend, setIsSend] = useState(false)

    useEffect(() => {
        loadList(tabIndex)
    }, [tabIndex])

    useEffect(() => {
        if (isSend) {
            sendMessage()
            setIsSend(false)
        }
    }, [isSend])

    const loadList = (type) => {
        setList([])
        APIS.postData(API_URL.user.message, { type })
            .then((result) => {
                console.log("🚀 ~ .then ~ result:", result.data)
                setList(result.data)
            })
            .catch(e => {
                console.log(e.responce)
            })
    }

    const sendMessage = () => {
        if (sendMsg.msg) {
            APIS.postData(API_URL.user.sendMessage, {
                target_idx: sendMsg.idx,
                desc: sendMsg.msg.replaceAll("\n", "<br>")
            })
                .then((result) => {
                    loadList(tabIndex);
                })
                .catch(e => {
                    console.log(e.responce)
                    loadList(tabIndex);
                })
        }
    }

    const delItem = (idx) => {
        if (idx) {
            APIS.postData(API_URL.user.delMessage, { idx })
                .then((result) => {
                    loadList(tabIndex);
                    dispatch(loadUserInfo())
                })
                .catch(e => {
                    console.log(e.responce)
                    loadList(tabIndex);
                })
        }
    }

    useEffect(() => {
        console.log("render!")
        let timer = null;

        const handleScroll = () => {
            if (timer) {
                clearTimeout(timer);
            }

            timer = window.setTimeout(() => {
                let totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                let curScroll = window.scrollY

                if (totalScroll == window.scrollY) {
                    //마지막
                }
            }, 1000);
        };

        window.addEventListener("scroll", handleScroll)

        return () => [
            window.removeEventListener("scroll", handleScroll)
        ]
    }, [])

    const openPopup = (v) => {
        setSendMsg({ idx: 0, msg: "" })

        let openData = {
            button: "답장 보내기",
            buttonCencle: "닫기",
            onPress: () => {
                setIsSend(true)
                dispatch(close());
            },
            onCancelPress: () => {
                dispatch(close());
            }
        }

        if (tabIndex == 1) {
            openData.component = <MessageBox
                userImg={v.user?.profile}
                userName={v.user?.name}
                date={dateMinformat(v.create_dt, false)}
                sendMessage="답장 보내기"
                message={v.desc}
                isTrash
                isWrite
                onTrashClick={() => {
                    dispatch(close());
                    delItem(v.idx)
                }}
                noneMt
                onChange={(value) => {
                    setSendMsg({ idx: v.user?.idx, msg: value })
                }}
            />

        } else if (tabIndex == 2) {
            openData.component = <MessageBox
                userImg={v.targetUser?.profile}
                userName={v.targetUser?.name}
                date={dateMinformat(v.create_dt, false)}
                message={v.desc}
                isTrash
                onTrashClick={() => {
                    dispatch(close());
                    delItem(v.idx)
                }}
                noneMt
            />
            delete openData.onPress
            delete openData.button
        }

        dispatch(
            open(openData)
        );

    }

    return (
        <Layout header={true} footters={true}>
            <div className="pageMessageContain">
                <div className="quick-menu-title-box">
                    <div className="title">쪽지</div>
                </div>
                <div className="tab-menu-box">
                    {["받은 쪽지", "보낸 쪽지"].map((v, i) => {
                        return <div
                            className={`tab-menu ${(i + 1) === tabIndex && "select"}`}
                            onClick={() => { setTabIndex(i + 1) }}
                        >
                            {v}
                        </div>
                    })}
                </div>
                <div className="list-box">
                    {
                        list.map((v, i) =>
                            <div className="list-item" onClick={() => { openPopup(v) }}>
                                <div className="icon-box">
                                    {tabIndex == 1 && (v.user?.profile ? <img src={consts.s3url + v.user?.profile} alt="" /> : <img src="/images/icons/user-test-icon.png" alt="" />)}
                                    {tabIndex == 2 && (v.targetUser?.profile ? <img src={consts.s3url + v.targetUser?.profile} alt="" /> : <img src="/images/icons/user-test-icon.png" alt="" />)}
                                </div>
                                <div className='info-box'>
                                    <div className="name">{tabIndex === 1 ? v.user?.name : v.targetUser?.name}</div>
                                    <div className="title">{v.desc?.replaceAll("<br>", " ")}</div>
                                </div>

                                <div className="date">{dateMinformat(v.create_dt, false)}</div>
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