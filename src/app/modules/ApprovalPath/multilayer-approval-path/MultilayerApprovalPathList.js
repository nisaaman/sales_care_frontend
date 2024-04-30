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
export default function MultilayerApprovalPathList() {

    let history = useHistory();

    const [multilayerApprovalPathList, setMultilayerApprovalPathList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [approvalFeatureList, setApprovalFeatureList] = useState([]);
    const [searchedFeatureList, setSearchedFeatureList] = useState([]);

    useEffect(() => {
        getAllMultilayerApprovalPath();
        getAllApprovalFeature();
    }, [])

    const openViewPage = (data) => {
        //console.log(data);
        // history.push('/approval-path/multilayer-approval-path-setup-new', { state: data });
    }

    const createNewMultilayerApprovalPath = () => {
        history.push('/approval-path/multilayer-approval-path-setup-new');
    }

    const openEditPage = (data) => {
        history.push({ pathname: '/approval-path/multilayer-approval-path-setup-new', state: { data } });
    }

    const openDeleteDialog = (data) => {
        setDeleteId(data.id)
        history.push('/approval-path/multilayer-approval-path-setup/delete');
    }

    const getAllMultilayerApprovalPath = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/multilayer-approval-path`;
        axios.get(URL).then(response => {
            setMultilayerApprovalPathList(response.data.data);
            setSearchedFeatureList(response.data.data);
        });
    }
    const getAllApprovalFeature = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/approval-feature`;
        axios.get(URL).then(response => {
            setApprovalFeatureList(response.data.data);
       
        });
    }
    const deleteMultilayerApprovalPath = () => {
        // alert('delete' + deleteId);
        const URL = `${process.env.REACT_APP_API_URL}/api/multilayer-approval-path/${deleteId}`;
        axios.delete(URL).then(response => {
            //console.log(response);
            if (response.data.success === true) {
                showSuccess(response.data.message)
                const tempMultilayerApprovalPathList = [...multilayerApprovalPathList]
                const pIndex = tempMultilayerApprovalPathList.findIndex(obj => obj.id === deleteId);
                tempMultilayerApprovalPathList.splice(pIndex, 1);
                setMultilayerApprovalPathList(tempMultilayerApprovalPathList);
                setDeleteId(null);
            }
            else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });

        history.push('/approval-path/multilayer-approval-path-setup');
    }

    const singleRowSelectHandler = (data, isSelect) => {
        if (isSelect === true) {
            let temp = [...selectedRows]
            temp.push(data)
            setSelectedRows(temp)
        } else {
            if (selectedRows.length >= 0) {
                let temp = [...selectedRows]
                const index = temp.findIndex(obj => obj.id === data.id);
                temp.splice(index, 1);
                setSelectedRows(temp)
            }
        }
    }

    const allRowSelectHandler = (allData, isSelect) => {
        if (isSelect === true) {
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
            obj.name = row.company.name;
            let index = approvalFeatureList.findIndex(v => v.code === row.approvalStepFeatureMap.approvalFeature);
            if (index > -1) {
                obj.approvalFeature = approvalFeatureList[index].name;
            }
            obj.approvalActor = row.approvalActor;
            obj.approvalStep = row.approvalStepFeatureMap.approvalStep.name;
            exportData.push(obj);
            setSelectedRows([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["Company Name", "Approval Feature", "Approval Step", "Approval Actor"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Multilayer Approval Path List.xlsx");
    }

    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }

    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < multilayerApprovalPathList.length; i++) {
            let approvalFeature = multilayerApprovalPathList[i].approvalFeatureName.toLowerCase();
            if (approvalFeature.includes(searchTextValue)
            ) {
                tp.push(multilayerApprovalPathList[i]);
            }
        }
        setSearchedFeatureList(tp);
    }

    const columns = [
        {
            dataField: "company",
            text: "Company Name",
            formatter: (cellContent, row) => {
                return row.company.name;
            }
        },
        {
            dataField: "approvalFeature",
            text: "Approval Feature",
            formatter: (cellContent, row) => {
                {
                    let index = approvalFeatureList.findIndex(v => v.code === row.approvalStepFeatureMap.approvalFeature);
                    if (index > -1) {
                        return approvalFeatureList[index].name;
                    }
                }
            }
        },
        {
            dataField: "approvalStep",
            text: "Approval Step",
            formatter: (cellContent, row) => {
                return row.approvalStepFeatureMap.approvalStep.name;
            }
        },
        {
            dataField: "approvalActor",
            text: "Approval Actor",
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
                minWidth: "12.5rem",
            }
        }
    ];

    return (
        <>
            {/* BREAD CRUM ROW */}
            <ApprovalPathBreadCrum menuTitle="Multilayer Approval Path " />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="row">
                                <div className="col-xl-4">
                                    <span className="create-field-title">Multilayer Approval Path List</span>
                                    {/* <p style={{ color: "#B6B6B6" }}>Total {productProfileList.length} products </p> */}
                                </div>
                                <div className="col-xl-8 d-flex justify-content-end">
                                <div className="col-xl-3">
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
                                        <CardHeaderToolbar
                                            title="Create New Multilayer Approval Path "
                                        >

                                            <button
                                                /* tree={categoryTypeTree} */
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={createNewMultilayerApprovalPath}
                                            >
                                                + New Multilayer Approval Path
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

                    <Route path="/approval-path/multilayer-approval-path-setup/delete">
                        {({ history, match }) => (
                            <CommonDeleteModal
                                show={match != null}
                                id={deleteId}
                                deleteAction={deleteMultilayerApprovalPath}
                                onHide={() => {
                                    history.push("/approval-path/multilayer-approval-path-setup");
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
                        data={searchedFeatureList}
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