import "../styles/PageStyles.css";
import React, { useState } from "react";
import SideBar from "./SideBar";
import HorizotalNav from "./HorizontalNav";
import AddPOS from "./AddPOS.jsx";
import POSTable from "./POSTable.jsx";

const POSManagementPage = () => {
  return (
    <div className="flex h-screen bg-custom-accent">
      <SideBar currentPage={8} />
      <div className="flex flex-col w-full">
        <HorizotalNav />
        <div class="flex flex-col mt-8 px-6">
          <div>
            {" "}
            <POSTable></POSTable>
          </div>
          <div class="flex flex-row mt-20">
            <AddPOS></AddPOS>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSManagementPage;
