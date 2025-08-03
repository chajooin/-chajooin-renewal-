import React, { useEffect, useState } from 'react';
import { Link, useFetcher, useNavigate } from "react-router-dom";


import { useDispatch, useSelector } from "react-redux";

export default function Radios(props) {

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
        flexrows = 'row'
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
                        display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 1
                    }}
                >
                    {namevalue?.map((x, i) => {
                        return (
                            <button
                                key={i}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4,
                                    backgroundColor: values === x?.values ? '#6164A5' : '#EEE', height: 40, fontSize: 14,
                                    color: values === x?.values ? '#fff' : '#999', fontWeight: values === x?.values ? 700 : 400,
                                    width: '50%'
                                }}
                                onClick={() => {
                                    setvalues(x?.values);
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
                        display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 20
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
                                    setvalues(x?.values);
                                }}
                            >

                                <img src={`/images/icons/Radio_button_${values === x?.values ? '' : 'un'}checked.svg`} style={{ width: 24, height: 24 }} />
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
                        display: 'flex', alignItems: 'flex-start', flexDirection: 'row', gap: 12, flexWrap: 'wrap'
                    }}
                >
                    {namevalue?.map((x, i) => {
                        return (
                            <button
                                key={`radioimg${i}`}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4,
                                    fontSize: 14, gap: 4
                                }}
                                onClick={() => {
                                    setvalues(x?.values);
                                }}
                            >
                                <img src={`/images/icons/Radio_button_${values === x?.values ? '' : 'un'}checked.svg`} style={{ width: sizes, height: sizes }} />
                                <p style={{ textAlign: 'left', fontSize: fontSizes, color: '#333', fontWeight: fontweights }}>{x?.names}</p>
                            </button>
                        );
                    })}
                </div>
            }
            {linetype === 'checkimg' &&
                <div
                    style={{
                        display: 'flex', flexDirection: flexrows, gap: 12, flexWrap: 'wrap'
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
                                    setvalues(x?.values);
                                }}
                            >
                                <img src={`/images/icons/check-${values === x?.values ? 'on' : 'off'}.svg`} style={{ width: sizes, height: sizes }} />
                                <p style={{ textAlign: 'left', fontSize: fontSizes, color: '#333', fontWeight: fontweights }}>{x?.names}</p>
                            </button>
                        );
                    })}
                </div>
            }
        </>
    )
}