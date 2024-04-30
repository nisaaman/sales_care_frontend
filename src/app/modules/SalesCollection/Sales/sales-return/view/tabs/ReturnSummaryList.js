import React from 'react';
import {useIntl} from "react-intl";

export default function ReturnSummaryList(props) {

    const intl = useIntl();
    return (
        <>
            <div className='table-responsive'>
                <table className="table table-borderless booking-order-list-table">
                    <thead>
                        <tr className='booking-order-list-table-first-row'>
                            <th scope="col">{intl.formatMessage({ id: "PRODUCT.PRODUCTS" })}</th>
                            <th scope="col">{intl.formatMessage({ id: "PRODUCT.PRODUCT_PRICE" })}</th>
                            <th scope="col">{intl.formatMessage({ id: "SALES.PROPOSE.RETURN.QTY" })}</th>
                            {props.returnProposalApprovalStatus === "Approved" ?
                                <th scope="col">{intl.formatMessage({ id: "SALES.RETURN.RETURN_AMOUNT_RECEIVED" })}</th>
                                : <th scope="col">{intl.formatMessage({ id: "SALES.RETURN.RETURN_AMOUNT_PROPOSED" })}</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {props.salesReturnProposalDetails.map((salesReturnProposalDetails, index) => {
                           
                            return(
                            <tr>
                                <td>
                                    <div>
                                        <span className="text-muted">{salesReturnProposalDetails.productSku}</span><br />
                                        <strong>{salesReturnProposalDetails.productName} {salesReturnProposalDetails.description}</strong><br />
                                        <span className="text-muted">{salesReturnProposalDetails.productCategory}</span>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        {salesReturnProposalDetails.returnPrice !== null ?
                                            <strong>{Number(salesReturnProposalDetails.returnPrice).toFixed(2)}</strong> :
                                            <strong>{Number(salesReturnProposalDetails.tradePrice).toFixed(2)}</strong>
                                        }
                                        {/* <strong>{Number(salesReturnProposalDetails.tradePrice).toFixed(2)}</strong><br/> */}
                                    </div>
                                </td>
                                <td>
                                    {props.returnProposalApprovalStatus === "Approved" ?
                                        <div>
                                            <strong>{salesReturnProposalDetails.returnQuantity+"/"+salesReturnProposalDetails.proposeQuantity}</strong><br />
                                            <span className="text-muted">{"(" + salesReturnProposalDetails.uom + ")"}</span>
                                        </div> :
                                        <div>
                                            <strong>{salesReturnProposalDetails.proposeQuantity}</strong><br />
                                            <span className="text-muted">{"(" + salesReturnProposalDetails.uom + ")"}</span>
                                        </div>
                                    }
                                </td>
                                <td>
                                    <div>
                                        {salesReturnProposalDetails.returnAmount !== 0 ?
                                            <strong>{Number(salesReturnProposalDetails.returnAmount).toLocaleString('en-US', {minimumFractionDigits: 2})}</strong> :
                                            <strong>{Number(salesReturnProposalDetails.returnProposalAmount).toLocaleString('en-US', {minimumFractionDigits: 2})}</strong>
                                        }
                                    </div>
                                </td>
                            </tr>);
                        })}
                        

                    </tbody>
                </table>
            </div>
        </>
    );
}