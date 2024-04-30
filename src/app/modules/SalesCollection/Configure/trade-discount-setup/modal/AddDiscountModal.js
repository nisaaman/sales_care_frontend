import React, {useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import axios from "axios";
import {showError, showSuccess} from '../../../../../pages/Alert';

export default function AddDiscountModal({show, onHide, selectedProduct, selectedInvoiceNature}) {
    const [inputs, setInputs] = useState({});
    const [vatLabel, setVatLabel] = useState("Excluded");
    const [calculationTypeList, setCalculationTypeList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [semesterDates, setSemesterDates] = useState({});

    useEffect(() => {
        getCalculationTypeList();
    }, []);

    useEffect(() => {
        if (selectedProduct.company_id === undefined) {

        } else {
            getAllCurrentAndFutureSemesterByCompany({companyId: selectedProduct.company_id});
        }
    }, [selectedProduct]);

    const handleSave = () => {
        if (!isDiscountValidate()) {
            return;
        }

        let obj = {
            ...inputs,
            companyId: selectedProduct.company_id,
            productId: selectedProduct.id,
            invoiceNatureId: selectedInvoiceNature
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/trade-discount`;
        axios.post(URL, JSON.stringify(obj), {headers: {"Content-Type": "application/json"}}).then(response => {
            if (response.data.success == true) {
                showSuccess(response.data.message);
                setInputs({});
                setSemesterDates({});
                onHide();
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const isDiscountValidate = () => {
        if (inputs.discountName === undefined || inputs.discountName === null || inputs.discountName === '') {
            showError("Discount Title is required");
            return false;
        } else if (inputs.discountValue === undefined || inputs.discountValue === null || inputs.discountValue === '') {
            showError("Discount is required");
            return false;
        } else if (isNaN(inputs.discountValue) || inputs.discountValue <= 0) {
            showError("Discount should be positive Number");
            return false;
        } else if (inputs.calculationType === undefined || inputs.calculationType === null || inputs.calculationType === '') {
            showError("Discount Type is required");
            return false;
        } else if (inputs.calculationType === 'PERCENTAGE' && (inputs.discountValue > 100 || inputs.discountValue <= 0)) {
            showError("Discount should be Positive Number and not greater than 100");
            return false;
        } else if (inputs.semesterId === undefined || inputs.semesterId === null || inputs.semesterId === '') {
            showError("Semester is required");
            return false;
        } else if (isDiscountGreaterThanPrice()) {
            return false
        }

        return true;
    }

    const isDiscountGreaterThanPrice = () => {
        if (inputs.discountValue > Number(selectedProduct.trade_price)) {
            showError("Discount cannot be greater than Trade Price");
            return true;
        }
        return false;
    }

    const getCalculationTypeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/calculation-type`;
        axios.get(URL).then(response => {
            setCalculationTypeList(response.data.data);
        });
    }

    const getAllCurrentAndFutureSemesterByCompany = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/semester/get-all-current-and-future-semester/` + params.companyId;
        axios.get(URL).then(response => {
            setSemesterList(response.data.data);
        });
    }

    const handleCancel = () => {
        setInputs({});
        setSemesterDates({});
        onHide();
    }

    const handleVatChange = (event) => {
        if (event.target.checked == true) {
            setVatLabel("Included")
        } else {
            setVatLabel("Excluded")
        }
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if (name === 'discountValue') {
            if (value === '') {
                setInputs(values => ({...values, [name]: value}));
            } else if (Number(value) > 0) {
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

    const onSemesterChange = (event) => {
        getSemesterDateFromSemesterListBySemesterId(event.target.value);
    }

    const getSemesterDateFromSemesterListBySemesterId = (id) => {
        let found = false;
        for (let i = 0; i < semesterList.length; i++) {
            if (semesterList[i].semester_id.toString() === id) {
                setSemesterDates({
                    effectiveDate: semesterList[i].semester_start_date,
                    expiredDate: semesterList[i].semester_end_date
                });
                found = true;
                break;
            }
        }
        if (!found) {
            setSemesterDates({effectiveDate: "", expiredDate: ""})
        }
    }


    return (
        <Modal size="md" show={show} onHide={onHide} aria-labelledby="example-modal-sizes-title-lg">
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
                    <div className="col-xl-12">
                        <label><strong>Discount Title<i style={{color: "red"}}>*</i></strong></label>
                        <input type="text" className='form-control' name="discountName"
                               value={inputs.discountName || ""} onChange={handleChange}/>
                    </div>
                </div>
                <div className="mt-5 row">
                    <div className="col-xl-6">
                        <label><strong>Discount<i style={{color: "red"}}>*</i></strong></label>
                        <input type="text" className='form-control' name="discountValue"
                               value={inputs.discountValue || ""} onChange={handleChange}/>
                    </div>
                    <div className="col-xl-6">
                        <label><strong>Discount Type<i style={{color: "red"}}>*</i></strong></label><br/>
                        <select className="form-control" name="calculationType"
                                value={inputs.calculationType || ""}
                                onChange={handleChange}>
                            <option value="" className="fs-1">Select Discount Type</option>
                            {calculationTypeList.map((c) => (
                                <option key={c.code} value={c.code} className="fs-1">{c.name}</option>))}
                        </select>
                    </div>
                </div>

                <div className="mt-5 row">
                    <div className="col-xl-12">
                        <label><strong>Semester<i style={{color: "red"}}>*</i></strong></label><br/>
                        <select className="form-control" name="semesterId"
                                value={inputs.semesterId || ""}
                                onChange={(event) => {
                                    handleChange(event);
                                    onSemesterChange(event);
                                }}>
                            <option value="" className="fs-1">Select Semester</option>
                            {semesterList.map((c) => (
                                <option key={c.semester_id} value={c.semester_id}
                                        className="fs-1">{c.fiscal_year_name}/{c.semester_name}</option>))}
                        </select>
                    </div>
                </div>

                <div className="mt-5 row">
                    <div className="col-xl-6">
                        <label><strong>Effective Date</strong></label>
                        <input type="text" disabled value={semesterDates.effectiveDate} className='form-control'
                               name="effectiveDate"/>
                    </div>
                    <div className="col-xl-6">
                        <label><strong>Expired Date</strong></label>
                        <input type="text" disabled value={semesterDates.expiredDate} className='form-control'
                               name="expiredDate"/>
                    </div>
                </div>

                <div className="mt-3">
                    <button type="submit" onClick={handleSave}
                            className="btn float-right trade-price-add-btn text-white">Save
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}