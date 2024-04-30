import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { CardBody } from "../../../../_metronic/_partials/controls";
import MasterConfigBreadCrum from "../MasterConfigBreadCrum";
import { NavLink } from "react-router-dom";
import { showError, showSuccess } from "../../../pages/Alert";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { useSelector, shallowEqual } from "react-redux";
import { Route, useHistory } from "react-router-dom";

export default function LocationManagerCreate(props) {

    let history = useHistory();
    const fields = {
        id: null,
        companyId: "",
        locationId: "",
        locationTypeId: "",
        applicationUserId: "",
    }

    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const companies = useSelector((state) => state.auth.user.companies, shallowEqual);
    const [inputs, setInputs] = useState(fields);
    const [companyChange, setCompanyChange] = useState(null);
    const [companyName, setCompanyName] = useState("");
    const [applicationUser, setApplicationUser] = useState([]);
    const [locationType, setLocationType] = useState([]);
    const [location, setLocation] = useState([]);
    const [userValue, setUserValue] = React.useState(null);

    useEffect(() => {
        setInputs(fields);
        if (props.location.state) {
            if (companyChange === null) {
                setCompanyChange(companyId);
            }
            else {
                if (companyChange !== companyId) {
                    history.push('/master-config/location-manager-setup');
                }
            }
            setDataForUpdate(props.location.state.data);
        }

        getCompanyName();
        getApplicationUserList();
        getLocationType();
    }, [companyId])

    const getCompanyName = () => {
        const index = companies.findIndex(obj => obj.id == companyId)
        let companyName = companies[index].name;
        setCompanyName(companyName);
    }

    const setDataForUpdate = (data) => {
        inputs.id = data.id;
        inputs.companyId = data.company.id;
        inputs.locationId = data.location.id;
        inputs.locationTypeId = data.location.locationType.id;
        inputs.applicationUserId = data.applicationUser.id;

        setUserValue(data.applicationUser);

        setInputs(inputs);
        getLocationType(data.company.id);
        getLocation(data.location.locationType.id);
        document.getElementById("locationTypeId").disabled = true;
        document.getElementById("locationId").disabled = true;
        //console.log(data);
    }

    const getLocationType = () => {
        setLocation([]);
        const URL = `${process.env.REACT_APP_API_URL}/api/location-type/get-location-type-by-company-id/${companyId}`;
        axios.get(URL).then(response => {
            //console.log(response.data.data);
            setLocationType(response.data.data);
        });
    }

    const getLocation = (locationTypeId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location/get-all-by-location-type/${locationTypeId}`;
        axios.get(URL).then(response => {
            //console.log(response.data.data);
            setLocation(response.data.data);
        });
    }

    const getApplicationUserList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/auth/get-all-user-company-id/${companyId}`;
        axios.get(URL).then(response => {
            setApplicationUser(response.data.data);
        });
    }

    const handleChange = (event) => {

        let name = event.target.name;
        let value = event.target.value;

        if (event.target.name === "locationTypeId") {
            setLocation([]);
            inputs.locationId = "";
            if (value !== "" && value !== undefined && value !== null) {
                setInputs(values => ({ ...values, [name]: value }));
                getLocation(event.target.value);
            }

        } if (event.target.name === "locationId") {
            if (value !== "" && value !== undefined && value !== null) {
                setInputs(values => ({ ...values, [name]: value }));
            }
        }
    }

    const handleChangeUser = (targetValue) => {
        let name = "applicationUserId";
        if (targetValue !== null) {
            let value = targetValue.id;
            setInputs(values => ({ ...values, [name]: value }));
        } else {
            setInputs(values => ({ ...values, [name]: null }));
        }
    }

    const createLocationManager = () => {//alert('create..'); return;
        if (!validate()) {
            return false;
        }

        let obj = {};
        obj.companyId = companyId;
        obj.locationId = inputs.locationId;
        obj.locationTypeId = inputs.locationTypeId;
        obj.applicationUserId = inputs.applicationUserId;

        //console.log("obj", obj);

        const URL = `${process.env.REACT_APP_API_URL}/api/location-manager-map`;
        axios.post(URL, obj).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                setInputs(fields);
                setUserValue(null);
                setLocation([]);
                getApplicationUserList();
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const updateLocationManager = () => { //alert('update..'); return;
        if (!validate()) {
            return false;
        }
        //console.log("inputs", inputs);
        const URL = `${process.env.REACT_APP_API_URL}/api/location-manager-map`;
        axios.put(URL, inputs).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                setInputs(fields);
                setUserValue(null);
                setLocation([]);
                getApplicationUserList();
                document.getElementById("locationTypeId").disabled = false;
                document.getElementById("locationId").disabled = false;
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const validate = () => {

        if (inputs.locationTypeId === "" || inputs.locationTypeId === undefined || inputs.locationTypeId === null) {
            showError('Location Type is required.');
            return false;
        }
        if (inputs.locationId === "" || inputs.locationId === undefined || inputs.locationId === null) {
            showError('Location is required.');
            return false;
        }
        if (inputs.applicationUserId === "" || inputs.applicationUserId === undefined || inputs.applicationUserId === null) {
            showError('User is required.');
            return false;
        }

        return true;
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <MasterConfigBreadCrum menuTitle="Location Manager" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Location Manager Setup</span>

                            <NavLink className="float-right" to="/master-config/location-manager-setup">
                                <span><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>

                                    <label className='level-title'>Company</label>
                                    <input id="companyId" name="companyId" type="text" className='form-control'
                                        value={companyName || ""} disabled >
                                    </input>
                                </div>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Location Type<span className="text-danger ">*</span></label>
                                    <select id="locationTypeId" className='form-control' name="locationTypeId"
                                        value={inputs.locationTypeId || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="">Please select Location Type</option>
                                        {
                                            locationType.map((lt) => (
                                                <option key={lt.id} value={lt.id}>{lt.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Location<span className="text-danger ">*</span></label>
                                    <select id="locationId" className='form-control' name="locationId"
                                        value={inputs.locationId || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="">Please select Location</option>
                                        {
                                            location.map((l) => (
                                                <option key={l.id} value={l.id}>{l.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <Autocomplete
                                        options={applicationUser}
                                        onKeyDown={getApplicationUserList}
                                        getOptionLabel={(option) => option.name + ", "+ option.email}
                                        value={userValue}
                                        onChange={(event, newValue) => {
                                            handleChangeUser(newValue);
                                            setUserValue(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="User" />
                                        )}
                                    />
                                </div>
                            </div>
                            <Button className="float-right" id="gotItBtn" variant="contained" color="primary"
                                onClick={inputs.id ? updateLocationManager : createLocationManager}>
                                {inputs.id ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}