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

export default function ApprovalStepCreate(props){
    const fields = {
        id: null,
        name: "",
        description: "",
    }

    const [inputs, setInputs] = useState(fields);

    useEffect(() => {
        if(props.location.state){
            // console.log(props.location.state);
            setInputs(props.location.state.data);
        }        
    },[])

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setInputs(values => ({ ...values, [name]: value }));
    }

    const createApprovalStep = () => {//alert('create..'); return;
        if(!validate()){
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/approval-step`;
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
    
    const updateApprovalStep = () => { //alert('update..'); return;
        if(!validate()){
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/approval-step`;
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
            showError('Approval Step name is required.');
            return false;
        }

        if (inputs.name.length>100) {
            showError('Approval Step name is Too Large.');
            return false;
        }

        return true;
    }

    const trimData = () => {
        inputs.name = inputs.name.trim();
       // inputs.description = inputs.description.trim();
    }

    return (
        <>
        {/* BREAD CRUM ROW */}
        <ApprovalPathBreadCrum menuTitle="Approval Step" />
        
        <Card>
            <CardBody>
            <div className="row">
                <div className="col-lg-12">                
                    <span className="create-field-title">Approval Step Setup</span>                       

                    <NavLink className="float-right" to="/approval-path/approval-step-setup">
                        <span><i className="bi bi-chevron-left"></i></span>Back
                    </NavLink>

                    <div className='mt-5 row'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Approval Step Name <span className="text-danger ">*</span></label>
                            <input id="name" name="name" type="text" className='form-control' 
                                value={inputs.name || ""} onChange={handleChange}></input>
                        </div>                  
                    </div>
                    <div className='mt-5 row'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Description<span className="text-danger "></span></label>
                            <input id="description" name="description" type="text" className='form-control' 
                                value={inputs.description || ""} onChange={handleChange}></input>
                        </div>                   
                    </div>

                    <Button className="float-right" id="gotItBtn" variant="contained" color="primary"
                        onClick={inputs.id ? updateApprovalStep : createApprovalStep}>
                        {inputs.id ? 'Update' : 'Create'}
                    </Button>
                    
                </div>
            </div>
            </CardBody>
        </Card>
    </>);
}