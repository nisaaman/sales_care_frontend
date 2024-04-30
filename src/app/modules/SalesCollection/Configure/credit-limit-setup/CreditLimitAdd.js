import React, {useState} from "react";
import {Card} from "react-bootstrap";
import Button from '@material-ui/core/Button';
import {CardBody} from "../../../../../_metronic/_partials/controls";
import SalesCollectionConfigureBreadCrum from "../common/SalesCollectionConfigureBreadCrum";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";
import {NavLink, useHistory} from "react-router-dom";
import {showError, showSuccess} from "../../../../pages/Alert";
import {shallowEqual, useSelector} from 'react-redux';
import axios from "axios";
import {allowOnlyNumeric, allowOnlyNumericWithPeriod, allowOnlyNumericWithPeriodAndRestrictDecimalTwo} from '../../../Util';


export default function CreditLimitAdd() {
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const [distributors, setDistributors] = useState([]);
    const [distributorValue, setDistributorValue] = useState(null);
    const history = useHistory();
    const [inputs, setInputs] = useState({distributorId: "", creditLimit: 0, companyId: ""});

    const getAllDistributorList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/get-distributor-without-credit-limit/${companyId}`;
        axios.get(URL).then(response => {
            setDistributors(response.data.data);
        });
    }

    const handleChangeDistributor = (distributorId) => {
        if (distributorId !== null || distributorId !== "") {
            setInputs({...inputs, distributorId: distributorId});
        }
    }

    const handleChangeCreditLimit = (e) => {
        console.log("e.target.value", e.target.value);
        if (e.target.value !== null || e.target.value !== "") {
            setInputs({...inputs, creditLimit: e.target.value});
        }
        if (parseInt(e.target.value) <= 0) {
            document.getElementById('creditLimit').value='';
            return false;
        }
    }

    const validate = () => {
        if (!inputs.distributorId) {
            showError('Distributor is required.');
            return false;
        } else if (!inputs.creditLimit) {
            showError('Credit limit amount is required.');
            return false;
        }        
        return true;
    }

    const saveLimit = () => {
        if (!validate()) {
            return false;
        }
        let obj = {}
        obj = {...inputs, companyId: companyId, creditLimitTerm: 'LT'}
        const URL = `${process.env.REACT_APP_API_URL}/api/credit-limit`;
        axios.post(URL, JSON.stringify(obj), {headers: {"Content-Type": "application/json"}}).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                handleBack();
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });

    }

    const handlePaste = (e) => {
        e.preventDefault()
        return false;
    }

    const handleBack = () => {
        history.push({pathname: '/salescollection/configure/credit-limit-setup/credit-limit-setup'});
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <SalesCollectionConfigureBreadCrum menuTitle="Credit Limit Setup"/>

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Credit Limit Setup</span>

                            <NavLink className="float-right"
                                     to="/salescollection/configure/credit-limit-setup/credit-limit-setup">
                                <span className="mt-5"><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <Autocomplete
                                        name="distributorId"
                                        options={distributors}
                                        onKeyDown={getAllDistributorList}
                                        value={distributorValue}
                                        getOptionLabel={(option) => option.distributorName}
                                        onChange={(event, newValue) => {
                                            handleChangeDistributor(newValue.distributorId)
                                            setDistributorValue(newValue)
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Distributor*"/>
                                        )}
                                    />
                                </div>

                                <div className='col-xl-6'>
                                    <label className='level-title'><span
                                        className="mr-1">Credit Limit Amount</span><span
                                        className="text-danger ">*</span></label>
                                    <input maxLength={15} onPaste={(e) => handlePaste(e)}
                                           onChange={(e) => handleChangeCreditLimit(e)}
                                           onKeyPress={(e) => allowOnlyNumeric(e)} id="creditLimit"
                                           name="creditLimit" type="text" className='form-control'/>
                                </div>
                            </div>
                            <Button className="float-right mt-5" id="gotItBtn" variant="contained" color="primary"
                                    onClick={saveLimit}>Save</Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}