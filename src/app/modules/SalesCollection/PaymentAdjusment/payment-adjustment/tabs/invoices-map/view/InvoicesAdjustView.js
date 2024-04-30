import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../_metronic/_partials/controls";
import PaymentAdjustmentBreadCrum from '../../../../common/PaymentAdjustmentBreadCrum';
import { useHistory } from 'react-router-dom';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import { showError, showSuccess } from "../../../../../../../pages/Alert";
//import { ContactSupportOutlined } from "@material-ui/icons";
//import { current } from "@reduxjs/toolkit";
import { allowOnlyNumeric, amountFormatterWithoutCurrency } from "../../../../../../Util";

export default function InvoicesAdjustView(props) {
    let history = useHistory();
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const [fiscalYear, setFiscalYear] = useState([]);
    const [distributor, setDistributor] = useState(null);
    const [distributorId, setDistributorId] = useState(null);
    const [fiscalYearId, setFiscalYearId] = useState('');
    const [data, setData] = useState(null);
    const [region, setRegion] = useState(null);
    const [area, setArea] = useState(null);
    const [territory, setTerritory] = useState(null);
    const [invoiceList, setInvoiceList] = useState([]);
    const [paymentList, setPaymentList] = useState([]);
    const [paymentSumAmount, setPaymentSumAmount] = useState(0);
    const [invoiceSumAmount, setInvoiceSumAmount] = useState(0);
    const [adjustablePayment, setAdjustablePayment] = useState(null);
    const [adjustedInvoiceList, setAdjustedInvoiceList] = useState([]);
    // const [locationHierarchy, setLocationHierarchy] = useState([]);
    const [balanceAmount, setBalanceAmount] = useState(0);
    const [distributorLogo, setDistributorLogo] = useState("");
    const [distributorImg, setDistributorImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));

    const [ordAmountOpening, setOrdAmountOpening] = useState(0);

    useEffect(() => {
        if (props.location.state.data) {
            setDistributorId(props.location.state.data.id);
            setData(props.location.state.data);
        }
    }, []);

    useEffect(() => {
        if (distributorId) {
            getDistributor();
            getDistributorLocationHierarchy();
            getDistributorLogo(distributorId);
            getPaymentList();
        }
        getFiscalYear();
    }, [companyId, distributorId]);

    useEffect(() => {
        setTerritory(distributor?.distributorLocation);
        setArea(distributor?.parentLocation);
        setRegion(distributor?.parentLocation?.parent);
    }, [distributor]);

    useEffect(() => {
        if (distributorId) {
            getPaymentList();
        }

    }, [fiscalYearId]);

    useEffect(() => {
        if (invoiceList.length > 0) {
            doAdjustment();
        }
    }, [invoiceList]);

    const getDistributor = () => {
        let URL = `${process.env.REACT_APP_API_URL}/api/distributor/info`;
        URL += '?companyId=' + companyId;
        URL += '&distributorId=' + Number(distributorId);
        if (distributorId && distributorId > 0) {
            axios.get(URL).then(response => {
                setDistributor(response.data.data);
            });
        }
    }

    const getDistributorLocationHierarchy = () => {
        let URL = `${process.env.REACT_APP_API_URL}/api/location/get-down-to-up-location-hierarchy`;
        URL += '/' + companyId;
        URL += '/' + Number(distributorId);
        if (distributorId && distributorId > 0) {
            axios.get(URL).then(response => {
                if (response?.data?.data) {
                    const locations = response.data.data;
                    const dataLength = locations.length;
                    if (dataLength >= 1) {
                        setTerritory(locations[0]);
                    }
                    if (dataLength >= 2) {
                        setArea(locations[1]);
                    }
                    if (dataLength >= 3) {
                        setRegion(locations[2]);
                    }
                }
            });
        }
    }

    const getDistributorLogo = (distributorId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/logo/${distributorId}`;
        if (distributorId) {
            axios.get(URL).then(response => {
                const logo = response.data;
                setDistributorLogo(logo);
            }).catch(err => {

            });
        }
    }

    const getFiscalYear = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/` + companyId
        if (companyId) {
            axios.get(URL).then(response => {
                setFiscalYear(response.data.data);
            });
        }
    }

    const getPaymentList = () => {
        let URL = `${process.env.REACT_APP_API_URL}/api/payment-collection-adjustment/payment-list-by-distributor`;
        URL += '?companyId=' + companyId;
        URL += '&distributorId=' + Number(distributorId);
        URL += '&fiscalYearId=' + fiscalYearId;
        axios.get(URL).then(response => {
            if (response.data.data && response.data.data.length > 0) {

                const paymentListFilter = [];

                for (const payment of response.data.data) {
                    if (payment.adjustType === 'RETURN') {
                        if (payment.paymentAdjustedAmount > 0
                            && payment.paymentAdjustedAmount >= payment.remainingAmount) {
                            // adjusted amount > 0 && adjusted amount > return amount 
                            //put in payment list for adjust
                            paymentListFilter.push(payment);
                            payment.paymentAdjustedAmount = payment.paymentAdjustedAmount-payment.remainingAmount;
                        }
                        else if (payment.paymentAdjustedAmount > 0
                            && payment.remainingAmount > payment.paymentAdjustedAmount) {
                            //else if adjusted amount > 0 && return amount>adjusted amount
                            //remainAdjustAmount = return amount - adjusted amount
                            //put in payment list for adjust
                            let remainAdjustAmount = payment.remainingAmount - payment.paymentAdjustedAmount;
                            payment.remainingAmount = remainAdjustAmount;
                            paymentListFilter.push(payment);
                        }
                    }
                    else
                        paymentListFilter.push(payment);
                }
                setPaymentList(paymentListFilter);
                const paymentSum = response.data.data.reduce((accumulator, object) => {
                    return accumulator + object.remainingAmount;
                }, 0);
                setPaymentSumAmount(paymentSum);

                // const output = response.data.data.reduce((prev, object) => {
                //     prev[object.paymentNo] = prev[object.paymentNo] ? prev[object.paymentNo] + object.remainingAmount : object.remainingAmount;
                //     return prev;
                // }, {});

                // Object.entries(output).forEach(([key, value], index) => {
                //     const paymentInfo = response.data.data[index];
                //     if (paymentInfo.adjustType === 'RETURN'
                //         && paymentInfo.paymentNo === key) {
                //         if (paymentInfo.paymentAdjustedAmount > 0 && paymentInfo.paymentAdjustedAmount > value) {
                //         }
                //     }
                // });

            } else {
                setPaymentList([]);
                setPaymentSumAmount(0);
            }
            setInvoiceList([]);
            setAdjustablePayment(null);
            setBalanceAmount(0);
            setInvoiceSumAmount(0);
            setOrdAmountOpening(0);

            for (const paymentItem of document.querySelectorAll('.payment-check')) {
                paymentItem.checked = false;
            }
        });
    }

    const getInvoiceList = (paymentId, adjustType) => {
        let URL = `${process.env.REACT_APP_API_URL}/api/payment-collection-adjustment/invoice-list-by-distributor`;
        URL += '?companyId=' + companyId;
        URL += '&distributorId=' + Number(distributorId);
        URL += '&paymentId=' + Number(paymentId);
        URL += '&adjustType=' + adjustType;
        URL += '&fiscalYearId=' + fiscalYearId;
        axios.get(URL).then(response => {
            setInvoiceList(response.data.data);
            const invoiceSum = response.data.data.reduce((accumulator, object) => {
                return accumulator + object.remainingAmount;
            }, 0);
            setInvoiceSumAmount(invoiceSum);
        });
    }

    const getOpeningInvoiceList = (adjustType) => {
        let URL = `${process.env.REACT_APP_API_URL}/api/payment-collection-adjustment/invoice-list-opening-by-distributor`;
        URL += '?companyId=' + companyId;
        URL += '&distributorId=' + Number(distributorId);
        URL += '&adjustType=' + adjustType;
        URL += '&fiscalYearId=' + fiscalYearId;
        axios.get(URL).then(response => {
            //setOpeningInvoiceList(response.data.data);
        });
    }

    const fiscalYearChangeHandler = (e) => {
        const value = e.target.value;
        setFiscalYearId(value ? value : '');
    }

    const handlePaymentCheck = (e) => {
        const isChecked = e.target.checked;
        const value = e.target.value;

        for (const paymentItem of document.querySelectorAll('.payment-check')) {
            paymentItem.checked = false;
        }
        e.target.checked = isChecked;

        if (isChecked) {
            const selectedPayment = paymentList.find(obj => obj.id == value);
            setAdjustablePayment(selectedPayment);
            getInvoiceList(value, selectedPayment.adjustType);

        } else {
            setAdjustablePayment(null);
            setInvoiceList([]);
            setAdjustedInvoiceList([]);
            setBalanceAmount(0);
            setInvoiceSumAmount(0);
        }
    }

    const doAdjustment = () => {
        let adjustableAmount = adjustablePayment ? adjustablePayment.remainingAmount : 0;
        const invoiceAdjustmentList = [];
        for (const invoice of invoiceList) {
            if (adjustableAmount > 0 && (invoice.remainingAmount - invoice.ordAmount) <= adjustableAmount) {
                document.getElementById('invoiceCheck-' + invoice.dataId).checked = true;
                adjustableAmount -= invoice.remainingAmount - invoice.ordAmount;
                invoice.adjustedAmount = invoice.remainingAmount - invoice.ordAmount;
                invoice.adjustedAmountDup = invoice.remainingAmount - invoice.ordAmount;
                invoiceAdjustmentList.push(invoice);
            } else if (adjustableAmount > 0 && (invoice.remainingAmount - invoice.ordAmount) >= adjustableAmount) {
                document.getElementById('invoiceCheck-' + invoice.dataId).checked = true;
                invoice.ordAmount = ((adjustableAmount / 100) * invoice.ord) //added new
                invoice.adjustedAmount = adjustableAmount;
                invoice.adjustedAmountDup = adjustableAmount;
                adjustableAmount = 0;
                invoiceAdjustmentList.push(invoice);
            } else {
                document.getElementById('invoiceCheck-' + invoice.dataId).checked = false;
            }
        }
        setBalanceAmount(adjustableAmount);
        setAdjustedInvoiceList(invoiceAdjustmentList);
    }

    const handleInvoiceCheck = (e) => {
        const isChecked = e.target.checked;
        const value = e.target.value;
        const selectedInvoice = invoiceList.find(obj => obj.dataId == value);
        if (isChecked) {
            if (balanceAmount == 0) {
                e.target.checked = false;
                showError('Insufficiant balance.');
                return;
            }

            if (balanceAmount > 0 && balanceAmount >= selectedInvoice.remainingAmount - selectedInvoice.ordAmount) {
                selectedInvoice.adjustedAmount = selectedInvoice.remainingAmount - selectedInvoice.ordAmount;
                selectedInvoice.adjustedAmountDup = selectedInvoice.remainingAmount - selectedInvoice.ordAmount;
                setBalanceAmount(amount => amount - selectedInvoice.adjustedAmount);
            } else if (balanceAmount > 0 && balanceAmount <= selectedInvoice.remainingAmount - selectedInvoice.ordAmount) {
                setBalanceAmount(amount => amount - balanceAmount);
                selectedInvoice.adjustedAmount = balanceAmount;
                selectedInvoice.adjustedAmountDup = balanceAmount
            }

            const tempAdjustedInvoiceList = [...adjustedInvoiceList];
            tempAdjustedInvoiceList.push(selectedInvoice)

            setAdjustedInvoiceList(tempAdjustedInvoiceList);
        } else {
            const selectedInvoiceIndex = adjustedInvoiceList.findIndex(obj => obj.dataId == value);
            if (selectedInvoiceIndex == -1) {
                showError('Invoice not found');
                return;
            }
            if (selectedInvoice.isOpeningBalance === 'Y') {
                //for opening ord refresh
                //setBalanceAmount(amount => amount + (selectedInvoice.adjustedAmount - balanceAmount));
                setBalanceAmount(amount => amount + selectedInvoice.adjustedAmount);
                selectedInvoice.ordAmount = 0;
                selectedInvoice.ord = 0;
            }
            else {
                setBalanceAmount(amount => amount + selectedInvoice.adjustedAmount);
            }

            adjustedInvoiceList.splice(selectedInvoiceIndex, 1);
        }
    }

    const doAdjustmentSubmit = () => {

        if (!adjustablePayment) {
            showError('Payment not selected!');
            return;
        }

        if (adjustedInvoiceList.length == 0) {
            showError('Invoice not selected!');
            return;
        }

        if (adjustablePayment.remainingAmount - balanceAmount <= 0) {
            showError('Adjusted amount must be greater than 0!');
            return;
        }

        let data = {};
        data.companyId = companyId;
        data.adjustedAmount = adjustablePayment.remainingAmount - balanceAmount;
        data.adjustedPayment = adjustablePayment;
        data.adjustedInvoiceList = adjustedInvoiceList;

        const URL = `${process.env.REACT_APP_API_URL}/api/payment-collection-adjustment`;
        axios.post(URL, data).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                getPaymentList();

                setAdjustedInvoiceList([]);
                setBalanceAmount(0);
                setInvoiceSumAmount(0);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const handleOpeningBalanceOrd = (e, data, index) => {
        let ordPercent = Number(e.target.value ? e.target.value : 0);
        let aIL = [...adjustedInvoiceList];

        let openingOrdAmount = ordPercent > 0 ? ((Number(aIL[index].adjustedAmountDup) / 100) * ordPercent) : 0;
        if (!ordPercent || ordPercent <= 0 || ordPercent > 100) {
            showError("Commission must be between 1 to 100");
            aIL[index].ordAmount = 0;
            aIL[index].adjustedAmount = aIL[index].adjustedAmountDup;
            setAdjustedInvoiceList(aIL);
            document.getElementById('ordSelected-' + data.dataId).value = '';
        }

        let adjustedAmount = aIL[index].adjustedAmountDup === aIL[index].remainingAmount
            ? aIL[index].adjustedAmountDup - openingOrdAmount : aIL[index].adjustedAmountDup;

        aIL[index].ord = ordPercent;
        aIL[index].ordAmount = openingOrdAmount;
        aIL[index].adjustedAmount = adjustedAmount;
        setAdjustedInvoiceList(aIL);

        let openingOrdAmtTotal = 0;
        adjustedInvoiceList.map((data) => {
            openingOrdAmtTotal = data.isOpeningBalance === 'Y' && data.dataId !== aIL[index].id
                ? openingOrdAmtTotal + data.ordAmount
                : 0;
            setOrdAmountOpening(openingOrdAmtTotal);
        })

        let adjustableAmount = adjustablePayment ? adjustablePayment.remainingAmount : 0;
        for (const invoice of adjustedInvoiceList) {
            if (adjustableAmount > 0 && (invoice.remainingAmount - invoice.ordAmount) <= adjustableAmount) {
                adjustableAmount -= invoice.remainingAmount - invoice.ordAmount;
            } else if (adjustableAmount > 0 && (invoice.remainingAmount - invoice.ordAmount) >= adjustableAmount) {
                adjustableAmount = 0;
            } else {
            }
        }
        setBalanceAmount(adjustableAmount + openingOrdAmtTotal);
    }

    const handleBackToInvoicesMapListPage = () => {
        history.push('/salescollection/payment-adjustment/payment-adjustment/invoices-map');
    }

    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <PaymentAdjustmentBreadCrum />
            </div>

            <div>
                <Card>
                    <CardBody>
                        {/* BACK AND TITLE ROW */}
                        <div className="row">
                            <div className="col-4">
                                <span>
                                    <button className='btn' onClick={handleBackToInvoicesMapListPage}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                        </strong>
                                    </button>
                                </span>
                            </div>
                            <div className="col-4 text-center mt-3">
                                <strong>Payment Adjustment</strong>
                            </div>
                            <div className="col-4 text-xl-right text-muted mt-3">
                                <strong>{moment(new Date()).format('DD-MMM-YYYY kk:mm:ss')}</strong>
                            </div>
                        </div>

                        {/* HEADER ROW */}
                        <div className='d-flex flex-wrap justify-content-between mt-5'>

                            <div className="row w-75">
                                <div className="col-xl-3">
                                    <span className="dark-gray-color" style={{ fontWeight: "500" }}>
                                        {region && region.locationType.name}
                                    </span><br />
                                    <span><strong>
                                        {region && region.name}
                                    </strong></span>
                                </div>
                                <div className="col-xl-3">
                                    <span className="dark-gray-color" style={{ fontWeight: "500" }}>
                                        {area && area.locationType.name}
                                    </span><br />
                                    <span><strong>
                                        {area && area.name}
                                    </strong></span>
                                </div>
                                <div className="col-xl-2">
                                    <span className="dark-gray-color" style={{ fontWeight: "500" }}>
                                        {territory && territory?.locationType?.name}
                                    </span><br />
                                    <span><strong>
                                        {territory && territory?.name}
                                    </strong></span>
                                </div>
                                <div className="col-xl-4">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>Timeline</span>
                                    <span>
                                        <select className="form-control border-0 ml-n5 payment-collection-invoices-select"
                                            onChange={fiscalYearChangeHandler}>
                                            <option value="" selected>All</option>
                                            {fiscalYear && fiscalYear.map((data) =>
                                                (<option key={data.id} value={data.id}>{data.fiscalYearName}</option>)
                                            )}
                                        </select>
                                    </span>
                                </div>
                            </div>

                            <div className='d-flex flex-wrap'>
                                <div className="d-flex  mr-5">
                                    <div>
                                        {/* <SVG src={toAbsoluteUrl("")} width="35px" height="35px" /> */}
                                        <img className="image-input image-input-circle"
                                            src={distributorLogo === undefined || distributorLogo === "" || distributorLogo === null ? distributorImg : `data:image/png;base64,${distributorLogo}`}
                                            width="35px" height="35px" alt='Distributor’s Picture' />
                                    </div>
                                    <div className="ml-3">
                                        <span>
                                            <span style={{ fontWeight: "500" }}><strong>{data && data.distributor_name}</strong></span>
                                            <div className="d-flex">
                                                <div className="mr-2"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="14px" height="14px" />&nbsp;</div>
                                                <div>{distributor && distributor.info.contactNo}</div>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className='btn sales-credit-btn' style={{ padding: "0px 15px", borderRadius: "13px" }}>
                                        <span className='text-white' style={{ fontSize: "0.83rem" }}>
                                            Balance<br />
                                            {data && amountFormatterWithoutCurrency(data.ledger_balance)}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* CONTENT BODY ROW */}
            <div className="row mt-5">
                <div className="col-xl-8">
                    <div className="row">
                        <div className="col-xl-6">
                            <Card>
                                <CardBody>
                                    <span className="text-muted">PAYMENTS</span>
                                    <span className="float-right mt-n2">
                                        <i class="bi bi-arrow-down-short text-danger" style={{ fontSize: "20px" }}></i>
                                        <span className="mt-n3"><strong>{amountFormatterWithoutCurrency(paymentSumAmount)}</strong></span>
                                    </span>
                                </CardBody>
                            </Card>

                            {paymentList && paymentList.map((data) => (
                                <Card className="mt-2" key={data.id}>
                                    <CardBody>
                                        <div className="row">
                                            <div className="col-1">
                                                <div>
                                                    <input class="text-primary payment-check" type="checkbox" name="paymentCheck" id={'paymentCheck-' + data.id}
                                                        value={data.id} aria-label="..." onClick={handlePaymentCheck} />
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <span className="text-muted"><strong>{data.adjustType == 'PAYMENT' ? 'Money Receipt No.' : 'Return No'} {data.moneyReceiptNo}</strong></span><br />
                                                <span className="text-muted">{data.adjustType !== 'PAYMENT' ? <strong>  Invoice No {data.paymentNo}<br /></strong> : ''}</span>
                                                <span className="text-muted">{data.adjustType === 'PAYMENT' & data.actionTakenDate === null ? <strong>  Reference No {data.referenceNo}<br /></strong> : ''}</span>
                                                <span className="text-muted">{moment(data.paymentDate).format('DD-MMM-YYYY')}</span><br />
                                                <span className="text-muted">Balance</span><br />
                                                <span><strong>{amountFormatterWithoutCurrency(data.remainingAmount)}</strong></span>
                                            </div>
                                            <div className="col-1">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/vertical-dot.svg")} width="15px" height="15px" />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}

                        </div>
                        <div className="col-xl-6">
                            <Card>
                                <CardBody>
                                    <span className="text-muted">INVOICES</span>
                                    <span className="float-right mt-n2">
                                        <i class="bi bi-arrow-down-short text-danger" style={{ fontSize: "20px" }}></i>
                                        <span className="mt-n3"><strong>{amountFormatterWithoutCurrency(invoiceSumAmount)}</strong></span>
                                    </span>
                                </CardBody>
                            </Card>

                            {invoiceList && invoiceList.map((data) => (
                                <Card className="mt-2" key={data.dataId}>
                                    <CardBody>
                                        <div className="row">
                                            <div className="col-1">
                                                <div>
                                                    <input class="text-primary invoice-check" type="checkbox" name="invoiceCheck" id={'invoiceCheck-' + data.dataId}
                                                        value={data.dataId} aria-label="..." onClick={handleInvoiceCheck} />
                                                </div>
                                            </div>
                                            <div className="col-10">
                                                <span className="text-muted"><strong>No. {data.invoiceNo} ({data.invoiceNature})</strong></span><br />
                                                <span className="text-muted">{moment(data.invoiceDate).format('DD-MMM-YYYY')}</span><br />
                                                <div>
                                                    <span className="text-muted">Invoice Amount</span>
                                                    <span className="col-4 text-right"><strong>{amountFormatterWithoutCurrency(data.invoiceAmount)}</strong></span><br />
                                                </div>
                                                <div>
                                                    <span className="text-muted">Balance</span>
                                                    <span className="col-4 text-right"><strong>{amountFormatterWithoutCurrency(data.remainingAmount)}</strong></span>
                                                </div>
                                            </div>
                                            <div className="col-1">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/vertical-dot.svg")} width="15px" height="15px" />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}

                        </div>
                    </div>
                </div>
                <div className="col-xl-4">
                    <Card>
                        <CardBody>
                            <span className="text-muted">ADJUSTABLE</span>
                            <span className="float-right mt-n2">
                                <i class="bi bi-arrow-up-short text-primary" style={{ fontSize: "20px" }}></i>
                                <span className="mt-n3"><strong>{amountFormatterWithoutCurrency(paymentSumAmount)}</strong></span>
                            </span>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody>
                            {/* MONEY RECEIPT NO ROW */}
                            <div>
                                <span className="dark-gray-color font-15">
                                    <strong>Money Receipt No. {adjustablePayment && adjustablePayment.moneyReceiptNo}</strong></span><br />
                                <small className="text-muted">
                                    {adjustablePayment && moment(adjustablePayment.paymentDate).format('DD-MMM-YYYY')}</small>
                                <span className="float-right mt-n5"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/vertical-dot.svg")} width="15px" height="15px" /></span>
                            </div>

                            {/* BALANCE AND TOTAL BALANCE ROW */}
                            <div className="row mt-5">
                                <div className="col-6">
                                    <div>Balance</div>
                                    <div className="mt-3">Total Payment Amount </div>
                                </div>
                                <div className="col-6 text-right">
                                    <div><strong>{adjustablePayment ? amountFormatterWithoutCurrency(adjustablePayment.remainingAmount) : 0}  </strong></div>
                                    <div className="mt-3"><strong>- {adjustablePayment ? amountFormatterWithoutCurrency(adjustablePayment.remainingAmount - balanceAmount) : 0}  </strong></div>
                                </div>
                            </div>
                            <div className="mt-5" style={{ border: "1px solid #828282", width: "100%" }}></div>
                            {/* TOTAL ROW */}
                            <div className="row mt-3">
                                <div className="col-8">
                                    <strong>Balance(After Adj.)</strong>
                                </div>
                                <div className="col-4 text-right">
                                    <strong>{amountFormatterWithoutCurrency(balanceAmount)}</strong>
                                </div>
                            </div>


                            {/* INVOICES NO DAY 1 ROW  */}
                            {adjustedInvoiceList && adjustedInvoiceList.map((data, index) => (
                                <div key={data.dataId}>
                                    <div className="mt-5">
                                        <span className="dark-gray-color font-15"><strong>INVOICES NO. {data.invoiceNo}</strong></span><br />
                                        <small className="text-muted">
                                            {moment(data.invoiceDate).format('DD-MMM-YYYY')}
                                            <span>(Elapsed Day {data.elapsedDay} days)</span>
                                        </small>
                                    </div>
                                    {/* ORD AMOUNT SECTION */}
                                    {data.isOpeningBalance === 'Y'
                                        ?
                                        <div className="row mt-3 ">
                                            <div className="col-8">
                                                <span className="dark-gray-color font-15">
                                                    <strong>Commission</strong>
                                                    <span className="dark-success-color">(+{(data.calculationType === 'PERCENTAGE' ? '%' : '')}) </span>
                                                    <input id={"ordSelected-" + data.dataId} type="text"
                                                        className="text-center w-25 h-15 p-1" onKeyUp={(e) => handleOpeningBalanceOrd(e, data, index)}
                                                    />
                                                </span>
                                            </div>
                                            <div className="col-4 text-right">
                                                <span className="dark-success-color">+{Number(data.ordAmount).toFixed(2)} </span>
                                            </div>
                                        </div>
                                        :
                                        <div className="row mt-3 ">
                                            <div className="col-8">
                                                <span className="dark-gray-color font-15">
                                                    <strong>Commission</strong>
                                                    <span className="dark-success-color">(+{data.ord + (data.calculationType === 'PERCENTAGE' ? '%' : '')})</span>
                                                </span>
                                            </div>
                                            <div className="col-4 text-right">
                                                <span className="dark-success-color">+{Number(data.ordAmount).toFixed(2)} </span>
                                            </div>
                                        </div>
                                    }

                                    {/* BALANCE AND TOTAL BALANCE ROW */}
                                    <div className="row mt-2 text-muted">
                                        <div className="col-6">
                                            <div>Balance</div>
                                            <div className="mt-3">Payment Amount </div>
                                        </div>
                                        <div className="col-6 text-right">
                                            <div>{amountFormatterWithoutCurrency(data.remainingAmount)}</div>
                                            <div className="mt-3">{amountFormatterWithoutCurrency(Number(data.adjustedAmount))}</div>
                                        </div>
                                    </div>
                                    <div className="mt-5" style={{ border: "1px solid #828282", width: "100%" }}></div>
                                    {/* TOTAL ROW */}
                                    <div className="row mt-3 text-muted">
                                        <div className="col-8">
                                            <span>Balance(After Adj.)</span>
                                        </div>

                                        <div className="col-4 text-right">
                                            <span>
                                                {(amountFormatterWithoutCurrency(data.remainingAmount - data.ordAmount - data.adjustedAmount))}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            ))}

                            <div className="p-5 mt-4">
                                <button className="border-0 w-100 rounded p-3 text-white" style={{ background: "#56CCF2" }}
                                    onClick={doAdjustmentSubmit}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/adjustment.svg")} width="15px" height="15px" />
                                    &nbsp;Payment Adjustment
                                </button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}