import React from 'react';
import { amountFormatterWithoutCurrency } from '../../../../../Util';
export function SalesOrderSummayList(salesOrderDetails) {
   
    return (
        <>
            <div className='table-responsive'>
                <table class="table table-borderless booking-order-list-table">
                    <thead>
                        <tr className='booking-order-list-table-first-row'>
                            <th scope="col">PRODUCTS</th>
                            <th scope="col">PRICE</th>
                            <th scope="col">QTY</th>
                            <th scope="col">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>

                    {salesOrderDetails.salesOrderDetails.map((salesOrder, index) => {
                        return (
                            <tr>
                                <td>
                                    <div>
                                        <span className="text-muted">{salesOrder.productSku}</span><br />
                                        <strong>{salesOrder.productName} {salesOrder.description} </strong><br />
                                        <span className="text-muted">{salesOrder.productCategory}</span>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <strong> {amountFormatterWithoutCurrency(salesOrder.price)}</strong><br />
                                        {/* <span className="text-muted"><del> {(salesOrder.actualPrice)}</del></span> */}
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <strong>{salesOrder.quantity}</strong><br />
                                        {/* <span className="text-muted">{salesOrder.freeQuantity}</span> */}
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <strong> {amountFormatterWithoutCurrency(salesOrder.orderAmount)}</strong><br />
                                        {/* <span className="text-muted">- {amountFormatterWithoutCurrency(salesOrder.tradeDiscount)}</span> */}
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