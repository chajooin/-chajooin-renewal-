import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';

import "../../css/my/my-calendar.css"

import Layout from "../../layout/Layout";
import MyNavigator from "./components/MyNavigator"

import * as APIS from "../../utils/service";
import { API_URL } from '../../libs/apiUrl';
import { selectUserInfo } from '../../redux/userSlice';
import moment from 'moment';
import { goBackPage } from '../../utils/utils';

export default function MyCalendar({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo } = useSelector(selectUserInfo)

    const [tabIndex, setTabIndex] = useState(0)
    const [listData, setListData] = useState([])

    const loadData = () => {
        setListData([])
        APIS.postData(API_URL.calendar.list, { type: tabIndex + 1 })
            .then(result => {
                if (result?.data) {
                    console.log(result?.data)
                    setListData(result.data);
                }
            })
            .catch(e => {
                console.log(e)

            })
    }

    useEffect(() => {
        if (location.state?.type) {
            setTabIndex(Number(location.state?.type))
        }
    }, [])

    useEffect(() => {
        loadData()
    }, [tabIndex])

    return (
        <Layout header={false} footters={false}>
            <div className="myCalendarContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { navigate("/mypage", { replace: true }); }} />
                    <div className="titleInfo">
                        <div className="text">예약상담</div>
                    </div>

                    {<div className="quick-alamContain">
                        <div className="box" onClick={() => { navigate("/message") }}>
                            <img src="/images/icons/mail-line.svg" alt="" />
                            {userInfo?.message_count > 0 && <div className="num">{userInfo?.message_count}</div>}
                        </div>
                    </div>}
                </div>

                <div className="infoBox margint60">
                    <MyNavigator list={[
                        { title: "마이" },
                        { title: "예약상담", isSelect: true }
                    ]} />

                    <div className="line"></div>

                    <div className="tab-menu-box">
                        {["받은 예약상담", "요청한 예약상담"].map((v, i) => {
                            return <div
                                className={`tab-menu ${i === tabIndex && "select"}`}
                                onClick={() => { setTabIndex(i) }}
                            >
                                {v}
                            </div>
                        })}
                    </div>

                    <div className="list-box">
                        {listData?.map((v, i) =>
                            <div className="list-item" onClick={() => { navigate(`/mypageCalendarInfo?idx=${v?.idx}`, { state: { tabIndex } }) }}>
                                <div className="title-box">
                                    {tabIndex == 0 &&
                                        <div className="title">
                                            {!v?.read_dt && <div className='new'>N</div>}
                                            {v?.name && <div><b>{v?.name}</b>님으로부터 예약상담요청이 도착했습니다.</div>}
                                        </div>
                                    }

                                    <div className="title bold">{v?.board_title}</div>
                                    <div className="title sub">{v?.board_sub_data}</div>
                                </div>
                                <div className="value-box">
                                    <div className="value">{moment(v?.create_dt).format("YYYY.MM.DD")}</div>
                                </div>
                            </div>
                        )}
                        {listData.length <= 0 && <p style={{ color: "#666" }}>목록이 없습니다.</p>}
                    </div>
                </div>

            </div>
        </Layout >
    )
}