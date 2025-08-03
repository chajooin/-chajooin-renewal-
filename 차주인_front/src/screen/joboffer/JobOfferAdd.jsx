import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

import { open, close, loadingflas } from '../../redux/popupSlice';

import "../../css/page-joboffer-add.css"

import Layout from "../../layout/Layout";
import Selector from "../../component/Select";
import Button from "../../component/Button";
import Checkbox from '../../component/Checkbox';
import Radios from '../../component/Radios';
import Input from '../../component/Input';

import * as APIS from "../../utils/service";
import { selectConfig } from '../../redux/configSlice';
import { API_URL } from '../../libs/apiUrl';
import { findIndex, goBackPage } from '../../utils/utils';

export default function JobOfferInfo({ navigation }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);

    const ConfigData = useSelector(selectConfig);

    const [idx, setidx] = useState(null);
    const [title, settitle] = useState("");
    const [company, setcompany] = useState("");
    const [sidoIndex, setSidoIndex] = useState(-1)
    const [sigunguIndex, setSigunguIndex] = useState(-1)
    const [item, setitem] = useState("");
    const [section, setsection] = useState("");
    const [unloading, setunloading] = useState([]);
    const [work, setwork] = useState("");
    const [dayoff, setdayoff] = useState("");
    const [pay, setpay] = useState("");
    const [deadline_type, setdeadline_type] = useState(1);
    const [deadline, setdeadline] = useState("");
    const [ton, setton] = useState("");
    const [userton, setuserton] = useState();
    const [certificate, setcertificate] = useState();
    const [cargo_option, setcargo_option] = useState(1);
    const [danger_option, setdanger_option] = useState(1);
    const [health_option, sethealth_option] = useState(1);
    const [machinery_option, setmachinery_option] = useState(1);
    const [worktype, setworktype] = useState("");
    const [gender, setgender] = useState("");
    const [education, seteducation] = useState("");
    const [career, setcareer] = useState("");
    const [desc, setdesc] = useState("");
    const [status, setstatus] = useState(1);


    const doneClick = () => {
        let sendData = {
            idx: idx, // 있으면 수정 없으면 등록 
            status: 1, // 상태  
            title: "", // 제목
            company: "", // 업체명
            go_sido: "", // 출근지 시/도
            go_sigungu: "", // 출근지 시/군/구
            item: "", // 운송품목 config item_option 값중 하나
            section: "", // 운행구간
            unloading: [], // 상하차형태 config unloading_option 값중 여러개
            work: "", // 근무시간
            dayoff: "", // 휴무
            pay: 0, // 월급여(만원단위)
            deadline_type: 1, // 접수마감 타입 1=채용시 마감 2=상시모집 3=기간설정 
            deadline: "", // 접수마감일(타입 3일경우만 YYYY-MM-DD)
            ton: "", // 톤 수 config ton_option 값중 하나거나 직접입력한 소수점 한자리까지
            certificate: "", // 적합면허 config certificate_option 값중 하나
            cargo_option: false, // 화물운송종사자격 true / false
            danger_option: false, // 위험물운송자격 true / false
            health_option: false, // 보건증 true / false
            machinery_option: false, // 건설기계조종사면허 true / false
            worktype: "", // 근무형태 config worktype_option 값중 하나
            gender: "", // 성별 config gender_option 값중 하나
            education: "", // 학력 config education_option 값중 하나
            career: "", // 경력 config career_option 값중 하나
            desc: "" // 상세 내용
        }

        let err = []
        if (title) sendData.title = title; else err.push("제목")
        if (company) sendData.company = company; else err.push("업체명")
        if (sidoIndex >= 0) sendData.go_sido = ConfigData.configSidos[sidoIndex]; else err.push("시/도")
        if (sigunguIndex >= 0 && sidoIndex >= 0) sendData.go_sigungu = ConfigData.configSigungus[sidoIndex][sigunguIndex]; else err.push("시/군/구")
        if (item) sendData.item = item; else err.push("운송품목")
        if (section) sendData.section = section; else err.push("운행구간")
        if (unloading) sendData.unloading = unloading.map(v => v.values);
        if (work) sendData.work = work; else err.push("근무시간")
        if (dayoff) sendData.dayoff = dayoff; else err.push("휴무")
        if (pay) sendData.pay = pay; else err.push("급여")
        if (deadline_type) {
            sendData.deadline_type = deadline_type
            if (deadline_type == 3)
                if (deadline) sendData.deadline = deadline; else err.push("접수마감 날짜")
        } else err.push("접수마감")

        if (ton) {
            sendData.ton = ton;
            if (ton == "user")
                if (userton) sendData.ton = userton; else err.push("차량톤수")
        } else err.push("차량톤수")

        if (certificate) sendData.certificate = certificate; else err.push("적합면허")
        if (cargo_option == 0 || cargo_option == 1) sendData.cargo_option = (cargo_option == 1); else err.push("위험물운송자증")
        if (danger_option == 0 || danger_option == 1) sendData.danger_option = (danger_option == 1); else err.push("위험물운송자증")
        if (health_option == 0 || health_option == 1) sendData.health_option = (health_option == 1); else err.push("보건증")
        if (machinery_option == 0 || machinery_option == 1) sendData.machinery_option = (machinery_option == 1); else err.push("건설기계조종사면허")
        if (worktype) sendData.worktype = worktype; else err.push("근무형태")
        if (gender) sendData.gender = gender; else err.push("성별")
        if (education) sendData.education = education; else err.push("학력")
        if (career) sendData.career = career; else err.push("경력")
        if (desc) sendData.desc = desc; else err.push("상세내용")
        if (status >= 0) sendData.status = status; else err.push("등록상태")

        console.log("🚀 ~ doneClick ~ sendData:", sendData)
        if (err.length > 0) {
            dispatch(
                open({
                    component: <div>
                        <p>입력값을 확인해주세요.</p><br />
                        <p>[ {err.map((val, i) => {
                            if (i !== 0)
                                return ", " + val
                            return val
                        })} ]</p>
                    </div>,
                    // content: "차량정보를 입력해주세요.",
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    buttonCencle: "닫기",
                    onPress: () => { dispatch(close()) },
                    onCancelPress: () => { dispatch(close()) },
                })
            );
        } else {
            dispatch(
                open({
                    content: `${idx ? "수정" : "등록"}하시겠습니까?`,
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    buttonCencle: "닫기",
                    onPress: () => {
                        dispatch(close());
                        insertOffer(sendData);
                    },
                    onCancelPress: () => { dispatch(close()) },
                })
            );
        }
    }

    const insertOffer = (data) => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.jobOffer.insert, data)
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                console.log(result.data)
                goBackPage(navigate);
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
                console.log(e)
            })
    }

    const loadData = (init = false) => {
        dispatch(loadingflas({ loading: true }))
        APIS.postData(API_URL.jobOffer.info, { idx: params.get("idx"), init })
            .then((result) => {
                dispatch(loadingflas({ loading: false }))
                console.log(result.data)
                let info = result.data

                setidx(info?.idx);
                settitle(info?.title);
                setcompany(info?.company);
                setSidoIndex(findIndex(info?.go_sido, ConfigData.configSidos)); // 
                let paSidoIndex = findIndex(info?.go_sido, ConfigData.configSidos)
                setSigunguIndex(findIndex(info?.go_sigungu, ConfigData.configSigungus[paSidoIndex])); //
                setitem(info?.item);
                setsection(info?.section);
                setunloading(info?.unloading.split(",").map(v => { return { names: v, values: v } }));
                setwork(info?.work);
                setdayoff(info?.dayoff);
                setpay(info?.pay);
                setdeadline_type(info?.deadline_type);
                if (info?.deadline_type == 3)
                    setdeadline(info?.deadline);

                let tonIndex = findIndex(info?.ton, ConfigData.configInfo?.options?.ton_option)
                if (tonIndex >= 0) { setton(info?.ton); }
                else {
                    setton("user");
                    setuserton(info?.ton)
                }
                setcertificate(info?.certificate);
                setcargo_option(info?.cargo_option ? 1 : 0);
                setdanger_option(info?.danger_option ? 1 : 0);
                sethealth_option(info?.health_option ? 1 : 0);
                setmachinery_option(info?.machinery_option ? 1 : 0);
                setworktype(info?.worktype);
                setgender(info?.gender);
                seteducation(info?.education);
                setcareer(info?.career);
                setdesc(info?.desc);
                setstatus(info?.status);
            })
            .catch(e => {
                dispatch(loadingflas({ loading: false }))
                goBackPage(navigate);
            })
    }

    useEffect(() => {
        if (params.get("idx")) {
            console.log("수정하기");
            console.log("JobOfferAdd -> params:", params.get("idx"))
            loadData(false)

        } else {
            console.log("신규등록");
        }
    }, [])


    return (
        <Layout header={false} footters={false}>
            <div className="jobOfferAddContain">
                <div className="global-titleBox bg_white">
                    <img src="/images/icons/back.svg" alt="" onClick={() => { goBackPage(navigate); }} />
                    <div className="titleInfo">
                        <div className="text">구인 {idx ? "수정" : "등록"}</div>
                    </div>
                </div>

                <div className="infoBox">
                    <div class="header-title-20">구인 정보</div>
                    <div className="job-info">
                        <div className="list">
                            <div className="row">
                                <div className="title required">제목</div>
                                <div className="value">
                                    <Input
                                        className={`inputs`}
                                        placeholder=""
                                        setValue={settitle}
                                        value={title}
                                        name="name"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">업체명</div>
                                <div className="value">
                                    <Input
                                        className={`inputs`}
                                        placeholder=""
                                        setValue={setcompany}
                                        value={company}
                                        name="name"
                                    />
                                    <div className='company-help'>개인인 경우 [개인]으로 기재</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">출근지</div>
                                <div className="value">
                                    <Selector
                                        placeholder="시/도"
                                        subselectClass="selector-148"
                                        values={sidoIndex}
                                        setValues={(v) => {
                                            setSigunguIndex(0)
                                            setSidoIndex(v)
                                        }}
                                        selectData={ConfigData.configSidos?.map((v, i) => { return { values: i, labels: v } })} />
                                    <Selector
                                        placeholder="시/군/구"
                                        subselectClass="selector-148"
                                        values={sigunguIndex}
                                        setValues={setSigunguIndex}
                                        selectData={ConfigData.configSigungus[sidoIndex]?.map((v, i) => {
                                            return { values: i, labels: v }
                                        })}
                                        disabled={sidoIndex < 0}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">운송품목</div>
                                <div className="value">
                                    <Selector
                                        placeholder="선택"
                                        subselectClass="selector-280"
                                        values={item}
                                        setValues={setitem}
                                        selectData={ConfigData.configInfo?.options?.item_option?.map((v) => {
                                            return { values: v, labels: v }
                                        })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">운행구간</div>
                                <div className="value">
                                    <div className="input-400">
                                        <Input
                                            className={`inputs`}
                                            placeholder=""
                                            setValue={setsection}
                                            value={section}
                                            name="name"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">상하차 형태</div>
                                <div className="value">
                                    <Checkbox
                                        linetype={'checkimg'}
                                        values={unloading}
                                        setvalues={setunloading}
                                        namevalue={ConfigData.configInfo?.options?.unloading_option?.map((v) => {
                                            return { names: v, values: v }
                                        })}
                                        fontweights={400}
                                        fontSizes={14}
                                        sizes={20}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">근무시간</div>
                                <div className="value">
                                    <div className="input-400">
                                        <Input
                                            className={`inputs`}
                                            placeholder=""
                                            setValue={setwork}
                                            value={work}
                                            name="name"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">휴무</div>
                                <div className="value">
                                    <div className="input-400">
                                        <Input
                                            className={`inputs`}
                                            placeholder=""
                                            setValue={setdayoff}
                                            value={dayoff}
                                            name="name"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">급여</div>
                                <div className="value">
                                    <div className="input-200">
                                        <Input
                                            className={`inputs`}
                                            placeholder=""
                                            setValue={setpay}
                                            value={pay}
                                            type="number"
                                        />
                                    </div>

                                    <div className='unit'>만원</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">접수마감</div>
                                <div className="value">
                                    <Radios
                                        linetype={'checkimg'}
                                        values={deadline_type}
                                        setvalues={(v) => {
                                            if (v != 3) setdeadline("")
                                            setdeadline_type(v)
                                        }}
                                        namevalue={[
                                            { names: '채용시', values: 1 },
                                            { names: '상시채용', values: 2 },
                                            {
                                                names: <Input
                                                    className={`inputs `}
                                                    placeholder="일자 입력"
                                                    setValue={setdeadline}
                                                    value={deadline}
                                                    type="date"
                                                    disabled={deadline_type != 3}
                                                />, values: 3
                                            },
                                        ]}
                                        fontweights={400}
                                        fontSizes={14}
                                        sizes={20}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="infoBox mt-4">
                    <div class="header-title-20">자격요건</div>
                    <div className="job-info">
                        <div className="list">
                            <div className="row">
                                <div className="title required">차량톤수</div>
                                <div className="value">
                                    <Selector
                                        placeholder="톤"
                                        subselectClass="selector-148"
                                        values={ton}
                                        setValues={setton}
                                        selectData={ConfigData.configInfo?.options?.ton_option.map((v) => {
                                            return { values: v, labels: v + "톤" }
                                        }).concat({ values: "user", labels: "직접입력" })} />

                                    {ton === "user" && <div className="input-100">
                                        <Input
                                            className={`inputs `}
                                            placeholder="톤수 입력"
                                            setValue={(v) => {
                                                if (v.indexOf(".") >= 0)
                                                    setuserton(Number(v).toFixed(1))
                                                else
                                                    setuserton(v)
                                            }}
                                            value={userton}
                                            type="number"
                                        />
                                    </div>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">적합 면허</div>
                                <div className="value">
                                    <Selector
                                        placeholder="선택"
                                        subselectClass="selector-280"
                                        setValues={setcertificate}
                                        values={certificate}
                                        selectData={ConfigData.configInfo?.options?.certificate_option?.map((v) => {
                                            return { values: v, labels: v }
                                        })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">화물운송종사자격</div>
                                <div className="value">
                                    <Radios
                                        linetype={'radioimg'}
                                        values={cargo_option}
                                        setvalues={setcargo_option}
                                        namevalue={[
                                            { names: '필요', values: 1 },
                                            { names: '필요 없음', values: 0 },
                                        ]}
                                        fontweights={400}
                                        fontSizes={14}
                                        sizes={20}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">위험물운송자증</div>
                                <div className="value">
                                    <Radios
                                        linetype={'radioimg'}
                                        values={danger_option}
                                        setvalues={setdanger_option}
                                        namevalue={[
                                            { names: '필요', values: 1 },
                                            { names: '필요 없음', values: 0 },
                                        ]}
                                        fontweights={400}
                                        fontSizes={14}
                                        sizes={20}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">보건증</div>
                                <div className="value">
                                    <Radios
                                        linetype={'radioimg'}
                                        values={health_option}
                                        setvalues={sethealth_option}
                                        namevalue={[
                                            { names: '필요', values: 1 },
                                            { names: '필요 없음', values: 0 },
                                        ]}
                                        fontweights={400}
                                        fontSizes={14}
                                        sizes={20}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">건설기계조종사면허</div>
                                <div className="value">
                                    <Radios
                                        linetype={'radioimg'}
                                        values={machinery_option}
                                        setvalues={setmachinery_option}
                                        namevalue={[
                                            { names: '필요', values: 1 },
                                            { names: '필요 없음', values: 0 },
                                        ]}
                                        fontweights={400}
                                        fontSizes={14}
                                        sizes={20}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">근무형태</div>
                                <div className="value">
                                    <Selector
                                        placeholder="선택"
                                        subselectClass="selector-280"
                                        setValues={setworktype}
                                        values={worktype}
                                        selectData={ConfigData.configInfo?.options?.worktype_option?.map((v) => {
                                            return { values: v, labels: v }
                                        })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">성별</div>
                                <div className="value">
                                    <Radios
                                        linetype={'radioimg'}
                                        values={gender}
                                        setvalues={setgender}
                                        namevalue={ConfigData.configInfo?.options?.gender_option?.map((v) => {
                                            return { values: v, names: v }
                                        })}
                                        fontweights={400}
                                        fontSizes={14}
                                        sizes={20}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">학력</div>
                                <div className="value">
                                    <Selector
                                        placeholder="선택"
                                        subselectClass="selector-280"
                                        setValues={seteducation}
                                        values={education}
                                        selectData={ConfigData.configInfo?.options?.education_option?.map((v) => {
                                            return { values: v, labels: v }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="title required">경력</div>
                                <div className="value">
                                    <Radios
                                        linetype={'radioimg'}
                                        values={career}
                                        setvalues={setcareer}
                                        namevalue={ConfigData.configInfo?.options?.career_option?.map((v) => {
                                            return { values: v, names: v }
                                        })}
                                        fontweights={400}
                                        fontSizes={14}
                                        sizes={20}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="title required">상세내용</div>
                                <div className="value">
                                    <textarea
                                        className="text-box"
                                        placeholder='내용을 입력해주세요.'
                                        value={desc}
                                        onChange={(e) => {
                                            setdesc(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="infoBox mt-4">
                    <div class="header-title-20">등록상태</div>
                    <Radios
                        linetype={'checkimg'}
                        values={status}
                        setvalues={setstatus}
                        namevalue={ConfigData.configInfo?.consts?.boardStatusConsts.map((v) => {
                            return { names: v.title, values: v.idx }
                        })}
                        fontweights={400}
                        fontSizes={16}
                        sizes={24}
                    />
                </div>

                <div className="infoBox mt-4">
                    <div className="confirm-box">
                        <Button
                            buttonTxt="취소"
                            onPress={() => { goBackPage(navigate); }}
                            buttonShape="gray"
                            buttonSize="large"
                        />
                        <Button
                            buttonTxt={idx ? "수정" : "완료"}
                            onPress={doneClick}
                            buttonSize="large"
                        />
                    </div>
                </div>
            </div>
        </Layout >
    )
}