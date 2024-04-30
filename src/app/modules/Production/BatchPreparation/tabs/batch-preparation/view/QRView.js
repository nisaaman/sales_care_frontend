import React, { useState, useEffect } from "react";
import BatchPreparationBreadCrum from '../../../common/BatchPreparationBreadCrum';
import BatchProfileHeader from '../../../common/BatchProfileHeader';
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import moment from 'moment';
import { dateFormatPattern } from "../../../../../Util";
import { useLocation, useHistory } from "react-router-dom";
import { hasCreateAccess } from '../../../../../Util';

export default function QRView() {
    let [singleAll, setSingleAll] = useState([]);
    const history = useHistory();
    const location = useLocation();
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const productObj = location.state.state;
    const companyId = useSelector((state)=> state.auth.company, shallowEqual);
    const userLoginId = useSelector((state)=> state.auth.user.userId, shallowEqual);
    const [productId, setProductId] = useState(productObj.id);
    const [batchNoList, setBatchNoList] = useState([]);
    const [batchDetails, setBatchDetails] = useState({});
    const [mQrCode, setMQrCode] = useState();
    const [iQrCode, setIqrCode] = useState();
    const [iqrPrintQuantity, setIqrPrintQuantity] = useState();
    const [mqrPrintQuantity, setMqrPrintQuantity] = useState();

    const handleBatchUpdate = (data) => {
        history.push('/production/production-batch-preparation/production-batch-preparation-product-new', { state: productObj, batchId : data });
    }

    useEffect(() => {
        document.getElementById('pills-product-view-batch-qr-code-tab').classList.add('active');
        document.getElementById('product-profile-dot').classList.add('d-inline');
        document.getElementById('product-profile').classList.remove('d-none');
        document.getElementById('product-profile').classList.add('d-inline');
    }, []);

    useEffect(() => {
        getBatchNoList(productId);
    },[productId]);

    const selectProductDiv = (batchId, event, number) => {
        let id = "id-" + number;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('product-div');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('active-product');
        }

        if (getId) {
            getId.classList.add('active-product');
        }

        getQRCode(batchId);
    }

    const handleAllChange = () => {
        const getId = document.getElementById("regularId");
        const attributrValue = getId.getAttribute("selected");

        if (attributrValue == "true") {
            getId.classList.remove("products-filter-span-change");
            getId.setAttribute("selected", "false");
        } else {
            getId.classList.add("products-filter-span-change");
            getId.setAttribute("selected", "true");
        }
    }

    const handlePrinterChange = (qrType) => {        
        const qrCode = `^XA
                        ^FO50,35^BQN,2,6,Q,7
                        ^FH
                        ^FDM,
                            QR Type: ${qrType}_0D_0A
                            Product Name: ${batchDetails.productName}_0D_0A
                            Batch No: ${batchDetails.batchNo}_0D_0A
                            Production Date: ${batchDetails.productionDate}_0D_0A
                            Expiry Date: ${batchDetails.expiryDate}_0D_0A
                            Supervisor: ${batchDetails.supervisorName}_0D_0A
                            No of IQR: ${batchDetails.noOfIqr}
                        ^FS
                        ^XZ`;
        var win = window.open(); 
        win.document.open();
        win.document.write(qrCode);
        win.document.close();
        win.print();
        win.close(); 
    }

    const getBatchNoList = (productId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/batch/product-wise-all-batch-info/${productId}`;
        axios.get(URL).then(response => {
            setBatchNoList(response.data.data);
        }).catch();
    }

    const getQRCode = (batchId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/batch/wise-qr-code/${batchId}`;
        axios.get(URL).then(response => {
            setBatchDetails(response.data.data.batchDetails);
            setMQrCode(response.data.data.mqrByte);
            setIqrCode(response.data.data.iqrByte);
            setIqrPrintQuantity(response.data.data.iqrPrintQuantity);
            setMqrPrintQuantity(response.data.data.mqrPrintQuantity);
        }).catch();
    }

    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getBatchNoList(productId);
        } else if (e.keyCode === 8) {
            getBatchNoList(productId);
        }
    }

    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < batchNoList.length; i++) {
            let batchNo = batchNoList[i].batchNo.toLowerCase();
            if (batchNo.includes(searchTextValue)) {
                tp.push(batchNoList[i]);
            }
        }
        setBatchNoList(tp);
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <BatchPreparationBreadCrum />
            </div>

            {/* TABS ROW */}
            <div>
                <BatchProfileHeader product ={productObj}/>
            </div>

            {/* MAIN CARD ROW */}
            <div>
                <Card>
                    <CardBody>
                        <div className="row">
                            <div className="col-xl-3">
                                <div style={{ borderRight: "1px solid #F2F2F2" }}>
                                    {/* SEARCHING AND FILTERING ROW */}
                                    <div className="d-flex">
                                        <div className="flex-wrap mt-3 mr-5">
                                            <span id="regularId" className="products-filter-span" selected="false" onClick={handleAllChange}>
                                                All
                                            </span>
                                        </div>
                                        <div className="w-100">
                                            <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                                <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                            </div>
                                            <form className="form form-label-right">
                                                <input type="text" className="form-control" name="searchText"
                                                    placeholder="Search Batch" style={{ paddingLeft: "28px" }} 
                                                    onKeyUp={(e) => handleKeyPressChange(e)}
                                                    onChange={handleSearchChange}
                                                />
                                            </form>
                                        </div>
                                    </div>
                                    {/* SEARCHING PRODUCT LIST */}
                                    <div className="mt-5 scroll-product-search">
                                        {batchNoList.map((batch, index) => 
                                                (
                                                    <div>
                                                    <div className="mt-16 product-div" onClick={(event) => selectProductDiv(batch.batchId, event, index)} id={"id-" + index}>
                                                        <span className="text-muted">Batch</span><br />
                                                        <strong>{batch.batchNo}</strong><br />
                                                        <span className="text-muted">                                                           
                                                             {batch.batchQuantity}
                                                        </span>                                                        
                                                    </div><br/>
                                                    {
                                                    hasCreateAccess(permissions, "BATCH_PREPARATION_PRODUCT") ?
                                                    <button className="btn text-white mr-3 h-15 p-1 float-right" 
                                                        style={{ background: "#6FCF97" }}
                                                        disabled ={(batch.receivedQuantity>0)?true:false}
                                                        onClick={() => handleBatchUpdate(batch.batchId)}
                                                        >
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                                        &nbsp;<strong>Update</strong>
                                                    </button> : ""
                                                    }
                                                    </div>
                                                )
                                        )}
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="col-xl-9">
                                {/* ALL SUMMARY ROW */}
                                <div className="row product-profile-summary">
                                    {/* PRODUCT NAME ROW */}
                                    <div className='col-xl-4' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/product-gray.svg")} width="30px" height="30px" />
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>Product Name</span>
                                                    <p><strong>{batchDetails.productName}</strong></p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BATCH ROW */}
                                    <div className='col-xl-4'>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/batch-gray.svg")} width="25px" height="25px" />
                                            </div>
                                            <div className="ml-2 d-flex flex-column flex-wrap">
                                                <span className="dark-gray-color" style={{ fontWeight: "500" }}>Batch Name</span>
                                                <strong>{batchDetails.batchNo}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PRINTER ROW */}
                                    <div className='col-xl-4'>
                                        <button className="btn float-right export-btn" >
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-printer.svg")} width="15px" height="15px" />
                                        </button>
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-9">
                                    <div className="row">
                                        <div className="col-xl-4">
                                            <img src={`data:image/jpeg;base64,${mQrCode}`} height="100%" width="100%"/>
                                            </div>
                                                <div className="col-xl-6">
                                                    <span className="dark-gray-color">QR Type:</span>&nbsp;<strong>MQR</strong><br />
                                                    <span className="dark-gray-color">Product Name:</span>&nbsp;<strong>{batchDetails.productName}</strong><br />
                                                    <span className="dark-gray-color">Batch No:</span>&nbsp;<strong>{batchDetails.batchNo}</strong><br />
                                                    <span className="dark-gray-color">Production Date:</span>&nbsp;<strong>{batchDetails.productionDate ? moment(batchDetails.productionDate).format(dateFormatPattern()) : ""}</strong><br />
                                                    <span className="dark-gray-color">Expiry Date:</span>&nbsp;<strong>{batchDetails.expiryDate ? moment(batchDetails.expiryDate).format(dateFormatPattern()) : ""} </strong><br />
                                                    <span className="dark-gray-color">Supervisor:</span>&nbsp;<strong>{batchDetails.supervisorName}</strong><br />
                                                    <span className="dark-gray-color">No of IQR =</span>&nbsp;<strong>{batchDetails.noOfIqr}</strong><br />
                                                </div>
                                            </div>
                                        </div>
                                    <div className="col-3">
                                        {
                                        hasCreateAccess(permissions, "BATCH_PREPARATION_PRODUCT") ?
                                        <button
                                            type="button"
                                            className="btn approval-config-btn float-right"
                                            data-toggle="tooltip" data-placement="bottom" title="Custom Print" onClick={() => handlePrinterChange('MQR')}
                                        >
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-printer.svg")} width="15px" height="15px" />
                                            &nbsp;&nbsp;<span className="dark-gray-color font-12">Custom Print</span>
                                        </button>
                                        : ""}
                                        <span className="level-title">MQR : {mqrPrintQuantity}</span>
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-9">
                                    <div className="row">
                                        <div className="col-xl-4">
                                        <img src={`data:image/jpeg;base64,${iQrCode}`} height="100%" width="100%"/>
                                        </div>
                                        <div className="col-xl-6">
                                           <span className="dark-gray-color">QR Type:</span>&nbsp;<strong>IQR</strong><br />
                                           <span className="dark-gray-color">Product Name:</span>&nbsp;<strong>{batchDetails.productName}</strong><br />
                                           <span className="dark-gray-color">Batch No:</span>&nbsp;<strong>{batchDetails.batchNo}</strong><br />
                                           <span className="dark-gray-color">Production Date:</span>&nbsp;<strong>{batchDetails.productionDate ? moment(batchDetails.productionDate).format(dateFormatPattern()) : ''} </strong><br />
                                           <span className="dark-gray-color">Expiry Date:</span>&nbsp;<strong>{batchDetails.expiryDate ? moment(batchDetails.expiryDate).format(dateFormatPattern()) : ''} </strong><br />
                                           <span className="dark-gray-color">Supervisor:</span>&nbsp;<strong>{batchDetails.supervisorName}</strong><br />
                                           <span className="dark-gray-color">No of IQR =</span>&nbsp;<strong>1</strong><br />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="col-3">
                                        {
                                        hasCreateAccess(permissions, "BATCH_PREPARATION_PRODUCT") ?
                                        <button
                                            type="button"
                                            className="btn approval-config-btn float-right"
                                            data-toggle="tooltip" data-placement="bottom" title="Custom Print" 
                                            onClick={() => handlePrinterChange('IQR')}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-printer.svg")} width="15px" height="15px" />
                                            &nbsp;&nbsp;<span className="dark-gray-color font-12">Custom Print</span>
                                        </button> 
                                        : "" 
                                        }
                                        <span className="level-title">IQR : {iqrPrintQuantity}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
