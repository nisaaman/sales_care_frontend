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

export default function CurrencyCreate(props){
    const fields = {
        id: null,
        name: "",
        description: "",
        isActive: true
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

        if(event.target.type == 'checkbox'){
            value = event.target.checked;
        }

        setInputs(values => ({ ...values, [name]: value }));
    }

    const createCurrency = () => {//alert('create..'); return;
        if(!validate()){
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/currency`;
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
    
    const updateCurrency = () => { //alert('update..'); return;
        if(!validate()){
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/currency`;
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
            showError('Currency name is required.');
            return false;
        }

        if(inputs.name.length>20){
            showError('Currency name is Too Long.');
            return false;
        }
        console.log(inputs.description.length)

        if(inputs.description.length>80){
            showError('Description is Too Long.');
            return false;
        }

        return true;
    }

    const trimData = () => {
        inputs.name = inputs.name.trim();
         inputs.description = inputs.description.trim();
        // inputs.description = inputs.description.trim();
    }

    return (
        <>
        {/* BREAD CRUM ROW */}
        <MasterConfigBreadCrum menuTitle="Currency" />
        
        <Card>
            <CardBody>
            <div className="row">
                <div className="col-lg-12">                
                    <span className="create-field-title">Currency Setup</span>                       

                    <NavLink className="float-right" to="/master-config/currency-setup">
                        <span><i className="bi bi-chevron-left"></i></span>Back
                    </NavLink>

                    <div className='mt-5 row'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Currency Name <span className="text-danger ">*</span></label>
                            <input id="name" name="name" type="text" className='form-control' 
                                value={inputs.name || ""} onChange={handleChange}></input>
                        </div>

                        <div className='col-xl-6'>
                            <label className='level-title'>Description <span className="text-danger "></span></label>
                            <input id="description" name="description" type="text" className='form-control' 
                                value={inputs.description || ""} onChange={handleChange}></input>
                        </div>                   
                    </div>

                    <div className='mt-5 row'>
                        {/* <div className='col-xl-6'>
                        <label className='level-title'>Description</label>
                            <input id="description" name="description" type="text" className='form-control' 
                                value={inputs.description || ""} onChange={handleChange}></input>
                        </div> */}
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
                        onClick={inputs.id ? updateCurrency : createCurrency}>
                        {inputs.id ? 'Update' : 'Create'}
                    </Button>
                    
                </div>
            </div>
            </CardBody>
        </Card>
    </>);
}