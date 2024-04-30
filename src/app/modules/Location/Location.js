import React from "react";
import { LocationPage } from "./LocationPage"
import { LocationUIProvider } from "./LocationUIContext";
export default function Location({ history }) {
  const locationUIEvents = {
    newLocationButtonClick: () => {
      history.push("/location/new");
    },
    openEditLocationPage: (id) => {
      //history.push(`/inventory/depot/${id}/edit`);
    },
    openDeleteDepotDialog: (id) => {
      //history.push(`/inventory/depot/${id}/delete`);
    },
  };
  return (
    <LocationUIProvider locationUIEvents={locationUIEvents}>
      <LocationPage locationUIEvents={locationUIEvents} />
    </LocationUIProvider>
  );
}