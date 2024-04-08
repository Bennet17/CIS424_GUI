//Written by Brianna Kline
//This is a parent component for the POS manangement screen, as a parent to POSTABLE
import "../styles/PageStyles.css";
import React, { useState, useLayoutEffect, useEffect } from "react";
import SideBar from "./SideBar";
import HorizotalNav from "./HorizontalNav";
import AddPOS from "./AddPOS.jsx";
import POSTable from "./POSTable.jsx";
import { useAuth } from "../AuthProvider.js";
import { useNavigate } from "react-router-dom";
import routes from "../routes.js";
import axios from "axios";

const POSManagementPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing
  const curStoreName = auth.cookie.user.viewingStoreLocation; //stores the current Store we are viewing

  //check the permissions of the logged in user on page load, passing in
  //the required permissions
  useLayoutEffect(() => {
    if (!auth.CheckAuthorization(["Team Leader", "Store Manager", "Owner"])) {
      navigate(routes.home);
    }
  });

  return (
    <div className="flex min-h-screen bg-custom-accent">
      <SideBar currentPage={9} />
      <div className="flex flex-col w-full">
        <HorizotalNav />
        <h2 className="text-xl font-bold text-navy-gray mt-8 px-6 ml-8">
          POS Registers at Plato's Closet: {curStoreName}
        </h2>
        <div className="flex flex-col items-center justify-center px-6">
          {" "}
          {/* Added items-center justify-center */}
          <div className="w-full max-w-screen-lg">
            {" "}
            {/* Limiting width to maintain responsiveness */}
            <div className="flex px-6 justify-center">
              {" "}
              {/* Centering horizontally */}
              <div style={{ width: "90%" }}>
                <POSTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSManagementPage;
