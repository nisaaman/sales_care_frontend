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

export default function StoreCreate(props) {
    const fields = {
        id: null,
        name: "",
        shortName: "",
        storeType: "",
        description: "",
        isActive: true
    }

    const [inputs, setInputs] = useState(fields);
    const [storeType, setStoreType] = useState([]);

    useEffect(() => {
        getStoreTypeList();
        if (props.location.state) {
            // console.log(props.location.state);
            setInputs(props.location.state.data);
        }
    }, [])

    const getStoreTypeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/store_type`;
        axios.get(URL).then(response => {
           // console.log(response.data.data);
            setStoreType(response.data.data)
        });
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        if (event.target.type == 'checkbox') {
            value = event.target.checked;
        }

        setInputs(values => ({ ...values, [name]: value }));
    }

    const createStore = () => {//alert('create..'); return;
        if (!validate()) {
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/store`;
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

    const updateStore = () => { //alert('update..'); return;
        if (!validate()) {
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/store`;
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

        if (!inputs.name) {
            showError('Name is required.');
            return false;
        }
        if (!inputs.shortName) {
            showError('Short name is required.');
            return false;
        }
        if (!inputs.storeType) {
            showError('Store Type is required.');
            return false;
        }

        if (inputs.name.length>100) {
            showError('Store Name is Too Long.');
            return false;
        }

        if (inputs.shortName.length>50) {
            showError('Short Name is Too Long.');
            return false;
        }

        if (inputs.description.length>255) {
            showError('Description is Too Long.');
            return false;
        }

        return true;
    }

    const trimData = () => {
        inputs.name = inputs.name.trim();
        inputs.description = inputs.description.trim();
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <MasterConfigBreadCrum menuTitle="Store" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Store Setup</span>

                            <NavLink className="float-right" to="/master-config/store-setup">
                                <span><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Store Name <span className="text-danger ">*</span></label>
                                    <input id="name" name="name" type="text" className='form-control'
                                        value={inputs.name || ""} onChange={handleChange}></input>
                                </div>
                            </div>
                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Short Name <span className="text-danger ">*</span></label>
                                    <input id="shortName" name="shortName" type="text" className='form-control'
                                        value={inputs.shortName || ""} onChange={handleChange}></input>
                                </div>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Store Type<i style={{ color: "red" }}>*</i></label>
                                    <select id="storeType" className='form-control' name="storeType" value={inputs.storeType || ""} onChange={handleChange}>

                                        <option value="">Please select Store Type</option>
                                        {
                                            storeType.map((store) => (
                                                <option key={store.code} value={store.code}>{store.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Description</label>
                                    <input id="description" name="description" type="text" className='form-control'
                                        value={inputs.description || ""} onChange={handleChange}></input>
                                </div>
                                {/* <div className="col-xl-6">
                                    <label className='level-title'>Status</label><br />
                                    <FormControlLabel
                                        label={inputs.isActive ? 'Active' : 'Inactive'}
                                        labelPlacement="end"
                                        control={
                                            <IOSSwitch id="isActive" name="isActive" checked={inputs.isActive}
                                                value={inputs.isActive} onChange={handleChange} />
                                        }
                                    />
                                </div> */}
                            </div>

                            <Button className="float-right" id="gotItBtn" variant="contained" color="primary"
                                onClick={inputs.id ? updateStore : createStore}>
                                {inputs.id ? 'Update' : 'Create'}
                            </Button>

                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}