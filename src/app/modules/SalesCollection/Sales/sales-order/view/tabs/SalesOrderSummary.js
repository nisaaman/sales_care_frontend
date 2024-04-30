import React from 'react';
import { amountFormatterWithoutCurrency } from '../../../../../Util';

export function SalesOrderSummary({salesOrderSummary}) {

    return (
        <>
            <div>
                <table class="table sales-booking-view-table w-100">
                    <tr>
                        <th scope="col" className='sales-booking-view-table-first-column'>
                            <span className='sales-booking-view-table-first-column-title'>{salesOrderSummary.orderNo}</span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'>Order No.</span>
                        </th>
                        <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                            <span className='sales-booking-view-table-first-column-title'>{salesOrderSummary.bookingNo}</span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'>Booking No.</span>
                        </th>
                    </tr>
                    <tr>
                        <th scope="col" className='sales-booking-view-table-first-column'>
                            <span className='sales-booking-view-table-first-column-title'>{salesOrderSummary.invoiceNature}</span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'>Payment</span>
                        </th>
                        <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                            <span className='sales-booking-view-table-first-column-title'>{salesOrderSummary.quantity}</span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'>Total Quantity</span>
                        </th>
                    </tr>
                    <tr>

                         <th scope="col" className='sales-booking-view-table-first-column'>
                            <span className='sales-booking-view-table-first-column-title'>{salesOrderSummary.bookingNo}</span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'>Booking No.</span>
                        </th>
                        
                        <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                            {/* <span className='sales-booking-view-table-first-column-title'>{salesOrderSummary.freeQuantity}</span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'>Free Quantity</span> */}
                        </th>
                    </tr>
                    <tr>
                        <th scope="col" className='sales-booking-view-table-first-column'>
                            <span className='sales-booking-view-table-first-column-title'></span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'></span>
                        </th>
                        <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                            <span className='sales-booking-view-table-first-column-title'> {amountFormatterWithoutCurrency(salesOrderSummary.totalOrderAmount)}</span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'>Sub Total</span>
                        </th>
                    </tr>
                    <tr>
                        <th scope="col" className='sales-booking-view-table-first-column'></th>
                        <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                            <span className='sales-booking-view-table-first-column-title'>- {amountFormatterWithoutCurrency(salesOrderSummary.tradeDiscount)}</span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'>Discount</span>
                        </th>
                    </tr>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col" style={{ borderLeft: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                            <span className='sales-booking-view-table-first-column-title'> {amountFormatterWithoutCurrency(salesOrderSummary.totalOrderAmount - salesOrderSummary.tradeDiscount)}</span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'>Total(excl. Vat)</span>
                        </th>
                    </tr>
                </table>
            </div>
        </>
    );
}