import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/Layout";

import { useropen } from '../../redux/userInfo';
import { open, close, loadingflas } from '../../redux/popupSlice';
import { Link, useNavigate } from 'react-router-dom';

import Input from '../../component/Input';
import Button from '../../component/Button';
import Radios from '../../component/Radios';
import Checkbox from '../../component/Checkbox';
import Select from '../../component/Select';
import SwiperStyle1 from '../../component/SwiperStyle1';


import * as APIS from "../../utils/service";
export default function Login({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [checkvalues, setcheckvalues] = useState([]);

    return (
        <Layout header={false}>
            <div className='normalform'>
                <button
                    onClick={() => {
                        dispatch(
                            open({
                                component: '등록하시겠습니까?',
                                title: '알림',
                                button: "등록",
                                buttonCencle: "취소",
                                titleviewer: true,
                                alert: false,
                                onPress: () => {
                                    dispatch(close());
                                },
                                onCancelPress: () => {
                                    dispatch(close());
                                }
                            })
                        );
                    }}
                >
                    샘플일반알람보기
                </button>
                <button
                    style={{ marginTop: 20 }}
                    onClick={() => {
                        const QusPop1 = () => {
                            return (
                                <div className='QusPop1area'>
                                    <div>
                                        <div>전송 매물의 위치 공개 범위 설정입니다.</div>
                                        <div className='QusPop1areacontents'>
                                            <div className='fontsize16 bolds'>비공개 (반경 500m)</div>
                                            <div>
                                                <div>
                                                    <span></span><p>식별하기 어렵도록 반경 500m로 표기됩니다.</p>
                                                </div>
                                                <div>
                                                    <span></span><p>소재지는 ‘법정동’까지만 노출됩니다.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='QusPop1areacontents'>
                                            <div className='fontsize16 bolds'>일부 공개 (반경 100m)</div>
                                            <div>
                                                <div>
                                                    <span></span><p>고객 화면에서 지도가 출력되며 반경 100m의 범위로 출력됩니다. (매물의 위치는 중심이 아닌 인근의 다른 위치로 설정되니 안심하세요.)</p>
                                                </div>
                                                <div>
                                                    <span></span><p>소재지는 ‘법정동’까지만 노출됩니다.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='QusPop1areacontents'>
                                            <div className='fontsize16 bolds'>전체 공개</div>
                                            <div>
                                                <div>
                                                    <span></span><p>고객 화면에서 지도가 출력되며 정확한 위치가 표시됩니다.</p>
                                                </div>
                                                <div>
                                                    <span></span><p>소재지는 ‘지번·층·호수’까지 모두 노출됩니다.</p>
                                                </div>
                                                <div>
                                                    <span></span><p>전속 임차/매수 의뢰인,단골,다회 미팅자 등 신뢰할 수 있는 고객에게만 설정하세요.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        더욱 자세한 설명이 필요하시다면 고객센터-이용가이드에서 매물 전송 가이드를 확인하세요.
                                    </div>
                                </div>
                            );
                        }
                        dispatch(
                            open({
                                component: <QusPop1 />,
                                title: '타이틀영역',
                                titleviewer: true,
                                alert: false,
                            })
                        );
                    }}
                >
                    컴포넌트형 알람보기
                </button>

                <div className='margint20'>
                    <div>인풋박스</div>
                    <div>
                        <Input
                            className={`inputs`}
                            placeholder=""
                            setValue={() => { }}
                            value={''}
                            name="sample"
                        />
                    </div>
                </div>


                <div className='margint20'>
                    <div>3분 타이머 인풋박스</div>
                    <div>
                        <Input
                            className={`inputs`}
                            placeholder="인증번호"
                            setValue={() => { }}
                            value={''}
                            name="secretnum"
                            timer={true}
                            timerState={() => {
                                console.log('인증시간이 만료 후 처리');
                            }}
                            error={''}
                        />
                    </div>
                </div>


                <div className='margint20'>
                    <div>라디오</div>
                    <div>
                        <Radios
                            linetype={'radioimg'}
                            values={0}
                            setvalues={() => { }}
                            namevalue={[
                                { names: '주거', values: 0 },
                                { names: '상업', values: 1 },
                                { names: '건물', values: 2 },
                            ]}
                            fontweights={400}
                            fontSizes={14}
                            sizes={20}
                        />
                    </div>
                </div>

                <div className='margint20'>
                    <div>체크박스</div>
                    <div>
                        <Checkbox
                            linetype={'checkimg'}
                            values={checkvalues}
                            setvalues={setcheckvalues}
                            namevalue={[
                                { names: '협의가능', values: 0 },
                                { names: '상관없음', values: 1 },
                            ]}
                            fontweights={400}
                            fontSizes={14}
                            sizes={20}
                        />
                    </div>
                </div>

                <div className='margint20'>
                    <div>셀랙트박스</div>
                    <div>
                        <Select
                            selectClass={'custom-select'}
                            setValues={() => { }}
                            values={'0'}
                            selectData={[
                                { labels: '접수', values: '0' },
                                { labels: '임장', values: '1' },
                                { labels: '보류', values: '2' },
                                { labels: '완료', values: '3' },
                            ]}
                        />
                    </div>
                </div>

                <div className='margint20'>
                    <div>스와이프</div>
                    <div style={{
                        width: '100%', border: '1px solid red',
                    }}>
                        <SwiperStyle1
                            listsImag={[
                                './images/icons/2.png',
                                './images/icons/2.png',
                                './images/icons/2.png',
                                './images/icons/2.png',
                            ]}
                        />
                    </div>
                </div>


            </div>
        </Layout>
    )
}

