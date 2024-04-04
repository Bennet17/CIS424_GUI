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

const VarianceAuditPage = () =>{
    const auth = useAuth();
    const navigate = useNavigate();

    // Set the start date to 30 days ago and the end date to today
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const [rowCount, setRowCount] = useState(10); // Number of rows to display per page

    const [arrRegisters, setArrRegisters] = useState([{ id: -1, name: "All"}]); // Array of a store's registers and its information
    const [arrVariances, setArrVariances] = useState([]); // Array of variances and its information
    const [emptyRows, setEmptyRows] = useState([]); // Empty rows to fill the last page of the table

    const [registerName, setRegisterName] = useState(""); // Register name
    
    const [currentPage, setCurrentPage] = useState(0); // Initialize currentPage with default value of 0
    
    const [showAuditForm, setShowAuditForm] = useState(false); // Show the audit form

    const tableRef = useRef(null); // Reference to the table element 
    const [loading, setLoading] = useState(true); // Loading state for the table

    const varianceColumns = [
        { field: "POSName", header: "POS Name", order: 1 },
        { field: "OpenerName", header: "Opener Name", order: 2 },
        { field: "OpenExpected", header: "Open Expected", order: 3 },
        { field: "OpenActual", header: "Open Actual", order: 4 },
        { field: "OpenVariance", header: "Open Variance", order: 5 },
        { field: "CloserName", header: "Closer Name", order: 6 },
        { field: "CloseExpected", header: "Close Expected", order: 7 },
        { field: "CloseActual", header: "Close Actual", order: 8 },
        { field: "CloseVariance", header: "Close Variance", order: 9 },
        { field: "CashToSafe", header: "Cash to Safe", order: 10 },
        { field: "CloseCreditActual", header: "Close Credit Actual", order: 11 },
        { field: "CloseCreditExpected", header: "Close Credit Expected", order: 12 },
        { field: "CreditVariance", header: "Credit Variance", order: 13 },
        { field: "TotalCashVariance", header: "Total Cash Variance", order: 14 },
        { field: "TotalVariance", header: "Total Variance", order: 15 }
    ]

    // State to store the visible columns in the table
    const [visibleColumns, setVisibleColumns] = useState(varianceColumns.filter(col => [
        "POSName", 
        "OpenerName", 
        "OpenExpected", 
        "OpenActual", 
        "OpenVariance", 
        "CloserName", 
        "CloseExpected", 
        "CloseActual",
        "CloseVariance", 
        "TotalVariance"]
        .includes(col.field)));

    const [formData, setFormData] = useState({
        user: auth.cookie.user.ID,
        name: auth.cookie.user.name,
        store: auth.cookie.user.viewingStoreID,
        storeName: auth.cookie.user.viewingStoreLocation,
        registerID: -1,
        startDate: monthAgo,
        endDate: today,
        cashTendered: "0.00",
        cashBuys: "0.00",
        pettyCash: "0.00",
        mastercard: "0.00",
        visa: "0.00",
        amex: "0.00",
        discover: "0.00",
        debit: "0.00",
        other: "0.00"
    });

    //check the permissions of the logged in user on page load, passing in
    //the required permissions
    useLayoutEffect(() => {
        if (!auth.CheckAuthorization(["Manager", "District Manager", "Owner"])){
            navigate(routes.home);
        }
    });

    // Function to update the input dates to the correct format
    const UpdateInputDates = useCallback(() => {
        // Set the start and end date to the correct format
        document.getElementById("startDate").value = new Date(formData.startDate).toISOString().split('T')[0];
        document.getElementById("endDate").value = new Date(formData.endDate).toISOString().split('T')[0];
    }, [formData.startDate, formData.endDate]);

    // GET request to return registers for the selected store
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

                    // Add 'All' option to the register select
                    newRegisters.unshift({id: -1, name: "All"});

                if (newRegisters.length === 1) {
                    // Set toast message if no registers are open
                    toast.warning(`No registers are currently open for ${formData.storeName}.`);
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
                toast.error("A server error occurred while loading registers. Please try again later.");
            });
        }

        GetRegisters();
    }, [formData.store, UpdateInputDates]);

    // Load the register variances when the form data changes
    useEffect(() => {
        // Set the start and end date to the correct format
        UpdateInputDates();

        // GET request to the Register Variance API
        function GetRegisterVariance() {
            // Get the register ID, start date, and end date from the form data
            const registerID = formData.registerID;
            const storeID = formData.store;
            const startDate = new Date(formData.startDate).toISOString().split('T')[0];
            const endDate = new Date(formData.endDate).toISOString().split('T')[0];

            // GET request to the Register Variance API
            axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/RegisterVariance?registerID=${registerID}&storeID=${storeID}&startDate=${startDate}&endDate=${endDate}`)
                .then((response) => {
                    // If the response contains data, set the array of variances to the response data
                    if (response.data && response.data.length > 0) {
                        // Set the array of variances after sorting by date
                        setArrVariances(response.data.sort((a, b) => new Date(a.Date) - new Date(b.Date)));

                        // Calculate the number of empty rows to fill the last page of the table
                        // Prime react datatable doesn't lock the number of rows to the page size so
                        // the paginator jumps up and down when the number of variances changes.
                        // This fixes that by adding empty rows to the last page since there's no 
                        // way to lock the number of rows :(.
                        const remainingEmptyRows = rowCount - (response.data.length % rowCount);

                        // Create an array of empty rows to fill the last page of the table
                        let emptyRows = [];

                        // Check if there are remaining empty rows to fill, and if the number of data rows is not a multiple of rowCount
                        if (remainingEmptyRows > 0 && response.data.length % rowCount !== 0) {
                            emptyRows = Array.from({ length: remainingEmptyRows }, () => ({
                                Date: null,
                                amountExpected: null,
                                total: null,
                                Variance: null
                            }));
                        }

                        // Set the empty rows
                        setEmptyRows(emptyRows);

                        // Set the register name
                        setRegisterName(arrRegisters.find(register => register.id === registerID).name);

                        // Set the loading state to false
                        setLoading(false);
                    }
                    else {
                        setArrVariances([]);
                        setEmptyRows([]);
                        setRegisterName(arrRegisters.find(register => register.id === registerID).name);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    //console.log(error);
                    setArrVariances([]);
                    setEmptyRows([]);
                    setRegisterName(arrRegisters.find(register => register.id === registerID).name);
                    setLoading(false);
                });
        }

        GetRegisterVariance();
        
    }, [formData.registerID, formData.startDate, formData.endDate, UpdateInputDates, arrRegisters, rowCount]);

    // OnClick event handler for opening the Over/Short Audit form
    const OpenOverShortAudit = (event) => {
        event.preventDefault();

        // Show the Over/Short Audit form
        setShowAuditForm(true);
    };

    // OnClick event handler for closing the Over/Short Audit form
    const CloseOverShortAudit = (event) => {
        event.preventDefault();
        
        // Close the Over/Short Audit form
        setShowAuditForm(false);
    };

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

    // Function to export the table as a PDF file
    const exportPDF = () => {
        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Add the table to the PDF
        doc.autoTable({ html: '#variance-table' });

        // Save the PDF file
        doc.save(`${GetFileName()}.pdf`);

        // Show a success message
        toast.success("Table exported successfully.");
    };

    // Function to get the file name for the exported CSV file
    function GetFileName() {
        // Get the start date and end date from the form data
        const startDate = FormatDate(formData.startDate);
        const endDate = FormatDate(formData.endDate);

        // Return the file name
        return `${formData.storeName}_${registerName}_${startDate}_${endDate}_VarianceAudit`
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
    };

    const HandleCurrencyChange = useCallback((name) => {
        return (value) => {
            console.log(name, value);
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
    }, []});

    // Function to handle the change of the row count
    const OnRowChange = (event) => {
        // Update the row count with the selected value
        setRowCount(event.rows);

        // Update the current page
        setCurrentPage(event.page);
    }

    // Function to show the selected columns in the table from the multi-select dropdown
    const HandleColumnToggle = (event) => {
        // Get the columns and selected columns from the event
        let selectedColumns = event.value;
    
        // Sort the selected columns based on the order property
        selectedColumns.sort((a, b) => a.order - b.order);
    
        // Set the visible columns
        setVisibleColumns(selectedColumns);
    }

    const AuditForm = ({ onClose }) => {
        return (
            <div className="report-overlay">
                <div className="report-container">
                    <h2>Over/Short Audit</h2>
                    <form action="submit">
                        <div className="flex items-center space-x-4">
                            {/* Start date */}
                            <div className="label-above-select">
                                <strong>
                                    <label htmlFor="startDateAudit">Start Date:</label>
                                </strong>
                                <input 
                                    type="date" 
                                    id="startDateAudit" 
                                    name="startDate"
                                    className="variance-date"
                                    value={formData.startDate}
                                    date={formData.startDate}
                                    onChange={HandleChange}
                                />
                            </div>
                            {/* End date */}
                            <div className="label-above-select">
                                <strong>
                                    <label htmlFor="endDateAudit">End Date:</label>
                                </strong>
                                <input 
                                    type="date" 
                                    id="endDateAudit" 
                                    name="endDate" 
                                    className="variance-date"
                                    value={formData.endDate}
                                    date={formData.endDate}
                                    onChange={HandleChange}
                                />
                            </div>
                            <div className="label-above-select">
                                <strong>
                                    <label htmlFor="cashTendered">Cash Tendered:</label>
                                </strong>
                                <CurrencyInput
                                    id="cashTendered"
                                    name="cashTendered"
                                    value={formData.cashTendered}
                                    onValueChange={(value, name) => {
										setFormData((prevFormData) => ({
											...prevFormData,
											cashTendered: value,
										}));
									}}
                                    prefix="$"
                                    decimalsLimit={2}
                                    className="variance-currency"
                                />
                            </div>
                            <div className="label-above-select">
                                <strong>
                                    <label htmlFor="cashBuys">Cash Buys:</label>
                                </strong>
                                <CurrencyInput
                                    id="cashBuys"
                                    name="cashBuys"
                                    value={formData.cashBuys}
                                    onValueChange={(value, name) => {
										setFormData((prevFormData) => ({
											...prevFormData,
											cashBuys: value,
										}));
									}}
                                    prefix="$"
                                    decimalsLimit={2}
                                    className="variance-currency"
                                />
                            </div>
                        </div>

                    </form>
                    <button 
                        onClick={() => {
                            onClose();
                        }} 
                        className="close-button"
                    >
                            Close
                    </button>
                </div>
            </div>
        );
    }
    
    // Table header
    const header = (
        <div className="flex justify-between align-items-center">
            <h1 className="variance-header">Variances for {registerName}</h1>
            <MultiSelect 
                value={visibleColumns} 
                options={varianceColumns} 
                optionLabel="header" 
                filter
                placeholder="Select columns to display"
                onChange={HandleColumnToggle} 
                style={{width: '40em', fontSize: '.9rem', marginRight: '1em'}}
                display="chip" 
            />
            <Button 
                type="button" 
                icon="pi pi-file" 
                rounded 
                size="small" 
                onClick={() => exportCSV(false)} 
                data-pr-tooltip="CSV" 
                label="Export to CSV"
            />
            <Button
                type="button"
                icon="pi pi-file-pdf"
                rounded
                size="small"
                onClick={exportPDF}
                data-pr-tooltip="PDF"
                label="Export to PDF"
            />
        </div>
    )
    
    return (
        <div className="flex min-h-screen bg-custom-accent variance-audit-page">
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
                <div className="text-main-color float-left ml-8 mt-6">
					<h1 className="text-3xl font-bold">Variance Audit for {formData.storeName}</h1>
					<br />
                    <div className="flex items-center space-x-4">
                        {/* Register Variance Select */}
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
                        {/* Left arrow button */}
                        <Button
                            onClick={HandlePreviousDay}
                            icon="pi pi-arrow-left"
                            iconPos="left"
                            size="small"
                            text
                            rounded
                            aria-label="Previous Day"
                            style={{ marginTop: "6px", boxShadow: "none"}}
                        />
                        {/* Start date */}
                        <div className="label-above-select">
                            <strong>
                                <label htmlFor="startDate">Start Date:</label>
                            </strong>
                            <input 
                                type="date" 
                                id="startDate" 
                                name="startDate"
                                className="variance-date"
                                date={formData.startDate}
                                onChange={HandleChange}
                            />
                        </div>
                        {/* End date */}
                        <div className="label-above-select">
                            <strong>
                                <label htmlFor="endDate">End Date:</label>
                            </strong>
                            <input 
                                type="date" 
                                id="endDate" 
                                name="endDate" 
                                className="variance-date"
                                date={formData.endDate}
                                onChange={HandleChange}
                            />
                        </div>
                        {/* Right arrow button */}
                        <Button
                            onClick={HandleNextDay}
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            size="small"
                            rounded
                            text
                            aria-label="Next Day"
                            style={{ marginTop: "6px", boxShadow: "none"}}
                        />
                        {/* Over/Short Audit button */}
                        <input
                            // onClick={OpenOverShortAudit}
                            type="button"
                            value="Over/Short Audit"
                            className="cursor-pointer rounded-md bg-indigo-600 px-10 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        />
                    </div>
                    <div style={{ overFlowX: 'auto' }}>
                        <DataTable 
                            ref={tableRef}
                            value={[...arrVariances, ...emptyRows]} 
                            rows={rowCount}
                            rowsPerPageOptions={[5, 10, 15]}
                            onPage={OnRowChange}
                            first={currentPage * rowCount}
                            size="small"
                            paginator={true}
                            loading={loading}
                            showGridlines
                            stripedRows
                            removableSort
                            header={header}
                            scrollable
                            scrollHeight="40vh"
                            emptyMessage="No variances found for the selected register."
                            style={{ width: "80%", fontSize: ".9rem", backgroundColor: "white" }}
                            exportFilename={GetFileName()}
                        >
                            <Column field="Date" header="Date" sortable body={(rowData) => (
                                <span className={rowData.Date === null ? "invisible-row" : ""}>{FormatDate(rowData.Date)}</span>
                            )}></Column>
                            {visibleColumns.map(column => (
                                <Column 
                                    key={column.field}
                                    field={column.field} 
                                    header={column.header} 
                                    style={{ minWidth: "6em" }}
                                    sortable 
                                    body={(rowData) => {
                                        // Check if the column is a currency column
                                        if (["OpenExpected", "OpenActual", "CloseExpected", "CloseActual", "CashToSafe", "CloseCreditActual", "CloseCreditExpected"].includes(column.field)) {
                                            // Check if the value is null or undefined
                                            if (rowData[column.field] == null) 
                                                return <span className="invisible-row">-</span>; // Display '-' for null or undefined values
                                            else 
                                                return <span>{FormatCurrency(rowData[column.field])}</span>; // Format the currency value
                                        }
                                        // Check if the column is a variance column
                                        else if (["OpenVariance", "CloseVariance", "TotalCashVariance", "CreditVariance", "TotalVariance"].includes(column.field)) {
                                            // Check if the value is null or undefined
                                            if (rowData[column.field] == null) {
                                                return <span className="invisible-row">-</span>; // Display '-' for null or undefined values
                                            } else {
                                                return <span>{VariancePositiveNegative(rowData[column.field])}</span>; // Format the variance value
                                            }
                                        }
                                        // For other columns, display value as is
                                        else {
                                            return <span>{rowData[column.field]}</span>;
                                        }
                                    }}
                                />
                            ))}
                        </DataTable>
                    </div>
                    {showAuditForm && <AuditForm />}
                </div>
            </div>
        </div>
    )
}

export default VarianceAuditPage;