import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./LocationUIHelpers";

const LocationUIContext = createContext();

export function useLocationUIContext() {
  return useContext(LocationUIContext);
}

export const LocationUIConsumer = LocationUIContext.Consumer;

export function LocationUIProvider({ locationUIEvents, children }) {
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
    newDepotButtonClick: locationUIEvents.newDepotButtonClick,
    // openEditDepotPage: locationUIEvents.openEditDepotPage,
    // openDeleteDepotDialog: locationUIEvents.openDeleteDepotDialog,
  };

  return (
    <LocationUIContext.Provider value={value}>
      {children}
    </LocationUIContext.Provider>
  );
}
