import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../_metronic/_partials/controls";
import BatchPreparationBreadCrum from '../../common/BatchPreparationBreadCrum';
import BatchPreparationTabs from '../../common/BatchPreparationTabs';
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { TicketsList } from "./table/TicketsList";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import { showError } from "../../../../../pages/Alert";
import { hasCreateAccess } from "../../../../Util";

export default function Tickets() {
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    let [singleAll, setSingleAll] = useState([]);
    const [allFiscalYear, setAllFiscalYear] = useState([]);
    const [allDepot, setAllDepot] = useState([]);
    const [allSemester, setAllSemester] = useState([]);
    const [ticketsList, setTicketsList] = useState([]);
    const [ticketsListSearch, setTicketsListSearch] = useState([]);
    const [searchParams, setSearchParams] = useState({ companyId: companyId, depotId:null, semesterId:null});
   

    useEffect(() => {
        document.getElementById('pills-inventory-products-tickets-tab').classList.add('active');
        getDepotList(searchParams.companyId)
        getFiscalYear(searchParams.companyId);
        getTicketList(searchParams);
    }, [searchParams]);

    const exportData = (e) => {
        handleExport();
    }

    const handleExport = () => {
        const data = [...singleAll];
        console.log(data)
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.booking_no = row.booking_no;
            obj.product_name = row.product_name;
            obj.depot_name = row.depot_name;
            obj.booking_quantity = row.booking_quantity;
            obj.ticket_quantity = row.booking_quantity - row.stock_quantity;
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["BOOKING NO", "PRODUCT NAME", "DEPOT", "BOOKING QTY.", "TICKET QTY."]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Tickets.xlsx");
    }


    const getDepotList = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/depot/all-of-a-company/${companyId}`;
        axios.get(URL).then(response => {
            setAllDepot(response.data.data);
        }).catch(err => { });
    }

    const getFiscalYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
        axios.get(URL).then(response => {
            setAllFiscalYear(response.data.data);
        }).catch(err => {

        });}
    }

    const handleFiscalYearChange = (e) => {
        if (e.target.value === "") {
            setAllSemester([])
        } else {
            getAllSemester(e.target.value)
        }
    }

    const getAllSemester = (fiscalYearId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/get-with-semesters-by-id/${fiscalYearId}`;
        axios.get(URL).then(response => {
            setAllSemester(response.data.data.semesterList);
        });
    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getTicketList(searchParams)
        } else if (e.keyCode === 8) {
            getTicketList(searchParams)
        }

    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < ticketsListSearch.length; i++) {
            let dbBookingNo = ticketsListSearch[i].booking_no.toLowerCase();
            let depot_name = ticketsListSearch[i].depot_name.toLowerCase();
            let distributor_name = ticketsListSearch[i].distributor_name.toLowerCase();
            let product_sku = ticketsListSearch[i].product_sku.toLowerCase();
            let product_name = ticketsListSearch[i].product_name.toLowerCase();
            let category_name = ticketsListSearch[i].category_name.toLowerCase();
            if (dbBookingNo.includes(searchTextValue)
                || depot_name.includes(searchTextValue)
                || distributor_name.includes(searchTextValue)
                || product_sku.includes(searchTextValue)
                || product_name.includes(searchTextValue)
                || category_name.includes(searchTextValue)) {
                tp.push(ticketsListSearch[i]);
            }
        }
        setTicketsList(tp);
    }
    const handleDepotChange = (event) => {
        if(event.target.value !== ""){
        const name = event.target.name;
        const value = event.target.value;
        let obj = { ...searchParams, depotId: parseInt(value) };
        setSearchParams(obj);
        }else{
            let obj = { ...searchParams, depotId: null };
            setSearchParams(obj); 
        }
        
    }

    const handleSemesterChange = (event) => {
        if(event.target.value !== ""){
        const name = event.target.name;
        const value = event.target.value;
        let obj = { ...searchParams, semesterId: parseInt(value) };
        setSearchParams(obj);
        }else{
            let obj = { ...searchParams, semesterId: null };
            setSearchParams(obj); 
        }
        
    }

    const getTicketList = (params) => {
        let queryParams = 'companyId=' + params.companyId;
        queryParams += params.depotId === null ? "" : '&depotId=' + params.depotId;
        queryParams += params.semesterId === null  ? "" : '&semesterId=' + params.semesterId;
        const URL = `${process.env.REACT_APP_API_URL}/api/material-receive-plan/get-ticket-company-wise?`+ queryParams;
        axios.get(URL).then(response => {
            let list = response.data.data;
            let hasCreatePermission = hasCreateAccess(permissions, "BATCH_PREPARATION_PRODUCT");
            // eslint-disable-next-line array-callback-return
            list.map(m => {
                m.hasCreatePermission = hasCreatePermission;
            });
            setTicketsList(list);
            setTicketsListSearch(response.data.data);
        }).catch(err => { });
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <BatchPreparationBreadCrum />
            </div>

            {/* TABS ROW */}
            <div>
                <BatchPreparationTabs />
            </div>

            {/* MAIN CARD ROW */}
            <div>
                <Card>
                    <CardBody>
                        {/* SEARCH AND FILTER ROW */}
                        <div className="row">
                            {/* SEARCH BOX ROW */}
                            <div className="col-xl-3">
                                <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className="form-control" name="searchText"
                                    placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                    onChange={handleSearchChange}
                                    />
                                </form>
                            </div>

                            {/* SELECTED ROW */}
                            <div className="col-xl-8">
                                <div className="row justify-content-end">
                                    {/* DEPOT DROPDOWN */}
                                    <div className="col-xl-4">
                                        <div className="d-flex">
                                            <div className="mt-3 mr-3">
                                                <label style={{ color: "rgb(130, 130, 130)" }}>Depot</label>
                                            </div>
                                            <div>
                                                <select className="form-control border-0" name="depotId" id="depotId" onChange={handleDepotChange}>

                                                    <option value="">Select Depot</option>
                                                    {allDepot && allDepot.length > 0 && allDepot.map((depot) => (
                                                        <option key={depot.id} value={depot.id}>
                                                            {depot.depot_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TIMELINE DROPDOWN */}
                                    <div className="col-xl-4">
                                        <div className="d-flex">
                                            <div className="mt-3">
                                                <label className="dark-gray-color">Timeline</label>
                                            </div>
                                            <div>
                                                <select className="form-control border-0" id="fiscalYearId" name="fiscalYearId" onChange={(e) => handleFiscalYearChange(e)}>
                                                    <option value="">Select Fiscal Year</option>
                                                    {
                                                        allFiscalYear.map((fiscalYear) => (
                                                            <option key={fiscalYear.id} value={fiscalYear.id}>{fiscalYear.fiscalYearName}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SEMESTER DROPDOWN */}
                                    <div className="col-xl-4">
                                        <div className="d-flex">
                                            <div className="mt-3">
                                                <label className="dark-gray-color">Semester</label>
                                            </div>
                                            <div>
                                                <select className="form-control border-0" id="semesterId" name="semesterId" onChange={handleSemesterChange}>
                                                    <option value="">Select Semester</option>
                                                    {
                                                        allSemester.map((semester) => (
                                                            <option key={semester.id} value={semester.id}>{semester.semesterName}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FILTER BUTTON ROW */}
                            <div className="col-xl-1 mt-1">
                                <button className="btn filter-btn">
                                    <i className="bi bi-funnel" style={{ fontSize: "11px" }}></i>&nbsp;Filter
                                </button>
                            </div>
                        </div>

                        {/* ALL SUMMARY ROW */}
                        <div className='sales-data-chip d-flex flex-wrap justify-content-between'>
                            {/* DEPORT ROW */}
                            <div style={{ borderRadius: "5px 0px 0px 5px" }}>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/depot-gray.svg")} width="15px" height="15px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Depot</span>
                                            <p><strong>All</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* TOTAL TICKETS ROW */}
                            <div>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/dark-gray-category.svg")} width="15px" height="15px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Total Tickets</span>
                                            <p><strong>{ticketsList.length}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div>

                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <TicketsList 
                            setSingleAll={setSingleAll} 
                            singleAll={singleAll} 
                            ticketsList={ticketsList} 
                            searchParams = {searchParams}
                            ticketListAction={getTicketList} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}