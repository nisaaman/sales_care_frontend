import React, {useEffect, useState} from "react"
import {Card} from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from "react-bootstrap-table2-paginator"
import {Route, useHistory} from "react-router-dom"
import {CardBody, CardHeaderToolbar} from "../../../../_metronic/_partials/controls"
import {CommonDeleteModal} from "../../Common/CommonDeleteModal"
import {ActionsColumnFormatterForMap} from "./ActionsColumnFormatterForMap"
import MasterConfigBreadCrum from "../MasterConfigBreadCrum"
import * as XLSX from "xlsx";
import {showError, showSuccess} from "../../../pages/Alert"
import {toAbsoluteUrl} from "../../../../_metronic/_helpers"
import SVG from "react-inlinesvg";
import axios from "axios"

export default function DepotLocationLevelList() {
    const history = useHistory();
    const [locationLevelList, setLocationLevelList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [locationTypeId, setLocationTypeId] = useState(null);

    useEffect(() => {
        getLocationTypeList();
    }, [])

    const createNewMap = () => {
        history.push('/master-config/depot-location-level-map-setup-new');
    }

    const openEditPage = (data) => {
        history.push({pathname: '/master-config/depot-location-level-map-setup-new', state: {data}});
    }

    const openDeleteDialog = (data) => {
        setLocationTypeId(data.id)
        history.push('/master-config/depot-location-level-map-setup/delete');
    }

    const getLocationTypeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-type/get-all-depot-configured-location-level-list-and-location-tree-list-by-login-organization`;
        axios.get(URL).then(response => {
            console.log("response.data.data=", response.data.data);
            let types = response.data.data.locationTypeList;
            let trees = response.data.data.locationTreeList;
            types.map(t => {
                for (let i = 0; i < trees.length; i++) {
                    if (t.locationTree.id === trees[i].id) {
                        t.isEditable = false;
                        break;
                    }
                }
            });
            console.log("types=", types);
            setLocationLevelList(response.data.data.locationTypeList);
        });
    }

    const deleteLevelMap = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-type/delete-location-level-of-depot/${locationTypeId}`;
        axios.get(URL).then(response => {
            if (response.data.success == true) {
                showSuccess(response.data.message);
                getLocationTypeList();
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });

        history.push('/master-config/depot-location-level-map-setup');
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
            obj.locationTree = row.locationTree.name;
            obj.name = row.name;
            exportData.push(obj);
           // setSelectedRows([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["LOCATION TREE", "LOCATION TYPE"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Location Type Depot Map.xlsx");
    }

    const columns = [
        {dataField: "locationTree.name", text: "Location Tree",},
        {dataField: "name", text: "Location Level of Depot"},
        {
            dataField: "action",
            text: "Actions",
            formatter: ActionsColumnFormatterForMap,
            formatExtraData: {
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
            <MasterConfigBreadCrum menuTitle="Depot Location Level Map Setup"/>
            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-xl-4">
                                    <span className="create-field-title">Depot Location Level Map List</span>
                                </div>
                                <div className="col-xl-8 d-flex justify-content-end">
                                    <div className="mr-5">
                                        <CardHeaderToolbar title="Create New Store">
                                            <button type="button" className="btn btn-primary" onClick={createNewMap}>
                                                + New Depot Location Level Map
                                            </button>
                                        </CardHeaderToolbar>
                                    </div>
                                    <div style={{marginRight: "20px", background: "#F9F9F9"}}>
                                        <button title="Download excel data" className="btn float-right export-btn"
                                                onClick={exportData}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")}
                                                 width="15px" height="15px"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Route path="/master-config/depot-location-level-map-setup/delete">
                        {({history, match}) => (
                            <CommonDeleteModal show={match != null} id={locationTypeId} deleteAction={deleteLevelMap}
                                               onHide={() => {
                                                   history.push("/master-config/depot-location-level-map-setup");
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
                        data={locationLevelList}
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
                        pagination={paginationFactory({sizePerPage: 10, showTotal: true})}
                    />
                </CardBody>
            </Card>
        </>
    )
}