import "../styles/PageStyles.css";
import axios from "axios";
import React, {useRef, useState, useEffect, useLayoutEffect, useCallback} from 'react';
import SideBar from './SideBar';
import HorizontalNav from "./HorizontalNav";
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import {useAuth} from '../AuthProvider.js';
import { Toaster, toast } from 'sonner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { format } from 'date-fns';
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import 'primeicons/primeicons.css';
import { classNames } from "primereact/utils";

const VarianceAuditPage = () =>{
    const auth = useAuth();
    const navigate = useNavigate();

    // Set the start date to 30 days ago and the end date to today
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const rowCount = 10; // Number of variances to display per page

    const [arrRegisters, setArrRegisters] = useState([]); // Array of a store's registers and its information
    const [arrVariances, setArrVariances] = useState([]); // Array of variances and its information
    const [emptyRows, setEmptyRows] = useState([]); // Empty rows to fill the last page of the table

    const [registerName, setRegisterName] = useState(""); // Register name

    const tableRef = useRef(null); // Reference to the table element 

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
                            // Set the array of variances
                            setArrVariances(response.data);

                            // Calculate the number of empty rows to fill the last page of the table
                            // Prime react datatable doesn't lock the number of rows to the page size so
                            // the paginator jumps up and down when the number of variances changes.
                            // This fixes that by adding empty rows to the last page since there's no 
                            // way to lock the number of rows :(.
                            const remainingEmptyRows = rowCount - (response.data.length % rowCount);
                            const emptyRows = Array.from({ length: remainingEmptyRows }, () => ({
                                Date: null, //"\u00A0"
                                amountExpected: null,
                                total: null,
                                Variance: null
                            }));
                            
                            setEmptyRows(emptyRows);

                            // Set the register name
                            setRegisterName(arrRegisters.find(register => register.id === registerID).name);
                            setStatus("");
                        }
                        else {
                            setArrVariances([]);
                            setEmptyRows([]);
                            setRegisterName([]);
                        }
                    })
                    .catch((error) => {
                        //console.log(error);
                        setArrVariances([]);
                        setEmptyRows([]);
                        setRegisterName([]);
                        toast.error("A server error occurred while retrieving register variances. Please try again later.");
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

    // Function to export the table as a CSV file with timestamps
    const exportCSV = (selectionOnly) => {
        // Export the table as a CSV file
        tableRef.current.exportCSV({ selectionOnly });

        // Show a success message
        toast.success("Table exported successfully.");
    };

    // Function to get the file name for the exported CSV file
    function GetFileName() {
        // Get the start date and end date from the form data
        const startDate = FormatDate(formData.startDate);
        const endDate = FormatDate(formData.endDate);

        // Return the file name
        return `${startDate}_${endDate}_${registerName}_VarianceAudit`
    }

    // Function to format the date
    const FormatDate = (dateStr) => {
        // Convert the date string to a Date object
        const date = new Date(dateStr);

        // Return the formatted date
        return format(date, "yyyy-MM-dd");
    };

    // Function to format negative values in parentheses as currency
    const FormatCurrency = (value) => {
        // Format the value as currency
        const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(value));

        // Return the formatted value in parentheses if it's negative
        return value < 0 ? `(${formattedValue})` : formattedValue;
    }

    // Function to change class based on positive/negative variances
    const VariancePositiveNegative = (variance) => {
        // If the variance is null, return null
        if (variance === null) {
            return null;
        }

        // Change the class based on the variance
        const varianceClass = classNames('', {
            'text-red-500': variance < 0,
            'text-green-500': variance > 0
        });

        // Return the variance in the correct class
        return (
            <span className={varianceClass}>
                {variance !== null ? FormatCurrency(variance) : ''}
            </span>
        );
    };

    // Handles the change of the input fields
    const HandleChange = (event) => {
        const {name, value} = event.target;

        // If the input is the register select, update the register ID
        if (name === "posSelect") {
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

    // Table header
    const header = (
        <div className="flex justify-between align-items-center">
        <h1>Variances for {registerName}</h1>
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
        </div>
    )

    return (
        <div className="flex h-screen bg-custom-accent variance-audit-page">
        <Toaster 
            richColors 
            position="bottom-right"
            expand={true}
            duration={5000}
            pauseWhenPageIsHidden={true}
        />
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
                    <br />
                    <div>
                        <DataTable 
                            ref={tableRef}
                            value={[...arrVariances, ...emptyRows]} 
                            rows={rowCount}
                            size="small"
                            paginator={true}
                            showGridlines
                            stripedRows
                            removableSort
                            header={header}
                            emptyMessage="No variances found for the selected register."
                            style={{width: "65%", fontSize: ".9rem"}}
                            exportFilename={GetFileName()}
                        >
                            <Column field="Date" header="Date" sortable body={(rowData) => (
                                <span className={rowData.Date === null ? "invisible-row" : ""}>{FormatDate(rowData.Date)}</span>
                            )}></Column>
                            <Column field="amountExpected" header="Expected Amount" sortable body={(rowData) => (
                                <span className={rowData.amountExpected === null ? "invisible-row" : ""}>{FormatCurrency(rowData.amountExpected)}</span>
                            )}></Column>
                            <Column field="total" header="Total" sortable body={(rowData) => (
                                <span className={rowData.total === null ? "invisible-row" : ""}>{FormatCurrency(rowData.total)}</span>
                            )}></Column>
                            <Column field="Variance" header="Variance" sortable body={(rowData) => (
                                <span className={rowData.Variance === null ? "invisible-row" : ""}>{rowData.Variance !== null ? VariancePositiveNegative(rowData.Variance) : ''}</span>
                            )}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VarianceAuditPage;