import React, {useEffect, useState} from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../../pages/IOSSwitch';
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import {Route, useHistory} from "react-router-dom";
import AddDiscountModal from "../modal/AddDiscountModal";
import _ from "lodash";
import {showError} from '../../../../../pages/Alert';
import axios from "axios";


export default function DiscountSetup(props) {
    const history = useHistory();
    const [discountList, setDiscountList] = useState([]); // no use

    useEffect(() => {
        if (props.selectedProduct.id === undefined) {

        } else {
            getDiscountListByProductAndInvoiceNature({
                productId: props.selectedProduct.id,
                invoiceNatureId: props.selectedInvoiceNature
            });
        }
    }, [props.selectedProduct, props.selectedInvoiceNature]);


    const newDiscountUIEvents = {
        newDiscountAddButtonClick: () => {
            if (_.isEmpty(props.selectedProduct)) {
                showError("No Product is Selected");
            } else {
                history.push("/salescollection/configure/trade-discount-setup/list/add-discount");
            }
        },
    };

    const getDiscountListByProductAndInvoiceNature = (params) => {
        let queryString = 'productId=' + params.productId;
        queryString += '&invoiceNatureId=' + params.invoiceNatureId;
        const URL = `${process.env.REACT_APP_API_URL}/api/trade-discount/get-all?` + queryString;
        axios.get(URL).then(response => {
            if (response.data.success === true) {
                setDiscountList(response.data.data);
            }
        });
    }


    return (
        <>
            <Route path="/salescollection/configure/trade-discount-setup/list/add-discount">
                {({history, match}) => (
                    <AddDiscountModal
                        selectedProduct={props.selectedProduct}
                        selectedInvoiceNature={props.selectedInvoiceNature}
                        show={match != null}
                        onHide={() => {
                            history.push("/salescollection/configure/trade-discount-setup/list");
                        }}
                    />
                )}
            </Route>
            {/* VAT ADD BTN AND SWITCH ROW */}
            <div className="discountCreditDiv row">
                <div className="col-xl-6 mt-4">
                    <span
                        className="display-inline-block"><strong>Setup Discount for {props.selectedInvoiceNature === 1 ? 'Credit' : 'Cash'} </strong></span>
                </div>
                <div className="col-xl-6">
                    <button className="add-to-vat text-white float-right"
                            onClick={newDiscountUIEvents.newDiscountAddButtonClick}>
                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} width="15px"
                             height="15px"/>&nbsp;
                        Add New Discount
                    </button>
                </div>
            </div>

            {discountList.map((element, index) => (
                <div key={index} className="p-5 current-vat-inactive mt-5">
                    {/* VAT TITLE ROW */}
                    <div>
                        <span className="current-vat-summary-text-gray-color">{element.discount_name}</span>
                        <span className="float-right vat-status">
                        <FormControlLabel
                            label={element.status === 'ACTIVE' ? 'Active' : element.status ? 'EXPIRED' : 'Not Started Yet'}
                            labelPlacement="start"
                            control={
                                <IOSSwitch checked={element.status === 'ACTIVE' ? true : false}/>
                            }
                        />
                    </span>
                    </div>
                    <div className="d-flex justify-content-between mt-5 current-vat-summary">
                        <div>
                            <div className="d-flex">
                                <div className="mt-2">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-date.svg")} width="25px"
                                         height="25px"/>
                                </div>
                                <div className="ml-2">
                                <span>
                                    <span>Effective Date</span>
                                    <p><strong
                                        className="current-trade-price-summary-text">{element.start_date}</strong></p>
                                </span>
                                </div>
                            </div>
                        </div>
                        <div className="float-right">
                            <div className="d-flex">
                                <div className="mt-2">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-date.svg")} width="25px"
                                         height="25px"/>
                                </div>
                                <div className="ml-2">
                                <span>
                                    <span>Expired Date</span>
                                    <p><strong className="current-trade-price-summary-text">{element.end_date}</strong></p>
                                </span>
                                </div>
                            </div>
                        </div>
                        <div className="float-right">
                            <div className="d-flex">
                                <div className="mt-2">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gra-doller.svg")} width="25px"
                                         height="25px"/>
                                </div>
                                <div className="ml-2">
                                <span>
                                    <span>Discount</span>
                                    <p><strong
                                        className="current-trade-price-summary-text">{element.discount_value}{element.calculation_type}</strong></p>
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

        </>
    )
}