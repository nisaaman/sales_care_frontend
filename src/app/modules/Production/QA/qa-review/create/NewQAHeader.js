import React from "react";
import { useHistory } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export default function NewQAHeader({ openFullscreen, closeFullscreen }) {
    let history = useHistory();
    const handleBackToListPage = () => {
        history.push('/production/production-qa/production-qa-setup');
    }

    return (
        <>
            <div className="approval-view-header">
                {/* BACK AND TITLE ROW */}
                <div className="row">
                    <div className="col-3">
                        <span>
                            <button className='btn' onClick={handleBackToListPage}>
                                <strong>
                                    <i className="bi bi-arrow-left-short" style={{ fontSize: "30px" }}></i>
                                </strong>
                            </button>
                        </span>
                    </div>
                    <div className="col-6 text-center mt-4">
                        <strong>QA receive</strong>
                    </div>
                    <div className="col-3 text-right text-muted">
                        <button id="full-screen-icon" className="btn text-white" onClick={openFullscreen}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen.svg")} />
                        </button>
                        <button id="full-screen-close-icon" className="btn text-white" onClick={closeFullscreen}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen-close.svg")} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}