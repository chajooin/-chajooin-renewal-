import { createSlice } from '@reduxjs/toolkit';

const configs = createSlice({
    name: 'config',
    initialState: {
        configInfo: {},
        carTypes: [],
        subCarTypes: [],
        configSidos: [],
        configSigungus: [],
        configDong: [],
        configMakers: [],
        configMakerCars: [],
        reload: false,
        accessCount: {}
    },

    reducers: {
        configopen(state, action) {
            if (state.configInfo)
                state.configInfo = action.payload.configdata;
        },
        setCarTypes(state, actions) {
            if (state.carTypes)
                state.carTypes = actions.payload.carTypes
        },
        setSubCarTypes(state, action) {
            if (state.subCarTypes)
                state.subCarTypes = action.payload.subCarTypes
        },
        setConfigSidos(state, action) { if (action.payload.sidos) state.configSidos = action.payload.sidos },
        setConfigSigungus(state, action) { if (action.payload.sigungus) state.configSigungus = action.payload.sigungus },
        setConfigDong(state, action) { if (action.payload.dong) state.configDong = action.payload.dong },
        setConfigMakers(state, action) {
            // console.log("🚀 ~ setConfigMakers ~ action:", action)

            if (action.payload.makers) state.configMakers = action.payload.makers
        },
        setConfigMakerCars(state, action) {
            // console.log("🚀 ~ setConfigMakerCars ~ action:", action)
            if (action.payload.makerCars) state.configMakerCars = action.payload.makerCars
        },
        setAccessCount(state, action) {
            console.log("🚀 ~ setAccessCount ~ action:", action)
            state.accessCount = action.payload
        }
    },
});

export const {
    configopen,
    setCarTypes,
    setSubCarTypes,
    setConfigSidos,
    setConfigSigungus,
    setConfigDong,
    setConfigMakers,
    setConfigMakerCars,
    setAccessCount,
} = configs.actions;

export const selectConfig = (s) => s.configReducer

export default configs.reducer;
