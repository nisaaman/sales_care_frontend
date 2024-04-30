import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../../_metronic/layout";
import DamageDeclaration from "./list/DamageDeclaration";
export default function DamageDeclarationRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory/stock/stock-damage"
        to="/inventory/stock/stock-damage/stock-damage-declaration"
      />

      <ContentRoute
        path="/inventory/stock/stock-damage/stock-damage-declaration"
        component={DamageDeclaration}
      />  
    </Switch>
  );
}
