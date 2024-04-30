import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { CardBody } from "../../../../_metronic/_partials/controls";
import MasterConfigBreadCrum from "../MasterConfigBreadCrum";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from "../../../pages/IOSSwitch";
import { NavLink } from "react-router-dom";
import { showError, showSuccess } from "../../../pages/Alert";
import PhoneInput from 'react-phone-number-input';
import axios from "axios";
import { validateEmail } from '../../Util';
import 'react-phone-number-input/style.css';
export default function BranchCreate(props){
    const fields = {
        id: null,
        name: "",
        bank: "",
        bankId:"",
        contactNumber: "",
        email:"",
        address:"",
        isActive: true
    }

    const [inputs, setInputs] = useState(fields);
    const [allBank, setAllBank] = useState([]);
    const [contactNoValue, setcontactNoValue] = useState("");

    useEffect(() => {
        getBankList();
        if(props.location.state){
             console.log(props.location.state);
            setInputs(props.location.state.data);
            console.log("props.location.state.data=",props.location.state.data.contactNumber)
            setcontactNoValue(props.location.state.data.contactNumber);
        }        
    },[])

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        if(event.target.type == 'checkbox'){
            value = event.target.checked;
        }

        setInputs(values => ({ ...values, [name]: value }));
    }
     //Bank 
     const getBankList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/bank/all-active-bank`;
        axios.get(URL).then(response => {
            setAllBank(response.data.data)
        });
    }

    const createBranch = () => {//alert('create..'); return;
        if(!validate()){
            return false;
        }
  inputs.contactNumber=contactNoValue;
       
          console.log(inputs);
        const URL = `${process.env.REACT_APP_API_URL}/api/bank-branch`;
        axios.post(URL, inputs).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                setcontactNoValue("");
               
                setInputs(fields);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }
    
    const updateBranch = () => { //alert('update..'); return;
        if(!validate()){
            return false;
        }
        inputs.contactNumber=contactNoValue;
        const URL = `${process.env.REACT_APP_API_URL}/api/bank-branch`;
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
        
        if(!inputs.name){
            showError('Branch name is required.');
            return false;
        }

        if(!inputs.bank.id && !inputs.bankId){//inputs.bank.id for update
            showError('Bank name is required.');
            return false;
        }

        if(!inputs.email){
            showError(' Email is required.');
            return false;
        }else{
            if (!validateEmail(inputs.email)) {
                showError("Invalid Email.");
                return false;
            }
        }
         console.log(contactNoValue);

        if(!contactNoValue && !inputs.contactNoValue){
            showError(' Contact Number is required.');
            return false;
        }

        if(inputs.name.length>150){
            showError('Branch name is Too Large.');
            return false;
        }

        if(contactNoValue.length>20){
            showError('Contact Number is Too Large.');
            return false;
        }

        if(inputs.address.length>255){
            showError('Address is Too Large.');
            return false;
        }


        return true;
    }

    const trimData = () => {
        inputs.name = inputs.name.trim();
        inputs.email = inputs.email.trim();
         inputs.address = inputs.address.trim();
        //inputs.description = inputs.description.trim();
    }

    return (
        <>
        {/* BREAD CRUM ROW */}
        <MasterConfigBreadCrum menuTitle="Branch" />
        
        <Card>
            <CardBody>
            <div className="row">
                <div className="col-lg-12">                
                    <span className="create-field-title">Branch Setup</span>                       

                    <NavLink className="float-right" to="/master-config/bank-branch-setup">
                        <span><i className="bi bi-chevron-left"></i></span>Back
                    </NavLink>

                    <div className='mt-5 row'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Branch Name <span className="text-danger ">*</span></label>
                            <input id="name" name="name" type="text" className='form-control'                                 
                           value={inputs.name || ""} 
                           onChange={handleChange}
                            >

                            </input>
                        </div>

                        <div className='col-xl-6'>
                            {/* <label className='level-title'>Bank <span className="text-danger ">*</span></label>
                            <input id="bank" name="bank" type="text" className='form-control' 
                               // value={inputs.bankShortName || ""} 
                               //</div>onChange={handleChange}
                            >
                            </input> */}

                        <label className='level-title'>Bank Name<i style={{ color: "red" }}>*</i></label>
                            <select id="bankId" className='form-control' name="bankId" value={inputs.bank.id? inputs.bank.id:inputs.bankId || ""} onChange={(event) => handleChange(event)}>
                                <option value="">Please select bank</option>
                                {
                                allBank.map((bank) => (//
                                <option key={bank.id} value={bank.id}>{bank.name}</option>
                                ))}
                        </select>

                                
                        </div>                   
                    </div>


                    <div className='mt-5 row'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Email <span className="text-danger ">*</span></label>
                            <input id="email" name="email" type="text" className='form-control'                                 
                            value={inputs.email || ""} 
                           onChange={handleChange}
                            >
                            </input>
                        </div>

                        <div className='col-xl-6'>
                            <label className='level-title'>Address <span className="text-danger "></span></label>
                            <input id="address" name="address" type="text" className='form-control' 
                               value={inputs.address || ""} 
                               onChange={handleChange}
                            >

                                </input>
                        </div>                   
                    </div>

                    <div className='mt-5 row'>
                        {/* <div className='col-xl-6'>
                        <label className='level-title'>Contact Number</label>
                            <input id="contactNumber" name="contactNumber" type="text" className='form-control' 
                                //value={inputs.description || ""} 
                                //onChange={handleChange}
                                >

                            </input>
                            </div> */}

                        <div className='col-xl-6'>
                            <label className='level-title'>Contact<i style={{ color: "red" }}>*</i></label>
                            <PhoneInput
                                international
                                countryCallingCodeEditable={false}
                                defaultCountry="BD"
                                className='form-control'
                                id="contactNumber"
                                name="contactNumber"
                                value={inputs.contactNumber || ""}
                                onChange={setcontactNoValue}
                            />
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
                        onClick={inputs.id ? updateBranch : createBranch}>
                        {inputs.id ? 'Update' : 'Create'}
                    </Button>
                    
                </div>
            </div>
            </CardBody>
        </Card>
    </>);
}