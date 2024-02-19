import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState } from "react";
import SideBar from "./SideBar";
import HorizotalNav from "./HorizontalNav";
import OpenDayPage from "./OpenDay";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import routes from "../routes.js";
import AddUser from "./AddUser.js";
import EmployeeTable from "./EmployeeTable.js";
import EditUser from "./EditUser.js";
import AddPOS from "./AddPOS.jsx";
import EditPOS from "./EditPos.jsx";
import POSTable from "./POSTable.jsx";

const POSManagementPage = () => {
  return (
    <div className="flex h-screen bg-custom-accent">
      <SideBar currentPage={6} />
      <div className="flex flex-col w-full">
        <HorizotalNav />
        <div class="flex flex-col mt-32 px-6">
          <div>
            {" "}
            <POSTable></POSTable>
          </div>
          <div class="flex flex-row mt-20">
            <AddPOS></AddPOS>
            <EditPOS></EditPOS>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSManagementPage;
