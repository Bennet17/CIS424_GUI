import "../styles/PageStyles.css";
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import HorizotalNav from "./HorizontalNav";
import AddPOS from "./AddPOS.jsx";
import POSTable from "./POSTable.jsx";
import axios from "axios";
import StoreTable from "./StoreTable.jsx";

const StoreManagementPage = () => {


  return (
<div className="flex h-screen bg-custom-accent">
  <SideBar currentPage={8} />
  <div className="flex flex-col w-full">
    <HorizotalNav />
    <div className="flex flex-col items-center justify-center mt-8 px-6"> {/* Added items-center justify-center */}
      <div className="w-full max-w-screen-lg"> {/* Limiting width to maintain responsiveness */}
        <div className="flex mt-4 px-6 justify-center"> {/* Centering horizontally */}
          <StoreTable />
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default StoreManagementPage;