import React, { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from "react-bootstrap-table2-paginator"
import { Route, useHistory } from "react-router-dom"
import { CardBody, CardHeaderToolbar } from "../../../../../_metronic/_partials/controls"
import { CommonDeleteModal } from "../../../Common/CommonDeleteModal"
import { ActionsColumnFormatter } from "./ActionsColumnFormatter"
import * as XLSX from "xlsx";
import { showError, showSuccess } from "../../../../pages/Alert"
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers"
import SVG from "react-inlinesvg";
import axios from "axios"
import ApprovalPathBreadCrum from "../../bread-crum/ApprovalPathBreadCrum"
import { prepareDataForValidation } from "formik"

export default function AuthorizationFeatureList() {

    let history = useHistory();
    const [selectedRows, setSelectedRows] = useState([]);
    const [approvalStepFeatureMapList, setApprovalStepFeatureMapList] = useState([]);

    const createNewAuthorizationFeature = () => {
        history.push('/approval-path/authorization-feature-new');
    }
    useEffect(() => {
        getAllApprovalStepFeatureMap();
    }, [])

    const getAllApprovalStepFeatureMap = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/approval-step-feature-map/get-all`;
        axios.get(URL).then(response => {
            setApprovalStepFeatureMapList(response.data.data);
        });
    }

    const openEditPage = (data) => {
        history.push({ pathname: '/approval-path/authorization-feature-new', state: { data } });
    }

    const openDeleteDialog = (data) => {
        //setDeleteId(data.id)
        //history.push('/approval-path/approval-step-setup/delete');
    }

    const singleRowSelectHandler = (data, isSelect) => {
        if (isSelect == true) {
            let temp = [...selectedRows]
            temp.push(data)
            setSelectedRows(temp)
        } else {
            if (selectedRows.length >= 0) {
                let temp = [...selectedRows]
                const index = temp.findIndex(obj => obj.feature == data.feature);
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
            obj.companyName = row.companyName;
            obj.feature = row.feature;
            obj.approvalStepName = row.approvalStepName;
            exportData.push(obj);
            //setSelectedRows([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["COMPANY NAME", "FEATURE","APPROVAL STEPS"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Authorization Feature List.xlsx");
    }

    const columns = [
        {
            dataField: "companyName",
            text: "COMPANY",
        },
        {
            dataField: "feature",
            text: "FEATURE"
        },
        {
            dataField: "approvalStepName",
            text: "APPROVAL STEPS",
        },
        {
            dataField: "action",
            text: "Actions",
            formatter: ActionsColumnFormatter,
            formatExtraData: {
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
            <ApprovalPathBreadCrum menuTitle="Authorization Feature List" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="row">
                                <div className="col-xl-4">
                                    <span className="create-field-title">Authorization Feature List</span>
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
                                                onClick={createNewAuthorizationFeature}
                                            >
                                                + New Authorization Feature
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

                    <BootstrapTable
                        wrapperClasses="table-responsive"
                        classes="table table-head-custom table-vertical-center overflow-hidden"
                        bootstrap4
                        bordered={false}
                        keyField="feature"
                        data={approvalStepFeatureMapList}
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