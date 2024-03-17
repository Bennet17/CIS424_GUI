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

    // Set the start date to 7 days ago and the end date to today
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [formData, setFormData] = useState({
        user: auth.cookie.user.ID,
        name: auth.cookie.user.name,
        store: auth.cookie.user.viewingStoreID,
        storeName: auth.cookie.user.viewingStoreLocation,
        startDate: "",
        endDate: "",
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
    });

    // Sets the start and end date to the current date and 7 days ago
    useEffect(() => {
        // Grabs the start and end date input fields and sets their values to the current date and 7 days ago
        document.getElementById("startDate").value = sevenDaysAgo.toISOString().split('T')[0];
        document.getElementById("endDate").value = today.toISOString().split('T')[0];

        // Sets the start and end date in the form data to the current date and 7 days ago
        setFormData((prev) => {
            return {
                ...prev,
                startDate: sevenDaysAgo.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
            }
        });
    }, []);

    // POST request to the General Variance API on page load. 
    // Passes store ID and start and end date which returns a list containing the dates, expected amounts, totals, and variances.
    // useEffect(() => {
    //     axios.post(GeneralVarianceURL, {
    //         storeID: formData.store,
    //         startDate: formData.startDate,
    //         endDate: formData.endDate
    //     }).then((response) => {
    //         console.log(response);
    //     }).catch((error) => {
    //         console.log(error);
    //     });
    // }, []);

    // Handles the change of the input fields
    const HandleChange = (event) => {
        const {name, value} = event.target;

        setFormData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });

        console.log(formData);
    }

    // Dummy data for the table
    const data = [
        {
            date: "01/01/2024",
            expectedAmount: "$1000.00",
            total: "$900.00",
            variance: "$100.00"
        },
        {
            date: "01/02/2024",
            expectedAmount: "$1000.00",
            total: "$900.00",
            variance: "$100.00"
        },
        {
            date: "01/03/2024",
            expectedAmount: "$1000.00",
            total: "$900.00",
            variance: "$100.00"
        },
        {
            date: "01/04/2024",
            expectedAmount: "$1000.00",
            total: "$900.00",
            variance: "$100.00"
        },
        {
            date: "01/05/2024",
            expectedAmount: "$1000.00",
            total: "$900.00",
            variance: "$100.00"
        }
    ];

    return (
        <div className="flex h-screen bg-custom-accent">
            <SideBar currentPage={5} />
            <div className="flex flex-col w-full">
                <HorizontalNav />
                <div className="text-main-color float-left ml-8 mt-12">
					<h1 className="text-3xl font-bold">Variance Audit for {formData.storeName}</h1>
					<br />
                    <div>
                        {/* Start date */}
                        <label htmlFor="startDate">Start Date:</label>
                        <input 
                            type="date" 
                            id="startDate" 
                            name="startDate" 
                            className="" 
                            date={formData.startDate}
                            onChange={HandleChange}
                        />
                        {/* End date */}
                        <label htmlFor="endDate">End Date:</label>
                        <input 
                            type="date" 
                            id="endDate" 
                            name="endDate" 
                            className="" 
                            date={formData.endDate}
                            onChange={HandleChange}
                        />
                    </div>
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
                            {data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.date}</td>
                                        <td>{item.expectedAmount}</td>
                                        <td>{item.total}</td>
                                        <td>{item.variance}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default VarianceAuditPage;