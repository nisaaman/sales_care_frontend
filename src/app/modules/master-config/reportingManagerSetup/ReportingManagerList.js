import React, { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from "react-bootstrap-table2-paginator"
import { Route, useHistory } from "react-router-dom"
import { CardBody, CardHeaderToolbar } from "../../../../_metronic/_partials/controls"
import { CommonDeleteModal } from "../../Common/CommonDeleteModal"
import { ActionsColumnFormatter } from "../ActionsColumnFormatter"
import MasterConfigBreadCrum from "../MasterConfigBreadCrum"
import * as XLSX from "xlsx";
import { showError, showSuccess } from "../../../pages/Alert"
import { toAbsoluteUrl } from "../../../../_metronic/_helpers"
import SVG from "react-inlinesvg";
import axios from "axios"
import moment from 'moment';
import { useSelector, shallowEqual } from "react-redux";

export default function ReportingManagerList() {
    let history = useHistory();
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);

    const [reportingManagerList, setReportingManagerList] = useState([]);
    const [reportingManagerListSearch, setReportingManagerListSearch] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        getAllReportingManager();
    }, [companyId])

    const openViewPage = (data) => {
        //console.log(data);
        // history.push('/master-config/pack-size-setup-new', { state: data });
    }

    const createNewReportingManager = () => {
        history.push('/master-config/reporting-manager-setup-new');
    }

    const openEditPage = (data) => {
        history.push({ pathname: '/master-config/reporting-manager-setup-new', state: { data } });
    }

    const openDeleteDialog = (data) => {
        setDeleteId(data.id)
        history.push('/master-config/reporting-manager-setup/delete');
    }

    const getAllReportingManager = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/reporting-manager/get-all-by-company-id/${companyId}`;
        axios.get(URL).then(response => {
            if (response.data.success == true) {
                //console.log(response.data.data)
                setReportingManagerList(response.data.data)
                setReportingManagerListSearch(response.data.data)
            }
            else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const deleteReportingManager = () => {
        // alert('delete' + deleteId);
        const URL = `${process.env.REACT_APP_API_URL}/api/reporting-manager/${companyId}/${deleteId}`;
        axios.delete(URL).then(response => {
            if (response.data.success == true) {
                showSuccess(response.data.message)
                const tempReportingManagerList = [...reportingManagerList]
                const pIndex = tempReportingManagerList.findIndex(obj => obj.id == deleteId);
                tempReportingManagerList.splice(pIndex, 1);
                setReportingManagerList(tempReportingManagerList);
                setDeleteId(null);
            }
            else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });

        history.push('/master-config/reporting-manager-setup');
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

    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        console.log(reportingManagerListSearch)
        for (let i = 0; i < reportingManagerListSearch.length; i++) {
            let applicationUser = reportingManagerListSearch[i].applicationUser.name.toLowerCase();
            let reportingTo = reportingManagerListSearch[i].reportingTo.name.toLowerCase();
          
            if (applicationUser.includes(searchTextValue) || 
                reportingTo.includes(searchTextValue)) {
                tp.push(reportingManagerListSearch[i]);
            }
        }
        setReportingManagerList(tp);
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
            obj.applicationUser = row.applicationUser.name;
            obj.reportingTo = row.reportingTo?row.reportingTo.name:null;
            obj.fromDate = moment(row.fromDate, "YYYY-MM-DD").format("DD-MMM-YYYY");
            exportData.push(obj);
            //setSelectedRows([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["USER", "REPORTING TO", "REPORTING FROM (DATE)"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Reporting Manager List.xlsx");
    }

    const columns = [
        {
            dataField: "applicationUser",
            text: "User",
            formatter: (cellContent, row) => {
                return row.applicationUser.name;
            }
        },
        {
            dataField: "reportingTo",
            text: "Reporting To",
            formatter: (cellContent, row) => {
                return row.reportingTo?row.reportingTo.name:null;
            }
        },
        {
            dataField: "fromDate",
            text: "Reporting From (Date)",
            formatter: (cellContent, row) => {
                return moment(row.fromDate, "YYYY-MM-DD").format("DD-MMM-YYYY");
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
            {/* BREAD CRUM ROW */}
            <MasterConfigBreadCrum menuTitle="Reporting Manager" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="row">
                                <div className="col-xl-4">
                                    <span className="create-field-title">Reporting Manager List</span>
                                    {/* <p style={{ color: "#B6B6B6" }}>Total {productProfileList.length} products </p> */}
                                </div>
                                <div className="col-xl-8 d-flex justify-content-end">
                                     {/* SEARCH BOX ROW */}
                                    <div className="col-xl-3">
                                        <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                            <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                        </div>
                                        <form className="form form-label-right">
                                            <input type="text" className="form-control" name="searchText"
                                            placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                            onChange={handleSearchChange}
                                            />
                                        </form>
                                    </div>
                                    <div className="mr-5">
                                        <CardHeaderToolbar
                                            title="Create New Reporting Manager"
                                        >

                                            <button
                                                /* tree={categoryTypeTree} */
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={createNewReportingManager}
                                            >
                                                + New Reporting Manager
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

                    <Route path="/master-config/reporting-manager-setup/delete">
                        {({ history, match }) => (
                            <CommonDeleteModal
                                show={match != null}
                                id={deleteId}
                                deleteAction={deleteReportingManager}
                                onHide={() => {
                                    history.push("/master-config/reporting-manager-setup");
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
                        data={reportingManagerList}
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