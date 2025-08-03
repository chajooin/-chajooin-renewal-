import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash"

import Layout from "../../layout/Layout";
import { open, close, loadingflas, showLoginPopup } from '../../redux/popupSlice';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import Selector from "../../component/Select"
import Button from "../../component/Button"

import * as APIS from "../../utils/service";
import { LengthOption, MadeOption, NumberOption, PriceOption, TypeOption, YearOption } from '../../component/popups/CarOption';
import { API_URL } from '../../libs/apiUrl';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, WindowScroller } from 'react-virtualized';
import { dateShotYearformat, numFormat, useIntersectionObserver } from '../../utils/utils';
import consts from "../../libs/consts"

import { TextCheckBox } from '../../component/TextCheck';
import { DefaultImg } from '../../component/DefaultImg';
import { selectConfig } from '../../redux/configSlice';

const cache = new CellMeasurerCache({
    defaultWidth: 100,
    fixedWidth: true
});

export default function UsedCar({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const ConfigData = useSelector(selectConfig)

    const [isLogin, setLogin] = useState(localStorage.getItem("token") ? true : false)

    const [srRowHeight, setSrRowHeight] = useState(355);

    const [order, setOrder] = useState(1)
    const [truckList, setTruckList] = useState([]);
    const [viewList, setViewList] = useState([]);
    const [isMyView, setIsMyView] = useState(false)

    const [filterCar, setFilterCar] = useState({ maker: '', car: '' });
    const [filterType, setFilterType] = useState({
        range: { min: null, max: null },
        ton: "",
        carType: ""
    })
    const [filterYear, setFilterYear] = useState({ min: null, max: null });
    const [filterDistance, setFilterDistance] = useState({ min: null, max: null });
    const [filterPrice, setFilterPrice] = useState({ min: null, max: null });
    const [filterLicense, setFilterLicense] = useState([]);

    const target = useRef(null);

    useEffect(() => {
        filterList()
    }, [filterCar, filterType, filterYear, filterDistance, filterPrice, filterLicense])
    /**
     * 제조사 차종 가져오기
     * @returns {Promise<{error: null | string, data: {maker:string, cars:string[]}[]}>}
     */
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

    const filterList = () => {
        let filterData = truckList.filter((v) => {
            let isSelect = true;
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

            if (filterYear.min && Number(v.year) < Number(filterYear.min)) isSelect = false;

            if (filterYear.max && Number(v.year) > Number(filterYear.max)) isSelect = false;

            if (filterDistance.min && Number(v.distance) < Number(filterDistance.min)) isSelect = false;
            if (filterDistance.max && Number(v.distance) > Number(filterDistance.max)) isSelect = false;

            if (filterPrice.min && Number(v.price) < Number(filterPrice.min)) isSelect = false;
            if (filterPrice.max && Number(v.price) > Number(filterPrice.max)) isSelect = false;

            if (filterLicense.length > 0 && filterLicense.indexOf(v.license_type) < 0) isSelect = false;

            return isSelect;
        })

        setViewList(filterData)
    }

    // 필터
    const categoryClick = async (index) => {

        if (index == 0) {
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
                    component: <YearOption
                        setValue={filterYear}
                        onChange={(v) => {
                            setFilterYear(v)
                        }}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "연식",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setFilterYear({ min: null, max: null })
                    },
                    noneMt: true,
                })
            );
        } else if (index == 3) {
            dispatch(
                open({
                    component: <LengthOption
                        setValue={filterDistance}
                        onChange={(v) => {
                            setFilterDistance(v)
                        }}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "주행거리",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setFilterDistance({ min: null, max: null })
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
                    title: "차량가격",
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
    }

    /**
     * 매물 클릭
     * @param {string} index 
     */
    const usedCardClick = (index) => {
        if (isLogin)
            window.open(`usedCarInfo?idx=${index}`);
        else
            dispatch(showLoginPopup({
                onPress: () => {
                    dispatch(close())
                    navigate("/login")
                }
            }))
    }

    //윈도우 가로사이즈 체크
    const checkWindowWidth = () => {
        const width = window.innerWidth;
        if (width < 800) {
            setSrRowHeight(710)
        } else {
            setSrRowHeight(355)
        }
    }

    const loadList = () => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.usedCar.list, { order: order * 1, my: isMyView })
            .then((result) => {
                console.log("🚀 ~ .then ~ result:", result)
                setTruckList(result.data)
                dispatch(loadingflas({ loading: false }))
            })
            .catch(e => {
                console.log(e)
                dispatch(loadingflas({ loading: false }))
            })
    }

    useEffect(() => {
        console.log("usedCar render!")
        console.log("state", location)
        if (location.state) {
            if (location.state.isMyView) setIsMyView(true)
        }
        checkWindowWidth();
        window.onresize = function () {
            checkWindowWidth();
        }

        return () => {
            console.log("usedCar unmount!");
        };
    }, [])

    useEffect(() => {
        console.log("🚀 ~ UsedCar ~ truckList:", truckList);
        filterList()
    }, [truckList])

    useEffect(() => {
        loadList()
    }, [order, isMyView])

    return (
        <Layout header={true} actives='usedCar'>

            <div className="usedContain">
                <div className="categoryBox">
                    <div className={`categoryBtn ${filterCar.maker && "select"}`} onClick={() => categoryClick(0)}>제조사/차종</div>
                    <div className={`categoryBtn ${(filterType.range.min || filterType.ton || filterType.carType) && "select"}`} onClick={() => categoryClick(1)}>형태</div>
                    <div className={`categoryBtn ${(filterYear.min || filterYear.max) && "select"}`} onClick={() => categoryClick(2)}>연식</div>
                    <div className={`categoryBtn ${(filterDistance.min || filterDistance.max) && "select"}`} onClick={() => categoryClick(3)}>주행거리</div>
                    <div className={`categoryBtn ${(filterPrice.min || filterPrice.max) && "select"}`} onClick={() => categoryClick(4)}>차량가격</div>
                    <div className={`categoryBtn ${filterLicense.length > 0 && "select"}`} onClick={() => categoryClick(5)}>넘버승계</div>
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
                            buttonTxt="내차 판매"
                            onPress={() => {
                                if (isLogin)
                                    navigate(`/usedCarAdd`)
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
                <div style={{ marginTop: 20 }}></div>
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
                                        overscanRowCount={0}
                                        rowCount={Math.ceil(viewList.length / 2)}
                                        rowHeight={srRowHeight}
                                        rowRenderer={
                                            ({ index, isScrolling, isVisible, key, style }) => {
                                                let startIndex = index * 2;

                                                const row1 = viewList[startIndex];
                                                const row2 = (startIndex + 1 <= viewList.length - 1) ? viewList[startIndex + 1] : null;
                                                return (
                                                    <div key={key} style={style}>
                                                        <div className="cardBox">
                                                            <div
                                                                className="card"
                                                                onClick={() => {
                                                                    usedCardClick(row1?.idx)
                                                                }}>

                                                                {row1?.status === 2 && (<div className="soldout-box">판매완료</div>)}

                                                                <img className="carImage" src={row1?.thumb ? consts.s3url + row1?.thumb : ""} onError={DefaultImg} />
                                                                <div className="info">
                                                                    <div className="infoTitle">
                                                                        {row1?.title}
                                                                    </div>
                                                                    <div className="infoSubTitle">
                                                                        {dateShotYearformat(row1?.year)}/{row1?.month}식 · {row1?.transmission} · {numFormat(row1?.distance)}km · {row1?.sido}
                                                                    </div>


                                                                    <div className="infoPrice">
                                                                        {numFormat(row1?.price + row1?.license_price)} 만원
                                                                    </div>
                                                                    <div className="status-box">
                                                                        {row1?.license_sell ? <div className="addNumber">{row1?.license_type} 포함</div> : <></>}
                                                                        {row1?.status === 99 ? <div className="saveTag">임시저장</div> : <></>}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            {row2 && <div
                                                                className="card"
                                                                onClick={() => {
                                                                    usedCardClick(row2?.idx)
                                                                }}>
                                                                {row2?.status === 2 && (<div className="soldout-box">판매완료</div>)}

                                                                <img className="carImage" src={row2?.thumb ? consts.s3url + row2?.thumb : ""} onError={DefaultImg} />
                                                                <div className="info">
                                                                    <div className="infoTitle">
                                                                        {row2?.title}
                                                                    </div>
                                                                    <div className="infoSubTitle">
                                                                        {dateShotYearformat(row2?.year)}/{row2?.month}식 · {row2?.transmission} · {numFormat(row2?.distance)}km · {row2?.sido}
                                                                    </div>

                                                                    <div className="infoPrice">
                                                                        {numFormat(row2?.price + row2?.license_price)} 만원
                                                                    </div>

                                                                    <div className="status-box">
                                                                        {row2?.license_sell ? <div className="addNumber">{row2?.license_type} 포함</div> : <></>}
                                                                        {row2?.status === 99 ? <div className="saveTag">임시저장</div> : <></>}
                                                                    </div>
                                                                </div>
                                                            </div>}

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
                            <div ref={target} style={{ width: '100%', height: 1 }} />
                        </>

                    }}
                </WindowScroller>
            </div>

        </Layout >
    )
}