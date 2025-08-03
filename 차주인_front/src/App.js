import React, { useEffect, useState } from 'react';

import { Provider } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Routerlist from "./router/Router";

import Popup from "./redux-components/Popup";
import Banner from './redux-components/Banner';
import Loading from "./redux-components/Loading";

import 'react-toastify/dist/ReactToastify.css';
import "./css/common.css";
import "./css/header.css";
import "./css/footer.css";
import "./css/layout.css";
import "./css/animations.css";
import "./css/used-popup-layout.css"

function App() {
	/* 빌드시 주석해제 */
	console = {};
	console.log = function () { };
	console.warn = function () { };
	console.error = function () { };

	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<Routerlist />
				<Loading />
				<Popup />
				<Banner />
				<ToastContainer
					position="top-center"
					autoClose={2000}
					hideProgressBar
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</PersistGate>
		</Provider>
	);
}

export default App;
