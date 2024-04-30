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

export default function UomList() {
    let history = useHistory();

    const [uomList, setUomList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        getAllUom();
    }, [])

    const openViewPage = (data) => {
        //console.log(data);
        // history.push('/master-config/uom-setup-new', { state: data });
    }

    const createNewUom = () => {
        history.push('/master-config/uom-setup-new');
    }

    const openEditPage = (data) => {
        history.push({ pathname: '/master-config/uom-setup-new', state: { data } });
    }

    const openDeleteDialog = (data) => {
        setDeleteId(data.id)
        history.push('/master-config/uom-setup/delete');
    }

    const getAllUom = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/unit-of-measurement`;
        axios.get(URL).then(response => {
            //console.log(response.data.data)
            setUomList(response.data.data)
        });
    }

    const deleteUom = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/unit-of-measurement/${deleteId}`;
        axios.delete(URL).then(response => {
            if (response.data.success == true) {
                showSuccess(response.data.message)
                const tempUomList = [...uomList]
                const pIndex = tempUomList.findIndex(obj => obj.id == deleteId);
                tempUomList.splice(pIndex, 1);
                setUomList(tempUomList);
                setDeleteId(null);
            }
            else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });

        history.push('/master-config/uom-setup');
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
            showError("Please select rows to export data.");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.abbreviation = row.abbreviation;
            obj.description = row.description;
            obj.status=row.isActive?"Active":"Inactive";
            exportData.push(obj);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["UOM", "DESCRIPTION","STATUS"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "UomList.xlsx");
    }

    const columns = [
        {
            dataField: "abbreviation",
            text: "UOM",
        },
        {
            dataField: "description",
            text: "Description"
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
            {/* BREAD CRUM ROW */}
            <MasterConfigBreadCrum menuTitle="Unit of Measurement" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="row">
                                <div className="col-xl-4">
                                    <span className="create-field-title">Unit of Measurement List</span>
                                    {/* <p style={{ color: "#B6B6B6" }}>Total {productProfileList.length} products </p> */}
                                </div>
                                <div className="col-xl-8 d-flex justify-content-end">
                                    <div className="mr-5">
                                        <CardHeaderToolbar
                                            title="Create New Unit of Measurement"
                                        >

                                            <button
                                                /* tree={categoryTypeTree} */
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={createNewUom}
                                            >
                                                + New Unit of Measurement
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

                    <Route path="/master-config/uom-setup/delete">
                        {({ history, match }) => (
                            <CommonDeleteModal
                                show={match != null}
                                id={deleteId}
                                deleteAction={deleteUom}
                                onHide={() => {
                                    history.push("/master-config/uom-setup");
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
                        data={uomList}
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