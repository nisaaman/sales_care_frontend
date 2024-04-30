import React, {useEffect, useState} from "react";
import InventoryBreadCrum from '../../../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../../../header/InventoryStockHeader";
import SalesReturnSubTabs from "../../sub-tabs-header/SalesReturnSubTabs";
import {Card, CardBody} from "../../../../../../../../_metronic/_partials/controls";
import {toAbsoluteUrl} from "../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import ProposalList from "./table/ProposalList";
import {shallowEqual, useSelector} from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import {showError} from '../../../../../../../pages/Alert';

export default function Proposal() {
    const [singleAll, setSingleAll] = useState([]);
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const [timelineList, setTimelineList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [searchInputs, setSearchInputs] = useState({});
    const [selectedLocation, setSelectedLocation] = useState("All");
    const [totalsInfos, setTotalsInfos] = useState({totalProposal: 0, totalProposalAmount: 0});
    const [proposalList, setProposalList] = useState([]);
    const [searchedProposalList, setSearchedProposalList] = useState([]);


    useEffect(() => {
        document.getElementById('pills-inventory-stock-sales-return-tab').classList.add('active');
        document.getElementById('pills-inventory-stock-sales-return-proposal-tab').classList.add('active');
    }, []);

    useEffect(() => {
        getAllFilterListByParams({companyId: selectedCompany});
        setSearchInputs({companyId: selectedCompany, locationId: '', accountingYearId: ''});
        setSelectedLocation("All");
    }, [selectedCompany]);

    useEffect(() => {
        if (searchInputs.companyId !== undefined) {
            getReturnPropoalListByParams(searchInputs);
        }
    }, [searchInputs]);

    useEffect(() => {
        let totalProposal = 0;
        let totalProposalAmount = 0.0;
        proposalList.map(m => {
            if (m.status === "RECEIVE") {
                totalProposal++;
                totalProposalAmount += m.price;
            }
        });
        setTotalsInfos({totalProposal: totalProposal, totalProposalAmount: totalProposalAmount})
    }, [proposalList]);

    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < searchedProposalList.length; i++) {
            let distributor_name = searchedProposalList[i].distributor_name.toLowerCase();
            let proposal_no = searchedProposalList[i].proposal_no.toLowerCase();
            let proposal_date = searchedProposalList[i].proposal_date.toLowerCase();
            let sales_officer_name = searchedProposalList[i].sales_officer_name.toLowerCase();
            let sales_officer_location = searchedProposalList[i].sales_officer_location.toLowerCase();
            let designation_name = searchedProposalList[i].designation_name.toLowerCase();
            let challan_no = searchedProposalList[i].challan_no.toLowerCase();
            let challan_date = searchedProposalList[i].challan_date.toLowerCase();
            let invoice_nature = searchedProposalList[i].invoice_nature.toLowerCase();
            if (distributor_name.includes(searchTextValue)
                ||proposal_no.includes(searchTextValue)
                ||proposal_date.includes(searchTextValue)
                ||sales_officer_name.includes(searchTextValue)
                ||sales_officer_location.includes(searchTextValue)
                ||designation_name.includes(searchTextValue)
                ||challan_no.includes(searchTextValue)
                ||challan_date.includes(searchTextValue)
                ||invoice_nature.includes(searchTextValue)
                ) {
                tp.push(searchedProposalList[i]);
            }
        }
        setProposalList(tp);
    }

    const getReturnPropoalListByParams = (params) => {
        let queryParams = 'companyId=' + params.companyId;
        queryParams += '&locationId=' + params.locationId;
        queryParams += '&accountingYearId=' + params.accountingYearId;
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-return-proposal/get-proposal-list-for-return?` + queryParams;
        axios.get(URL).then(response => {
            let list = response.data.data;
            setProposalList(list);
            setSearchedProposalList(list);
        }).catch(err => {

        });
    }

    const getAllFilterListByParams = (params) => {
        let queryParams = 'companyId=' + params.companyId;
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-invoice/get-list-page-all-filter-list?` + queryParams;
        axios.get(URL).then(response => {
            let dataMap = response.data.data;
            setTimelineList(dataMap.accountingYearList);
            setLocationList(dataMap.locationList);
        }).catch(err => {

        });
    }

    const handleSearchInputsChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({...values, [name]: value}));
        if (name === 'locationId') {
            setSelectedLocation(event.target.options[event.target.selectedIndex].text);
        }
    }

    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.proposal_no = row.proposal_no;
            obj.distributor_name = row.distributor_name;
            obj.proposal_date = row.proposal_date;
            obj.sales_officer_name = row.sales_officer_name;
            obj.sales_officer_location = row.sales_officer_location;
            obj.designation_name = row.designation_name;
            obj.challan_no = row.challan_no;
            obj.challan_date = row.challan_date;
            obj.invoice_nature = row.invoice_nature;
            obj.price = row.price;
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["PROPOSAL NO", "DISTRIBUTOR NAME", "PROPOSAL DATE", "SALES OFFICER NAME", "SALES OFFICER LOCATION", "DESIGNATION NAME", "CHALLAN NO", "CHALLAN DATE", "INVOICE NATURE", "PRICE"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < Heading.length; i++) {
            worksheet[letters.charAt(i).concat('1')].s = {
                font: {
                    name: 'arial',
                    sz: 11,
                    bold: true,
                    color: "#F2F2F2"
                },
            }
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Sales Return Proposals.xlsx");
    }


    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <InventoryBreadCrum/>
            </div>

            {/* HEADER ROW */}
            <div>
               {<InventoryStockHeader showStockData={false} /> }
            </div>

            {/*SUB TABS ROW */}
            <div>
                <SalesReturnSubTabs/>
            </div>

            {/* MAIN CARD ROW */}
            <div>
                <Card>
                    <CardBody>
                        {/* SEARCH AND FILTER ROW */}
                        <div className="row">
                            {/* SEARCH BOX ROW */}
                            <div className="col-xl-3">
                                <div style={{position: "absolute", padding: "7px", marginTop: "3px"}}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px"/>
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className="form-control" name="searchText"
                                    placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                    onChange={handleSearchChange}
                                    />
                                </form>
                            </div>

                            {/* SELECTED ROW */}
                            <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                {/* LOCATION DROPDOWN */}
                                <div className="mr-3">
                                        <div className="row">
                                            <div className="col-3 mt-3">
                                                <label className="dark-gray-color">Location</label>
                                            </div>
                                            <div className="col-9">
                                                <select className="form-control border-0" name="locationId"
                                                        value={searchInputs.locationId || ""}
                                                        onChange={handleSearchInputsChange}>
                                                    <option value="">Select Location</option>
                                                    {locationList.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                {/* TIMELINE DROPDOWN */}
                                <div className="mr-3">
                                        <div className="row">
                                            <div className="col-3 mt-3">
                                                <label className="dark-gray-color">Timeline</label>
                                            </div>
                                            <div className="col-9">
                                                <select className="form-control border-0" name="accountingYearId"
                                                        value={searchInputs.accountingYearId || ""}
                                                        onChange={handleSearchInputsChange}>
                                                    <option value="">Select Fiscal Year</option>
                                                    {timelineList.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.fiscal_year_name}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                {/* FILTER BUTTON ROW */}
                            <div>
                                <button className="btn filter-btn float-right">
                                    <i className="bi bi-funnel" style={{fontSize: "11px"}}></i>&nbsp;Filter
                                </button>
                            </div>
                            </div>
                        </div>

                        {/* ALL SUMMARY ROW */}
                        <div className="row">
                            {/* NO. OF BOOKING ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")}
                                             width="30px" height="30px"/>
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                  style={{fontWeight: "500"}}>Location</span>
                                           <p><strong>{selectedLocation}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* NO. OF BOOKING ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/history.svg")}
                                             width="25px" height="25px"/>
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                  style={{fontWeight: "500"}}>No. of Return Proposal</span>
                                            <p><strong>{totalsInfos.totalProposal}(Pending)</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* BOOKING AMOUNT ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-doller.svg")}
                                             width="25px" height="25px"/>
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                  style={{fontWeight: "500"}}>Return Proposed Amount</span>
                                            <p><strong>{totalsInfos.totalProposalAmount!== null ? totalsInfos.totalProposalAmount.toLocaleString('en-US', {minimumFractionDigits: 2}):0.00}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* EXPORT ROW */}
                            <div className='col-xl-3 sales-data-chip' style={{background: "#F9F9F9"}}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px"
                                         height="15px"/>
                                </button>
                            </div>
                        </div>

                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <ProposalList setSingleAll={setSingleAll} singleAll={singleAll}
                                          proposalList={proposalList}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}