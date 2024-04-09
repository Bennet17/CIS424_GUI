//This is the parent component for the Store Management Page; its children are storeTable component
//Written by Brianna Kline
import "../styles/PageStyles.css";
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import HorizotalNav from "./HorizontalNav";
import StoreTable from "./StoreTable.jsx";

const StoreManagementPage = () => {

  return (

<div className="flex min-h-screen min-w-fit bg-custom-accent">
  <SideBar currentPage={20} />
  <div className="flex flex-col w-full">
    <HorizotalNav />
    <h2 className="text-xl font-bold text-navy-gray mt-8 px-6 ml-8">
         Store Management</h2>
        <div className="flex flex-col items-center justify-center px-6">
          {" "}
          {/* Added items-center justify-center */}
          <div className="w-full max-w-screen-lg">
            {" "}
            {/* Limiting width to maintain responsiveness */}
            <div className="flex justify-center mt-4">
              {" "}
              {/* Centering horizontally */}
              <div style={{ width: "100%" }}>
                <StoreTable />
              </div>
            </div>
          </div>
        </div>
  </div>
</div>

  );
};

export default StoreManagementPage;