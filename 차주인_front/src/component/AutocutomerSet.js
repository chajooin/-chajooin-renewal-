import React, { useEffect, useState } from 'react';
import { Link, useFetcher, useNavigate } from "react-router-dom";


import { useDispatch, useSelector } from "react-redux";
import Button from './Button';
import Input from './Input';
import Radios from './Radios';
import Profiles from './Profiles';
import { close, open } from '../redux/popupSlice';
import Select from './Select';

export default function AutocutomerSet(props) {

    const {
        setautocustomerpop=() => {},
    } = props;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchactive, setsearchactive] = useState(0);   
    const [searchvar, setsearchvar] = useState('');   
    const [meetinglist, setmeetinglist] = useState([
        {viewernames: '3.23(화)', values: '결정력이 떨어짐. 다음 미팅을 기준으로 자동고객관리 대상 판단'},
        {viewernames: '3.15(화)', values: '자동고객관리 시작, 전송매물 열람수 확인하기'},
    ]);  
    const [saveComments, setsaveComments] = useState(`안녕하세요.
#{부동산상호} #{담당자} 입니다.

고객님께서 문의 주셨던 조건과
일치하는 매물 #{건수}건이
추가로 확인되었습니다.

고객님 희망조건
#{고객조건}

매물에 대한 문의는 아래 연락처로
연락주세요.

#{부동산상호}
#{소재지}
#{등록번호}
#{담당자}
#{연락처}
`);   


    useEffect(() => {
        document.getElementsByTagName('HTML')[0]['style']['overflow-y'] = 'hidden';
        return () => {
            document.getElementsByTagName('HTML')[0]['style']['overflow-y'] = 'scroll';
        }
    }, []);


    return (
        <>
            <div className='ProductDetailArea' style={{ zIndex: 1003}}>
                <div>
                    <div className='ProductDetailAreaBG' 
                        onClick={() => {
                            setautocustomerpop(false);
                        }}
                    />

                    <div></div>
                    <div className="ProductSendDetailpop "> 
                        <div className="ProductpopTitle padding20" style={{ borderBottom: '1px solid #eee'}}>
                            <span>자동고객관리</span>
                            <button
                                onClick={() => {
                                    setautocustomerpop(false);
                                }}
                            >
                                <img src="./images/icons/x.svg" />                                            
                            </button>
                        </div>
                        <div 
                            className="mettingArea padding32"
                        >
                            <div
                                style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'flex-end' }}
                            >
                                <button
                                    onClick={() => {}}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4}}
                                >
                                    <span>자동고객관리 OFF</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M8 7C5.23858 7 3 9.23858 3 12C3 14.7614 5.23858 17 8 17H16C18.7614 17 21 14.7614 21 12C21 9.23858 18.7614 7 16 7H8ZM8 5H16C19.866 5 23 8.13401 23 12C23 15.866 19.866 19 16 19H8C4.13401 19 1 15.866 1 12C1 8.13401 4.13401 5 8 5ZM8 15C6.34315 15 5 13.6569 5 12C5 10.3431 6.34315 9 8 9C9.65685 9 11 10.3431 11 12C11 13.6569 9.65685 15 8 15Z" fill="#CCCCCC"/>
                                    </svg>
                                </button>
                            </div>

                            <div className='texts'>
                                고객의 희망 매물 조건과 일치하면<br />
                                카카오 알림톡을 자동으로 발송해주는 시스템입니다.
                            </div>
                            <div className='tips'>
                                <div className='fontsize16 bolds'>TIP</div>
                                <div className='tipcontents margint8'>
                                    <span>1.</span>
                                    <p>이탈 고객도 어딘가에서는 계약하는 잠재 고객입니다.</p>
                                </div>
                                <div className='tipcontents'>
                                    <span>2.</span>
                                    <p>이탈 고객에게도 한번 더 연락하게끔 호기심을 유도하는 기능입니다.</p>
                                </div>
                                <div className='tipcontents'>
                                    <span>3.</span>
                                    <p>물건의 정보는 제공하지 않으며 아래 내용으로 알림톡이 발송됩니다.</p>
                                </div>
                                <div className='tipcontents'>
                                    <span>3.</span>
                                    <p>수요일, 금요일 주2회(오전 10시), 매칭되는 물건이 있을 경우에만 발</p>
                                </div>
                            </div>
                            <div style={{ width: '100%'}}>
                                <div className='bolds fontsize16'>기본내용</div>
                                <textarea 
                                    className='margint8'
                                    style={{
                                        width: '100%', padding: 12, height: 330, border: '1px solid #DDD', borderRadius: 4,
                                    }}
                                >{saveComments}</textarea>
                            </div>
                            <div style={{ width: '100%' }}>
                                <Button
                                    buttonTxt={'저장'}
                                    styles={{ 
                                    }} 
                                    onPress={() => { 
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
                                />   
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </>
    )    
}