import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useInRouterContext } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import Login from "../screen/member/Login";
import Home from "../screen/home/Home";
import UsedCar from "../screen/used/UsedCar";
import UsedCarInfo from "../screen/used/UsedCarInfo";
import Report from "../screen/report/Report"
import UsedCarAdd from "../screen/used/UsedCarAdd"
import RentedCar from "../screen/rentedCar/RentedCar"
import RentedCarInfo from "../screen/rentedCar/RentedCarInfo"
import RentedCarAdd from "../screen/rentedCar/RentedCarAdd"
import JobOffer from "../screen/joboffer/JobOffer"
import JobOfferInfo from "../screen/joboffer/JobOfferInfo"
import JobOfferAdd from "../screen/joboffer/JobOfferAdd"
import JobSearch from '../screen/jobsearch/JobSearch';
import JobSearchInfo from '../screen/jobsearch/JobSearchInfo';
import JobSearchAdd from "../screen/jobsearch/JobSearchAdd"
import Notification from '../screen/quickmenu/Notification';

import Board from '../screen/board/Board';
import BoardInfo from '../screen/board/BoardInfo';
import BoardAdd from '../screen/board/BoardAdd';

import PageHeart from '../screen/quickmenu/PageHeart';
import PageMessage from '../screen/quickmenu/PageMessage';
import MyPage from '../screen/my/MyPage';
import MyInfo from '../screen/my/MyInfo';
import MyPhone from "../screen/my/MyPhone"
import MyWithdrawal from "../screen/my/MyWithdrawal"
import MyPoint from "../screen/my/MyPoint"
import MyCalendar from "../screen/my/MyCalendar"
import MyCalendarInfo from "../screen/my/MyCalendarInfo"
import MyNoti from "../screen/my/MyNoti"
import MyNotiInfo from "../screen/my/MyNotiInfo"
import MyCS from "../screen/my/MyCS"
import MyPolicy from "../screen/my/MyPolicy"

import Test from '../screen/home/Test';

import consts from '../libs/consts';
import * as APIS from "../utils/service";
import { configopen, setAccessCount, setCarTypes, setConfigSidos, setConfigSigungus, setSubCarTypes } from '../redux/configSlice';
import { API_URL } from '../libs/apiUrl';
import { getCarSubType, getSigungus } from '../libs/apis';
import PayLoading from '../screen/pay/PayLoading';
import MyFAQ from '../screen/my/MyFAQ';
import PayFail from '../screen/pay/PayFail';
import CSPage from '../screen/my/CSPage';
import WeTarget from '../screen/wetarget/WeTarget';

function Routerlist() {
    const dispatch = useDispatch();
    const location = useInRouterContext();
    const userInfo = useSelector(state => state.userInfo);
    const { configInfo, carTypes } = useSelector(state => state.configReducer);

    const checkToken = () => {
        let token = localStorage.getItem("token")
        return token ? true : false
    }

    useEffect(() => {
        // getMemberinfo(setmemberinfos);
    }, [userInfo]);
    useEffect(() => {
        // console.log('location', location);
    }, [location]);

    useEffect(() => {
        // console.log("router render!")
        APIS.postData(API_URL.commom.config).then(({ data }) => {
            // console.log(data);
            dispatch(
                configopen({
                    configdata: data,
                })
            );
        }).catch((e) => {
            // console.log("config initialized fail");
        })

        APIS.postData(API_URL.commom.accessCount).then(({ data }) => {
            dispatch(setAccessCount(data));
        })

        APIS.postData(API_URL.commom.carType)
            .then(({ data }) => {
                dispatch(setCarTypes({ carTypes: data }))
                subTypeList(data);
            })

        APIS.postData(API_URL.commom.sido)
            .then(({ data }) => {
                dispatch(setConfigSidos({ sidos: data }))
                sigunguList(data)
            })
    }, []);

    const subTypeList = async (list) => {
        if (list.length > 0) {
            let resultList = []
            for (let i = 0; i < list.length; i++) {
                let subTypes = await getCarSubType(list[i])
                resultList.push(subTypes)
            }
            dispatch(setSubCarTypes({ subCarTypes: resultList }))
        }
    }

    const sigunguList = async (list) => {
        if (list.length > 0) {
            let resultList = []
            for (let i = 0; i < list.length; i++) {
                let subTypes = await getSigungus(list[i])
                resultList.push(subTypes)
            }
            dispatch(setConfigSigungus({ sigungus: resultList }))
        }
    }

    return (
        <Routes>
            <Route exact path={'/'} element={<Home />} />
            <Route exact path={'/login'} element={<Login />} />

            {/* <Route exact path={'/Test'} element={<Test />} /> */}

            <Route exact path={'/usedCar'} element={<UsedCar />} />
            <Route exact path={'/usedCarInfo'} element={checkToken() ? <UsedCarInfo /> : <Login />} />
            <Route exact path={'/usedCarAdd'} element={checkToken() ? <UsedCarAdd /> : <Login />} />
            <Route exact path={'/usedCarEdit'} element={checkToken() ? <UsedCarAdd /> : <Login />} />

            <Route exact path={'/rentedCar'} element={<RentedCar />} />
            <Route exact path={'/rentedCarInfo'} element={checkToken() ? <RentedCarInfo /> : <Login />} />
            <Route exact path={'/rentedCarAdd'} element={checkToken() ? <RentedCarAdd /> : <Login />} />
            <Route exact path={'/rentedCarEdit'} element={checkToken() ? <RentedCarAdd /> : <Login />} />

            <Route exact path={'/reportUsed'} element={checkToken() ? <Report type="truck" /> : <Login />} />
            <Route exact path={'/reportRented'} element={checkToken() ? <Report type="jeeip" /> : <Login />} />
            <Route exact path={'/reportJoboffer'} element={checkToken() ? <Report type="joboffer" /> : <Login />} />
            <Route exact path={'/reportJobsearch'} element={checkToken() ? <Report type="jobsearch" /> : <Login />} />

            <Route exact path={'/joboffer'} element={<JobOffer />} />
            <Route exact path={'/jobofferInfo'} element={checkToken() ? <JobOfferInfo /> : <Login />} />
            <Route exact path={'/jobofferAdd'} element={checkToken() ? < JobOfferAdd /> : <Login />} />
            <Route exact path={'/jobofferEdit'} element={checkToken() ? < JobOfferAdd /> : <Login />} />

            <Route exact path={'/jobsearch'} element={<JobSearch />} />
            <Route exact path={'/jobsearchInfo'} element={checkToken() ? <JobSearchInfo /> : <Login />} />
            <Route exact path={'/jobsearchAdd'} element={checkToken() ? <JobSearchAdd /> : <Login />} />
            <Route exact path={'/jobsearchEdit'} element={checkToken() ? <JobSearchAdd /> : <Login />} />

            <Route exact path={'/board'} element={<Board />} />
            <Route exact path={'/boardInfo'} element={<BoardInfo />} />
            <Route exact path={'/boardAdd'} element={checkToken() ? <BoardAdd /> : <Login />} />
            <Route exact path={'/boardEdit'} element={checkToken() ? <BoardAdd /> : <Login />} />

            <Route exact path={'/notification'} element={checkToken() ? <Notification /> : <Login />} />
            <Route exact path={'/heart'} element={checkToken() ? <PageHeart /> : <Login />} />
            <Route exact path={'/message'} element={checkToken() ? <PageMessage /> : <Login />} />

            <Route exact path={'/mypage'} element={checkToken() ? <MyPage /> : <Login />} />

            <Route exact path={'/mypageInfo'} element={checkToken() ? <MyInfo /> : <Login />} />
            <Route exact path={'/mypageInfoPhone'} element={checkToken() ? <MyPhone /> : <Login />} />
            <Route exact path={'/mypageWithdrawal'} element={checkToken() ? <MyWithdrawal /> : <Login />} />
            <Route exact path={'/mypagePoint'} element={checkToken() ? <MyPoint /> : <Login />} />
            <Route exact path={'/mypageCalendar'} element={checkToken() ? <MyCalendar /> : <Login />} />
            <Route exact path={'/mypageCalendarInfo'} element={checkToken() ? <MyCalendarInfo /> : <Login />} />

            <Route exact path={'/mypageNoti'} element={<MyNoti />} />
            <Route exact path={'/mypageNotiInfo'} element={<MyNotiInfo />} />
            <Route exact path={'/mypageFaq'} element={<MyFAQ />} />
            <Route exact path={'/mypageCs'} element={checkToken() ? <MyCS /> : <Login />} />
            <Route exact path={'/mypagePolicy'} element={<MyPolicy />} />

            <Route exact path={'/payLoading'} element={<PayLoading />} />
            <Route exact path={'/payFail'} element={<PayFail />} />

            <Route exact path={'/cs'} element={<CSPage />} />

            <Route exact path={'/weTarget'} element={<WeTarget />} />

            <Route exact path={'*'} element={<Home />} />
        </Routes>
    );
}

export default Routerlist;