
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

export default function UserCompanyMap() {    

    const fields = {
        id: null,
        userId: "",
        companyList: [],
        isActive: true
    }

    const [inputs, setInputs] = useState(fields);
    const [userList, setUserList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [selectedCompanyList, setSelectedCompanyList] = useState([]);
    const [userNameValue, setUserNameValue] = useState(null);

    useEffect(() => {
        getUserList();
    },[]);
    
    useEffect(() => {
        setInputs(values => ({ ...values, ['companyList']: selectedCompanyList}));
    },[selectedCompanyList]);

    const handleChange = (user) => {
        // let name = event.target.name;
        // let value = event.target.value;
        let name = 'userId';
        let value = user.id;

        setInputs(values => ({ ...values, [name]: value }));

        if(value){
            getAlreadyMappedCompanies(value);
        }else{
            setCompanyList([]);
            setSelectedCompanyList([]);
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
        const URL = `${process.env.REACT_APP_API_URL}/api/application-user-company-mapping/get-all-company-by-user/` + userId;
        axios.get(URL).then(response => {
            setCompanyList(response.data.data.unmappedCompanies)
            setSelectedCompanyList(response.data.data.mappedCompanies)
        });
    }

    const saveMapping = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/application-user-company-mapping`;
        axios.post(URL, inputs).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);

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
            <UserBreadCrum menuTitle="User Company Map" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">User Company Map</span>

                            <div className='mt-5 row'>
                                {/* <div className='col-xl-3'>
                                    <label className='level-title'>User <span className="text-danger ">*</span></label>
                                    <select id="userId" className='form-control' name="userId" 
                                    value={inputs.userId || ""} onChange={handleChange}>

                                        <option value="">Select user..</option>
                                            {userList.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.designation ? '[' + user.designation.name +'] ' + user.name : user.name}
                                                </option>
                                            ))}
                                    </select>
                                </div> */}

                                        <div className='col-xl-3'>
                                            <label className='level-title'>User<span className="text-danger ">*</span></label><br />
                                            <Autocomplete
                                                name="userId"
                                                options={userList}
                                                onKeyDown={getUserList}
                                                getOptionLabel={(user) => user.designation ? '[' + user.designation.name + '] ' + user.name : user.name}
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
                                    <label className='level-title ml-5'>List of Company<span className="text-danger ">*</span></label>
                                    
                                    <TransferList leftTitel={'Select company'} rightTitel={'Selected company'} 
                                    left={companyList} setLeft={setCompanyList} 
                                    right={selectedCompanyList} setRight={setSelectedCompanyList}/>
                                </div>
                            </div>      

                            <Button className="float-right mt-5" id="saveBtn" variant="contained" color="primary"
                                onClick={saveMapping}>
                                Save Map
                            </Button>                  

                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}