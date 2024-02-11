import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState} from 'react';
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import HomePage from './HomePage';

const FundsTransferPage = () =>{
    // Arrays to hold the source and destination options
    let arrSources = ["POS1", "POS2", "POS3", "Safe", "Bank"];
    let arrDestinations = ["POS1", "POS2", "POS3", "Safe", "Bank"];
    
    // Const to hold the form data
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        amount: ''
    });

    // Mask options for the amount input
    const maskOptions = {
        prefix: '$',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: 9,
        allowNegative: false,
        allowLeadingZeroes: false
    }

    const [status, setStatus] = useState("");   // Status message to display after form submission
    const [report, setReport] = useState("");   // Report message to display after form submission
    const successClass = "text-green-500";      // CSS class for success
    const errorClass = "text-red-500";          // CSS class for error

    // Function to handle changes in the form fields
    const HandleChange = (event) => {
        // Get the field name and value
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Remove error class when the field is filled for empty fields
        if (value !== "") {
            event.target.classList.remove("error");
        }

        // If the source or destination field is changed, remove the error class from both
        if (name === "source" || name === "destination") {
            const otherField = name === "source" ? "destination" : "source";
            const otherValue = formData[otherField];
            
            // If the other field is already filled and does not match the current field, remove the error class from both
            if (value !== otherValue && otherValue !== "") {
                document.getElementById("source_select").classList.remove("error");
                document.getElementById("destination_select").classList.remove("error");
            }
        }
    };

    // Function to handle form submission
    const HandleSubmit = (event) => {
        event.preventDefault();

        // Declares the source, destination, and amount variables to store the form data
        let strSource = '';
        let strDestination = '';
        let fltAmount = 0;

        // Check if any field is invalid
        if (CheckFields()) {
            return;
        }

        // Stores the form data in the variables
        strSource = formData.source;
        strDestination = formData.destination;
        
        // Remove the dollar sign and commas from the amount and add decimal point if not present
        fltAmount = parseFloat(formData.amount.replace(/[$,]/g, ''));
        if (fltAmount % 1 === 0) {
            fltAmount = fltAmount.toFixed(2);
        }

        // Submit the form data
        SubmitTransfer(event, strSource, strDestination, fltAmount);

        // Reset the form fields
        setFormData({
            source: '',
            destination: '',
            amount: ''
        });

        // Set the status message
        setStatus("Successfully submitted transfer!");

        // Generate the report
        const reportText = GenerateReport(strSource, strDestination, fltAmount);
        setReport(reportText);
    };

    function CheckFields() {
        // blnError is true if any field is invalid
        let blnError = false;

        // Check if the source and destination are the same
        if (formData.source === formData.destination) {
            // Set the status message
            blnError = true;
            setStatus("Source and destination cannot be the same.");

            // Highlight the source and destination fields with red border
            document.getElementById("source_select").classList.add("error");
            document.getElementById("destination_select").classList.add("error");
        }

        // Check if any field is empty
        if (formData.source === "" || formData.destination === "" || formData.amount === "") {
            // Set the status message
            blnError = true;
            setStatus("Please fill in all fields correctly.");

            // Highlight empty fields with red border
            if (formData.source === "") {
                document.getElementById("source_select").classList.add("error");
            }
            if (formData.destination === "") {
                document.getElementById("destination_select").classList.add("error");
            }
            if (formData.amount === "") {
                document.getElementById("amount_input").classList.add("error");
            }
        }

        // If any field is invalid, return true to stop form submission
        if (blnError) {
            return true;
        }

        // If no field is invalid, return false to submit the form
        return false;
    }

    // Axios post request to submit the transfer
    function SubmitTransfer(event, strSource, strDestination, fltAmount) {
        event.preventDefault();
    
        // Submit the form data
        axios.post('', {
            source: strSource,
            destination: strDestination,
            amount: fltAmount
        })
        .then(response => {
          console.log(response);

          // Check if the transfer was successful
          if (response.data.IsValid == true) {
            console.log("Success");
          }
          else {
            console.log("Error");
          }
        })
        .catch(error => {
          console.error(error);
        });
    }

    // Generate the report message
    const GenerateReport = (strSource, strDestination, fltAmount) => {
        // Get the current date and user details
        const currentDate = new Date().toLocaleDateString();
        const userDetails = "User: John"; // Replace with actual user details from the session

        // Report details
        const transferDetails = `
            Transfer of Funds Report

            User Details:
            User: ${userDetails}
            Date: ${currentDate}

            Transfer Details:
            Source: ${strSource}
            Destination: ${strDestination}
            Amount: $${fltAmount}

            Source Details:
            Expected Amount in ${strSource} before transfer: <Amount here>
            Expected Amount in ${strSource} after transfer: <Amount here>
            Actual Amount in ${strSource} after transfer: <Amount here>

            Destination Details:
            Expected Amount in ${strDestination} before transfer: <Amount here>
            Expected Amount in ${strDestination} after transfer: <Amount here>
            Actual Amount in ${strDestination} after transfer: <Amount here>
        `;
        return transferDetails;
    };

    // Determine the class based on the status
    const statusClass = status.startsWith("Successfully") ? successClass : errorClass;

    return (
        <div>
            <HomePage />
            <div className="text-main-color float-left ml-8 mt-32">
                <form onSubmit={HandleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                {/* Source selection */}
                                <td>
                                    <strong>
                                        <label htmlFor="source_select">Source: </label>
                                    </strong>
                                    <select
                                        name="source"
                                        id="source_select"
                                        className="box-border border-border-color border-2 hover:bg-nav-bg bg-white mb-4 ml-2 mr-10 w-50"
                                        value={formData.source}
                                        onChange={HandleChange}
                                    >
                                        <option value="">&lt;Please select a source&gt;</option>
                                        {arrSources.map((item, index) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >{item}</option>
                                        ))}
                                    </select>
                                </td>

                                {/* Destination selection */}
                                <td>
                                    <strong>
                                        <label htmlFor="destination_select" className="">Destination: </label>
                                    </strong>
                                    <select
                                        name="destination"
                                        id="destination_select"
                                        className="box-border border-border-color border-2 hover:bg-nav-bg bg-white mb-4 ml-2 mr-10 w-50"
                                        value={formData.destination}
                                        onChange={HandleChange}
                                    >
                                        <option value="">&lt;Please select a destination&gt;</option>
                                        {arrDestinations.map((item, index) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >{item}</option>
                                        ))}
                                    </select>
                                </td>

                                {/* Amount input */}
                                <td>
                                    <strong>
                                        <label htmlFor="amount_input">Amount: </label>
                                    </strong>
                                    <MaskedInput
                                        mask={createNumberMask(maskOptions)}
                                        placeholder="$0.00"
                                        id="amount_input"
                                        name="amount"
                                        className="box-border border-border-color border-2 hover:bg-nav-bg bg-white mb-4 ml-2 mr-10 w-22"
                                        value={formData.amount}
                                        onChange={HandleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button type="reset" className="bg-main-color hover:bg-hover-color text-white font-bold py-2 px-10 rounded mt-4 ml-6 ">Cancel</button>
                                    <button type="submit" className="bg-main-color hover:bg-hover-color text-white font-bold py-2 px-10 rounded mt-4 ml-6 ">Submit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>

                {/* Shows submission status */}
                <p className={`mt-4 ml-6 ${statusClass}`}>
                    {status}
                </p>

                {/* Shows report with successful submissions */}
                {report && (
                    <div className="report">
                        <pre>{report}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FundsTransferPage;