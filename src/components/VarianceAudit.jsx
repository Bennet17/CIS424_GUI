import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState, useEffect, useLayoutEffect} from 'react';
import SideBar from './SideBar';
import HorizontalNav from "./HorizontalNav";
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import {useAuth} from '../AuthProvider.js';

/*
    TODO:
        - Look into last 30 days and next page instead of just a start date and end date input
        - Style the table
*/

const VarianceAuditPage = () =>{
    const auth = useAuth();
    const navigate = useNavigate();

    // Set the start date to 7 days ago and the end date to today
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Array of variances and its information
    const [arrVariances, setArrVariances] = useState([]);

    const [formData, setFormData] = useState({
        user: auth.cookie.user.ID,
        name: auth.cookie.user.name,
        store: auth.cookie.user.viewingStoreID,
        storeName: auth.cookie.user.viewingStoreLocation,
        startDate: sevenDaysAgo,
        endDate: today,
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

    // GET request to the General Variance API
    useEffect(() => {
        // Set the start and end date to the correct format
        document.getElementById("startDate").value = new Date(formData.startDate).toISOString().split('T')[0];
        document.getElementById("endDate").value = new Date(formData.endDate).toISOString().split('T')[0];

        // GET request to the General Variance API
        function GetGeneralVariance() {
            // Get the store ID, start date, and end date from the form data
            const storeID = formData.store;
            const startDate = formData.startDate.toISOString().split('T')[0];
            const endDate = formData.endDate.toISOString().split('T')[0];

            // GET request to the General Variance API
            axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GeneralVariance?storeID=${storeID}&startDate=${startDate}&endDate=${endDate}`)
                .then((response) => {
                    // If the response contains data, set the array of variances to the response data
                    if (response.data && response.data.length > 0)
                        setArrVariances(response.data);
                    else {
                        setArrVariances([]);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        GetGeneralVariance();
    }, [formData]);

    // Event handler for decrementing the date by one day when the left arrow button is clicked
    const handlePreviousDay = (event) => {
        event.preventDefault();

        // Decrement the start and end date by one day
        const newStartDate = decrementDate(formData.startDate);
        const newEndDate = decrementDate(formData.endDate);

        // If the new end date is greater than today, do not update the date
        if (newEndDate < today) {
            setFormData((prev) => ({
                ...prev,
                startDate: newStartDate,
                endDate: newEndDate,
            }));
        }
    };

    // Event handler for incrementing the date by one day when the right arrow button is clicked
    const handleNextDay = (event) => {
        event.preventDefault();

        // Increment the start and end date by one day
        const newStartDate = incrementDate(formData.startDate);
        const newEndDate = incrementDate(formData.endDate);
    
        // If the new end date is greater than today, do not update the date
        if (newEndDate < today) {
            setFormData((prev) => ({
                ...prev,
                startDate: newStartDate,
                endDate: newEndDate,
            }));
        }
    };

    // Function to increment the date by one day
    const incrementDate = (dateString) => {
        // Convert the date string to a Date object
        const date = new Date(dateString);

        // Increment the date by one day
        date.setDate(date.getDate() + 1);

        return date;
    };

    // Function to decrement the date by one day
    const decrementDate = (dateString) => {
        // Convert the date string to a Date object
        const date = new Date(dateString);

        // Decrement the date by one day
        date.setDate(date.getDate() - 1);

        return date;
    };

    // Function to format negative values in parentheses
    function NegativeValueParantheses(transferValue) {
        if (transferValue < 0) 
            return `($${Math.abs(transferValue).toFixed(2)})`;
        else 
            return `$${transferValue.toFixed(2)}`;
    }

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

    return (
        <div className="flex h-screen bg-custom-accent">
            <SideBar currentPage={5} />
            <div className="flex flex-col w-full">
                <HorizontalNav />
                <div className="text-main-color float-left ml-8 mt-12">
					<h1 className="text-3xl font-bold">Variance Audit for {formData.storeName}</h1>
					<br />
                    <div>
                        {/* Left arrow button */}
                        <button onClick={handlePreviousDay}>←</button>
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
                        {/* Right arrow button */}
                        <button onClick={handleNextDay}>→</button>
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
                            {arrVariances.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{new Date(item.Date).toISOString().split('T')[0]}</td>
                                        <td>${parseFloat(item.amountExpected).toFixed(2)}</td>
                                        <td>${parseFloat(item.total).toFixed(2)}</td>
                                        <td>{NegativeValueParantheses(parseFloat(item.Variance))}</td>
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