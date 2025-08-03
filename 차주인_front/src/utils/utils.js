import moment from 'moment';
import { useEffect, useRef } from 'react';
import _ from "lodash"
import * as APIS from "../utils/service";

export const regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/; // 휴대폰번호
export const regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/; // 이메일

export const patternNum = /[0-9]/;	// 숫자 
export const patternPrice = /[0-9,]/;	// 금액 
export const patternEng = /[a-zA-Z]/;	// 영문 
export const patternEngUpper = /[A-Z]/;	// 영문 대문자
export const patternSpc = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim; // 특수문자 모두

export const patternSpcId = /[`~!#$%^&*()|+\=?;:'",<>\{\}\[\]\\\/ ]/gim; // 특수문자 아이디용
export const patternSpcId2 = /[`~!#$%^&*()|+\=?;:'"\-<>\{\}\[\]\\\/ ]/gim; // 특수문자 아이디용
export const patternSpcPw = /[|+\=?;:'",.<>\{\}\[\]\\\/ ]/gim; // 특수문자 비밀번호용
export const patternSpcEmail = /[`~!#$%^&*()|+\-=?;:'"<>\{\}\[\]\\\/ ]/gim; // 특수문자 이메일용
export const patternPwCker = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{4,15}$/;

export const patternKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크

export const regFileDoc = /(.*?)\.(jpg|jpeg|png|gif|bmp|svg|pdf|ai|psd|xls|xlsx|ppt|pptx|pem|zip|hwp|txt|doc|docx|mp4)$/; // 문서파일 가능한 확장자
export const regFileImage = /(.*?)\.(jpg|jpeg|png|gif|bmp|svg)$/; // 이미지파일 가능한 확장자
export const regFilePdf = /(.*?)\.(pdf)$/; // PDF파일 가능한 확장자
export const regFileExcel = /(.*?)\.(xlsx|csv)$/; // 엑셀 파일 가능한 확장자

export const hpHypen = (str) => {
    return str.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
};

export const numFormat = (num, milion = false) => {
    if (num) {
        let exnum = [];
        if (num?.toString().indexOf('.') != -1 && milion === false) {
            exnum = num?.toString().split('.');
            num = exnum[0];
            num = num.toString()?.replace(/,/g, '');
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + exnum[1];
        } else {
            num = num.toString()?.replace(/,/g, '');
            if (num * 1 > 0) {
                num = Math.floor(num * 1);
            }

            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    } else {
        return 0;
    }
};

export const findJson = (object, val) => {
    let title = "정보없음";

    object.forEach((one, index) => {
        if ((one.idx * 1) === (val * 1)) {
            title = one.title;
        }
    })
    return title;
};

export const findJsonKey = (object, val, key) => {
    let title = "정보없음";

    object.forEach((one, index) => {
        if ((one.idx * 1) === (val * 1)) {
            title = one[key];
        }
    })
    return title;
};


export const findJsonImti = (object, val) => {
    let title = "👍";

    object.forEach((one, index) => {
        if ((one.idx * 1) === (val * 1)) {
            title = one.title;
        }
    })
    return title;
};


export const getFileName = (url) => {

    let urls = url.split("/");
    return urls[urls.length - 1];
};

export const sortHandler = (list, key, od = 'asc') => {
    if (!list) return [];
    if (!key) return list;

    let listArr = list // 새로 복사된 numbers

    if (od === 'asc') {
        listArr.sort((a, b) => { return a[key] - b[key] });
    } else {
        listArr.sort((a, b) => { return b[key] - a[key] });
    }

    // console.log(listArr);
    return listArr;
}

export const groupBy = (xs, key) => {

    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});

};

export const getDistanceFromLatLonInKm = (lat, lng, elat, elng) => {

    var lat1 = lat;
    var lng1 = lng;
    var lat2 = elat;
    var lng2 = elng;

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    var r = 6371; //지구의 반지름(km)
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = r * c; // Distance in km
    return Math.round(d * 1000);

};


export const useInterval = (callback, delay) => {
    const savedCallback = useRef()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        const tick = () => {
            const { current } = savedCallback

            if (current !== undefined && current !== null) {
                current()
            }
        }
        if (delay !== null) {
            const id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
        return () => { }
    }, [delay])
}

export const randomDigitCharactersSpecialCharacterslength = (lenth) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$&()_+~?|";
    for (var i = 0; i < lenth; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

export const isValidDate = (value) => {
    return value instanceof Date && !isNaN(value);
};

export const dateformat = (value) => {
    return moment(value).format('YYYY.MM.DD');
};
export const datetimeformat = (value, isMin = true) => {
    return moment(value).format(`YYYY.MM.DD HH:mm${isMin && ":ss"}`);
};
const krWeekList = ["일", "월", "화", "수", "목", "금", "토"]
export const dateMinformat = (value, isWeek = true) => {
    let week = krWeekList[moment(value).day()];
    return moment(value).format(`YYYY.MM.DD${isWeek ? "(" + week + ")" : ""} HH:mm`);
};

export const dateShotYearformat = (value) => {
    if (value?.length >= 2)
        return value?.substring(value.length - 2)
    else
        return value
};

export const addHyphenToPhoneNumber = (phoneNumberInput) => {
    if (typeof phoneNumberInput != "string") {
        return phoneNumberInput
    }
    const phoneNumber = phoneNumberInput;
    const length = phoneNumber.length;

    if (length >= 9) {
        let numbers = phoneNumber.replace(/[^0-9]/g, "").replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
        return numbers;
    } else {
        return phoneNumberInput;

    }
};

export const getBase64 = (files) => {
    return new Promise(resolve => {
        let fileInfo;
        let baseURL = "";
        // Make new FileReader
        let reader = new FileReader();

        // Convert the file to base64 text
        reader.readAsDataURL(files);

        // on reader load somthing...
        reader.onload = () => {
            // Make a fileInfo Object
            baseURL = reader.result;
            resolve(baseURL);
        };
        //console.log(fileInfo);
    });
}

export const getBase64toDataUrl = (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

export const Ismobiles = () => {
    if (/Android|iPhone/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
}

export const useIntersectionObserver = (callback) => {
    const observer = useRef(
        new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        callback();
                    }
                });
            },
            { threshold: 1 }
        )
    );

    const observe = (element) => {
        observer.current.observe(element);
    };

    const unobserve = (element) => {
        observer.current.unobserve(element);
    };

    return [observe, unobserve];
}

export const clickImg = (imgsrc) => {
    var imageWin = new Image();
    imageWin = window.open("", "", "");
    imageWin.document.write("<html><body style='margin:0'>");
    imageWin.document.write("<img src='" + imgsrc + "' border=0 style='width: 100%; height: 100%; object-fit: contain;'>");
    imageWin.document.write("</body><html>");
};

/**
 * 연도 리스트 가져오기
 * @param {number} start
 * @returns 
 */
export const yearList = (start) => {
    let list = []
    let startYear = start ? start : 1990;
    let currentYear = new Date().getFullYear()
    for (let i = startYear; i <= currentYear; i++)
        list.push(i)

    return list
}

export const monthList = () => {
    let list = []
    for (let i = 1; i <= 12; i++)
        list.push(i)

    return list
}

//hook
export function useMoveScrool() {
    const element = useRef(null);
    const onMoveToElement = () => {
        element.current?.scrollIntoView({ block: 'start' });
    };
    return { element, onMoveToElement };
}

export const findIndex = (value, list = []) => {
    let resultIndex = -1;
    for (let i in list) {
        if (list[i] == value) {
            resultIndex = i
            break;
        }
    }
    return resultIndex
}

/**
 * 파일네임 가져오기
 * @param {string} value path 
 * @returns {string}
 */
export const pathToFilename = (value) => {
    let pathList = value.split("/")
    if (pathList.length > 0)
        return pathList[pathList.length - 1]
    else
        return ""
}

export const randomNumberLength = (length = 8) => {
    let randNum = _.random(99999999)
    return _.padStart(randNum, length, "0");
}


export const elapsedTime = (date) => {
    const start = new Date(date);
    const end = new Date();

    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (seconds < 60) return '방금 전';

    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분 전`;

    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간 전`;

    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}일 전`;

    return `${moment(start).format("YYYY.MM.DD HH:mm")}`;
};

export const goBackPage = (navigate) => {
    window.history.length <= 1 ? navigate("/", { replace: true }) : navigate(-1);
}