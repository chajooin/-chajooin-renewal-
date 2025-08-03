import React, { useEffect, useRef, useState } from 'react';
import { Link, useFetcher, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { type } from '@testing-library/user-event/dist/type';
import { DefaultImg } from './DefaultImg';

export default function SwiperStyle1(props) {
    const {
        listsImag = [],
        listsImagMobile = [],
        isButton = false,
        buttonInner = false,
        viewIndex = 0,
        isPagenation = false,
        isFraction = false,
        imgStyles = {},
        onItemClick = (index) => { },
        autoplay = false
    } = props;
    const [swiper, setswiper] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [listIndex, setIndex] = useState(0)

    useEffect(() => {
        if (swiper.slideTo) swiper.slideTo(viewIndex);
    }, [viewIndex])

    const defaultBtnStyle = {
        position: "absolute",
        width: 64,
        height: 64,
        top: isPagenation ? "calc(50% - 48px)" : "calc(50% - 30px)",
        zIndex: 2,
    }

    return (
        <div style={{ position: 'relative', width: "100%" }}>
            {isButton && <>
                <button
                    onClick={() => swiper.slidePrev()}
                    style={{
                        ...defaultBtnStyle,
                        left: buttonInner ? 5 : -32,
                    }}
                >
                    <img style={{ width: "100%", height: "100%" }} src="/images/icons/slide-arrow-left.svg" onError={DefaultImg} />
                </button>
                <button
                    onClick={() => swiper.slideNext()}
                    style={{
                        ...defaultBtnStyle,
                        right: buttonInner ? 0 : -42,
                    }}
                >
                    <img
                        style={{ width: "100%", height: "100%" }}
                        src="/images/icons/slide-arrow-right.svg" onError={DefaultImg} />
                </button>
            </>}

            {
                isFraction &&
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        bottom: 12,
                        zIndex: 2,
                    }}>
                    <div style={{
                        padding: "4px 12px",
                        borderRadius: "100px",
                        color: "#FFF",
                        fontSize: "12px",
                        backgroundColor: "rgba(0, 0, 0, 0.50)",
                    }}>
                        {swiper.activeIndex + 1}/{listsImag.length}
                    </div>
                </div>
            }

            <Swiper
                style={{
                    paddingBottom: isPagenation ? 36 : 0,
                }}
                onInit={(ev) => {
                    setswiper(ev)
                }}
                loop={false}
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                onSlideChange={
                    (swiper) => {
                        setIndex(swiper.activeIndex);
                        // console.log(swiper.activeIndex)
                    }
                }
                pagination={{
                    enabled: isPagenation,
                    clickable: true
                }}
                onSwiper={(swiper) => {
                    // console.log(swiper)
                }}
                autoplay={autoplay ? autoplay : false}
            >
                {listsImag?.length > 0 && listsImag?.map((x, i) => {
                    return (
                        <SwiperSlide key={i}>
                            <img
                                className='main-swiper-img-pc'
                                src={x}
                                style={{ width: '100%', height: '100%', ...imgStyles }}
                                onClick={() => { onItemClick(i) }}
                                onError={DefaultImg}
                            />
                            {
                                listsImagMobile.length > 0 ?
                                    <img
                                        className='main-swiper-img-m'
                                        src={listsImagMobile[i]}
                                        style={{ width: '100%', height: '100%', ...imgStyles }}
                                        onClick={() => { onItemClick(i) }}
                                        onError={DefaultImg}
                                    /> :
                                    <img
                                        className='main-swiper-img-m'
                                        src={x}
                                        style={{ width: '100%', height: '100%', ...imgStyles }}
                                        onClick={() => { onItemClick(i) }}
                                        onError={DefaultImg}
                                    />
                            }
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div >
    )
}