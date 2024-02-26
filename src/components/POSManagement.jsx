import "../styles/PageStyles.css";
import React, { useState } from "react";
import SideBar from "./SideBar";
import HorizotalNav from "./HorizontalNav";
import AddPOS from "./AddPOS.jsx";
import POSTable from "./POSTable.jsx";
import { useAuth } from "../AuthProvider.js";




const POSManagementPage = () => {
  const auth = useAuth();
  console.log(auth.cookie.user.storeID);

  return (
    <div className="flex h-screen bg-custom-accent">
      <SideBar currentPage={8} />
      <p>{auth.cookie.user.storeID}</p>
      <div className="flex flex-col w-full">
        <HorizotalNav />
        <div className="flex flex-col mt-8 px-6">
          <div>
            {" "}
            <POSTable></POSTable>
          </div>
          <div className="flex flex-row mt-20">
            <AddPOS></AddPOS>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSManagementPage;