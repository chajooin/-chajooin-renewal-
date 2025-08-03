import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { open, close, loadingflas, showLoginPopup } from '../../redux/popupSlice';

import "../../css/page-rented.css"

import Layout from "../../layout/Layout";
import Selector from "../../component/Select";
import Button from "../../component/Button";

import * as APIS from "../../utils/service";
import { API_URL } from '../../libs/apiUrl';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { numFormat } from '../../utils/utils';
import { DefaultImg } from '../../component/DefaultImg';
import consts from "../../libs/consts"
import { TextCheckBox } from '../../component/TextCheck';
import { CheckItemOption, CheckOption, CheckUnloadinOption, LengthOption, MadeOption, NumberOption, PayOption, PayTypeOption, PriceOption, SidoOption, TypeOption, YearOption } from '../../component/popups/CarOption';

export default function RentedCar({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [isLogin, setLogin] = useState(localStorage.getItem("token") ? true : false)

    const [srRowHeight, setSrRowHeight] = useState(258);
    const [jeeipList, setJeeipList] = useState([])
    const [viewList, setViewList] = useState([]);

    const [order, setOrder] = useState(1)
    const [isMyView, setIsMyView] = useState(false)

    const [filterSido, setFilterSido] = useState("")
    const [filterCar, setFilterCar] = useState({ maker: '', car: '' });
    const [filterType, setFilterType] = useState({
        range: { min: null, max: null },
        ton: "",
        carType: ""
    })
    const [filterPay, setFilterPay] = useState({ min: null, max: null });
    const [filterpaytype, setfilterpaytype] = useState("");
    const [filterPrice, setFilterPrice] = useState({ min: null, max: null });
    const [filterLicense, setFilterLicense] = useState([]);
    const [filterItem, setFilterItem] = useState([]);
    const [filterUnloading, setFilterUnloading] = useState([]);


    useEffect(() => {
        filterList()
    }, [filterSido, filterCar, filterType, filterPay, filterpaytype, filterPrice, filterLicense, filterItem, filterUnloading])

    const filterList = () => {
        let filterData = jeeipList.filter((v) => {
            let isSelect = true;

            if (filterSido && v.go_sido != filterSido) isSelect = false;

            if (filterCar.maker && v.maker != filterCar.maker) { isSelect = false; }
            if (filterCar.car && v.car != filterCar.car) { isSelect = false; }

            if (filterType.ton) {
                if (filterType.ton != Number(v.ton)) isSelect = false;
            } else {
                if (filterType.range.min && (filterType.range.min > Number(v.ton) || filterType.range.max < Number(v.ton))) {
                    isSelect = false;
                }
            }

            if (filterType.carType && filterType.carType != v.type) {
                isSelect = false;
            }

            if (filterPay.min && Number(v.pay) < Number(filterPay.min)) isSelect = false;
            if (filterPay.max && Number(v.pay) > Number(filterPay.max)) isSelect = false;

            if (filterpaytype && v.paytype != filterpaytype) isSelect = false;

            if (filterPrice.min && Number(v.price) < Number(filterPrice.min)) isSelect = false;
            if (filterPrice.max && Number(v.price) > Number(filterPrice.max)) isSelect = false;

            if (filterLicense.length > 0 && filterLicense.indexOf(v.license_type) < 0) isSelect = false;

            if (filterItem.length > 0 && filterItem.indexOf(v.item) < 0) isSelect = false;
            if (filterUnloading.length > 0) {
                let isItemCheck = false
                for (let item of String(v?.unloading).split(",")) {
                    if (filterUnloading.indexOf(item) >= 0) {
                        isItemCheck = true;
                        break;
                    }
                }

                for (let item of String(v?.unloading2).split(",")) {
                    if (filterUnloading.indexOf(item) >= 0) {
                        isItemCheck = true;
                        break;
                    }
                }

                if (!isItemCheck) isSelect = false;
            }
            return isSelect;
        })

        setViewList(filterData)
    }
    const loadCar = async () => {
        let result = {
            error: null,
            data: []
        }

        const loadSubList = (maker) => {
            return new Promise((res) => {
                APIS.postData(API_URL.commom.car, { maker })
                    .then((carResult) => {
                        if (carResult?.data?.length > 0) {
                            res(carResult?.data)
                        } else {
                            res([])
                        }
                    })
                    .catch(e => {
                        res([])
                    })
            })
        }
        return new Promise((resolve, reject) => {
            APIS.postData(API_URL.commom.maker)
                .then(async (makerResult) => {
                    if (makerResult?.data?.length > 0) {
                        let mlist = makerResult?.data
                        for (let i in mlist) {
                            let cars = await loadSubList(mlist[i])
                            if (cars.length > 0) {
                                result.data.push({
                                    maker: mlist[i],
                                    cars: cars
                                })
                            }
                        }
                        resolve(result)
                    } else {
                        result.error = "제조사 데이터가 없습니다."
                        resolve(result)
                    }
                })
                .catch(() => {
                    result.error = "제조사 데이터가 없습니다."
                    resolve(result)
                })
        });
    }

    const categoryClick = async (index) => {
        if (index == 6) {
            dispatch(
                open({
                    component: <SidoOption
                        setValue={filterSido}
                        onChange={setFilterSido}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "운행지역",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setFilterSido("")
                    },
                    noneMt: true,
                })
            );
        } else if (index == 0) {
            let carData = await loadCar();
            //{ values: "aa", labels: "asdas" }
            if (!carData.err) {
                dispatch(
                    open({
                        component: <MadeOption
                            carDatas={carData.data}
                            setValue={filterCar}
                            onChange={(v) => {
                                setFilterCar(v)
                            }}
                        />,
                        onCancelPress: false,
                        titleviewer: true,
                        title: "제조사/차종",
                        button: "초기화",
                        buttonStyle: "reset",
                        onPress: () => {
                            dispatch(close())
                            setFilterCar({ maker: '', car: '' })
                        },
                        noneMt: true,
                    })
                );
            } else {
                //제조사/차종 정보 없을경우 처리 - 리셋 
                setFilterCar({ maker: '', car: '' })
            }
        } else if (index == 1) {
            dispatch(
                open({
                    component: <TypeOption
                        setValue={filterType}
                        onChange={(v) => {
                            console.log(v)
                            setFilterType(v)
                        }}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "형태",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setFilterType({
                            range: { min: null, max: null },
                            ton: "",
                            carType: ""
                        })
                    },
                    noneMt: true,
                })
            );
        } else if (index == 2) {
            dispatch(
                open({
                    component: <PayOption
                        setValue={filterPay}
                        onChange={(v) => {
                            setFilterPay(v)
                        }}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "급여",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setFilterPay({ min: null, max: null })
                    },
                    noneMt: true,
                })
            );
        } else if (index == 3) {
            dispatch(
                open({
                    component: <PayTypeOption
                        setValue={filterpaytype}
                        onChange={(v) => {
                            setfilterpaytype(v)
                        }}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "지급방식",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setfilterpaytype("")
                    },
                    noneMt: true,
                })
            );
        } else if (index == 4) {
            dispatch(
                open({
                    component: <PriceOption
                        setValue={filterPrice}
                        onChange={(v) => {
                            setFilterPrice(v)
                        }}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "인수금액",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setFilterPrice({ min: null, max: null })
                    },
                    noneMt: true,
                })
            );
        } else if (index == 5) {
            dispatch(
                open({
                    component: <NumberOption
                        setValue={filterLicense}
                        onChange={setFilterLicense}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "넘버승계",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setFilterLicense([])
                    },
                    noneMt: true,
                })
            );
        }
        else if (index == 7) {
            dispatch(
                open({
                    component: <CheckItemOption
                        setValue={filterItem}
                        onChange={setFilterItem}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "품목",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setFilterItem([])
                    },
                    noneMt: true,
                })
            );
        }
        else if (index == 8) {
            dispatch(
                open({
                    component: <CheckUnloadinOption
                        setValue={filterUnloading}
                        onChange={setFilterUnloading}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "상하차방법",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setFilterUnloading([])
                    },
                    noneMt: true,
                })
            );
        }
    }

    //윈도우 가로사이즈 체크
    const checkWindowWidth = () => {
        const width = window.innerWidth;
        if (width < 1000) {
            setSrRowHeight(552)
        } else {
            setSrRowHeight(258)
        }
    }

    const loadList = () => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.rentedCar.list, { order: order * 1, my: isMyView })
            .then((result) => {
                console.log("🚀 ~ .then ~ result:", result.data)
                dispatch(loadingflas({ loading: false }))
                setJeeipList(result.data)
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
                console.log(e.response)
            })
    }

    useEffect(() => {
        console.log("render rentedCar!!")
        if (location.state) {
            if (location.state.isMyView) setIsMyView(true)
        }

        checkWindowWidth();
        window.onresize = function () {
            checkWindowWidth();
        }


    }, [])

    useEffect(() => {
        console.log("🚀 jeeipList:", jeeipList);
        filterList()
    }, [jeeipList])

    useEffect(() => {
        loadList()
    }, [order, isMyView])

    return (
        <Layout header={true} actives='rentedCar'>
            <div className="rentedCarContain">
                <div className="categoryBox">
                    <div className={`categoryBtn ${filterSido && "select"}`} onClick={() => categoryClick(6)}>운행지역</div>
                    <div className={`categoryBtn ${filterCar.maker && "select"}`} onClick={() => categoryClick(0)}>제조사/차종</div>
                    <div className={`categoryBtn ${(filterType.range.min || filterType.ton || filterType.carType) && "select"}`} onClick={() => categoryClick(1)}>형태</div>

                    <div className={`categoryBtn ${(filterPay.min || filterPay.max) && "select"}`} onClick={() => categoryClick(2)}>급여</div>
                    <div className={`categoryBtn ${filterpaytype && "select"}`} onClick={() => categoryClick(3)}>지급방식</div>
                    <div className={`categoryBtn ${(filterPrice.min || filterPrice.max) && "select"}`} onClick={() => categoryClick(4)}>인수금액</div>
                    <div className={`categoryBtn ${filterLicense.length > 0 && "select"}`} onClick={() => categoryClick(5)}>넘버승계</div>
                    <div className={`categoryBtn ${(filterItem.length > 0) && "select"}`} onClick={() => categoryClick(7)}>품목</div>
                    <div className={`categoryBtn ${(filterUnloading.length > 0) && "select"}`} onClick={() => categoryClick(8)}>상하차방법</div>
                </div>

                <div className="subCategoryBox">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Selector
                            subselectClass="selBox"
                            values={order}
                            setValues={setOrder}
                            selectData={[
                                { values: 1, labels: "최신순" },
                                { values: 2, labels: "조회순" },
                                { values: 3, labels: "관심순" },
                                { values: 4, labels: "낮은가격순" },
                                { values: 5, labels: "높은가격순" },
                            ]}
                        />
                        <TextCheckBox name="bmv-check" text="내 글 보기" isIcon checked={isMyView} onChange={(v) => { setIsMyView(v) }} />
                    </div>
                    <div className="sellbtn">
                        <Button
                            titleimgs="/images/icons/plus.svg"
                            buttonTxt="지입 등록"
                            onPress={() => {
                                if (isLogin)
                                    navigate(`/rentedCarAdd`)
                                else
                                    dispatch(showLoginPopup({
                                        onPress: () => {
                                            dispatch(close())
                                            navigate("/login")
                                        }
                                    }))
                            }}
                        />
                    </div>
                </div>

                <WindowScroller>
                    {({ height, scrollTop, isScrolling, onChildScroll }) => {
                        return <>
                            <AutoSizer disableHeight>
                                {({ width }) => (
                                    <List
                                        ref={el => {
                                            window.listEl = el;
                                        }}
                                        autoHeight
                                        height={height}
                                        isScrolling={isScrolling}
                                        onScroll={onChildScroll}
                                        overscanRowCount={2}
                                        rowCount={viewList.length}
                                        rowHeight={srRowHeight}
                                        rowRenderer={
                                            ({ index, isScrolling, isVisible, key, style }) => {
                                                let row = viewList[index]
                                                return (
                                                    <div key={key} style={style}>
                                                        <div className="card" onClick={() => {
                                                            if (isLogin)
                                                                window.open(`rentedCarInfo?idx=${row?.idx}`);
                                                            else
                                                                dispatch(showLoginPopup({
                                                                    onPress: () => {
                                                                        dispatch(close())
                                                                        navigate("/login")
                                                                    }
                                                                }))
                                                        }}>
                                                            <div className="contents">
                                                                <div class="info">
                                                                    <div class="content-f">
                                                                        <div class="type fontsize14 color3B4894">{row?.ton}톤 {row?.type}</div>
                                                                        <div class="price margint12"><span class="fontsize20 color666">
                                                                            <span class="fontsize36 color3B4894 bolds">{
                                                                                row?.license_sell == 1 ? numFormat(row?.price + row?.license_price) : numFormat(row?.price)
                                                                            }</span> 만원</span></div>
                                                                    </div>

                                                                    <div class="content-s">
                                                                        <div class="cinfo">
                                                                            <div class="ci-title fontsize16 color666">운행지역</div>
                                                                            <div class="ci-text fontsize16 bolds">{row?.sido} {row?.sigungu}</div>
                                                                        </div>
                                                                        <div class="cinfo">
                                                                            <div class="ci-title fontsize16 color666">시간</div>
                                                                            <div class="ci-text fontsize16 bolds">{row?.work}</div>
                                                                        </div>
                                                                        <div class="cinfo">
                                                                            <div class="ci-title fontsize16 color666">급여</div>
                                                                            <div class="ci-text fontsize16 bolds">{numFormat(row?.pay)}만원[{row?.paytype}]</div>
                                                                        </div>
                                                                        <div class="cinfo">
                                                                            <div class="ci-title fontsize16 color666">인수금</div>
                                                                            <div class="ci-text fontsize16 bolds">{numFormat(row?.price)}만원</div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="adBox">
                                                                    {row?.title}
                                                                </div>
                                                            </div>

                                                            <div className="img-box">
                                                                <img src={consts.s3url + row?.thumb} alt="" onError={DefaultImg} />
                                                                {row?.status === 2 && <div className="soldout-box">판매완료</div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        }
                                        scrollToIndex={0}
                                        scrollTop={scrollTop}
                                        width={width}
                                    />
                                )}
                            </AutoSizer>
                        </>

                    }}
                </WindowScroller>
            </div>


        </Layout >
    )
}