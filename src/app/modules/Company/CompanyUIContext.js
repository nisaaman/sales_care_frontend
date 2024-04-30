import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./CompanyUIHelpers";

const CompanyUIContext = createContext();

export function useCompanyUIContext() {
  return useContext(CompanyUIContext);
}

export const CompanyUIConsumer = CompanyUIContext.Consumer;

export function CompanyUIProvider({ accountingYearUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter); 
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    // newCompanyButtonClick: accountingYearUIEvents.newCompanyButtonClick,
    // openEditCompanyPage: accountingYearUIEvents.openEditCompanyPage,
    // openDeleteCompanyDialog: accountingYearUIEvents.openDeleteCompanyDialog,
  };

  return (
    <CompanyUIContext.Provider value={value}>
      {children}
    </CompanyUIContext.Provider>
  );
}
