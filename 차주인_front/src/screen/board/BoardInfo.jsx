import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/page-board.css"

import Layout from "../../layout/Layout";
import Button from "../../component/Button"

import consts from "../../libs/consts"
import * as APIS from "../../utils/service";
import { API_URL } from '../../libs/apiUrl';
import { close, loadingflas, open } from '../../redux/popupSlice';
import moment from 'moment';
import { elapsedTime, goBackPage } from '../../utils/utils';
import { selectUserInfo } from '../../redux/userSlice';
import { toast } from 'react-toastify';

export default function BoardInfo({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);

    const UserData = useSelector(selectUserInfo)

    const [boardInfo, setBoardInfo] = useState({})

    const [commentText, setCommentText] = useState("")

    const [editId, setEditId] = useState("")
    const [editComment, setEditComment] = useState("")


    const loadData = (init = true) => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.board.info, { idx: params.get("idx"), init })
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                // console.log(result.data)
                setBoardInfo(result.data)
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
                window.opener?.location?.reload();
                alert("게시물이 없습니다.")
                window.close();
                navigate("/", { replace: true })
            })
    }

    const deleteBoard = () => {
        dispatch(
            open({
                content: "게시글을 삭제하시겠습니까?",
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                buttonCencle: "닫기",
                onPress: () => {
                    dispatch(close());
                    APIS.postData(API_URL.board.delete, { idx: boardInfo?.idx })
                        .then((result) => {
                            dispatch(loadingflas({ loading: false }))
                            alert("삭제되었습니다.")
                            // goBackPage(navigate);
                            window.opener.location.reload();
                            window.close();
                        })
                        .catch(e => {
                            dispatch(loadingflas({ loading: false }))
                        })
                },
                onCancelPress: () => { dispatch(close()); },
            })
        );

    }

    const sendComment = (idx = null, title) => {
        if (!title) {
            // console.log("내용을 입력하세요.")
            return;
        }

        let sendData = {
            b_idx: boardInfo?.idx,
            idx: idx,
            title: title
        }

        APIS.postData(API_URL.board.commentInsert, sendData)
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                setCommentText("")
                loadData(false);
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
            })
    }

    const deleteComment = (idx = null) => {
        if (!idx) {
            // console.log("삭제할 댓글이 없음.")
            return;
        }

        let sendData = {
            idx: idx,
        }

        dispatch(
            open({
                content: "댓글을 삭제하시겠습니까?",
                onCancelPress: false,
                titleviewer: false,
                button: "확인",
                buttonCencle: "닫기",
                onPress: () => {
                    dispatch(close());
                    APIS.postData(API_URL.board.commentDelete, sendData)
                        .then((result) => {
                            dispatch(loadingflas({ loading: false }))
                            toast("댓글이 삭제되었습니다.")
                            loadData(false);
                        })
                        .catch(e => {
                            dispatch(loadingflas({ loading: false }))
                        })
                },
                onCancelPress: () => { dispatch(close()); },
            })
        );
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <Layout header={false} footters={false}>

            <div className="boardInfoContain">
                <div className="global-titleBox bg_white fixed">
                    <img src="/images/icons/back.svg" alt="" onClick={() => {
                        // goBackPage(navigate);
                        window.close();
                        navigate("/", { replace: true })
                    }} />
                    <div className="titleInfo">
                        <div className="text">이전으로</div>
                    </div>
                </div>

                <div className="infoBox">
                    <div className="contentsBox">

                        <div className="user-and-menu">
                            <div className="user-info">{boardInfo?.user?.name} <span>{moment(boardInfo?.create_dt).format("YYYY.MM.DD HH:mm")}</span></div>
                            {UserData.userInfo?.idx == boardInfo?.user?.idx && <div class="drop-down">
                                <button class="drop-btn" />
                                <div class="drop-down-content">
                                    <a style={{ cursor: "pointer" }} onClick={() => { navigate("/boardEdit?idx=" + boardInfo?.idx) }}>수정하기</a>
                                    <a style={{ cursor: "pointer" }} onClick={deleteBoard} >삭제하기</a>
                                </div>
                            </div>}
                        </div>

                        <div className="title">{boardInfo?.title}</div>
                        <div className="image-box">
                            {boardInfo?.files?.map((v) => {
                                return <img src={consts.s3url + v} alt="" />
                            })}
                        </div>
                        <div className="text-box" dangerouslySetInnerHTML={{ __html: boardInfo?.desc ? String(boardInfo?.desc).replaceAll("\n", "<br>") : "" }}>
                        </div>
                    </div>

                    <div className="comment-box">
                        <div className="count">
                            댓글 <span className='num'>{boardInfo?.comment?.length}</span>
                        </div>
                        {boardInfo?.comment?.map((v) => {
                            return <div className="comment-item">
                                <div className="title">
                                    <div className="text-box">
                                        <span className="nick-name">{v?.name}</span>
                                        <span className="time"> · {elapsedTime(v?.create_dt)}</span>
                                    </div>
                                    {UserData.userInfo?.idx == v?.u_idx && <div class="drop-down">
                                        <button class="drop-btn" />
                                        <div class="drop-down-content">
                                            <a style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    setEditId(v?.idx)
                                                    setEditComment(v?.title)
                                                }}>수정하기</a>
                                            <a style={{ cursor: "pointer" }} onClick={() => { deleteComment(v?.idx) }}>삭제하기</a>
                                        </div>
                                    </div>}

                                </div>
                                <div className="text">
                                    {
                                        editId == v?.idx ?
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        padding: 5,
                                                        border: "1px solid #DDD",
                                                        borderRadius: 4
                                                    }}
                                                    type="text"
                                                    value={editComment}
                                                    onChange={e => { setEditComment(e.target.value) }}
                                                />
                                                <button style={{
                                                    padding: "5px 10px",
                                                    flexShrink: 0,
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    background: "#3B4894",
                                                    color: "#FFFFFF",
                                                    borderRadius: 4
                                                }}
                                                    onClick={() => {
                                                        sendComment(v?.idx, editComment)
                                                        setEditId("")
                                                    }}
                                                >수정</button>
                                                <button style={{
                                                    padding: "5px 10px",
                                                    flexShrink: 0,
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    background: "#999",
                                                    color: "#FFFFFF",
                                                    borderRadius: 4
                                                }}
                                                    onClick={() => {
                                                        setEditId("")
                                                    }}
                                                >취소</button>
                                            </div> :
                                            v?.title
                                    }
                                </div>
                            </div>
                        })}

                        {boardInfo?.comment?.length == 0 && <div className='no-comment'>
                            댓글이 없습니다.
                        </div>}
                    </div>
                </div>

                <div className="add-box">
                    <input
                        className='add-input'
                        placeholder='댓글 달기...'
                        value={commentText}
                        onChange={e => { setCommentText(e.target.value) }}
                        type="text"
                    />
                    <button className='add-btn' onClick={() => {
                        sendComment(null, commentText);
                    }}>
                        등록
                    </button>
                </div>
            </div>
        </Layout >
    )
}