import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useSubheader } from "../../../_metronic/layout";
import UserCompanyMap from "./userCompanyMap/UserCompanyMap";
import { ProfileOverview } from "./UserProfile/table/ProfileOverview";
import UserCreate from "./UserProfile/UserCreate";
import RoleCreate from "./roleSetup/RoleCreate";
import RoleList from "./roleSetup/RoleList";
import UserRoleMap from "./userRoleMap/UserRoleMap";
import PermissionSetup from "./permissionSetup/PermissionSetup";
export default function UserManagementRoute() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("User profile");

  return (
    <div className="d-flex flex-row">
      {/* <ProfileCard></ProfileCard> */}
      <div className="flex-row-fluid ml-lg-8">
        <Switch>
          <Redirect
            from="/user-management"
            exact={true}
            to="/user-management/profile-setup"
          />
          <Route
            path="/user-management/profile-setup"
            component={ProfileOverview}
          />
          <Route
            path="/user-management/profile-setup-new"
            component={UserCreate}
          />

          <Route
            path="/user-management/role-setup"
            component={RoleList}
          />
          
          <Route
            path="/user-management/role-setup-new"
            component={RoleCreate}
          />

          {/* <Route
            path="/user-management/user-role-list"
            component={userRoleMappingList}
          /> */}

         <Route
            path="/user-management/user-role-setup-new"
            component={UserRoleMap}
          />

          <Route
            path="/user-management/user-company-map"
            component={UserCompanyMap}/>
            
            <Route
            path="/user-management/feature-permission-setup"
            component={PermissionSetup}/>
        </Switch>
      </div>
    </div>
  );
}
