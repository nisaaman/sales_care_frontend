import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {Card, CardBody} from "../../../../../../_metronic/_partials/controls";
import {useIntl} from "react-intl";
import axios from "axios";

export default function TradePriceSetupHeader(props) {
    const intl = useIntl();
    const history = useHistory();
    const [companies, setCompanies] = useState([]);
    const [searchInputs, setSearchInputs] = useState({});
    const [totals, setTotals] = useState({products: 0});

    useEffect(() => {
        getAllCompaniesByOrganization();
    }, []);

    useEffect(() => {
        if (searchInputs.companyId === '' || searchInputs.companyId === undefined) {
            setTotals({products: 0});
        } else {
            getTradePriceSumWithProductCountByCompany(searchInputs.companyId);
        }
        props.onChangeSearchInputs(searchInputs);
    }, [searchInputs]);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({...values, [name]: value}));
    }

    const handleTradePriceSetupChange = () => {
        history.push("/salescollection/configure/trade-price-setup/list")
    }

    const getAllCompaniesByOrganization = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/companies-by-login-user-organization`;
        axios.get(URL).then(response => {
            setCompanies(response.data.data);
        });
    }

    const getTradePriceSumWithProductCountByCompany = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-trade-price/sum/` + companyId;
        if (companyId) {
        axios.get(URL).then(response => {
            let infos = response.data.data;
            setTotals({products: infos.product_count})
        });}
    }

    return (<>
        {/* TODAY SALE ROW */}
        <div className="mt-3">
            <Card>
                <CardBody style={{marginBottom: "-36px"}}>
                    <div>
                        <span className="create-field-title">Trade Price Setup</span>
                        <span className="d-flex float-right">
                            <div className="mr-3 mt-3" style={{color: "rgb(130, 130, 130)"}}>
                                    <label>{intl.formatMessage({id: "COMMON.COMPANY"})}</label>
                                </div>
                                <div className="create-field-title mr-5">
                                    <select className="form-control company-select" name="companyId"
                                            value={searchInputs.companyId || ""}
                                            onChange={handleChange}>
                                         <option className="fs-1" value="">Select Company</option>
                                        {companies.map((c) => (
                                            <option key={c.id} value={c.id} className="fs-1">{c.name}</option>))}
                                    </select>
                                </div>
                            </span>
                    </div>
                    <div className="mt-5 ml-2 row">
                            <span className="sales-chip mt-5 mr-5"><i
                                className="bi bi-arrow-up-short text-primary"></i>&nbsp;{totals.products}&nbsp;<span
                                className='text-muted'>Products</span></span>
                    </div>
                    <div className="mt-5">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a className="nav-link" id="pills-configure-trade-price-setup-tab"
                                   data-toggle="pill"
                                   href="#pills-configure-trade-price-setup" role="tab"
                                   aria-controls="pills-configure-trade-price-setup" aria-selected="false"
                                   onClick={handleTradePriceSetupChange}>Trade Price Setup</a>
                            </li>
                        </ul>
                    </div>
                </CardBody>
            </Card>
        </div>
    </>);
}