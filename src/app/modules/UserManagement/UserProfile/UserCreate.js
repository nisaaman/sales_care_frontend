import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { CardBody } from "../../../../_metronic/_partials/controls";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from "../../../pages/IOSSwitch";
import { NavLink } from "react-router-dom";
import { showError, showSuccess } from "../../../pages/Alert";
import axios from "axios";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { validateEmail } from '../../Util';
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import UserBreadCrum from "../bread-crum/UserBreadCrum";
import { shallowEqual, useSelector } from "react-redux"

export default function UserCreate(props) {
    const fields = {
        id: null,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        referenceNo: "",
        departmentId: "",
        designationId: "",
        filePath: "",
        isActive: true
    }

    const [inputs, setInputs] = useState(fields);
    const [department, setDepartment] = useState([]);
    const [designation, setDesignation] = useState([]);
    const [value, setValue] = useState('');
    const [profileImg, setProfileImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));
    const [fileList, setFileList] = useState([]);
    const [imageText, setImageText] = useState('');
    const [id, setId] = useState('');
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);

    useEffect(() => {
        getDesignationList();
        getDepartmentList();
        setValue("");
        if (props.location.state) {
            //console.log("data345",props.location.state.data.id);
            getUserUpdateInfo(props.location.state.data.id);
            setId(props.location.state.data.id);

        }
    }, [])

    const getUserUpdateInfo = (id) => {

        const URL = `${process.env.REACT_APP_API_URL}/auth/application-user-details-with-profile-image/${id}`;
        axios.get(URL).then(response => {
            //console.log(response.data.data);

            setInputs(response.data.data);
            setValue(response.data.data.mobile);
            document.getElementById("email").disabled = true;
            //document.getElementById("passwordDivId").style.display = 'none';
            //document.getElementById("confirmPasswordDivId").style.display = 'none';
        });
    }

    const getDepartmentList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/department/getAllActiveDepartment`;
        axios.get(URL).then(response => {
            //console.log(response.data.data);
            setDepartment(response.data.data)
        });
    }

    const getDesignationList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/designation/getAllActiveDesignation`;
        axios.get(URL).then(response => {
            //console.log(response.data.data);
            setDesignation(response.data.data)
        });
    }

    const imageHandler = (e) => {

        var x = document.getElementById("demoImg");
        x.style.display = "block";

        setImageText('');

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setProfileImg(reader.result);
            }
        }

        reader.readAsDataURL(e.target.files[0])

        const tempFile = [...fileList]// fileList array
        var input = document.getElementById('userImage');
        if (input.files.length < 1)
            return false;

        let count = 0;
        for (var i = 0; i < input.files.length; i++) {
            if (fileValidation(input.files.item(i))) {
                tempFile.push(input.files.item(i));

            } else {
                count++;
                continue;
            }
        }

        if (count > 0) {
            showError('File dose not supported due to file extention or file size.');
        }
        inputs.filePath="";

        setFileList(tempFile);
    }

    const fileValidation = (file) => {
        const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.png|.jpeg)$/;
        const isCorrectFormat = regex.test(file.name.toLowerCase());
        const fileSize = 1; //MB

        if (!isCorrectFormat) {
            return false;
        }

        if ((file.size / 1024 / 1024) > fileSize) {
            return false;
        }

        return true;
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        if (event.target.type == 'checkbox') {
            value = event.target.checked;
        }

        setInputs(values => ({ ...values, [name]: value }));

        if (inputs.id === userId && name==='isActive' && value===false) {
            value = true;
            showError("Logged in user can't be Inactive");
            return false;
        }
    }

    const createUser = () => {//alert('create..'); return;

        if (!validate()) {
            return false;
        }

        inputs.mobile = value;

        let formData = new FormData();

        formData.append("applicationUserDto", new Blob([JSON.stringify(inputs)], { type: "application/json" }));

        fileList.forEach(file => {
            formData.append("profileImage", file);
        })

        //console.log("output===", inputs);

        const URL = `${process.env.REACT_APP_API_URL}/auth`;
        axios.post(URL, formData, { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);

                setValue("");
                //inputs.mobile="";
                setProfileImg(toAbsoluteUrl("/images/copmanylogo.png"));
                setInputs(fields);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const updateUser = () => { //alert('update..'); return;

        if (!validate()) {
            return false;
        }
        inputs.mobile = value;
        inputs.filePath="";
        let formData = new FormData();

        formData.append("applicationUserDto", new Blob([JSON.stringify(inputs)], { type: "application/json" }));

        fileList.forEach(file => {
            formData.append("profileImage", file);
        })


        const URL = `${process.env.REACT_APP_API_URL}/auth`;
        axios.put(URL, formData, { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                setValue("");
                setProfileImg(toAbsoluteUrl("/images/copmanylogo.png"));
                setInputs(fields);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const validate = () => {
        trimData();

        if (!inputs.name) {
            showError('Name is required.');
            return false;
        }
        if (inputs.name.length>100) {
            showError('Name is Too Large.');
            return false;
        }
        if (value === null || value === undefined || value === "") {
            showError('Contact No is required.');
            return false;
        }
        if (value.length>20) {
            showError('contact No is Too Large.');
            return false;
        }
        if (!inputs.departmentId) {
            showError('Department is required.');
            return false;
        }

        if (!inputs.designationId) {
            showError('Designation is required.');
            return false;
        }
        if (id === "" || id === undefined || id === null) {
            if (!inputs.email) {
                showError('Email is required.');
                return false;
            } else {
                if (inputs.email.length>50) {
                    showError('Email is Too Large.');
                    return false;
                }
                if (!validateEmail(inputs.email)) {
                    showError("Invalid Email.");
                    return false;
                }
            }
        }
        if (!inputs.password) {
            showError('Password is required.');
            return false;
        }
        if (inputs.password.length>100) {
            showError('Password is Too Large.');
            return false;
        }

        if (!inputs.confirmPassword) {
            showError('Confirm password is required.');
            return false;
        }

        if(inputs.password !== inputs.confirmPassword){
            showError("Confirm password doesn't match to password!");
            return false;
        }
        // if (id === "" || id === undefined || id === null) {
        //     if (!inputs.password) {
        //         showError('Password is required.');
        //         return false;
        //     }
        //     if (inputs.password.length>100) {
        //         showError('Password is Too Large.');
        //         return false;
        //     }

        //     if (!inputs.confirmPassword) {
        //         showError('Confirm password is required.');
        //         return false;
        //     }

        //     if(inputs.password !== inputs.confirmPassword){
        //         showError("Confirm password doesn't match to password!");
        //         return false;
        //     }
        // }

        return true;
    }

    const trimData = () => {
        inputs.name = inputs.name.trim();
        inputs.email = inputs.email.trim();
        if (inputs.password) {
            inputs.password = inputs.password.trim(); 
        }
        
        // if (id === "" || id === undefined || id === null) {
        //     inputs.password = inputs.password.trim();
        // }

        inputs.referenceNo = inputs.referenceNo.trim();
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <UserBreadCrum menuTitle="User" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">{id ? "User Update" : "User Create"}</span>

                            <NavLink className="float-right" to="/user-management/profile-setup">
                                <span><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink>

                            <div className='row'>
                                <div className='col-lg-12' style={{ textAlign: "center" }}>
                                    <div className='row'>
                                        <div className='col-lg-12' style={{ textAlign: "center", marginBottom: "50px" }}>
                                            <div className="image-input image-input-circle" data-kt-image-input="true">
                                                <div className="image-input-wrapper w-125px h-125px"></div>
                                                <label className="btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow"
                                                    data-kt-image-input-action="change"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-dismiss="click"
                                                    title="Change Profile Picture">
                                                    <div id="demoImg">
                                                        <img className="image-input image-input-circle"

                                                            src={inputs.filePath === undefined || inputs.filePath === "" || inputs.filePath === null ? profileImg : `data:image/png;base64,${inputs.filePath}`}
                                                            //src={profileImg}
                                                            style={{ width: "150px", height: "150px", textAlign: "center" }} alt='Distributor’s Picture' />
                                                    </div>

                                                    <div id='imgUploadDiv1' className='imgUploadDiv'>
                                                        <i className="bi bi-pencil-fill fs-7" style={{ fontSize: "12px", padding: "7px", color: "white" }}></i>
                                                    </div>
                                                    <input id="userImage" type="file" name="userImage"
                                                        onChange={imageHandler}
                                                        accept=".png, .jpg, .jpeg" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-5'>
                                <div className='col-lg-12' style={{ textAlign: "center" }}>
                                    <label className='level-title'>Upload New Profile Picture</label>
                                </div>
                            </div>

                            <div className='mt-10 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Name <span className="text-danger ">*</span></label>
                                    <input id="name" name="name" type="text" className='form-control'
                                        value={inputs.name || ""} onChange={handleChange}></input>
                                </div>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Contact No<span className="text-danger ">*</span></label>
                                    <PhoneInput
                                        international
                                        countryCallingCodeEditable={false}
                                        defaultCountry="BD"
                                        value={inputs.mobile || ""}
                                        className='form-control'
                                        onChange={setValue}
                                    />
                                </div>

                            </div>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Department <span className="text-danger ">*</span></label>
                                    <select id="departmentId" className='form-control' name="departmentId" value={inputs.departmentId || ""} onChange={handleChange}>

                                        <option value="">Please select Department</option>
                                        {
                                            department.map((dept) => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                    </select>
                                </div>

                                <div className='col-xl-6'>
                                    <label className='level-title'>Designation<span className="text-danger ">*</span></label>
                                    <select id="designationId" className='form-control' name="designationId" value={inputs.designationId || ""} onChange={handleChange}>

                                        <option value="">Please select Designation</option>
                                        {
                                            designation.map((des) => (
                                                <option key={des.id} value={des.id}>{des.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className='mt-5 row' >
                                <div className='col-xl-6'>
                                    <label className='level-title'>Email<span className="text-danger ">*</span></label>
                                    <input id="email" name="email" type="text" className='form-control'
                                        value={inputs.email || ""} onChange={handleChange}></input>
                                </div>
                                <div className='col-xl-3' id='passwordDivId'>
                                    <label className='level-title'>Password <span className="text-danger ">*</span></label>
                                    <input id="password" name="password" type="password" className='form-control'
                                        value={inputs.password || ""} onChange={handleChange}></input>
                                </div>

                                <div className='col-xl-3' id='confirmPasswordDivId'>
                                    <label className='level-title'>Confirm Password <span className="text-danger ">*</span></label>
                                    <input id="confirmPassword" name="confirmPassword" type="password" className='form-control'
                                        value={inputs.confirmPassword || ""} onChange={handleChange}></input>
                                </div>

                            </div>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Reference No</label>
                                    <input id="referenceNo" name="referenceNo" type="text" className='form-control'
                                        value={inputs.referenceNo || ""} onChange={handleChange}></input>
                                </div>
                                <div className="col-xl-6">
                                    <label className='level-title'>Status</label><br />
                                    <FormControlLabel
                                        label={inputs.isActive ? 'Active' : 'Inactive'}
                                        labelPlacement="end"
                                        control={
                                            <IOSSwitch id="isActive" name="isActive" checked={inputs.isActive}
                                                value={inputs.isActive} onChange={handleChange} />
                                        }
                                    />
                                </div>
                            </div>

                            <Button className="float-right" id="gotItBtn" variant="contained" color="primary"
                                onClick={inputs.id ? updateUser : createUser}>
                                {inputs.id ? 'Update' : 'Create'}
                            </Button>

                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}