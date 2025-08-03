import React, { useEffect, useState } from 'react';
import { Link, useFetcher, useNavigate } from "react-router-dom";


import { useDispatch, useSelector } from "react-redux";
import { randomDigitCharactersSpecialCharacterslength } from '../utils/utils';

export default function Checkbox(props) {

    const {
        labelmarginT = 20,
        label = '',
        linetype,
        values,
        setvalues = () => { },
        namevalue = [],
        fontweights = 700,
        fontSizes = 16,
        sizes = 24,
        flexrows = 'row',
        disable = false
    } = props;


    const dispatch = useDispatch();
    const navigate = useNavigate();


    return (
        <>
            {label &&
                <div className='normalform_comment' style={{ marginTop: labelmarginT, marginBottom: 8 }}>{label}</div>
            }
            {linetype === 'two' &&
                <div
                    style={{
                        display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 1, pointerEvents: disable ? "none" : "unset"
                    }}
                >
                    {namevalue?.map((x, i) => {
                        return (
                            <button
                                key={i}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4,
                                    backgroundColor: values?.find(item => item?.values === x?.values) ? '#6164A5' : '#EEE', height: 40, fontSize: 14,
                                    color: values?.find(item => item?.values === x?.values) ? '#fff' : '#999',
                                    fontWeight: values?.find(item => item?.values === x?.values) ? 700 : 400,
                                    width: '50%'
                                }}
                                onClick={() => {
                                    if (values?.find((item, index) => item?.values === x?.values)) {
                                        setvalues(values.filter(item => item?.values !== x?.values));
                                    } else {
                                        setvalues(values.concat(x));
                                    }
                                }}
                            >
                                {x?.names}
                            </button>
                        );
                    })}
                </div>
            }

            {linetype === 'comment' &&
                <div
                    style={{
                        display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 20, pointerEvents: disable ? "none" : "unset"
                    }}
                >
                    {namevalue?.map((x, i) => {
                        return (
                            <button
                                key={`comment${i}`}
                                style={{
                                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center', borderRadius: 4,
                                    fontSize: 14, gap: 4
                                }}
                                onClick={() => {
                                    if (values?.find((item, index) => item?.values === x?.values)) {
                                        setvalues(values.filter(item => item?.values !== x?.values));
                                    } else {
                                        setvalues(values.concat(x));
                                    }
                                }}
                            >

                                <img src={`./images/icons/Radio_button_${values?.find(item => item?.values === x?.values) ? '' : 'un'}checked.svg`} style={{ width: 24, height: 24 }} />
                                <div
                                    style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', gap: 4 }}
                                >
                                    <p style={{ textAlign: 'left', fontSize: 16, color: '#333', fontWeight: 700 }}>{x?.names}</p>
                                    <p style={{ textAlign: 'left', fontSize: 14, color: '#333' }}>{x?.comments}</p>
                                </div>

                            </button>
                        );
                    })}
                </div>
            }
            {linetype === 'radioimg' &&
                <div
                    style={{
                        display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 12, flexWrap: 'wrap', pointerEvents: disable ? "none" : "unset"
                    }}
                >
                    {namevalue?.map((x, i) => {
                        return (
                            <button
                                key={`radioimg-${i}-${x}`}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4,
                                    fontSize: 14, gap: 4
                                }}
                                onClick={() => {
                                    if (values?.find((item, index) => item?.values === x?.values)) {
                                        setvalues(values.filter(item => item?.values !== x?.values));
                                    } else {
                                        setvalues(values.concat(x));
                                    }
                                }}
                            >
                                <img src={`./images/icons/Radio_button_${values?.find(item => item?.values === x?.values) ? '' : 'un'}checked.svg`} style={{ width: sizes, height: sizes }} />
                                <p style={{ textAlign: 'left', fontSize: fontSizes, color: '#333', fontWeight: fontweights }}>{x?.names}</p>
                            </button>
                        );
                    })}
                </div>
            }
            {linetype === 'checkimg' &&
                <div
                    style={{
                        display: 'flex', alignItems: 'flex-start', flexDirection: flexrows, gap: 12, flexWrap: 'wrap', pointerEvents: disable ? "none" : "unset"
                    }}
                >
                    {namevalue?.map((x, i) => {
                        return (
                            <button
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4,
                                    fontSize: 14, gap: 4
                                }}
                                onClick={() => {
                                    if (values?.find((item, index) => item?.values === x?.values)) {
                                        setvalues(values.filter(item => item?.values !== x?.values));
                                    } else {
                                        setvalues(values.concat(x));
                                    }
                                }}
                            >
                                <img src={`/images/icons/check-${values?.find(item => item?.values === x?.values) ? 'on' : 'off'}.svg`} style={{ width: sizes, height: sizes }} />
                                <p style={{ textAlign: 'left', fontSize: fontSizes, color: '#2F3444', fontWeight: fontweights }}>{x?.names}</p>
                            </button>
                        );
                    })}
                </div>
            }
        </>
    )
}