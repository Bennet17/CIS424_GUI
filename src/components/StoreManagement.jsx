import "../styles/PageStyles.css";
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import HorizotalNav from "./HorizontalNav";
import AddPOS from "./AddPOS.jsx";
import POSTable from "./POSTable.jsx";
import axios from "axios";
import StoreTable from "./StoreTable.jsx";

const StoreManagement = () => {


  return (
    <div className="flex h-screen bg-custom-accent">
      <SideBar currentPage={8} />
      <div className="flex flex-col w-full">
        <HorizotalNav />
        <div className="flex flex-col mt-8 px-6">
          <div>
            <div className="flex mt-8 px-6"> 
              <div className="w-1/2 mr-4"> 
                <StoreTable />
              </div>
              <div className="w-1/2 mt-4"> 
             {/* <AddPOS /> */}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreManagement;