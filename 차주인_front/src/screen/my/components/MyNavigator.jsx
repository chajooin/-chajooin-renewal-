const MyNavigator = (props) => {
    let {
        list = [],
    } = props;
    /*
    list 객체 구조
    { title: "마이", isSelect: false, onClick: ()=>{}) }
    */
    return <div className='my-nav-contain'>
        {list.map((v, i) => {
            return <>
                <div key={`mnv-i-${i}`}
                    className={`title ${v.isSelect && "select"} ${v.onClick && "link"}`}
                    onClick={() => { v.onClick && v.onClick() }}
                >
                    {v.title}
                </div>
                {i < list.length - 1 && <img key={`mnv-img-${i}`} src="/images/icons/nav-right.svg" alt="nav-right" />}
            </>
        })}
    </div >
}

export default MyNavigator