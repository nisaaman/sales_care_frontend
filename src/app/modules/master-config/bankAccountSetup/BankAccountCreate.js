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

export default function BankAccountCreate(props) {
    const fields = {
        id: null,
        accountNumber: "",
        // branch:"",
        bankBranchId: "",
        bankId: "",
        isActive: true
    }

    const [inputs, setInputs] = useState(fields);
    const [allBranch, setAllBranch] = useState([]);
    const [allBank, setAllBank] = useState([]);

    useEffect(() => {
        // if(props.location.state){
        //     // console.log(props.location.state);

        //     setInputs(props.location.state.data);
        // } 

        getBankList();

        if (props.location.state) {
            console.log(props.location.state);
            getBankAccount(props.location.state.data);
            //  getBranchList();
            console.log("props.location.state.data=", props.location.state.data)

        }
    }, [])

    const getBankAccount = (data) => {
        inputs.id = data.id;
        inputs.accountNumber = data.accountNumber;
        inputs.bankBranchId = data.branch.id;
        inputs.isActive = data.isActive;
        inputs.bankId = data.branch.bank.id;
        //inputs.bankBranchId=data.bankBranchId;
        getBranchList(data.branch.bank.id);
        setInputs(inputs);
    }
    const getBranchList = (bankId) => {
        console.log(bankId)
        const URL = `${process.env.REACT_APP_API_URL}/api/bank-branch/all-active-bank-branch/${bankId}`;
        axios.get(URL).then(response => {
            console.log(response.data.data)
            setAllBranch(response.data.data)
        });
    }

    //Bank 
    const getBankList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/bank/all-active-bank`;
        axios.get(URL).then(response => {

            setAllBank(response.data.data)
        });
    }

    const
        handleChange = (event) => {
            let name = event.target.name;
            let value = event.target.value;

            if (event.target.type == 'checkbox') {
                value = event.target.checked;
                setInputs(values => ({ ...values, [name]: value }));
            } else if (event.target.name == 'bankId') {
                getBranchList(event.target.value);
                setInputs(values => ({ ...values, [name]: value, bankBranchId: '' }));
            } else {
                setInputs(values => ({ ...values, [name]: value }));
            }

        }

    const createBankAccount = () => {//alert('create..'); return;

        if (!validate()) {

            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/bank-account`;
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

    const updateBankAccount = () => {
        console.log("kkk");
        if (!validate()) {
            return false;
        }
        console.log("lll");
        const URL = `${process.env.REACT_APP_API_URL}/api/bank-account`;
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


        if (!inputs.bankId) {
            showError('Bank name is required.');
            return false;
        }

        if (!inputs.bankBranchId) {//!inputs.branch.id &&
            showError('Bank Branch name is required.');
            return false;
        }

        if (!inputs.accountNumber) {
            showError('Account Number is required.');
            return false;
        }

        if (inputs.accountNumber.length > 20) {
            showError('Account Number is Too Large.');
            return false;
        }
        return true;
    }


    const trimData = () => {
        inputs.accountNumber = inputs.accountNumber.trim();
        // inputs.email = inputs.email.trim();
        // inputs.bankShortName = inputs.bankShortName.trim();
        //inputs.description = inputs.description.trim();
    }



    return (
        <>
            {/* BREAD CRUM ROW */}
            <MasterConfigBreadCrum menuTitle="BankAccount" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Account Setup</span>

                            <NavLink className="float-right" to="/master-config/bank-account-setup">
                                <span><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>

                                    <label className='level-title'>Bank Name<i style={{ color: "red" }}>*</i></label>
                                    <select id="bankId" className='form-control' name="bankId"

                                        value={inputs.bankId || ""}

                                        //value={inputs.bankBranchId.id? inputs.bankBranchId.id:inputs.bankBranchId || ""}
                                        onChange={(event) => handleChange(event)}>

                                        <option value="">Please select bank</option>
                                        {
                                            allBank.map((bank) => (
                                                <option key={bank.id} value={bank.id}>{bank.name}</option>
                                            ))}
                                    </select>

                                </div>

                                <div className='col-xl-6 '>


                                    <label className='level-title'>Bank Branch Name<i style={{ color: "red" }}>*</i></label>
                                    <select id="bankBranchId" className='form-control' name="bankBranchId"

                                        value={inputs.bankBranchId || ""}

                                        //value={inputs.bankBranchId.id? inputs.bankBranchId.id:inputs.bankBranchId || ""}
                                        onChange={(event) => handleChange(event)}>

                                        <option value="">Please select branch</option>
                                        {
                                            allBranch.map((branch) => (
                                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                                            ))}
                                    </select>
                                </div>

                            </div>

                            <div className='mt-5 row'>
                                <div className='col-xl-6 '>

                                    <label className='level-title'>Account Number<span className="text-danger ">*</span></label>
                                    <input id="accountNumber" name="accountNumber" type="text" className='form-control'
                                        value={inputs.accountNumber || ""} onChange={handleChange}></input>
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
                                onClick={inputs.id ? updateBankAccount : createBankAccount}>
                                {inputs.id ? 'Update' : 'Create'}
                            </Button>

                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}