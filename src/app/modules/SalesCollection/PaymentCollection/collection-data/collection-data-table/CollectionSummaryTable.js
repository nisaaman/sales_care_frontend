import React from 'react';
import { format, parse, isValid, parseISO } from 'date-fns';
import {useIntl} from "react-intl";

export function CollectionSummaryTable(props) {
    const intl = useIntl();
    const paymentInfo = props.paymentInfo;
    const salesOfficerLocation = props.salesOfficerLocation;

    return (
        <>
            <div className='table-responsive'>
                <table class="table table-borderless w-100">
                    <tr>
                        <th scope="col">
                            <span className='sales-booking-view-table-first-column-sub-title'>{salesOfficerLocation.location_type}</span><br />
                            <span className='sales-booking-view-table-first-column-title'>{salesOfficerLocation.location_name}</span> 
                        </th>
                        <th scope="col">
                            <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONSUMMARYTABLE.DATE_OF_COLLECTION"})}</span><br />
                            <span className='sales-booking-view-table-first-column-title'>{format(parseISO(paymentInfo.paymentDate), 'dd-MMM-yyyy')}</span> 
                        </th>
                    </tr>
                    <tr>
                        <th scope="col">
                            <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONSUMMARYTABLE.DISTRIBUTOR"})}</span><br />
                            <span className='sales-booking-view-table-first-column-title'>{paymentInfo.distributor.distributorName}</span> 
                        </th>
                        <th scope="col">
                            <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONSUMMARYTABLE.PAYMENT"})}</span><br />
                            <span className='sales-booking-view-table-first-column-title'>{paymentInfo.paymentNo}</span> 
                        </th>
                    </tr>
                    <tr>
                        <th scope="col">
                            <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONSUMMARYTABLE.COLLECTED_BY"})}</span> <br />
                            <span className='sales-booking-view-table-first-column-title'>{paymentInfo.collectionBy.name}</span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'>{paymentInfo.collectionBy.designation.name}, {paymentInfo.company.name}</span>
                        </th>
                    </tr>
                    <tr>
                        <th scope="col">
                            <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONSUMMARYTABLE.REFERENCE_NO"})}</span> <br />
                            <span className='sales-booking-view-table-first-column-title'>{paymentInfo.referenceNo}</span>
                        </th>
                    </tr>
                </table>
            </div>
        </>
    );
}