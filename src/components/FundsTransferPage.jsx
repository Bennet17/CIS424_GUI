import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState} from 'react';
import { formatValue } from "react-currency-input-field";
import Navbar from './Navbar';
import HorizontalNav from "./HorizontalNav";

const FundsTransferPage = () =>{
    // Arrays to hold the source and destination options
    let arrSources = ["POS1", "POS2", "POS3", "Safe", "Bank"];
    let arrDestinations = ["POS1", "POS2", "POS3", "Safe", "Bank"];
    
    // Const to hold the form data
    const [formData, setFormData] = useState({
        user: 0,
        strSource: '',
        strDestination: '',
        fltAmount: '',
        hundred: 0,
        fifty: 0,
        twenty: 0,
        ten: 0,
        five: 0,
        two: 0,
        one: 0,
        dollarCoin: 0,
        halfDollar: 0,
        quarter: 0,
        dime: 0,
        nickel: 0,
        penny: 0,
        quarterRoll: 0,
        dimeRoll: 0,
        nickelRoll: 0,
        pennyRoll: 0
    });

    const [status, setStatus] = useState("");   // Status message to display after form submission
    const [report, setReport] = useState("");   // Report message to display after form submission
    const successClass = "text-green-500";      // CSS class for success
    const errorClass = "text-red-500";          // CSS class for error
    
    const [showExtraChange, setShowExtraChange] = useState(false);
    const [showExtraChangeTxt, setShowExtraChangeTxt] = useState("+ Show extras");

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

    // Function to filter out non-zero currency fields from the form data and return them
    function FilterDenominations(currencyFields) {
        // Filter out non-zero currency fields
        let nonZeroCurrencyFields = Object.keys(currencyFields).reduce((acc, key) => {
            if (currencyFields[key] !== 0) acc[key] = currencyFields[key];
                return acc;
        }, {});

        return nonZeroCurrencyFields;
    }

    // Function to check if any field is invalid
    function CheckFields() {
        // blnError is true if any field is invalid
        let blnError = false;

        // Check if the source and destination are the same
        if (formData.strSource === formData.strDestination) {
            // Set the status message
            blnError = true;
            setStatus("Source and destination cannot be the same.");

            // Highlight the source and destination fields with red border
            document.getElementById("source_select").classList.add("error");
            document.getElementById("destination_select").classList.add("error");
        }

        // Check if any field is empty
        if (formData.strSource === "" || formData.strDestination === "" || formData.fltAmount === "") {
            // Set the status message
            blnError = true;
            setStatus("Please fill in all fields correctly.");

            // Highlight empty fields with red border
            if (formData.strSource === "") {
                document.getElementById("source_select").classList.add("error");
            }
            if (formData.strDestination === "") {
                document.getElementById("destination_select").classList.add("error");
            }
            if (formData.fltAmount === "") {
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

    // Const to handle form submission
    const HandleSubmit = (event) => {
        event.preventDefault();

        // Check if any field is invalid
        if (CheckFields()) {
            return;
        }

        // Stores the form data in the variables
        let { user, strSource, strDestination, fltAmount, ...currencyFields } = formData;
        fltAmount = parseFloat(formData.fltAmount).toFixed(2);
        let newCurrencyFields = FilterDenominations(currencyFields);

        // If the amount is >= $1000, display a 'Are you sure?' warning message
        if (fltAmount >= 1000.00) {
            if (!window.confirm(`You are about transfer $${fltAmount} or more from ${strSource} to ${strDestination}. Are you sure?`)) {
                return;
            }
        }

        // Submit the form data
        SubmitTransfer(event, user, strSource, strDestination, fltAmount, newCurrencyFields);

        // Reset the form fields
        setFormData({
            user: 0,
            strSource: '',
            strDestination: '',
            fltAmount: '',
            ...Object.keys(currencyFields).reduce((acc, key) => {
                acc[key] = 0;
                return acc;
            }, {})
        });

        // Set the status message
        setStatus("Successfully submitted transfer!");

        // Generate the report
        const reportText = GenerateReport(user, strSource, strDestination, fltAmount, newCurrencyFields);
        setReport(reportText);
    };

    // Axios post request to submit the transfer
    function SubmitTransfer(event, user, strSource, strDestination, fltAmount, newCurrencyFields) {
        event.preventDefault();

        // Request object
        const request = {
            usrID: user,
            origin: strSource,
            destination: strDestination,
            total: fltAmount,
            ...newCurrencyFields
        }
    
        // Submit the form data
        axios.post('', request).then(response => {
            console.log(response);

            // Check if the transfer was successful
            if (response.data.IsValid == true) 
                console.log("Success");
            else 
                console.log("Error");
        })
        .catch(error => {
            console.error(error);
        });
    }

    //toggles the variable that displays the niche changes, such as $2 bills and $1 coins
    //(also change arrow text thing)
    function ToggleExtraChange(){
        setShowExtraChange(!showExtraChange);
        if (!showExtraChange){
            setShowExtraChangeTxt("- Hide extras");
        }else{
            setShowExtraChangeTxt("+ Show extras");
        }
    }

    // Generate the report message
    const GenerateReport = (user, strSource, strDestination, fltAmount, newCurrencyFields) => {
        // Get the current date and user details
        const currentDate = new Date().toLocaleDateString();

        let arrCurrencies = ["100", "50", "20", "10", "5", "2", "1", "1 coin", "0.5 coin", "0.25", "0.1", "0.05", "0.01"];

        // Prepare the denominations details
        let denominationsDetails = '';
        if (newCurrencyFields) {
            denominationsDetails = Object.entries(newCurrencyFields)
                .map(([denominations, count], index) => {
                    const currencyName = arrCurrencies[index];
                    return `${count} x $${currencyName}`;
                }).join('\n' + ' '.repeat(27));
        }

        // Report details
        const transferDetails = `
            Transfer of Funds Report

            User Details:
            User: ${user}
            Date: ${currentDate}

            Transfer Details:
            Source: ${strSource}
            Destination: ${strDestination}
            Amount: $${formatValue({ 
                value: fltAmount, 
                groupSeparator: ",", 
                decimalSeparator: "."})}
            Denominations: ${denominationsDetails}

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
            <Navbar />
            <HorizontalNav />
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
                                        name="strSource"
                                        id="source_select"
                                        className="box-border border-border-color border-2 hover:bg-nav-bg bg-white mb-4 ml-2 mr-10 w-50"
                                        value={formData.strSource}
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
                                        name="strDestination"
                                        id="destination_select"
                                        className="box-border border-border-color border-2 hover:bg-nav-bg bg-white mb-4 ml-2 mr-10 w-50"
                                        value={formData.strDestination}
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
                                        <label htmlFor="amount_input">Amount: $</label>
                                    </strong>
                                    <input
                                        type="number"
                                        name="fltAmount"
                                        id="amount_input"
                                        placeholder="0.00"
                                        step={0.01}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white"
                                        value={formData.fltAmount}
                                        onChange={HandleChange}
                                    />
                                </td>
                            </tr>

                            {/* Denominations */}
                            <tr>
                                <td>
                                    <label htmlFor="penny_input">Pennies</label>
                                    <input 
                                        type="number"
                                        name="penny"
                                        id="penny_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.penny}
                                        onChange={HandleChange}
                                    />
                                </td>
                                <td>
                                    <label htmlFor="one_input">$1's</label>
                                    <input 
                                        type="number"
                                        name="one"
                                        id="one_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.one}
                                        onChange={HandleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="nickel_input">Nickels</label>
                                    <input 
                                        type="number"
                                        name="nickel"
                                        id="nickel_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.nickel}
                                        onChange={HandleChange}
                                    />
                                </td>
                                <td>
                                    <label htmlFor="five_input">$5's</label>
                                    <input 
                                        type="number"
                                        name="five"
                                        id="five_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.five}
                                        onChange={HandleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="dime_input">Dimes</label>
                                    <input 
                                        type="number"
                                        name="dime"
                                        id="dime_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.dime}
                                        onChange={HandleChange}
                                    />
                                </td>
                                <td>
                                    <label htmlFor="ten_input">$10's</label>
                                    <input 
                                        type="number"
                                        name="ten"
                                        id="ten_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.ten}
                                        onChange={HandleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="quarter_input">Quarters</label>
                                    <input 
                                        type="number"
                                        name="quarter"
                                        id="quarter_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.quarter}
                                        onChange={HandleChange}
                                    />
                                </td>
                                <td>
                                    <label htmlFor="twenty_input">$20's</label>
                                    <input 
                                        type="number"
                                        name="twenty"
                                        id="twenty_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.twenty}
                                        onChange={HandleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="pennyRoll_input">Pennies (rolled)</label>
                                    <input 
                                        type="number"
                                        name="pennyRoll"
                                        id="pennyRoll_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.pennyRoll}
                                        onChange={HandleChange}
                                    />
                                </td>
                                <td>
                                    <label htmlFor="fifty_input">$50's</label>
                                    <input 
                                        type="number"
                                        name="fifty"
                                        id="fifty_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.fifty}
                                        onChange={HandleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="nickelRoll_input">Nickels (rolled)</label>
                                    <input 
                                        type="number"
                                        name="nickelRoll"
                                        id="nickelRoll_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.nickelRoll}
                                        onChange={HandleChange}
                                    />
                                </td>
                                <td>
                                    <label htmlFor="hundred_input">$100's</label>
                                    <input 
                                        type="number"
                                        name="hundred"
                                        id="hundred_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.hundred}
                                        onChange={HandleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="dimeRoll_input">Dimes (rolled)</label>
                                    <input
                                        type="number"   
                                        name="dimeRoll"
                                        id="dimeRoll_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white"
                                        value={formData.dimeRoll}
                                        onChange={HandleChange}
                                    />
                                </td>
                                <td>
                                    <label htmlFor="quarterRoll_input">Quarters (rolled)</label>
                                    <input
                                        type="number"
                                        name="quarterRoll"
                                        id="quarterRoll_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white"
                                        value={formData.quarterRoll}
                                        onChange={HandleChange}
                                    />
                                </td>
                            </tr>
                            {showExtraChange == true &&<tr>
                                <td>
                                    <label htmlFor="oneCoin_input">$1 coin</label>
                                    <input 
                                        type="number"
                                        name="oneCoin"
                                        id="oneCoin_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.dollarCoin}
                                        onChange={HandleChange}
                                    />
                                </td>
                                <td>
                                    <label htmlFor="">$2's</label>
                                    <input 
                                        type="number"
                                        name="two"
                                        id="two_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.two}
                                        onChange={HandleChange}
                                    />
                                </td>
                            </tr>}
                            {showExtraChange == true &&<tr>
                                <td>
                                    <label htmlFor="halfDollar_input">$1/2 coin</label>
                                    <input 
                                        type="number"
                                        name="halfDollar"
                                        id="halfDollar_input"
                                        step={1}
                                        min={0}
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                        value={formData.halfDollar}
                                        onChange={HandleChange}
                                    />
                                </td>
                                <td>
                                </td>
                            </tr>}
                            <tr>
                                <td colSpan="2"><p className="cursor-pointer w-full mb-4 text-center hover:bg-nav-bg bg-white text-xl" onClick={ToggleExtraChange}>{showExtraChangeTxt}</p></td>
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