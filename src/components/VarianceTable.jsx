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
import { MultiSelect } from 'primereact/multiselect';
import { format } from 'date-fns';
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import 'primeicons/primeicons.css';
import { classNames } from "primereact/utils";
import jsPDF from 'jspdf'

const VarianceTable = () => {
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

    const tableRef = useRef(null); // Reference to the table element 
    const [loading, setLoading] = useState(true); // Loading state for the table

    // Columns for the variance table
    const varianceColumns = [ 
        { field: "POSName", header: "POS Name", order: 1 },
        { field: "OpenerName", header: "Opener Name", order: 2 },
        { field: "OpenExpected", header: "Open Expected", order: 3 },
        { field: "OpenActual", header: "Open Actual", order: 4 },
        { field: "CloserName", header: "Closer Name", order: 5 },
        { field: "CloseExpected", header: "Close Expected", order: 6 },
        { field: "CloseActual", header: "Close Actual", order: 7 },
        { field: "CashToSafe", header: "Cash to Safe", order: 8 },
        { field: "CloseCreditExpected", header: "Credit Expected", order: 9 },
        { field: "CloseCreditActual", header: "Credit Actual", order: 10 },
        { field: "OpenVariance", header: "Open Variance", order: 11 },
        { field: "CloseVariance", header: "Close Variance", order: 12 },
        { field: "TotalCashVariance", header: "Total Cash Variance", order: 13 },
        { field: "CreditVariance", header: "Credit Variance", order: 14 },
        { field: "TotalVariance", header: "Total Variance", order: 15 },
        { field: "SafeVariance", header: "Safe Variance", order: 16 }
    ]

    const columnConfigs = {
        all : [
            { field: "POSName", header: "POS Name", order: 1 },
            { field: "OpenerName", header: "Opener Name", order: 2 },
            { field: "OpenExpected", header: "Open Expected", order: 3 },
            { field: "OpenActual", header: "Open Actual", order: 4 },
            { field: "CloserName", header: "Closer Name", order: 5 },
            { field: "CloseExpected", header: "Close Expected", order: 6 },
            { field: "CloseActual", header: "Close Actual", order: 7 },
            { field: "CashToSafe", header: "Cash to Safe", order: 8 },
            { field: "CloseCreditExpected", header: "Credit Expected", order: 9 },
            { field: "CloseCreditActual", header: "Credit Actual", order: 10 },
            { field: "OpenVariance", header: "Open Variance", order: 11 },
            { field: "CloseVariance", header: "Close Variance", order: 12 },
            { field: "TotalCashVariance", header: "Total Cash Variance", order: 13 },
            { field: "CreditVariance", header: "Credit Variance", order: 14 },
            { field: "TotalVariance", header: "Total Variance", order: 15 },
            { field: "SafeVariance", header: "Safe Variance", order: 16 }
        ],
        safe : [
            { field: "OpenerName", header: "Opener Name", order: 1 },
            { field: "OpenExpected", header: "Open Expected", order: 2 },
            { field: "OpenActual", header: "Open Actual", order: 3 },
            { field: "SafeAuditorName", header: "Safe Auditor Name", order: 4 },
            { field: "SafeAuditExpected", header: "Safe Audit Expected", order: 5 },
            { field: "SafeAuditActual", header: "Safe Audit Actual", order: 6 },
            { field: "CloserName", header: "Closer Name", order: 7 },
            { field: "CloseExpected", header: "Close Expected", order: 8 },
            { field: "CloseActual", header: "Close Actual", order: 9 },
            { field: "OpenVariance", header: "Open Variance", order: 10 },
            { field: "SafeAuditVariance", header: "Safe Audit Variance", order: 11 },
            { field: "CloseVariance", header: "Close Variance", order: 12 },
            { field: "TotalCashVariance", header: "Total Cash Variance", order: 13 }
        ],
        pos : [
            { field: "POSName", header: "POS Name", order: 1 },
            { field: "OpenerName", header: "Opener Name", order: 2 },
            { field: "OpenExpected", header: "Open Expected", order: 3 },
            { field: "OpenActual", header: "Open Actual", order: 4 },
            { field: "CloserName", header: "Closer Name", order: 5 },
            { field: "CloseExpected", header: "Close Expected", order: 6 },
            { field: "CloseActual", header: "Close Actual", order: 7 },
            { field: "CashToSafe", header: "Cash to Safe", order: 8 },
            { field: "CloseCreditExpected", header: "Credit Expected", order: 9 },
            { field: "CloseCreditActual", header: "Credit Actual", order: 10 },
            { field: "OpenVariance", header: "Open Variance", order: 11 },
            { field: "CloseVariance", header: "Close Variance", order: 12 },
            { field: "TotalCashVariance", header: "Total Cash Variance", order: 13 },
            { field: "CreditVariance", header: "Credit Variance", order: 14 },
            { field: "TotalVariance", header: "Total Variance", order: 15 }
        ]
    }

    // State to store the visible columns in the table
    const [visibleColumns, setVisibleColumns] = useState(varianceColumns);
    const [columnOptions, setColumnOptions] = useState(varianceColumns);

    // Form data for the table
    const [formData, setFormData] = useState({
        user: auth.cookie.user.ID,
        name: auth.cookie.user.name,
        store: auth.cookie.user.viewingStoreID,
        storeName: auth.cookie.user.viewingStoreLocation,
        registerID: -1,
        startDate: monthAgo,
        endDate: today
    });

    //check the permissions of the logged in user on page load, passing in
    //the required permissions
    useLayoutEffect(() => {
        if (!auth.CheckAuthorization(["Team Leader", "Store Manager", "Owner"])) {
            navigate(routes.home);
        }
    });

    // State to store the max and min date for the input fields
    const [maxDate, setMaxDate] = useState('');
    const [minDate, setMinDate] = useState('');
    
    // Update the input dates to the correct format when the form data changes
    useEffect(() => {
        if (formData.endDate instanceof Date) {
            const maxDateValue = new Date(formData.endDate.getTime() - (formData.endDate.getTimezoneOffset() * 60000));
            setMaxDate(maxDateValue.toISOString().split('T')[0]);
        }
    
        if (formData.startDate instanceof Date) {
            const minDateValue = new Date(formData.startDate.getTime() - (formData.startDate.getTimezoneOffset() * 60000));
            setMinDate(minDateValue.toISOString().split('T')[0]);
        }
    }, [formData.startDate, formData.endDate]);

    // Function to update the input dates to the correct format
    const UpdateInputDates = useCallback(() => {
        // Set the start and end date to the correct format
        const startDateInput = document.getElementById("startDate");
        const endDateInput = document.getElementById("endDate");

        // Check if the input elements exist and the form data contains Date objects
        if (startDateInput && endDateInput && formData.startDate instanceof Date && formData.endDate instanceof Date) {
            // Create Date objects with the timezone offset
            const startDate = new Date(formData.startDate.getTime() - (formData.startDate.getTimezoneOffset() * 60000));
            const endDate = new Date(formData.endDate.getTime() - (formData.endDate.getTimezoneOffset() * 60000));
    
            // Set the input values
            startDateInput.valueAsDate = startDate;
            endDateInput.valueAsDate = endDate;
        }
    }, [formData.startDate, formData.endDate]);

    // GET request to return registers for the selected store
    useEffect(() => {
        function GetRegisters() {
            axios.get(
                `${process.env.REACT_APP_REQUEST_URL}ViewStoreObjects?storeID=${formData.store}`,
                {
                  headers: {
                    [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY
                  }
                }
            )
            .then(response => {
                // Extract register names and ID from the response and filter out closed registers
                const newRegisters = response.data
                    //.filter(register => register.opened)
                    .map(register => ({id: register.regID, name: register.name, open: register.opened}));

                    // Add 'All' option to the register select
                    newRegisters.unshift({id: -1, name: "All", open: true});

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
                toast.error("A server error occurred while loading registers. Please try again later.");
            });
        }

        GetRegisters();
    }, [formData.store]);

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
            axios.get(
                `${process.env.REACT_APP_REQUEST_URL}RegisterVariance?registerID=${registerID}&storeID=${storeID}&startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY
                    }
                }
            )
                .then((response) => {
                    // If the response contains data, set the array of variances to the response data
                    if (response.data && response.data.length > 0) {
                        // Calculate totals
                        if (formData.registerID === -1){
                            const totals = CalculateTotal(response.data);
                        
                            // Append totals to the data array
                            const dataWithTotals = [...response.data, totals];
    
                            // Set the array of variances after sorting by date
                            setArrVariances(dataWithTotals.sort((a, b) => new Date(a.Date) - new Date(b.Date)));
                        } else {
                            // Set the array of variances after sorting by date
                            setArrVariances(response.data.sort((a, b) => new Date(a.Date) - new Date(b.Date)));
                        }
                        
                        // Calculate the number of empty rows to fill the last page of the table
                        // Prime react datatable doesn't lock the number of rows to the page size so
                        // the paginator jumps up and down when the number of variances changes.
                        // This fixes that by adding empty rows to the last page since there's no 
                        // way to lock the number of rows :(.
                        const remainingEmptyRows = rowCount - (arrVariances.length % rowCount);

                        // Create an array of empty rows to fill the last page of the table
                        let emptyRows = [];

                        // Check if there are remaining empty rows to fill, and if the number of data rows is not a multiple of rowCount
                        if (remainingEmptyRows > 0 && arrVariances.length % rowCount !== 0) {
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
                    setArrVariances([]);
                    setEmptyRows([]);
                    setRegisterName(arrRegisters.find(register => register.id === registerID).name);
                    setLoading(false);
                });
        }

        GetRegisterVariance();
        
    }, [formData.registerID, formData.startDate, formData.endDate, UpdateInputDates, arrRegisters, rowCount]);

    // Event handler for decrementing the date by one day when the left arrow button is clicked
    const HandlePreviousDay = (event) => {
        setLoading(true)
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
        setLoading(true)
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

    // Handles the change of the input fields
    const HandleChange = (event) => {
        setLoading(true)
        const { name, value } = event.target;
    
        // If the input is the register select, update the register ID and the visible columns
        if (name === "posSelect") {
            const registerID = parseInt(value);
            setFormData((prev) => ({
                ...prev,
                registerID: registerID
            }));
    
            // Update visible columns based on the selected register
            switch (registerID) {
                case -1: // All registers
                    setVisibleColumns(columnConfigs.all);
                    setColumnOptions(columnConfigs.all);
                    break;
                case 0: // Safe
                    setVisibleColumns(columnConfigs.safe);
                    setColumnOptions(columnConfigs.safe);
                    break;
                default: // POS registers
                    setVisibleColumns(columnConfigs.pos);
                    setColumnOptions(columnConfigs.pos);
                    break;
            }
        }
        else {
            // Handle date changes
            // Parse the string and extract year, month, and day values
            const [year, month, day] = value.split("-").map(Number);

            // Create a new local Date object with the extracted values
            const date = new Date(year, month - 1, day);
    
            // Update the form data with the new value
            setFormData((prev) => ({
                ...prev,
                [name]: date
            }));
        }
    };

    // Function to export the table as a PDF file
    const exportPDF = () => {
        // Create a new jsPDF instance
        const doc = new jsPDF({
            orientation: 'landscape',
        });

        // Add title to the PDF report
        const title = `Variance Table\n${formData.storeName}\n${registerName}\n${FormatDate(formData.startDate)} - ${FormatDate(formData.endDate)}`;
        const titleX = 5;
        const titleY = 5;
        doc.setFontSize(8);
        doc.text(titleX, titleY, title);

        // Initialize variables
        const tableData = [];
        let currentDate = null;
        let safeVarianceAdded = false;
        let totalRow = {};
        let safeVarianceGrandTotal = 0;
        let isTotalRow = false; // Flag to track if the current row is a totals row

        // Iterate over arrVariances to calculate totals and insert rows
        arrVariances.forEach(variance => {       
            // If the date changes, insert the total row for the previous date
            if (variance.Date !== currentDate && variance.Date !== 'Totals:' && formData.registerID === -1) {
                safeVarianceAdded = false;
                // Calculate and push the total row for the previous date group
                if (totalRow && Object.keys(totalRow).length > 0 && !isTotalRow) {
                    // Push total row to tableData with "Totals" label
                    const formattedTotalRow = ['Totals', ...Object.values(totalRow).map(value => {
                        return isNaN(value) ? value : FormatCurrency(value);
                    })];
                    tableData.push(formattedTotalRow);
                    tableData.push([]); // Add an empty row after the totals row
                    totalRow = {}; // Reset total row object
                }
                tableData.push([FormatDate(variance.Date)]); // Insert date row
                currentDate = variance.Date; // Update current date
                isTotalRow = false; // Reset isTotalRow flag
            }

            // Calculate totals for each column is the current row is not the complete summation row
            if (variance.Date !== 'Totals:' && formData.registerID === -1) {
                columnOptions.forEach(column => {
                    if (!totalRow[column.field]) {
                        // Initialize total to an empty string for excluded columns
                        totalRow[column.field] = ["POSName", "OpenerName", "CloserName"].includes(column.field) ? "" : 0;
                    }
                    if (!isNaN(variance[column.field])) {
                        if (!["POSName", "OpenerName", "CloserName", "SafeVariance"].includes(column.field)) {
                            totalRow[column.field] += variance[column.field];
                        }
                        if (["SafeVariance"].includes(column.field)) {
                            totalRow[column.field] = variance[column.field];
                            if (!safeVarianceAdded) {
                                totalRow['TotalVariance'] += variance[column.field];
                                // Now that we've added the Safe Variance, set the flag so we don't add it again for this day
                                safeVarianceGrandTotal += variance[column.field]
                                safeVarianceAdded = true;
                            }
                        }
                    } else {
                        // Reset the total to an empty string for excluded columns
                        if (["POSName", "OpenerName", "CloserName"].includes(column.field)) {
                            totalRow[column.field] = "";
                        }
                    }
                });
            }

            const rowData = [
                FormatDate(variance.Date),
                ...columnOptions.map(column => {
                    // Apply formatting functions to other columns
                    if (["OpenExpected", "OpenActual", "CloseExpected", "CloseActual", "CashToSafe", "CloseCreditActual", "CloseCreditExpected", "SafeAuditActual", "SafeAuditExpected"].includes(column.field)) {
                        return variance[column.field] == null ? '-' : FormatCurrency(variance[column.field]); // Currency formatting
                    } 
                    else if (["OpenVariance", "CloseVariance", "TotalCashVariance", "CreditVariance", "TotalVariance", "SafeVariance", "SafeAuditVariance"].includes(column.field)) {
                        if (["SafeVariance"].includes(column.field) && variance.Date !== 'Totals:'){
                            return ' '
                        }
                        return variance[column.field] == null ? '-' : VariancePositiveNegative(variance[column.field], true); // Variance formatting
                    } 
                    else {
                        return variance[column.field]; // No formatting for other columns
                    }
                })
            ];

            tableData.push(rowData); // Insert row data
            
            // Check if the current row is a totals row
            if (rowData[0] === 'Totals') {
                isTotalRow = true;
            }
        });

        // Calculate and push the total row for the last date group
        if (totalRow && Object.keys(totalRow).length > 0 && !isTotalRow) {
            // Ensure that all columns are present in the total row
            columnOptions.forEach(column => {
                if (!totalRow[column.field]) {
                    totalRow[column.field] = ["POSName", "OpenerName", "CloserName"].includes(column.field) ? "" : 0;
                }
            });

            // Format the total row and push it
            const formattedTotalRow = ['Totals', ...Object.values(totalRow).map(value => {
                return isNaN(value) ? value : FormatCurrency(value);
            })];

            tableData.push(formattedTotalRow);
            tableData.push([]); // Add an empty row after the totals row
        }

        function parseCurrency(currencyString) {
            if (typeof currencyString !== 'string') {
                // If it's not a string, try to convert whatever it is to a string
                currencyString = String(currencyString);
            }
        
            // Remove currency symbols, commas, and parenthesis for negative values
            let numberString = currencyString.replace(/[,$]+/g, '');
        
            // Check if the value is enclosed in parentheses (negative number in accounting)
            const isNegative = currencyString.includes('(') && currencyString.includes(')');
        
            // Remove parentheses if present
            numberString = numberString.replace(/[()]+/g, '');
        
            // Convert to a float and make negative if it was in parentheses
            return isNegative ? -parseFloat(numberString) : parseFloat(numberString);
        }

        // Shifts Totals: row to the end of the table
        const totalsIndex = tableData.findIndex(row => row[0] === 'Totals:');
        if (totalsIndex > -1) {
            let totalsRow = tableData.splice(totalsIndex, 1)[0];
            
            // Find the index for Total Variance, assume it is the second last column before Safe Variance
            const totalVarianceIndex = totalsRow.length - 2;
            
            // Parse the current Total Variance and Safe Variance
            const currentTotalVariance = parseCurrency(totalsRow[totalVarianceIndex]);
            const safeVarianceToAdd = parseCurrency(safeVarianceGrandTotal);
        
            // Add the safe variance to the total variance
            const updatedTotalVariance = currentTotalVariance + safeVarianceToAdd;
        
            // Format and set the updated total variance
            totalsRow[totalVarianceIndex] = FormatCurrency(updatedTotalVariance);
        
            // Add the updated totals row back into the tableData
            tableData.push(totalsRow);
        }

        // Include the date column header in the head array
        const head = ["Date", ...columnOptions.map(column => column.header)];

        // Save the PDF report with the store name and current date
        doc.autoTable({
            head: [head], // Header row containing column headers
            body: tableData, // Data rows
            styles: { halign: 'center', cellPadding: .8, fontSize: 8 },
            startY: titleY + 15
        });

        doc.save(`${GetFileName()}.pdf`);
    };

    // Function to get the file name for the exported CSV file
    function GetFileName() {
        // Get the start date and end date from the form data
        const startDate = FormatDate(formData.startDate);
        const endDate = FormatDate(formData.endDate);

        // Return the file name
        return `${formData.storeName}_${registerName}_${startDate}_${endDate}_VarianceTable`
    }

    // Function to format the date
    const FormatDate = (dateStr) => {
        // Check if dateStr is null or undefined
        if (!dateStr) 
            return ""; // or return a default value
        else if (dateStr === "Totals:")
            return dateStr;

        // Convert the date string to a Date object
        const date = new Date(dateStr);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return "Invalid Date"; // or return a default value
        }

        // Return the formatted date
        return format(date, "yyyy-MM-dd");
    };


    // Function to format negative values in parentheses as currency
    const FormatCurrency = (value) => {
        // Return an empty string if the value is empty or not a number
        if (value === "" || isNaN(value)) {
            return "";
        }

        // Format the value as currency
        const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(value));

        // Return the formatted value in parentheses if it's negative
        return value < 0 ? `(${formattedValue})` : formattedValue;
    };

    // Function to change class based on positive/negative variances
    const VariancePositiveNegative = (variance, isPDF) => {
        // If the variance is null, return null
        if (variance === null) {
            return null;
        }

        // Change the class based on the variance
        const varianceClass = classNames('', {
            'text-red-500': variance < 0,
            'text-green-500': variance > 0
        });

        // Return the formatted variance
        if (isPDF) 
            return FormatCurrency(variance);
        else {
            return (
                <span className={varianceClass}>
                    {variance !== null ? FormatCurrency(variance) : ''}
                </span>
            );
        }
    };
    
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

    // Table header
    const tableHeader = (
        <div className="flex justify-between align-items-center">
            <h1 className="variance-header">Variances for {registerName}</h1>
            <MultiSelect 
                value={visibleColumns} 
                options={columnOptions}
                optionLabel="header" 
                filter
                placeholder="Select columns to display"
                onChange={HandleColumnToggle} 
                style={{width: '40em', fontSize: '.9rem', marginRight: '1em'}}
                display="chip"
            />
            <Button
                type="button"
                icon="pi pi-file-pdf"
                rounded
                size="small"
                onClick={exportPDF}
                className="p-button-primary p-button-raised"
                data-pr-tooltip="PDF"
                label="Export to PDF"
            />
        </div>
    )

    // Calculates the sum total for the column
    const CalculateGroupTotal = (columnName, date) => {
        if (columnName === "SafeVariance") {
            const entry = arrVariances.find(row => row.Date === date && row.hasOwnProperty('SafeVariance'));
            // Return the SafeVariance value or 0 if it does not exist
            return entry ? entry.SafeVariance : 0;
        } else {            
            // Filter rows with the specified date
            const filteredRows = arrVariances.filter(row => row.Date === date);

            // Sum up values for the specified column
            return filteredRows.reduce((total, row) => total + row[columnName], 0);
        }
    };

    // Function to calculate the totals for each column
    function CalculateTotal(data) {
        
        // Initialize total object
        
        const total = {
            Date: "Totals:",
            POSName: "",
            OpenerName: "",
            OpenExpected: 0,
            OpenActual: 0,
            CloserName: "",
            CloseExpected: 0,
            CloseActual: 0,
            CashToSafe: 0,
            CloseCreditExpected: 0,
            CloseCreditActual: 0,
            OpenVariance: 0,
            CloseVariance: 0,
            TotalCashVariance: 0,
            CreditVariance: 0,
            TotalVariance: 0,
            SafeVariance: 0
        };
        
        const datesWithSafeVarianceAdded = new Set();

        // Iterate over data to calculate totals
        data.forEach(row => {
            total.OpenExpected += row.OpenExpected;
            total.OpenActual += row.OpenActual;
            total.OpenVariance += row.OpenVariance;
            total.CloseExpected += row.CloseExpected;
            total.CloseActual += row.CloseActual;
            total.CloseVariance += row.CloseVariance;
            total.CashToSafe += row.CashToSafe;
            total.CloseCreditActual += row.CloseCreditActual;
            total.CloseCreditExpected += row.CloseCreditExpected;
            total.CreditVariance += row.CreditVariance;
            total.TotalCashVariance += row.TotalCashVariance;
            if (!datesWithSafeVarianceAdded.has(row.Date)) {
                // Add SafeVariance to TotalVariance only if we haven't added it for this date
                total.SafeVariance += row.SafeVariance ?? 0;
                datesWithSafeVarianceAdded.add(row.Date);
            }
            total.TotalVariance += row.TotalVariance;
        });
        
        // Finally, add the summed SafeVariance to TotalVariance
        total.TotalVariance += total.SafeVariance;

        return total;
    }

    // Row group header based on the date
    const rowHeader = (data) => {
        // If the date is Totals, return a bolded row
        if (data.Date === "Totals:") {
            return null;
        }
        else {
            return (
                <div className="flex align-items-center gap-2">
                    <span className="font-bold">{FormatDate(data.Date)}</span>
                </div>
            )
        }
    }

    // Row group footer that adds the amounts from each row with the same date
    const rowFooter = (data) => {
        if (formData.registerID === -1){
            if (!data || data.Date === null)
                return null;
            else {
                const date = data.Date;
                return (
                    <>
                        {visibleColumns.map(column => (
                            <td key={column.field}>
                                <strong>
                                    {column.field === "POSName" && data.Date === "Totals:" ? "Totals:" : column.field === "POSName" && "Total:"}
                                    {column.field === "OpenerName" && ""}
                                    {column.field === "OpenExpected" && FormatCurrency(CalculateGroupTotal("OpenExpected", date))}
                                    {column.field === "OpenActual" && FormatCurrency(CalculateGroupTotal("OpenActual", date))}
                                    {column.field === "OpenVariance" && VariancePositiveNegative(CalculateGroupTotal("OpenVariance", date), false)}
                                    {column.field === "CloserName" && ""}
                                    {column.field === "CloseExpected" && FormatCurrency(CalculateGroupTotal("CloseExpected", date))}
                                    {column.field === "CloseActual" && FormatCurrency(CalculateGroupTotal("CloseActual", date))}
                                    {column.field === "CloseVariance" && VariancePositiveNegative(CalculateGroupTotal("CloseVariance", date), false)}
                                    {column.field === "CashToSafe" && FormatCurrency(CalculateGroupTotal("CashToSafe", date))}
                                    {column.field === "CloseCreditActual" && FormatCurrency(CalculateGroupTotal("CloseCreditActual", date))}
                                    {column.field === "CloseCreditExpected" && FormatCurrency(CalculateGroupTotal("CloseCreditExpected", date))}
                                    {column.field === "CreditVariance" && VariancePositiveNegative(CalculateGroupTotal("CreditVariance", date), false)}
                                    {column.field === "TotalCashVariance" && VariancePositiveNegative(CalculateGroupTotal("TotalCashVariance", date), false)}
                                    {column.field === "TotalVariance" && VariancePositiveNegative(CalculateGroupTotal("TotalVariance", date) + CalculateGroupTotal("SafeVariance", date), false)}
                                    {column.field === "SafeVariance" && VariancePositiveNegative(CalculateGroupTotal("SafeVariance", date), false)}
                                </strong>
                            </td>
                        ))}
                    </>
                )
            }
        }
    }

    return (
        <div className="flex min-h-screen min-w-fit bg-custom-accent variance-table-page">
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
                <h1 className="text-3xl font-bold">Variance Report for {formData.storeName}</h1>
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
                                min="1900-01-01"
                                max={maxDate}
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
                                min={minDate}
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
                    </div>
                    <div className="mb-4">
                        <DataTable 
                            ref={tableRef}
                            id="varianceTable"
                            value={[...arrVariances, ...emptyRows]} 
                            rows={rowCount}
                            rowsPerPageOptions={[5, 10, 15]}
                            onPage={OnRowChange}
                            first={currentPage * rowCount}
                            size="small"
                            paginator={true}
                            loading={loading}
                            removableSort
                            header={tableHeader}
                            scrollable
                            scrollHeight="50vh"
                            rowGroupMode="subheader"
                            groupRowsBy="Date"
                            rowGroupHeaderTemplate={rowHeader}
                            rowGroupFooterTemplate={rowFooter}
                            emptyMessage="No variances found for the selected register."
                            style={{ width: "75vw", fontSize: ".9rem", backgroundColor: "white" }}
                            exportFilename={GetFileName()}
                        >
                            {/* <Column field="Date" header="Date" sortable body={(rowData) => (
                                <span className={rowData.Date === null ? "invisible-row" : ""}>{FormatDate(rowData.Date)}</span>
                            )}></Column> */}
                            {visibleColumns.map(column => (
                                <Column 
                                    key={column.field}
                                    field={column.field} 
                                    header={column.header} 
                                    style={{ minWidth: "9em" }}
                                    sortable 
                                    body={(rowData) => {
                                        // Check if the date is set to Totals:
                                        if (column.field === "SafeVariance") {
                                            return <span className="invisible-row">-</span>;
                                        }
                                        if (rowData.Date === "Totals:") {
                                            return <span className="invisible-row">-</span>;
                                        }
                                        // Check if the column is a currency column
                                        if (["OpenExpected", "OpenActual", "CloseExpected", "CloseActual", "CashToSafe", "CloseCreditActual", "CloseCreditExpected", "SafeAuditActual", "SafeAuditExpected"].includes(column.field)) {
                                            // Check if the value is null or undefined
                                            if (rowData[column.field] == null) 
                                                return <span className="invisible-row">-</span>; // Display '-' for null or undefined values
                                            else 
                                                return <span>{FormatCurrency(rowData[column.field])}</span>; // Format the currency value
                                        }
                                        // Check if the column is a variance column
                                        else if (["OpenVariance", "CloseVariance", "TotalCashVariance", "CreditVariance", "TotalVariance", "SafeVariance", "SafeAuditVariance"].includes(column.field)) {
                                            // Check if the value is null or undefined
                                            if (rowData[column.field] == null) {
                                                return <span className="invisible-row">-</span>; // Display '-' for null or undefined values
                                            } else {
                                                return <span>{VariancePositiveNegative(rowData[column.field], false)}</span>; // Format the variance value
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
                </div>
            </div>
        </div>
    )
}

export default VarianceTable;