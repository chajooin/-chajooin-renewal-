import React, { useState, useEffect, useRef } from 'react';

import "../../css/custom-popup.css"
import consts from "../../libs/consts"
import { DefaultImg } from '../DefaultImg';

export const MessageBox = (props) => {
    let {
        userImg = "",
        userName = "",
        date = "",
        isTrash = false,
        onTrashClick,
        message = "",
        sendMessage = "쪽지보내기",
        isWrite = false,
        textValue,
        onChange,
    } = props
    return <div className='custom-popup'>
        <div className="user-card">
            <div className="icon">
                <img src={userImg ? consts.s3url + userImg : "/images/icons/user-test-icon.png"} alt="" onError={DefaultImg} />
            </div>
            <div className="info">
                <div className="name">{userName ? userName : "이름없음"}</div>
                <div className="date">{date ? date : "-"}</div>
            </div >
            {
                isTrash && <div className="trash-btn">
                    <button onClick={() => { onTrashClick && onTrashClick() }} />
                </div>
            }
        </div>

        {
            message && <div className="message" dangerouslySetInnerHTML={{ __html: message }}>
            </div>
        }

        {isWrite && <div className="write-box">
            <div className="send-message">{sendMessage}</div>
            <textarea
                placeholder='내용을 입력해 주세요.'
                value={textValue}
                onChange={(e) => {
                    let v = e.target.value
                    onChange && onChange(v)
                }} />
        </div>}


    </div>
}

export const MessageSend = (props) => {
    let {
        textValue,
        onChange,
    } = props
    return <div className='custom-popup'>
        <div className="user-card">
            <div className="info">
                <div className="name">쪽지 보내기</div>
            </div >
        </div>
        <div className="write-box">
            <textarea
                placeholder='내용을 입력해 주세요.'
                value={textValue}
                onChange={(e) => {
                    let v = e.target.value
                    onChange && onChange(v)
                }} />
        </div>
    </div>
}