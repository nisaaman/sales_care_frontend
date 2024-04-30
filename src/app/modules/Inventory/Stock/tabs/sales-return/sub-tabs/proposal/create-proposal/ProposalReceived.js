import React, {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {toAbsoluteUrl} from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import {Card} from "react-bootstrap";
import {CardBody} from "../../../../../../../../../_metronic/_partials/controls";
import axios from "axios";
import {showError, showSuccess} from '../../../../../../../../pages/Alert';

export default function ProposalReceived() {
    let history = useHistory();
    const routeLocation = useLocation();
    const [productsList, setProductsList] = useState([]);
    const [proposalInfo, setProposalInfo] = useState({});
    const [breadCrumbInfos, setBreadCrumbInfos] = useState({});
    const [locationOfDepot, setLocationOfDepot] = useState({});
    const [distributorLogo, setDistributorLogo] = useState("");
    const [returnNote, setReturnNote] = useState("");
    const [distributorImg, setDistributorImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));

    useEffect(() => {
        document.getElementById('full-screen-close-icon').style.display = "none";
        setProposalInfo(routeLocation.state.state);
        getReturnProposalSummaryAndDetails(routeLocation.state.state.sales_return_proposal_id);
    }, []);

    const handleSave = () => {
        let returnObj = {
            salesReturnProposalId: proposalInfo.sales_return_proposal_id,
            salesReturnProposalTotalAmount: proposalInfo.price,
            returnNote: returnNote.trim()
        };

        const URL = `${process.env.REACT_APP_API_URL}/api/sales-return`;
        axios.post(URL, JSON.stringify(returnObj), {headers: {"Content-Type": "application/json"}}).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message + ' Return No.: ' + response.data.data.returnNo);
                handleBackToListPage();
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot Save Sales Return");
        });
    }

    const getReturnProposalSummaryAndDetails = (salesReturnProposalId) => {
        let queryParams = 'salesReturnProposalId=' + salesReturnProposalId;
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-return-proposal/get-summary-and-details?` + queryParams;
        axios.get(URL).then(response => {
            let map = response.data.data;
            setProductsList(map.detailsList);
            setBreadCrumbInfos(map.proposalInfosForBreadCrumb);
            setLocationOfDepot(map.locationOfDepot);
            getDistributorLogo(map.proposalInfosForBreadCrumb.distributor_id)
        }).catch(err => {

        });
    }

    const handleBackToListPage = () => {
        history.push('/inventory/stock/sales-return/sales-return-list');
    }

    const openFullscreen = () => {
        const elem = document.getElementById("myFullScreen");
        elem.classList.add("scroll-product-search");
        elem.requestFullscreen();
        document.getElementById('full-screen-icon').style.display = "none"
        document.getElementById('full-screen-close-icon').style.display = "inline-block"
    }

    const closeFullscreen = () => {
        const elem = document.getElementById("myFullScreen");
        elem.classList.remove("scroll-product-search");
        document.exitFullscreen();
        document.getElementById('full-screen-icon').style.display = "inline-block"
        document.getElementById('full-screen-close-icon').style.display = "none"
    }

    const getDistributorLogo = (distributorId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/logo/${distributorId}`;
        axios.get(URL).then(response => {
            setDistributorLogo(response.data);
        }).catch(err => {

        });
    }

    const onChangeReturnNote = (event) => {
        let value = event.target.value;
        value = value.trimStart();
        if (value.length <= 250) {
            setReturnNote(value.trimStart());
        }
    }

    return (
        <>
            <div className="container-fluid" id="myFullScreen" style={{background: "#f3f6f9"}}>
                {/* HEADER ROW */}
                <div className="approval-view-header">
                    {/* BACK AND TITLE ROW */}
                    <div className="row">
                        <div className="col-3">
                            <span>
                                <button className='btn' onClick={handleBackToListPage}>
                                    <strong>
                                        <i className="bi bi-arrow-left-short" style={{fontSize: "30px"}}></i>
                                    </strong>
                                </button>
                            </span>
                        </div>
                        <div className="col-6 text-center mt-4">
                            <strong>Sales Return Receive</strong>
                        </div>
                        <div className="col-3 text-right text-muted">
                            <button id="full-screen-icon" className="btn text-white" onClick={openFullscreen}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen.svg")}/>
                            </button>
                            <button id="full-screen-close-icon" className="btn text-white" onClick={closeFullscreen}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen-close.svg")}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* FROM TO AND ADDITIONAL INFO ROW */}
                <div className="bg-white">
                    <div className="container-fluid">
                        <div className="row">
                            {/* FROM ROW */}
                            <div className="col-xl-3 mt-5">
                                <strong className="mt-5 dark-gray-color">Distributor</strong><br/>
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="row no-gutters">
                                        <div className="col-xl-3">
                                            <img className="image-input image-input-circle p-5"
                                                 style={{marginTop: "15px"}}
                                                 src={distributorLogo === undefined || distributorLogo === "" || distributorLogo === null ? distributorImg : `data:image/png;base64,${distributorLogo}`}
                                                 width="100px" height="100px" alt='Distributor’s Picture'/>
                                        </div>
                                        <div className="col-xl-9">
                                            <div className="card-body">
                                                <div style={{fontWeight: "500"}} className="dark-gray-color">
                                                    <strong>{breadCrumbInfos.distributor_name}</strong></div>
                                                <div className="mt-1">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")}
                                                         width="12px" height="12px"/>&nbsp;
                                                    <small
                                                        className="text-muted">{breadCrumbInfos.distributor_contact_no}
                                                    </small>
                                                </div>
                                                <div className="mt-2"><SVG
                                                    src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")}
                                                    width="15px" height="15px"/>
                                                    <small
                                                        className="text-muted">{breadCrumbInfos.sales_officer_location}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* AADDITIONAL INFO ROW */}
                            <div className="col-xl-6 mt-5">
                                <strong className="dark-gray-color">Additional Info</strong><br/>
                                <div className="card mt-3 border-radius-20">
                                    <div className="card-body">
                                        <div className="row">
                                            {/* APPLIED BY ROW */}
                                            <div className="col-xl-6">
                                                <div className="mt-xl-n2"><span
                                                    className="dark-gray-color">Applied By</span></div>
                                                <div className="row no-gutters mt-3">
                                                    <div className="col-xl-3">
                                                        <SVG
                                                            src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")}/>
                                                    </div>
                                                    <div className="col-xl-9">
                                                        <div style={{fontWeight: "500"}} className="dark-gray-color">
                                                            <strong>{breadCrumbInfos.sales_officer_name}</strong></div>
                                                        <div className="mt-1"><SVG
                                                            src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")}
                                                            width="12px" height="12px"/>&nbsp;<small
                                                            className="text-muted">{breadCrumbInfos.sales_officer_designation}, {breadCrumbInfos.sales_officer_location}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Booking Info row */}
                                            <div className="col-xl-6">
                                                <div className="mt-xl-n2"><span
                                                    className="dark-gray-color">Return Proposal Info</span></div>
                                                <div className="row no-gutters mt-3">
                                                    <div className="col-xl-3">
                                                        <SVG
                                                            src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")}/>
                                                    </div>
                                                    <div className="col-xl-9">
                                                        <div style={{fontWeight: "500"}} className="dark-gray-color">
                                                            <strong>{breadCrumbInfos.proposal_no}(Amount: {Number(proposalInfo.price).toFixed(2)})</strong>
                                                        </div>
                                                        <div className="mt-1">&nbsp;
                                                            <small
                                                                className="text-muted">{breadCrumbInfos.proposal_date}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* TO ROW */}
                            <div className="col-xl-3 mt-5">
                                <strong className="mt-5 dark-gray-color">Depot</strong><br/>
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="row no-gutters">
                                        <div className="col-xl-3">
                                            <SVG style={{marginTop: "15px"}} className="p-5"
                                                 src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")}
                                                 width="100px" height="100px"/>
                                        </div>
                                        <div className="col-xl-9">
                                            <div className="card-body">
                                                <div style={{fontWeight: "500"}} className="dark-gray-color">
                                                    <strong>{breadCrumbInfos.depot_name}</strong></div>
                                                <div className="mt-1">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")}
                                                         width="12px" height="12px"/>&nbsp;
                                                    <small
                                                        className="text-muted">{breadCrumbInfos.depot_contact_number}</small>
                                                </div>
                                                <div className="mt-2">
                                                    <SVG
                                                        src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")}
                                                        width="15px" height="15px"/>
                                                    <small className="text-muted">{locationOfDepot?.name}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT ROW */}
                <div className="row mt-5">
                    {/* SALES RETURN PROPOSAL ROW */}
                    <div className="col-xl-8">
                        {/* SALES RETURN PROPOSAL TITLE ROW */}
                        <div>
                            <Card className="h-100" style={{borderTopLeftRadius: "30px", borderTopRightRadius: "30px"}}>
                                <CardBody>
                                    <div className="row no-gutters">
                                        <div className="col-4">
                                            <span className="text-muted">Title</span><br/>
                                            <strong>Sales Return Proposal</strong>
                                        </div>
                                        <div className="col-4 text-left">
                                            <span className="text-muted">Invoice No.</span><br/>
                                            <strong>{breadCrumbInfos.invoice_no}(Amount: {breadCrumbInfos.invoice_amount})</strong><br/>
                                            <strong>{breadCrumbInfos.invoice_date}</strong>
                                        </div>
                                        <div className="col-4 text-right">
                                            <span className="text-muted">Delivery Challan</span><br/>
                                            <strong>{breadCrumbInfos.challan_no}</strong><br/>
                                            <strong>{breadCrumbInfos.delivery_date}</strong>
                                        </div>
                                    </div>
                                    <div className="row no-gutters mt-5">
                                        <div className="col-6">
                                            <span className="text-muted"><strong>PRODUCTS</strong></span>
                                        </div>
                                        <div className="col-6">
                                            <span className="text-muted float-right"><strong>ACTION</strong></span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        <Card className="mt-3">
                            {productsList.map((p, index) =>
                                <CardBody key={index}>
                                    <div className="row">
                                        <div className="col-4">
                                            <span className="text-muted">{p.product_sku}</span><br/>
                                            {/*<strong>{p.product_name} {p.pack_size} {p.abbreviation} x {p.item_size} </strong><br/>*/}
                                            <strong>{p.product_name} {p.item_size} {p.abbreviation} * {p.pack_size} </strong><br/>
                                            <span className="text-muted">{p.product_category_name}</span>
                                        </div>
                                        <div className="col-4">
                                        <span>
                                            <span className="text-muted mr-2">Batch No:</span>
                                            <strong>{p.batch_no}</strong>
                                        </span><br/>
                                            <span>
                                            <span className="text-muted mr-2">Batch Qty:</span>
                                            <strong>{p.batch_quantity}</strong>
                                        </span>
                                        </div>
                                        <div className="col-4 text-right">
                                    <span>
                                    <span className="dark-gray-color mr-2">
                                        <SVG className="mr-2"
                                             src={toAbsoluteUrl("/media/svg/icons/project-svg/total-gray.svg")}/>
                                        Proposed Qty.
                                    </span>
                                    <strong>{p.propose_quantity} (UOM: {p.propose_quantity * p.item_size * p.pack_size} {p.abbreviation})</strong>
                                    </span>
                                            <div className="mt-5">
                                    <span>
                                        <SVG className="mr-2"
                                             src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")}
                                             width="20px" height="20px"/>
                                        <span className="text-muted mr-2">Price</span>
                                        <span><strong>{Number(p.propose_quantity * p.prodcut_price).toFixed(2)}</strong></span>
                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5" style={{border: "1px solid #F2F2F2", width: "100%"}}></div>
                                </CardBody>)}

                        </Card>
                    </div>

                    {/* RETURN RECEIVE ROW */}
                    <div className="col-xl-4">
                        {/* RETURN RECEIVE TITLE ROW */}
                        <Card style={{borderTopRightRadius: "30px", borderTopLeftRadius: "30px"}}>
                            <CardBody>
                                <div>
                                    <span className="text-muted">Title</span><br/>
                                    <strong>Return Receive</strong>
                                </div>
                                <div className="mt-5">
                                    <span className="text-muted float-right"><strong>ACTION</strong></span>
                                </div>
                            </CardBody>
                        </Card>

                        {/* ALL RECEIVED ACTION ROW */}
                        <Card className="mt-5"
                              style={{borderBottomRightRadius: "30px", borderBottomLeftRadius: "30px"}}>
                            <CardBody>
                                {/* NOTES ROW */}
                                <div className="mt-3">
                                    <label className="dark-gray-color">Note</label>
                                    <textarea id="note" type="text" className="form-control" rows="5"
                                              value={returnNote} onChange={onChangeReturnNote}
                                              placeholder="Write here in 250 characters"/>
                                </div>
                                <div className="mt-5">
                                    <button className="btn text-white mr-3 float-right" style={{background: "#6FCF97"}}
                                            onClick={handleSave}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")}/>
                                        &nbsp;<strong>Receive Sales Return</strong>
                                    </button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
