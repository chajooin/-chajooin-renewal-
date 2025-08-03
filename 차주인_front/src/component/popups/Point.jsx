import React, { useEffect, useState } from "react"
import Selector from "../Select";
import Input from '..//Input';
import { numFormat, patternNum } from "../../utils/utils"
import CONSTS from "../../libs/consts"
import APP_TEXT from "../../libs/texts"

export const ChargePoint = (props) => {
    let {
        items = [],
        onChange
    } = props

    const boxStyle = {
        display: "flex",
        width: "50%",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #FFF",
        background: "#F1F1F1",
        padding: "24px 0px",
        cursor: "pointer",
        gap: 4
    }
    const selectStyle = {
        border: "1px solid #3B4894",
        background: "#FFF"
    }

    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (onChange) onChange(items[index])
    }, [index])

    return <div style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        marginBottom: 20,
        gap: 20
    }}>
        <p style={{ width: "100%", textAlign: "center" }}>충전하실 포인트를 선택하세요.</p>
        <div
            style={{
                display: "flex",
                width: "100%",
                flexWrap: "wrap",
            }}
        >
            {items.map((v, i) =>
                <div
                    style={index == i ? { ...boxStyle, ...selectStyle } : boxStyle}
                    onClick={() => {
                        setIndex(i)
                    }}
                >
                    <p style={{ fontSize: 20, fontWeight: 700, color: index == i ? "" : "#999" }}>{numFormat(v.point)}P</p>
                    <p style={{ fontSize: 16, color: index == i ? "#666" : "#999" }}>{numFormat(v.price)}원</p>
                </div>)}
        </div>
    </div>
}

const checkImg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
    <g clip-path="url(#clip0_11535_7917)">
        <path d="M18.3337 10.4993C18.3337 15.1014 14.6024 18.8327 10.0003 18.8327C5.39824 18.8327 1.66699 15.1014 1.66699 10.4993C1.66699 5.89727 5.39824 2.16602 10.0003 2.16602C14.6024 2.16602 18.3337 5.89727 18.3337 10.4993Z" fill="#3DDAB4" />
        <path d="M18.3063 2.32206L7.98242 13.0352L9.67728 14.6684L20.0011 3.95534L18.3063 2.32206Z" fill="#6C19FF" />
        <path d="M15.9983 4.71484L7.98242 13.0353L9.67701 14.6682L17.3958 6.65651C17.0241 5.94276 16.552 5.28901 15.9983 4.71484Z" fill="#2100C4" />
        <path d="M6.23886 8.11204L4.60938 9.81055L9.67782 14.673L11.3073 12.9745L6.23886 8.11204Z" fill="#2100C4" />
    </g>
    <defs>
        <clipPath id="clip0_11535_7917">
            <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
        </clipPath>
    </defs>
</svg>

export const ExchangePoint = (props) => {
    const {
        point = 0,
        banks = [],
        onChange,
        errorMsg
    } = props

    const [viewPrice, setViewPrice] = useState(0);
    const [focus, setFocus] = useState(false);

    const [price, setPrice] = useState(0);
    const [bank, setBank] = useState(-1);
    const [bankNum, setBankNum] = useState("");
    const [name, setName] = useState("");

    const [err, setErr] = useState(true)

    const onPriceChange = (v) => {
        let delCom = v.replaceAll(",", "")

        if (patternNum.exec(delCom)) {
            let num = Number(delCom)
            num >= CONSTS.exchangeLimit ? setErr(false) : setErr(true)

            if (point >= num) {
                setViewPrice(numFormat(num, true))
                setPrice(num)
            } else {
                setViewPrice(numFormat(point, true))
                setPrice(point)
            }
        } else {
            if (delCom === "") {
                setViewPrice(numFormat(0))
                setPrice(0)
            }
        }
    }

    useEffect(() => {
        if (onChange)
            onChange({
                point: price,
                bank: bank,
                bank_num: bankNum,
                bank_name: name
            });
    }, [price, bank, bankNum, name, onChange])

    return <div style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        marginBottom: 20,
    }}>
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            <span>나의 포인트</span>
            <span style={{ fontSize: 32, fontWeight: 700, color: "#3B4894" }}>{numFormat(point)}P</span>
        </div>

        <div style={{
            display: "flex",
            width: "100%",
            justifyContent: "end",
            alignItems: "center",
            padding: "0px 20px",
            height: 64,
            gap: 8,
            fontSize: 32,
            fontWeight: 700,
            border: focus ? "1px solid #3B4894" : "1px solid #DDD",
            borderRadius: 4,
            marginTop: 20
        }}>
            <input
                style={{
                    width: "100%",
                    border: "none",
                    textAlign: "end",
                    fontWeight: 700
                }}
                type="text"
                value={viewPrice}
                onChange={(e) => { onPriceChange(e.target.value) }}
                onFocus={() => { setFocus(true) }}
                onBlur={() => { setFocus(false) }}
            />
            <span style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#CCC"
            }}>P</span>
        </div>

        {err && <p style={{
            fontSize: 14,
            marginTop: 8
        }}>1만 포인트 이상 정산 가능합니다.</p>}
        <p style={{
            display: "flex",
            alignItems: "center",
            fontSize: 14,
            marginTop: 20,
            gap: 8
        }}>{checkImg}{APP_TEXT.point.info_01}</p>
        <p style={{
            display: "flex",
            alignItems: "center",
            fontSize: 14,
            marginTop: 4,
            gap: 8
        }}>{checkImg}{APP_TEXT.point.info_02}</p>

        <p style={{
            fontSize: 16,
            marginTop: 20,
        }}>정산 계좌정보</p>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 12, gap: 8 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <p style={{ flexShrink: 0, width: 60 }}>은행명</p>
                <Selector
                    placeholder="은행선택"
                    values={bank}
                    setValues={setBank}
                    selectData={banks.map(v => { return { values: v, labels: v } })}
                />
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <p style={{ flexShrink: 0, width: 60 }}>계좌번호</p>
                <Input
                    className={`inputs`}
                    placeholder="계좌번호 입력"
                    setValue={setBankNum}
                    value={bankNum}
                />
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <p style={{ flexShrink: 0, width: 60 }}>예금주</p>
                <Input
                    className={`inputs`}
                    placeholder="예금주 입력"
                    setValue={setName}
                    value={name}
                />
            </div>
        </div>

        {
            errorMsg &&
            <div style={{
                display: "flex", marginTop: 20, justifyContent: "center",
                color: "#F00",
                fontSize: 14,
                fontWeight: 700
            }}>
                {errorMsg}
            </div>
        }
    </div>
}