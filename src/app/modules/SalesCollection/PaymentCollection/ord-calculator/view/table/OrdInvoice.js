import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import axios from "axios";

export default function OrdInvoice(props) {
    const intl = useIntl();
    const [invoice, setInvoice] = useState(props.invoice);

    useEffect(() => {
        document.getElementById('pills-payment-ord-calculator-tab').classList.add('active');
    }, []);

    return (
        <>
            <div className='table-responsive p-5'>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({ id: "SALES.RETURN.RETURN_INVOICE_NO" })}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>{invoice.invoiceNo}</span>
                                    </td>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({ id: "PAYMENT.ORD.CALCULATOR.ELAPSED" })}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>{invoice.elapsedDay}</span>
                                    </td>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({ id: "PAYMENT.ORD.CALCULATOR.COMMISSION" })}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>&#2547;{invoice.commission}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({ id: "PAYMENT.ORD.CALCULATOR.CURRENT_BALANCE" })}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>&#2547;{invoice.currentBalance}</span>
                                    </td>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({ id: "PAYMENT.ORD.CALCULATOR.ORD" })}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>{invoice.ord}</span>
                                    </td>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({ id: "PAYMENT.ORD.CALCULATOR.SUGGESTED_PAYMENT" })}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>&#2547;{invoice.suggestedPayment}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
        </>
    );
}