import React, { useEffect, useState, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { open, close } from '../redux/popupSlice';

import consts from '../libs/consts';

import { regFileDoc, regFileImage } from '../utils/utils';
import { DefaultImg } from './DefaultImg';

export default function InputFileMulti(props) {

    const dispatch = useDispatch();

    const {
        className,
        placeholder,
        type,
        name,
        maxlength = 10,
        value,
        setValue,
        valid,
        label,
        error,
        success,
        onDelete,
        readOnly,
        onBlur,
        withButton,
        withButtonPress,
        multiple
    } = props;

    const fileInput = useRef();
    const [detailImageUrl, setDetailImageUrl] = useState([]);

    const handleChange = async (e) => {

        var files = e.target.files;
        // console.log(files);
        if (files.length < 1) return;
        if (files.length > maxlength) {
            dispatch(
                open({
                    content: "한번에 " + maxlength + "개까지 등록 가능합니다.",
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    onPress: () => { dispatch(close()); }
                })
            );
            return;
        }

        // console.log("이미지 개수: ", (value.length + files.length))
        if ((value.length + files.length) > 10) {
            dispatch(
                open({
                    content: "이미지 최대 갯수는 10개 입니다.",
                    onCancelPress: false,
                    titleviewer: false,
                    button: "확인",
                    onPress: () => { dispatch(close()); }
                })
            );
            return
        }

        var reg = "";
        var msg = "";
        var file_arr = [];
        var file_url_arr = [];
        var cker = true;

        if (valid === 'image') {
            reg = regFileDoc;
            msg = "이미지";
        } else if (valid === 'doc') {
            reg = regFileImage;
            msg = "문서";
        }

        for (var i = 0; i < files.length; i++) {
            var file = files[i]
            if (!file.name.toLowerCase().match(reg)) {
                //fileInput.current.value = "";
                //setValue([]);
                //setDetailImageUrl([]);
                dispatch(
                    open({
                        message: msg + " 파일만 등록 가능합니다.",
                    })
                );
                cker = false;
                return false;
            }
        }

        if (cker) {
            let files_url = Array.from(files).map(file => {

                let reader = new FileReader();

                // Create a new promise
                return new Promise(resolve => {

                    let fn = file.name.split('.');

                    // Resolve the promise after reading file
                    reader.onload = () => {
                        resolve({
                            ext: fn[fn.length - 1],
                            base: reader.result
                        });
                    }

                    // Reade the file as a text
                    reader.readAsDataURL(file);

                });

            });

            let res = await Promise.all(files_url);

            setValue([...value, ...res]);
        }

    };

    // set file reader function
    const fileDelete = (i) => {

        //fileInput.current.value = "";
        //console.log(i);
        let row = value?.find((item, index) => index === i);

        setValue(value?.filter((item, index) => index !== i));

        if (onDelete) {
            if (row?.file_path)
                onDelete(prev => [...prev, row?.file_path]);
            else if (typeof row == "string")
                onDelete(row);
        }
    };

    return (
        <div className="input_box">

            {label && <p className="input_label">{label}</p>}
            {/* <p className="input_label_help">아래의 [카메라] 버튼을 눌러 추가해 주세요.</p> */}

            <div className="input_section_multi">
                <label className="input_file_label_multi" htmlFor={name}>
                    <p className='bolds fontsize12'>{value.length}</p>/{maxlength}
                </label>
                <input
                    ref={fileInput}
                    type={type}
                    name={name}
                    id={name}
                    onChange={handleChange}
                    multiple />
                {value?.map((x, i) => {
                    let imgUrl = ""
                    if (x?.file_path) {
                        imgUrl = consts.s3url + x?.file_path
                    } else if (typeof x == "string") {
                        imgUrl = consts.s3url + x
                    } else {
                        imgUrl = x?.base
                    }

                    return (
                        <div key={i} className="input_multi_preview">
                            <img src={imgUrl} onError={DefaultImg} />
                            <button type="button" className="img_delete_btn" onClick={() => fileDelete(i)} />
                        </div>
                    )
                })}

            </div>

            {error &&
                <p className="input_error">{error}</p>
            }
            {success &&
                <p className="input_success">{success}</p>
            }
        </div>
    )
}