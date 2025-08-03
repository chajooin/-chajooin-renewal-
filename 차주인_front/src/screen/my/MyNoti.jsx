import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/my/my-noti.css"

import Layout from "../../layout/Layout";
import Button from '../../component/Button';

import * as APIS from "../../utils/service";
import { goBackPage, numFormat } from '../../utils/utils';
import MyNavigator from './components/MyNavigator';
import { selectUserInfo } from '../../redux/userSlice';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, WindowScroller } from 'react-virtualized';
import { API_URL } from '../../libs/apiUrl';
import { loadingflas } from '../../redux/popupSlice';
import moment from 'moment';

const checkToken = () => {
    let token = localStorage.getItem("token")
    return token ? true : false
}

export default function MyNoti({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector(selectUserInfo)

    const [notiInfo, setNotiInfo] = useState([])

    const listRef = useRef(null);
    const cache = new CellMeasurerCache({
        defaultWidth: 100,
        fixedWidth: true
    });

    useEffect(() => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.noti.list)
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                setNotiInfo(result.data)
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }));
                console.log(e);
            })
    }, [])

    return (
        <Layout header={false} footters={false} >
            <div className="myNotiContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { navigate("/mypage", { replace: true }) }} />
                    <div className="titleInfo">
                        <div className="text">공지사항</div>
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
                        { title: "공지사항", isSelect: true }
                    ]} />

                    <div className="contents">
                        <div className="line" />
                        <div className="list-box">
                            {/* {Array(10).fill(null).map((v, i) => {
                                return <div
                                    key={`noti-it-${i}`}
                                    className="list-item"
                                    onClick={() => { navigate(`/mypageNotiInfo?idx=${i}`) }}
                                >
                                    <div className="title">공지사항 입니다.(제목 모두 표기) {i == 2 && "공지사항 입니다.(제목 모두 표기)공지사항 입니다.(제목 모두 표기)공지사항 입니다.(제목 모두 표기)공지사항 입니다.(제목 모두 표기)공지사항 입니다.(제목 모두 표기)"}</div>
                                    <div className="date">2023.03.15 15:46</div>
                                </div>
                            })} */}

                            <WindowScroller>
                                {({ height, scrollTop, isScrolling, onChildScroll }) => (
                                    <AutoSizer disableHeight>
                                        {({ width }) => (
                                            <List
                                                ref={listRef}
                                                autoHeight
                                                height={height}
                                                width={width}
                                                isScrolling={isScrolling}
                                                overscanRowCount={0}
                                                onScroll={onChildScroll}
                                                scrollTop={scrollTop}
                                                rowCount={notiInfo.length}
                                                rowHeight={cache.rowHeight}
                                                rowRenderer={({ index, key, parent, style }) => {
                                                    let row = notiInfo[index]
                                                    return <CellMeasurer cache={cache} parent={parent} key={key} columnIndex={0} rowIndex={index}>
                                                        <div style={style}>
                                                            <div
                                                                className="list-item"
                                                                onClick={() => { navigate(`/mypageNotiInfo?idx=${row?.idx}`) }}
                                                            >
                                                                <div className="title">{row?.title}</div>
                                                                <div className="date">{moment(row?.create_dt).format("YYYY.MM.DD HH.mm")}</div>
                                                            </div>
                                                        </div>
                                                    </CellMeasurer>
                                                }}
                                                deferredMeasurementCache={cache}
                                            />
                                        )}
                                    </AutoSizer>
                                )}
                            </WindowScroller>

                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}