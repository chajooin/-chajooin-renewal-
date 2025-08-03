const HeaderAlam = (props) => {
    return <>
        <div className="box">
            <img src={props.src} alt="" />
            <div className="num">{props.num}</div>
        </div>
    </>
}

export default HeaderAlam