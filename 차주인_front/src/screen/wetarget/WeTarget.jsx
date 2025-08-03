import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';

import "../../css/page-wetarget.css"
import Layout from "../../layout/Layout";
import * as APIS from "../../utils/service";
import Button from '../../component/Button';
import { API_URL } from '../../libs/apiUrl';

export default function WeTarget({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const contractFile = (type = 1) => {
        APIS.postData(API_URL.commom.contract, { type }).then(({ data }) => {
            window.open(data);
        }).catch(e => {
            console.log(e)
        })
    }

    return (
        <Layout header={true} actives='wetarget'>
            <div className="weTargetContain">
                <div className="info-box">
                    <div className="contents padding">
                        <div className="wtc-t1">우리의 목표</div>
                        <div className="wtc-line margint24"></div>
                        <div className="wtc-t2 margint24">차주인.com 당신과 함께 합니다.</div>
                        <div className="wtc-c1 margint24">1. 신뢰의 시작: 투명한 정보 공개</div>
                        <div className="wtc-c2 margint12">
                            차량 상태, 일머리, 매출정보를 투명하게 공개하여 안전하고 신뢰있는 거래를 가능하게 합니다.
                        </div>
                        <div className="wtc-c1 margint24">2. 합리적인 선택: 공정한 매매 시스템</div>
                        <div className="wtc-c2 margint12">
                            객관적인 기준 기반의 합의 시스템으로 중개업체 없이도 공정한 가격으로 거래할 수 있습니다.
                        </div>
                        <div className="wtc-c1 margint24">3. 성공을 위한 파트너: 다양한 지원 서비스</div>
                        <div className="wtc-c2 margint12">
                            운송업 입문부터 운영까지, 차주님의 성공을 위한 다양한 지원 서비스를 제공합니다.
                        </div>

                        <div className="wtc-c4 margint24"><span className='bg-gradient-blue'>지금 바로 차주인.com에서 당신의 운송업 여정을 시작하세요!</span></div>
                    </div>
                    <div className="contents">
                        <img src="/images/info/image1.png" alt="" />
                    </div>
                </div>
                <div className="info-box">
                    <div className="contents padding">
                        <div className="wtc-t2">영업용 차주로써 느낀점</div>
                        <div className="wtc-line margint24" />
                        <div className="wtc-c5 margint24">
                            7년이라는 새월동안 2번의 지입차를 매매하였습니다.<br />
                            매매할때 가장 문제가 되었던건 신뢰의 문제였습니다.<br />
                            <br />
                            차량문제, 일머리, 매출확인 등 서로 합의가 가능한 시스템이 없었고 서로 눈치게임만 하는 상황이었습니다.<br />
                            <br />
                            거기에 중간업자까지 들어와버리면 매매가 상승은 불가피하고 판매자와 구매자간에 소통이 원활하지 못하는 상황도 발생합니다.<br />
                            <br />
                            말그대로 "사공이 많으면 배가 산으로 간다" 입니다.<br />
                            <br />
                            <span className='bold underline'>개인간 직거래가 정답이 아닐수도 있습니다.</span><br />
                            <br />
                            하지만 기존 인터넷에 매물에 대한 불신들을 여러가지 문제점들과 함께 조금씩 개선하고자 합니다.<br />
                            <br />
                            운송업 입문하려는 예비차주님들과 기존 운행중인 차주님들에게 선택의 폭을 키울 수 있는 <span className='bold blue'>차주인.com</span>이 되겠습니다.<br />
                        </div>
                    </div>
                    <div className="contents padding">
                        <div className="wtc-t2">우리의 핵심가치</div>
                        <div className="wtc-line margint24" />
                        <div className="wtc-c6 margint24"><span className='blue bold bg-gradient-blue'>본인차량 인증확인 서비스</span></div>
                        <div className="wtc-c6 margint12">
                            [차주인 서비스]는 "자동차365" 연동을 통해 판매 등록시 <span className='bold underline'>소유주 본인인증</span> 및 <span className='bold underline'>차대번호</span>를 입력받아 본인차량임을 확인합니다. <span className='wtc-c7'>( 개인넘버, 개인차량에 한함 )</span>
                        </div>
                        <div className="wtc-c6 bold margint24">
                            <span className='bold'>우리의 핵심가치는 3가지입니다.</span><br />
                            <span className='bold'>3가지 보증 가능한 매물만 중개합니다.</span><br />
                        </div>
                        <div className="wtc-c6 margint12">
                            <ol>
                                <li>2,000km or 1개월(엔진, 미션, DPF) 보증차량(계약서 명시)</li>
                                <li>선탑이 가능한 지입차</li>
                                <li>매출확인 가능한 지입차</li>
                            </ol>
                        </div>

                        <div className="btn-box">
                            <Button
                                buttonTxt="표준계약서 다운로드 (화물차)"
                                onPress={() => { contractFile(1) }}
                            />
                            <Button
                                buttonTxt="표준계약서 다운로드 (지입차)"
                                onPress={() => { contractFile(2) }}
                            />
                        </div>
                    </div>
                </div>
                <div className="info-box">
                    <div className="contents padding">
                        <div className="wtc-t2">우리는 신뢰를 연결합니다.</div>
                        <div className="wtc-line margint24" />
                        <div className="wtc-c3 margint24">
                            우리는 신뢰를 연결합니다.<br />
                            기존 인터넷 중고 화물차, 지입차, 기사구인구직 시장의 가장 큰 문제점은 정보의 불투명과 신뢰부족입니다.<br />
                            <br />
                            우리의 가치는 판매자와 구매자의 직거래입니다.<br />
                            <br />
                            서로 투명한 정보를 공유하고 합리적인 조건과 가격에 매물을 거래하는 것이 우리의 목표입니다.<br />
                        </div>
                    </div>
                    <div className="contents">
                        <img src="/images/info/image2.png" alt="" />
                    </div>
                </div>
            </div>
        </Layout >
    )
}