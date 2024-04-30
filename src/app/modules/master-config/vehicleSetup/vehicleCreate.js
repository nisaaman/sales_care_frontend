import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { CardBody } from "../../../../_metronic/_partials/controls";
import MasterConfigBreadCrum from "../MasterConfigBreadCrum";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from "../../../pages/IOSSwitch";
import { NavLink } from "react-router-dom";
import { showError, showSuccess } from "../../../pages/Alert";
import axios from "axios";
import { allowOnlyNumericWithPeriod } from '../../Util';


export default function VehicleCreate(props) {
    const fields = {
        id: null,
        registrationNo: "",
        vehicleHeight: "",
        vehicleWidth: "",
        vehicleDepth: "",
        vehicleType: "",
        vehicleOwnership:"",
        isActive: true
    }

    const [inputs, setInputs] = useState(fields);
    const [vehicleType, setVehicleType] = useState([]);
    const [vehicleOwnership, setVehicleOwnership] = useState([]);

    useEffect(() => {
        getAllVehicleType();
        getAllVehicleOwnership();
        if (props.location.state) {
            setInputs(props.location.state.data);
        }
    }, [])
    const getAllVehicleType = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/all-type-vehicles`;
        axios.get(URL).then(response => {
            setVehicleType(response.data.data)
        });
    }

    const getAllVehicleOwnership = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/all-ownership-vehicles`;
        axios.get(URL).then(response => {
            setVehicleOwnership(response.data.data)
        });
    }
    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;



        if (name === 'vehicleHeight' || name === 'vehicleWidth' ||name === 'vehicleDepth') {
            if (value === '') {
                setInputs(values => ({...values, [name]: value}));
            } else if (Number(value) > -1) {
                let v = value.split(".")[1];
                if (v === undefined) {
                    setInputs(values => ({...values, [name]: value.trim()}));
                } else if (v.length < 3) {
                    setInputs(values => ({...values, [name]: value}));
                }
            }
        }
        else{
            if (event.target.type == 'checkbox') {
                value = event.target.checked;
            }
    
            setInputs(values => ({ ...values, [name]: value }));
        }
    }

    const createVehicle = () => {//alert('create..'); return;
        if (!validate()) {
            return false;
        }
        console.log(inputs);

        const URL = `${process.env.REACT_APP_API_URL}/api/vehicle`;
        axios.post(URL, inputs).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                setInputs(fields);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const updateVehicle = () => { //alert('update..'); return;
        if (!validate()) {
            return false;
        }
        console.log(inputs);

        const URL = `${process.env.REACT_APP_API_URL}/api/vehicle`;
        axios.put(URL, inputs).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
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

        if (!inputs.registrationNo) {
            showError('Registration No is required.');
            return false;
        }

        if (!inputs.vehicleType) {
            showError('Vehicle Type is required.');
            return false;
        }

        if (!inputs.vehicleOwnership) {
            showError('Vehicle Ownership is required.');
            return false;
        }

        if (!inputs.vehicleHeight) {
            showError('Vehicle Height is required.');
            return false;
        }

        // if (!inputs.vehicleWidth) {
        //     showError('Vehicle Width is required.');
        //     return false;
        // }


        if (!inputs.vehicleWidth) {
            showError('Vehicle Width is required.');
            return false;
        }

        if (!inputs.vehicleDepth) {
            showError('Vehicle Depth is required.');
            return false;
        }
        console.log(inputs.registrationNo.length);

        if (inputs.registrationNo.length > 100) {
            showError('Vehicle Registration No is Too Long.');
            return false;
        }

        if (inputs.vehicleHeight.length > 255) {
            showError('Vehicle Height is Too Long.');
            return false;
        }
        if (inputs.vehicleWidth.length > 255) {
            showError('Vehicle Width is Too Long.');
            return false;
        }

        if (inputs.vehicleDepth.length > 255) {
            showError('Vehicle Depth is Too Long.');
            return false;
        }

        if (isNaN(inputs.vehicleHeight)) {
            showError("Invalid Height !!.");
            return false;
        }
        if (isNaN(inputs.vehicleWidth)) {
            showError("Invalid Width !!.");
            return false;
        }
        if (isNaN(inputs.vehicleDepth)) {
            showError("Invalid Depth !!.");
            return false;
        }


        return true;
    }

    const trimData = () => {
        console.log("inputs.vehicleHeight=", typeof inputs.vehicleHeight);
        inputs.registrationNo = inputs.registrationNo.trim();
        inputs.vehicleHeight = inputs.vehicleHeight;
        inputs.vehicleWidth = inputs.vehicleWidth;
        inputs.vehicleDepth = inputs.vehicleDepth;

    }

    const handlePaste = (e) => {
        e.preventDefault()
        return false;
    }

    const allowOnlyNumericWithPeriodWhenPaste = (e) => {

        var t = e.value;
        e.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
    }
    const validateFloatKey = (e) => {

        let regEx2 = /^[0-9]*\.?\d{0,1}$/;

        if (regEx2.test(e.target.value)) {

        } else {
            e.preventDefault();
        }
    }



    return (
        <>
            {/* BREAD CRUM ROW */}
            <MasterConfigBreadCrum menuTitle="Vehicle" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Vehicle Setup</span>

                            <NavLink className="float-right" to="/master-config/vehicle-setup">
                                <span><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Registration No <span className="text-danger ">*</span></label>
                                    <input id="registrationNo" name="registrationNo" type="text" className='form-control'
                                        value={inputs.registrationNo || ""} maxLength={100} onChange={handleChange}></input>
                                </div>

                                <div className='col-xl-6'>
                                    <label className='level-title'>Vehicle Type<i style={{ color: "red" }}>*</i></label>
                                    <select id="vehicleType" className='form-control' name="vehicleType"
                                        value={inputs.vehicleType || ""}
                                        onChange={(event) => handleChange(event)}>
                                        <option value="">Please select Vehicle Type</option>
                                        {
                                            vehicleType.map((v) => (//
                                                <option key={v.code} value={v.code}>{v.name}</option>
                                            ))}
                                    </select>
                                </div>


                            </div>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Height<span className="text-danger ">*</span></label>
                                    <input id="vehicleHeight" name="vehicleHeight" type="text" className='form-control'
                                        value={inputs.vehicleHeight || ""} maxLength={10} onChange={handleChange} 
                                        //onChange={handleOnChange}
                                       // onChange={(event) => handleOnChange(event)}
                                        ></input>
                                </div>

                                <div className='col-xl-6'>
                                    <label className='level-title'>Width<span className="text-danger ">*</span></label>
                                    <input id="vehicleWidth" name="vehicleWidth" type="text" className='form-control'
                                        value={inputs.vehicleWidth || ""} maxLength={10} onKeyPress={(e) => validateFloatKey(e)} onPaste={(e) => handlePaste(e)} onChange={handleChange}></input>
                                </div>
                            </div>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Depth<span className="text-danger ">*</span></label>
                                    <input id="vehicleDepth" name="vehicleDepth" type="text" className='form-control'

                                        value={inputs.vehicleDepth || ""} maxLength={10} onKeyPress={(e) => validateFloatKey(e)} onPaste={(e) => handlePaste(e)}
                                        onChange={handleChange}></input>
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

                            <div className='mt-5 row'>                            
                                <div className='col-xl-6'>
                                    <label className='level-title'>Vehicle Ownership<i style={{ color: "red" }}>*</i></label>
                                    <select id="vehicleOwnership" className='form-control' name="vehicleOwnership"
                                        value={inputs.vehicleOwnership || ""}
                                        onChange={(event) => handleChange(event)}>
                                        <option value="">Please select Vehicle Ownership</option>
                                        {
                                            vehicleOwnership.map((v) => (//
                                                <option key={v.code} value={v.code}>{v.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <Button className="float-right" id="gotItBtn" variant="contained" color="primary"
                                onClick={inputs.id ? updateVehicle : createVehicle}>
                                {inputs.id ? 'Update' : 'Create'}
                            </Button>

                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}