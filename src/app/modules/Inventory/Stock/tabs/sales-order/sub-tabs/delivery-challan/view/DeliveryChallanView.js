
import React, { useState, useEffect } from "react";
import InventoryBreadCrum from "../../../../../../../Inventory/bread-crum/InventoryBreadCrum";
import {Card,CardBody} from "../../../../../../../../../_metronic/_partials/controls"
import { useHistory, useLocation } from 'react-router-dom';
import { useIntl } from "react-intl";
import DeliveryChallanViewList from "./table/DeliveryChallanViewList";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";

export default function DeliveryChallanView(props) {
    let history = useHistory();
    const intl = useIntl();
    const location = useLocation();
    const distributorInfo=location.state.state;

    let [singleAll, setSingleAll] = useState([]);
    const [deliveryChallanList,setDeliveryChallanList]= useState([]);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);

    useEffect(() => {
       
        if (props.location.state) {
            getDeliveryChallanList(companyId,props.location.state.state.distributor_id)
       }
    }, []) 


    const handleExport = () => {
        const exportData = [...singleAll]
    }

    const handleBackTo = () => {
        history.push('/inventory/stock/sales-order/delivery-challan-list');
    }

    const getDeliveryChallanList = (companyId, distributorId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/delivery-challan/distributor-wise-delivery-challan/${companyId}/${distributorId}`
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            setDeliveryChallanList(response.data.data);
        }).catch(err => {
            console.log(err);
        });
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
                                    <button className='btn' onClick={handleBackTo}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                        </strong>
                                    </button>
                                </span>
                            </div>
                            <div className="col-xl-4 text-center mt-3">
                                <strong>{intl.formatMessage({ id: "COMMON.DELIVERY_CHALLAN_CAPITAL" })}</strong>
                            </div>
                        </div>

                        {/* ALL SUMMARY ROW */}
                        {/* <div className='row'>
                            <div className='col-xl-2 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/list.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.INVOICES" })}</span>
                                            <p><strong>dsds</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-2 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/listAmount.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.INVOICES.AMOUNT" })}</span>
                                            <p><strong>3232</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-2 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/listAmount.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.INVOICES.BALANCE" })}</span>
                                            <p><strong>23232</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/listAmount.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "PAYMENT.ORD.CALCULATOR.ORD" })}</span>
                                            <p><strong>3434</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div> */}
                       
                        {/* FITER LIST TABLE */}
                        <div className="mt-5">
                            <DeliveryChallanViewList setSingleAll={setSingleAll} singleAll={singleAll} data={deliveryChallanList} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}