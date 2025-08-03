import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { open, close, loadingflas, showLoginPopup } from '../../redux/popupSlice';

import "../../css/page-joboffer.css"

import Layout from "../../layout/Layout";
import Selector from "../../component/Select";
import Button from "../../component/Button";

import * as APIS from "../../utils/service";
import { API_URL } from '../../libs/apiUrl';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { numFormat } from '../../utils/utils';
import { TextCheckBox } from '../../component/TextCheck';
import { PayOption, SidoOption, TonOption } from '../../component/popups/CarOption';
import moment from 'moment';

export default function JobOffer({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [isLogin, setLogin] = useState(localStorage.getItem("token") ? true : false)

    const [srRowHeight, setSrRowHeight] = useState(326);
    const [order, setOrder] = useState(1);
    const [myView, setMyView] = useState(false);

    const [offerList, setOfferList] = useState([]);
    const [viewList, setViewList] = useState([]);

    const [filterSido, seFilterSido] = useState("");
    const [filterTon, setFilterTon] = useState("");
    const [filterPay, setFilterPay] = useState({ min: null, max: null });

    const categoryClick = (index) => {
        if (index == 0) {
            dispatch(
                open({
                    component: <SidoOption
                        setValue={filterSido}
                        onChange={seFilterSido}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "지역",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        seFilterSido("")
                    },
                    noneMt: true,
                })
            );
        }
        else if (index == 1) {
            dispatch(
                open({
                    component: <TonOption
                        setValue={filterTon}
                        onChange={setFilterTon}
                    />,
                    onCancelPress: false,
                    titleviewer: true,
                    title: "차종",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setFilterTon("")
                    },
                    noneMt: true,
                })
            );
        }
        else if (index == 2) {
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
                    title: "월급여",
                    button: "초기화",
                    buttonStyle: "reset",
                    onPress: () => {
                        dispatch(close())
                        setFilterPay({ min: null, max: null })
                    },
                    noneMt: true,
                })
            );
        }
    }

    useEffect(() => {
        filterList()
    }, [filterSido, filterTon, filterPay])

    const filterList = () => {
        let filterData = offerList.filter((v) => {
            let isSelect = true;

            if (filterSido && v.go_sido != filterSido) isSelect = false;

            if (filterTon && v.ton != filterTon) isSelect = false;

            if (filterPay.min && Number(v.pay) < Number(filterPay.min)) isSelect = false;
            if (filterPay.max && Number(v.pay) > Number(filterPay.max)) isSelect = false;

            return isSelect;
        })

        setViewList(filterData)
    }

    //윈도우 가로사이즈 체크
    const checkWindowWidth = () => {
        const width = window.innerWidth;
        if (width < 800) {
            setSrRowHeight(566)
        } else {
            setSrRowHeight(326)
        }
    }

    const loadList = () => {
        dispatch(loadingflas({ loading: true }))

        APIS.postData(API_URL.jobOffer.list, { order: order, my: myView })
            .then((result) => {
                console.log("joboffer List:", result.data)
                setOfferList(result.data)
                dispatch(loadingflas({ loading: false }))
            })
            .catch(e => {
                console.log(e)
                dispatch(loadingflas({ loading: false }))
            })
    }

    useEffect(() => {
        console.log("render joboffer!")
        if (location.state) {
            if (location.state.isMyView) setMyView(true)
        }

        checkWindowWidth();
        window.onresize = function () {
            checkWindowWidth();
        }
    }, [])

    useEffect(() => {
        filterList()
    }, [offerList])

    useEffect(() => {
        loadList()
    }, [order, myView])

    return (
        <Layout header={true} actives='jobOffer'>
            <div className="jobOfferContain">
                <div className="categoryBox">
                    <div className={`categoryBtn ${filterSido && "select"}`} onClick={() => categoryClick(0)}>지역</div>
                    <div className={`categoryBtn ${filterTon && "select"}`} onClick={() => categoryClick(1)}>차종</div>
                    <div className={`categoryBtn ${(filterPay.min || filterPay.max) && "select"}`} onClick={() => categoryClick(2)}>월급여</div>
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
                            ]}
                        />
                        <TextCheckBox name="bmv-check" text="내 글 보기" isIcon checked={myView} onChange={(v) => { setMyView(v) }} />
                    </div>
                    <div className="sellbtn">
                        <Button
                            titleimgs="/images/icons/plus.svg"
                            buttonTxt="구인 등록"
                            onPress={() => {
                                if (isLogin)
                                    navigate(`/jobofferAdd`)
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

                <div style={{
                    display: 'flex',
                    width: "100%",
                    marginTop: 20,
                    gap: 20
                }}>
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

                                                    // positio top width height left
                                                    return (<div key={key} style={style}>
                                                        <div className="offer-list-box">
                                                            <div className={`card ${row1?.status == 2 && "disable"}`} onClick={() => {
                                                                if (isLogin)
                                                                    window.open("/jobofferInfo?idx=" + row1?.idx)
                                                                else
                                                                    dispatch(showLoginPopup({
                                                                        onPress: () => {
                                                                            dispatch(close())
                                                                            navigate("/login")
                                                                        }
                                                                    }))
                                                            }}>
                                                                <div className="title">{row1?.ton}톤</div>
                                                                <div className="sub-title">{row1?.title}</div>
                                                                <div className="line" />
                                                                <div className="info">
                                                                    <div className="info-box">
                                                                        <div className="label">출근지</div>
                                                                        <div className="text">{row1?.go_sido} {row1?.go_sigungu}</div>
                                                                    </div>
                                                                    {/* <div className="info-box">
                                                                        <div className="label">품목</div>
                                                                        <div className="text">{row1?.item}</div>
                                                                    </div> */}
                                                                    <div className="info-box">
                                                                        <div className="label">월급여</div>
                                                                        <div className="text">{numFormat(row1?.pay)}만원</div>
                                                                    </div>
                                                                    <div className="info-box">
                                                                        <div className="label">등록일</div>
                                                                        <div className="text">{moment(row1?.create_dt).format("YYYY.MM.DD")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className={`state ${row1?.status == 2 && "disable"}`}>
                                                                    {row1?.status == 2 ? "모집 마감" : "채용시 마감"}
                                                                </div>
                                                            </div>
                                                            {row2 && <div className={`card ${row2?.status == 2 && "disable"}`} onClick={() => {
                                                                if (isLogin)
                                                                    window.open("/jobofferInfo?idx=" + row2?.idx)
                                                                else
                                                                    dispatch(showLoginPopup({
                                                                        onPress: () => {
                                                                            dispatch(close())
                                                                            navigate("/login")
                                                                        }
                                                                    }))
                                                            }}>
                                                                <div className="title">{row2?.ton}톤</div>
                                                                <div className="sub-title">{row2?.title}</div>
                                                                <div className="line" />
                                                                <div className="info">
                                                                    <div className="info-box">
                                                                        <div className="label">출근지</div>
                                                                        <div className="text">{row2?.go_sido} {row2?.go_sigungu}</div>
                                                                    </div>
                                                                    {/* <div className="info-box">
                                                                        <div className="label">품목</div>
                                                                        <div className="text">{row2?.item}</div>
                                                                    </div> */}
                                                                    <div className="info-box">
                                                                        <div className="label">월급여</div>
                                                                        <div className="text">{numFormat(row2?.pay)}만원</div>
                                                                    </div>
                                                                    <div className="info-box">
                                                                        <div className="label">등록일</div>
                                                                        <div className="text">{moment(row2?.create_dt).format("YYYY.MM.DD")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className={`state ${row2?.status == 2 && "disable"}`}>
                                                                    {row2?.status == 2 ? "모집 마감" : "채용시 마감"}
                                                                </div>
                                                            </div>}
                                                        </div>
                                                    </div>);
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



                {/* <div className="offer-list-box">
                    {Array(30).fill(null).map((v, i, array) => {
                        return (
                            <div className={`card ${i === array.length - 1 && "disable"}`} onClick={() => { navigate("/jobofferInfo?idx=" + i) }}>
                                <div className="title">1톤 카고</div>
                                <div className="sub-title">1톤 냉탑칸막이 교촌치킨매장 기사님 급구합니다.</div>
                                <div className="line" />
                                <div className="info">
                                    {[
                                        { label: "출근지", text: "경북" },
                                        { label: "품목", text: "GS편의점 저온" },
                                        { label: "급여", text: "2,500만원" },
                                    ].map((v, i) => <div className="info-box">
                                        <div className="label">{v.label}</div>
                                        <div className="text">{v.text}</div>
                                    </div>)}
                                </div>
                                <div className={`state ${i === array.length - 1 && "disable"}`}>
                                    {i === array.length - 1 ? "모집 마감" : "채용시 마감"}
                                </div>
                            </div>
                        )
                    })}
                </div> */}
            </div>


        </Layout >
    )
}