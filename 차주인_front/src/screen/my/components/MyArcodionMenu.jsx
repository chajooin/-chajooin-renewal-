import React, { useState, useEffect, useRef } from 'react';

const ArcodianMenu = (props) => {
    let {
        beforeComponet,
        title = "title",
        subStr = "",
        contents,
        children,
    } = props

    const arcoContentsRef = useRef(null);
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        console.log()
    }, [checked])

    return <div className="accordion-box">
        <div className="arc-menu-box" onClick={() => { checked ? setChecked(false) : setChecked(true) }}>
            <div className="title">
                {beforeComponet}
                <div className="text textcut_online">{title}</div>
            </div>
            {subStr ?
                <div className='date'>{subStr}</div> :
                checked ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.4114 6.07806C9.73683 5.75263 10.2645 5.75263 10.5899 6.07806L16.4232 11.9114C16.7487 12.2368 16.7487 12.7645 16.4232 13.0899C16.0978 13.4153 15.5702 13.4153 15.2447 13.0899L10.0007 7.84583L4.75657 13.0899C4.43114 13.4153 3.9035 13.4153 3.57806 13.0899C3.25263 12.7645 3.25263 12.2368 3.57806 11.9114L9.4114 6.07806Z" fill="#666666" />
                    </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.57806 6.91009C3.9035 6.58466 4.43114 6.58466 4.75657 6.91009L10.0007 12.1542L15.2447 6.91009C15.5702 6.58466 16.0978 6.58466 16.4232 6.91009C16.7487 7.23553 16.7487 7.76317 16.4232 8.0886L10.5899 13.9219C10.2645 14.2474 9.73683 14.2474 9.4114 13.9219L3.57806 8.0886C3.25263 7.76317 3.25263 7.23553 3.57806 6.91009Z" fill="#666666" />
                    </svg>}
        </div>

        <div style={{ height: checked ? arcoContentsRef.current?.offsetHeight || 0 : 0 }} className={`arc-contents-box`}>
            <div ref={arcoContentsRef} className="contents">
                {children}
            </div>
        </div>
    </div>
}

export default ArcodianMenu