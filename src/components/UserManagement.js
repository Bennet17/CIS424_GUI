import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState} from 'react';
import HomePage from './HomePage';
import HorizotalNav from "./HorizontalNav";
import OpenDayPage from "./OpenDay";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import AddUser from "./AddUser.js";
import EmployeeTable from "./EmployeeTable.js";
import EditUser from "./EditUser.js";
import NavBar from "./Navbar.jsx";

const UserManagementPage = () =>{

    return (
       
            <div>
                <HorizotalNav></HorizotalNav>
                <NavBar></NavBar>
                <div class="flex flex-col mt-32 px-6">
                    <div> <EmployeeTable></EmployeeTable></div>
                    <div class="flex flex-row mt-20"><AddUser></AddUser><EditUser></EditUser></div>

                 </div>
            </div>
        
    );
};

export default UserManagementPage;