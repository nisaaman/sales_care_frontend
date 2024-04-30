import React, {useEffect, useState} from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useIntl } from "react-intl";
import axios from "axios";

export function CollectionAmountTable(props) {
    const intl = useIntl();
    const paymentInfo = props.paymentInfo;
    const [documentInfo, setDocumentInfo] = useState({});

    useEffect(() => {
        if(props.paymentInfo){
            acknowledgeDocumentDownload(props.paymentInfo);
        }
    }, [props]);

    const acknowledgeDocumentDownload = (data) => {
        let queryParams = '?paymentCollectionId=' + data.id;
        const URL = `${process.env.REACT_APP_API_URL}/api/payment-collection/get-acknowledge-document-info` + queryParams;
        axios.get(URL).then(response => {
            let documentInfo = response.data.data;
            if (documentInfo){
                setDocumentInfo(documentInfo);
            }
        }).catch(err => {

        });
    }
    const downloadAttachedFile = (id, fileName) => {
        let queryParams = '?paymentCollectionId=' + id;
        const URL = `${process.env.REACT_APP_API_URL}/api/payment-collection/document`+queryParams;
        axios.get(URL, {responseType: 'blob'}).then(response => {
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(err => {

        });

    }

    return (
        <>
            {/* COLLECTION AMOUNT  ROW START */}
            <div className='row'>
                <div className='col-xl-8'>
                    <div style={{color:"#4F4F4F"}}>
                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/collection.svg")} width="15px" height="15px" />
                        <strong>&nbsp;{intl.formatMessage({id: "COLLECTIONDATA.COLLECTION_AMOUNT"})}</strong>
                    </div>
                </div>
                <div className='col-xl-4 style={{color:"#4F4F4F"}}'>
                    <div className="float-right">
                        <strong>{paymentInfo.collectionAmount}</strong>
                    </div>
                </div>
            </div>
            {/* COLLECTION AMOUNT  ROW END */}
            {/* COLLECTION AMOUNT TABLE START */}
            <div className='table-responsive'>
                        <table class="table table-borderless">
                            <tbody>
                                <tr>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONAMOUNTTABLE.NATURE"})}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>{paymentInfo.paymentNature}</span>
                                    </td>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONAMOUNTTABLE.TYPE"})}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>{paymentInfo.paymentType}</span>
                                    </td>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONAMOUNTTABLE_CHEQUE_NO"})}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>1321464654132155463</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONAMOUNTTABLE_BOOK_NO"})}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>{paymentInfo.paymentBook.bookNumber}</span>
                                    </td>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONAMOUNTTABLE_MONEY_RECEIPT_NO"})}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>{paymentInfo.moneyReceiptNo}</span>
                                    </td>
                                    <td>
                                        <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONAMOUNTTABLE_BANK"})}</span><br />
                                        <span className='sales-booking-view-table-first-column-title'>Eastern Bank Ltd, Mirpur 11</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            {/* COLLECTION AMOUNT TABLE END */}
            {/* REFERENCE DOC  ROW START */}



            {documentInfo?.fileName &&
                <div>
                    <div>
                        <small className='text-muted'>Reference Doc.</small>
                    </div>
                    <div className='light-blue-bg dark-blue-color summary-referrence mt-3 row'>
                        <div className='col-xl-10'>
                            <div className="d-flex">
                                <div className="dark-blue-color">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-attach.svg")} />
                                </div>
                                <div className="ml-2">
                                <span>
                                    <span><strong>{documentInfo.fileName}</strong></span><br />
                                    <small className='text-muted'>{(documentInfo.fileSize/1024).toFixed(2)}kb</small>
                                </span>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-2 d-flex justify-content-end '>
                            {/* <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blueview.svg")} /></div> */}
                            <a onClick={() => downloadAttachedFile(documentInfo.refId, documentInfo.fileName)}><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blueDownload.svg")} /></a>
                        </div>

                    </div>
                </div>
            }
            {/* REFERENCE DOC  ROW END */}
        </>
    );
}