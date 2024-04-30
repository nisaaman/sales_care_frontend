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

export default function PackSizeList() {
    let history = useHistory();

    const [packSizeList, setPackSizeList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        getAllPackSize();
    }, [])

    const openViewPage = (data) => {
        //console.log(data);
        // history.push('/master-config/pack-size-setup-new', { state: data });
    }

    const createNewPackSize = () => {
        history.push('/master-config/pack-size-setup-new');
    }

    const openEditPage = (data) => {
        history.push({ pathname: '/master-config/pack-size-setup-new', state: { data } });
    }

    const openDeleteDialog = (data) => {
        setDeleteId(data.id)
        history.push('/master-config/pack-size-setup/delete');
    }

    const getAllPackSize = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/pack-size`;
        axios.get(URL).then(response => {
            //console.log(response.data.data)
            setPackSizeList(response.data.data)
        });
    }

    const deletePackSize = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/pack-size/${deleteId}`;
        axios.delete(URL).then(response => {
            if (response.data.success == true) {
                showSuccess(response.data.message)
                const tempPackSizeList = [...packSizeList]
                const pIndex = tempPackSizeList.findIndex(obj => obj.id == deleteId);
                tempPackSizeList.splice(pIndex, 1);
                setPackSizeList(tempPackSizeList);
                setDeleteId(null);
            }
            else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });

        history.push('/master-config/pack-size-setup');
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
        console.log("data",data);
        if (data.length === 0) {
            showError("Please select rows to export data.");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.packSize = row.packSize;
        

                    let height = "" + row.height;// row.height returns a number.Number can not be split.For split convert a string    
                    let width = "" + row.width;
                    let length = "" + row.length;
                    
                    let v1 = height.split(".")[1];// Here before (.) position is 0 and after (.) position is 1.  22.22 before(.) 22 position is 0 and after(.) the position is 1 
                    let v2 = width.split(".")[1];
                    let v3 = length.split(".")[1];
                    
                    // if (v1 === undefined) {
                        
                    //     height = "H" + height;
                    // }
                    // else {
                    //     if (Number(v1.length) ===1) {
                    //         height = "H" + height + "0";
                    //     }
                    // }
                    // if (v2 === undefined) {
                        
                    //     width = "W" + width;
                    // }
                    // else {
                    //     if (Number(v2.length) ===1) {
                    //         width = "W" + width + "0";
                    //     }
                    // }
                    // if (v3 === undefined) {
                        
                    //     length = "L" + length;
                    // }
                    // else {
                    //     if (Number(v3.length) ===1) {
                    //         length = "L" + length + "0";
                    //     }
                    // }
            obj.height = height;
            obj.width = width;
            obj.length = length;
                
            obj.description = row.description;
            obj.abbreviation = row.uom.abbreviation;
            obj.status = row.isActive ? "Active" : "Inactive";
            exportData.push(obj);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["PACK SIZE", "HEIGHT", "WIDTH", "LENGTH", "DESCRIPTION", "UNIT OF MEASUREMENT", "STATUS"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "PackSizeList.xlsx");
    }

    const columns = [
        {
            dataField: "packSize",
            text: "Pack Size",
        },
        {
            dataField: "height",
            text: "Measurement",
            formatter: (cellContent, row) => {
                {
                    
                    let height = "" + row.height;// row.height returns a number.Number can not be split.For split convert a string    
                    let width = "" + row.width;
                    let length = "" + row.length;
                    
                    let v1 = height.split(".")[1];// Here before (.) position is 0 and after (.) position is 1.  22.22 before(.) 22 position is 0 and after(.) the position is 1 
                    let v2 = width.split(".")[1];
                    let v3 = length.split(".")[1];
                    
                    if (v1 === undefined) {
                        
                        height = "H" + height;
                    }
                    else {
                        if (Number(v1.length) ===1) {
                            height = "H" + height + "0";
                        }
                        else {
                            height = "H" + height;
                        }
                    }
                    if (v2 === undefined) {
                        
                        width = "W" + width;
                    }
                    else {
                        if (Number(v2.length) ===1) {
                            width = "W" + width + "0";
                        }
                        else {
                            width = "W" + width;
                        }
                    }

                    if (v3 === undefined) {
                        
                        length = "L" + length;
                    }
                    else {
                        if (Number(v3.length) ===1) {
                            length = "L" + length + "0";
                        }
                        else {
                            length = "L" + length;
                        }
                    }
                    return height + " ," + width + ", " + length;
                }
               
            }
        },
        {
            dataField: "description",
            text: "Description"
        },
        {
            dataField: "uom",
            text: "Unit of Measurement",
            formatter: (cellContent, row) => {
                return row.uom.abbreviation;
            }
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
            <MasterConfigBreadCrum menuTitle="Pack Size" />

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="row">
                                <div className="col-xl-4">
                                    <span className="create-field-title">Pack Size List</span>
                                    {/* <p style={{ color: "#B6B6B6" }}>Total {productProfileList.length} products </p> */}
                                </div>
                                <div className="col-xl-8 d-flex justify-content-end">
                                    <div className="mr-5">
                                        <CardHeaderToolbar
                                            title="Create New Pack Size"
                                        >

                                            <button
                                                /* tree={categoryTypeTree} */
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={createNewPackSize}
                                            >
                                                + New Pack Size
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

                    <Route path="/master-config/pack-size-setup/delete">
                        {({ history, match }) => (
                            <CommonDeleteModal
                                show={match != null}
                                id={deleteId}
                                deleteAction={deletePackSize}
                                onHide={() => {
                                    history.push("/master-config/pack-size-setup");
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
                        data={packSizeList}
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