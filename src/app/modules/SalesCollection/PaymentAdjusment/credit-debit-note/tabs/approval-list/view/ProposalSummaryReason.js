import React, {useEffect, useState} from 'react';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../../_metronic/_helpers";
import axios from "axios";
import _ from "lodash";

export default function ProposalSummaryReason(props) {
    let [noteInfo, setNoteInfo] = useState({});
    let [uploadedFileInfo, setUploadedFileInfo] = useState({});

    useEffect(() => {
        setNoteInfo(props.noteInfo)
    }, []);

    useEffect(() => {
        setNoteInfo(props.noteInfo);
        setUploadedFileInfo(props.uploadedFileInfo);
    }, [props]);

    const getDownloadByCreditDebitNoteId = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/credit-debit-note/file-download/` + uploadedFileInfo.refId;
        axios.get(URL, {responseType: 'blob'}).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            let docName = uploadedFileInfo.fileName;
            link.setAttribute('download', docName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(err => {

        });
    }


    return (
        <>
            {/* REASON TITLE  ROW START */}
            <div className='row'>
                <div className='col-xl-8'>
                    <div style={{color: "#4F4F4F"}}>
                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-transactions.svg")} width="15px"
                             height="15px"/>
                        <strong>&nbsp;Remarks</strong>
                    </div>
                </div>
            </div>
            {/* REASON TITLE  ROW END */}

            {/* REASON DETAILS START */}
            <div>
                <p className='dark-gray-color'>{noteInfo.note}</p>
            </div>
            {/* REASON DETAILS END */}
            {/* REFERENCE DOC  ROW START */}
            <div hidden={_.isEmpty(props.uploadedFileInfo)}>
                <div>
                    <span className='dark-gray-color'>Reference Doc.</span>
                </div>
                <div className='light-blue-bg dark-blue-color summary-referrence mt-3 row'>
                    <div className='col-xl-8'>
                        <div className="d-flex">
                            <div className="dark-blue-color">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-attach.svg")}/>
                            </div>
                            <div className="ml-2">
                                <span>
                                    <span><strong>{uploadedFileInfo.fileName}</strong></span><br/>
                                    <small
                                        className='text-muted'>{uploadedFileInfo.fileSize ? uploadedFileInfo.fileSize / 1000 : 0} kb</small>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-4 d-flex justify-content-end '>
                        {/*<div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blueview.svg")}/></div>*/}
                        <a>
                            <div onClick={getDownloadByCreditDebitNoteId}><SVG
                                src={toAbsoluteUrl("/media/svg/icons/project-svg/blueDownload.svg")}/></div>
                        </a>
                    </div>

                </div>
            </div>
            {/* REFERENCE DOC  ROW END */}
        </>
    );
}