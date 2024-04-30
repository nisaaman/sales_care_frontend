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
export default function BatchList({ selectedProductInfo, handleTransfer,
    batchInfo, setBatchInfo, value, setValue, batchNoList, storeWiseBatchDataSource, blockedQuantity, regularQuantity }) {

    const handleTransferQuantity = (batch) => {

        const quantity = document.getElementById('batch-qty-id').value

        if (parseFloat(quantity) > (parseFloat(regularQuantity) - parseFloat(blockedQuantity))
            || quantity > (parseFloat(batch.availableStockQuantity))) {
            document.getElementById('batch-qty-id').value = "";
            batch.transferQuantity = null;
            showError("Transfer Quantity Exceeds Stock Quantity")

            return false;
        }
        if (quantity === undefined || quantity === "") {

            batch.addToCart = false
        } else {
            batch.transferQuantity = quantity
            batch.availableStockQuantity = batch.availableStockQuantity;
            //batch.addToCart = true
        }

        if((quantity+'').match(/^0/)) {
            document.getElementById('batch-qty-id').value="";
            return false;
         }

    }

    return (
        <>
            {/* {batchList.map((batch, index) => ( */}

            <div>
                <Card className="mt-5" id="autocomplete-id">
                    <CardBody>
                        <Autocomplete
                            options={batchNoList}
                            freeSolo
                            //onKeyUp={storeWiseBatchDataSource}
                            getOptionLabel={(option) => option.batchNo}
                            value={value}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setValue(newValue)
                                    setBatchInfo(newValue);
                                    //setAvailableStockQuantity(newValue.availableStockQuantity);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Batch" id="batch-search" />
                            )}
                        />
                    </CardBody>
                </Card>
                <Card className="mt-5  pt-3 ">
                    <CardBody>
                        {/* BATCH INFO ROW */}
                        <div>
                            <span className="float-right">
                                {
                                    batchInfo.addToCart ?
                                        <span id="transferred-id-" className="float-right light-success-bg dark-success-color p-3 mt-n3 rounded">Transferred</span> :
                                        <span id="transfer-id-" className="float-right">
                                            <button className="btn text-white float-right mt-n3" style={{ background: "#6FCF97" }} onClick={(e) => handleTransfer(batchInfo, selectedProductInfo, e)}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                                &nbsp;Transfer
                                            </button>
                                        </span>
                                }
                            </span>
                            <span>
                                <span className="text-muted mr-2">Batch No:</span>
                                <strong>{batchInfo.batchNo}</strong>
                            </span><br />
                            <span>
                                <span className="text-muted mr-2">Batch Qty:</span>
                                <strong>{batchInfo.batchQuantity}</strong>
                            </span><br />
                            <span>
                                <span className="text-muted mr-2">Stock Qty:</span>
                                <strong>{batchInfo.availableStockQuantity}  <strong style={{ color: "red" }}> {batchInfo.availableStockQuantity && blockedQuantity ? '(' + blockedQuantity + ')' : ''}</strong></strong>
                            </span>
                        </div>
                        {/* PROPOSED QTY ROW */}
                        <div className="mt-5 row">
                            <div className="col-6 mt-5">
                                <span>
                                    <input type="text" required id="batch-qty-id" maxLength={15}
                                        onKeyPress={(e) => allowOnlyNumeric(e)}
                                        onChange={(e) => handleTransferQuantity(batchInfo)}
                                        onPaste={handlePasteDisable}
                                        className="mt-n5 border w-100 rounded p-3" placeholder="Transfer QTY." />
                                </span>
                            </div>
                            {/* <div className="col-6 mt-1">
                                        <span className="rounded p-3 float-right">
                                            <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} />
                                            <span className="text-muted mr-2">Rate</span>
                                            <strong>500</strong>
                                        </span>
                                    </div> */}
                        </div>
                    </CardBody>
                </Card>
            </div>
            {/* ))} */}
        </>
    );
}