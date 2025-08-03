import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../css/page-board.css"

import Layout from "../../layout/Layout";
import Button from "../../component/Button"
import Input from '../../component/Input';
import InputFileMulti from '../../component/InputFileMulti'

import * as APIS from "../../utils/service";
import { loadingflas } from '../../redux/popupSlice';
import { API_URL } from '../../libs/apiUrl';
import { goBackPage } from '../../utils/utils';

export default function BoardAdd({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);

    const [boardInfo, setBoardInfo] = useState({})

    const [idx, setIdx] = useState(null)
    const [title, setTitle] = useState("");
    const [fileVal, setFileVal] = useState([]);
    const [desc, setDesc] = useState("")

    const [deleteFiles, setDeleteFiles] = useState([]);

    useEffect(() => {
        console.log(deleteFiles)
    }, [deleteFiles])

    const sendBoard = () => {
        let sendData = {
            idx: idx, // 있으면 수정 없으면 등록 
            title: "", // 제목
            desc: "", // 상세 내용
            files: [],
            delete_files: deleteFiles
        }

        let err = []
        if (title) sendData.title = title; else err.push("제목");
        if (desc) sendData.desc = desc; else err.push("내용");
        if (fileVal) sendData.files = fileVal

        if (err.length > 0) {
            // console.log(err)
            return
        }

        // console.log("senddata ::", sendData)
        // console.log("등록하기..")
        APIS.postData(API_URL.board.insert, sendData)
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                goBackPage(navigate);
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
            })
    }

    const losdBoard = (idx, init = false) => {
        APIS.postData(API_URL.board.info, { idx, init })
            .then((result) => {
                let info = result.data

                setIdx(info?.idx);
                setTitle(info?.title);
                setFileVal(info?.files.map(v => v));
                setDesc(info?.desc);
            })
            .catch(e => { goBackPage(navigate); });
    }

    const deleteBoard = () => {
        APIS.postData(API_URL.board.delete, { idx })
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                // console.log(result.data)
                goBackPage(navigate);
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
            })
    }


    useEffect(() => {
        if (params.get("idx")) {
            // console.log("수정하기 글")
            losdBoard(params.get("idx"))
        } else {
            // console.log("새글")
        }
    }, [])

    return (
        <Layout header={true} >

            <div className="boardAddContain">
                <div className="global-titleBox bg_white">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { goBackPage(navigate); }} />
                    <div className="titleInfo">
                        <div className="text">글{idx ? " 수정하기" : "쓰기"}</div>
                    </div>
                </div>

                <div className="infoBox">
                    <div className="add-content-box">
                        <div className="add-title">제목 (30자 이내)</div>
                        <Input
                            className={`inputs`}
                            placeholder="제목을 입력해 주세요."
                            setValue={setTitle}
                            value={title}
                            maxlength={30}
                        />
                    </div>

                    <div className="add-content-box">
                        <div className="add-title">이미지</div>
                        <InputFileMulti
                            type="file"
                            multiple={true}
                            name="board-add-img-file"
                            onDelete={(v) => {
                                setDeleteFiles([...deleteFiles, v])
                            }}
                            value={fileVal} setValue={setFileVal}
                            valid="image" />
                    </div>

                    <div className="add-content-box">
                        <div className="add-title">내용 (1000자 이내)</div>
                        <textarea
                            className="text-box"
                            placeholder='내용을 입력해주세요.'
                            value={desc}
                            onChange={e => { setDesc(e.target.value) }}
                            maxLength={1000}
                        />
                    </div>

                    <Button
                        buttonTxt={`${idx ? "수정" : "등록"}하기`}
                        onPress={sendBoard}
                        buttonSize="large"
                    />
                </div>
            </div>
        </Layout >
    )
}