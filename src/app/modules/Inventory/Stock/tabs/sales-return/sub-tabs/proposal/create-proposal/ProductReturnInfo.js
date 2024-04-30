import React, { useState } from "react";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import { allowOnlyNumeric, handlePasteDisable } from "../../../../../../../Util";
import { showError } from "../../../../../../../../pages/Alert";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import axios from "axios";

export default function ProductReturnInfo({ selectedProductInfo, handleAddToCart,
    batchValue, setBatchValue, batchInfo, setBatchInfo, batchNoList, 
    invoiceValue, setInvoiceValue, invoiceInfo, setInvoiceInfo, 
    challanValue, setChallanValue, challanInfo, setChallanInfo,  
    productReturnCartQty, setProductReturnCartQty, proposalInfo, cartList}) {
    
    
    const [invoiceList, setInvoiceList] = useState([]);
    const [challanList, setChallanList] = useState([]);

    const handleReturnQuantity = (batch) => {        
        const temp = [...cartList]
        const quantity = document.getElementById('return-qty-id').value;
        if (Number(quantity) > (parseFloat(selectedProductInfo.propose_quantity))) {
            document.getElementById('return-qty-id').value = "";
            batch.returnQuantity = null;
            showError("Return Quantity Exceeds Proposed Quantity")
            return false;
        }
        if (quantity === undefined || quantity === "") {
            batch.addToCart = false
        } else {
            batch.returnQuantity = quantity;

            if (temp.findIndex(obj => obj.productId === selectedProductInfo.product_id) !== -1) {
                setProductReturnCartQty (Number(productReturnCartQty) + Number(quantity));                
            } 
            else {
                setProductReturnCartQty(Number(quantity));
            }           
        }

        if((quantity+'').match(/^0/)) {
            document.getElementById('return-qty-id').value="";
            return false;
         }
    }

    const getCustomerInvoiceListBatch = (batchId) => {
        let queryParams = '?batchId=' + batchId;
        queryParams += '&invoiceFromDate=' + proposalInfo.invoice_from_date;
        queryParams += '&invoiceToDate=' + proposalInfo.invoice_to_date;
        queryParams += '&distributorId=' + proposalInfo.distributor_id;
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-return-proposal/get-customer-invoice-list-batch` + queryParams;
        axios.get(URL).then(response => {
            setInvoiceList(response.data.data);
        }).catch(err => {})
    }

    const getCustomerChallanListInvoice = (invoiceId) => {
        let queryParams = '?invoiceId=' + invoiceId;
        queryParams += '&invoiceFromDate=' + proposalInfo.invoice_from_date;
        queryParams += '&invoiceToDate=' + proposalInfo.invoice_to_date;
        queryParams += '&distributorId=' + proposalInfo.distributor_id;
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-return-proposal/get-customer-challan-list-invoice` + queryParams;
        axios.get(URL).then(response => {
            setChallanList(response.data.data);
        }).catch(err => {})
    }

    return (
        <>
            <div>
                <Card className="mt-5" id="autocomplete-id">
                    <CardBody>
                        <Autocomplete
                            options={batchNoList}
                            freeSolo
                            getOptionLabel={(option) => option.batch_no}
                            value={batchValue}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setBatchValue(newValue);
                                    setBatchInfo(newValue);
                                    getCustomerInvoiceListBatch(newValue.batch_id)
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Batch" id="batch-search" />
                            )}
                        />
                        <span>
                            <span className="text-muted mr-2">Batch No:</span>
                            <strong>{batchInfo? batchInfo.batch_no : ''}</strong>
                        </span><br />
                        <span>
                            <span className="text-muted mr-2">Batch Qty:</span>
                            <strong>{batchInfo ? batchInfo.batch_quantity: ''}</strong>
                        </span><br />
                    </CardBody>
                </Card>
                <Card className="mt-5  pt-3 ">
                    <CardBody>
                        {/* BATCH INFO ROW */}
                        <div>
                            <div>
                            <Card className="mt-1">
                                <CardBody>
                                        <Autocomplete
                                            options={invoiceList}
                                            freeSolo
                                            getOptionLabel={(option) => option.invoice_no}
                                            value={invoiceValue}
                                            onChange={(event, newValue) => {
                                                if (newValue) {
                                                    setInvoiceValue(newValue);
                                                    setInvoiceInfo(newValue);
                                                    getCustomerChallanListInvoice(newValue.invoice_id);
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Invoice" />
                                            )}
                                        />
                                        <span>
                                            <strong>{invoiceInfo? invoiceInfo.invoice_no : proposalInfo.invoice_no}
                                            (Amount: {invoiceInfo ? invoiceInfo.invoice_amount : proposalInfo.invoice_amount})</strong><br/>
                                            <strong>{invoiceInfo? invoiceInfo.invoice_date : proposalInfo.invoice_date}</strong>
                                        </span>                                       
                                </CardBody>
                                <CardBody>
                                        <Autocomplete
                                            options={challanList}
                                            freeSolo
                                            getOptionLabel={(option) => option.challan_no}
                                            value={challanValue}
                                            onChange={(event, newValue) => {
                                                if (newValue) {
                                                    setChallanValue(newValue);
                                                    setChallanInfo(newValue);
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Challan" />
                                            )}
                                        />
                                        <span>
                                            <strong>{challanInfo ? challanInfo.challan_no : proposalInfo.challan_no}</strong><br/>
                                            <strong>{challanInfo ? challanInfo.challan_date : proposalInfo.challan_date}</strong>
                                        </span>                                       
                                    </CardBody>
                            </Card>
                            </div>                            

                            <span className="float-right mt-12">
                                {
                                    //  batchInfo.addToCart ?
                                    //      <span id="transferred-id-" className="float-right light-success-bg dark-success-color p-3 mt-n3 rounded">Transferred</span> :
                                    <span id="transfer-id-" className="float-right">
                                        <button className="btn text-white float-right mt-n3" style={{ background: "#6FCF97" }} 
                                            onClick={(e) => handleAddToCart(batchInfo, selectedProductInfo, e)}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                            &nbsp;Add
                                        </button>
                                    </span>
                                }
                            </span>
                            
                        </div>
                        {/* PROPOSED QTY ROW */}
                        <div className="mt-5 row">
                            <div className="col-6 mt-5">
                                <span>
                                    <input type="text" required id="return-qty-id" maxLength={15}
                                        onKeyPress={(e) => allowOnlyNumeric(e)}
                                        onChange={(e) => handleReturnQuantity(batchInfo)}
                                        onPaste={handlePasteDisable}
                                        className="mt-n5 border w-100 rounded p-3" placeholder="Return QTY." />
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}