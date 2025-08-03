import React, { useEffect, useState } from 'react';
import { Link, useFetcher, useNavigate } from "react-router-dom";
import DaumPostcode from 'react-daum-postcode';

import { useDispatch, useSelector } from "react-redux";


import {
    regPhone, regEmail, patternNum, patternPrice, patternEng, hide_call_btn,
    patternEngUpper, patternSpc, patternSpcId, patternSpcPw, patternSpcEmail,
    patternKor, numFormat,
} from "../utils/utils";
import Button from './Button';
import Timer from "./Timer";


export default function Input(props) {

    const {
        className,
        placeholder,
        type,
        name,
        maxlength,
        value,
        setValue,
        valid,
        label,
        subLabel,
        error,
        setError = () => console.log(""),
        success,
        readOnly = false,
        onBlur,
        onChange,
        onChangeAuth,
        index,
        onSearch,
        withButton = '',
        withButtonPress,
        withButtonLong,
        withText,
        timer = false,
        timerState,
        msg,
        full,
        autoComplete = '',
        onLink,
        onLinkText,
        icon_box,
        keyword,
        //searchfunc,
        search_callback,
        delete_callback,
        hide_call_btn,
        callReturn,
        placeholderFont,
        onFocus,
        disableds = false,
        errClear = () => { },
        style = "",
        labelstyle = 0,
        clearflag = false,
        allwaysclearflag = false,
        passwordview = false,
        fixedCk = false,
        requireds = false,
        customplaceholder = false,
        customplaceholdertxt = '',
        searchicons = false,
        rightplaceholder = '',
        leftplaceholder = '',
        submitfunc = () => { },
        withstyle = ''
    } = props;


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [t, setT] = useState(timer);
    const [f, setF] = useState(false);

    const [isOpenPost, setIsOpenPost] = useState(false);
    const [keycode, setkeycode] = useState(0);
    const [viewtype, setviewtype] = useState(type);


    useEffect(() => {
        setT(timer);
    }, [timer]);

    useEffect(() => {
        if (readOnly && (valid === 'price' && setValue)) {
            setValue(numFormat(value));
        }
        if (readOnly && (valid === 'pricedouble' && setValue)) {
            setValue(numFormat(value));
        }
    }, [value]);

    const enterfunc = (e) => {
        if (e.key === "Enter") {
            submitfunc();
        }
    }

    const handleChange = (e) => {

        if (valid === 'num' || valid === 'price') {
            let num = e.target.value.replace(patternKor, "");
            num = num.replace(patternEngUpper, "");
            num = num.replace(patternSpcId, "");
            num = num.replace(patternEng, "");
            // console.log("???", num);
            if (onChange) {
                onChange(index, e, num);
            } else if (onSearch) {
                onSearch(name, num);
            } else {
                setValue(num);
                //setValue(num);
            }
        } else if (valid === 'id') {
            let val = e.target.value.replace(patternKor, ""); // 한글제거
            val = val.replace(patternEngUpper, ""); // 대문자제거
            val = val.replace(patternSpcId, ""); // 특수문자제거
            if (onChange) {
                onChange(index, e, val);
            } else if (onSearch) {
                onSearch(name, val);
            } else {
                setValue(val);
            }
        } else if (valid === 'pw') {
            let val = e.target.value.replace(patternKor, ""); // 한글제거
            val = val.replace(patternSpcPw, ""); // 특수문자제거
            val = val.toLowerCase(); // 대문자 소문자로 변환
            if (onChange) {
                onChange(index, e, val);
            } else if (onSearch) {
                onSearch(name, val);
            } else {
                setValue(val);
            }
        } else if (valid === 'email') {
            //let val = e.target.value.replace(patternKor, ""); // 한글제거
            let val = e.target.value.replace(patternSpcEmail, ""); // 특수문자제거
            val = val.toLowerCase(); // 대문자 소문자로 변환
            if (onChange) {
                onChange(index, e, val);
            } else if (onSearch) {
                onSearch(name, val);
            } else {
                setValue(val);
            }
        } else if (valid === 'phone') {
            let val = e.target.value.replace(patternKor, ""); // 한글제거
            val = val.replace(patternEng, ""); // 영문
            val = val.replace(patternEngUpper, ""); // 대문자제거
            let vals = val?.replaceAll('.', '');
            let s = vals.replace(/(\d{3})(\d{4})(\d{4})/g, '$1-$2-$3');
            setValue(s.substring(0, 13));
        } else {
            if (onChange) {
                onChange(index, e, e.target.value);
            } else if (onSearch) {
                onSearch(name, e.target.value);
            } else if (onChangeAuth) {
                onChangeAuth(e.target.value);
            } else {
                setValue(e.target.value);
            }
        }
    };

    const handleBlur = (e) => {
        setF(false);

        if (valid === 'price') {
            if (onChange) {
                onChange(index, e, numFormat(value));
            } else {
                setValue(numFormat(value));
            }
        } else if (valid === 'id') {

            if (patternKor.test(value)) {
                setError("영문 소문자, 숫자와 특수기호(@),(.),(-),(_) 만 사용 가능합니다.");
            }

        }
    };
    const handleFocus = () => {
        setError && valid !== 'pw' && setError("");
        setF(true);

        if (withButton === "주소찾기") {
            setIsOpenPost(true);
        }

        if (withButton === "viewpop") {
            onFocus(name);
        }
    };
    const handleClick = () => {
        if (withButton === "주소찾기") {
            setIsOpenPost(true);
        } else if (withButton === "지역선택" || withButton === "관리") {
            withButtonPress();
        } else if (withButton === "viewpop") {
            withButtonPress();
        }
    };
    const onCompletePost = (data) => {
        let fullAddr = data.address;
        let extraAddr = '';

        // console.log('data', data);

        let jibunAddress = jibunAddress;

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddr += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddr += extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddr += extraAddr !== '' ? ` (${extraAddr})` : '';
        }

        setValue({
            addr: data.address,
            sido: data?.sido,
            sigungu: data?.sigungu || data?.sido
        });

        setIsOpenPost(false);
    };

    const postBoxStyle = {
        display: 'block',
        position: 'relative',
        width: '100%',
        border: '1px solid #000',
    };
    const postCodeStyle = {
        width: '100%',
        borderTop: '1px solid #000',
    };
    return (
        <>
            <div style={{ width: '100%' }} >
                {label && labelstyle === 0 &&
                    <div className='labeldiv' style={{ marginBottom: 8 }}>
                        <label className="input_label" htmlFor={name}>{label}</label>
                        {subLabel &&
                            <label className="input_label_sub" htmlFor={name}>{subLabel}</label>
                        }
                    </div>
                }
                <div className="input_section">
                    {label && labelstyle === 1 &&
                        <label className="input_label_style2" htmlFor={name}>
                            {label}
                            {requireds === true && <span style={{ color: 'red' }}>*</span>}
                        </label>
                    }
                    {label && labelstyle === 2 && (value !== "" || f === true) &&
                        <label className="input_label_style2" htmlFor={name}>
                            {label}
                            {requireds === true && <span style={{ color: 'red' }}>*</span>}
                        </label>
                    }

                    <input
                        type={valid === 'num' ? 'tel' : (type === 'dateformat' ? 'text' : type)}
                        name={name}
                        id={name}
                        className={className + (readOnly ? " disable" : "") + (withButton ? (withButtonLong ? " withButtonLong" : " withButton") : "") + (withText ? " withText" : "") + (error ? " error" : "")}
                        placeholder={placeholder}
                        onChange={(e) => {
                            errClear();
                            handleChange(e);
                        }}
                        //onChange={callReturn} 
                        onFocus={handleFocus}
                        onClick={handleClick}
                        onBlur={(e) => { handleBlur(e); onBlur && onBlur() }}
                        onKeyDown={enterfunc}
                        value={value}
                        maxLength={maxlength ? maxlength : "255"}
                        readOnly={withButton === '주소찾기' || withButton === '지역선택' ? true : readOnly}
                        style={style ? style : { fontWeight: placeholderFont && "400" }}
                        autoComplete={autoComplete}
                        disabled={disableds}
                        pattern={type === 'number' ? "\d*" : ""}
                    />
                    {value === "" && customplaceholder === true &&
                        <label className="placeholder" htmlFor={name}>{customplaceholdertxt}<span style={{ color: 'red' }}>*</span></label>
                    }
                    {withText &&
                        <span className="input_with_text">{withText}</span>
                    }
                    {onLink &&
                        <span className="input_with_text_link" onClick={() => onLink()}>{onLinkText ? onLinkText : "보기"}</span>
                    }
                    {clearflag && value !== '' &&
                        <Button titleimgs={'./images/icons/close-circle-fill.svg'} className={'inputclearbutton'} onPress={() => {
                            setValue('');
                        }} styles={{ right: fixedCk ? 34 : 10 }} />
                    }
                    {allwaysclearflag &&
                        <Button titleimgs={'./images/icons/x-circle.svg'} className={'inputclearbutton'} onPress={() => {
                            setValue('');
                        }} styles={{ right: fixedCk ? 34 : 10 }} />
                    }
                    {searchicons &&
                        <div className="searchicons">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.16675 3.33329C5.94509 3.33329 3.33341 5.94496 3.33341 9.16663C3.33341 12.3883 5.94509 15 9.16675 15C12.3884 15 15.0001 12.3883 15.0001 9.16663C15.0001 5.94496 12.3884 3.33329 9.16675 3.33329ZM1.66675 9.16663C1.66675 5.02449 5.02461 1.66663 9.16675 1.66663C13.3089 1.66663 16.6667 5.02449 16.6667 9.16663C16.6667 13.3088 13.3089 16.6666 9.16675 16.6666C5.02461 16.6666 1.66675 13.3088 1.66675 9.16663Z" fill="#101010" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2858 13.2857C13.6113 12.9603 14.1389 12.9603 14.4643 13.2857L18.0893 16.9107C18.4148 17.2361 18.4148 17.7638 18.0893 18.0892C17.7639 18.4147 17.2363 18.4147 16.9108 18.0892L13.2858 14.4642C12.9604 14.1388 12.9604 13.6111 13.2858 13.2857Z" fill="#101010" />
                            </svg>
                        </div>
                    }
                    {withButton !== '' &&
                        <Button
                            className={'inputwithButton'}
                            buttonTxt={withButton}
                            onPress={withButtonPress}
                            styles={withstyle ? withstyle : {}}
                        />
                    }
                    {rightplaceholder !== '' &&
                        <div className={'rightplaceholder'}>{rightplaceholder}</div>
                    }
                    {leftplaceholder !== '' &&
                        <div className={'rightplaceholder'} style={{ right: 'auto', left: 10 }}>{leftplaceholder}</div>
                    }


                    {passwordview && value !== '' &&
                        <Button titleimgs={'./images/icons/eye-line.svg'} className={'inputclearbutton'} onPress={() => {
                            setviewtype(viewtype === 'text' ? 'password' : 'text');
                        }} styles={{ right: fixedCk ? 34 : 10 }} />
                    }
                    {fixedCk &&
                        <img src={'./images/icons/BGM_check.svg'} className={'inputclearbutton'} style={{ width: 23, top: 8, right: 8 }} />
                    }
                    {t && (
                        <Timer defaultTime={180} defaultMin={"03"} defaultSec={"00"} timeOut={timerState} />
                    )}

                </div>

                {error &&
                    <p className="input_error"><span></span>{error}</p>
                }
                {success && !f &&
                    <p className="input_success">{success}</p>
                }
                {msg &&
                    <p className="input_msg">{msg}</p>
                }
                {isOpenPost ? (
                    <div style={postBoxStyle}>
                        <button type="button" className="addrbtn exit_btn" onClick={() => setIsOpenPost(false)} />
                        <DaumPostcode style={postCodeStyle} autoClose onComplete={onCompletePost} />
                    </div>
                ) : null}
            </div>
        </>
    )
}