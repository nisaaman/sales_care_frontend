// import React, { useEffect } from "react";
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import SVG from "react-inlinesvg";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../../../pages/IOSSwitch';
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import PaymentBookSetupBreadCrum from "../../common/PaymentBookSetupBreadCrum";
import PaymentBookSetupHeader from "../../common/PaymentBookSetupHeader";
import { CircularProgressbar } from "react-circular-progressbar";
import { useIntl } from "react-intl";
import { showSuccess, showError } from '../../../../../../pages/Alert';
import { Card, CardBody } from "../../../../../../../_metronic/_partials/controls";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import moment from 'moment';
import "react-circular-progressbar/dist/styles.css";
export default function PaymentBookList() {
    const intl = useIntl();
    const [locationNameSelect, setLocationNameSelect] = useState("All");
    const [selectedLocation, setSelectedLocation] = useState({});
    const [allLocation, setAllLocation] = useState([]);
    const [paymentBookList, setPaymentBookList] = useState([])
    const [searchParams, setSearchParams] = useState({});
    const [selectedCompany, setSelectedCompany] = useState({});
    const [allStatus, setAllStatus] = useState([]);//Status drop down
    const companyId = useSelector((state) => state.auth.company, shallowEqual)//Status drop down
    const history = useHistory();
    const [searchText, setSearchText] = useState("");
    const [searchedPaymentBookList, setSearchedPaymentBookList] = useState([]);

    useEffect(() => {
        document.getElementById('pills-configure-payment-book-tab').classList.add('active')
    }, []);

    useEffect(() => {
        getPaymentBookList({ ...searchParams, companyId: selectedCompany.companyId });
    }, [searchParams]);

    useEffect(() => {//Status Dropdown
        getStatus();
    }, [companyId]);

    const selectStatus = (e) => {
        let list = [];

        let statusTemp;
        if (e.target.value === "all") {
            setSearchedPaymentBookList(paymentBookList);
        }
        else {
            if (e.target.value === "false") {
                statusTemp = false;
            } if (e.target.value === "true") {
                statusTemp = true;
            }


            for (let i = 0; i < paymentBookList.length; i++) {
                if (paymentBookList[i].status === statusTemp) {
                    list.push(paymentBookList[i]);
                    //console.log(list)
                }
            }
            setSearchedPaymentBookList(list);
        }

        // let searchObj = { ...searchParams, status: e.target.value };
        // setSearchParams(searchObj)
    }

    const handleChange = (event) => {
        setPaymentBookList([]);
        setSearchedPaymentBookList([]);
        //console.log(event.target.value)
        if (event.target.value !== null && event.target.value !== "" && event.target.value !== undefined) {
            let name = event.target.name;
            let value = event.target.value;
            setSearchParams(values => ({ ...values, [name]: value }));
        }
    }

    const handleChangeStatus = (event) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/payment-book/update-active-status/` + event.target.value;
        let id = parseInt(event.target.value);
        let checked = event.target.checked;
        let index = paymentBookList.findIndex(paymentBook => (paymentBook.id === id));
        let previousBookList = [...paymentBookList];
        axios.get(URL).then(response => {
            if (response.data.success) {
                showSuccess("Status changed Successfully.");
                previousBookList[index].status = checked;
                setPaymentBookList(previousBookList);
            } else {
                showError(response.data.message);
                previousBookList[index].status = !checked;
                setPaymentBookList(previousBookList);
            }
        }).catch(err => {
            showError("Cannot change status.");
            previousBookList[index].status = !checked;
            setPaymentBookList(previousBookList);
        });
    }

    const handleSearchTextChange = (event) => {
        let value = event.target.value
        setSearchText(value);
        getSearchListFromPaymentBookList(value);
    }

    const getSearchListFromPaymentBookList = (searchText) => {
        let list = [];

        for (let i = 0; i < paymentBookList.length; i++) {
            if (paymentBookList[i].bookNumber.includes(searchText)) {
                list.push(paymentBookList[i]);
                //console.log(list)
            }
        }
        setSearchedPaymentBookList(list);
    }

    const getPaymentBookList = (params) => {
        if (params.companyId != null
            && params.paymentBookLocationId != null) {
            const URL = `${process.env.REACT_APP_API_URL}/api/payment-book/paymentBookList/${params.companyId}/${params.paymentBookLocationId}`;//API call from backend
            axios.get(URL).then(response => {
                setPaymentBookList(response.data.data);
                setSearchedPaymentBookList(response.data.data);
                setSearchText("");
                //console.log(response.data.data)
                if (response.data.data.bookCount === null) {
                    document.getElementById("editPaymentBook").style.display = 'none';
                }
            }).catch(err => {
                showError(intl.formatMessage({ id: "COMMON.ERROR_LOCATION_TREE" }));
            });
        }

    }

    const getLastLocationByCompany = (companyId) => {
        if (companyId) {
            const URL = `${process.env.REACT_APP_API_URL}/api/location/get-last-location-by-company/` + companyId;
            axios.get(URL).then(response => {
                if (response.data.data !== null) {
                    setAllLocation(response.data.data)
                }

            });
        }
    }

    const getCompanySelect = (row) => {
        if (row.companyId === null || row.companyId === undefined || row.companyId === '') {
            setAllLocation([]);
            setSelectedCompany({});
            // setPaymentBookList([]);//
        } else {
            setSelectedCompany(row);
            getLastLocationByCompany(row.companyId);
        }
    }
    //Status Drop Down
    const getStatus = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/approval-status`;
        axios.get(URL).then(response => {
            setAllStatus(response.data.data);
        }).catch(err => {
            showError(intl.formatMessage({ id: "COMMON.ERROR_STATUS" }));
        });
    }

    const handleEditChange = (row) => {
        history.push({ 'pathname': '/salescollection/configure/payment-book/payment-book-setup-new', state: { row } })
    }
    const handleIsActiveChange = (event) => {
        //console.log(event.target.checked)
    }
    return (
        <>
            {/* BREADCRUM ROW */}
            <div>
                <PaymentBookSetupBreadCrum />
                <PaymentBookSetupHeader getSearchInputs={getCompanySelect} />
            </div>

            {/* SEARCH PAYMENT BOOK ROW */}
            <div className="light-gray-bg p-5 rounded">
                <div className="row">
                    <div className="col-xl-3">
                        <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                            <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                        </div>
                        <form className="form form-label-right">
                            <input type="text" className='form-control' name="searchText"
                                placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                value={searchText} onChange={handleSearchTextChange}>
                            </input>
                        </form>
                    </div>
                    <div className="col-xl-9 d-flex flex-wrap justify-content-end">

                        <div className="mr-3">
                            <div className="row">
                                <div className="col-3 mt-3">
                                    <label className="dark-gray-color">Location</label>
                                </div>
                                <div className="col-9">
                                    <select className='form-control' name="paymentBookLocationId" value={searchParams.paymentBookLocationId || ""} onChange={handleChange}>
                                        <option value="">Select Location</option>
                                        {
                                            allLocation.map((l) => (
                                                <option key={l.id} value={l.id}>{l.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mr-3">
                            <div className="row">
                                <div className="col-4 mt-3">
                                    <label className="dark-gray-color">Status</label>
                                </div>
                                <div className="col-8">
                                    <select className="form-control company-select" name="status" onChange={(e) => selectStatus(e)}>
                                        <option value="all" className="fs-1">All</option>
                                        <option value="true" className="fs-1">Active</option>
                                        <option value="false" className="fs-1">Inactive</option>
                                        {/* {
                                    allStatus.map((status) => (
                                        <option value={status.code} className="fs-1">{status.name}</option>
                                    ))
                                } */}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="btn">
                                <i className="bi bi-funnel"></i>&nbsp;Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAYMENT LIST ROW */}
            {
                searchedPaymentBookList.map((data) => (
                    <div className="mt-5">
                        <Card>
                            <CardBody>
                                <div className="row payment-book-custom-padding">
                                    <div className="col-xl-2">
                                        <div className="circular-progress-title text-center"><span><strong>{data.bookCount === null ? data.toMrNo - data.fromMrNo + 1 : data.toMrNo - data.fromMrNo + 1 - data.bookCount}</strong></span><br /><span className="text-primary">Available</span></div>
                                        <div className="configure-payment-book-progress-bar"> <CircularProgressbar maxValue={(data.toMrNo - data.fromMrNo) + 1} variant="static" value={((data.toMrNo - data.fromMrNo) + 1) - ((data.bookCount === null) ? 0 : (data.bookCount))} /></div>
                                    </div>
                                    <div className="col-xl-8">
                                        <div className="row">
                                            <div className="col-xl-4">
                                                <div><span className="text-muted"><strong>Book No.</strong></span><br /><span className=""><strong>{data.bookNumber}</strong></span></div>
                                                <div><br /></div>
                                                <div><span className="text-muted"><strong>MR No.</strong></span><br /><span className=""><strong>{data.fromMrNo} - {data.toMrNo}({data.toMrNo - data.fromMrNo + 1})</strong></span></div>
                                            </div>
                                            <div className="col-xl-4">
                                                <div><span className="text-muted"><strong>Issue Date</strong></span><br /><span><strong>{moment(data.issueDate, "YYYY-MM-DD").format("DD-MMM-YYYY")}</strong></span></div>
                                                <div><br /></div>
                                                <div><span className="text-muted"><strong>Location</strong></span><br /><span><strong>{data.Territory}</strong></span></div>
                                            </div>
                                            <div className="col-xl-4">
                                                <div><span className="text-muted"><strong>Company</strong></span><br /><span><strong>{data.companyName}</strong></span></div>
                                                <div><br /></div>
                                                <div><span className="text-muted"><strong>Entry By</strong></span><br /><span><strong>{data.userName}<span className="text-muted">({data.designation}, {data.companyName})</span></strong></span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-2 d-flex float-right">
                                        <div style={{ marginTop: "-8px" }}>
                                            <FormControlLabel
                                                label={data.status ? "Active" : "Inactive"}
                                                labelPlacement="start"
                                                value={data.id}
                                                control={<IOSSwitch checked={data.status} />}
                                                onChange={(event) => handleChangeStatus(event)}
                                            />
                                        </div>
                                        <div
                                            id="editPaymentBook"
                                            className="card-div-icon dark-gray-color edit-icon mr-5"
                                            style={{ marginLeft: "10px", display: data.bookCount !== null ? "none" : "block" }}
                                            onClick={() => handleEditChange(data)}
                                            data-toggle="tooltip" data-placement="bottom" title="Edit"
                                        >
                                            <SVG
                                                className="pen-edit-icon"
                                                src={toAbsoluteUrl("/media/svg/icons/project-svg/eva_edit.svg")} data-toggle="tooltip" data-placement="bottom" title="Edit" />
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                ))
            }
        </>
    )
}
