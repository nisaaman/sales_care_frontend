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
import { set } from "lodash";
import { useSelector, shallowEqual } from "react-redux";
import { Route, useHistory } from "react-router-dom";

export default function ReportingManagerCreate(props) {

    let history = useHistory();
    const fields = {
        id: null,
        applicationUserId: "",
        reportingToId: "",
    }

    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const [companyChange, setCompanyChange] = useState(null);
    const [inputs, setInputs] = useState(fields);
    const [applicationUser, setApplicationUser] = useState([]);
    const [reportingTo, setReportingTo] = useState([]);
    const [userValue, setUserValue] = React.useState(null);
    const [reprotingTovalue, setReprotingToValue] = React.useState(null);
    const [id, setId] = React.useState("");
    const [readOnly, setReadOnly] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        getApplicationUserList();
        getReportingToList();
        if (props.location.state) {

        }
        if (props.location.state) {
            if (companyChange === null) {
                setCompanyChange(companyId);
            }
            else {
                if (companyChange !== companyId) {
                    history.push('/master-config/reporting-manager-setup');
                }
            }
            //console.log(props.location.state);
            setDataForUpdate(props.location.state.data);
            setId(props.location.state.data.id);
        }
    }, [companyId])

    const setDataForUpdate = (data) => {
        inputs.id = data.id;
        inputs.applicationUserId = data.applicationUser.id;
        inputs.reportingToId = data.reportingTo.id;
        setUserValue(data.applicationUser);
        setReprotingToValue(data.reportingTo);
        setInputs(inputs);
        setReadOnly(true);
    }

    const getApplicationUserList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/auth/get-all-user-company-id-without-zonal-manager/${companyId}`;
        axios.get(URL).then(response => {
            if (response.data.success === true) {
                setApplicationUser(response.data.data);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });


    }

    const getReportingToList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/auth/get-all-user-company-id/${companyId}`;
        axios.get(URL).then(response => {
            if (response.data.success === true) {
                setReportingTo(response.data.data);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);

        });
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

    const handleChangeReprotingTo = (targetValue) => {
        let name = "reportingToId";
        if (targetValue !== null) {
            let value = targetValue.id;
            setInputs(values => ({ ...values, [name]: value }));
        } else {
            setInputs(values => ({ ...values, [name]: null }));
        }
    }

    const createReportingManager = () => {//alert('create..'); return;
        if (!validate()) {
            return false;
        }
        //console.log("inputs",inputs);
        const URL = `${process.env.REACT_APP_API_URL}/api/reporting-manager`;
        axios.post(URL, inputs).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                setInputs(fields);
                setReprotingToValue(null);
                setUserValue(null);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const updateReportingManager = () => { //alert('update..'); return;
        if (!validate()) {
            return false;
        }
        //console.log("inputs",inputs);
        const URL = `${process.env.REACT_APP_API_URL}/api/reporting-manager`;
        axios.put(URL, inputs).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                setInputs(fields);
                setReprotingToValue(null);
                setUserValue(null);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const validate = () => {
        if (!inputs.applicationUserId) {
            showError('User is required.');
            return false;
        }
        if (!inputs.reportingToId) {
            showError('Reporting To is required.');
            return false;
        }
        if (inputs.applicationUserId === inputs.reportingToId) {
            showError('Can not Assign User and Reporting To same person.');
            return false;
        }

        return true;
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <MasterConfigBreadCrum menuTitle="Reporting Manager" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Reporting Manager Setup</span>

                            <NavLink className="float-right" to="/master-config/reporting-manager-setup">
                                <span><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <Autocomplete
                                        options={applicationUser}
                                        onKeyDown={getApplicationUserList}
                                        getOptionLabel={(option) => option.name+ ", "+ option.email}
                                        value={userValue}
                                        open={open}
                                        onOpen={() => !readOnly && setOpen(true)}
                                        onClose={() => setOpen(false)}
                                        disableClearable={readOnly}
                                        onChange={(event, newValue) => {
                                            handleChangeUser(newValue);
                                            setUserValue(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="User*" />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <Autocomplete
                                        options={reportingTo}
                                        onKeyDown={getReportingToList}
                                        getOptionLabel={(option) => option.name+ ", "+ option.email}
                                        value={reprotingTovalue}
                                        onChange={(event, newValue) => {
                                            handleChangeReprotingTo(newValue)
                                            setReprotingToValue(newValue)
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Reporting To*" />
                                        )}
                                    />
                                </div>
                            </div>
                            <Button className="float-right" id="gotItBtn" variant="contained" color="primary"
                                onClick={inputs.id ? updateReportingManager : createReportingManager}>
                                {inputs.id ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}