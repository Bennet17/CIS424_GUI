import React, { useState, useEffect } from "react";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import routes from "./routes.js";
import AuthProvider from "./AuthProvider.js";
// page components

// Page imports
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import SelectStorePage from "./components/SelectStore";
import OpenDayPage from "./components/OpenDay";
import CloseDayPage from './components/CloseDay';
import FundsTransferPage from "./components/FundsTransferPage";
import UserManagementPage from "./components/UserManagement.js";
import SafeAudit from "./components/SafeAudit";
import POSManagementPage from "./components/POSManagement.jsx";
import VarianceAudit from "./components/VarianceAudit.jsx";
import NotFound from "./components/NotFound";
import PrivateRoute from "./PrivateRoute.js";
import DepositHistory from "./components/DepositHistory.jsx";

function App() {
  return (
    <HashRouter className="App">
      <AuthProvider>
        <Routes>
          {/* this is how we structure our routes. Each new route is a new page that renders a new element.
          Currently, all routes will have the url of "localhost:3000/<path>". Routes can also be nested,
          allowing for routes in inherit from another route, which will affect the url accordingly:
          "localhost:3000/<path>/<nested path>". Structure as appropriately as we make new pages.
          Lastly, note the index property for the login page instead of a path. This means that the path
          for this page will be on the root "localhost:3000" url */}
          <Route index element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path={routes.home} element={<HomePage />} />
            <Route path={routes.selectstore} element={<SelectStorePage />} />
            <Route path={routes.openday} element={<OpenDayPage />} />
            <Route path={routes.closeday} element={<OpenDayPage />} />
            <Route path={routes.security}>
              <Route
                path={routes.usermanagement}
                element={<UserManagementPage />}
              />
              <Route
                path={routes.posmanagement}
                element={<POSManagementPage />}
              />
            <Route path={routes.closeday} element={<CloseDayPage />} />
            <Route path={routes.security} >
              <Route path={routes.usermanagement} element={<UserManagementPage/>} />
              <Route path={routes.posmanagement} element={<POSManagementPage/>} />
            </Route>
            <Route
              path={routes.fundstransfer}
              element={<FundsTransferPage />}
            />
            <Route path={routes.cashmanager}>
              <Route path={routes.safeaudit} element={<SafeAudit />} />
              <Route path={routes.varianceaudit} element={<VarianceAudit />} />
              <Route
                path={routes.deposithistory}
                element={<DepositHistory />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* Notice how the path is *. This means it will show this element if any other url is entered
          that is not explicitly defined */}
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
