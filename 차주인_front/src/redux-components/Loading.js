import React, { useEffect, useState } from 'react';
import { Link, useFetcher, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import consts from '../libs/consts';

export default function Loading({}) {

    const dispatch = useDispatch();
    const { configdata } = useSelector(s => s.configReducer);
    const { loading } = useSelector(s => s.popupReducer);
    if(loading === true){
        return (
            <div className='pageloadings'>
                <div>
                    <img 
                        className='loadingimage'
                        style={{ width: 90}}
                        // src={`${consts?.s3url}/${configdata?.loading_img}`} 
                        src={"/images/icons/loading-20.svg"} 
                    />
                </div>
            </div>
        );
    } else {
        return ;
    }

}
