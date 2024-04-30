import React , {useState, useEffect, useMemo} from "react";
import axios from "axios";
import { useIntl } from "react-intl";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import {Card, CardBody} from "../../../../../../_metronic/_partials/controls";
import {showError} from '../../../../../pages/Alert';
import LocationTreeView from '../../../CommonComponents/LocationTreeView';
import { BreadCrum } from "../../common/BreadCrum";
import { shallowEqual, useSelector } from "react-redux";
import SalesTabsHeader from "../../common/SalesTabsHeader"
import { SalesReturnList } from "../table/SalesReturnList";

export function SalesReturn(props) {
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    let [singleAll, setSingleAll] = useState([]);
    const [accountingYearId, setAccountingYearId] = useState('');
    const [allAccountingYear, setAllAccountingYear] = useState([]);
    const [locationId, setLocationId] = useState('');
    const [totalReturnProposalAmount, setTotalReturnProposalAmount] = useState(0.00);

    const searchParams = useMemo(() => {
        return {userLoginId: userLoginId, companyId: selectedCompany, accountingYearId: accountingYearId,
            locationId:locationId}
    },[userLoginId, selectedCompany, accountingYearId,locationId])

    const [locationTree, setLocationTree] = useState([]);

    const [selectedLocation, setSelectedLocation] = useState({});
    const [salesReturnProposalList, setSalesReturnProposalList] = useState([]);
    const [locationTypeNameSelect, setLocationTypeNameSelect] = useState("Area");
    const intl = useIntl();

    useEffect(() => {
        document.getElementById('pills-sales-return-tab').classList.add('active')
        getLocationTreeList(searchParams);
        getAccountingYear(selectedCompany)
    }, [userLoginId,selectedCompany]);

    useEffect(() => {
        getSalesReturnProposalList(searchParams);
    },[searchParams]);


    const handleExport = () => {
        const exportData = [...singleAll]
    }

    const getLocationTreeList = (searchParams) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${searchParams.userLoginId}/${searchParams.companyId}`;
        if (searchParams.companyId) {          
        axios.get(URL).then(response => {
            const locationTree = response.data.data;
            setLocationTree(locationTree);
        }).catch(err => {
            showError(intl.formatMessage({id: "COMMON.ERROR_LOCATION_TREE"}));
        });  
        }
    }

    const selectLocationTreeNode = (node) => {
        let id = "summary-id-"+node.id;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('tree-nav-item');
        }
        if (getId) {
            getId.classList.add('tree-nav-item');
            let searchObj={...searchParams,locationId:node.id.toString()};
            setLocationId(node.id);
            setSelectedLocation(node);
        }
    }

    const getSalesReturnProposalList = (params) => {

        let queryString = "?";
        queryString += 'userLoginId='+params.userLoginId;
        queryString += params.locationId ? '&locationId=' +params.locationId : '';
        queryString += params.accountingYearId ? '&accountingYearId='+params.accountingYearId : '';
        queryString += '&companyId='+params.companyId;

        const URL = `${process.env.REACT_APP_API_URL}/api/sales-return-proposal-data/over-view`+queryString;
        if (params.companyId) {   
        axios.get(URL).then(response => {
            let list = response.data.data;
            console.log(list);
            let totalAmount =0;
            list.map(l =>{
                totalAmount += Number(l.returnProposalAmount);
                l.returnProposalAmount = Number(l.returnProposalAmount).toFixed(2);
            });
            setTotalReturnProposalAmount(totalAmount);
            setSalesReturnProposalList(response.data.data)
        }).catch(err => {

        });
        }
    }

    const getAccountingYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
        axios.get(URL).then(response => {
            setAllAccountingYear(response.data.data);
        }).catch(err => {
            //showError(intl.formatMessage({ id: "COMMON.ERROR_STATUS" }));
        });
    }
    }

    const setAccountingYearData = (event) => {

        setAccountingYearId(event.target.value)
    }

    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getSalesReturnProposalList(searchParams);
        } else if (e.keyCode === 8) {
            getSalesReturnProposalList(searchParams);
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < salesReturnProposalList.length; i++) {
            let distributorName = salesReturnProposalList[i].distributorName.toLowerCase();
            let salesOfficer = salesReturnProposalList[i].salesOfficer.toLowerCase();
            let proposalNo = salesReturnProposalList[i].proposalNo.toLowerCase();
            let invoiceNo = salesReturnProposalList[i].invoiceNo.toLowerCase();
            if (distributorName.includes(searchTextValue)
                || salesOfficer.includes(searchTextValue)
                || proposalNo.includes(searchTextValue)
                || invoiceNo.includes(searchTextValue)
            ) {
                tp.push(salesReturnProposalList[i]);
            }
        }
        setSalesReturnProposalList(tp);
    }

    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <BreadCrum />
                {/* TODAY SALE ROW */}
                <SalesTabsHeader />
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div>
                            <div className='row'>
                                {/* LEFT SIDE TREE ROW */}
                                <div className='col-xl-3' style={{ borderRight: "1px solid #F2F2F2" }}>
                                    <div style={{ borderBottom: "1px solid #F2F2F2" }}>
                                        <label>
                                            <img src={toAbsoluteUrl("/images/loc3.png")}
                                                style={{ width: "20px", height: "20px", textAlign: "center" }}
                                                alt='Company Picture' />
                                            <strong style={{ marginLeft: "10px", color: "#828282" }}>Location (All)</strong>
                                        </label>
                                    </div>
                                    {/* TREE */}
                                    <LocationTreeView tree={locationTree}
                                                      selectLocationTreeNode={selectLocationTreeNode}/>
                                </div>
                                {/* RIGHT SIDE LIST ROW */}
                                <div className='col-xl-9'>
                                    {/* SEARCHING AND FILTERING ROW */}
                                    <div className="row">
                                        <div className="col-xl-3">
                                            <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                                <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                            </div>
                                            <form className="form form-label-right">
                                                <input type="text" className="form-control" name="searchText"
                                                    placeholder="Search Here"
                                                    style={{ paddingLeft: "28px" }}
                                                    onKeyUp={(e) => handleKeyPressChange(e)}
                                                    onChange={handleSearchChange}
                                                />
                                            </form>
                                        </div>
                                        <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                            <div className="mr-3">
                                                <div className="row">
                                                        <div className="col-3 mt-3">
                                                            <label className="dark-gray-color">Timeline</label>
                                                        </div>
                                                        <div className="col-9">
                                                            <select className="border-0 form-control" value={accountingYearId} onChange={setAccountingYearData}>
                                                            <option value=''>Select Fiscal Year</option>
                                                                    {allAccountingYear.map((accYear) => (
                                                                    <option key={accYear.fiscalYearName} value={accYear.id}>
                                                                            {accYear.fiscalYearName}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            <div>
                                                <button className="btn filter-btn">
                                                    <i className="bi bi-funnel"></i>&nbsp;Filter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ALL SUMMARY ROW */}
                                    <div className='row ml-2'>
                                        <div className='col-xl-4 sales-data-chip' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="25px" height="25px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{locationTypeNameSelect}</span>
                                                        <p><strong>{selectedLocation.locationName?selectedLocation.locationName:'All'}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-xl-4 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>

                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <img src={toAbsoluteUrl("/images/LineChart.png")} width="24px" height="24px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{intl.formatMessage({id: "SALES.RETURN.AMOUNT"})}</span>
                                                        <p><strong>{Number(totalReturnProposalAmount).toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-4 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                            <button className="btn float-right export-btn" onClick={handleExport}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/export.svg")} width="15px" height="15px" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* TABLE ROW */}
                                    <div className='mt-5'>
                                        <SalesReturnList setSingleAll={setSingleAll} singleAll={singleAll} salesReturnProposalList={salesReturnProposalList} />
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