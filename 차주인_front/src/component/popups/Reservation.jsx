import { useState } from "react";
import { numFormat } from "../../utils/utils";

export const Reservation = (props) => {
    let {
        point = 0,
        usePoint = 100,
        strType = "예약"
    } = props

    return <div style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        marginBottom: 20
    }}>
        <div style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 14,
            padding: "12px 0px",
            background: "#F1F1F1"
        }}>{strType}상담신청시&nbsp;<span style={{ fontSize: "inherit", color: "#3B4894", fontWeight: 700 }}>{numFormat(usePoint, true)}포인트</span>가 필요합니다.</div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <p>보유 포인트</p>
            <p style={{ fontWeight: 700 }}>{numFormat(point, true)}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <p>차감 포인트</p>
            <p style={{ fontWeight: 700 }}>{numFormat(usePoint, true)}</p>
        </div>
        {point < usePoint && <div style={{ display: "flex", justifyContent: "center", marginTop: 20, color: "#F00" }}>포인트가 부족합니다. 충전해 주세요.</div>}
    </div>
}