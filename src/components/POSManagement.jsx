import "../styles/PageStyles.css";
import React, { useState } from "react";
import SideBar from "./SideBar";
import HorizotalNav from "./HorizontalNav";
import AddPOS from "./AddPOS.jsx";
import POSTable from "./POSTable.jsx";
import {useAuth} from '../AuthProvider.js';

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
        <h2 className="text-lg font-bold mt-4 px-10 ">POS Registers at: -insert current store</h2>

        <div className="flex mt-8 px-6">
          
          <div className="w-1/2 mr-4"> {/* Use w-1/2 to take half of the width */}
            <POSTable />
          </div>
          <div className="w-1/2 ml-4"> {/* Use w-1/2 to take half of the width */}
            <AddPOS />
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default POSManagementPage;