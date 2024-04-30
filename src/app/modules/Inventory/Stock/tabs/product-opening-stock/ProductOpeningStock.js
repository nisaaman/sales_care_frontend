import React, { useEffect, useState } from 'react'
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import InventoryBreadCrum from '../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../header/InventoryStockHeader";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import { showError, showSuccess } from "../../../../../pages/Alert";

export default function ProductOpeningStock() {
    const companyId = useSelector((state) => state.auth.company, shallowEqual);

    // DEPOT COMPONENT USE STATE
    const [depots, setDepots] = useState([]);
    const [depotValue, setDepotValue] = useState(null);

    useEffect(() => {
        document.getElementById('pills-inventory-product-opening-stock-tab').classList.add('active')
    }, []);

    useEffect(() => {
        getAllDepots(companyId);
    }, [companyId]);

    const handleUpload = (event) => {
        const fileName = event.target.files[0].name;
        const setId = document.getElementById('openingBalanceFileName');
        setId.innerHTML = fileName;

        var input = document.getElementById('stockOpeningId');
        if (input.files.length < 1)
            return false;
        else
        {
            let formData = new FormData();
    
            let obj = new Object();
            obj.depotId = depotValue.id;
            obj.companyId = companyId;
        
            formData.append("stockFile", event.target.files[0]);
            formData.append("stockOpeningData", new Blob([JSON.stringify(obj)], { type: "application/json" }));
            
             const URL = `${process.env.REACT_APP_API_URL}/api/stock/opening-balance`;
             axios.post(URL, formData, { headers: { "Content-Type": false } }).then(response => {
                 if (response.data.success === true) {
                     showSuccess("Stock Opening Data Upload Successfully Done")
                 } else {
                     showError(response.data.message);
                 }
             }).catch(err => {
                 showError(err.message);
             });
        }
    }

    const getAllDepots = (companyId) => {
        let queryString = "?";        
        if (companyId) {
            //queryString += "companyId=" + Number(companyId);
            //const URL = `${process.env.REACT_APP_API_URL}/api/picking/get-order-list-by-picking-wise/${pickingId}`
            const URL = `${process.env.REACT_APP_API_URL}/api/depot/all-of-a-company/${companyId}`;
            axios.get(URL).then(response => {
                setDepots(response.data.data);
            });  
        }        
    }

    const downloadProductOpeningStockFileFormat = () => {
        let queryString = "?";
        queryString += "&companyId="+companyId;
        const API_URL = `${process.env.REACT_APP_API_URL}/api/stock/opening-stock-format/download`+queryString;
        const config = {method: 'GET', responseType: 'blob'};
        axios.get(API_URL, config).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
           // const [, filename] = response.headerKey['content-disposition'].split('filename=');
            link.setAttribute('download',"Stock_opening.xlsx");
            document.body.appendChild(link);
            link.click();
        }).catch();
    }

    return (
        <>
            <div>
                <InventoryBreadCrum />
                <InventoryStockHeader showStockData={true} />
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div className="row">
                            <div className="col-xl-6">
                                <div className='d-flex justify-content-between'>
                                    <div className="daysCount mt-3">Product Opening Stock</div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn budget-download-btn btn-hover-primary"
                                            data-toggle="tooltip" data-placement="bottom" title="Product Opening Stock"
                                            onClick={() => downloadProductOpeningStockFileFormat()}
                                        >
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                            &nbsp;&nbsp;Download Format
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <Autocomplete
                                        name="depotId"
                                        options={depots}
                                        getOptionLabel={(option) => option.depot_name}
                                        value={depotValue}
                                        onChange={(event,newValue) => {
                                            setDepotValue(newValue)
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Depot*" />
                                        )}
                                    />
                                </div>

                                <div className='mt-5'>
                                    <button className="btn-warning-test mt-3 sales-chip border-success text-success text-center" style={{ width: "100%" }}>
                                        <span>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-up-arrow.svg")} width="15px" height="15px" />
                                            &nbsp;
                                            <span id="openingBalanceFileName">Upload File</span>
                                        </span>
                                        <input type="file" id="stockOpeningId" accept=".xlsx"
                                            onChange={(event) => handleUpload(event)}
                                        />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}