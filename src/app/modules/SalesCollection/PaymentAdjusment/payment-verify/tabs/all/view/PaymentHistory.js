import React from 'react';
import { format, parse, isValid, parseISO } from 'date-fns';
import {useIntl} from "react-intl";

export default function PaymentHistory({data}) {
    const intl = useIntl();

    return (
        <>
            <div className='table-responsive'>
                <table class="table table-borderless w-100">
                    <tr>
                        <th scope="col">
                            <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "LOCATION.TERITORY"})}</span><br />
                            <span className='sales-booking-view-table-first-column-title'>{data && data.location_name}</span> 
                        </th>
                        <th>
                            <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONSUMMARYTABLE.DATE_OF_COLLECTION"})}</span><br />
                            <span className='sales-booking-view-table-first-column-title'>{data && data.payment_date}</span> 
                        </th>
                    </tr>
                    <tr>
                        <th scope="col">
                            <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONSUMMARYTABLE.DISTRIBUTOR"})}</span><br />
                            <span className='sales-booking-view-table-first-column-title'>{data && data.distributor_name}</span> 
                        </th>
                        <th scope="col">
                            <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONDATA.COLLECTION_REMARKS"})}</span><br />
                            <span className='sales-booking-view-table-first-column-title'>{data && data.remarks}</span> 
                        </th>
                    </tr>
                    <tr>
                        <th scope="col">
                            <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONSUMMARYTABLE.COLLECTED_BY"})}</span> <br />
                            <span className='sales-booking-view-table-first-column-title'>{data && data.collected_by}</span> <br />
                            <span className='sales-booking-view-table-first-column-sub-title'>{data && data.designation}</span>
                        </th>
                    </tr>
                    <tr>
                        <th scope="col">
                            <span className='sales-booking-view-table-first-column-sub-title'>{intl.formatMessage({id: "COLLECTIONSUMMARYTABLE.REFERENCE_NO"})}</span> <br />
                            <span className='sales-booking-view-table-first-column-title'>{data && data.reference_no}</span>
                        </th>
                    </tr>
                </table>
            </div>
        </>
    );
}