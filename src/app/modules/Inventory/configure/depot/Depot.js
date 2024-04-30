import React from "react";
import { DepotPage } from "./DepotPage"
export default function Depot({ history }) {
  const depotUIEvents = {
    newDepotButtonClick: () => {
      history.push("/inventory/configure/depot-configure/new");
    },
    openEditDepotPage: (id) => {
      //history.push(`/inventory/depot/${id}/edit`);
    },
    openDeleteDepotDialog: (id) => {
      //history.push(`/inventory/depot/${id}/delete`);
    },
  };
  return (
  <DepotPage depotAdd={depotUIEvents.newDepotButtonClick} />
  );
}