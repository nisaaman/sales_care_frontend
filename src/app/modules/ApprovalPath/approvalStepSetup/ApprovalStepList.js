import React, { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from "react-bootstrap-table2-paginator"
import { Route, useHistory } from "react-router-dom"
import { CardBody, CardHeaderToolbar } from "../../../../_metronic/_partials/controls"
import { CommonDeleteModal } from "../../Common/CommonDeleteModal"
import { ActionsColumnFormatter } from "../ActionsColumnFormatter"
import * as XLSX from "xlsx";
import { showError, showSuccess } from "../../../pages/Alert"
import { toAbsoluteUrl } from "../../../../_metronic/_helpers"
import SVG from "react-inlinesvg";
import axios from "axios"
import ApprovalPathBreadCrum from "../bread-crum/ApprovalPathBreadCrum"
export default function ApprovalStepList() {

    let history = useHistory();

    const [approvalStepList, setApprovalStepList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        getAllApprovalStep();
    }, [])

    const openViewPage = (data) => {
        //console.log(data);
        // history.push('/approval-path/approval-step-setup-new', { state: data });
    }

    const createNewApprovalStep = () => {
        history.push('/approval-path/approval-step-setup-new');
    }

    const openEditPage = (data) => {
        history.push({ pathname: '/approval-path/approval-step-setup-new', state: { data } });
    }

    const openDeleteDialog = (data) => {
        setDeleteId(data.id)
        history.push('/approval-path/approval-step-setup/delete');
    }

    const getAllApprovalStep = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/approval-step`;
        axios.get(URL).then(response => {
            //console.log(response.data)
            setApprovalStepList(response.data.data)
        });
    }

    const deleteApprovalStep = () => {
        // alert('delete' + deleteId);
        const URL = `${process.env.REACT_APP_API_URL}/api/approval-step/${deleteId}`;
        axios.delete(URL).then(response => {
            //console.log(response);
            if (response.data.success == true) {
                showSuccess(response.data.message)
                const tempApprovalStepList = [...approvalStepList]
                const pIndex = tempApprovalStepList.findIndex(obj => obj.id == deleteId);
                tempApprovalStepList.splice(pIndex, 1);
                setApprovalStepList(tempApprovalStepList);
                setDeleteId(null);
            }
            else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });

        history.push('/approval-path/approval-step-setup');
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
            obj.name = row.name;
            obj.description = row.description
            exportData.push(obj);
            setSelectedRows([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["Approval Step Name", "Description"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Approval Step List.xlsx");
    }

    const columns = [
        {
            dataField: "name",
            text: "Approval Step Name",
        },

        {
            dataField: "description",
            text: "Description"
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
                minWidth: "100px",
            }
        }
    ];

    return (
        <>
            {/* BREAD CRUM ROW */}
            <ApprovalPathBreadCrum menuTitle="Approval Step" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="row">
                                <div className="col-xl-4">
                                    <span className="create-field-title">Approval Step List</span>
                                    {/* <p style={{ color: "#B6B6B6" }}>Total {productProfileList.length} products </p> */}
                                </div>
                                <div className="col-xl-8 d-flex justify-content-end">
                                    <div className="mr-5">
                                        <CardHeaderToolbar
                                            title="Create New Approval Step"
                                        >

                                            <button
                                                /* tree={categoryTypeTree} */
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={createNewApprovalStep}
                                            >
                                                + New Approval Step
                                            </button>
                                        </CardHeaderToolbar>
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

                    <Route path="/approval-path/approval-step-setup/delete">
                        {({ history, match }) => (
                            <CommonDeleteModal
                                show={match != null}
                                id={deleteId}
                                deleteAction={deleteApprovalStep}
                                onHide={() => {
                                    history.push("/approval-path/approval-step-setup");
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
                        data={approvalStepList}
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