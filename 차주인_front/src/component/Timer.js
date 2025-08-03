import React, {useRef, useState, useEffect} from 'react';

export default function Timer({defaultTime, defaultMin, defaultSec, timeOut}) {

    const [min, setMin] = useState(defaultMin);
    const [sec, setSec] = useState(defaultSec);
    const time = useRef(defaultTime);
    const timerId = useRef(null);

    useEffect(() => {

        timerId.current = setInterval(() => {
            setMin(parseInt(time.current / 60) < 10 ? "0"+parseInt(time.current / 60) : parseInt(time.current / 60));
            setSec(time.current % 60 < 10 ? "0"+time.current % 60 : time.current % 60);
            time.current -= 1;
        }, 1000);

        return () => clearInterval(timerId.current);
    }, []);

    useEffect(() => {
        // 만약 타임 아웃이 발생했을 경우
        if (time.current <= 0) {
            // console.log("타임 아웃");
            clearInterval(timerId.current);
            // dispatch event
            timeOut(false);
        }
    }, [sec]);

    return (
        <span className="timer">{min}:{sec}</span>
    );
}