import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { CardBody } from "../../../../_metronic/_partials/controls";
import { ActionsColumnFormatter } from "../ActionsColumnFormatter";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from "../../../pages/IOSSwitch";
import { NavLink } from "react-router-dom";
import { showError, showSuccess } from "../../../pages/Alert";
import axios from "axios";
import ApprovalPathBreadCrum from "../bread-crum/ApprovalPathBreadCrum";

export default function MultilayerApprovalPathCreate(props) {
    const fields = {
        id: null,
        companyId: "",
        approvalStepFeatureMapId: "",
        approvalActor: "",
        approvalActorId: "",
        approvalFeature: ""
    }

    const [inputs, setInputs] = useState(fields);
    const [company, setCompany] = useState([]);
    const [approvalStepFeature, setApprovalStepFeature] = useState([]);
    const [approvalStep, setApprovalStep] = useState([]);
    const [approvalActor, setApprovalActor] = useState([]);
    const [actor, setActor] = useState([]);

    useEffect(() => {
        getCompanyList();
        getApprovalActorList();
        if (props.location.state) {
            setMultiLayerApprovalPathForUpdate(props.location.state.data);
        }
    }, [])

    const getCompanyList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/companies-by-login-user-organization`;
        axios.get(URL).then(response => {
            setCompany(response.data.data);
            
        });
    }

    const getApprovalStepFeatureList = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/approval-step-feature-map/get-all-approval-step-feature-by-company-id/${companyId}`;
        axios.get(URL).then(response => {
            //console.log(response.data.data);
            setApprovalStepFeature(response.data.data);
        });
    }

    const getApprovalStepList = (approvalStepFeature) => {
        const tempCompanyId = inputs.companyId;
        const URL = `${process.env.REACT_APP_API_URL}/api/approval-step-feature-map/get-all-approval-step-by-company-id-and-approval-step-feature/${tempCompanyId}/${approvalStepFeature}`;
        axios.get(URL).then(response => {
            setApprovalStep(response.data.data);
        });
    }

    const getApprovalActorList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/approval-actor`;
        axios.get(URL).then(response => {
            setApprovalActor(response.data.data);
        });
    }

    const getRoleList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/role`;
        axios.get(URL).then(response => {
            setActor(response.data.data);
        });
    }

    const getDesignationList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/designation`;
        axios.get(URL).then(response => {
            setActor(response.data.data);
        });
    }

    const getLocationTypeList = () => {
        const tempCompanyId = inputs.companyId;
        const URL = `${process.env.REACT_APP_API_URL}/api/location-type/get-location-type-by-company-id/${tempCompanyId}`;
        axios.get(URL).then(response => {
            setActor(response.data.data);
        });
    }

    const getApplicationUserList = () => {
        //const URL = `${process.env.REACT_APP_API_URL}/auth`;
        const tempCompanyId = inputs.companyId;
        const URL = `${process.env.REACT_APP_API_URL}/auth/get-all-user-company-id/${tempCompanyId}`;
        axios.get(URL).then(response => {
            setActor(response.data.data);
            console.log(response.data)
        });
    }

    const setMultiLayerApprovalPathForUpdate = (data) => {

        fields.id = data.id;
        fields.companyId = data.company.id;
        fields.approvalStepFeatureMapId = data.approvalStepFeatureMap.id;
        fields.approvalFeature = data.approvalStepFeatureMap.approvalFeature;
        fields.approvalActor = data.approvalActor;
        fields.approvalActorId = data.approvalActorId;

        setInputs(fields);
        getApprovalStepFeatureList(fields.companyId);
        getApprovalStepList(fields.approvalFeature);
        if (data.approvalActor === "ROLE") {
            getRoleList();
        }
        else if (data.approvalActor === "DESIGNATION") {
            getDesignationList();
        }
        else if (data.approvalActor === "LOCATION_TYPE") {
            getLocationTypeList();
        }
        else if (data.approvalActor === "APPLICATION_USER") {
            getApplicationUserList();
        }
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
        if (event.target.name === "companyId") {
            getApprovalStepFeatureList(event.target.value);
        }
        if (event.target.name === "approvalFeature") {
            getApprovalStepList(event.target.value);
        }
        if (event.target.name === "approvalActor") {
            setActor([]);
            if (event.target.value === "ROLE") {
                getRoleList();
            } else if (event.target.value === "DESIGNATION") {
                getDesignationList();
            } else if (event.target.value === "LOCATION_TYPE") {
                
                if (!inputs.companyId) {
                    showError('Please Select Company First.');
                    return false;
                } else {
                    getLocationTypeList();
                }
            } else if (event.target.value === "APPLICATION_USER") {
                // getApplicationUserList();
                if (!inputs.companyId) {
                    showError('Please Select Company First.');
                    return false;
                } else {
                    getApplicationUserList();
                }
            }

        }
    }

    const createMultilayerApprovalPath = () => {//alert('create..'); return;
        //console.log("inputs", inputs);
        if (!validate()) {
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/multilayer-approval-path`;
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

    const updateMultilayerApprovalPath = () => { //alert('update..'); return;
        if (!validate()) {
            return false;
        }


        const URL = `${process.env.REACT_APP_API_URL}/api/multilayer-approval-path`;
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

        if (!inputs.companyId) {
            showError('Company is required.');
            return false;
        }
        if (!inputs.approvalFeature) {
            showError('Approval Step Feature is required.');
            return false;
        }
        if (!inputs.approvalStepFeatureMapId) {
            showError('Approval Step is required.');
            return false;
        }
        if (!inputs.approvalActor) {
            showError('Approval Actor is required.');
            return false;
        }
        if(!inputs.approvalActorId){
            if (inputs.approvalActor === "ROLE") {
                showError('Actor is required.');
                return false;
            }
            else if (inputs.approvalActor === "DESIGNATION") {
                showError('Actor is required.');
                return false;
            }
            else if (inputs.approvalActor === "LOCATION_TYPE") {
                showError('Actor is required.');
                return false;
            }
            else if (inputs.approvalActor === "APPLICATION_USER") {
                showError('Actor is required.');
                return false;
            }
        }


        return true;
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <ApprovalPathBreadCrum menuTitle="Multilayer Approval Path" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Multilayer Approval Path Setup</span>

                            <NavLink className="float-right" to="/approval-path/multilayer-approval-path-setup">
                                <span><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Company <span className="text-danger ">*</span></label>
                                    <select id="companyId" className='form-control' name="companyId"
                                        value={inputs.companyId || ""}
                                        onChange={handleChange}
                                    >

                                        <option value="">Please select Company</option>
                                        {
                                            company.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Approval Step Feature<span className="text-danger ">*</span></label>
                                    <select id="approvalFeature" className='form-control' name="approvalFeature"
                                        value={inputs.approvalFeature || ""}
                                        onChange={handleChange}
                                    >

                                        <option value="">Please select Approval Step Feature</option>
                                        {
                                            approvalStepFeature.map((asf) => (
                                                <option key={asf.code} value={asf.code}>{asf.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Approval Step <span className="text-danger ">*</span></label>
                                    <select id="approvalStepFeatureMapId" className='form-control' name="approvalStepFeatureMapId"
                                        value={inputs.approvalStepFeatureMapId || ""}
                                        onChange={handleChange}
                                    >

                                        <option value="">Please select Approval Step</option>
                                        {
                                            approvalStep.map((as) => (
                                                <option key={as.id} value={as.id}>{as.name}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Approval Actor <span className="text-danger ">*</span></label>
                                    <select id="approvalActor" className='form-control' name="approvalActor"
                                        value={inputs.approvalActor || ""}
                                        onChange={handleChange}
                                    >

                                        <option value="">Please select Approval Actor</option>
                                        {
                                            approvalActor.map((ac) => (
                                                <option key={ac.code} value={ac.code}>{ac.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Actor</label>
                                    <select id="approvalActorId" className='form-control' name="approvalActorId"
                                        value={inputs.approvalActorId || ""}
                                        onChange={handleChange}
                                    >

                                        <option value="">Please select Actor </option>
                                        {
                                            actor.map((a) => (
                                                <option key={a.id} value={a.id}>{a.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                            <Button className="float-right" id="gotItBtn" variant="contained" color="primary"
                                onClick={inputs.id ? updateMultilayerApprovalPath : createMultilayerApprovalPath}>
                                {inputs.id ? 'Update' : 'Create'}
                            </Button>

                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}