import React from 'react';
import { useIntl } from "react-intl";

export function BookingInformation(props) {

    const intl = useIntl();
    const bookingInfo = props.bookingInfo;
    const TOTAL_EXCLUDE_VAT = bookingInfo.booking_amount - bookingInfo.discounted_amount;

    return (
        <>
            <div>
                <table className="table sales-booking-view-table w-100">
                    <tbody>
                        <tr>
                            <th scope="col" className='sales-booking-view-table-first-column'>
                                <span className='sales-booking-view-table-first-column-title'>{bookingInfo.booking_no}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES_BOOKING.BOOKING_NO"})}</span>
                            </th>
                            <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                                <span className='sales-booking-view-table-first-column-title'>{bookingInfo.product_count}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "PRODUCT.PRODUCT_COUNT"})}</span>
                            </th>
                        </tr>
                        <tr>
                            <th scope="col" className='sales-booking-view-table-first-column'>
                                <span className='sales-booking-view-table-first-column-title'>{bookingInfo.invoice_nature}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES_BOOKING.BOOKING_INVOICE_PAYMENT_NATURE"})}</span>
                            </th>
                            <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                                <span className='sales-booking-view-table-first-column-title'>{bookingInfo.booking_quantity+bookingInfo.free_quantity}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES_BOOKING.BOOKING_TOTAL_QUANTITY"})}</span>
                            </th>
                        </tr>
                        <tr>
                            <th scope="col" className='sales-booking-view-table-first-column'>
                                <span className='sales-booking-view-table-first-column-title'>{bookingInfo.fiscal_year_name}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COMMON.FISCAL_YEAR"})}</span>
                            </th>
                            <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                                <span className='sales-booking-view-table-first-column-title'>{bookingInfo.booking_amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COMMON.SUB_TOTAL"})}</span>
                            </th>
                            {/* <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                                <span className='sales-booking-view-table-first-column-title'>{bookingInfo.free_quantity}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES_BOOKING.BOOKING_FREE_QUANTITY"})}</span>
                            </th> */}
                        </tr>
                        {/* <tr>
                            <th scope="col" className='sales-booking-view-table-first-column'></th>
                            
                        </tr> */}
                        <tr>
                            <th scope="col" className='sales-booking-view-table-first-column'></th>
                            <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                                <span className='sales-booking-view-table-first-column-title'>-{bookingInfo.discounted_amount!==null ? bookingInfo.discounted_amount.toFixed(2) : 0.00}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COMMON.DISCOUNT"})}</span>
                            </th>
                        </tr>
                        <tr>                       
                            <th scope="col"></th>
                            <th scope="col" style={{ borderLeft: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                                <span className='sales-booking-view-table-first-column-title'>{TOTAL_EXCLUDE_VAT.toLocaleString('en-US', {minimumFractionDigits: 2})}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COMMON.TOTAL_EXCLUDE_VAT"})}</span>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}