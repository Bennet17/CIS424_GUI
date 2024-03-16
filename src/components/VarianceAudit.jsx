import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState, useEffect, useLayoutEffect} from 'react';
import CurrencyInput from "react-currency-input-field";
import SideBar from './SideBar';
import HorizontalNav from "./HorizontalNav";
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import {useAuth} from '../AuthProvider.js';

const VarianceAuditPage = () =>{
    const auth = useAuth();
    const navigate = useNavigate();

    // POST request URL for the General Variance API (https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/SVSU_CIS424/GeneralVariance)
    const GeneralVarianceURL = ""

    const [formData, setFormData] = useState({
        user: auth.cookie.user.ID,
        name: auth.cookie.user.name,
        store: auth.cookie.user.viewingStoreID,
        storeName: auth.cookie.user.viewingStoreLocation,
        date: "",
        expectedAmount: "",
        total: "",
        variance: "",
    });

    //check the permissions of the logged in user on page load, passing in
    //the required permissions
    useLayoutEffect(() => {
        if (!auth.CheckAuthorization(["Manager", "District Manager", "CEO"])){
            navigate(routes.home);
        }
    })

    return (
        <div className="flex h-screen bg-custom-accent">
            <SideBar currentPage={5} />
            <div className="flex flex-col w-full">
                <HorizontalNav />
                <div className="text-main-color float-left ml-8 mt-12">
					<h1 className="text-3xl font-bold">Variance Audit for {formData.storeName}</h1>
					<br />
                    <table className="table-variance">
                        <thead className="">
                            <tr>
                                <th>Date</th>
                                <th>Expected Amount</th>
                                <th>Total</th>
                                <th>Variance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>blank</td>
                                <td>blank</td>
                                <td>blank</td>
                                <td>blank</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default VarianceAuditPage;