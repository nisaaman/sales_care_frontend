import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as uiHelpers from "../AccountingYearUIHelpers";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../_metronic/_helpers";
import { Pagination } from "../../../../../_metronic/_partials/controls";
import { useAccountingYearUIContext } from "../AccountingYearUIContext";
import {ActionsColumnFormatter} from "./ActionsColumnFormatter";
import { Formik } from "formik";
import { isEqual } from "lodash";

const prepareFilter = (queryParams, values) => {
  const { searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};
  // Filter by all fields
   filter.manufacture = searchText;
   filter.VINCode = searchText;
  newQueryParams.filter = filter;
  return newQueryParams;
};


export function AccountingYearTable() {
  // Products UI Context
  const accountingYearUIContext = useAccountingYearUIContext();
  const accountingYearUIProps = useMemo(() => {
    return {
      queryParams: accountingYearUIContext.queryParams,
      setQueryParams: accountingYearUIContext.setQueryParams,
      openEditAccountingYearPage: accountingYearUIContext.openEditAccountingYearPage,
      openDeleteAccountingYearDialog: accountingYearUIContext.openDeleteAccountingYearDialog,
    };
  }, [accountingYearUIContext]);
  
  // Getting curret state of products list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.products }),
    shallowEqual
  );
  const { totalCount, entities, listLoading } = currentState;
  // Products Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // // clear selections list
    // accountingYearUIProps.setIds([]);
    // // server call by queryParams
    // dispatch(actions.fetchProducts(accountingYearUIProps.queryParams));
    // // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountingYearUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "#",
      text: "SL NO",
    },
    {
      dataField: "#",
      text: "Fiscal Year Name",
    },
    {
      dataField: "#",
      text: "Start Date",
    },
    {
      dataField: "#",
      text: "End Date",
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditAccountingYearPage: accountingYearUIProps.openEditAccountingYearPage,
        openDeleteAccountingYearDialog: accountingYearUIProps.openDeleteAccountingYearDialog,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: accountingYearUIProps.queryParams.pageSize,
    page: accountingYearUIProps.queryParams.pageNumber,
  };
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(accountingYearUIProps.queryParams, values);
    if (!isEqual(newQueryParams, accountingYearUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      accountingYearUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <>
    <Formik
        initialValues={{
          searchText: "",
        }}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="form-group row">
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  name="searchText"
                  placeholder="Search"
                  onBlur={handleBlur}
                  value={values.searchText}
                  onChange={(e) => {
                    setFieldValue("searchText", e.target.value);
                    handleSubmit();
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> in all fields
                </small>
              </div>
            </div>
          </form>
        )}
      </Formik>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                bordered={false}
                remote
                keyField="id"
                data=""
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  accountingYearUIProps.setQueryParams
                )}
                 {...paginationTableProps}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
