import React, { useState, useEffect, useRef } from 'react';

import Layout from '../../layout/Layout';
import { useDispatch } from 'react-redux';
import { CheckItemOption, CheckOption, LengthOption, MadeOption, NumberOption, PayOption, PriceOption, TypeOption, YearOption } from '../../component/popups/CarOption';
import { close, open } from '../../redux/popupSlice';
import { Reservation } from '../../component/popups/Reservation';
import { FastInsert } from '../../component/popups/FastInsert';
import { bannerOpen } from '../../redux/bannerSlice';

export default function Test() {
    const dispatch = useDispatch();

    const btnClick = (type) => {
        let component = <></>
        let arrayDemo = [
            { value: "1", labels: "1" },
            { value: "2", labels: "2" },
            { value: "3", labels: "3" }
        ]

        if (type == 1) { component = <MadeOption datas1={arrayDemo} datas2={arrayDemo} /> }
        if (type == 2) { component = <TypeOption datas1={arrayDemo} datas2={arrayDemo} /> }
        if (type == 3) { component = <YearOption /> }
        if (type == 4) { component = <LengthOption /> }
        if (type == 5) { component = <PriceOption /> }
        if (type == 6) { component = <NumberOption /> }


        dispatch(
            open({
                component: component,
                onCancelPress: false,
                titleviewer: true,
                title: "옵션제목",
                button: "초기화",
                buttonStyle: "reset",
                onPress: () => { },
                noneMt: true,
            })
        );
    }

    const btnClick2 = (type) => {
        let component = <></>
        if (type == 1) { component = <Reservation point={20000} usePoint={100} /> }
        if (type == 2) { component = <Reservation /> }


        dispatch(
            open({
                component: component,
                onCancelPress: false,
                titleviewer: true,
                title: "예약상담 신청",
                button: "신청/충전하기",
                buttonCencle: "닫기",
                onPress: () => { },
                onCancelPress: () => { },
                noneMt: true,
            })
        );
    }

    const btnClick3 = (type) => {
        let component = <></>
        if (type == 1) { component = <FastInsert point={20000} usePoint={1000} /> }
        if (type == 2) { component = <FastInsert point={500} usePoint={1000} /> }


        dispatch(
            open({
                component: component,
                onCancelPress: false,
                titleviewer: true,
                title: "빠른 판매 등록",
                titleImg: "/images/icons/lightning.svg",
                button: "등록/충전",
                buttonCencle: "닫기",
                onPress: () => { dispatch(close()) },
                onCancelPress: () => { dispatch(close()) },
                noneMt: true,
            })
        );
    }

    const btnClick4 = (type) => {
        let component = <></>
        if (type == 1) { component = <PayOption /> }
        if (type == 2) { component = <CheckItemOption /> }


        dispatch(
            open({
                component: component,
                onCancelPress: false,
                titleviewer: true,
                title: "체크항목",
                button: "초기화",
                buttonStyle: "reset",
                onPress: () => { dispatch(close()) },
                noneMt: true,
            })
        );
    }

    return <Layout header={false} footters={false}>
        <div style={{
            padding: 40,
            display: 'flex',
            flexDirection: "column",
            gap: 12,
        }}>
            <button onClick={() => {
                dispatch(
                    bannerOpen({
                        bannerList: ["/images/sample/car1.png", "/images/sample/car1.png"]
                    })
                );
            }}>배너</button>


            <button onClick={() => {
                dispatch(
                    open({
                        content: "완료되었습니다.",
                        onCancelPress: false,
                        titleviewer: false,
                        button: "확인",
                        onPress: () => { dispatch(close()) },
                    })
                );
            }}> 그냥 확인</button>

            <button onClick={() => {
                dispatch(
                    open({
                        content: "하시겠습니까?",
                        onCancelPress: false,
                        titleviewer: false,
                        button: "확인",
                        buttonCencle: "닫기",
                        onPress: () => { dispatch(close()) },
                        onCancelPress: () => { dispatch(close()) },
                    })
                );
            }}>해? 말어?</button>
            <button onClick={() => { btnClick(1) }}> 제조사/차종 </button>
            <button onClick={() => { btnClick(2) }}> 형태 </button>
            <button onClick={() => { btnClick(3) }}> 연식 </button>
            <button onClick={() => { btnClick(4) }}> 주행거리 </button>
            <button onClick={() => { btnClick(5) }}> 차량가격 </button>
            <button onClick={() => { btnClick(6) }}> 넘버승계 </button>

            <button onClick={() => { btnClick2(1) }}> 예약 </button>
            <button onClick={() => { btnClick2(2) }}> 예약(돈 부족) </button>

            <button onClick={() => { btnClick3(1) }}> 빠른판매등록 </button>
            <button onClick={() => { btnClick3(2) }}> 빠른판매등록 (돈부족)</button>

            <button onClick={() => { btnClick4(1) }}> 급여</button>
            <button onClick={() => { btnClick4(2) }}> 체크박스</button>
        </div>
    </Layout>
}