import React, {useState, useEffect} from 'react';
import Chart from "react-apexcharts";
import {useHistory, useLocation} from "react-router-dom";
import {useIntl} from 'react-intl';
import CollectionBreadCrum from "../../common/CollectionBreadCrum";
import CollectionTodaySale from "../../common/CollectionTodaySales";
import {Card, CardBody} from "../../../../../../_metronic/_partials/controls";
import OrdInvoice from "./table/OrdInvoice"
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";
import axios from "axios";
import {shallowEqual, useSelector} from "react-redux";
import Moment from "moment";
import {showError} from '../../../../../pages/Alert';


export function Calculator() {
  const history = useHistory();
  const routeLocation = useLocation();
  const intl = useIntl();
  const [selectDate, setSelectDate] = useState("");
  const [showingDate, setShowingDate] = useState(Moment(new Date).format("D MMMM, YYYY (dddd)"));
  const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
  const [companySelect, setCompanySelect] = useState(false);
  const [distributor, setDistributor] = useState({});
  const [invoiceList, setInvoiceList] = useState([]);
  const [totals, setTotals] = useState([0, 0]);

  useEffect(() => {
    document.getElementById('pills-payment-ord-calculator-tab').classList.add('active')
  }, []);

  useEffect(() => {
    // when first time landing, then page will show. after select company then redirect to list page
    if (companySelect) {
      handleBackToOrdCalculatorPage();
    }
    setCompanySelect(true);

    const distributorId = routeLocation.state.state.id;
    getDistributorInfo({companyId: selectedCompany, distributorId: distributorId});
    const today = new Date();
    let ordCalculationDate = Moment(today).format("YYYY-MM-DD");
    getInvoiceList({companyId: selectedCompany, distributorId: distributorId, ordCalculationDate: ordCalculationDate});
  }, [selectedCompany]);

  const onChange = (value) => {
    let date = new Date(value);
    let ordCalculationDate = Moment(date).format("YYYY-MM-DD");
    setShowingDate(Moment(date).format("D MMMM, YYYY (dddd)"));
    getInvoiceList({
      companyId: selectedCompany,
      distributorId: routeLocation.state.state.id,
      ordCalculationDate: ordCalculationDate
    })
    setSelectDate(value);
  };

  const handleBackToOrdCalculatorPage = () => {
    history.push("/salescollection/payment-collection/ord-calculator")
  }

  const getDistributorInfo = (obj) => {
    let queryString = '?';
    queryString += '&companyId=' + obj.companyId;
    queryString += '&distributorId=' + obj.distributorId;
    const URL = `${process.env.REACT_APP_API_URL}/api/distributor/info` + queryString;
    if (obj.distributorId) {
      
    axios.get(URL, JSON.stringify(obj), {headers: {"Content-Type": "application/json"}}).then(response => {
      setDistributor(response.data.data); // distributor all Info
    }).catch(err => {
      showError("Distributor not found");
    });
  }
  }

  const getInvoiceList = (obj) => {
    let queryString = '?';
    queryString += '&companyId=' + obj.companyId;
    queryString += '&distributorId=' + obj.distributorId;
    queryString += '&ordCalculationDate=' + obj.ordCalculationDate;
    const URL = `${process.env.REACT_APP_API_URL}/api/ord/calculable-invoice-list` + queryString;
    axios.get(URL, JSON.stringify(obj), {headers: {"Content-Type": "application/json"}}).then(response => {
      setInvoiceList(response.data.data.invoiceList);
      setTotals([parseFloat(response.data.data.totalCommission), parseFloat(response.data.data.totalSuggestedPayment)]);
    }).catch(err => {
      showError("Invoices not found");
    });
  }

  const state = {
    series: [0, 0],
    options: {
      labels: ["Save", "Total Suggested Payment"],
      chart: {
        show: true,
        type: "donut",
      },
      colors: ['#6FCF97', '#56CCF2'],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                label: "Total Sales Amount",
                color: '#56CCF2',
                show: true
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: "gradient"
      },
      legend: {
        offsetY: 50,
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial',
        fontWeight: 400,
        labels: {
          colors: ['#6FCF97', '#56CCF2'],
          useSeriesColors: true
        },
        formatter: function (val, opts) {
          let data = opts.w.globals.series[opts.seriesIndex];
          return val + " <br /> " + data;
        },
      },
      title: {
        text: showingDate,
        align: 'right',
        offsetX: -30,
        offsetY: 80,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    }
  };

  return (
    <>
      <div>
        {/* BREAD CRUM ROW */}
        <CollectionBreadCrum />
        {/* TODAY  ROW */}
        <CollectionTodaySale />
      </div>
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
                  <strong style={{ fontSize: "13px" }}>{intl.formatMessage({ id: "PAYMENT.ORD.CALCULATOR.TITLE" })}</strong>
                </span>
              </div>
              {/* CHART ROW */}
              <div>
                <div className="app">
                  <div className="row ord-calculator">
                    <div className="mixed-chart">
                      <Chart
                        options={state.options}
                        series={totals}
                        type="donut"
                        width="500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* CARD ROW */}
              {invoiceList.map((invoice, index) => (
                  <div className='mt-5 order-table' key={index}>
                    <OrdInvoice invoice={invoice}/>
                  </div>
              ))}
            </div>
            {/* CONTENT RIGHT SIDE ROW */}
            <div className='col-xl-4 mt-5 order-table ord-calculator-calendar p-5'>
              {/* TITLE ROW */}
              <div className='mt-5'>
                <strong className="text-success">Pick an Expected Payment Date*</strong>
              </div>
              {/* CALENDAR ROW */}
              <div className="react-calendar mt-5">
                <Calendar onClickDay={onChange} value={selectDate} required  />
              </div>
              {/* INFO ROW */}
              <div className='ord-calculator-info mt-5 p-5'>
                <div className='row mt-5'>
                  <div className='col-xl-8'>
                    <div className="d-flex mr-5">
                      <div>
                        {/*logo will set after distributo entry screen ready. logo come with logo in distributor state*/}
                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" />
                      </div>
                      <div className="ml-3">
                        <span>
                          <span style={{ fontWeight: "500" }}><strong>{distributor?.info?distributor.info.distributorName:''}</strong></span>
                          <p className="dark-gray-color">
                            <i className="bi bi-telephone-fill" style={{ fontSize: "10px" }}></i>&nbsp;
                            {distributor?.info?distributor.info.contactNo:''}
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
                          {distributor?.currentBalance}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className='mt-5'>
                  <span>
                    <span className="dark-gray-color" style={{ fontWeight: "500" }}>{distributor.distributorLocation?distributor.distributorLocation.location_type_name:''}</span>
                    <p><strong>{distributor?.distributorLocation?distributor.distributorLocation.location_name:''}</strong></p>
                  </span>
                </div>
                <div className='row mt-5'>
                  <div className='col-xl-6'>
                    <span>
                      <span className="dark-gray-color"
                        style={{ fontWeight: "500" }}>{distributor?.parentLocation?distributor.parentLocation.locationType.name:''}</span>
                      <p><strong>{distributor?.parentLocation?distributor.parentLocation.name:''}</strong></p>
                    </span>
                  </div>
                  <div className='col-xl-6'>
                    <span>
                      <span className="dark-gray-color"
                        style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "DEPOT.DEPOT" })}</span>
                      {/*{distributor}*/}
                      <p><strong>{distributor?.depotInfo?distributor.depotInfo.depot_name:''}</strong></p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}