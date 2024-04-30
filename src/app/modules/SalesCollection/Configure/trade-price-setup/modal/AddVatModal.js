import React, {useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../../pages/IOSSwitch';
import axios from "axios";
import {showError, showSuccess} from '../../../../../pages/Alert';
import Flatpickr from "react-flatpickr";
import moment from "moment/moment";
import {getDaysCount} from "../../../../Util"

export default function AddVatModal({show, onHide, selectedProduct}) {
    const [vatLabel, setVatLabel] = useState("Excluded");
    const [inputs, setInputs] = useState({vatIncluded: false});

    useEffect(() => {
        if (document.getElementById('vatSwitchId').checked) {
            setVatLabel("Included")
        } else {
            setVatLabel("Excluded")
        }
    }, []);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if (name === 'vat') {
            if (value === '') {
                setInputs(values => ({...values, [name]: value}));
            } else if (Number(value) > 0 && Number(value) <= 100) {
                let v = value.split(".")[1];
                if (v === undefined) {
                    setInputs(values => ({...values, [name]: value.trim()}));
                } else if (v.length < 3) {
                    setInputs(values => ({...values, [name]: value}));
                }
            }
        } else {
            setInputs(values => ({...values, [name]: value}));
        }
    }

    const handleSave = () => {
        if (!isVatValidate()) {
            return;
        }
        let obj = {...inputs, productId: selectedProduct.id}
        const URL = `${process.env.REACT_APP_API_URL}/api/vat-setup`;
        axios.post(URL, JSON.stringify(obj), {headers: {"Content-Type": "application/json"}}).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                setInputs({vatIncluded: false});
                onHide(true);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const handleCancel = () => {
        setInputs({vatIncluded: false});
        onHide();
    }

    const handleVatChange = (event) => {
        if (event.target.checked === true) {
            setVatLabel("Included")
            setInputs({...inputs, vatIncluded: true});
        } else {
            setVatLabel("Excluded")
            setInputs({...inputs, vatIncluded: false});
        }
    }

    const isVatValidate = () => {
        if (inputs.vat === undefined || inputs.vat === null || inputs.vat === '') {
            showError("VAT is required");
            return false;
        } else if (isNaN(inputs.vat)) {
            showError("VAT should be Number");
            return false;
        } else if (inputs.vat <= 0 || inputs.vat > 100) {
            showError("VAT should be positive and not greater than 100");
            return false;
        } else if (inputs.fromDate === undefined || inputs.fromDate === null || inputs.fromDate === '') {
            showError("Effective Date is required");
            return false;
        } else if (inputs.toDate === undefined || inputs.toDate === null || inputs.toDate === '') {
            showError("Expired Date is required");
            return false;
        } else if (getDaysCount(inputs.fromDate, inputs.toDate, "YYYY-MM-DD") < 1) {
            showError("Expired Date cannot be less than Effective Date");
            return false;
        }

        return true;
    }

    return (
        <Modal size="md" show={show} onHide={onHide} aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Body className="overlay overlay-block cursor-default">
                <div className="close-btn row">
                    <div className="col-11">
                        <span className="text-muted">{selectedProduct.product_sku}</span><br/>
                        <strong>{selectedProduct.name}</strong><br/>
                        <span className="text-muted">{selectedProduct.productCategoryNameTrace}</span><br/>
                    </div>
                    <div className="float-right col-1">
                        <button onClick={handleCancel}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} width="20px"
                                 height="20px"/>
                        </button>
                    </div>
                </div>
                {/* PRICE INFO ROW */}
                <div className="d-flex mt-2">
                    <div className="mfg-price-span mr-3">Mfg. price <strong
                        className="text-color-black">{selectedProduct.mfgRate}</strong></div>
                    <div className="mfg-price-span  mt-1">Trade price<strong className="text-color-black">
                        {selectedProduct.trade_price} {selectedProduct.vat_included ? '(INCL. VAT ' + selectedProduct.vat + '%)' : '(EXC.VAT)'}</strong>
                    </div>
                </div>
                <div className="mt-5 row">
                    <div className="col-xl-6">
                        <label><strong>New VAT(%)<i style={{color: "red"}}>*</i></strong></label>
                        <input type="text" className='form-control' name="vat"
                               value={inputs.vat || ""} onChange={handleChange}></input>
                    </div>
                    <div className="col-xl-6">
                        <label><strong>Vat is<i style={{color: "red"}}>*</i></strong></label><br/>
                        <FormControlLabel
                            label={vatLabel}
                            labelPlacement="end"
                            control={
                                <IOSSwitch id="vatSwitchId" name="vatIncluded" checked={inputs.vatIncluded}
                                           value={inputs.vatIncluded} onChange={(event) => handleVatChange(event)}/>
                            }
                        />
                    </div>
                </div>

                <div className="mt-5 row">
                    <div className="col-xl-6">
                        <label><strong>Effective Date<i style={{color: "red"}}>*</i></strong></label>
                        <Flatpickr className="form-control date" id="fromDate" placeholder="dd-MM-yyyy"
                                   value={inputs.fromDate ? moment(inputs.fromDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                   options={{
                                       dateFormat: "d-M-Y",
                                       minDate: "today"
                                   }} required
                                   onChange={(value) => {
                                       setInputs({
                                           ...inputs,
                                           fromDate: moment(new Date(value)).format("YYYY-MM-DD")
                                       })
                                   }}
                        />
                    </div>
                    <div className="col-xl-6">
                        <label><strong>Expired Date<i style={{color: "red"}}>*</i></strong></label>
                        <Flatpickr className="form-control date" id="toDate" placeholder="dd-MM-yyyy"
                                   value={inputs.toDate ? moment(inputs.toDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                   options={{
                                       dateFormat: "d-M-Y",
                                       minDate: "today"
                                   }} required
                                   onChange={(value) => {
                                       setInputs({
                                           ...inputs,
                                           toDate: moment(new Date(value)).format("YYYY-MM-DD")
                                       })
                                   }}
                        />
                    </div>
                </div>

                <div className="mt-3">
                    <button type="submit" onClick={handleSave}
                            className="btn float-right trade-price-add-btn text-white">
                        Save
                    </button>
                </div>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    );
}