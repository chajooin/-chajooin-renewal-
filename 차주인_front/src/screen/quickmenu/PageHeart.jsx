import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/quick-menu.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';

import * as APIS from "../../utils/service";
import { API_URL } from '../../libs/apiUrl';
import { loadUserInfo } from '../../redux/userSlice';
import { close, open } from '../../redux/popupSlice';
import { toast } from 'react-toastify';

export default function PageHeart({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [tabIndex, setTabIndex] = useState(0)
    const [list, setList] = useState([]);


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

    const loadList = (type) => {
        APIS.postData(API_URL.user.like, { type })
            .then((result) => {
                // console.log("🚀 ~ .then ~ result:", result.data)
                setList(result.data)
            })
            .catch(e => {
                console.log(e.responce)
            })
    }

    const delItem = (idx) => {
        if (idx) {
            APIS.postData(API_URL.user.delLike, { idx })
                .then((result) => {
                    loadList(tabIndex + 1)
                    dispatch(loadUserInfo())
                    toast("삭제되었습니다.");
                })
                .catch(e => {
                    console.log(e.responce)
                    loadList(tabIndex + 1)
                })
        }
    }

    useEffect(() => {
        loadList(tabIndex + 1)
    }, [tabIndex])

    useEffect(() => {
        console.log("render!")
        // initScroll()

        return () => [
            window.removeEventListener("scroll", handleScroll)
        ]
    }, [])

    return (
        <Layout header={true} footters={true}>
            <div className="pageHeartContain">
                <div className="quick-menu-title-box">
                    <div className="title">관심</div>
                    {/* <div className="btn-box">
                        <Button
                            buttonTxt="전체삭제"
                            buttonShape="gray"
                            // buttonSize="small"
                            onPress={() => { }}
                        />
                    </div> */}
                </div>
                <div className="tab-menu-box">
                    {["중고화물차", "지입차", "구인", "구직"].map((v, i) => {
                        return <div
                            className={`tab-menu ${i === tabIndex && "select"}`}
                            onClick={() => { setTabIndex(i) }}
                        >
                            {v}
                        </div>
                    })}
                </div>

                <div className="list-box">
                    {
                        list.map((v, i) =>
                            <div className="list-item">
                                <div style={{ cursor: "pointer" }} onClick={() => {
                                    if (v.board_title) {
                                        if (tabIndex == 0)
                                            window.open("/usedCarInfo?idx=" + v?.board_idx)
                                        else if (tabIndex == 1)
                                            window.open("/rentedCarInfo?idx=" + v?.board_idx)
                                        else if (tabIndex == 2)
                                            window.open("/jobofferInfo?idx=" + v?.board_idx)
                                        else if (tabIndex == 3)
                                            window.open("/jobsearchInfo?idx=" + v?.board_idx)
                                    } else toast("삭제된 게시물 입니다.")
                                }}>
                                    <div className="title">{v.board_title ? v.board_title : "삭제된 게시물"}</div>
                                    <div className="sub-title">{v.board_sub_data ? v.board_sub_data : "정보가 없습니다."}</div>
                                </div>

                                <button onClick={() => {
                                    dispatch(
                                        open({
                                            content: "관심목록에서 삭제하시겠습니까?",
                                            onCancelPress: false,
                                            titleviewer: false,
                                            button: "확인",
                                            buttonCencle: "닫기",
                                            onPress: () => {
                                                dispatch(close())
                                                delItem(v.idx)
                                            },
                                            onCancelPress: () => { dispatch(close()) },
                                        })
                                    );
                                }} className={`heart-btn checked`} />
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