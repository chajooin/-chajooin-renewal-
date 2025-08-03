import React, { useEffect } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadUserInfo, setUserInfoTest } from "../../redux/userSlice";
import Layout from "../../layout/Layout";



export default function PayLoading() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // dispatch(setUserInfoTest({ value: 2 }));
        window.opener.location.reload();
        window.close();
    }, []);


    return (
        <Layout header={false} footters={false} >
            <div className="content" >
                <img
                    className='loadingimage'
                    style={{ width: 90 }}
                    src={"/images/icons/loading-20.svg"}
                />
            </div>
        </Layout>
    );
}

