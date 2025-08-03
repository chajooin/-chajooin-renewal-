import React, { useEffect, useState } from 'react';
import { Link, useFetcher } from "react-router-dom";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';

import consts from "../libs/consts"
import { bannerClose, dayClose, setCloseTime } from '../redux/bannerSlice';
import Checkbox from '../component/Checkbox';
import { Ismobiles } from '../utils/utils';

//import images from '../libs/images';


export default function Banner() {

    const dispatch = useDispatch();
    const {
        open,
        bannerList,
    } = useSelector(s => s.bannerReducer);

    const [swiper, setswiper] = useState({})
    const [index, setIndex] = useState(0)

    const handleClose = () => {
        dispatch(bannerClose());
    };

    const swiperSlide = (state) => {
        if (state === -1) {
            swiper.slidePrev()
        }
        else if (state === 1) {
            swiper.slideNext()
        }
    }

    useEffect(() => {
        // console.log("banner render!! ")
    }, [])

    return (
        <>
            {open &&
                <div className='banner-contain'>
                    <div className="banner-bg" onClick={() => {
                        handleClose()
                    }} />

                    <div className="navi-btn" onClick={() => { swiperSlide(-1) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 36 36" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M23.5607 6.43934C24.1464 7.02513 24.1464 7.97487 23.5607 8.56066L14.1213 18L23.5607 27.4393C24.1464 28.0251 24.1464 28.9749 23.5607 29.5607C22.9749 30.1464 22.0251 30.1464 21.4393 29.5607L10.9393 19.0607C10.3536 18.4749 10.3536 17.5251 10.9393 16.9393L21.4393 6.43934C22.0251 5.85355 22.9749 5.85355 23.5607 6.43934Z" fill="white" />
                        </svg>
                    </div>

                    <div className="banner-contents">
                        <div className="navi-box">
                            <span>{index}</span>/{bannerList?.length}
                        </div>
                        <Swiper
                            className='swiper-style'
                            onInit={(ev) => {
                                setswiper(ev)
                            }}
                            loop={false}
                            modules={[Navigation, Scrollbar, A11y]}
                            spaceBetween={0}
                            slidesPerView={1}
                            pagination={{
                                enabled: true,
                                clickable: true
                            }}
                            onSwiper={(swiper) => {
                                // console.log(swiper)
                                setIndex(swiper.activeIndex + 1)
                            }}
                            onSlideChange={(swiper) => {
                                setIndex(swiper.activeIndex + 1)
                            }}
                        >
                            {bannerList && bannerList.map((v, i) => {
                                return (
                                    <SwiperSlide
                                        key={i}
                                        onClick={() => {
                                            if (v?.url) {
                                                window.open(v?.url)
                                            }
                                        }}
                                    >
                                        <img
                                            src={Ismobiles() ? v?.m_path ? consts.s3url + v?.m_path : consts.s3url + v?.pc_path : consts.s3url + v?.pc_path}
                                            style={{ width: '100%', height: '100%', cursor: "pointer" }}
                                        />
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>

                        <div className="banner-bottom">
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                cursor: "pointer"
                            }}>
                                <input
                                    id="cjmb-dayoff-check"
                                    style={{ cursor: "pointer" }}
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked === true) {
                                            dispatch(setCloseTime(Date.now() + (24 * 3600 * 1000)))
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="cjmb-dayoff-check"
                                    style={{
                                        fontSize: 14,
                                        cursor: "pointer",
                                        userSelect: "none"
                                    }}>하루 동안 보지 않기</label>
                                {/* <label htmlFor="">{window.innerWidth}</label> */}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    cursor: "pointer"
                                }}
                                onClick={() => { handleClose() }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.52851 3.52861C3.78886 3.26826 4.21097 3.26826 4.47132 3.52861L7.99992 7.0572L11.5285 3.52861C11.7889 3.26826 12.211 3.26826 12.4713 3.52861C12.7317 3.78896 12.7317 4.21107 12.4713 4.47142L8.94273 8.00001L12.4713 11.5286C12.7317 11.789 12.7317 12.2111 12.4713 12.4714C12.211 12.7318 11.7889 12.7318 11.5285 12.4714L7.99992 8.94282L4.47132 12.4714C4.21097 12.7318 3.78886 12.7318 3.52851 12.4714C3.26816 12.2111 3.26816 11.789 3.52851 11.5286L7.05711 8.00001L3.52851 4.47141C3.26816 4.21107 3.26816 3.78896 3.52851 3.52861Z" fill="#999999" />
                                </svg>
                                <span style={{ fontSize: 14 }}>닫기</span>
                            </div>
                        </div>
                    </div>

                    <div className="navi-btn" onClick={() => {
                        swiperSlide(1)
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 36 36" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4393 6.43934C13.0251 5.85355 13.9749 5.85355 14.5607 6.43934L25.0607 16.9393C25.6464 17.5251 25.6464 18.4749 25.0607 19.0607L14.5607 29.5607C13.9749 30.1464 13.0251 30.1464 12.4393 29.5607C11.8536 28.9749 11.8536 28.0251 12.4393 27.4393L21.8787 18L12.4393 8.56066C11.8536 7.97487 11.8536 7.02513 12.4393 6.43934Z" fill="white" />
                        </svg>
                    </div>

                </div>
            }
        </>
    );
}
