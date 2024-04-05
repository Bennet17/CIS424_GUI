import "../styles/PageStyles.css";
import axios from "axios";
import React, {useRef, useState, useEffect, useLayoutEffect, useCallback} from 'react';
import CurrencyInput from "react-currency-input-field";
import SideBar from './SideBar';
import HorizontalNav from "./HorizontalNav";
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import {useAuth} from '../AuthProvider.js';
import { Toaster, toast } from 'sonner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { format, set } from 'date-fns';
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import 'primeicons/primeicons.css';
import { classNames } from "primereact/utils";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const VarianceTable = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    //check the permissions of the logged in user on page load, passing in
    //the required permissions
    useLayoutEffect(() => {
        if (!auth.CheckAuthorization(["Manager", "District Manager", "Owner"])){
            navigate(routes.home);
        }
    });

    return (
        <div className="flex min-h-screen bg-custom-accent variance-table-page">
        <Toaster 
            richColors 
            position="top-center"
            expand={true}
            duration={5000}
            pauseWhenPageIsHidden={true}
        />
            <SideBar currentPage={6} />
            <div className="flex flex-col w-full">
                <HorizontalNav />
                <div className="text-main-color float-left ml-8 mt-6">
					<h1 className="text-3xl font-bold">Variance Table for</h1>
					<br />
                </div>
            </div>
        </div>
    )
}

export default VarianceTable;