import "../styles/PageStyles.css";
import React, { useState, useLayoutEffect, useEffect } from "react";
import SideBar from "./SideBar";
import HorizotalNav from "./HorizontalNav";
import AddPOS from "./AddPOS.jsx";
import POSTable from "./POSTable.jsx";
import {useAuth} from '../AuthProvider.js';
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import axios from "axios";

const POSManagementPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing
 const curStoreName = auth.cookie.user.viewingStoreLocation; //stores the current Store we are viewing

  //check the permissions of the logged in user on page load, passing in
  //the required permissions
  useLayoutEffect(() => {
    if (!auth.CheckAuthorization(["Manager", "District Manager", "Owner"])){
        navigate(routes.home);
    }
  })

  return (
    <div className="flex min-h-screen bg-custom-accent">
      <SideBar currentPage={8} />
      <div className="flex flex-col w-full">
        <HorizotalNav />
        <div className="flex flex-col mt-8 px-6">
          <div>
            <h2 className="text-lg font-bold mt-4 px-10 ">POS Registers at Plato's Closet: {curStoreName}</h2>
            <div className="flex mt-8 px-6"> 
              <div className="w-1/2 mr-4"> 
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
