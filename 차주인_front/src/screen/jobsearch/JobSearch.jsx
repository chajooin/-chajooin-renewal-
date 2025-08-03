import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { open, close, loadingflas, showLoginPopup } from '../../redux/popupSlice';

import "../../css/page-jobsearch.css"

import Layout from "../../layout/Layout";
import Selector from "../../component/Select";
import Button from "../../component/Button";

import * as APIS from "../../utils/service";
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { API_URL } from '../../libs/apiUrl';
import { numFormat } from '../../utils/utils';
import { TextCheckBox } from '../../component/TextCheck';
import { PayOption, SidoOption, TonOption } from '../../component/popups/CarOption';
import moment from 'moment';

export default function JobSearch({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [isLogin, setLogin] = useState(localStorage.getItem("token") ? true : false)

    const [srRowHeight, setSrRowHeight] = useState(257);
    const [order, setOrder] = useState(1);
    const [myView, setMyView] = useState(false);


    const [searchList, setSearchList] = useState([]);
    const [viewList, setViewList] = useState([]);

    const [filterSido, seFilterSido] = useState("");
    const [filterTon, setFilterTon] = useState("");

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
    }
    useEffect(() => {
        filterList()
    }, [filterSido, filterTon])

    const filterList = () => {
        let filterData = searchList.filter((v) => {
            let isSelect = true;
            if (filterSido && v.go_sido != filterSido) isSelect = false;
            if (filterTon && v.ton != filterTon) isSelect = false;

            return isSelect;
        })

        setViewList(filterData)
    }

    //윈도우 가로사이즈 체크
    const checkWindowWidth = () => {
        const width = window.innerWidth;
        if (width < 800) {
            setSrRowHeight(382)
        } else {
            setSrRowHeight(257)
        }
    }


    const loadList = () => {
        dispatch(loadingflas({ loading: true }))

        APIS.postData(API_URL.jobSearch.list, { order: order, my: myView })
            .then((result) => {
                console.log("jobSearch List:", result.data)
                setSearchList(result.data)
                dispatch(loadingflas({ loading: false }))
            })
            .catch(e => {
                console.log(e)
                dispatch(loadingflas({ loading: false }))
            })
    }

    useEffect(() => {
        console.log("render jobsearch!")
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
    }, [searchList])

    useEffect(() => {
        loadList()
    }, [order, myView])

    return (
        <Layout header={true} actives='jobSearch'>
            <div className="jobSearchContain">
                <div className="categoryBox">
                    <div className={`categoryBtn ${filterSido && "select"}`} onClick={() => categoryClick(0)}>지역</div>
                    <div className={`categoryBtn ${filterTon && "select"}`} onClick={() => categoryClick(1)}>차종</div>
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
                            buttonTxt="구직 등록"
                            onPress={() => {
                                if (isLogin)
                                    navigate(`/jobsearchAdd`)
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
                                            rowCount={Math.ceil(viewList?.length / 2)}
                                            rowHeight={srRowHeight}
                                            rowRenderer={
                                                ({ index, isScrolling, isVisible, key, style }) => {
                                                    let startIndex = index * 2;
                                                    const row1 = viewList[startIndex];
                                                    const row2 = (startIndex + 1 <= viewList?.length - 1) ? viewList[startIndex + 1] : null;

                                                    // positio top width height left
                                                    return (<div key={key} style={style}>
                                                        <div className="search-list-box">
                                                            <div className={`card ${row1?.status == 2 && "disable"}`} onClick={() => {
                                                                if (isLogin)
                                                                    window.open("/jobsearchInfo?idx=" + row1?.idx)
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
                                                                        <div className="label">희망지역</div>
                                                                        <div className="text">{row1?.go_sido} {row1?.go_sigungu}</div>
                                                                    </div>
                                                                    <div className="info-box">
                                                                        <div className="label">희망품목</div>
                                                                        <div className="text">{row1?.item}</div>
                                                                    </div>
                                                                    <div className="info-box">
                                                                        <div className="label">등록일</div>
                                                                        <div className="text">{moment(row1?.create_dt).format("YYYY.MM.DD")}</div>
                                                                    </div>
                                                                </div>
                                                                {row1?.status == 2 && <div className={`state disable`}>
                                                                    완료됨
                                                                </div>}
                                                            </div>

                                                            {row2 && <div className={`card ${row2?.status == 2 && "disable"}`} onClick={() => {
                                                                if (isLogin)
                                                                    window.open("/jobsearchInfo?idx=" + row2?.idx)
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
                                                                        <div className="label">희망지역</div>
                                                                        <div className="text">{row2?.go_sido} {row2?.go_sigungu}</div>
                                                                    </div>
                                                                    <div className="info-box">
                                                                        <div className="label">희망품목</div>
                                                                        <div className="text">{row2?.item}</div>
                                                                    </div>
                                                                    <div className="info-box">
                                                                        <div className="label">등록일</div>
                                                                        <div className="text">{moment(row2?.create_dt).format("YYYY.MM.DD")}</div>
                                                                    </div>
                                                                </div>
                                                                {row2?.status == 2 && <div className={`state disable`}>
                                                                    완료됨
                                                                </div>}
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

                {/* <div className="search-list-box">
                    {Array(6).fill(null).map((v, i, array) => {
                        return (
                            <div className={`card ${i === array.length - 1 && "disable"}`} onClick={() => { navigate(`/jobsearchInfo?idx=${i}`) }}>
                                <div className="title">1톤 카고 </div>
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
                                    {i === array.length - 1 && "모집 마감"}
                                </div>
                            </div>
                        )
                    })}
                </div> */}
            </div>


        </Layout >
    )
}