import React, { useState, useEffect } from "react";
import InventoryBreadCrum from '../../../../../../bread-crum/InventoryBreadCrum';
import { Card, CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import { useHistory, useLocation } from 'react-router-dom';
import { useIntl } from "react-intl";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import PickingViewList from "./table/PickingViewList";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";

export default function DistributorWiseView() {
    let history = useHistory();
    const intl = useIntl();
    const location = useLocation();
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    let [distributorInfo, setDistributorInfo] = useState({});
    const [searchParams, setSearchParams] = useState({ companyId: distributorInfo.company_id, distributorId: distributorInfo.distributor_id});
    let [singleAll, setSingleAll] = useState([]);
    const [pikingList, setPikingList] = useState([]);
    useEffect(() => {
        if (location.state != undefined) {
            setSearchParams({...searchParams,
                companyId: location.state.state.company_id, distributorId: location.state.state.distributor_id 
            }) 
            setDistributorInfo(location.state.state)
        }
    }, []);
    
    useEffect(() => {    
        if (companyId && searchParams.distributorId)    
            getPickingList(searchParams)  
    }, [searchParams]);

    const getPickingList = (params) =>{        
        const URL = `${process.env.REACT_APP_API_URL}/api/picking/get-picking-list-distributor-company-wise/${params.companyId}/${params.distributorId}`;
        axios.get(URL).then(response => {
            if (response.data.data !== null) {
                setPikingList(response.data.data)
            }
        }).catch(err => {

        });
    }
    const handleBack = () => {
        history.push('/inventory/stock/sales-order/picking-list');
    }
    return (
        <>
            <div>
                <InventoryBreadCrum />
            </div>
            <div className="mt-5">
                <Card>
                    <CardBody>
                        {/* BACK AND TITLE ROW */}
                        <div className="row">
                            <div className="col-xl-4">
                                <span>
                                    <button className='btn' onClick={handleBack}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                        </strong>
                                    </button>
                                </span>
                            </div>
                            <div className="col-xl-4 text-center mt-3">
                                <strong>VIEW PICKING LIST</strong>
                            </div>
                        </div>
                        {/* SEARCH ROW */}
                        <div className="d-flex flex-wrap justify-content-between mt-5">
                        <div>
                                <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className="form-control" name="searchText"
                                        placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                    />
                                </form>
                            </div>
                            <div>
                                <span>
                                    <span style={{ fontWeight: "500" }}><strong>{distributorInfo.distributor_name}</strong></span>
                                    <p className="dark-gray-color">
                                        <i className="bi bi-telephone-fill mr-1" style={{ fontSize: "10px" }}></i>{distributorInfo.contact_no}
                                    </p>
                                </span>
                            </div>
                        </div>
                        {/* FITER LIST TABLE */}
                        <div className="mt-5">
                            <PickingViewList setSingleAll={setSingleAll} singleAll={singleAll} pikingList={pikingList}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}