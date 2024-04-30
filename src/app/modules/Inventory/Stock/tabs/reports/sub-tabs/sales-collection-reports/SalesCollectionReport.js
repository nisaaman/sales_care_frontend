import React, { useEffect, useMemo, useState } from 'react';
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import { Card, CardBody } from "../../../../../../../../_metronic/_partials/controls";
import { useHistory } from 'react-router-dom';
import LocationTreeView from '../../../../../../SalesCollection/CommonComponents/LocationTreeView';
import { showError } from '../../../../../../../pages/Alert';
import axios from "axios";
import { useIntl } from "react-intl";
import { shallowEqual, useSelector } from "react-redux";
import ReportsSubTabsHeader from "../../sub-tabs-header/ReportsSubTabsHeader";
import InventoryBreadCrum from '../../../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../../../header/InventoryStockHeader";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import { typeOf } from 'react-is';
import moment from "moment";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";



export default function SalesCollectionReport() {
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const intl = useIntl();
    const [locationTree, setLocationTree] = useState([]);
    //const [company, setCompany] = useState([]);
    const [accountingYearId, setAccountingYearId] = useState('');
    const [locationId, setLocationId] = useState('');
    //const [childCategoryList, setChildCategoryList] = useState([]);
    const [productCategoryId, setProductCategoryId] = useState('');
    // const [allAccountingYear, setAllAccountingYear] = useState([]);
    // const [categoryName, setCategoryName] = useState('All');
    const [salesOfficer, setSalesOfficer] = useState([]);
    const [inputs, setInputs] = useState({});
    const [salesOfficerValue, setSalesOfficerValue] = useState(null);

    const searchParams = useMemo(() => {
        return {
            userLoginId: userLoginId, companyId: selectedCompany, accountingYearId: accountingYearId
            , locationId: locationId, productCategoryId: productCategoryId
        }
    }, [userLoginId, selectedCompany, accountingYearId, locationId, productCategoryId]);

    const [selectedLocation, setSelectedLocation] = useState({});
    const [total, setTotal] = useState({ totalQuantity: 0, totlaSalesAmount: 0 });
    const [salesDataList, setSalesCollectionReportList] = useState([]);

    let history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    let [singleAll, setSingleAll] = React.useState([]);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;
    useEffect(() => {
        document.getElementById('pills-inventory-stock-report-tab').classList.add('active')
        document.getElementById('pills-inventory-stock-sales-collection-report-tab').classList.add('active')
    }, []);

    useEffect(() => {
        getLocationTreeList(searchParams);
    }, [userLoginId, selectedCompany]);

    // useEffect(() => {
    // }, [searchParams]);


    const getLocationTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${params.userLoginId}/${params.companyId}`;
        axios.get(URL).then(response => {
            const locationTree = response.data.data;
            setLocationTree(locationTree);
        }).catch(err => {
            showError("Cannot get Location Tree data.");
        });
    }


    const selectLocationTreeNode = (node) => {
        setSelectedLocation(node);
        setLocationId(node.id);
        getSalesOfficerListByLocation(node.id, selectedCompany)
    }

    const getSalesOfficerListByLocation = (locationId, companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/auth/get-sales-officer-location/${locationId}/${companyId}`;
        axios.get(URL).then(response => {
            if (response.data.data != undefined) {
                setSalesOfficer(response.data.data);
            }
        }).catch(err => {
            showError("Cannot get Company data.");
        });
    }

    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <InventoryBreadCrum />
                {/* TODAY SALE ROW */}
                <InventoryStockHeader showStockData={true} />
                <ReportsSubTabsHeader />
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div className='row'>
                            {/* LEFT SIDE TREE ROW */}
                            <div className='col-xl-3' style={{ borderRight: "1px solid #F2F2F2" }}>
                                <div style={{ borderBottom: "1px solid #F2F2F2" }}>
                                    <label>
                                        <img src={toAbsoluteUrl("/images/loc3.png")}
                                            style={{ width: "20px", height: "20px", textAlign: "center" }}
                                            alt='Company Picture' />
                                        <strong style={{ marginLeft: "10px", color: "#828282" }}>{intl.formatMessage({ id: "COMMON.LOCATION_ALL" })}</strong>
                                    </label>
                                </div>
                                {/* TREE */}
                                <LocationTreeView tree={locationTree} selectLocationTreeNode={selectLocationTreeNode} />
                            </div>
                            {/* RIGHT SIDE LIST ROW */}
                            <div className='col-xl-9'>
                                <div className='mt-5 row'>
                                    <div className='col-xl-8'>
                                        <div style={{ marginTop: "5px" }}>
                                            <label className='level-title'>Sales Officer</label><br />
                                            <Autocomplete
                                                name="id"
                                                options={salesOfficer}
                                                onKeyDown={getSalesOfficerListByLocation}
                                                getOptionLabel={(option) => option.salesOfficerName}
                                                value={salesOfficerValue}
                                                onChange={(event, newValue) => {
                                                    setSalesOfficerValue(newValue)
                                                    if (newValue !== null) {
                                                        setInputs({ ...inputs, id: newValue.id });
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Select Sales Officer*" />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                        <div className='row'>
                        <div className='form-group col-lg-8 first-level-top'>
                        <label className='level-title'>Start Date<i style={{ color: "red" }}>*</i></label>
                            <Flatpickr className="form-control" id="startDate" placeholder="dd-MM-yyyy"
                            value={''}
                            options={{dateFormat: "d-M-Y"}} required
                            onChange={(value) => {
                            console.log("oooooo=", moment(new Date(value)).format("YYYY-MM-DD"));
                            }}
                            />
                        </div>
                    </div>


                        <div className='row'>
                            <div className='form-group col-lg-8 first-level-top'>
                                <label className='level-title'>End Date<i style={{ color: "red" }}>*</i></label>
                                    <Flatpickr className="form-control" id="endDate" placeholder="dd-MM-yyyy"
                                    value={''}
                                    options={{dateFormat: "d-M-Y"}} required
                                    onChange={(value) => {
                                    console.log("oooooo=", moment(new Date(value)).format("YYYY-MM-DD"));
                                    }}
                                     />  
                            </div>
                        </div>


                                <div className='row'>
                                    <div className='form-group col-lg-8 first-level-top'>
                                        <div>
                                            <label className='level-title'><span className="mr-1">Report</span><span className="text-danger ">*</span></label>
                                            <select className="form-control" id="reportId" name="report"
                                            //onChange={(e)=>handleStoreIdChange(e)}
                                            >
                                                <option value="">Select Report</option>
                                                <option value="1">Pdf</option>
                                                <option value="2">Excel</option>

                                                {/* {
                                                allReport.map((report)=>(
                                                <option key={report.id} value={report.id}>
                                                    {report.name}
                                                </option> 
                                                ))
                                            }    */}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <Button className="float-right mt-5" id="gotItBtn" variant="contained"
                                    color="primary"
                                //onClick={previewStockValuation}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}