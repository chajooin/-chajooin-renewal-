import React, { useEffect, useState, useRef, useId } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { clickImg, regFileDoc, regFileImage, regFilePdf, regFileExcel } from '../utils/utils';

export default function InputFile(props) {

    const dispatch = useDispatch();

    const {
        className,
        placeholder,
        subPlaceholder,
        type,
        name,
        maxlength,
        value,
        idx,
        setValue,
        setExt,
        setFileName,
        defaultFileName,
        onChange,
        fileNameView = true,
        valid,
        label,
        labelLeft,
        labelType = 'image',
        error,
        setError,
        success,
        readOnly,
        onBlur,
        withButton,
        withButtonPress,
        style,
        down = false,
        fileDeleteButton = false,
        onDelete,
        imgStyle,
        buttonStyle = {},
        backGray = false,
        disabled = false
    } = props;

    const fileInput = useRef();
    const [cker, setCker] = useState(false);
    const [file_name, setfile_name] = useState("");

    const id = useId();

    useEffect(() => {

        setfile_name(defaultFileName)

    }, [defaultFileName]);

    const handleChange = ({ file }) => {

        // if (setError) setError('');

        var reg = "";
        var msg = "";

        if (valid === 'image') {
            reg = regFileImage;
            msg = "이미지";
        } else if (valid === 'doc') {
            reg = regFileDoc;
            msg = "문서";
        } else if (valid === 'pdf') {
            reg = regFilePdf;
            msg = "문서";
        } else if (valid === 'excel') {
            reg = regFileExcel;
            msg = "문서";
        }

        if (file.name.toLowerCase().match(reg)) {
            // console.log(file);
            setfile_name(file.name);

            if (setFileName) setFileName(file.name);

            let reader = new FileReader();
            reader.onload = function () {

                let fn = file.name.split('.');

                if (onChange) {

                    onChange(idx, name, {
                        base: reader.result,
                        ext: fn[fn.length - 1]
                    });

                } else {
                    setValue({
                        base: reader.result,
                        ext: fn[fn.length - 1]
                    });
                    setCker(true);

                    if (setExt) {
                        setExt(fn[fn.length - 1]);
                    }
                }

            };
            reader.readAsDataURL(file);

        } else {
            fileInput.current.value = "";
            setError("파일 형식이 올바르지않습니다.")
            setCker(false);

            if (!onChange) {
                setValue("");
                setfile_name("");

                if (setFileName) setFileName("");
                if (setExt) setExt("");
            }
        }

    };

    // set file reader function
    const fileDelete = (e) => {

        e.stopPropagation();

        if (!readOnly) {
            fileInput.current.value = "";
            setCker(false);

            if (onChange) {
                onChange(idx, name, '');
            } else {
                setValue("");
            }
        }

    };

    return (
        <div className="input_box" style={style}>

            {label && <p className="input_label">{label}</p>}

            <div className={`input_file_section ${backGray && "back_gray"}`}>
                {labelType === 'image' ? (
                    <label className={"input_file_label"} style={imgStyle} htmlFor={!readOnly ? id : ""}>
                        {value?.base ? (
                            <img className={'input_preview_img'} src={value?.base} alt={"img"} />
                        ) : value ? (
                            <img className={'input_preview_img'} src={value} alt={"img"} />
                        ) : (
                            labelType === 'text' ? (
                                <p>파일선택</p>
                            ) : (<>
                                {placeholder ? <p className='inpu_file_placeholder'>{placeholder}{subPlaceholder && <><br />{subPlaceholder}</>}</p> : { label }}
                            </>)
                        )}

                    </label>
                ) : (
                    <div className="input_file_label_doc">
                        {!readOnly && (
                            <label className={"file_label_btn"} htmlFor={id}>
                                파일찾기
                            </label>
                        )}

                        <div className='input_file_label_doc_names' style={buttonStyle}>
                            {value?.base ? (
                                <p onClick={() => valid === 'image' ? clickImg(value?.base) : {}}>{file_name}</p>
                            ) : value ? (
                                <p onClick={() => valid === 'image' ? clickImg("/" + value) : {}}>{value}</p>
                            ) : (
                                <p>파일없음</p>
                            )}
                        </div>
                    </div>
                )}

                {value && (
                    <button className="input_delete_button" onClick={fileDelete} >
                        <img src="/images/icons/x-icon.svg" />
                    </button>
                )}

                <input
                    ref={fileInput}
                    type={type}
                    name={name}
                    id={id}
                    onChange={({ target: { files } }) => {
                        if (files.length) {
                            handleChange({
                                file: files[0]
                            })
                        }
                    }}
                    disabled={disabled} />
            </div>

            {
                error &&
                <p className="input_error animate__animated animate__headShake">{error}</p>
            }
            {
                success &&
                <p className="input_success">{success}</p>
            }
        </div >
    )
}