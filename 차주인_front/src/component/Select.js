import React, { useEffect, useState } from 'react';
import { Link, useFetcher, useNavigate } from "react-router-dom";


import { useDispatch, useSelector } from "react-redux";

export default function Select(props) {

    const {
        styles,
        values = '-1',
        setValues = () => { },
        selectData = [],
        selectClass = 'custom-select',
        subselectClass = '',
        backgroundColors = '',
        placeholder = '',
        disabled = false
    } = props;


    const dispatch = useDispatch();
    const navigate = useNavigate();


    return (
        <div className={`${selectClass} ${subselectClass}`}  >
            <select
                onChange={(e) => { setValues(e.target.value); }}
                style={{ ...styles, background: backgroundColors }}
                disabled={disabled}
            >
                <option value="-1" disabled hidden selected>{placeholder}</option>
                {selectData?.length > 0 && selectData?.map((x, i) => {
                    return (
                        <option key={i} value={x?.values} selected={`${values == x?.values ? 'selected' : ''}`}>{x?.labels}</option>
                    );
                })}
            </select>
        </div>
    )
}