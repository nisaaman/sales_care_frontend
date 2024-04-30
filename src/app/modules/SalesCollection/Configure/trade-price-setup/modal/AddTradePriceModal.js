import React, {useState} from "react";
import {Modal} from "react-bootstrap";
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import axios from "axios";
import {showError, showSuccess} from '../../../../../pages/Alert';

export default function AddTradePriceModal({show, onHide, selectedProduct}) {
    const [inputs, setInputs] = useState({});

    const handleSave = () => {
        if (!isTradePriceValidate()) {
            return;
        }
        let obj = {...inputs, productId: selectedProduct.id}
        const URL = `${process.env.REACT_APP_API_URL}/api/product-trade-price`;
        axios.post(URL, JSON.stringify(obj), {headers: {"Content-Type": "application/json"}}).then(response => {
            if (response.data.success == true) {
                showSuccess(response.data.message);
                setInputs({});
                onHide(true);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const isTradePriceValidate = () => {
        if (inputs.tradePrice === undefined || inputs.tradePrice === null || inputs.tradePrice === '') {
            showError("Trade Price is required");
            return false;
        } else if (isNaN(inputs.tradePrice)) {
            showError("Trade Price should be Number");
            return false;
        }

        return true;
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if (name === 'tradePrice') {
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
        }
    }

    const handleCancel = () => {
        onHide();
    }
    return (
        <Modal size="md" aria-labelledby="example-modal-sizes-title-lg" show={show} onHide={onHide}>
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
                <div className="mt-5">
                    <div>
                        <label><strong>New Trade Price<i style={{color: "red"}}>*</i></strong></label>
                        <input type="text" className='form-control' name="tradePrice"
                               value={inputs.tradePrice || ""} onChange={handleChange}></input>
                    </div>
                </div>
                <div className="mt-3">
                    <button className="btn float-right trade-price-add-btn text-white" type="submit"
                            onClick={handleSave}
                    >Save
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}