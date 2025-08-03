import React from "react"
import { numFormat } from "../../utils/utils"

export const FastInsert = (props) => {
    let {
        point = 0,
        usePoint = 100,
    } = props

    return <div style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20
    }}>
        <div style={{ wordBreak: "keep-all", textAlign: "center" }}>메인페이지에 매물이 노출되어 빠르게 판매하실 수 있습니다.</div>
        <div style={{
            padding: "12px 20px",
            fontWeight: 700,
            marginTop: 20,
            borderRadius: "100px",
            border: "1px solid #3B4894",
            color: "#3B4894"
        }}>30일간 메인 노출</div>

        <div style={{ width: "100%", height: 1, background: "#EEE", margin: "20px 0px" }} />

        <div style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            fontSize: 14,
            padding: "12px 0px",
            background: "#F1F1F1"
        }}>빠른 판매 등록시&nbsp;<span style={{ fontSize: "inherit", color: "#3B4894", fontWeight: 700 }}>{numFormat(usePoint, true)}포인트</span>가 필요합니다.</div>

        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginTop: 20 }}>
            <p>보유 포인트</p>
            <p style={{ fontWeight: 700 }}>{numFormat(point, true)}</p>
        </div>
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginTop: 8 }}>
            <p>차감 포인트</p>
            <p style={{ fontWeight: 700 }}>{numFormat(usePoint, true)}</p>
        </div>
        {point < usePoint && <div style={{ display: "flex", justifyContent: "center", marginTop: 20, color: "#F00" }}>포인트가 부족합니다. 충전해 주세요.</div>}
    </div>
}