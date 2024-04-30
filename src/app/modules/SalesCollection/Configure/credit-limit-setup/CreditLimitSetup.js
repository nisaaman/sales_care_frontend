import React, {useEffect, useState} from "react";
import {Card, CardBody, CardHeaderToolbar} from "../../../../../_metronic/_partials/controls";
import CreditLimitSetupList from "./CreditLimitSetupList";
import SalesCollectionConfigureBreadCrum from "../common/SalesCollectionConfigureBreadCrum"
import {useHistory} from "react-router-dom";
import {toAbsoluteUrl} from "../../../../../_metronic/_helpers"
import SVG from "react-inlinesvg";
import axios from "axios";
import {showError} from "../../../../pages/Alert";
import {shallowEqual, useSelector} from 'react-redux';
import * as XLSX from "xlsx";

export default function CreditLimitSetup() {
    let history = useHistory();
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    let [singleAllExport, setSingleAllExport] = useState([]);
    const [allDistributorList, setAllDistributorList] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        getAllDistributorList(companyId);
    }, [companyId])

    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getAllDistributorList(companyId)
        } else if (e.keyCode === 8) {
            getAllDistributorList(companyId)
        }
    }

    const getAllDistributorList = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/credit-limit/get-distributor-credit-limit/${companyId}`;
        axios.get(URL).then(response => {
            console.log(response.data.data)
            setAllDistributorList(response.data.data);
        });
    }

    const handleSearchChange = (event) => {
        let value = event.target.value;
        setSearchText(value);
        getSearchListFromDistributorList(value);
    }

    const getSearchListFromDistributorList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < allDistributorList.length; i++) {
            let distributorName = allDistributorList[i].distributorName.toLowerCase();
            let semesterName = allDistributorList[i].semesterName.toLowerCase();
            let contactNo = allDistributorList[i].contactNo.toLowerCase();
            if (distributorName.includes(searchTextValue)
                || contactNo.includes(searchTextValue)
                || semesterName.includes(searchTextValue)
            ) {
                tp.push(allDistributorList[i]);
            }
        }
        setAllDistributorList(tp);
    }

    const createNewBank = () => {
        history.push('/salescollection/configure/credit-limit-setup/credit-limit-setup-new');
    }

    const exportData = (e) => {
        handleExport();
    }

    const handleExport = () => {
        const data = [...singleAllExport];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.distributor_name = row.distributor_name;
            obj.contact_no = row.contact_no;
            obj.credit_limit = row.credit_limit;
            obj.credit_limit_term = row.credit_limit_term;
            obj.start_date = row.start_date;
            obj.end_date = row.end_date;
            exportData.push(obj);
            setSingleAllExport([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["DISTRIBUTOR", "CONTACT NO", "CREDIT LIMIT", "TERM", "START DATE", "END DATE"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Credit_Limit.xlsx");
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <SalesCollectionConfigureBreadCrum menuTitle="Credit Limit Setup"/>
            </div>

            {/* MAIN CARD ROW */}
            <div>
                <Card>
                    <CardBody>
                        <div className="row">
                            <div className="col-xl-4">
                                <span className="create-field-title">Credit Limit Setup List</span>
                            </div>
                            <div className="col-xl-8 d-flex justify-content-end">
                                <div className="mr-5">
                                    <CardHeaderToolbar title="Create New Bank">
                                        <button type="button" className="btn btn-primary"
                                                onClick={createNewBank}>+ New Credit Limit
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
                        <div className="row mt-5">
                            <div className="col-xl-3">
                                <div style={{position: "absolute", padding: "7px", marginTop: "3px"}}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px"/>
                                </div>
                                <div>
                                    <input type="text" className='form-control' name="searchText"
                                           onKeyUp={(e) => handleKeyPressChange(e)}
                                           placeholder="Search Here" value={searchText} style={{paddingLeft: "28px"}}
                                           onChange={handleSearchChange}/>
                                </div>
                            </div>
                        </div>
                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <CreditLimitSetupList setSingleAllExport={setSingleAllExport}
                                                  singleAllExport={singleAllExport}
                                                  allDistributorList={allDistributorList}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}