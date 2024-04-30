import React from 'react';
import SVG from "react-inlinesvg";
import { shallowEqual, useSelector } from 'react-redux';
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";

export default function TradePriceSetupBreadCrum(props) {     

    const parentCompany = useSelector((state) => state.auth.user.parentCompany, shallowEqual);

    return (
        <>
           {/* BREAD CRUM ROW */}
           <div className="row" style={{ marginTop: "-30px", marginLeft: "-18px" }}>
                <div className="col-xl-6">
                    <nav aria-label="breadcrumb">
                        <ol className="breadCrum-bg-color">
                            <li aria-current="page" className='breadCrum-main-title'>{parentCompany?.name}</li>
                            <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp;Sales & Collection&nbsp;&nbsp;&nbsp;&nbsp;</li>
                            <li aria-current="page" className='mt-1 text-primary'><span className='font-weight-bolder'>.</span></li>
                            <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'>Configure&nbsp;&nbsp;&nbsp;&nbsp;</li>
                            <li aria-current="page" className='mt-1 text-primary'><span className='font-weight-bolder'>.</span></li>
                            <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'>Trade Price Setup</li>
                        </ol>
                    </nav>
                </div>
                <div className="col-xl-6 d-flex justify-content-end">
                    <div className="mr-5">
                        <button
                            type="button"
                            className="btn approval-config-btn btn-hover-primary"
                            data-toggle="tooltip" data-placement="bottom" title="Approval Path Config"
                        >
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/approval.svg")} width="15px" height="15px" />
                            &nbsp;&nbsp;Approval Path Config.
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn approval-config-btn btn-hover-primary"
                            data-toggle="tooltip" data-placement="bottom" title="Product Configure"
                        >
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/configure.svg")} width="15px" height="15px" />
                            &nbsp;&nbsp;Product Configure
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}