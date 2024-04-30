import { it } from 'date-fns/locale';
import React from 'react';
import SVG from "react-inlinesvg";
import { shallowEqual, useSelector } from 'react-redux';
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";

export default function BatchPreparationBreadCrum() { 
    const childCompanyList = useSelector((state) => state.auth.user.companies, shallowEqual);
    const selectedCompanyId = useSelector((state) => state.auth.company, shallowEqual);
    const selectedCompany = childCompanyList.find(it => it.id == selectedCompanyId);

    return (
        <>
           {/* BREAD CRUM ROW */}
           <div className="row" style={{ marginTop: "-30px", marginLeft: "-18px" }}>
                <div className="col-xl-6">
                    <nav aria-label="breadcrumb">
                        <ol className="breadCrum-bg-color">
                            <li aria-current="page" className='breadCrum-main-title'>{selectedCompany?.name}</li>
                            <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp;Production&nbsp;&nbsp;&nbsp;&nbsp;</li>
                            <li aria-current="page" className='mt-1 text-primary'><span className='font-weight-bolder'>.</span></li>
                            <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'>Batch Preparation List&nbsp;&nbsp;&nbsp;&nbsp;</li>
                            <li aria-current="page" id="create-batch-dot" className='mt-1 d-none text-primary'><span className='font-weight-bolder'>.</span></li>
                            <li aria-current="page" id="create-batch" className='mt-1 d-none breadCrum-sub-title text-primary'>Create Batch</li>
                            <li aria-current="page" id="product-profile-dot" className='mt-1 d-none text-primary'><span className='font-weight-bolder'>.</span></li>
                            <li aria-current="page" id="product-profile" className='mt-1 d-none breadCrum-sub-title text-primary'>Batch Profile</li>
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
                            &nbsp;&nbsp;Stock
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