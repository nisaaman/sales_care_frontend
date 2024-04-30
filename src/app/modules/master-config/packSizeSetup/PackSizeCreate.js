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
import { allowOnlyNumeric, allowOnlyNumericWithPeriod, handlePasteDisable } from '../../Util';

export default function PackSizeCreate(props) {
    const fields = {
        id: null,
        packSize: "",
        height: "",
        width: "",
        length: "",
        description: "",
        uomId: "",
        isActive: true
    }

    const [inputs, setInputs] = useState(fields);
    const [uom, setUom] = useState([]);

    useEffect(() => {
        getUomList();
        if (props.location.state) {
            //console.log(props.location.state);
            fields.id=props.location.state.data.id;
            fields.packSize=props.location.state.data.packSize;
            fields.height=props.location.state.data.height;
            fields.width=props.location.state.data.width;
            fields.length=props.location.state.data.length;
            fields.description=props.location.state.data.description;
            fields.uomId=props.location.state.data.uom.id;
            fields.isActive=props.location.state.data.isActive;
            setInputs(fields);
        }
    }, [])

    const getUomList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/unit-of-measurement/getAllActiveUOM`;
        axios.get(URL).then(response => {
            //console.log(response.data.data);
            setUom(response.data.data)
        });
    }

    // const handleChange = (event) => {
    //     let name = event.target.name;
    //     let value = event.target.value;

    //     if (event.target.type == 'checkbox') {
    //         value = event.target.checked;
    //     }

    //     setInputs(values => ({ ...values, [name]: value }));
    // }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        
        if (name === 'height' || name === 'width' ||name === 'length') {
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

    const createPackSize = () => {//alert('create..'); return;
        if (!validate()) {
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/pack-size`;
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

    const updatePackSize = () => { //alert('update..'); return;
        if (!validate()) {
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/pack-size`;
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

        if (!inputs.packSize) {
            showError('Pack Size is required.');
            return false;
        }
        if (!inputs.height) {
            showError('Height is required.');
            return false;
        }
        if (!inputs.width) {
            showError('Width is required.');
            return false;
        }
        if (!inputs.length) {
            showError('Length is required.');
            return false;
        }
        if (!inputs.uomId) {
            showError('Unit Of Measurement is required.');
            return false;
        }

        return true;
    }

    const trimData = () => {
        inputs.description = inputs.description.trim();
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <MasterConfigBreadCrum menuTitle="Pack Size" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Pack Size Setup</span>

                            <NavLink className="float-right" to="/master-config/pack-size-setup">
                                <span><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Pack Size<span className="text-danger ">*</span></label>
                                    <input id="packSize" name="packSize" type="text" className='form-control'
                                        value={inputs.packSize || ""} maxLength={9}  
                                        onKeyPress={(e) => allowOnlyNumeric(e)}
                                        onPaste={handlePasteDisable}
                                        onChange={handleChange}></input>
                                </div>
                            </div>
                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Height(inch)<span className="text-danger ">*</span></label>
                                    <input id="height" name="height" type="text" className='form-control'
                                        value={inputs.height || ""} maxLength={10}  onChange={handleChange}></input>
                                </div>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Width(inch)<span className="text-danger ">*</span></label>
                                    <input id="width" name="width" type="text" className='form-control'
                                        value={inputs.width || ""} maxLength={10}  onChange={handleChange}></input>
                                </div>
                            </div>
                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Length(inch)<span className="text-danger ">*</span></label>
                                    <input id="length" name="length" type="text" className='form-control'
                                        value={inputs.length || ""} maxLength={10} onKeyPress={(e) => allowOnlyNumericWithPeriod(e)} onChange={handleChange}></input>
                                </div>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Unit Of Measurement<i style={{ color: "red" }}>*</i></label>
                                    <select id="uomId" className='form-control' name="uomId" value={inputs.uomId || ""} onChange={handleChange}>

                                        <option value="">Please select Unit Of Measurement</option>
                                        {
                                            uom.map((uom) => (
                                                <option key={uom.id} value={uom.id}>{uom.abbreviation}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Description</label>
                                    <input id="description" name="description" type="text" className='form-control'
                                        value={inputs.description || ""} onChange={handleChange} maxLength={255}></input>
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
                                onClick={inputs.id ? updatePackSize : createPackSize}>
                                {inputs.id ? 'Update' : 'Create'}
                            </Button>

                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}