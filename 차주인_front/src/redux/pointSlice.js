import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import axios from 'axios';

import * as APIS from "../utils/service";
import { API_URL } from '../libs/apiUrl';

// 1 충전내역
// 2 지급내역
// 3 사용내역
// 4 환전내역

const point = createSlice({
    name: 'userinfo',
    initialState: {
        listType1: [],
        listType2: [],
        listType3: [],
        listType4: []
    },

    reducers: {
        setPointList(state, { payload }) {
            if (payload.type == 1) state.listType1 = payload.list
            if (payload.type == 2) state.listType2 = payload.list
            if (payload.type == 3) state.listType3 = payload.list
            if (payload.type == 4) state.listType4 = payload.list
        }
    }

});



export const {
    setPointList,
} = point.actions;

export const selectPointInfo = (s) => s.pointReducer

export default point.reducer;
