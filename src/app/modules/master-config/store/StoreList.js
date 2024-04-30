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

export default function StoreList() {
    let history = useHistory();

    const [storeList, setStoreList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        getAllStore();
    }, [])

    const openViewPage = (data) => {
       // console.log(data);
        // history.push('/master-config/store-setup-new', { state: data });
    }

    const createNewStore = () => {
        history.push('/master-config/store-setup-new');
    }

    const openEditPage = (data) => {
        history.push({ pathname: '/master-config/store-setup-new', state: { data } });
    }

    const openDeleteDialog = (data) => {
        setDeleteId(data.id)
        history.push('/master-config/store-setup/delete');
    }

    const getAllStore = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/store`;
        axios.get(URL).then(response => {
            setStoreList(response.data.data)
        });
    }

    const deleteStore = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/store/${deleteId}`;
        axios.delete(URL).then(response => {
            if (response.data.success == true) {
                showSuccess(response.data.message)
                const tempStoreList = [...storeList]
                const pIndex = tempStoreList.findIndex(obj => obj.id == deleteId);
                tempStoreList.splice(pIndex, 1);
                setStoreList(tempStoreList);
                setDeleteId(null);
            }
            else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });

        history.push('/master-config/store-setup');
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
            obj.name = row.name;
            obj.shortName = row.shortName;
            obj.storeType = row.storeType;
            obj.description = row.description;
            exportData.push(obj);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["STORE NAME","SHORT NAME","STORE TYPE", "DESCRIPTION"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "StoreList.xlsx");
    }

    const columns = [
        {
            dataField: "name",
            text: "Store Name",
        },
        {
            dataField: "shortName",
            text: "Short Name"
        },
        {
            dataField: "storeType",
            text: "Store Type"
        },
        {
            dataField: "description",
            text: "Description"
        },
        // {
        //     dataField: "isActive",
        //     text: "Status",
        //     formatter: (cellContent, row) => {
        //         return cellContent ? 'Active' : 'Inactive';
        //     }
        // },
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
            <MasterConfigBreadCrum menuTitle="Store" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="row">
                                <div className="col-xl-4">
                                    <span className="create-field-title">Store List</span>
                                    {/* <p style={{ color: "#B6B6B6" }}>Total {productProfileList.length} products </p> */}
                                </div>
                                <div className="col-xl-8 d-flex justify-content-end">
                                    <div className="mr-5">
                                        <CardHeaderToolbar
                                            title="Create New Store"
                                        >

                                            <button
                                                /* tree={categoryTypeTree} */
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={createNewStore}
                                            >
                                                + New Store
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

                    <Route path="/master-config/store-setup/delete">
                        {({ history, match }) => (
                            <CommonDeleteModal
                                show={match != null}
                                id={deleteId}
                                deleteAction={deleteStore}
                                onHide={() => {
                                    history.push("/master-config/store-setup");
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
                        data={storeList}
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