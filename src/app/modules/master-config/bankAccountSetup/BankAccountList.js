
import paginationFactory from "react-bootstrap-table2-paginator"
import { Route, useHistory } from "react-router-dom"
import React, { useEffect, useState } from "react"
import MasterConfigBreadCrum from "../MasterConfigBreadCrum"
import { Card } from "react-bootstrap"
import { CardBody, CardHeaderToolbar } from "../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers"
import { CommonDeleteModal } from "../../Common/CommonDeleteModal"
import BootstrapTable from "react-bootstrap-table-next"
import SVG from "react-inlinesvg";
import { ActionsColumnFormatter } from "./../ActionsColumnFormatter"
import axios from "axios"
import * as XLSX from "xlsx";
import { showError, showSuccess } from "../../../pages/Alert"

export default function BankAccountList(){

    let history = useHistory();
    const [bankAccountList, setBankAccountList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        getAllBankAccount();
    }, [])

    const getAllBankAccount = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/bank-account`;
        axios.get(URL).then(response => {
            console.log("mmm");
            console.log(response.data.data);
            setBankAccountList(response.data.data)
        });
    }
    const exportData = (e) => {
        handleExport();
    }

    const handleExport = () => {
        const data = [...selectedRows];
        if (data.length === 0) {
            showError("Please select rows to export data.");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.accountNumber = row.accountNumber;
            //obj.bank=row.branch.bank.id;
            obj.bank=row.branch.bank.name
            obj.branchName= row.branch.name;
            obj.status=row.isActive? "Active" :"Inactive";
            exportData.push(obj);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["ACCOUNT NUMBER","BANK" ,"BRANCH","STATUS"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "BankAccountList.xlsx");
    }

    const openViewPage = (data) => {
        console.log(data);
        // history.push('/master-config/bank-setup-new', { state: data });
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

    const createNewAccount = () => {
        history.push('/master-config/bank-account-setup-new');
    }

    const deleteBankAccount = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/bank-account/${deleteId}`;
        axios.delete(URL).then(response => {
            if(response.data.success == true){
                showSuccess(response.data.message)
                const tempBankAccountList = [...bankAccountList]
                const pIndex = tempBankAccountList.findIndex(obj => obj.id == deleteId);
                tempBankAccountList.splice(pIndex,1);
                setBankAccountList(tempBankAccountList);
                setDeleteId(null);
            }
            else{
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });

        history.push('/master-config/bank-account-setup');
    }

    const openDeleteDialog = (data) => {
        setDeleteId(data.id)
        history.push('/master-config/bank-account-setup/delete');
    }

    const openEditPage = (data) => {
        console.log("edit bank branch");
        console.log(data);
        history.push({pathname: '/master-config/bank-account-setup-new', state: { data }});
    }
    
    const columns = [
        {
            dataField: "accountNumber",
            text: "Account Number",
        },   

        {
            dataField: "bank",
            text: "Bank",
            formatter: (cellContent, row) => {
                return row.branch.bank.name;
            }
        },
        {
            dataField: "branch.name",
            text: "Branch"
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
                openDeleteDialog: openDeleteDialog
            },
            classes: "text-center",
            headerClasses: "text-center",
            style: {
                minWidth: "8.5rem",
            }
        }
    ];

    return (
        <>
            {/* BREAD CRUM ROW  */}
            <MasterConfigBreadCrum menuTitle="BankAccount" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="row">
                                <div className="col-xl-4">
                                    <span className="create-field-title">Bank Account List</span>
                                    {/* <p style={{ color: "#B6B6B6" }}>Total {productProfileList.length} products </p> */}
                                </div>
                                <div className="col-xl-8 d-flex justify-content-end">
                                    <div className="mr-5">
                                        <CardHeaderToolbar
                                            title="Create New Account"
                                        >

                                            <button
                                                //   tree={categoryTypeTree} 
                                                type="button"
                                                className="btn btn-primary"
                                             onClick={createNewAccount}
                                            >
                                                + New Account
                                            </button>
                                        </CardHeaderToolbar>
                                    </div>

                                    <div style={{ marginRight: "20px", background: "#F9F9F9" }}>
                                        <button title="Download excel data" className="btn float-right export-btn"
                                        onClick={exportData}
                                        >
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <Route path="/master-config/bank-account-setup/delete">
                        {({ history, match }) => (
                            <CommonDeleteModal
                                show={match != null}
                                id={deleteId}
                                deleteAction={deleteBankAccount}
                                onHide={() => {
                                    history.push("/master-config/bank-account-setup");
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
                        data={bankAccountList}
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