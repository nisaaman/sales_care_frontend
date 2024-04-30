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

export default function TermsAndConditionCreate(props) {
    const fields = {
        id: null,
        termsAndConditions: "",
        companyId: ""
    }

    const [inputs, setInputs] = useState(fields);
    const [companies, setCompanies] = useState([]);
    const [termsAndConditions, setTermsAndConditions] = useState("");

    useEffect(() => {
        if (props.location.state) {
            // console.log(props.location.state);
            let data = props.location.state.data;
        
            inputs.id=data.id;
            inputs.termsAndConditions=data.termsAndConditions;
            inputs.companyId = data.company.id
            setInputs(inputs);

        }
        //console.log(props.location.state.data);
        getAllCompaniesByOrganization();
    }, [])

    const getAllCompaniesByOrganization = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/companies-by-login-user-organization`;
        axios.get(URL).then(response => {
            setCompanies(response.data.data);
        });
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const createTermsAndCondition = () => {//alert('create..'); return;
        if (!validate()) {
            return false;
        }
        // let obj = {...inputs,termsAndConditions:termsAndConditions}

        const URL = `${process.env.REACT_APP_API_URL}/api/terms-and-conditions`;
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

    const updateTermsAndCondition = () => { //alert('update..'); return;
        if (!validate()) {
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/terms-and-conditions`;
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

        if (!inputs.companyId ) {
            showError('Company Name is required.');
            return false;
        }
        if (!inputs.termsAndConditions) {
            showError('Terms And Condition is required.');
            return false;
        }

       

        // if (inputs.description.length > 250) {
        //     showError('Description is Too Large.');
        //     return false;
        // }

        return true;
    }

    const trimData = () => {
        inputs.termsAndConditions = inputs.termsAndConditions.trim();
        //inputs.description = inputs.description.trim();
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <MasterConfigBreadCrum menuTitle="TermsAndCondition" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Terms And Condition Setup</span>

                            <NavLink className="float-right" to="/master-config/terms-and-condition-setup">
                                <span><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>

                                    <label className='level-title'>Company Name<i style={{ color: "red" }}>*</i></label>
                                    <select className="form-control" name="companyId"
                                        value={inputs.companyId || ""}
                                       
                                        onChange={handleChange}>
                                        <option value="">Select Company</option>
                                        {companies.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>))}
                                    </select>


                                </div>
                            </div>

                            <div className="mt-3">
                                    <label className="level-title">Terms And Condition <i style={{ color: "red" }}>*</i></label>
                                    <textarea id="note" type="text" className="form-control w-75" rows="5"
                                        name="termsAndConditions" value={inputs.termsAndConditions || ""}
                                        onChange={handleChange}
                                        placeholder="Write here..." />
                                </div>

                            <Button className="float-right" id="gotItBtn" variant="contained" color="primary"
                                onClick={inputs.id ? updateTermsAndCondition : createTermsAndCondition}>
                                {inputs.id ? 'Update' : 'Create'}
                            </Button>

                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}