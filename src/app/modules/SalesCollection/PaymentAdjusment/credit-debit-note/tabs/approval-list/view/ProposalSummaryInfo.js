import React, {useEffect, useState} from 'react';

export default function ProposalSummaryInfo(props) {
    let [noteInfo, setNoteInfo] = useState({});

    useEffect(() => {
        setNoteInfo(props.noteInfo)
    }, []);

    useEffect(() => {
        setNoteInfo(props.noteInfo)
    }, [props]);

    return (<>
        <div className='table-responsive'>
            <table className="table table-borderless w-100">
                <tr>
                    <th scope="col">
                            <span
                                className='sales-booking-view-table-first-column-sub-title'>{noteInfo.note_type === 'CREDIT' ? 'Credit' : 'Debit'} Amount</span><br/>
                        <span className='sales-booking-view-table-first-column-title'>{noteInfo.amount}</span>
                    </th>
                    <th scope="col">
                        <span className='sales-booking-view-table-first-column-sub-title'>Proposal Date</span><br/>
                        <span
                            className='sales-booking-view-table-first-column-title'>{noteInfo.proposal_date}</span>
                    </th>
                </tr>
                <tr>
                    <th scope="col">
                        <span className='sales-booking-view-table-first-column-sub-title'>Invoice No.</span><br/>
                        <span
                            className='sales-booking-view-table-first-column-title'>{noteInfo.invoice_no}</span>
                    </th>
                </tr>
                <tr>
                    <th scope="col">
                        <span className='sales-booking-view-table-first-column-sub-title'>Entry By</span> <br/>
                        <span className='sales-booking-view-table-first-column-title'>{noteInfo.entry_by}</span>
                        <br/>
                        <span
                            className='sales-booking-view-table-first-column-sub-title'>{noteInfo.entry_by_designation + ', ' + noteInfo.company_name}</span>
                    </th>
                </tr>
                {/*<tr>*/}
                {/*    <th scope="col">*/}
                {/*        <span className='sales-booking-view-table-first-column-sub-title'>Reference No.</span> <br/>*/}
                {/*        <span className='sales-booking-view-table-first-column-title'></span>*/}
                {/*    </th>*/}
                {/*</tr>*/}
            </table>
        </div>
    </>);
}