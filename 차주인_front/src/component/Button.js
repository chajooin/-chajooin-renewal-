import React, { useEffect, useState } from 'react';
import { Link, useFetcher, useNavigate } from "react-router-dom";


import { useDispatch, useSelector } from "react-redux";
/*
    <Button buttonTxt="소" buttonSize="small" />
    <Button buttonTxt="기본" />
    <Button buttonTxt="중" buttonSize="medium" />
    <Button buttonTxt="대" buttonSize="large" />

    <Button buttonTxt="기본" />
    <Button buttonTxt="흰색" buttonShape="white" />
    <Button buttonTxt="그레이" buttonShape="gray" />
    <Button buttonTxt="레드" buttonShape="red" />
    <Button buttonTxt="아이콘" titleimgs="/images/icons/plus.svg" buttonShape="" />

    <Button buttonTxt="아이콘" titleimgs="/images/icons/alarm-warning-line.svg" buttonShape="red" />
 */
export default function Button(props) {

    const {
        className,
        onPress = () => { },
        type,
        styles,
        disabled,
        buttonTxt,
        buttonShape = "nomal", // nomal white gray red black blue
        buttonSize = "nomal", // small nomal medium large
        titleimgs = "",
        id_data = "",
        filenames = ""
    } = props;

    const shapeToClass = (shape) => {
        let resultClassName = ""

        if (shape === "white") { resultClassName = "white-btn" }
        else if (shape === "gray") { resultClassName = "gray-btn" }
        else if (shape === "red") { resultClassName = "red-btn" }
        else if (shape === "black") { resultClassName = "black-btn" }
        else if (shape === "blue") { resultClassName = "blue-btn" }
        return resultClassName
    }

    const sizeToClass = (size) => {
        let resultClassName = ""

        if (size === "small") { resultClassName = "small" }
        else if (size === "medium") { resultClassName = "medium" }
        else if (size === "large") { resultClassName = "large" }
        return resultClassName
    }


    const dispatch = useDispatch();
    const navigate = useNavigate();


    return (
        <>
            <button
                id={id_data}
                filenamedata={filenames}
                style={styles}
                className={`default-button ${shapeToClass(buttonShape)} ${sizeToClass(buttonSize)} ${className ? className : 'normalbutton'} ${disabled === true && 'buttondisabled'}`}
                onClick={onPress}
                type={type}
                disabled={disabled}
            >
                {titleimgs !== '' && <img src={titleimgs} />}
                {buttonTxt}
            </button>
        </>
    )
}