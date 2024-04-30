import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { CardBody } from "../../../../_metronic/_partials/controls";
//import MastarConfigBreadCrum from "../MastarConfigBreadCrum";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from "../../../pages/IOSSwitch";
import { NavLink } from "react-router-dom";
import { showError, showSuccess } from "../../../pages/Alert";
import axios from "axios";
import UserBreadCrum from "../bread-crum/UserBreadCrum"

export default function RoleCreate(props){
    const fields = {
        id: null,
        name: "",
        roleShortName: "",
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

    const createRole = () => {//alert('create..'); return;
        if(!validate()){
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/role`;
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
    
    const updateRole = () => { //alert('update..'); return;
        if(!validate()){
            return false;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/role`;
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
            showError('Role name is required.');
            return false;
        }

        // if(!inputs.roleShortName){
        //     showError('Bank short name is required.');
        //     return false;
        // }

        if (inputs.name.length>250) {
            showError('Role Name is Too Large.');
            return false;
        }

        return true;
    }

    const trimData = () => {
        inputs.name = inputs.name.trim();
       // inputs.roleShortName = inputs.roleShortName.trim();
       // inputs.description = inputs.description.trim();
    }

    return (
        <>
        {/* BREAD CRUM ROW */}
        <UserBreadCrum menuTitle="Role" />
        
        <Card>
            <CardBody>
            <div className="row">
                <div className="col-lg-12">                
                    <span className="create-field-title">Role Setup</span>                       

                    <NavLink className="float-right" to="/user-management/role-setup">
                        <span><i className="bi bi-chevron-left"></i></span>Back
                    </NavLink>

                    <div className='mt-5 row'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Role Name <span className="text-danger ">*</span></label>
                            <input id="name" name="name" type="text" className='form-control' 
                                value={inputs.name || ""} onChange={handleChange}></input>
                        </div>

                        <div className='col-xl-6'>
                            <label className='level-title'>Description<span className="text-danger "></span></label>
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
                        onClick={inputs.id ? updateRole : createRole}>
                        {inputs.id ? 'Update' : 'Create'}
                    </Button>
                    
                </div>
            </div>
            </CardBody>
        </Card>
    </>);
}