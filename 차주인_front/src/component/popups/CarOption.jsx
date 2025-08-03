import { useEffect, useState } from "react";
import Selector from "../Select";
import { useSelector } from "react-redux";

import consts from "../../libs/consts"
import { selectConfig } from "../../redux/configSlice";
import { numFormat, yearList } from "../../utils/utils";
export const SidoOption = (props) => {
    const ConfigData = useSelector(selectConfig)

    let {
        setValue = "",
        onChange
    } = props

    const [sido, setSido] = useState("");

    useEffect(() => {
        if (setValue) {
            setSido(setValue)
        }
    }, [])

    useEffect(() => {
        if (onChange) onChange(sido)
    }, [sido])

    return <div style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        marginBottom: 20
    }}>
        <Selector
            placeholder="시/도"
            values={sido}
            setValues={setSido}
            selectData={ConfigData.configSidos?.map((v) => {
                return { values: v, labels: v }
            })}
        />
    </div>
}

// 제조사 차종
export const MadeOption = (props) => {
    // {maker:string, cars:string[]}[]}

    let {
        carDatas = [],
        setValue = { maker: '', car: '' },
        onChange
    } = props

    const [index, setIndex] = useState(-1);
    const [subValue, setSubValue] = useState("");

    useEffect(() => {
        if (setValue) {
            // console.log("🚀 ~ useEffect ~ setValue:", setValue)
            let mIndex = carDatas.findIndex((v) => v.maker == setValue.maker)
            // console.log("🚀 ~ useEffect ~ mIndex:", mIndex)
            setIndex(mIndex)
            if (mIndex >= 0) {
                let sCar = carDatas[mIndex].cars.find(v => v == setValue.car)
                // console.log("🚀 ~ useEffect ~ sCar:", sCar)
                setSubValue(sCar)
            }
        }
    }, [])

    useEffect(() => {
        if (index >= 0) {
            if (onChange) onChange({ maker: carDatas[index].maker, car: subValue })
        }
    }, [index, subValue])

    return <div style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
    }}>
        <Selector
            placeholder="제조사 선택"
            values={index}
            setValues={(v) => {
                setIndex(v)
                setSubValue("")
            }}
            selectData={carDatas.map((v, i) => {
                return { values: i, labels: v.maker }
            })}
        />
        <Selector
            placeholder="차종 선택"
            styles={{
                marginTop: 12,
                marginBottom: 20
            }}
            values={subValue}
            setValues={setSubValue}
            selectData={
                index >= 0 ?
                    [{ values: "", labels: "전체" }].concat(carDatas.find((v) => v.maker == carDatas[index].maker).cars.map((v, i) => {
                        return { values: v, labels: v }
                    })) :
                    []
            }
            disabled={index >= 0 ? false : true}
        />
    </div>
}

//형태
export const TypeOption = (props) => {

    const ConfigData = useSelector(selectConfig)

    let {
        setValue = {
            range: { min: null, max: null },
            ton: "",
            carType: ""
        },
        onChange
    } = props

    const selectStyle = {
        border: "none",
        color: "#FFF",
        border: "1px solid #3B4894",
        backgroundColor: "#3B4894",
    }
    const defaultCardStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: 64,
        borderRadius: 8,
        backgroundColor: "#FFF",
        border: "1px solid #CCC",
        cursor: "pointer"
    }

    const fontStyle1 = { fontSize: 20, fontWeight: 700, color: "inherit", }
    const fontStyle2 = { fontSize: 14, color: "inherit", }

    const cardStyle = (isSelect) => {
        return isSelect ? Object.assign({}, defaultCardStyle, selectStyle) : defaultCardStyle
    }

    const [cardIndex, setCardIndex] = useState(0)
    const [ton, setTon] = useState("");
    const [carType, setCarType] = useState("");

    let isFirst = false
    useEffect(() => {
        if (setValue) {
            if (setValue?.range?.min == "1") { setCardIndex(1) }
            else if (setValue?.range?.min == "2.5") { setCardIndex(2) }
            else if (setValue?.range?.min == "11") { setCardIndex(3) }
            else { setCardIndex(0) }

            if (setValue?.ton) { setTon(setValue?.ton) }
            if (setValue?.carType) { setCarType(setValue?.carType) }
        }
    }, [])

    useEffect(() => {
        if (onChange) {
            let changeData = {
                range: { min: null, max: null },
                ton: "",
                carType: ""
            }

            if (cardIndex == 1) {
                changeData.range = {
                    min: 1, max: 5
                }
            }
            else if (cardIndex == 2) { changeData.range = { min: 2.5, max: 9.5 } }
            else if (cardIndex == 3) { changeData.range = { min: 11, max: 27 } }
            else changeData.range = { min: null, max: null }

            if (ton) {
                changeData.ton = ton
            }

            if (carType) changeData.carType = carType

            onChange(changeData)
        }
    }, [cardIndex, ton, carType])

    return <div style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
    }}>
        <div style={{
            display: "flex",
            gap: 8,
        }}>
            <div style={cardStyle(cardIndex === 1)} onClick={() => {
                setCardIndex(1)
            }}>
                <p style={fontStyle1}>소형</p>
                <p style={fontStyle2}>1~1톤~5톤</p>
            </div>
            <div style={cardStyle(cardIndex === 2)} onClick={() => {
                setCardIndex(2)
            }}>
                <p style={fontStyle1}>중형</p>
                <p style={fontStyle2}>2.5톤~9.5톤</p>
            </div>
            <div style={cardStyle(cardIndex === 3)} onClick={() => {
                setCardIndex(3)
            }}>
                <p style={fontStyle1}>대형</p>
                <p style={fontStyle2}>11톤~27톤</p>
            </div>
        </div>
        <div style={{ marginTop: 20 }}>
            <Selector
                placeholder="톤 선택"
                values={ton}
                setValues={setTon}
                selectData={
                    ConfigData.configInfo?.options?.ton_option?.map((v) => {
                        return { values: v, labels: v }
                    })
                } />
        </div>
        <div style={{ marginTop: 12, marginBottom: 20 }}>
            <Selector
                placeholder="형태 선택"
                values={carType}
                setValues={setCarType}
                selectData={
                    ConfigData.carTypes?.map((v) => {
                        return { values: v, labels: v }
                    })
                } />
        </div>

    </div >
}

//톤
export const TonOption = (props) => {

    const ConfigData = useSelector(selectConfig)

    let {
        setValue,
        onChange
    } = props

    const [ton, setTon] = useState("");

    let isFirst = false
    useEffect(() => {
        if (setValue) {
            setTon(setValue)
        }
    }, [])

    return <div style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
    }}>
        <div style={{ marginBottom: 20 }}>
            <Selector
                placeholder="톤 선택"
                values={ton}
                setValues={(v) => {
                    setTon(v)
                    if (onChange) onChange(v)
                }}
                selectData={
                    ConfigData.configInfo?.options?.ton_option?.map((v) => {
                        return { values: v, labels: v }
                    })
                } />
        </div>
    </div >
}

//연식
export const YearOption = (props) => {
    let {
        setValue,
        onChange
    } = props;

    const [start, setstart] = useState(null);
    const [end, setend] = useState(null);

    useEffect(() => {
        if (setValue.min) setstart(setValue.min)
        if (setValue.max) setend(setValue.max)
    }, [])

    useEffect(() => {
        if (onChange) {
            onChange({ min: start, max: end })
        }
    }, [start, end])

    return <div
        style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            gap: 12,
            marginBottom: 20
        }}
    >
        <Selector placeholder="연도 선택"
            values={start}
            setValues={setstart}
            selectData={yearList().map(v => {
                return { values: v, labels: v + "년" }
            })} />
        <span>~</span>
        <Selector placeholder="연도 선택"
            values={end}
            setValues={setend}
            selectData={yearList().map(v => {
                return { values: v, labels: v + "년" }
            })} />
    </div>
}

// 주행거리
export const LengthOption = (props) => {
    let {
        setValue,
        onChange
    } = props;

    const [start, setstart] = useState(null);
    const [end, setend] = useState(null);

    useEffect(() => {
        if (setValue.min) setstart(setValue.min)
        if (setValue.max) setend(setValue.max)
    }, [])

    useEffect(() => {
        if (onChange) {
            onChange({ min: start, max: end })
        }
    }, [start, end])


    return <div
        style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            gap: 12,
            marginBottom: 20
        }}
    >
        <Selector placeholder="최소 거리"
            values={start}
            setValues={setstart}
            selectData={consts.dirveLength.map((v) => {
                return { values: v, labels: numFormat(v) + "km" }
            })} />
        <span>~</span>
        <Selector placeholder="최대 거리"
            values={end}
            setValues={setend}
            selectData={consts.dirveLength.map((v) => {
                return { values: v, labels: numFormat(v) + "km" }
            })} />
    </div>
}

// 가격
export const PriceOption = (props) => {
    let {
        setValue,
        onChange
    } = props;

    const [start, setstart] = useState(null);
    const [end, setend] = useState(null);

    useEffect(() => {
        if (setValue.min) setstart(setValue.min)
        if (setValue.max) setend(setValue.max)
    }, [])

    useEffect(() => {
        if (onChange) {
            onChange({ min: start, max: end })
        }
    }, [start, end])

    return <div
        style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            gap: 12,
            marginBottom: 20
        }}
    >
        <Selector placeholder="최소 금액"
            values={start}
            setValues={setstart}
            selectData={consts.priceList.map((v) => {
                return { values: v, labels: numFormat(v) + "만원" }
            })} />
        <span>~</span>
        <Selector placeholder="최대 금액"
            values={end}
            setValues={setend}
            selectData={consts.priceList.map((v) => {
                return { values: v, labels: numFormat(v) + "만원" }
            })} />
    </div>
}

// 넘버 승계
export const NumberOption = (props) => {
    const { setValue, onChange } = props

    const ConfigData = useSelector(selectConfig)

    const select = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="#3B4894" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1705 10.5455C16.6098 10.1062 16.6098 9.39384 16.1705 8.9545C15.7312 8.51517 15.0188 8.51517 14.5795 8.9545L10.875 12.659L9.4205 11.2045C8.98116 10.7652 8.26884 10.7652 7.8295 11.2045C7.39017 11.6438 7.39017 12.3562 7.8295 12.7955L10.0795 15.0455C10.5188 15.4848 11.2312 15.4848 11.6705 15.0455L16.1705 10.5455Z" fill="white" />
    </svg>
    const unSelect = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="#DDDDDD" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1705 10.5455C16.6098 10.1062 16.6098 9.39384 16.1705 8.9545C15.7312 8.51517 15.0188 8.51517 14.5795 8.9545L10.875 12.659L9.4205 11.2045C8.98116 10.7652 8.26884 10.7652 7.8295 11.2045C7.39017 11.6438 7.39017 12.3562 7.8295 12.7955L10.0795 15.0455C10.5188 15.4848 11.2312 15.4848 11.6705 15.0455L16.1705 10.5455Z" fill="#CCCCCC" />
    </svg>

    const checkItemStyle = {
        display: "flex", gap: 4, alignItems: "center", cursor: "pointer", userSelect: "none"
    }

    const [selValue, setselValue] = useState([]);

    useEffect(() => {
        if (setValue) setselValue(setValue)
    }, [])
    useEffect(() => {
        if (onChange) onChange(selValue)
    }, [selValue])
    let msgList = ConfigData.configInfo?.options?.license_msg_option ? ConfigData.configInfo?.options?.license_msg_option : []
    return <div style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        marginBottom: 20,
        gap: 12
    }}>
        {ConfigData.configInfo?.options?.license_option?.map((v, i) => {
            return <div style={checkItemStyle} onClick={() => {
                if (selValue.indexOf(v) >= 0) {
                    setselValue(selValue.filter(sv => sv != v))
                } else {
                    setselValue(selValue.concat(v))
                }
            }}>
                {selValue.indexOf(v) >= 0 ? select : unSelect}
                {v}{msgList[i] && `(${msgList[i]})`}
            </div>
        })}

    </div>
}

export const PayOption = (props) => {
    let {
        setValue,
        onChange
    } = props;

    const [start, setstart] = useState(null);
    const [end, setend] = useState(null);

    useEffect(() => {
        if (setValue.min) setstart(setValue.min)
        if (setValue.max) setend(setValue.max)
    }, [])

    useEffect(() => {
        if (onChange) {
            onChange({ min: start, max: end })
        }
    }, [start, end])

    return <div
        style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            gap: 12,
            marginBottom: 20
        }}
    >
        <Selector placeholder="최소 금액"
            values={start}
            setValues={setstart}
            selectData={consts.payList.map((v) => {
                return { values: v, labels: numFormat(v) + "만원" }
            })} />
        <span>~</span>
        <Selector placeholder="최대 금액"
            values={end}
            setValues={setend}
            selectData={consts.payList.map((v) => {
                return { values: v, labels: numFormat(v) + "만원" }
            })} />
    </div>
}

export const PayTypeOption = (props) => {
    let {
        setValue,
        onChange
    } = props;

    const ConfigData = useSelector(selectConfig)
    const [type, setType] = useState("");

    useEffect(() => {
        if (setValue) setType(setValue)
    }, [])

    useEffect(() => {
        if (onChange) {
            onChange(type)
        }
    }, [type])

    return <div
        style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 12,
            marginBottom: 20
        }}
    >
        <Selector placeholder="지급방식 선택"
            values={type}
            setValues={setType}
            selectData={ConfigData.configInfo?.options?.paytype_option?.map((v) => {
                return { values: v, labels: v }
            })} />

        <p style={{
            fontSize: 14,
            fontWeight: 700,
        }}>지급방식 안내</p>
        <p style={{
            fontSize: 14,
        }}>• 완제=운송비+주유비+도로비+기타</p>
        <p style={{
            fontSize: 14,
        }}>• 무제=운송비에 모든경비가 포함</p>
        <p style={{
            fontSize: 14,
        }}>• 매출제=매출기반으로 수익 나눔</p>
    </div>
}

export const PayTypeInfo = (props) => {
    return <div
        style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 12,
            marginBottom: 20
        }}
    >
        <p style={{
            fontSize: 14,
            fontWeight: 700,
        }}>지급방식 안내</p>
        <p style={{
            fontSize: 14,
        }}>• 완제=운송비+주유비+도로비+기타</p>
        <p style={{
            fontSize: 14,
        }}>• 무제=운송비에 모든경비가 포함</p>
        <p style={{
            fontSize: 14,
        }}>• 매출제=매출기반으로 수익 나눔</p>
    </div>
}

export const LicenseTypeInfo = (props) => {
    const ConfigData = useSelector(selectConfig)
    return <div
        style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 12,
            marginBottom: 20
        }}
    >
        <p style={{
            fontSize: 14,
            fontWeight: 700,
        }}>넘버판매 안내</p>

        {ConfigData.configInfo?.options?.license_option?.map((v, i) => {
            return <p style={{
                fontSize: 14,
            }}>• {v} : {ConfigData.configInfo?.options?.license_msg_option[i]}</p>
        })}
    </div>
}

export const AuthCarInfo = (props) => {
    const ConfigData = useSelector(selectConfig)
    return <div
        style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 12,
            marginBottom: 20
        }}
    >
        {/* <p style={{
            fontSize: 14,
            fontWeight: 700,
        }}>내차인증 안내</p> */}
        <p style={{
            fontSize: 14,
        }}>• 자동 본인인증이 불가능할 경우 법인인증(서류인증)을 이용해주세요.</p>
        <p style={{
            fontSize: 14,
        }}>• <b>법인 차량</b>은 법인인증을 이용해주세요.</p>
    </div>
}

export const CheckItemOption = (props) => {
    const { setValue, onChange } = props

    const ConfigData = useSelector(selectConfig)

    const select = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="#3B4894" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1705 10.5455C16.6098 10.1062 16.6098 9.39384 16.1705 8.9545C15.7312 8.51517 15.0188 8.51517 14.5795 8.9545L10.875 12.659L9.4205 11.2045C8.98116 10.7652 8.26884 10.7652 7.8295 11.2045C7.39017 11.6438 7.39017 12.3562 7.8295 12.7955L10.0795 15.0455C10.5188 15.4848 11.2312 15.4848 11.6705 15.0455L16.1705 10.5455Z" fill="white" />
    </svg>
    const unSelect = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="#DDDDDD" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1705 10.5455C16.6098 10.1062 16.6098 9.39384 16.1705 8.9545C15.7312 8.51517 15.0188 8.51517 14.5795 8.9545L10.875 12.659L9.4205 11.2045C8.98116 10.7652 8.26884 10.7652 7.8295 11.2045C7.39017 11.6438 7.39017 12.3562 7.8295 12.7955L10.0795 15.0455C10.5188 15.4848 11.2312 15.4848 11.6705 15.0455L16.1705 10.5455Z" fill="#CCCCCC" />
    </svg>

    const checkItemStyle = {
        display: "flex",
        width: "calc(50% - 7px)",
        gap: 4, alignItems: "center", cursor: "pointer", userSelect: "none"
    }

    const [selValue, setselValue] = useState([]);

    useEffect(() => {
        if (setValue) setselValue(setValue)
    }, [])
    useEffect(() => {
        if (onChange) onChange(selValue)
    }, [selValue])
    return <div style={{
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        marginBottom: 20,
        gap: 14
    }}>
        {ConfigData.configInfo?.options?.item_option?.map((v, i) => {
            return <div style={checkItemStyle} onClick={() => {
                if (selValue.indexOf(v) >= 0) {
                    setselValue(selValue.filter(sv => sv != v))
                } else {
                    setselValue(selValue.concat(v))
                }
            }}>
                {selValue.indexOf(v) >= 0 ? select : unSelect}
                {v}
            </div>
        })}
    </div>
}
export const CheckUnloadinOption = (props) => {
    const { setValue, onChange } = props

    const ConfigData = useSelector(selectConfig)

    const select = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="#3B4894" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1705 10.5455C16.6098 10.1062 16.6098 9.39384 16.1705 8.9545C15.7312 8.51517 15.0188 8.51517 14.5795 8.9545L10.875 12.659L9.4205 11.2045C8.98116 10.7652 8.26884 10.7652 7.8295 11.2045C7.39017 11.6438 7.39017 12.3562 7.8295 12.7955L10.0795 15.0455C10.5188 15.4848 11.2312 15.4848 11.6705 15.0455L16.1705 10.5455Z" fill="white" />
    </svg>
    const unSelect = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="#DDDDDD" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1705 10.5455C16.6098 10.1062 16.6098 9.39384 16.1705 8.9545C15.7312 8.51517 15.0188 8.51517 14.5795 8.9545L10.875 12.659L9.4205 11.2045C8.98116 10.7652 8.26884 10.7652 7.8295 11.2045C7.39017 11.6438 7.39017 12.3562 7.8295 12.7955L10.0795 15.0455C10.5188 15.4848 11.2312 15.4848 11.6705 15.0455L16.1705 10.5455Z" fill="#CCCCCC" />
    </svg>

    const checkItemStyle = {
        display: "flex",
        width: "calc(50% - 7px)",
        gap: 4, alignItems: "center", cursor: "pointer", userSelect: "none"
    }

    const [selValue, setselValue] = useState([]);

    useEffect(() => {
        if (setValue) setselValue(setValue)
    }, [])
    useEffect(() => {
        if (onChange) onChange(selValue)
    }, [selValue])
    return <div style={{
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        marginBottom: 20,
        gap: 14
    }}>
        {ConfigData.configInfo?.options?.unloading_option?.map((v, i) => {
            return <div style={checkItemStyle} onClick={() => {
                if (selValue.indexOf(v) >= 0) {
                    setselValue(selValue.filter(sv => sv != v))
                } else {
                    setselValue(selValue.concat(v))
                }
            }}>
                {selValue.indexOf(v) >= 0 ? select : unSelect}
                {v}
            </div>
        })}
    </div>
}

