import React, { useEffect, useState } from 'react';
import { Link, useFetcher } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { open, close, reset } from '../redux/popupSlice';


import Button from '../component/Button';

//import images from '../libs/images';


export default function Popup({ }) {

    const dispatch = useDispatch();
    const {
        open, title, titleImg, titleStyle, content, contentbold, button, buttonCencle,
        onCancelPress, onPress, alert, alertStyle, component, componentExit, style,
        wideOne, titleviewer, buttonStyle, noneMt
    } = useSelector(s => s.popupReducer);


    const handleClose = () => {
        dispatch(close());
        onCancelPress && onCancelPress();
    };

    const handleSubmit = () => {
        dispatch(close());
        onPress && onPress();
    };

    return (
        <>
            {open &&
                <div className='PopupArea'>
                    <div>
                        <div className='PopupAreaBG'
                            onClick={() => handleClose()}
                        />
                        <div className='PopupAreaContents'>
                            <div>
                                {titleviewer === true &&
                                    <div className="popTitle padding20">
                                        <span style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: 8
                                        }}>
                                            {titleImg != "" && <img src={titleImg} width="24"></img>}
                                            {title}
                                        </span>
                                        <button
                                            onClick={() => {
                                                handleClose();
                                            }}
                                        >
                                            <img src="/images/icons/x-button.svg" width='20' />
                                        </button>
                                    </div>
                                }
                                {wideOne === false &&
                                    <div className="padding32">
                                        {content && <div className='popcontents'>{content}</div>}
                                        {component && <div className='popcontents'>{component}</div>}
                                        {(onCancelPress || onPress) &&
                                            <div className={`popbuttons ${noneMt && "mt-none"}`}>
                                                {onCancelPress &&
                                                    <div>
                                                        <Button
                                                            buttonShape="gray"
                                                            buttonTxt={buttonCencle}
                                                            onPress={() => {
                                                                onCancelPress();
                                                            }}
                                                        />
                                                    </div>
                                                }
                                                {onPress &&
                                                    <div >
                                                        <Button
                                                            className={buttonStyle === "reset" ? "resetButton" : ""}
                                                            titleimgs={buttonStyle === "reset" ? "/images/icons/loop-left-line.svg" : ""}
                                                            buttonTxt={button}
                                                            onPress={() => {
                                                                onPress();
                                                            }}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                }
                                {wideOne === true &&
                                    <>
                                        <div className="">
                                            {content && <div className='popcontents'>{content}</div>}
                                            {component && <div className='popcontents'>{component}</div>}
                                        </div>
                                        {
                                            onPress &&
                                            <div>
                                                <Button
                                                    buttonTxt={button}
                                                    onPress={() => { onPress(); }}
                                                    styles={{ height: 52, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                                                />
                                            </div>
                                        }

                                    </>
                                }
                            </div>
                        </div>
                    </div>

                </div>
            }
        </>
    );
}
