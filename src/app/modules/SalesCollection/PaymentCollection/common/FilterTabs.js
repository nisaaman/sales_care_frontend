import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { useIntl } from "react-intl";

export default function FilterTabs({invoiceSearchParams, setInvoiceSearchParams}) {
    let history = useHistory();
    const intl = useIntl();
    
    useEffect(() => {
        document.getElementById("all").classList.add("invoices-filter-span-change");
        document.getElementById("all").setAttribute("selected", "true");
    }, []);

    const handleAllBackgroundChange = () => {
        const getId = document.getElementById("all");
        const attributrValue = getId.getAttribute("selected");

        document.getElementById("cash").classList.remove("invoices-filter-span-change");
        document.getElementById("cash").setAttribute("selected", "false");

        document.getElementById("credit").classList.remove("invoices-filter-span-change");
        document.getElementById("credit").setAttribute("selected", "false");

        document.getElementById("acknowledgement-pending").classList.remove("invoices-filter-span-change");
        document.getElementById("acknowledgement-pending").setAttribute("selected", "false");

        if (attributrValue == "true") {
            document.getElementById("all").classList.remove("invoices-filter-span-change");
            document.getElementById("all").setAttribute("selected", "false");
        } else {
            document.getElementById("all").classList.add("invoices-filter-span-change");
            document.getElementById("all").setAttribute("selected", "true");
            setInvoiceSearchParams({...invoiceSearchParams, invoiceNature:'', isAcknowledged: ''});
            //console.log("invoiceSearchParams", invoiceSearchParams);
        }     
    }

    const handleCashBackgroundChange = () => {
        const getId = document.getElementById("cash");
        const attributrValue = getId.getAttribute("selected");
        document.getElementById("all").classList.remove("invoices-filter-span-change");
        document.getElementById("all").setAttribute("selected", "false");

        document.getElementById("credit").classList.remove("invoices-filter-span-change");
        document.getElementById("credit").setAttribute("selected", "false");

        if (attributrValue == "true") {
            document.getElementById("cash").classList.remove("invoices-filter-span-change");
            document.getElementById("cash").setAttribute("selected", "false");
            setInvoiceSearchParams({...invoiceSearchParams, invoiceNature:''});
        } else {
            document.getElementById("cash").classList.add("invoices-filter-span-change");
            document.getElementById("cash").setAttribute("selected", "true");
            setInvoiceSearchParams({...invoiceSearchParams, invoiceNature:'CASH'});
        } 
    }

    const handleAcknowledgementPending = () => {
        const getId = document.getElementById("acknowledgement-pending");
        const attributrValue = getId.getAttribute("selected");
        document.getElementById("all").classList.remove("invoices-filter-span-change");
        document.getElementById("all").setAttribute("selected", "false");
        if (attributrValue == "true") {
            document.getElementById("acknowledgement-pending").classList.remove("invoices-filter-span-change");
            document.getElementById("acknowledgement-pending").setAttribute("selected", "false");
            setInvoiceSearchParams({...invoiceSearchParams, isAcknowledged: ''})
        }
        else {
            document.getElementById("acknowledgement-pending").classList.add("invoices-filter-span-change");
            document.getElementById("acknowledgement-pending").setAttribute("selected", "true");
            setInvoiceSearchParams({...invoiceSearchParams, isAcknowledged: 'N'})
        }
    }

    const handleCreditBackgroundChange = () => {
        const getId = document.getElementById("credit");
        const attributrValue = getId.getAttribute("selected");

        document.getElementById("all").classList.remove("invoices-filter-span-change");
        document.getElementById("all").setAttribute("selected", "false");

        document.getElementById("cash").classList.remove("invoices-filter-span-change");
        document.getElementById("cash").setAttribute("selected", "false");

        if (attributrValue == "true") {
            document.getElementById("credit").classList.remove("invoices-filter-span-change");
            document.getElementById("credit").setAttribute("selected", "false");
            setInvoiceSearchParams({...invoiceSearchParams, invoiceNature:''})
        } else {
            document.getElementById("credit").classList.add("invoices-filter-span-change");
            document.getElementById("credit").setAttribute("selected", "true");
            setInvoiceSearchParams({...invoiceSearchParams, invoiceNature:'CREDIT'})
        } 
    }
    const handleNotDuesBackgroundChange = () => {
        const getId = document.getElementById("not-dues");
        const attributrValue = getId.getAttribute("selected");

        document.getElementById("all").classList.remove("invoices-filter-span-change");
        document.getElementById("all").setAttribute("selected", "false");
       // const allFilterId = document.getElementById("all");
        //const allFilterAttributeValue = allFilterId.getAttribute("selected")

        const cashFilterId = document.getElementById("cash");
        const cashFilterAttributeValue = cashFilterId.getAttribute("selected")

        if (attributrValue == "true") {
           
            document.getElementById("not-dues").classList.remove("invoices-filter-span-change");
            document.getElementById("not-dues").setAttribute("selected", "false");
            setInvoiceSearchParams({...invoiceSearchParams, notDues:0});
        } else {
            document.getElementById("not-dues").classList.add("invoices-filter-span-change");
            document.getElementById("not-dues").setAttribute("selected", "true");
            setInvoiceSearchParams({...invoiceSearchParams, notDues: 1});
        }   
    }

    const handle1to30BackgroundChange = () => {
        const getId = document.getElementById("1-30-days");
        const attributrValue = getId.getAttribute("selected");

        const allFilterId = document.getElementById("all");
        const allFilterAttributeValue = allFilterId.getAttribute("selected")

        const cashFilterId = document.getElementById("cash");
        const cashFilterAttributeValue = cashFilterId.getAttribute("selected")

        const creditFilterId = document.getElementById("all");
        const creditFilterAttributeValue = creditFilterId.getAttribute("selected")

        if (attributrValue == "true") {
            document.getElementById("1-30-days").classList.remove("invoices-filter-span-change");
            document.getElementById("1-30-days").setAttribute("selected", "false");
            
            const index = invoiceSearchParams.overDueParams.indexOf('THIRTY');
            if (index !== -1) {
                invoiceSearchParams.overDueParams.splice(index, 1);
            }
            setInvoiceSearchParams({...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams]})
        } else {
            document.getElementById("1-30-days").classList.add("invoices-filter-span-change");
            document.getElementById("1-30-days").setAttribute("selected", "true");
            setInvoiceSearchParams({...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams,'THIRTY']})
        }
   
    }
    const handle31to60BackgroundChange = () => {
        const getId = document.getElementById("31-60-days");
        const attributrValue = getId.getAttribute("selected");

        const allFilterId = document.getElementById("all");
        const allFilterAttributeValue = allFilterId.getAttribute("selected")

        const cashFilterId = document.getElementById("cash");
        const cashFilterAttributeValue = cashFilterId.getAttribute("selected")

        const creditFilterId = document.getElementById("all");
        const creditFilterAttributeValue = creditFilterId.getAttribute("selected")

        if (attributrValue == "true") {
            document.getElementById("31-60-days").classList.remove("invoices-filter-span-change");
            document.getElementById("31-60-days").setAttribute("selected", "false");
            const index = invoiceSearchParams.overDueParams.indexOf('SIXTY');
            if (index !== -1) {
                invoiceSearchParams.overDueParams.splice(index, 1);
            }
            setInvoiceSearchParams(invoiceSearchParams = {...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams]})
        } else {
            document.getElementById("31-60-days").classList.add("invoices-filter-span-change");
            document.getElementById("31-60-days").setAttribute("selected", "true");
            setInvoiceSearchParams(invoiceSearchParams = {...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams,'SIXTY']})
        }
        
        
    }
    const handle61to90BackgroundChange = () => {
        const getId = document.getElementById("61-90-days");
        const attributrValue = getId.getAttribute("selected");

        const allFilterId = document.getElementById("all");
        const allFilterAttributeValue = allFilterId.getAttribute("selected")

        const cashFilterId = document.getElementById("cash");
        const cashFilterAttributeValue = cashFilterId.getAttribute("selected")

        const creditFilterId = document.getElementById("all");
        const creditFilterAttributeValue = creditFilterId.getAttribute("selected")

        if (attributrValue == "true") {
            document.getElementById("61-90-days").classList.remove("invoices-filter-span-change");
            document.getElementById("61-90-days").setAttribute("selected", "false");
            const index = invoiceSearchParams.overDueParams.indexOf('NINETY');
            if (index !== -1) {
                invoiceSearchParams.overDueParams.splice(index, 1);
            }
            setInvoiceSearchParams({...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams]})
        } else {
            document.getElementById("61-90-days").classList.add("invoices-filter-span-change");
            document.getElementById("61-90-days").setAttribute("selected", "true");
            setInvoiceSearchParams({...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams,'NINETY']})
        }

        
        
    }
    const handle91to120BackgroundChange = () => {
        const getId = document.getElementById("91-120-days");
        const attributrValue = getId.getAttribute("selected");

        const allFilterId = document.getElementById("all");
        const allFilterAttributeValue = allFilterId.getAttribute("selected")

        const cashFilterId = document.getElementById("cash");
        const cashFilterAttributeValue = cashFilterId.getAttribute("selected")

        const creditFilterId = document.getElementById("all");
        const creditFilterAttributeValue = creditFilterId.getAttribute("selected")

        if (attributrValue == "true") {
            document.getElementById("91-120-days").classList.remove("invoices-filter-span-change");
            document.getElementById("91-120-days").setAttribute("selected", "false");
            const index = invoiceSearchParams.overDueParams.indexOf('ONETWENTY');
            if (index !== -1) {
                invoiceSearchParams.overDueParams.splice(index, 1);
            }
            setInvoiceSearchParams({...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams]})
        } else {
            document.getElementById("91-120-days").classList.add("invoices-filter-span-change");
            document.getElementById("91-120-days").setAttribute("selected", "true");
            setInvoiceSearchParams({...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams,'ONETWENTY']})
        }
        
        
    }

    const handle121to180BackgroundChange = () => {
        const getId = document.getElementById("121-180-days");
        const attributrValue = getId.getAttribute("selected");

        const allFilterId = document.getElementById("all");
        const allFilterAttributeValue = allFilterId.getAttribute("selected")

        const cashFilterId = document.getElementById("cash");
        const cashFilterAttributeValue = cashFilterId.getAttribute("selected")

        const creditFilterId = document.getElementById("all");
        const creditFilterAttributeValue = creditFilterId.getAttribute("selected")

        if (attributrValue == "true") {
            document.getElementById("121-180-days").classList.remove("invoices-filter-span-change");
            document.getElementById("121-180-days").setAttribute("selected", "false");
            const index = invoiceSearchParams.overDueParams.indexOf('ONEEIGHTY');
            if (index !== -1) {
                invoiceSearchParams.overDueParams.splice(index, 1);
            }
            setInvoiceSearchParams({...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams]})
        } else {
            document.getElementById("121-180-days").classList.add("invoices-filter-span-change");
            document.getElementById("121-180-days").setAttribute("selected", "true");
            setInvoiceSearchParams({...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams,'ONEEIGHTY']})
        }
       
       
    }

    const handleAbove180BackgroundChange = () => {
        const getId = document.getElementById("above-180-days");
        const attributrValue = getId.getAttribute("selected");

        const allFilterId = document.getElementById("all");
        const allFilterAttributeValue = allFilterId.getAttribute("selected")

        const cashFilterId = document.getElementById("cash");
        const cashFilterAttributeValue = cashFilterId.getAttribute("selected")

        const creditFilterId = document.getElementById("all");
        const creditFilterAttributeValue = creditFilterId.getAttribute("selected")

        if (attributrValue == "true") {
            document.getElementById("above-180-days").classList.remove("invoices-filter-span-change");
            document.getElementById("above-180-days").setAttribute("selected", "false");
            const index = invoiceSearchParams.overDueParams.indexOf('ONEEIGHTYPLUS');
            if (index !== -1) {
                invoiceSearchParams.overDueParams.splice(index, 1);
            }
            setInvoiceSearchParams({...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams]})
        } else {
            document.getElementById("above-180-days").classList.add("invoices-filter-span-change");
            document.getElementById("above-180-days").setAttribute("selected", "true");
            setInvoiceSearchParams({...invoiceSearchParams, overDueParams:[...invoiceSearchParams.overDueParams,'ONEEIGHTYPLUS']})
        }        
    }    
    
    return (
        <>
            {/* FITER ROW */}
            <div>
                <span id="all" className="invoices-filter-span" onClick={handleAllBackgroundChange} selected="false">
                    <strong>All</strong>
                </span>
                <span id="cash" className="invoices-filter-span" onClick={handleCashBackgroundChange} selected="false">
                    <strong>Cash</strong>
                </span>
                <span id="credit" className="invoices-filter-span" onClick={handleCreditBackgroundChange} selected="false">
                    <strong>Credit</strong>
                </span>
                <span id="acknowledgement-pending" className="invoices-filter-span" 
                    onClick={handleAcknowledgementPending} selected="false">
                    <strong>Acknowledgement Pending</strong>
                </span>
                <span id="not-dues" className="invoices-filter-span" onClick={handleNotDuesBackgroundChange} selected="false">
                    <strong>Not Dues</strong>
                </span>
                <span id="1-30-days" className="invoices-filter-span" onClick={handle1to30BackgroundChange} selected="false">
                    <strong>1-30 Days</strong>
                </span>
                <span id="31-60-days" className="invoices-filter-span" onClick={handle31to60BackgroundChange} selected="false">
                    <strong>31-60 Days</strong>
                </span>
                <span id="61-90-days" className="invoices-filter-span" onClick={handle61to90BackgroundChange} selected="false">
                    <strong>61-90 Days</strong>
                </span>
                <span id="91-120-days" className="invoices-filter-span" onClick={handle91to120BackgroundChange} selected="false">
                    <strong>91-120 Days</strong>
                </span>
                <span id="121-180-days" className="invoices-filter-span" onClick={handle121to180BackgroundChange} selected="false">
                    <strong>121-180 Days</strong>
                </span>
                <span id="above-180-days" className="invoices-filter-span" onClick={handleAbove180BackgroundChange} selected="false">
                    <strong>Above 180 Days</strong>
                </span>                
            </div>
        </>
    );
}