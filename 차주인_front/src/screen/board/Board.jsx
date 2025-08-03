import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';

import "../../css/page-board.css"

import consts from "../../libs/consts"
import Layout from "../../layout/Layout";
import Button from "../../component/Button"
import { TextCheckBox } from "../../component/TextCheck"

import * as APIS from "../../utils/service";
import { API_URL } from '../../libs/apiUrl';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { close, loadingflas, showLoginPopup } from '../../redux/popupSlice';
import { DefaultImg, DefaultPfofile } from '../../component/DefaultImg';
import moment from 'moment';

const IconText = (props) => {
    let {
        imageSrc = "",
        imageProfile = "",
        text = "",
        textSize = 14,
        textColor = "",
        imageSize = 20,
        isBold = false,
    } = props

    return <div style={{ display: 'flex', gap: "4px", alignItems: "center" }}>
        {imageSrc ? <img style={{
            width: imageSize, height: imageSize,
        }} src={imageSrc} /> : <></>}

        {imageProfile && <img style={{
            width: imageSize, height: imageSize,
            borderRadius: "50%",
            border: "1px solid #EEE"
        }} src={imageProfile} onError={DefaultPfofile}></img>}
        <span style={{ fontSize: textSize, fontColor: textColor, fontWeight: isBold ? 700 : 400 }}>
            {text}
        </span>
    </div>
}

export default function Board({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLogin, setLogin] = useState(localStorage.getItem("token") ? true : false)

    const [boardList, setBoardList] = useState([]);
    const [newsList, setNewsList] = useState([]);

    const [order, setOrder] = useState(1);
    const [isMyView, setIsMyView] = useState(false);

    const loadData = () => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.board.list, { order: order, my: isMyView })
            .then((result) => {
                // console.log(result.data);
                setBoardList(result.data);
                dispatch(loadingflas({ loading: false }))
            })
            .catch(e => {
                console.log(e)
                dispatch(loadingflas({ loading: false }))
            })
    }

    const loadNewsList = () => {
        APIS.postData(API_URL.board.newList, {}).then((result) => {
            let list = result.data;
            setNewsList(result.data)
        })
    }

    useEffect(() => {
        // console.log("render!")
        loadNewsList();

    }, [])

    useEffect(() => {
        loadData()
    }, [order, isMyView])

    return (
        <Layout header={true} actives='board'>
            <div className="boardContain">
                <div className="top-menu-box">
                    <div className="top-category-box">
                        <TextCheckBox name="bnv-check" text="최근순" checked={order == 1} onChange={(v) => { setOrder(1) }} />
                        <img className="line" src="/images/icons/devide.svg" alt="" />
                        <TextCheckBox name="bfv-check" text="인기순" checked={order == 2} onChange={(v) => { setOrder(2) }} />
                        <TextCheckBox name="bmv-check" text="내 글 보기" isIcon checked={isMyView} onChange={(v) => { setIsMyView(v) }} />
                    </div>
                    <div className="top-btn-box">
                        <Button
                            titleimgs="/images/icons/plus.svg"
                            buttonTxt="글 등록하기"
                            onPress={() => {
                                if (isLogin)
                                    navigate("/boardAdd")
                                else
                                    dispatch(showLoginPopup({
                                        onPress: () => {
                                            dispatch(close())
                                            navigate("/login")
                                        }
                                    }))
                            }}
                        />
                    </div>
                </div>
                <div className="list-box">
                    {newsList.length > 0 && <div>
                        <div className="news-list-title">공지사항</div>
                        {newsList.map((v, i) => {
                            return <div key={`news-item-${i}`} className='news-list-item'
                                onClick={() => { navigate(`/mypageNotiInfo?idx=${v?.idx}`) }}>
                                <div className="title">{v?.title}</div>
                                <div className="date">{moment(v?.create_dt).format("YYYY.MM.DD HH.mm")}</div>
                            </div>
                        })}
                    </div>}
                    {newsList.length > 0 && <div className="news-list-title margint32">게시글</div>}
                    <WindowScroller
                        ref={(wScroller) => {
                            if (wScroller)
                                wScroller.updatePosition();
                        }}>
                        {({ height, scrollTop, isScrolling, onChildScroll }) => {
                            return <>
                                <AutoSizer disableHeight>
                                    {({ width }) => (
                                        <List
                                            ref={el => {
                                                window.listEl = el;
                                            }}
                                            autoHeight
                                            height={height}
                                            isScrolling={isScrolling}
                                            onScroll={onChildScroll}
                                            overscanRowCount={3}
                                            rowCount={boardList.length}
                                            rowHeight={170}
                                            rowRenderer={
                                                ({ index, isScrolling, isVisible, key, style }) => {
                                                    const row = boardList[index]
                                                    // positio top width height left
                                                    return (<div key={key} style={style}>
                                                        <div className="list-item" onClick={() => { window.open(`/boardInfo?idx=${row?.idx}`) }}>
                                                            <div className="info">
                                                                <div className="title">{row?.title}</div>
                                                                <div className="text">{row?.desc ? (row?.desc?.length == 50 ? row?.desc + "..." : row?.desc) : "-"}</div>
                                                                <div className="footter">
                                                                    <IconText imageProfile={consts.s3url + row?.user?.profile} imageSize={32} text={row?.user?.name} isBold />
                                                                    <IconText imageSrc="/images/icons/eye-line.svg" imageSize={20} text={row?.view} />
                                                                    <IconText imageSrc="/images/icons/message-3-line.svg" imageSize={20} text={row?.comment_cnt} />
                                                                </div>
                                                            </div>
                                                            {row?.files?.length > 0 && <img src={consts.s3url + row?.files[0].file_path} alt="" />}
                                                        </div>
                                                    </div>);
                                                }
                                            }
                                            scrollToIndex={0}
                                            scrollTop={scrollTop}
                                            width={width}
                                        />
                                    )}
                                </AutoSizer>
                            </>
                        }}
                    </WindowScroller>
                </div>

            </div>
        </Layout >
    )
}