import * as APIS from "../utils/service"
import { API_URL } from "./apiUrl"

/**
 * 서브타입 가져오기
 * @param {string} type 
 * @returns 
 */
export const getCarSubType = (type) => {
    return new Promise((res, rej) => {
        APIS.postData(API_URL.commom.carSubType, { type })
            .then(({ data }) => {
                res(data)
            }).catch((e) => {
                res(e)
            })
    })
}


export const getSigungus = (sido) => {
    return new Promise((res, rej) => {
        APIS.postData(API_URL.commom.sigungu, { sido })
            .then(({ data }) => {
                res(data)
            }).catch((e) => {
                res(e)
            })
    })
}