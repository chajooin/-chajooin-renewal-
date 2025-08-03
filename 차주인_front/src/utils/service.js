import axios from "axios";

const isLocal = window.location.hostname === "localhost";
const axiosInstance = axios.create({
    baseURL: isLocal ? "http://localhost:5000" : "https://chajooin.com",
    headers: {
        "Content-Type": "application/json",
        "scd": "CARMASTERSCD"
    }
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        let config = error.config;
        let data = error.response?.data;
        if (data) {
            if (data.code === 1000) {
                // 이용제한 계정
                console.log("🚀 ~ error:", error);
                localStorage.setItem("token", "");
                if (config.url.indexOf("/login/login") < 0) {
                    window.location.href = "/login";
                    return;
                }
            } else if (data.code === 1100) {
                // 로그인 필요
                localStorage.setItem("token", "");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export const postData = (url, sender = {}) => {
    axiosInstance.defaults.headers.common["authorization"] = localStorage.getItem("token");
    return axiosInstance.post(url, sender);
};
  