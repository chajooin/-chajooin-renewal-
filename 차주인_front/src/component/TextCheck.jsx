export const TextCheckBox = (props) => {
    let {
        name,
        checked = false,
        onChange,
        text = "",
        isIcon = false
    } = props

    return <div className='input-icon-check-box'>
        {isIcon && <label className={`label ${checked && "select"}`} htmlFor={name}></label>}
        <label className={`text ${checked && "select"}`} htmlFor={name}>{text}</label>
        <input
            id={name}
            checked={checked}
            style={{ display: "none" }}
            onChange={(e) => onChange(e.target.checked)}
            type="checkbox"
        />
    </div>
}