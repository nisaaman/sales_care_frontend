import React, {useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {CardBody} from "../../../../../../../../../_metronic/_partials/controls";
import InventoryBreadCrum from '../../../../../../bread-crum/InventoryBreadCrum';
import {useHistory, useLocation} from 'react-router-dom';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../../../_metronic/_helpers";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
import {showError, showSuccess} from '../../../../../../../../pages/Alert';
import {amountFormatterWithoutCurrency} from '../../../../../../../Util';

export default function InvoiceCreate() {
    const [deliveryChallanList, setDeliveryChallanList] = useState([]);
    const [selectedChallanList, setSelectedChallanList] = useState([]);
    const routeHistory = useHistory();
    const routeLocation = useLocation();
    const [totalDeliveryChallanNo, setTotalDeliveryChallanNo] = useState(0);
    const [paymentNature, setPaymentNature] = useState({credit: 1, cash: 2});
    const [selectedPaymentNature, setSelectedPaymentNature] = useState(0);
    const [distributorInfo, setDistributorInfo] = useState({});
    const [termsAndConditions, setTermsAndConditions] = useState({});
    const [locationHierarchyListLowToHigh, setLocationHierarchyListLowToHigh] = useState([]);
    const [distributorLogo, setDistributorLogo] = useState("");
    const [invoiceRemarks, setInvoiceRemarks] = useState("");
    const [distributorImg, setDistributorImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));
    const [invoiceTypeDisable, setInvoiceTypeDisable] = useState(true);
    const [totalInofs, setTotalInofs] = useState({
        totalAmount: 0.0,
        totalDiscount: 0.0,
        totalVat: 0.0,
        grandTotal: 0.0,
        invoiceDiscount: 0.0,
        invoiceDiscountType: 'PERCENTAGE',
        invoiceDiscountValue: 0,
        totalAfterDiscount: 0.0
    });

    useEffect(() => {
        let distributorInfos = routeLocation.state.state;
        setDistributorInfo({...distributorInfos, distributorId: distributorInfos.distributor_id});

        locationHierarchyListLowToHighList({
            companyId: distributorInfos.companyId, distributorId: distributorInfos.distributor_id
        });

        getChallanListByParams({
            ...distributorInfos, distributorId: distributorInfos.distributor_id, invoiceNatureId: paymentNature.credit
        });

        setSelectedPaymentNature(paymentNature.credit);
        getDistributorLogo(distributorInfos.distributor_id);
        getTermsAndConditions(distributorInfos.companyId);

        const radioId = document.getElementById("radio-id-0");
        radioId.checked = true;
        const radioDiv = document.getElementById("id-0");
        radioDiv.classList.add('select-order-list');
        setInvoiceTypeDisable(radioId.checked === true ? true : false);
        document.getElementById("discountCard").style.backgroundColor = "#F3F6F9";
        document.getElementById("invoiceLebel").style.color = "#B4BED7";
        document.getElementById("discountInput").style.color = "#B4BED7";
    }, []);

    useEffect(() => {
        setTotalInfosAfterChangeSelectedChallanList(selectedChallanList);
    }, [selectedChallanList]);

    const setTotalInfosAfterChangeSelectedChallanList = (selectedChallans) => {
        let totalAmount = 0.0;
        let totalDiscount = 0.0;
        let totalVat = 0.0;
        let grandTotal = 0.0;
        selectedChallans.map(c => {
            c.productList.map(p => {
                totalAmount += Number(p.price);
                totalDiscount += Number(p.discount_value);
                totalVat += Number(p.vat_amount);
                grandTotal += Number(p.invoice_amount);
            });
        });
        setTotalInofs({
            ...totalInofs,
            totalAmount: totalAmount,
            totalDiscount: totalDiscount,
            totalVat: totalVat,
            grandTotal: grandTotal,
            totalAfterDiscount: grandTotal,
            invoiceDiscountValue: 0,
            invoiceDiscount: 0,
            invoiceDiscountType: 'PERCENTAGE',
        });
    }

    const getTermsAndConditions = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/terms-and-conditions/get-by-company/${companyId}`;
        axios.get(URL).then(response => {
            if (response.data.data !== null) {
                setTermsAndConditions(response.data.data);
            }
        }).catch(err => {

        });
    }

    const getDistributorLogo = (distributorId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/logo/${distributorId}`;
        axios.get(URL).then(response => {
            const logo = response.data;
            setDistributorLogo(logo);
        }).catch(err => {

        });
    }

    const locationHierarchyListLowToHighList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location/get-down-to-up-location-hierarchy/${params.companyId}/${params.distributorId}`;
        axios.get(URL).then(response => {
            const locationList = response.data.data.reverse();
            setLocationHierarchyListLowToHigh(locationList);
        }).catch(err => {

        });
    }

    const handleBackToListPage = () => {
        routeHistory.push('/inventory/stock/sales-order/invoice-list');
    }

    const handleSelectPaymentNature = (event, number) => {
        // FOR SELECTED CARD BTN
        let id = "id-" + number;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('order-list-div');
        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('select-order-list');
        }

        // FOR RADIO BTN
        let radioId = "radio-id-" + number;
        const getRadioId = document.getElementById(radioId);
        var cbs = document.getElementsByClassName("all-radio");
        for (var i = 0; i < cbs.length; i++) {
            cbs[i].checked = false;
        }

        if (getId) {
            getId.classList.add('select-order-list');
            getRadioId.checked = true;
        }
        if (getId.getAttribute("name") === "CREDIT") {
            setSelectedPaymentNature(paymentNature.credit);
            getChallanListByParams({...distributorInfo, invoiceNatureId: paymentNature.credit});
            setInvoiceTypeDisable(true);
            document.getElementById("discountCard").style.backgroundColor = "#F3F6F9";
            document.getElementById("invoiceLebel").style.color = "#B4BED7";
            document.getElementById("discountInput").style.color = "#B4BED7";
        } else {
            setSelectedPaymentNature(paymentNature.cash);
            getChallanListByParams({...distributorInfo, invoiceNatureId: paymentNature.cash});
            setInvoiceTypeDisable(false);
            document.getElementById("discountCard").style.backgroundColor = "white";
            document.getElementById("invoiceLebel").style.color = "black";
            document.getElementById("discountInput").style.color = "black";
        }
    }

    const getChallanListByParams = (params) => {
        let queryParams = 'companyId=' + params.companyId;
        queryParams += '&invoiceNatureId=' + params.invoiceNatureId;
        queryParams += '&distributorId=' + params.distributorId;
        queryParams += '&accountingYearId=' + params.accountingYearId;
        const URL = `${process.env.REACT_APP_API_URL}/api/delivery-challan/get-all-delivery-challan-list?` + queryParams;
        axios.get(URL).then(response => {
            let challanList = response.data.data;
            setDeliveryChallanList(challanList);
            setTotalDeliveryChallanNo(challanList.length);
            setSelectedChallanList([]);
        }).catch(err => {

        });
    }

    const handleSelectDeliveryChallan = (number, challnInfo) => {
        // FOR SELECTED CARD BTN
        let id = "delivery-challan-id-" + number;
        const getId = document.getElementById(id);
        // FOR RADIO BTN
        let radioId = "delivery-challan-radio-id-" + number;
        const getRadioId = document.getElementById(radioId);
        if (getId.className == "mt-5 select-order-list") { // uncheck challan card
            getId.classList.remove('select-order-list');
            getRadioId.checked = false;

            let temp = [...selectedChallanList];
            let index = temp.findIndex((obj) => obj.delivery_challan_id === challnInfo.delivery_challan_id);
            temp.splice(index, 1);
            setSelectedChallanList(temp);
        } else {  // check challan card
            getId.classList.add('select-order-list');
            getRadioId.checked = true;
            getProductListByChallanId(challnInfo);
        }
    }

    const getProductListByChallanId = (challnInfo) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-invoice/get-all-invoiceable-products/` + challnInfo.delivery_challan_id;
        axios.get(URL).then(response => {
            let productList = response.data.data;
            challnInfo.productList = productList;
            setSelectedChallanList(oldChallanInfo => [...oldChallanInfo, challnInfo]);
        }).catch(err => {

        });
    }

    const onChangeRemarks = (event) => {
        let value = event.target.value
        setInvoiceRemarks(value);
    }

    const onChangeInvoiceDiscountValue = (event) => {
        let value = event.target.value
        let v = value.split(".");
        if (v.length > 2) {   // multiple . handle
            return;
        } else if (isNaN(v[0])) {
            return;
        } else if (v[1] === '') {
            setTotalInofs({
                ...totalInofs,
                invoiceDiscountValue: value
            });
            return;
        } else if (v[1] !== undefined && isNaN(v[1])) {
            return;
        } else if (!isNaN(v[1]) && v[1].length > 2) {
            return;
        }

        let disAmount = Number(value);
        let totalInvoiceAmount = Number(totalInofs.totalAmount - totalInofs.totalDiscount - totalInofs.totalVat).toFixed(2);
        if (totalInofs.invoiceDiscountType === 'EQUAL') {

            if (disAmount > totalInvoiceAmount) {
                showError("Invoice Discount cannot greater than Invoice Amount");
                return;
            }
            setTotalInofs({
                ...totalInofs,
                invoiceDiscountValue: disAmount,
                invoiceDiscount: disAmount,
                totalAfterDiscount: totalInofs.grandTotal - Number(value)
            });
        } else {   // for %
            if (disAmount > 100) {
                showError("Invoice Discount cannot greater than 100%");
                return;
            }
            let discount = (totalInvoiceAmount * disAmount) / 100;
            setTotalInofs({
                ...totalInofs,
                invoiceDiscountValue: disAmount,
                invoiceDiscount: discount,
                totalAfterDiscount: totalInofs.grandTotal - discount
            });
        }
    }

    const onChangeInvoiceDiscount = (event) => {
        setTotalInofs({
            ...totalInofs,
            invoiceDiscountValue: 0,
            invoiceDiscount: 0,
            totalAfterDiscount: totalInofs.grandTotal,
            invoiceDiscountType: event.target.value
        });
    }

    const handleSave = () => {
        if (!isVatValidate()) {
            return;
        }
        let invoiceObj = getInvoiceObjForCreate();
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-invoice`;
        axios.post(URL, JSON.stringify(invoiceObj), {headers: {"Content-Type": "application/json"}}).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                handleBackToListPage();
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const getInvoiceObjForCreate = () => {
        let invoiceObj = {};
        invoiceObj.invoiceAmount = totalInofs.grandTotal;
        invoiceObj.vatAmount = totalInofs.totalVat;
        invoiceObj.discountAmount = totalInofs.totalDiscount;
        invoiceObj.invoiceDiscount = totalInofs.invoiceDiscount;
        invoiceObj.remarks = invoiceRemarks;
        invoiceObj.invoiceNatureId = selectedPaymentNature;
        invoiceObj.companyId = distributorInfo.companyId;
        invoiceObj.termsAndConditionsId = termsAndConditions.id;
        invoiceObj.distributorId = distributorInfo.distributor_id;
        if(selectedPaymentNature === paymentNature.cash){
            invoiceObj.invoiceDiscountType = totalInofs.invoiceDiscountType;     
        } else{
            invoiceObj.invoiceDiscountType = "";     
        }        
        invoiceObj.deliveryChallanIds = selectedChallanList.map(c => c.delivery_challan_id);
        return invoiceObj;
    }

    const isVatValidate = () => {
        if (selectedChallanList.length === 0) {
            showError("No Delivery Challan is Selected");
            return false;
        }
        return true;
    }

    return (<>
        {/* BREAD CRUM ROW */}
        <div>
            <InventoryBreadCrum/>
        </div>

        {/* HEADER ROW */}
        <div>
            <Card>
                <CardBody>
                    {/* BACK AND TITLE ROW */}
                    <div className="row">
                        <div className="col-4">
                                <span>
                                    <button className='btn' onClick={handleBackToListPage}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                        </strong>
                                    </button>
                                </span>
                        </div>
                        <div className="col-4 text-center mt-3">
                            <strong>CREATE INVOICE</strong>
                        </div>
                    </div>

                    {/* HEADER ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-8'>
                            <div className="row">
                                {locationHierarchyListLowToHigh.map((location, index) => (
                                    <div key={index} className="col-3">
                                            <span className="dark-gray-color"
                                                  style={{fontWeight: "500"}}>{location.locationType.name}</span><br/>
                                        <span><strong>{location.name}</strong></span>
                                    </div>))}
                                <div className="col-3">
                                        <span className="dark-gray-color"
                                              style={{fontWeight: "500"}}>Timeline</span><br/>
                                    <span><strong>{distributorInfo.selectedTimelineName}</strong></span>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-4 d-flex justify-content-end'>
                            <div className="d-flex  mr-5">
                                <div>
                                    <img className="image-input image-input-circle"
                                         src={distributorLogo === undefined || distributorLogo === "" || distributorLogo === null ? distributorImg : `data:image/png;base64,${distributorLogo}`}
                                         width="35px" height="35px" alt='Distributor’s Picture'/>
                                </div>
                                <div className="ml-3">
                                        <span>
                                            <span
                                                style={{fontWeight: "500"}}><strong>{distributorInfo.distributor_name}</strong></span>
                                            <p><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")}
                                                    width="14px" height="14px"/>&nbsp;{distributorInfo.contact_no}</p>
                                        </span>
                                </div>
                            </div>
                            <div>
                                <button className='btn sales-credit-btn'
                                        style={{padding: "0px 15px", borderRadius: "13px"}}>
                                        <span className='text-white' style={{fontSize: "0.83rem"}}>
                                            Balance<br/>
                                            {Number(distributorInfo.ledger_balance).toLocaleString('en-US', {minimumFractionDigits: 2})}
                                        </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>

        {/* MAIN CONTENT ROW */}
        <div className="row mt-5">

            {/* PAYMENT NATURE ROW */}
            <div className="col-xl-2">
                {/* PAYMENT NATURE TITLE */}
                <Card style={{borderTopRightRadius: "30px", borderTopLeftRadius: "30px"}}>
                    <CardBody>
                        <div>
                            <span className="text-muted">Title</span><br/>
                            <strong>Payment Nature</strong>
                        </div>
                    </CardBody>
                </Card>

                {/* CREDIT ROW */}
                <div className="mt-5 order-list-div" name="CREDIT" style={{cursor: "pointer"}}
                     onClick={(event) => handleSelectPaymentNature(event, 0)} id={"id-" + 0}>
                    <Card className="mt-5 p-3">
                        <CardBody>
                            <div className="position-absolute" style={{left: "17px", top: "43px"}}>
                                <span><input className="all-radio" type="radio" id={"radio-id-" + 0}/></span>
                            </div>
                            <div>
                                <strong className="h6">Credit</strong>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* CASH ROW */}
                <div className="mt-5 order-list-div" name="CASH" style={{cursor: "pointer"}}
                     onClick={(event) => handleSelectPaymentNature(event, 1)} id={"id-" + 1}>
                    <Card className="mt-5 p-3">
                        <CardBody>
                            <div className="position-absolute" style={{left: "17px", top: "43px"}}>
                                <span><input className="all-radio" type="radio" id={"radio-id-" + 1}/></span>
                            </div>
                            <div>
                                <strong className="h6">Cash</strong>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* DELIVERY CHALLAN ROW */}
            <div className="col-xl-3">
                {/* DELIVERY CHALLAN TITLE */}
                <Card style={{borderTopRightRadius: "30px", borderTopLeftRadius: "30px"}}>
                    <CardBody>
                        <div className="row no-gutters">
                            <div className="col-10">
                                <span className="text-muted">Title</span><br/>
                                <strong>Delivery Challan</strong>
                            </div>
                            <div className="col-2">
                                <div className="position-absolute font-12" style={{left: "15px", top: "20px"}}>
                                    <strong>{totalDeliveryChallanNo}</strong></div>
                                <CircularProgress className="mt-2" variant="static" value={100}/>
                            </div>
                        </div>
                        <div>
                            <span className="text-muted"><strong>DELIVERY CHALLAN LIST</strong></span>
                        </div>
                    </CardBody>
                </Card>

                {/* DELIVERY CHALLAN LIST ROW */}
                {deliveryChallanList.map((challan, index) => (
                    <div key={index} className="mt-5" style={{cursor: "pointer"}}
                         onClick={() => handleSelectDeliveryChallan(index, challan)}
                         id={"delivery-challan-id-" + index}>
                        <Card className="p-3">
                            <CardBody>
                                <div className="position-absolute" style={{left: "17px", top: "43px"}}>
                                    <span><input type="radio" id={"delivery-challan-radio-id-" + index}/></span>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <span className="dark-gray-color">Challan No.</span><br/>
                                        <strong className="h6">{challan.challan_no}</strong>
                                    </div>
                                    <div className="col-6">
                                        <span className="dark-gray-color">Booking No.</span><br/>
                                        <strong className="h6">{challan.booking_no}</strong>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-6">
                                        <span className="dark-gray-color">Order No.</span><br/>
                                        <strong className="h6">{challan.order_no}</strong>
                                    </div>
                                    <div className="col-6">
                                        <span className="dark-gray-color">Booking Date</span><br/>
                                        <strong className="h6">{challan.booking_date}</strong>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-6">
                                        <span className="dark-gray-color">Delivery Date</span><br/>
                                        <strong className="h6">{challan.delivery_date}</strong>
                                    </div>
                                    <div className="col-6">
                                        <span className="dark-gray-color">Booking Note</span><br/>
                                        <strong className="h6">{challan.booking_note}</strong>
                                    </div>                                    
                                </div>
                            </CardBody>
                        </Card>
                    </div>))}

            </div>
            {/* NEW INVIOCE ROW */}
            <div className="col-xl-7">
                {/* NEW INVOICE TITLE */}
                <Card style={{borderTopRightRadius: "30px", borderTopLeftRadius: "30px"}}>
                    <CardBody>
                        <div>
                            <span className="text-muted">Invoice No.</span><br/>
                            <strong>Auto Generated</strong>
                        </div>
                        <div className="row no-gutters mt-5">
                            <div className="col-6">
                                <span className="text-muted"><strong>PRODUCTS</strong></span>
                            </div>
                            <div className="col-6">
                                <span className="text-muted float-right"><strong>ACTION</strong></span>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* NEW INVOICE DATA ROW */}
                {selectedChallanList.map((challan, index) => (<Card key={index} className="mt-4">
                    <CardBody>
                        <div className="d-flex">
                            <div className="ml-n3 mt-3"><span
                                className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                            <div className="w-100 pl-5">
                                {/* CHALLAN NO ROW */}
                                <div className="mt-3">
                                    <span className="text-muted mr-1">Challan No.</span>
                                    <strong>{challan.challan_no}</strong>
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th className="text-center" scope="col">SL No.</th>
                                            <th className="text-center" scope="col">PRODUCT INFO</th>
                                            <th className="text-center" scope="col">QTY</th>
                                            <th className="text-center" scope="col">PRICE</th>
                                            <th className="text-center" scope="col">DISCOUNT</th>
                                            <th className="text-center" scope="col">VAT</th>
                                            <th className="text-center" scope="col">TOTAL</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {challan.productList.map((product, index) => (<tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                <span className="text-muted">{product.product_sku}</span><br/>
                                                <strong>{product.product_name + " " + product.item_size + " " + product.uom + " * " + product.pack_size}</strong><br/>
                                                <span
                                                    className="text-muted">{product.product_category_name}</span><br/>
                                            </td>
                                            <td className="text-center">
                                                <strong>{product.product_quantity}</strong></td>
                                            <td className="text-right">
                                                <strong>{amountFormatterWithoutCurrency(Number(product.unit_price))}</strong>                           
                                            </td>
                                            <td className="text-right">
                                                <strong>-{amountFormatterWithoutCurrency(Number(product.discount_value))}</strong>
                                            </td>
                                            <td>
                                                <div>
                                                    <strong className="text-right">
                                                        {product.vat_included === null ? '0' : Number(product.vat_amount).toFixed(2)}
                                                    </strong>
                                                    <br/>
                                                    <span className="text-muted">
                                                        {product.vat_included === null ? '' : product.vat_included ? '(Inc.)' : '(Exc.)'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                {/* <strong>{Number(product.invoice_amount).toFixed(2)}</strong> */}
                                                <strong>{Math.round(Number(product.invoice_amount)).toLocaleString()}</strong>
                                            </td>
                                        </tr>))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>))}
                {/* TERMS AND CONDITIONS ROW */}
                <Card className="mt-5" id="discountCard">
                    <CardBody>
                        <div className="d-flex flex-wrap">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       checked={totalInofs.invoiceDiscountType === 'PERCENTAGE'}
                                       id="percent-radio" value="PERCENTAGE" onChange={onChangeInvoiceDiscount} disabled={invoiceTypeDisable}/>
                                <label className="form-check-label">Discount in Percent</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       checked={totalInofs.invoiceDiscountType === 'EQUAL'}
                                       id="equal-radio" value="EQUAL" onChange={onChangeInvoiceDiscount} disabled={invoiceTypeDisable}/>
                                <label className="form-check-label">Discount in Amount</label>
                            </div>                           
                        </div>
                        <div className="row mt-5">
                            <div className="col-xl-3 mt-3">
                                <label id="invoiceLebel" className="level-title">Invoice Discount</label>
                            </div>
                            <div className="col-xl-9">
                                <input id="discountInput" className="form-control" type="text" value={totalInofs.invoiceDiscountValue}
                                       onChange={onChangeInvoiceDiscountValue} disabled={invoiceTypeDisable}/>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                {/* TERMS AND CONDITIONS ROW */}
                <Card className="mt-5">
                    <CardBody>
                        <div>
                            <label>Terms & Conditions</label>
                            <textarea disabled={true} type="text" className="form-control" rows="5"
                                      value={termsAndConditions.termsAndConditions}
                                      placeholder="Terms And Conditions"/>
                        </div>
                    </CardBody>
                </Card>
                {/* SUB TOTAL CARD */}
                <Card className="mt-4" style={{borderBottomRightRadius: "30px", borderBottomLeftRadius: "30px"}}>
                    <CardBody>
                        {/* SUB TOTAL ROW */}
                        <div className="mt-3">
                            <strong>Total Amount</strong>
                            <strong className="float-right">
                                {/* {totalInofs.totalAmount.toFixed(2)} */}
                                {Math.round(totalInofs.totalAmount).toLocaleString()}
                            </strong>
                        </div>

                        {/* DISCOUNT ROW */}
                        <div className="mt-3">
                            <span>Total Product Discount</span>
                            <span className="float-right dark-success-color">
                                    <strong>
                                        {/* -{totalInofs.totalDiscount.toFixed(2)} */}
                                        -{Math.round(totalInofs.totalDiscount).toLocaleString()}
                                    </strong>
                                </span>
                        </div>

                        {/* DISCOUNT ROW */}
                        <div className="mt-3">
                            <span>Total Invoice Discount</span>
                            <span className="float-right dark-success-color">
                                    <strong>
                                        {/* -{totalInofs.invoiceDiscount.toFixed(2)} */}
                                        -{Math.round(totalInofs.invoiceDiscount).toLocaleString()}
                                    </strong>
                                </span>
                        </div>

                        {/* VAT ROW */}
                        <div className="mt-3">
                            <span>Total VAT</span>
                            <span className="float-right">
                                    <strong>
                                        {/* {totalInofs.totalVat.toFixed(2)} */}
                                        {Math.round(totalInofs.totalVat).toLocaleString()}
                                    </strong>
                                </span>
                        </div>

                        <div className="mt-5" style={{border: "1px solid #4F4F4F", width: "100%"}}></div>

                        {/* TOTAL ROW */}
                        <div className="mt-3">
                            <strong>Total</strong>
                            <strong
                                className="float-right">
                                    {/* {typeof totalInofs.totalAfterDiscount === 'number' ? totalInofs.totalAfterDiscount.toFixed(2) : totalInofs.totalAfterDiscount} */}
                                    {typeof totalInofs.totalAfterDiscount === 'number' ? Math.round(totalInofs.totalAfterDiscount).toLocaleString() : totalInofs.totalAfterDiscount}
                                    </strong>
                        </div>
                        <div className="mt-5">
                            <label>Remarks</label>
                            <textarea type="text" className="form-control" rows="2" name="invoiceRemarks"
                                      value={invoiceRemarks} onChange={onChangeRemarks}
                                      placeholder="Write Remarks Here within 250 characters"/>
                        </div>
                        <div className="mt-5">
                            <button className="btn dark-danger-color" onClick={handleBackToListPage}
                                    style={{background: "#F9F9F9", color: "#0396FF"}}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")}/>
                                &nbsp;<strong>Cancel Invoice</strong>
                            </button>
                            <button className="btn text-white mr-3 float-right" style={{background: "#6FCF97"}}
                                    onClick={handleSave}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-approved.svg")}/>
                                &nbsp;<strong>Create Invoice</strong>
                            </button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    </>);
}