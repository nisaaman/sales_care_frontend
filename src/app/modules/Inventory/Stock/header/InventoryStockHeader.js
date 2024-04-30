import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import {
    Card,
    CardBody,
} from "../../../../../_metronic/_partials/controls";
import { useIntl } from "react-intl";
import Chart from "react-apexcharts";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import { hasAcess, hasAnyAcess } from "../../../Util";

 function InventoryStockHeader({showStockData}) {
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const searchParams = useMemo(() => {
        return {userLoginId:userLoginId, companyId:companyId}
    },[userLoginId,companyId]);
    const intl = useIntl();
    const history = useHistory();
    const [stockData, setStockData] = useState([0, 0, 0, 0]);
    const [depotStockDetails, setDepotStockDetails] = useState([]);
    const [depotAddress, setDepotAddress] = useState('');
    const depotStockInfo = useCallback(() => getDepotStockInfo(companyId, userLoginId), [searchParams])
    

    const inventoryStockSalesOrderFeatures = ['SALES_BOOKING_CONFIRMATION','SALES_ORDER','PICKING_LIST','DELIVERY_CHALLAN','INVOICE'];
    const inventoryStockStockTransferFeatures = ['PRODUCTION_RECEIVE','STOCK_RECEIVE','STOCK_SEND'];

    useEffect(() => {
        depotStockInfo()    
    },[depotStockInfo]);

    const handleStockDataChange = () => {
        history.push("/inventory/stock/stock-list")
    }
    const handleSalesOrderChange = () => {
        if(hasAcess(permissions, 'SALES_BOOKING_CONFIRMATION')){
            history.push("/inventory/stock/sales-order/sales-booking-list");
        }else if(hasAcess(permissions, 'SALES_ORDER')){
            history.push("/inventory/stock/sales-order/sales-order-list");
        }else if(hasAcess(permissions, 'PICKING_LIST')){
            history.push("/inventory/stock/sales-order/picking-list");
        }else if(hasAcess(permissions, 'DELIVERY_CHALLAN')){
            history.push("/inventory/stock/sales-order/delivery-challan-list");
        }else if(hasAcess(permissions, 'INVOICE')){
            history.push("/inventory/stock/sales-order/invoice-list");
        }
        
    }
    const handleSalesReturnChange = () => {
        history.push("/inventory/stock/sales-return/sales-return-list")
    }
    const handleStockTransferChange = () => {
        if(hasAcess(permissions, 'PRODUCTION_RECEIVE')){
            history.push("/inventory/stock/stock-transfer/production-receive")
        } else if (hasAcess(permissions, 'STOCK_RECEIVE')){
            history.push("/inventory/stock/stock-transfer/stock-receive")
        } else if(hasAcess(permissions, 'STOCK_SEND')){
            history.push("/inventory/stock/stock-transfer/stock-send")
        }
    }
    const handleStoreMovementChange = () => {
        history.push("/inventory/stock/stock-store")
    }
    const getDepotStockInfo = (companyId,userLoginId) => {
    
        let queryString = "?";
        queryString += "&companyId="+companyId;
        queryString += "&userLoginId="+userLoginId;
        
        const URL = `${process.env.REACT_APP_API_URL}/api/stock/depot-stock-info`+queryString;
        axios.get(URL).then((response) => {
            setDepotStockDetails(response.data.data);
          
            if(response.data.data[0] !== undefined) {
                setDepotAddress(response.data.data[0].address)
                setStockData([response.data.data[0].regularStock, response.data.data[0].inTransitStock, 
                    response.data.data[0].quarantineStock, response.data.data[0].restrictedStock])
            } else {
                setStockData([0,0,0,0]);
                setDepotAddress('');
            }
           
        }).catch();
        
    }

    const handleDepotChange = (event) => {
        // let name = event.target.name;
        // let value = event.target.value;
        var index = event.nativeEvent.target.selectedIndex;
        const stockValue = depotStockDetails[index]
        setStockData([stockValue.regularStock, stockValue.inTransitStock, stockValue.quarantineStock, stockValue.restrictedStock])
    }

    const handleDamageDeclarationChange = () => {
        history.push("/inventory/stock/stock-damage/stock-damage-declaration")
    }

    const handleProductOpeningStockChange = () => {
        history.push("/inventory/stock/product-opening-stock")
    }

    const handleReportChange = () => {
        history.push("/inventory/stock/stock-report/stock-report-salescollection")
    }

    const state = {
        options: {
            labels: ["Regular", "In Transit", "Quarantine", "Restricted"],
            chart: {
                show: false,
                type: "donut",
            },
            colors: ['#6FCF97', '#56CCF2', '#F2C94C', '#EB5757'],
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                showAlways: true,
                                fontSize: "15px",
                                label: "Total",
                                color: '#BDBDBD',
                                show: true
                            }
                        }
                    }
                }
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                labels: { useSeriesColors: true },
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial',
                fontWeight: 400
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                    }
                }
            ]
        }
    };
    return (
        <>
            {/* TODAY SALE ROW */}
            <div className="mt-3">
                <Card>
                    <CardBody style={{ marginBottom: "-36px" }}>
                        {
                            showStockData ?
                            <div className="d-flex">
                            <div>
                                <div className="mixed-chart">
                                    <Chart
                                        options={state.options}
                                        series={stockData}
                                        type="donut"
                                        width="300"
                                    />
                                </div>
                            </div>
                            <div className="row w-100">
                                <div className="col-xl-10">
                                    <span className="create-field-title display-inline-block">
                                            <select className="form-control" name="categoryName"  onChange={handleDepotChange}>
                                                            {/* <option value="" selected>Select Product Category</option> */}
                                                            {depotStockDetails.map((depotStock) => (
                                                                <option key={depotStock.depotName} value={depotStock.id}>
                                                                    {depotStock.depotName}
                                                                </option>
                                                            ))}
                                            </select>
                                        {/* <span
                                            className="card-div-icon dark-gray-color edit-icon"
                                            style={{ marginLeft: "10px" }}
                                            data-toggle="tooltip" data-placement="bottom" title="Edit"
                                        >
                                            <SVG
                                                className="pen-edit-icon"
                                                src={toAbsoluteUrl("/media/svg/icons/project-svg/eva_edit.svg")} data-toggle="tooltip" data-placement="bottom" title="Edit" />
                                        </span> */}
                                    </span><br />
                                    <span className="display-inline-block mt-5">
                                        <span className="text-muted">
                                            <SVG
                                                className="pen-edit-icon"
                                                src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} />
                                            &nbsp;Area
                                        </span>&nbsp;
                                        <strong className="dark-gray-color">
                                            {depotAddress}
                                        </strong>&nbsp;&nbsp;&nbsp;
                                    </span>
                                </div>
                                <div className="col-xl-2 font-12">
                                    <span className="display-inline-block stock-approval-btn mt-5">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-approved.svg")} width="15px" height="15px" />&nbsp;
                                        Stock Approvals&nbsp;&nbsp;&nbsp;
                                        {/* <span className="bg-danger pl-1 pr-1 text-white rounded">
                                            <small>99+</small>
                                        </span> */}
                                    </span>
                                </div>
                            </div>
                        </div>:""
                        }
                        
                        <div className="mt-5">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-inventory-stock-overview-tab" data-toggle="pill" href="#pills-inventory-stock-overview" role="tab" aria-controls="pills-inventory-stock-overview" aria-selected="false">Overview</a>
                                </li>

                                {/* {hasAcess(permissions, 'STOCK_DATA') &&} */}
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-inventory-stock-stock-data-tab" data-toggle="pill" href="#pills-inventory-stock-stock-data" role="tab" aria-controls="pills-inventory-stock-stock-data" aria-selected="false" onClick={handleStockDataChange}>Stock Data</a>
                                </li>

                                {hasAnyAcess(permissions, inventoryStockSalesOrderFeatures) &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-inventory-stock-sales-order-tab" data-toggle="pill" href="#pills-inventory-stock-sales-order" role="tab" aria-controls="pills-inventory-stock-sales-order" aria-selected="false" onClick={handleSalesOrderChange}>Sales Order&nbsp;
                                        {/* <span className="bg-danger pl-1 pr-1 text-white rounded">
                                            <small>99+</small>
                                        </span> */}
                                    </a>
                                </li>}

                                {hasAcess(permissions, 'SALES_RETURN') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-inventory-stock-sales-return-tab" data-toggle="pill" href="#pills-inventory-stock-sales-return" role="tab" aria-controls="pills-inventory-stock-sales-return" aria-selected="false" onClick={handleSalesReturnChange}>Sales Return&nbsp;
                                        {/* <span className="bg-danger pl-1 pr-1 text-white rounded">
                                            <small>99+</small>
                                        </span> */}
                                    </a>
                                </li>}

                                {hasAnyAcess(permissions, inventoryStockStockTransferFeatures) &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-inventory-stock-stock-transfer-tab" data-toggle="pill" href="#pills-inventory-stock-stock-transfer" role="tab" aria-controls="pills-inventory-stock-stock-transfer" aria-selected="false" onClick={handleStockTransferChange}>Stock Transfer&nbsp;
                                        {/* <span className="bg-danger pl-1 pr-1 text-white rounded">
                                            <small>99+</small>
                                        </span> */}
                                    </a>
                                </li>}

                                {hasAcess(permissions, 'STORE_MOVEMENT') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-inventory-stock-store-movement-tab" data-toggle="pill" href="#pills-inventory-stock-store-movement" role="tab" aria-controls="pills-inventory-stock-store-movement" aria-selected="false" onClick={handleStoreMovementChange}>Store Movement&nbsp;
                                        {/* <span className="bg-danger pl-1 pr-1 text-white rounded">
                                            <small>99+</small>
                                        </span> */}
                                    </a>
                                </li>}

                                {hasAcess(permissions, 'STOCK_DAMAGE_DECLARATION') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-inventory-stock-damage-declaration-tab" data-toggle="pill" href="#pills-inventory-stock-damage-declaration" role="tab" aria-controls="pills-inventory-stock-damage-declaration" aria-selected="false" onClick={handleDamageDeclarationChange}>Stock Damage Declaration</a>
                                </li>}

                                {hasAcess(permissions, 'PRODUCT_OPENING_STOCK') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-inventory-product-opening-stock-tab" data-toggle="pill" href="#pills-inventory-product-opening-stock" role="tab" aria-controls="pills-inventory-product-opening-stock" aria-selected="false" onClick={handleProductOpeningStockChange}>Product Opening Stock</a>
                                </li> }

                                {/* <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-inventory-stock-report-tab" data-toggle="pill" href="#pills-inventory-stock-report" role="tab" aria-controls="pills-inventory-stock-report" aria-selected="false" onClick={handleReportChange}>Report</a>
                                </li> */}
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}

export default React.memo(
    InventoryStockHeader, 
    (prevProps, nextProps) => prevProps.showStockData === nextProps.showStockData
);
  