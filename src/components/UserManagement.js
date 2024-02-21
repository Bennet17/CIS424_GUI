import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState} from 'react';
import NavBar from './Navbar';
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
import AddUserForm from "./AddUserForm.jsx"

const UserManagementPage = () =>{

    return (
       
            <div>
                <NavBar></NavBar>
                <HorizotalNav />
                <div class="flex flex-col mt-4 px-6">
                    <div> <EmployeeTable></EmployeeTable></div>
                    <div class="flex flex-row mt-2"><AddUserForm></AddUserForm></div>

                 </div>
            </div>
        
    );
};

export default UserManagementPage;