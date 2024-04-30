
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../_metronic/_partials/controls";
import { shallowEqual, useSelector } from 'react-redux';
import axios from "axios";
import DistributorsBreadCrum from "../common/DistributorsBreadCrum";
import DistributorsHeader from "../common/DistributorsHeader";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { showError, showSuccess } from "../../../../pages/Alert";
export default function OpeningBalance() {
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const [input, setInput] = useState({
        company:''
    });

    useEffect(() => {
        document.getElementById('pills-distributors-opening-balance-tab').classList.add('active');
    }, [])
    const getCompanySelect = (row) => {
        const setId = document.getElementById("openingBalanceFileName");
        setId.innerHTML = "Upload File"
        document.getElementById("openingBalanceFileId").value = ''
        setInput({company:row.companyId})
    }


    const handleUpload = (event) =>{
        if ((input.company === undefined) || (input.company === "") || (input.company === null)) {
            return showError('Please Select Company.');
        }else{
        const fileName = event.target.files[0].name;
        const setId = document.getElementById('openingBalanceFileName');
        setId.innerHTML = fileName; 
        }
    
            let formData = new FormData();
    
            let obj = new Object();
            obj.companyId = companyId;

            formData.append("openingBalanceFile", event.target.files[0]);
            formData.append("openingBalanceData", new Blob([JSON.stringify(obj)], { type: "application/json" }));

            console.log("upload=====",formData)

            
             const URL = `${process.env.REACT_APP_API_URL}/api/distributor-balance/upload-opening-balance`;
             axios.post(URL, formData, { headers: { "Content-Type": false } }).then(response => {
                 if (response.data.success === true) {
                     showSuccess("Distributor Opening Balance Upload Successfully.")
                 } else {
                     showError(response.data.message);
                 }
             }).catch(err => {
                 showError(err.message);
             });
        
    }


    const downloadDistributorOpeningBalanceFileFormat = () => {
        let queryString = "?";
        queryString += "&companyId="+companyId;
        const API_URL = `${process.env.REACT_APP_API_URL}/api/distributor-balance/opening-balance-format/download`+queryString;
        const config = {method: 'GET', responseType: 'blob'};
        axios.get(API_URL, config).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download',"Distributor_Opening_Balance.xlsx");
            document.body.appendChild(link);
            link.click();
        }).catch();
    }
   
    return (
        <>
            <div>
                <DistributorsBreadCrum />
                <DistributorsHeader getSearchInputs={getCompanySelect} />
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div className="row">
                            <div className="col-xl-6">
                                <div>
                                    <span className="daysCount mt-5">Opening Balance</span>
                                    <button
                                        type="button"
                                        className="btn budget-download-btn btn-hover-primary float-right"
                                        data-toggle="tooltip" data-placement="bottom" title="Distributor Opening Balance Format"
                                        onClick={() => downloadDistributorOpeningBalanceFileFormat()}
                                    >
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                        &nbsp;&nbsp;Download Format
                                    </button>
                                </div>

                                <div>
                                    <button className="btn-warning-test mt-3 sales-chip border-success text-success text-center" style={{ width: "100%" }}>
                                        <span>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-up-arrow.svg")} width="15px" height="15px" />
                                            &nbsp;
                                            <span id="openingBalanceFileName">Upload File</span>
                                        </span>
                                        <input type="file" id = "openingBalanceFileId"
                                        onChange={(event) => handleUpload(event)}
                                        />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </CardBody>
                </Card>
            </div>
        </>);
}