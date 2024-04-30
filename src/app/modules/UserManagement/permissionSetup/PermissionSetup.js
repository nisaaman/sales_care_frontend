import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { CardBody } from "../../../../_metronic/_partials/controls";
import 'react-phone-number-input/style.css';
import UserBreadCrum from "../bread-crum/UserBreadCrum";
import TransferList from "../../Common/TransferList";
import axios from "axios";
import { showError, showSuccess } from "../../../pages/Alert";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

export default function PermissionSetup() {    
    const [roleList, setRoleList] = useState([]);
    const [featurePermissionList, setFeaturePermissionList] = useState([]);
    const [allRowSelected, setAllRowSelected] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");

    useEffect(() => {
        getRoleList();
    },[]);

    const handleChange = (event) => {
        let value = event.target.value;

        if(value){
            getAlreadyMappedFeatures(value);
        }else{
            setFeaturePermissionList([]);
        }
        setSelectedRole(event.target.value);
        setAllRowSelected(false);
    }
    
    const handlePermissions = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        let checked = event.target.checked;

        let index = featurePermissionList.findIndex(depot => (depot.activityFeature === value));
        let previousPermissionList = [...featurePermissionList];

        if(name === 'isCreate'){
            previousPermissionList[index].isCreate = checked;
        }else if(name === 'isUpdate'){
            previousPermissionList[index].isUpdate = checked;
        }else if(name === 'isDelete'){
            previousPermissionList[index].isDelete = checked;
        }else if(name === 'isView'){
            previousPermissionList[index].isView = checked;
        }
        
        setFeaturePermissionList(previousPermissionList);        
    }
    
    const handleRowSelect = (event) => {
        let value = event.target.value;
        let checked = event.target.checked;

        let index = featurePermissionList.findIndex(depot => (depot.activityFeature === value));
        let previousPermissionList = [...featurePermissionList];
        
        previousPermissionList[index].isCreate = checked;    
        previousPermissionList[index].isUpdate = checked;    
        previousPermissionList[index].isDelete = checked;    
        previousPermissionList[index].isView = checked;        
        previousPermissionList[index].selectRow = checked;        
        
        setFeaturePermissionList(previousPermissionList);        
    }
    
    const handleAllRowSelect = (event) => {
        if(featurePermissionList.length == 0){
            showError('No data available!');
            return;
        }

        let checked = event.target.checked;
        let previousPermissionList = [...featurePermissionList];
        
        previousPermissionList.map((row) =>{
            row.isCreate = checked;
            row.isUpdate = checked;
            row.isDelete = checked;
            row.isView = checked;
            row.selectRow = checked;
        });     

        setAllRowSelected(checked);
        setFeaturePermissionList(previousPermissionList);        
    }

    const getRoleList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/role/get-active-roles`;
        axios.get(URL).then(response => {
            setRoleList(response.data.data)
        });
    }
    
    const getAlreadyMappedFeatures = (roleId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/permission/get-all-permission-list-by-role/?roleId=` + roleId;
        axios.get(URL).then(response => {
            setFeaturePermissionList(response.data.data)
        });
    }

    const savePermission = () => {
        if(featurePermissionList.length == 0){
            showError('Please select a role and features.');
            return;
        }
        
        const URL = `${process.env.REACT_APP_API_URL}/api/permission/create-all`;
        axios.post(URL, featurePermissionList).then(response => {
            if (response.data.success === true) {debugger
                showSuccess(response.data.message);                
                setFeaturePermissionList([]);
                setSelectedRole("");
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const columns = [
        {
          dataField: "featureName",
          text: "Feature Name",
        },       
        {
          dataField: "isCreate",
          text: "Create",
          formatter : (cellContent, row) => {
            return <input title="Select only create" type="checkbox" name="isCreate" checked={cellContent} value={row.activityFeature} onChange={handlePermissions}/>;
          }
        },
        {
          dataField: "isUpdate",
          text: "Update",
          formatter : (cellContent, row) => {
            return <input title="Select only update" type="checkbox" name="isUpdate" checked={cellContent} value={row.activityFeature} onChange={handlePermissions}/>;
          }
        },
        {
            dataField: "isDelete",
            text: "Delete",
            formatter : (cellContent, row) => {
              return <input title="Select only delete" type="checkbox" name="isDelete" checked={cellContent} value={row.activityFeature} onChange={handlePermissions}/>;
            }
        },
        {
            dataField: "isView",
            text: "View",
            formatter : (cellContent, row) => {
              return <input title="Select only view" type="checkbox" name="isView" checked={cellContent} value={row.activityFeature} onChange={handlePermissions}/>;
            }
        },
        {
            dataField: "selectRow",
            text: <><input title="Select all rows" type="checkbox" name="selectAllRow" checked={allRowSelected} onChange={handleAllRowSelect}/> All</>,
            formatter : (cellContent, row) => {
              return <input title="Select all in a row" type="checkbox" name="selectRow" checked={row.isCreate && row.isUpdate && row.isDelete && row.isView ? true : false} value={row.activityFeature} onChange={handleRowSelect}/>;
            }
        }
      ];

    return (
        <>
            {/* BREAD CRUM ROW */}
            <UserBreadCrum menuTitle="User Company Map" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Role wise feature permission setup</span>

                            <div className='mt-5 row'>
                                <div className='col-xl-3'>
                                    <label className='level-title'>Role <span className="text-danger ">*</span></label>
                                    <select id="roleId" className='form-control' name="roleId" value={selectedRole}
                                    onChange={handleChange}>

                                        <option value="">Select role..</option>
                                            {roleList.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className='col-xl-9'>
                                    <label className='level-title ml-5'>Features<span className="text-danger ">*</span></label>
                                    
                                    <BootstrapTable
                                    wrapperClasses="table-responsive"
                                    classes="table table-head-custom table-vertical-center overflow-hidden"
                                    bootstrap4
                                    bordered={false}
                                    keyField="activityFeature"
                                    data={featurePermissionList}
                                    columns={columns}
                                    pagination={paginationFactory({ sizePerPage: 10, 
                                        sizePerPageList: [
                                            {text: '10', value: 10},
                                            {text: '20', value: 20},
                                            {text: '30', value: 30},
                                            {text: '50', value: 50},
                                            {text: 'All', value: featurePermissionList.length},
                                        ], 
                                        showTotal: true })}
                                />
                                </div>
                            </div>      

                            <Button className="float-right mt-5" id="saveBtn" variant="contained" color="primary"
                                onClick={savePermission}>
                                Save Permission
                            </Button>                  

                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}