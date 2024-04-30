import React, { useState, useEffect } from 'react';
import DistributorsBreadCrum from "../../common/DistributorsBreadCrum";
import DistributorsHeader from "../../common/DistributorsHeader";
import {
    Card,
    CardBody,
  } from "../../../../../../_metronic/_partials/controls";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useHistory } from "react-router-dom";
import { useIntl } from 'react-intl';
import {ActivityLogDetailts} from "./ActivityLogDetailts"

export default function ActivityListView() {
    const history = useHistory();
    const intl = useIntl();
    const [selectDate, setSelectDate] = useState("");
    const [area, setArea] = useState("Chittagong");
    const [depotName, setDepotName] = useState("Chittagong");
    const [locationTeritory, setLocationTeritory] = useState("Cox’s Bazar");
    const [distributorName, setDistributorName] = useState("Bhai Bhai Enterprise");
    const [distributorContactNo, setDistributorContactNo] = useState("+880 1779 911 488");
    const [balance, setBalance] = useState(55606521);
    useEffect(() => {
        document.getElementById('pills-distributors-activity-tab').classList.add('active');
    }, []);
    const onChange = (value) => {
        setSelectDate(value);
      };
    const handleBackToOrdCalculatorPage = () => {
        history.push("/salescollection/distributors/activity")
      }
    return (
        <>
            <div>
                <DistributorsBreadCrum />
                <DistributorsHeader />
            </div>

            {/* ACTIVITY CONTENT ROW */}

            <div>
                {/* CONTENT ROW */}
                <Card style={{ borderRadius: "25px" }}>
                    <CardBody>
                        <div className='row'>
                            {/* CONTENT LEFT SIDE ROW */}
                            <div className='col-xl-8'>
                                {/* TITLE ROW */}
                                <div>
                                    <span className=" mr-5">
                                        <button className='btn' onClick={handleBackToOrdCalculatorPage}>
                                            <strong>
                                                <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                            </strong>
                                        </button>
                                    </span>
                                    <span className="sales-booking-view-span mr-5">
                                        <strong style={{ fontSize: "13px" }}>{intl.formatMessage({ id: "DISTRIBUTOR.ACTIVITY.ACTIVITY_LOG" })}</strong>
                                    </span>
                                </div>

                                {/* ACTIVITY LOG DETAILS */}

                                <div className='row'>
                                    <div className='col-xl-8'>
                                    <div className='mt-5 activity-log-tilte'>
                                    <p className='text-success'>
                                    12 January, 2022(THU)
                                    </p>
                                    </div>
                                    <ActivityLogDetailts />
                                    </div>
                                </div>
                            </div>
                            {/* CONTENT RIGHT SIDE ROW */}
                            <div className='col-xl-4 mt-5 order-table ord-calculator-calendar p-5'>
                                {/* TITLE ROW */}
                                <div className='mt-5'>
                                    <strong className="text-success">Pick a Date*</strong>
                                </div>
                                {/* CALENDAR ROW */}
                                <div className="react-calendar mt-5">
                                    <Calendar onClickDay={onChange} value={selectDate} required />
                                </div>
                                {/* INFO ROW */}
                                <div className='ord-calculator-info mt-5 p-5'>
                                    <div className='row mt-5'>
                                        <div className='col-xl-8'>
                                            <div className="d-flex mr-5">
                                                <div>
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" />
                                                </div>
                                                <div className="ml-3">
                                                    <span>
                                                        <span style={{ fontWeight: "500" }}><strong>{distributorName}</strong></span>
                                                        <p className="dark-gray-color">
                                                            <i className="bi bi-telephone-fill" style={{ fontSize: "10px" }}></i>&nbsp;{distributorContactNo}
                                                        </p>
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                        <div className='col-xl-4'>
                                            <div>
                                                <button className='btn sales-credit-btn text-right' style={{ padding: "0px 15px", borderRadius: "13px" }}>
                                                    <span className='text-white' style={{ fontSize: "0.83rem" }}>
                                                        {intl.formatMessage({ id: "SALES.RETURN.BALANCE" })}<br />
                                                        {balance}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-5'>
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "LOCATION.TERITORY" })}</span>
                                            <p><strong>{locationTeritory}</strong></p>
                                        </span>
                                    </div>
                                    <div className='row mt-5'>
                                        <div className='col-xl-6'>
                                            <span>
                                                <span className="dark-gray-color"
                                                    style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "LOCATION.AREA" })}</span>
                                                <p><strong>{area}</strong></p>
                                            </span>
                                        </div>
                                        <div className='col-xl-6'>
                                            <span>
                                                <span className="dark-gray-color"
                                                    style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "DEPOT.DEPOT" })}</span>
                                                <p><strong>{depotName}</strong></p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}