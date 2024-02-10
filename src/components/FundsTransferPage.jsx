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

    const [status, setStatus] = useState("");
    const [report, setReport] = useState("");
    const successClass = "text-green-500";
    const errorClass = "text-red-500";

    // Function to handle changes in the form fields
    const HandleChange = (event) => {
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
        let blnError = false;


        // Check if the source and destination are the same
        if (formData.source === formData.destination) {
            blnError = true;
            setStatus("Source and destination cannot be the same.");

            document.getElementById("source_select").classList.add("error");
            document.getElementById("destination_select").classList.add("error");
        }

        // Check if any field is empty
        if (formData.source === "" || formData.destination === "" || formData.amount === "") {
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

        // If any field is empty, return without submitting the form
        if (blnError) {
            return;
        }

        // Otherwise, proceed with form submission
        // Reset the form fields
        setFormData({
            source: '',
            destination: '',
            amount: ''
        });

        // Set the status message
        setStatus("Successfully submitted transfer!");

        // Generate the report
        const reportText = GenerateReport();
        setReport(reportText);
    };

    // Generate the report message
    const GenerateReport = () => {
        const currentDate = new Date().toLocaleDateString();
        const userDetails = "User: John";
        const transferDetails = `
            Transfer of Funds Report
            User Details:
            ${userDetails}
            Date: ${currentDate}

            Transfer Details:
            Source: ${formData.source}
            Destination: ${formData.destination}
            Amount: ${formData.amount}

            Source Details:
            Expected Amount in ${formData.source} before transfer: <Amount here>
            Expected Amount in ${formData.source} after transfer: <Amount here>
            Actual Amount in ${formData.source} after transfer: <Amount here>

            Destination Details:
            Expected Amount in ${formData.destination} before transfer: <Amount here>
            Expected Amount in ${formData.destination} after transfer: <Amount here>
            Actual Amount in ${formData.destination} after transfer: <Amount here>
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
                <p className={`mt-4 ml-6 ${statusClass}`}>
                    {status}
                </p>
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