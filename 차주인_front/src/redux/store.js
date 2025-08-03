import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import {
  persistStore,
  persistReducer,
} from 'redux-persist';
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['popupReducer','userReducer'], //휘발성
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export default store;
