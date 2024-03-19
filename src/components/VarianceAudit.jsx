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
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    
    const [arrRegisters, setArrRegisters] = useState([]); // Array of a store's registers and its information
    const [arrVariances, setArrVariances] = useState([]); // Array of variances and its information

    const [registerName, setRegisterName] = useState(""); // Register name

    // Status message to display if no registers are open
    const [status, setStatus] = useState("");

    const [formData, setFormData] = useState({
        user: auth.cookie.user.ID,
        name: auth.cookie.user.name,
        store: auth.cookie.user.viewingStoreID,
        storeName: auth.cookie.user.viewingStoreLocation,
        registerID: -1,
        startDate: monthAgo,
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

        function GetRegisters() {
            axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewRegistersByStoreID?storeID=${formData.store}`)
            .then(response => {
                // Extract register names and ID from the response and filter based on opened status
                const newRegisters = response.data
                .map(register => ({ id: register.ID, name: register.name }));

                // Commented out for testing until registers are open
                // .filter(register => register.opened)

                if (newRegisters.length === 0)
                    // Set status message if no registers are open
                    setStatus("No registers are currently open.");
                else
                    // Update arrSources using functional form of setState to avoid duplicates
                    setArrRegisters(newRegisters);
            })
            .catch(error => {
                console.error(error);
            });
        }

        // GET request to the General Variance API
        function GetGeneralVariance() {
            // Get the store ID, start date, and end date from the form data
            const storeID = formData.store;
            const startDate = new Date(formData.startDate).toISOString().split('T')[0];
            const endDate = new Date(formData.endDate).toISOString().split('T')[0];

            // GET request to the General Variance API
            axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GeneralVariance?storeID=${storeID}&startDate=${startDate}&endDate=${endDate}`)
                .then((response) => {
                    // If the response contains data, set the array of variances to the response data
                    if (response.data && response.data.length > 0) {
                        setArrVariances(response.data);
                        setRegisterName("General Variance");
                    }
                    else {
                        setArrVariances([]);
                        setStatus("No general variances found for the selected store.");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setArrVariances([]);
                    setStatus("No generalvariances found for the selected store.");
                });
        }
        
        // GET request to the Register Variance API
        function GetRegisterVariance() {
            // Get the register ID, start date, and end date from the form data
            const registerID = formData.registerID;
            const startDate = new Date(formData.startDate).toISOString().split('T')[0];
            const endDate = new Date(formData.endDate).toISOString().split('T')[0];

            // GET request to the General Variance API
            axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/RegisterVariance?registerID=${registerID}&startDate=${startDate}&endDate=${endDate}`)
                .then((response) => {
                    // If the response contains data, set the array of variances to the response data
                    if (response.data && response.data.length > 0) {
                        setArrVariances(response.data);
                        setRegisterName(arrRegisters.find(register => register.id === registerID).name);
                        setStatus("");
                    }
                    else {
                        setArrVariances([]);
                        setRegisterName(arrRegisters.find(register => register.id === registerID).name);
                        setStatus("No variances found for the selected register.");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setArrVariances([]);
                    setRegisterName(arrRegisters.find(register => register.id === registerID).name);
                    setStatus("No variances found for the selected register.");
                });
        }

        GetRegisters();

        if (formData.registerID === -1)
            GetGeneralVariance();
        else
            GetRegisterVariance();
    }, [formData]);

    // Event handler for decrementing the date by one day when the left arrow button is clicked
    const handlePreviousDay = (event) => {
        event.preventDefault();

        // Decrement the start and end date by one day
        const newStartDate = decrementDate(formData.startDate);
        const newEndDate = decrementDate(formData.endDate);

        // Update the date
        setFormData((prev) => ({
            ...prev,
            startDate: newStartDate,
            endDate: newEndDate,
        }));
    };

    // Event handler for incrementing the date by one day when the right arrow button is clicked
    const handleNextDay = (event) => {
        event.preventDefault();

        // Increment the start and end date by one day
        const newStartDate = incrementDate(formData.startDate);
        const newEndDate = incrementDate(formData.endDate);
    
        // Update the date
        setFormData((prev) => ({
            ...prev,
            startDate: newStartDate,
            endDate: newEndDate,
        }));
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

        if (name === "posSelect") {
            setFormData((prev) => ({
                ...prev,
                registerID: parseInt(value)
            }));
        }
        else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
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
                        {/* General/Register Variance Select */}
                        <strong>
                            <label htmlFor="posSelect">Register Variance:</label>
                        </strong>
                        <select 
                            name="posSelect" 
                            id="pos"
                            value={formData.registerID}
                            onChange={HandleChange}
                        >
                            <option value="-1">General Variance</option>
                            {arrRegisters.map((register, index) => {
                                return (
                                    <option key={index} value={register.id}>{register.name}</option>
                                );
                            })}
                        </select>
                        <p className="mt-4 ml-6 text-red-500">{status}</p>
                    </div>
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
                    <p className="mt-4 ml-6">{registerName}</p>
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