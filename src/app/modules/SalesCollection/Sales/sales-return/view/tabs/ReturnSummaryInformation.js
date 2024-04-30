import moment from 'moment';
import React from 'react';
import {useIntl} from "react-intl";
import {dateFormatPattern} from '../../../../../Util';

export default function ReturnSummaryInformation({salesReturnProposalSummary,totalSalesReturnProposalAmount,totalSalesReturnAmount,totalReturnQuantity}) {
    const intl = useIntl();

    return (
        <>
            <div>
                <table className="table sales-booking-view-table w-100">
                    <tbody>
                        <tr>
                            <th scope="col" className='sales-booking-view-table-first-column'>
                                <span className='sales-booking-view-table-first-column-title'>{salesReturnProposalSummary.invoiceNo}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES.RETURN.RETURN_INVOICE_NO"})}</span>
                            </th>
                            <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                            <span className='sales-booking-view-table-first-column-title'>{moment(salesReturnProposalSummary.invoiceDate).format(dateFormatPattern())}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES.RETURN.RETURN_INVOICE_DATE"})}</span>
                            </th>
                        </tr>
                        <tr>
                            <th scope="col" className='sales-booking-view-table-first-column'>
                                <span className='sales-booking-view-table-first-column-title'>{Number(salesReturnProposalSummary.invoiceAmount).toLocaleString('en-US', {minimumFractionDigits: 2})}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES.RETURN.RETURN_INVOICE_AMOUNT"})}</span>
                            </th>
                            <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                                <span className='sales-booking-view-table-first-column-title'></span> {salesReturnProposalSummary.challanNo}<br />
                                <span className='sales-booking-view-table-first-column-sub-title'>Delivery Challan</span>
                            </th>
                        </tr>
                        <tr>
                            <th scope="col" className='sales-booking-view-table-first-column'>
                                <span className='sales-booking-view-table-first-column-title'>{salesReturnProposalSummary.salesReturnNo}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES.RETURN.RETURN_NO"})}</span>
                            </th>
                            <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                                <span className='sales-booking-view-table-first-column-title'>{salesReturnProposalSummary.proposalNo}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES.RETURN.RETURN_PROPOSAL_NO"})}</span>
                            </th>
                        </tr>
                        <tr>
                            <th scope="col" className='sales-booking-view-table-first-column'>
                                <span className='sales-booking-view-table-first-column-title'>{salesReturnProposalSummary.salesReturnDate ? moment(salesReturnProposalSummary.salesReturnDate).format(dateFormatPattern()) : ""}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES.RETURN.RETURN_DATE"})}</span>
                            </th>
                            <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                                <span className='sales-booking-view-table-first-column-title'>{moment(salesReturnProposalSummary.proposalDate).format(dateFormatPattern())}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COMMON.PROPOSAL_DATE"})}</span>
                            </th>
                        </tr>
                        <tr>
                            <th scope="col" className='sales-booking-view-table-first-column'>
                                <span className='sales-booking-view-table-first-column-title'>{totalReturnQuantity}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES.RETURN.RETURN_QTY"})}</span>
                            </th>
                            <th scope="col" style={{ borderBottom: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                                <span className='sales-booking-view-table-first-column-title'>{salesReturnProposalSummary.totalQuantity}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES.RETURN.PROPOSE_QTY"})}</span>
                            </th>
                        </tr>


                        <tr>
                        <th scope="col" className='sales-booking-view-table-first-column'>
                                <span className='sales-booking-view-table-first-column-title'>{Number(totalSalesReturnAmount).toLocaleString('en-US', {minimumFractionDigits: 2})}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES.RETURN.AMOUNT"})}</span>
                            </th>
                            <th scope="col" style={{ borderLeft: "1px  solid #DCDCDC", padding: "20px", textAlign: "right" }}>
                                <span className='sales-booking-view-table-first-column-title'>{Number(totalSalesReturnProposalAmount).toLocaleString('en-US', {minimumFractionDigits: 2})}</span> <br />
                                <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "SALES.RETURN.PROPOSAL.AMOUNT"})}</span>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}