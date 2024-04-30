import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./ProductConfigureUIHelpers";

const ProductUIContext = createContext();

export function useProductUIContext() {
  return useContext(ProductUIContext);
}

export const CompanyUIConsumer = ProductUIContext.Consumer;

export function ProductUIProvider({ productProfileUIEvents, children }) {
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
    newCategoryAddButtonClick: productProfileUIEvents.newCategoryAddButtonClick,
    // openEditCompanyPage: productProfileUIEvents.openEditCompanyPage,
    // openDeleteCompanyDialog: productProfileUIEvents.openDeleteCompanyDialog,
    // newLevelTreeButtonClick: productProfileUIEvents.newLevelTreeButtonClick,
  };

  return (
    <ProductUIContext.Provider value={value}>
      {children}
    </ProductUIContext.Provider>
  );
}
