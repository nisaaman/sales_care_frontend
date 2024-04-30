
import React, { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from "react-bootstrap-table2-paginator"
import { Route, useHistory } from "react-router-dom"
import { CardBody, CardHeaderToolbar } from "../../../../../_metronic/_partials/controls"
import * as XLSX from "xlsx";
import { showError, showSuccess } from "../../../../pages/Alert"
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers"
import SVG from "react-inlinesvg";
import axios from "axios"
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import UserBreadCrum from "../../bread-crum/UserBreadCrum";
import { StatusUpdateModal } from "../../../Common/StatusUpdateModal"
import { shallowEqual, useSelector } from "react-redux"
import { boolean } from "yup"
import { hasCreateAccess } from '../../../Util';

export function ProfileOverview() {
    let history = useHistory();
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);

    const [userList, setUserList] = useState([]);
    const [userListSearch, setUserListSearch] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [updateId, setUpdateId] = useState(null);
    const [updateStatusData, setUpdateStatusData] = useState(null);
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const [activeDistributorChecked, setActiveDistributorChecked] = useState(false);

    useEffect(() => {
        getAllUser();
    }, [])

    const openViewPage = (data) => {
        console.log(data);
        // history.push('/user-management/profile-overview-new', { state: data });
    }

    const createNewUser = () => {
        history.push('/user-management/profile-setup-new');
    }

    const openEditPage = (data) => {
        history.push({ pathname: '/user-management/profile-setup-new', state: { data } });
    }

    const openUpdateDialog = (data) => {
        //alert(JSON.stringify(data))
        checkActiveDistributor(data.id);
        if (data.id === userId) {
            showError("Logged in user can't be Inactive");
            return false;
        }

        setUpdateId(data.id);
        setUpdateStatusData(data);
        history.push('/user-management/profile-setup/update');
    }

    const getAllUser = () => {
        const URL = `${process.env.REACT_APP_API_URL}/auth`;
        axios.get(URL).then(response => {
            let list = response.data.data;
            let hasCreatePermission = hasCreateAccess(permissions, "USER_PROFILE");
            list.map(m => {
                m.hasCreatePermission = hasCreatePermission;
            });
            setUserList(list)
            setUserListSearch(response.data.data)
        });
    }

    const updateUser = () => {

        let obj = new Object();
        obj.id = updateStatusData.id;
      
        if (updateStatusData.isActive) {
            if (activeDistributorChecked == true) {
                showError("User mapping found to active Distributor.");
                setUpdateId(null);
                setUpdateStatusData(null)
                history.push('/user-management/profile-setup');
                return false;
            } else {
                obj.isActive = false;
            }
           
        } else {
            obj.isActive = true;
        }

        const URL = `${process.env.REACT_APP_API_URL}/auth/update-status`;
        axios.put(URL, obj).then(response => {
            if (response.data.success == true) {
                showSuccess(response.data.message)
                const tempUserList = [...userList]
                const pIndex = tempUserList.findIndex(o => o.id == obj.id);
                tempUserList[pIndex].isActive = response.data.data.isActive;
                setUserList(tempUserList);
                setUpdateId(null);
                setUpdateStatusData(null)
            }
            else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });

        history.push('/user-management/profile-setup');
    }

    const checkActiveDistributor = (id) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/distributor-sales-officer-map/sales-officer-id/${id}`;
        axios.get(URL).then(response => {
            if (response.data.success == true) {
                setActiveDistributorChecked (true)
            } else {
                setActiveDistributorChecked (false)
            }        
        }).catch(err => {
            showError(err);
        });
    }

    const singleRowSelectHandler = (data, isSelect) => {
        if (isSelect == true) {
            let temp = [...selectedRows]
            temp.push(data)
            setSelectedRows(temp)
        } else {
            if (selectedRows.length >= 0) {
                let temp = [...selectedRows]
                const index = temp.findIndex(obj => obj.id == data.id);
                temp.splice(index, 1);
                setSelectedRows(temp)
            }
        }
    }

    const allRowSelectHandler = (allData, isSelect) => {
        if (isSelect == true) {
            setSelectedRows(allData)
        } else {
            setSelectedRows([])
        }
    }

    const exportData = (e) => {
        handleExport();
    }

    const handleExport = () => {
        const data = [...selectedRows];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.id = row.id;
            obj.name = row.name;
            obj.email = row.email;
            obj.mobile = row.mobile;
            obj.department = row.department.name;
            obj.designation = row.designation.name;
            obj.referenceNo = row.referenceNo;
            obj.isActive = row.isActive ? 'Active' : 'Inactive';
            exportData.push(obj);
            setSelectedRows([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["NAME", "EMAIL", "CONTACT NO", "DEPARTMENT", "DESIGNATION", "REFERENCE NO", "STATUS"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "UserList.xlsx");
    }

    const columns = [
        {
            dataField: "id",
            text: "ID",
            hidden: true,
        },
        {
            dataField: "name",
            text: "Name",
        },
        {
            dataField: "email",
            text: "Email"
        },
        {
            dataField: "mobile",
            text: "Contact"
        },
        {
            dataField: "department",
            text: "Department",
            formatter: (cellContent, row) => {
                return row.department.name;
            }
        },
        {
            dataField: "designation",
            text: "Designation",
            formatter: (cellContent, row) => {
                return row.designation.name;
            }
        },
        {
            dataField: "referenceNo",
            text: "Reference"
        },
        {
            dataField: "isActive",
            text: "Status",
            formatter: (cellContent, row) => {
                return cellContent ? 'Active' : 'Inactive';
            }
        },
        {
            dataField: "action",
            text: "Actions",
            formatter: ActionsColumnFormatter,
            formatExtraData: {
                openViewPage: openViewPage,
                openEditPage: openEditPage,
                openUpdateDialog: openUpdateDialog
            },
            classes: "text-center",
            headerClasses: "text-center",
            style: {
                minWidth: "100px",
            }
        }
    ];


    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }

    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        console.log(userListSearch)
        for (let i = 0; i < userListSearch.length; i++) {
            let name = userListSearch[i].name.toLowerCase();
            let email = userListSearch[i].email.toLowerCase();

            if (name.includes(searchTextValue) || email.includes(searchTextValue)) {

                tp.push(userListSearch[i]);
            }
        }
        setUserList(tp);
    }


    return (
        <>
            {/* BREAD CRUM ROW */}
            <UserBreadCrum menuTitle="User" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="row">
                                <div className="col-xl-4">
                                    <span className="create-field-title">User List</span>
                                    {/* <p style={{ color: "#B6B6B6" }}>Total {productProfileList.length} products </p> */}
                                </div>
                                <div className="col-xl-8 d-flex justify-content-end">
                                    {/* SEARCH AND FILTER ROW */}
                                    <div className="mr-5">
                                        <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                            <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                        </div>
                                        <form className="form form-label-right">
                                            <input type="text" className="form-control" name="searchText"
                                                placeholder="Search Here"
                                                style={{ paddingLeft: "28px" }}
                                                onChange={handleSearchChange}
                                            />
                                        </form>
                                    </div>
                                    <div className="mr-5">
                                    {hasCreateAccess(permissions, 'USER_PROFILE') &&
                                        <CardHeaderToolbar
                                            title="Create New User"
                                        >

                                            <button
                                                /* tree={categoryTypeTree} */
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={createNewUser}
                                            >
                                                + New User
                                            </button>
                                        </CardHeaderToolbar>
                                    }
                                    </div>
                                    <div style={{ marginRight: "20px", background: "#F9F9F9" }}>
                                        <button title="Download excel data" className="btn float-right export-btn" onClick={exportData}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <Route path="/user-management/profile-setup/update">
                        {({ history, match }) => (
                            <StatusUpdateModal
                                show={match != null}
                                id={updateId}
                                updateStatusData={updateStatusData}
                                updateAction={updateUser}
                                onHide={() => {
                                    history.push("/user-management/profile-setup");
                                }}
                            />
                        )}
                    </Route>

                    <BootstrapTable
                        wrapperClasses="table-responsive"
                        classes="table table-head-custom table-vertical-center overflow-hidden"
                        bootstrap4
                        bordered={false}
                        keyField="id"
                        data={userList}
                        columns={columns}
                        selectRow={
                            {
                                mode: 'checkbox',
                                onSelect: (row, isSelect, rowIndex, e) => {
                                    singleRowSelectHandler(row, isSelect);
                                },
                                onSelectAll: (isSelect, rows, e) => {
                                    allRowSelectHandler(rows, isSelect);
                                }

                            }
                        }

                        pagination={paginationFactory({ sizePerPage: 10, showTotal: true })}
                    />
                </CardBody>
            </Card>
        </>
    )
}