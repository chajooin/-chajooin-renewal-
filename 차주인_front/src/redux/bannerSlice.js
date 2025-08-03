import { createAction, createSlice } from "@reduxjs/toolkit"

const bannerSlice = createSlice({
    name: "banner",
    initialState: {
        open: false,
        closeTime: null,
        bannerList: [],
    },

    reducers: {
        bannerOpen(state, action) {
            // console.log("bannerOpen::", state.closeTime)
            if (state.closeTime) {
                if (state.closeTime > Date.now()) {
                    // console.log(state.closeTime - Date.now())
                    state.open = false
                } else {
                    state.closeTime = null
                    state.open = true
                    state.bannerList = action.payload.bannerList
                }
            } else {
                state.open = true
                state.bannerList = action.payload.bannerList
            }
        },
        bannerClose(state, action) {
            state.open = false
        },
        setCloseTime(state, action) {
            // console.log(action.payload)
            state.closeTime = action.payload
        }
    },
})

export const {
    bannerOpen,
    bannerClose,
    setCloseTime,
} = bannerSlice.actions

export default bannerSlice.reducer