import React, { useEffect, useState } from 'react';
import { Link, useFetcher, useNavigate } from "react-router-dom";


import { useDispatch, useSelector } from "react-redux";
import Button from './Button';

export default function AlertPopup(props) {

    const { 
        setbellshowflag = () => {},
        setproducttogethersendflag = () => {}
    } = props;


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activebelllist, setactivebelllist] = useState([
        {dates: '2024.12.12 15:30', comments: 'OOO공인중개사사무소의 매물/고객 정보 귀속 설정이 변경되었으니 확인하세요.', belltype: '1'},
        {dates: '2024.12.12 15:30', comments: 'OOO공인중개사사무소의 매물/고객 정보 귀속 설정이 변경되었으니 확인하세요.', belltype: '0'},
        {dates: '2024.12.12 15:30', comments: 'OOO공인중개사사무소의 매물/고객 정보 귀속 설정이 변경되었으니 확인하세요.', belltype: '1'},
    ]);   

    const [belllist, setbelllist] = useState([
        {dates: '2024.12.12 15:30', stickers: '공동중개', comments: '[마포부동산 홍길동 부장님]이 공동중개를 요청하였습니다.', belltype: '1'},
        {dates: '2024.12.12 15:30', stickers: '만족도 평가', comments: '[마포부동산 홍길동 부장님]이 공동중개를 요청하였습니다.', belltype: '2'},
    ]);   

    return (
        <div className='AlertPopArea'>
            <div>
                <div className='AlertPopAreaBG' 
                    onClick={() => { setbellshowflag(false) }}
                />
                <div className="AlertPoplistArea">
                    <div className="titleTxt">알림</div>
                    <div className="subtitleTxt active">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M16.667 14.167H18.3337V15.8337H1.66699V14.167H3.33366V8.33366C3.33366 4.65176 6.31843 1.66699 10.0003 1.66699C13.6822 1.66699 16.667 4.65176 16.667 8.33366V14.167ZM15.0003 14.167V8.33366C15.0003 5.57223 12.7617 3.33366 10.0003 3.33366C7.2389 3.33366 5.00033 5.57223 5.00033 8.33366V14.167H15.0003ZM7.50033 17.5003H12.5003V19.167H7.50033V17.5003Z" fill="#FF0000"/>
                            </svg>
                            <span>중요 알림</span>
                        </div>
                        <button type="button" onClick={() => {

                        }}>
                            전체삭제
                        </button>
                    </div>
                    <div className='bell_listArea'>
                        {activebelllist?.length > 0 && activebelllist?.map((x, i) => {
                            return (
                                <div key={i}>
                                    <div>
                                        <span>{x?.dates}</span>
                                        <button type="button" onClick={() => {}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M10.0003 18.3337C5.39795 18.3337 1.66699 14.6027 1.66699 10.0003C1.66699 5.39795 5.39795 1.66699 10.0003 1.66699C14.6027 1.66699 18.3337 5.39795 18.3337 10.0003C18.3337 14.6027 14.6027 18.3337 10.0003 18.3337ZM10.0003 16.667C13.6822 16.667 16.667 13.6822 16.667 10.0003C16.667 6.31843 13.6822 3.33366 10.0003 3.33366C6.31843 3.33366 3.33366 6.31843 3.33366 10.0003C3.33366 13.6822 6.31843 16.667 10.0003 16.667ZM10.0003 8.82183L12.3573 6.46479L13.5358 7.6433L11.1788 10.0003L13.5358 12.3573L12.3573 13.5358L10.0003 11.1788L7.6433 13.5358L6.46479 12.3573L8.82183 10.0003L6.46479 7.6433L7.6433 6.46479L10.0003 8.82183Z" fill="#999999"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className='comments'>
                                        {x?.comments}
                                        {x?.belltype === '1' &&
                                            <div className='alertPoptypebuttons'>
                                                <button type="button" onClick={() => {}}>
                                                    확인하기
                                                </button>
                                            </div>
                                        }                                        
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                    <div className="bellmoreButtons margint20" style={{ width: 80 }}>
                        <Button
                            buttonTxt={'더보기'}
                            className={'linenormalbutton'}
                            styles={{ height: 32, fontSize: 12 }}
                            onPress={() => {
                                //navigate('Register');
                            }}                             
                        />                     
                    </div>

                    <div className="subtitleTxt margint20">
                        <div>
                            <span>일반 알림</span>
                        </div>
                        <button type="button" onClick={() => {

                        }}>
                            전체삭제
                        </button>
                    </div>
                    <div className='bell_listArea' style={{ marginBottom: 20 }}>
                        {belllist?.length > 0 && belllist?.map((x, i) => {
                            return (
                                <div 
                                    key={i}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        if(x?.belltype === '1'){
                                            setbellshowflag(false);
                                            setproducttogethersendflag(true);
                                        }
                                    }}
                                >
                                    <div>
                                        <span>{x?.dates}</span>
                                        <button type="button" onClick={() => {}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M10.0003 18.3337C5.39795 18.3337 1.66699 14.6027 1.66699 10.0003C1.66699 5.39795 5.39795 1.66699 10.0003 1.66699C14.6027 1.66699 18.3337 5.39795 18.3337 10.0003C18.3337 14.6027 14.6027 18.3337 10.0003 18.3337ZM10.0003 16.667C13.6822 16.667 16.667 13.6822 16.667 10.0003C16.667 6.31843 13.6822 3.33366 10.0003 3.33366C6.31843 3.33366 3.33366 6.31843 3.33366 10.0003C3.33366 13.6822 6.31843 16.667 10.0003 16.667ZM10.0003 8.82183L12.3573 6.46479L13.5358 7.6433L11.1788 10.0003L13.5358 12.3573L12.3573 13.5358L10.0003 11.1788L7.6433 13.5358L6.46479 12.3573L8.82183 10.0003L6.46479 7.6433L7.6433 6.46479L10.0003 8.82183Z" fill="#999999"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className='comments'>
                                        {x?.stickers !== '' &&
                                            <div className='alerPoptypestickers'>
                                                <span>{x?.stickers}</span>
                                            </div>
                                        }                                              
                                        {x?.comments}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>                
            </div>
        </div>
    )    
}