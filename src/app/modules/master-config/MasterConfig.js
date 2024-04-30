import React from "react";
import {Redirect, Switch} from "react-router-dom";
import {ContentRoute} from "../../../_metronic/layout";
import BankList from "./bankSetup/BankList";
import BankCreate from "./bankSetup/BankCreate";
import BankBranchList from "./bankBranchSetup/BankBranchList";
import BankAccountList from "./bankAccountSetup/BankAccountList";
import BranchCreate from "./bankBranchSetup/BranchCreate";
import BankAccountCreate from "./bankAccountSetup/BankAccountCreate";
import DepartmentList from "./departmentSetup/DepartmentList";
import DepartmentCreate from "./departmentSetup/DepartmentCreate";
import StoreList from "./store/StoreList";
import StoreCreate from "./store/StoreCreate";
import UomList from "./uomSetup/UomList";
import UomCreate from "./uomSetup/UomCreate";
import PackSizeList from "./packSizeSetup/PackSizeList";
import PackSizeCreate from "./packSizeSetup/PackSizeCreate";
import DesignationList from "./designationSetup/DesignationList";
import DesignationCreate from "./designationSetup/DesignationCreate";
import CurrencyList from "./currencySetup/CurrencyList";
import CurrencyCreate from "./currencySetup/CurrencyCreate";
import VehicleList from "./vehicleSetup/vehicleList";
import VehicleCreate from "./vehicleSetup/vehicleCreate"
import ReportingManagerList from "./reportingManagerSetup/ReportingManagerList";
import ReportingManagerCreate from "./reportingManagerSetup/ReportingManagerCreate";
import LocationManagerList from "./locationManagerSetup/LocationManagerList";
import LocationManagerCreate from "./locationManagerSetup/LocationManagerCreate";
import DepotLocationLevelList from "./depotLocationLevelSetup/DepotLocationLevelList";
import DepotLocationLevelCreate from "./depotLocationLevelSetup/DepotLocationLevelCreate";
import TermsAndConditionList from "./termsAndConditionSetup/TermsAndConditionList";
import TermsAndConditionCreate from "./termsAndConditionSetup/TermsAndConditionCreate";

export default function MasterConfig() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/master-config"
        to="/master-config/bank-setup"
      />
      
      <ContentRoute path="/master-config/bank-setup" component={BankList} />
      <ContentRoute from="/master-config/bank-setup-new" component={BankCreate} />

      <ContentRoute path="/master-config/bank-branch-setup" component={BankBranchList} />
      <ContentRoute from="/master-config/bank-branch-setup-new" component={BranchCreate} />

      <ContentRoute path="/master-config/bank-account-setup" component={BankAccountList} />
      <ContentRoute from="/master-config/bank-account-setup-new" component={BankAccountCreate} />

      <ContentRoute path="/master-config/department-setup" component={DepartmentList} />
      <ContentRoute from="/master-config/department-setup-new" component={DepartmentCreate} />

      <ContentRoute path="/master-config/store-setup" component={StoreList} />
      <ContentRoute from="/master-config/store-setup-new" component={StoreCreate} />

      <ContentRoute path="/master-config/uom-setup" component={UomList} />
      <ContentRoute from="/master-config/uom-setup-new" component={UomCreate} />

      <ContentRoute path="/master-config/pack-size-setup" component={PackSizeList} />
      <ContentRoute from="/master-config/pack-size-setup-new" component={PackSizeCreate} />

      <ContentRoute path="/master-config/designation-setup" component={DesignationList} />
      <ContentRoute from="/master-config/designation-setup-new" component={DesignationCreate} />

      <ContentRoute path="/master-config/currency-setup" component={CurrencyList} />
      <ContentRoute from="/master-config/currency-setup-new" component={CurrencyCreate} />

      <ContentRoute path="/master-config/vehicle-setup" component={VehicleList} />
      <ContentRoute from="/master-config/vehicle-setup-new" component={VehicleCreate} />
      <ContentRoute path="/master-config/reporting-manager-setup" component={ReportingManagerList} />
      <ContentRoute from="/master-config/reporting-manager-setup-new" component={ReportingManagerCreate} />

      <ContentRoute path="/master-config/location-manager-setup" component={LocationManagerList} />
      <ContentRoute from="/master-config/location-manager-setup-new" component={LocationManagerCreate} />
      <ContentRoute path="/master-config/depot-location-level-map-setup" component={DepotLocationLevelList} />
      <ContentRoute from="/master-config/depot-location-level-map-setup-new" component={DepotLocationLevelCreate} />

      <ContentRoute path="/master-config/terms-and-condition-setup" component={TermsAndConditionList} /> 
      <ContentRoute from="/master-config/terms-and-condition-setup-new" component={TermsAndConditionCreate} /> 
    </Switch>
  );
}
