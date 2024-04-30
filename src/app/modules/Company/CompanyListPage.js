import React, { useState, useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { CompanyUIProvider } from "./CompanyUIContext";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { withStyles } from '@material-ui/core/styles';
import { useSubheader } from "../../../_metronic/layout";
import axios from "axios";
import { showError, showSuccess } from '../../pages/Alert';
import IOSSwitch from '../../pages/IOSSwitch';


export default function CompanyListPage({ history }) {
  const [profileImg, setProfileImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));
  const [companys, setCompanys] = useState([]);
  const [imageText, setImageText] = useState('');

  // Subheader
  const suhbeader = useSubheader();
  useEffect(() => {
    let _title = `Company | List of Company`;
    suhbeader.setTitle(_title);
    getAllCompany();
  }, []);

  const companyUIEvents = {
    newCompanyButtonClick: () => {
      history.push("/company/new");
    },
    openEditCompanyPage: (id) => {
      history.push(`/master-configure/accounting-year/${id}/edit`);
    },
    openDeleteCompanyDialog: (id) => {
      history.push(`/master-configure/accounting-year/${id}/delete`);
    },
  };

  const handleChange = (event) => {
    const URL = `${process.env.REACT_APP_API_URL}/api/organization/update-active-status/` + event.target.value;
    let id = parseInt(event.target.value);
    let checked = event.target.checked;
    let index = companys.findIndex(company => (company.id === id));
    let previousCompanys = [...companys];
    axios.get(URL).then(response => {
      if (response.data.success) {
        showSuccess("Status changed Successfully.");
        previousCompanys[index].is_active = checked;
        setCompanys(previousCompanys);
      } else {
        showError("Cannot change status.");
        previousCompanys[index].is_active = !checked;
        setCompanys(previousCompanys);
      }
    }).catch(err => {
      showError("Cannot change status.");
      previousCompanys[index].is_active = !checked;
      setCompanys(previousCompanys);
    });
  }

  const getAllCompany = () => {
    const URL = `${process.env.REACT_APP_API_URL}/api/organization/get-all-company-with-logo`;
    axios.get(URL).then(response => {
      setCompanys(response.data.data);
    });
  }

  const editCompany = (row) => {
    history.push({ 'pathname': '/company/new', state: { row } })
  }

  return (
    <CompanyUIProvider
    //companyUIEvents={companyUIEvents}
    >
      <>
      <div style={{ marginTop: "-30px",marginLeft:"-18px" }}>
                <nav aria-label="breadcrumb">
                    <ol className="breadCrum-bg-color">
                        <li aria-current="page" className='breadCrum-main-title'>Company</li>
                        <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp;List of Company&nbsp;&nbsp;&nbsp;&nbsp;</li>
                    </ol>
                </nav>
            </div>
        <div>
          <div className="row">
            <div className="col-lg-2">
              <form className="form form-label-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={companyUIEvents.newCompanyButtonClick}
                >
                  <i className="bi bi-plus-md"></i>
                  +  New Company
                </button>
              </form>
            </div>
            <div className="col-lg-10 d-flex justify-content-end" style={{ marginTop: "10px" }}>
              <div >
                <button
                  style={{ borderRadius: "30px 0px 0px 30px", paddingRight: "30px",marginRight: "-20px" }}
                  type="button"
                  className="btn btn-primary"
                  disabled
                >
                  Limit 100000 - 500000 Company
                </button>
              </div>
              <div>
                <button
                  style={{ borderRadius: "25px" , position: "relative" }}
                  type="button"
                  className="btn btn-primary"
                //onClick={depotAdd}
                >
                  Upgrade your package to create more company
                </button>
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-xl-3 g-4">
            {/* COMPANY CARD START*/}
            {companys.map((company, index) => (
              <div className="col mt-5" key={index}>
                <div className="card h-100 full-card-redius">
                  <div className="card-header card-header-redius">
                    <div className="row">
                      <div className="col-lg-4 col-4  d-flex">
                        <div>
                          <span
                            className="chip light-gray-bg dark-gray-color"
                            style={{ fontWeight: "700", padding: "5px 10px 5px 10px" }}
                          >{company.parent_id === null ? "Parent" : "Child"}</span>
                        </div>
                      </div>
                      <div className="col-lg-8 col-8 d-flex justify-content-end" style={{ marginTop: "10px" }}>
                        <div className="card-div-icon dark-gray-color edit-icon" data-toggle="tooltip" data-placement="bottom" title="View Details">
                          <i className="bi bi-eye" data-toggle="tooltip" data-placement="bottom" title="View Details"></i>
                        </div>
                        <div className="card-div-icon dark-gray-color edit-icon"
                          style={{ marginLeft: "10px" }} data-toggle="tooltip"
                          onClick={() => editCompany(company)}
                          data-placement="bottom" title="Edit Company">
                          <i className="bi bi-pen" data-toggle="tooltip" data-placement="bottom" title="Edit Company"></i>
                        </div>
                        <div style={{ marginLeft: "10px", marginTop: "-8px" }}>
                          <FormControlLabel disabled={company.parent_id === null}
                            control={
                              <IOSSwitch
                                id={'company_status_' + company.id}
                                checked={company.is_active}
                                value={company.id}
                                onChange={(event) => handleChange(event)}
                              />
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div hidden={true} key={company.id}></div>
                    <div style={{ textAlign: "center" }}>
                      <img id="img" className="image-input image-input-circle"
                        //src={company.file_path === null ? profileImg : process.env.REACT_APP_API_URL + '/api/organization/view?filePath=' + company.file_path}
                         src={`data:image/jpeg;base64,${company.imageString}`}
                        style={{ width: "90px", height: "90px", marginBottom: "10px" }} alt='Company' />
                      <div>
                        <p className="card-header-title"><b>{company.name}</b></p>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="card-div-icon dark-gray-color">
                        <i className="bi bi-geo-alt"></i>
                      </div>
                      <div className="ml-2 mt-1"><p className="dark-gray-color" style={{ fontWeight: "500" }}>{company.address}</p></div>
                    </div>
                    <div className="d-flex">
                      <div className="card-div-icon dark-gray-color">
                        <i className="bi bi-telephone-plus"></i>
                      </div>
                      <div className="ml-2 mt-1"><p className="dark-gray-color" style={{ fontWeight: "500" }}>{company.contact_number}</p></div>
                    </div>
                    <div className="d-flex">
                      <div className="card-div-icon dark-gray-color">
                        <i className="bi bi-globe"></i>
                      </div>
                      <div className="ml-2 mt-1"><p className="dark-gray-color" style={{ fontWeight: "500" }}>{company.web_address}</p></div>
                    </div>
                    <div className="d-flex">
                      <div className="card-div-icon dark-gray-color">
                        <i className="bi bi-envelope"></i>
                      </div>
                      <div className="ml-2 mt-1"><p className="dark-gray-color" style={{ fontWeight: "500" }}>{company.email}</p></div>
                    </div>
                    <div className="mt-3" hidden={company.parent_id === null}>
                      <p className="font-14" style={{ color: "#BDBDBD" }}><b>Business Location Tree</b></p>
                    </div>
                    <div hidden={company.parent_id === null}>
                      <span className="chip light-success-bg  dark-success-color" style={{ padding: "10px 20px" }}>{company.location_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* COMPANY CARD END*/}
          </div>
        </div>
      </>
    </CompanyUIProvider>
  );
}