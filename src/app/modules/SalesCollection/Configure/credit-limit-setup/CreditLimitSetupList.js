import React from "react"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from "react-bootstrap-table2-paginator"
import {toAbsoluteUrl} from "../../../../../_metronic/_helpers"
import SVG from "react-inlinesvg";

export default function CreditLimitSetupList({setSingleAllExport, singleAllExport, allDistributorList}) {
    const singleWiseSelectHandler = (data, isSelect) => {
        if (isSelect == true) {
            let temp = [...singleAllExport]
            temp.push(data)
            setSingleAllExport(temp)
        } else {
            if (singleAllExport.length >= 0) {
                let temp = [...singleAllExport]
                const index = temp.findIndex(obj => obj.id == data.id);
                temp.splice(index, 1);
                setSingleAllExport(temp)
            }
        }

    }

    const allSelectHandler = (allData, isSelect) => {
        if (isSelect == true) {
            setSingleAllExport(allData)
        } else {
            if (allData.length >= 0) {
                for (let i = 0; i < allData.length; i++) {
                    const index = singleAllExport.findIndex(obj => obj.id == allData[i].id);
                    singleAllExport.splice(index, 1);
                    setSingleAllExport(singleAllExport)
                }
            }
        }

    }

    const columns = [
        {
            dataField: "name",
            text: "DISTRIBUTOR INFO",
            formatter: (cellContent, row) => (
                <>
                    <div className="d-flex" style={{marginBottom: "-10px"}}>
                        <div>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} width="50px"
                                 height="50px"/>
                        </div>
                        <div className="ml-3">
              <span>
                <span style={{fontWeight: "500"}}><strong>{row.distributor_name}</strong></span>
                <p className="dark-gray-color"> 
                  <span className="text-muted">
                  <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="10px"
                       height="10px"/>
                      {row.contact_no}
                  </span>
                </p>
              </span>
                        </div>
                    </div>
                </>
            )
        },
        {
            dataField: "credit_limit_term",
            text: "Term"
        },
        {
            dataField: "start_date",
            text: "Start Date"
        },
        {
            dataField: "end_date",
            text: "End Date"
        },
        {
            dataField: "credit_limit",
            text: "CREDIT LIMIT"
        }
    ];

    return (
        <>
            <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                bordered={false}
                keyField="id"
                data={allDistributorList}
                columns={columns}
                selectRow={
                    {
                        mode: 'checkbox',
                        onSelect: (row, isSelect, rowIndex, e) => {
                            singleWiseSelectHandler(row, isSelect);
                        },
                        onSelectAll: (isSelect, rows, e) => {
                            allSelectHandler(rows, isSelect);
                        }
                    }
                }
                pagination={paginationFactory({sizePerPage: 10, showTotal: true})}
            />
        </>
    )
}