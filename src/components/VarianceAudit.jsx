import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import SideBar from './SideBar';
import HorizontalNav from "./HorizontalNav";
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import {useAuth} from '../AuthProvider.js';

/*
    TODO:
        - Look into table export options (CSV, Excel, PDF)
        - Style the table
*/

const VarianceAuditPage = () =>{
    const auth = useAuth();
    const navigate = useNavigate();

    // Set the start date to 30 days ago and the end date to today
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const pageSize = 10; // Number of variances to display per page

    const [arrRegisters, setArrRegisters] = useState([]); // Array of a store's registers and its information
    const [arrVariances, setArrVariances] = useState([]); // Array of variances and its information

    const [registerName, setRegisterName] = useState(""); // Register name

    const [currentPage, setCurrentPage] = useState(1); // Current page number

    // Calculate the start and end index of variances to display on the current page
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, arrVariances.length);

    // Function to handle pagination navigation
    const GoToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Status message to display if no registers are open
    const [status, setStatus] = useState("Loading...");
    const errorClass = "text-red-500"; // CSS class for error

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

    // Function to update the input dates to the correct format
    const UpdateInputDates = useCallback(() => {
        // Set the start and end date to the correct format
        document.getElementById("startDate").value = new Date(formData.startDate).toISOString().split('T')[0];
        document.getElementById("endDate").value = new Date(formData.endDate).toISOString().split('T')[0];
    }, [formData.startDate, formData.endDate]);

    // GET request to the General Variance API
    useEffect(() => {
        // Set the start and end date to the correct format
        UpdateInputDates();

        function GetRegisters() {
            axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewRegistersByStoreID?storeID=${formData.store}`)
            .then(response => {
                // Extract register names and ID from the response and filter out closed registers
                const newRegisters = response.data
                    //.filter(register => register.opened)
                    .map(register => ({id: register.ID, name: register.name}));

                if (newRegisters.length === 0) {
                    // Set status message if no registers are open
                    setStatus("No registers are currently open.");
                    setArrRegisters([]);
                }
                else {
                    // Update arrSources using functional form of setState to avoid duplicates
                    setArrRegisters(newRegisters);
                    
                    // Update the register ID to the first register in the array
                    setFormData((prev) => ({
                        ...prev,
                        registerID: newRegisters[0].id
                    }));
                }
            })
            .catch(error => {
                console.error(error);
            });
        }

        GetRegisters();
    }, [formData.store, UpdateInputDates]);

    // Load the register variances when the form data changes
    useEffect(() => {
        if (formData.registerID !== -1) {
            // Set the start and end date to the correct format
            UpdateInputDates();

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
                            setRegisterName([]);
                            setStatus("No variances found for the selected register.");
                        }
                    })
                    .catch((error) => {
                        //console.log(error);
                        setArrVariances([]);
                        setRegisterName([]);
                        setStatus("Error loading variances for the selected register.");
                    });
            }

            GetRegisterVariance();
        }
    }, [formData.registerID, formData.startDate, formData.endDate, UpdateInputDates, arrRegisters]);

    // Event handler for decrementing the date by one day when the left arrow button is clicked
    const HandlePreviousDay = (event) => {
        event.preventDefault();

        // Decrement the start and end date by one day
        const newStartDate = DecrementDate(formData.startDate);
        const newEndDate = DecrementDate(formData.endDate);

        // Update the date
        setFormData((prev) => ({
            ...prev,
            startDate: newStartDate,
            endDate: newEndDate,
        }));
    };

    // Event handler for incrementing the date by one day when the right arrow button is clicked
    const HandleNextDay = (event) => {
        event.preventDefault();

        // Increment the start and end date by one day
        const newStartDate = IncrementDate(formData.startDate);
        const newEndDate = IncrementDate(formData.endDate);
    
        // Update the date
        setFormData((prev) => ({
            ...prev,
            startDate: newStartDate,
            endDate: newEndDate,
        }));
    };

    // Function to increment the date by one day
    const IncrementDate = (dateString) => {
        // Convert the date string to a Date object
        const date = new Date(dateString);

        // Increment the date by one day
        date.setDate(date.getDate() + 1);

        return date;
    };

    // Function to decrement the date by one day
    const DecrementDate = (dateString) => {
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

        // If the input is the register select, update the register ID
        if (name === "posSelect") {
            // Update page number to 1
            setCurrentPage(1);

            setFormData((prev) => ({
                ...prev,
                registerID: parseInt(value)
            }));
        }
        // If the input is the date and value isn't empty, update the date
        else if (value !== "") {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
        console.log(formData);
    }

    // If status is not ...loading, set class to errorClass
    const statusClass = status === "Loading..." ? "" : errorClass;

    return (
        <div className="flex h-screen bg-custom-accent variance-audit-page">
            <SideBar currentPage={5} />
            <div className="flex flex-col w-full">
                <HorizontalNav />
                <div className="text-main-color float-left ml-8 mt-12">
					<h1 className="text-3xl font-bold">Variance Audit for {formData.storeName}</h1>
					<br />
                    <div>
                        {/* General/Register Variance Select */}
                        <div className="label-above-select">
                            <strong>
                                <label htmlFor="pos">Register Variance:</label>
                            </strong>
                            <select 
                                name="posSelect" 
                                id="pos"
                                className="variance-select"
                                value={formData.registerID}
                                onChange={HandleChange}
                            >
                                {arrRegisters.map((register, index) => {
                                    return (
                                        <option key={index} value={register.id}>{register.name}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <p className={`mt-4 ml-6 ${statusClass}`}>{status}</p>
                    </div>
                    <div>
                        {/* Left arrow button */}
                        <button onClick={HandlePreviousDay}>←</button>
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
                        <button onClick={HandleNextDay}>→</button>
                    </div>
                    <p className="mt-4 ml-6">{registerName}</p>
                    <table className="table-variance">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Expected Amount</th>
                            <th>Total</th>
                            <th>Variance</th>
                        </tr>
                        </thead>
                        <tbody>
                            {arrVariances.slice(startIndex, endIndex).map((item, index) => (
                                <tr key={index}>
                                    <td>{new Date(item.Date).toISOString().split('T')[0]}</td>
                                    <td>${parseFloat(item.amountExpected).toFixed(2)}</td>
                                    <td>${parseFloat(item.total).toFixed(2)}</td>
                                    <td>{NegativeValueParantheses(parseFloat(item.Variance))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination">
                        {/* Page # of # (Page 1 of 1 if arrVariances is empty*/}
                        <p>Page {currentPage} of {Math.ceil(arrVariances.length / pageSize) || 1}</p>
                        {/* Previous and Next buttons */}
                        <button className="variance-audit-button" onClick={() => GoToPage(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span> </span>
                        <button className="variance-audit-button" onClick={() => GoToPage(currentPage + 1)} disabled={endIndex >= arrVariances.length}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VarianceAuditPage;