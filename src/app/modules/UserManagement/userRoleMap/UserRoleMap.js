import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { CardBody } from "../../../../_metronic/_partials/controls";
import 'react-phone-number-input/style.css';
import UserBreadCrum from "../bread-crum/UserBreadCrum";
import TransferList from "../../Common/TransferList";
import axios from "axios";
import { showError, showSuccess } from "../../../pages/Alert";

export default function UserRoleMap() {

    const fields = {
        id: null,
        userId: "",
        roleList: [],
        isActive: true
    }

    const [inputs, setInputs] = useState(fields);
    const [userList, setUserList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [selectedRoleList, setSelectedRoleList] = useState([]);
    const [userNameValue, setUserNameValue] = useState(null);
    const [mapdRoleList, setMapRoleList] = useState([]);

    useEffect(() => {
        getUserList();
    }, []);

    useEffect(() => {
        setInputs(values => ({ ...values, ['roleList']: selectedRoleList }));
    }, [selectedRoleList]);

    const handleChange = (user) => {
        // let name = event.target.name;
        // let value = event.target.value;
        let name = 'userId';
        let value = '';
        if (user) {
            value = user.id;
        }
        
        // console.log(value)

        setInputs(values => ({ ...values, [name]: value }));

        if (value !== "") {
            getAlreadyMappedCompanies(value);
        } else {
            setRoleList([]);
            setSelectedRoleList([]);
        }

    }

    const getUserList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/auth/get-active-users`;
        axios.get(URL).then(response => {
             //setUserList(response.data.data)

            if (response.data.data != undefined) {
                setUserList(response.data.data);
            }
            else {
                setUserList([]);
                setUserNameValue('');
            }
        });
    }

    const getAlreadyMappedCompanies = (userId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/application-user-role-map/get-all-role-by-user/` + userId;
        axios.get(URL).then(response => {
            setRoleList(response.data.data.unmappedRoles)
            setSelectedRoleList(response.data.data.mappedRoles)
            setMapRoleList(response.data.data.mappedRoles)
        });
    }

    const saveMapping = () => {
        let obj = inputs;
        obj.roleList = inputs.roleList.map(r => r.id);
        obj.isSave = true;
        const URL = `${process.env.REACT_APP_API_URL}/api/application-user-role-map`;
        axios.post(URL, obj).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                getAlreadyMappedCompanies(inputs.userId)

            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const updateMapping = () => {
        let obj = inputs;
        obj.roleList = inputs.roleList.map(r => r.id);
        obj.isSave = false;
        const URL = `${process.env.REACT_APP_API_URL}/api/application-user-role-map`;
        axios.post(URL, obj).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                getAlreadyMappedCompanies(inputs.userId)

            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <UserBreadCrum menuTitle="User Role Map" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">User Role Map</span>

                            <div className='mt-5 row'>
                                {/* <div className='col-xl-3'>
                                    <label className='level-title'>User <span className="text-danger ">*</span></label>
                                    <select id="userId" className='form-control' name="userId"
                                        value={inputs.userId || ""} onChange={handleChange}>

                                        <option value="">Select User..</option>
                                        {userList.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.designation ? '[' + user.designation.name + '] ' + user.name : user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>  */}
                                {/* <div style={{ marginTop: "10px" }}> */}
                              
                                    <div className='col-xl-3'>
                                            <label className='level-title'>User<span className="text-danger ">*</span></label><br />
                                            <Autocomplete
                                                name="userId"
                                                options={userList}
                                                onKeyDown={getUserList}
                                                getOptionLabel={(user) => user.designation ? '[' + user.designation.name + '] ' + user.name + '[' + user.email + ']' : user.name 
                                                + '[' + user.email + ']'}
                                                value={userNameValue}
                                                onChange={(event, newValue) => {
                                                    setUserNameValue(newValue)
                                                    if (newValue !== null) {
                                                        setInputs({ ...inputs, userId: newValue.id });
                                                    }
                                                    handleChange(newValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Select User*" />
                                                )}
                                            />
                                        </div>

                                <div className='col-xl-9'>
                                    <label className='level-title ml-5'>List of Roles<span className="text-danger ">*</span></label>

                                    <TransferList leftTitel={'Select role'} rightTitel={'Selected role'}  
                                        left={roleList} setLeft={setRoleList}
                                        right={selectedRoleList} setRight={setSelectedRoleList} />
                                </div>
                            </div>
                            {
                                mapdRoleList.length > 0 ?
                                <Button className="float-right mt-5" id="saveBtn" variant="contained" color="primary"
                                onClick={updateMapping}>
                                Update Map
                                </Button>
                                :
                                <Button className="float-right mt-5" id="saveBtn" variant="contained" color="primary"
                                onClick={saveMapping}>
                                Save Map
                                </Button>

                            }
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}