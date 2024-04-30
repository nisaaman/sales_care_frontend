import React from 'react';
import { useIntl } from "react-intl";

export function BookingOrderList(salesBookingDetails) {

    const intl = useIntl();

    return (
        <>
            <div className='table-responsive'>
                <table className="table table-borderless booking-order-list-table">
                    <thead>
                        <tr className='booking-order-list-table-first-row'>
                            <th scope="col">{intl.formatMessage({id: "PRODUCT.PRODUCTS"})}</th>
                            <th scope="col">{intl.formatMessage({id: "PRODUCT.PRODUCT_PRICE"})}</th>
                            <th scope="col">{intl.formatMessage({id: "SALES_BOOKING.BOOKING_QUANTITY"})}</th>
                            <th scope="col">{intl.formatMessage({id: "SALES_BOOKING.BOOKING_AMOUNT"})}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                           salesBookingDetails.bookingDetails.map((product, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <div>
                                             <span className="text-muted">{product.product_sku}</span><br />
                                             <strong>{product.product_name}</strong><br />
                                             <span className="text-muted">{product.category_name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>{product.trade_price.toFixed(2)}</strong><br />
                                            <span className="text-muted">-{product.discounted_price !==null ? product.discounted_price.toFixed(2) : 0.00}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>{product.booking_quantity+product.free_quantity}</strong><br />
                                            {/* <span className="text-muted">({product.free_quantity}+)</span> */}
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>{product.booking_amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong><br />
                                            <span className="text-muted">-{product.discounted_amount !== null ? product.discounted_amount.toFixed(2): 0.00}</span>
                                        </div>
                                    </td>
                                </tr>
                             );
                            })}
                    </tbody>
                </table>
            </div>
        </>
    );
}