import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import ProductsList from "./ProductsList";
import PickingList from "./PickingList";
import OrderList from "./OrderList";
import { useIntl } from "react-intl";
import axios from "axios";
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { showError, showSuccess } from '../../../../../../../../pages/Alert';
import { allowOnlyNumeric, handlePasteDisable, allowOnlyNumericWithZero } from "../../../../../../../Util";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

export default function AddDeliveryChallan() {
    let history = useHistory();
    const location = useLocation();
    const intl = useIntl();
    const [pickingList, setPickingList] = useState(location.state.state.pickingList);
    const [orderList, setOrderList] = useState(location.state.state.orderList);
    const [productList, setProductList] = useState([]);
    const [deliveryChallanList, setDeliveryChallanList] = useState([]);
    const [totalCartQty, setTotalCartQty] = useState(0.00);
    const [orderNo, setOrderNo] = useState("");
    const [orderCount, setOrderCount] = useState(location.state.state.order_count);
    const [vehicleList, setVehicleList] = useState([]);
    const [companyId, setCompanyId] = useState(location.state.state.company_id);
    const [allData, setAllData] = useState(location.state.state);
    const [distributorAndDepot, setDistributorAndDepot] = useState([]);
    const [distributorLogo, setDistributorLogo] = useState();
    const [inputs, setInputs] = useState({ vehicleId: '', driverName: '', driverContactNo: '', remarks: '' });
    const [pickingId, setPickingId] = useState("");
    const [checkBoxStatus, setCheckBoxStatus] = useState(false);
    const [customVehicleShow, setCustomVehicleShow] = useState(true);
    const [vehicleDropdownDisable, setVehicleDropdownDisable] = useState(true);
    const [value, setValue] = React.useState(null);
    let pickingStateList = location.state.state.pickingList
    let orderStateList = location.state.state.orderList
    useEffect(() => {
        document.getElementById('full-screen-close-icon').style.display = "none";
        getAllVehicle();
        //getDistributorAndDepot();
    }, []);

    useEffect(() => {
        setCustomVehicleShow(checkBoxStatus === true ? false : true);
        setVehicleDropdownDisable(checkBoxStatus === true ? true : false);
      }, [checkBoxStatus]);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleCustomVehicleChange = (event) => {
        setCheckBoxStatus(event.target.checked);
        handleCustomVehicleSelect(event.target.checked);
      }

      const handleCustomVehicleSelect = (checkValue) => {
        if (checkValue === true) {
          setInputs(values => ({ ...values, ['vehicleId']: '' }));
          document.getElementById('vehicleId').disabled = true;
        } else {
          setInputs(values => ({ ...values, ['customVehicleNo']: '' }));
          document.getElementById('vehicleId').disabled = false;
        }
      }

      const handleChangeVehicle = (e, dis) => {
        if (dis.id !== null || dis.id !== "") {
            setInputs({ ...inputs, vehicleId: parseInt(dis.id)});
        }
    }
    

    const handleBackToAllListPage = () => {
        history.push('/inventory/stock/sales-order/delivery-challan-list');
    }

    const openFullscreen = () => {
        const elem = document.getElementById("myvideo");
        elem.classList.add("scroll-product-search");
        elem.requestFullscreen();
        document.getElementById('full-screen-icon').style.display = "none"
        document.getElementById('full-screen-close-icon').style.display = "inline-block"
    }

    const closeFullscreen = () => {
        const elem = document.getElementById("myvideo");
        elem.classList.remove("scroll-product-search");
        document.exitFullscreen();
        document.getElementById('full-screen-icon').style.display = "inline-block"
        document.getElementById('full-screen-close-icon').style.display = "none"
    }

    const handleDeletedChange = (obj) => {
        setTotalCartQty(totalCartQty - obj.cartQty);
        // DELIVERY CHALLAN LIST
        const tempDeliveryChallanList = [...deliveryChallanList]
        const deliveryIndex = tempDeliveryChallanList.findIndex((data) => data.pId === obj.pId)
        tempDeliveryChallanList.splice(deliveryIndex, 1);
        setDeliveryChallanList(tempDeliveryChallanList);

        // // PRODUCT LIST
        // const tempProductList = [...productList]
        // const productIndex = tempProductList.findIndex((data)=>data.id === obj.pId)
        // tempProductList[productIndex].orderQty = tempProductList[productIndex].orderQty + obj.cartQty;
        // tempProductList[productIndex].cartQty = tempProductList[productIndex].cartQty - obj.cartQty;
        // setProductList(tempProductList);

    }

    const getAllVehicle = (event) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/vehicle/all-active`;
        axios.get(URL).then(response => {
            if (response.data.success) {
                setVehicleList(response.data.data);
            } else {
                showError(intl.formatMessage({ id: "COMMON.ERROR" }));
            }
        });
    }

    const getDistributorAndDepot = () => {
        let queryString = '?';
        queryString += '&companyId=' + companyId;
        queryString += '&distributorId=' + allData.distributor_id;
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/details-info-with-depot-location` + queryString;
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                let distributorAndDepot = response.data.data.depotAndLocation;
                let distributorLogo = response.data.data.distributorLogo;
                setDistributorAndDepot(distributorAndDepot);
                setDistributorLogo(distributorLogo);
            }
        });
    }

    const handleChallanSubmit = (deliveryChallanList) => {
        let distributorId = location.state.state.distributor_id;
        let depotId = location.state.state.depot.id;
        const challanItemList = [];
        const deliveryChalan = {
            // vehicleId: document.getElementById('vehicleId').value, 
            // driverName: document.getElementById('driverName').value, 
            // remarks: document.getElementById('remarks').value, 
            ...inputs,
            transactionType: 'DELIVERY_CHALLAN',
            companyId: companyId,
            distributorId: distributorId,
            depotId: depotId
        };

        deliveryChallanList.forEach((challan) => {
            challan.batch.forEach((batchValue) => {
                let challanItem = {};
                challanItem['salesOrderDetailsId'] = batchValue.salesOrderDetailsId;
                challanItem['pickingDetailsId'] = batchValue.pickingDetailsId;
                challanItem['batchId'] = Number(batchValue.batchId);
                challanItem['productId'] = batchValue.productId;
                challanItem['quantity'] = batchValue.quantity;
                challanItem['pickingId'] = batchValue.pickingId;
                challanItem['qaStatus'] = 'PASS';
                //challanItem['fromStoreId'] = Number(document.getElementById('fromStoreId-' + batchValue.productId).value);

                challanItemList.push(challanItem);
            });

        });

        challanSave(deliveryChalan, challanItemList);
    }

    const challanSave = (deliveryChalan, challanItemList) => {

        if (deliveryChallanList.length == 0) {
            showError("Please Add Product ");
            return false;
        }
        if ((deliveryChalan.vehicleId === null || deliveryChalan.vehicleId === '') && 
            (deliveryChalan.customVehicleNo === undefined || deliveryChalan.customVehicleNo.trim() === null || 
            deliveryChalan.customVehicleNo.trim() === "" || deliveryChalan.customVehicleNo === "null")) {
            showError("Vehicle is required.");
            return false;
        }
      
        const URL = `${process.env.REACT_APP_API_URL}/api/inv-transaction`;
        axios.post(URL, JSON.stringify({ ...deliveryChalan, invDeliveryChallanDto: deliveryChalan, invTransactionDetailsDtoList: challanItemList }), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                showSuccess("Challan created successfully.");
                // cart set empty
                setDeliveryChallanList([]);
                setProductList([]);

                setInputs({ driverName: '', driverContactNo: '', remarks: '' });
                setTotalCartQty(0.00);
                history.push('/inventory/stock/sales-order/delivery-challan-list');
            }
        }).catch(err => {
            showError(err);
        });
    }

    const handleCardClear = () => {
        setDeliveryChallanList([]);
        setTotalCartQty(0.00);
        setInputs({ driverName: '', driverContactNo: '', remarks: '' });
    }

    return (
        <>
            <div className="container-fluid" id="myvideo" style={{ background: "#f3f6f9" }}>
                {/* HEADER ROW */}
                <div className="approval-view-header">
                    {/* BACK AND TITLE ROW */}
                    <div className="row">
                        <div className="col-3">
                            <span>
                                <button className='btn' onClick={handleBackToAllListPage}>
                                    <strong>
                                        <i className="bi bi-arrow-left-short" style={{ fontSize: "30px" }}></i>
                                    </strong>
                                </button>
                            </span>
                        </div>
                        <div className="col-6 text-center mt-4">
                            <strong>Delivery Challan</strong>
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
                <div className="bg-white">
                    <div className="container-fluid">
                        {/* FROM AND TO ROW */}
                        <div className="row">
                            {/* FROM ROW */}
                            <div className="col-xl-3 mt-5">
                                <strong className="mt-5 dark-gray-color">From</strong><br />
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="row no-gutters">
                                        <div className="col-xl-3">
                                            <SVG style={{ marginTop: "15px" }} className="p-5" src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} width="100px" height="100px" />
                                        </div>
                                        <div className="col-xl-9">
                                            <div className="card-body">
                                                <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>{allData.depot.depot_name}</strong></div>
                                                <div className="mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="12px" height="12px" />&nbsp;<small className="text-muted">+{allData.depot.contact_number}</small></div>
                                                <div className="mt-2"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="15px" height="15px" /><small className="text-muted">{allData.depot.address}</small></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AADDITIONAL INFO ROW */}
                            <div className="col-xl-6 mt-5">
                                <strong className="dark-gray-color mt-n5">Additional Info</strong><br />
                                <div className="card mb-3 mt-3 border-radius-20">

                                    <div className="card-body">
                                        <div className="row">
                                            {/* APPLIED BY ROW */}
                                            {/* <div className="col-xl-4">
                                                <div><span className="dark-gray-color">Applied By</span></div>
                                                <div className="row no-gutters mt-3">
                                                    <div className="col-xl-3">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} />
                                                    </div>
                                                    <div className="col-xl-9">
                                                        <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>Mohammad Atif Aslam</strong></div>
                                                        <div className="mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="12px" height="12px" />&nbsp;<small className="text-muted">Sales Officer, Cox’s Bazar</small></div>

                                                    </div>
                                                </div>
                                            </div> */}

                                            {/* Booking Info row */}
                                            {/* <div className="col-xl-4">
                                                <div><span className="dark-gray-color">Booking Info</span></div>
                                                <div className="row no-gutters mt-3">
                                                    <div className="col-xl-3">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} />
                                                    </div>
                                                    <div className="col-xl-9">
                                                        <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>Mohammad Atif Aslam</strong></div>
                                                        <div className="mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="12px" height="12px" />&nbsp;<small className="text-muted">Sales Officer, Cox’s Bazar</small></div>

                                                    </div>
                                                </div>
                                            </div> */}

                                            {/* Delivery Info row */}
                                            {/* <div className="col-xl-4">
                                                <div><span className="dark-gray-color">Delivery Info</span></div>
                                                <div className="row no-gutters mt-3">
                                                    <div className="col-xl-3">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} />
                                                    </div>
                                                    <div className="col-xl-9">
                                                        <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>Mohammad Atif Aslam</strong></div>
                                                        <div className="mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="12px" height="12px" />&nbsp;<small className="text-muted">Sales Officer, Cox’s Bazar</small></div>

                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* TO ROW */}
                            <div className="col-xl-3 mt-5">
                                <strong className="mt-5 dark-gray-color">To</strong><br />
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="row no-gutters">
                                        <div className="col-xl-3">
                                            <SVG style={{ marginTop: "15px" }} className="p-5" src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} width="100px" height="100px" />
                                        </div>
                                        <div className="col-xl-9">
                                            <div className="card-body">
                                                <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>{allData.distributor_name}</strong></div>
                                                <div className="mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="12px" height="12px" />&nbsp;<small className="text-muted">+{allData.contact_no}</small></div>
                                                <div className="mt-2"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="15px" height="15px" /><small className="text-muted">{allData.ship_to_address}</small></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 mb-5">
                    {/* MAIN CONTENT BODY ROW */}
                    <div className="row">

                        {/* PICKING LIST SIDE CONTENT */}
                        <div className="col-xl-2">
                            <PickingList
                                pickingList={pickingList}
                                setPickingId={setPickingId}
                                setOrderList={setOrderList}
                                setProductList={setProductList}
                                companyId={companyId}
                                setPickingList={setPickingList}
                                pickingStateList={pickingStateList}
                                orderStateList={orderStateList}
                            />
                        </div>

                        {/* SALES ORDER LIST SIDE CONTENT */}
                        <div className="col-xl-2"><OrderList orderCount={orderCount}
                            orderList={orderList} setOrderNo={setOrderNo}
                            productList={productList} setProductList={setProductList} depot={location.state.state.depot}
                            pickingId={pickingId}
                        /></div>

                        {/* PRODUCTS LIST SIDE CONTENT */}
                        <div className="col-xl-5">
                            {/* TITLE ROW */}
                            <div>
                                {/* BOOKING SUMMARY TITLE CARD */}
                                <Card className="h-100" style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                                    <CardBody>
                                        <div>
                                            <span>
                                                <span className="text-muted">Order No.</span><br />
                                                <strong>{orderNo}</strong>
                                            </span>
                                        </div>
                                        <div className="mt-5">
                                            <span className="text-muted"><strong>PRODUCTS</strong></span>
                                            <span className="text-muted float-right"><strong>ACTION</strong></span>
                                        </div>

                                    </CardBody>
                                </Card>
                            </div>

                            {/* SEARCH ROW */}
                            <div className="mt-5">
                                <div style={{ position: "absolute", padding: "7px", marginTop: "7px" }}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className="form-control h-50px" name="searchText"
                                        placeholder="Scan/Search Product by QR Code or Name" style={{ paddingLeft: "28px" }} />
                                </form>
                            </div>
                            {/* DATA ROW */}
                            <div>
                                <ProductsList totalCartQty={totalCartQty} setTotalCartQty={setTotalCartQty} setDeliveryChallanList={setDeliveryChallanList} deliveryChallanList={deliveryChallanList} productList={productList} setProductList={setProductList}
                                    pickingId={pickingId}
                                />
                            </div>

                        </div>

                        {/*  CARD SIDE CONTENT */}
                        <div className="col-xl-3">
                            {/* NEW CHALLAN ADD TITLE ROW */}
                            <Card style={{ borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}>
                                <CardBody>
                                    {/* <div>
                                        <span className="text-muted">Challan No.</span><br />
                                        <strong>54123697</strong>
                                    </div> */}
                                    <div className="mt-5">
                                        <span className="text-muted"><strong>PRODUCTS</strong></span>
                                        <span className="text-muted float-right"><strong>ACTION</strong></span>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* NEW CHALLAN ADD DATA  ROW */}
                            {
                                deliveryChallanList.map((deliveryChalan, index) => (
                                    <Card className="mt-4" key={index}>
                                        <CardBody>
                                            <div className="d-flex">
                                                <div className="ml-n3 mt-3"><span className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                                                <div className="w-100 pl-5">
                                                    <div>
                                                        <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={() => handleDeletedChange(deliveryChalan)}>
                                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted">{deliveryChalan.productSku}</span><br />
                                                        <strong>{deliveryChalan.productName}</strong><br />
                                                        <span className="text-muted">{deliveryChalan.category}</span><br />
                                                    </div>
                                                    <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>

                                                    {/* BATCH WISW QTY ROW */}
                                                    {
                                                        deliveryChalan.batch.map((batchData) => (
                                                            <div className="mt-5">
                                                                <span className="text-muted mr-5">{batchData.batchName}</span>
                                                                <span className="light-gray-bg dark-color-gray rounded p-1"><strong>Qty.&nbsp;{batchData.quantity}</strong></span>
                                                            </div>
                                                        ))
                                                    }
                                                    <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>

                                                    {/* TOTAL QTY ROW */}
                                                    <div className="mt-3">
                                                        <span>Qty.
                                                            <strong>&nbsp;{deliveryChalan.cartQty}&nbsp;</strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))
                            }
                            {/* TRANSPORT INFO ROW */}
                            <Card className="mt-4">
                                <CardBody>
                                    <div className="mt-3">
                                        <span className="display-inline-block rounded light-gray-bg pl-2 pt-1 pb-1 pr-2 mr-5">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/delivery.svg")} />
                                        </span>
                                        <strong className="display-inline-block">ADD Transport</strong>
                                    </div>
                                    <div className="mt-5 ml-5">
                                        <span className="dark-blue-color">From</span><br />
                                        <small className="text-muted">
                                            {allData.depot.address}
                                        </small><br />
                                        <span className="dark-purple-color">To</span><br />
                                        <small className="text-muted">
                                            {allData.ship_to_address}
                                        </small>
                                    </div>
                                    <div className="mt-5 ml-5">
                                        <span>
                                            <label className="dark-gray-color"><span className="mr-1">Vehicle</span><span className="text-danger">*</span></label>
                                            <Autocomplete
                                                id="vehicleId"
                                                name="vehicleId"
                                                options={vehicleList}
                                                value={value}
                                                getOptionLabel={(option) => option.vehicleOwnership !== null ?option.registrationNo+", "+option.vehicleOwnership:option.registrationNo}
                                                onChange={(event, newValue) => {
                                                    setValue(newValue)
                                                    if(newValue) {
                                                        handleChangeVehicle(event, newValue)
                                                }                                                   
                                                }}
                                                disabled={vehicleDropdownDisable}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Choose Vehicle No" />
                                                )}
                                            />
                                        </span>
                                        {/* <span>
                                            <label className="dark-gray-color"><span className="mr-1">Vehicle</span><span className="text-danger">*</span></label>
                                            <select id="vehicleId" name="vehicleId" className="form-control"
                                                value={inputs.vehicleId || ""} onChange={handleChange}  disabled={vehicleDropdownDisable}>
                                                <option value="">Choose Vehicle No</option>
                                                {
                                                    vehicleList.map((vehicle) => (
                                                        <option key={vehicle.id} value={vehicle.id}
                                                            className="fs-1">{vehicle.registrationNo},&nbsp;{vehicle.vehicleOwnership}</option>
                                                    ))
                                                }
                                            </select>
                                        </span> */}
                                        <span>
                                            <div className='row'>
                                                    <div className='form-group col-lg-12'>
                                                        <FormGroup aria-label="position" name="position"
                                                        value=""
                                                        row>
                                                        <FormControlLabel
                                                            control={<Checkbox color="primary"
                                                            id='customVehicleCheckBox'
                                                            checked={checkBoxStatus} 
                                                            />}
                                                            label="Create New Vehicle"
                                                            labelPlacement="end"
                                                            onChange={handleCustomVehicleChange}
                                                        />                               
                                                        </FormGroup>
                                                    </div>
                                                    </div>
                                                    <div className='row' id="customVehicleId" 
                                                        hidden={customVehicleShow}>
                                                        <div className='form-group col-lg-12'>
                                                            <input id="customVehicleNo" type="text" className='form-control' name="customVehicleNo" 
                                                            value={inputs.customVehicleNo || ""} onChange={handleChange} maxLength={100}></input>
                                                        </div>
                                                    </div>
                                        </span>
                                    
                                        <span className="mt-5">
                                            <label>Driver Name</label>
                                            <input id="driverName" className="form-control" type="text" name="driverName"
                                                maxLength={30} value={inputs.driverName || ""} onChange={handleChange} />
                                        </span><br />

                                        <span>
                                            <label>Driver Contact No</label>
                                            <input name="driverContactNo" className="form-control" type="text" maxLength={20}
                                                value={inputs.driverContactNo || ""} onChange={handleChange} 
                                                onKeyPress={(e) => allowOnlyNumericWithZero(e)} onPaste={handlePasteDisable} />
                                        </span><br />

                                        <span>
                                            <label>Remarks</label>
                                            <input id="remarks" name="remarks" className="form-control" type="text" maxLength={150} 
                                                value={inputs.remarks || ""} onChange={handleChange} />
                                        </span>

                                    </div>
                                </CardBody>
                            </Card>

                            {/* TOTAL CHALLAN QTY ROW */}
                            <Card className="mt-4" style={{ borderBottomRightRadius: "30px", borderBottomLeftRadius: "30px" }}>
                                <CardBody>

                                    {/* TOTAL QTY COUNT ROW */}
                                    <div className="mt-3">
                                        <strong>Total Qty.</strong>

                                        <strong className="float-right">{totalCartQty}</strong>
                                    </div>

                                    <div className="mt-5" style={{ border: "1px solid #4F4F4F", width: "100%" }}></div>

                                    <div className="pt-5 d-flex justify-content-between">
                                        <button className="btn dark-danger-color" style={{ background: "#F9F9F9", color: "#0396FF" }}
                                            onClick={() => handleCardClear()}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />
                                            &nbsp;<strong>Cancel</strong>
                                        </button>
                                        <button className="btn text-white mr-3 float-left" style={{ background: "#6FCF97" }}
                                            onClick={() => handleChallanSubmit(deliveryChallanList)}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-approved.svg")} />
                                            &nbsp;<strong>Submit Delivery Challan</strong>
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}