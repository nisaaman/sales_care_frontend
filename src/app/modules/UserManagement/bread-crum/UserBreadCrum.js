import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

export default function UserBreadCrum({menuTitle}) {  
    const parentCompany = useSelector((state) => state.auth.user.parentCompany, shallowEqual);

    return (
        <>
           {/* BREAD CRUM ROW */}
           <div className="row" style={{ marginTop: "-30px", marginLeft: "-18px" }}>
                <div className="col-xl-6">
                    <nav aria-label="breadcrumb">
                        <ol className="breadCrum-bg-color">
                            <li aria-current="page" className='breadCrum-main-title'>{parentCompany.name}</li>
                            <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp; Configure&nbsp;&nbsp;</li>
                            <li aria-current="page" className='mt-1 text-primary'><span className='font-weight-bolder'>.</span></li>
                            <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'>{menuTitle}</li>
                        </ol>
                    </nav>
                </div>
                
            </div>
        </>
    );
}