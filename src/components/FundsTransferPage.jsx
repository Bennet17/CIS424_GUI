import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import CurrencyInput from "react-currency-input-field";
import SideBar from "./SideBar";
import HorizontalNav from "./HorizontalNav";
import { useAuth } from "../AuthProvider.js";
import { Toaster, toast } from "sonner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import "primeicons/primeicons.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// USD Icon imports
import BillHundred from "../usd_icons/bills/BillHundred.svg";
import BillFifty from "../usd_icons/bills/BillFifty.svg";
import BillTwenty from "../usd_icons/bills/BillTwenty.svg";
import BillTen from "../usd_icons/bills/BillTen.svg";
import BillFive from "../usd_icons/bills/BillFive.svg";
import BillOne from "../usd_icons/bills/BillOne.svg";
import BillTwo from "../usd_icons/bills/BillTwo.svg";

import CoinOne from "../usd_icons/coins/CoinOne.svg";
import CoinHalf from "../usd_icons/coins/CoinHalf.svg";
import CoinHalfDollar from "../usd_icons/coins/CoinHalf_Dollar.svg";
import CoinQuarter from "../usd_icons/coins/CoinQuarter.svg";
import CoinDime from "../usd_icons/coins/CoinDime.svg";
import CoinNickel from "../usd_icons/coins/CoinNickel.svg";
import CoinPenny from "../usd_icons/coins/CoinPenny.svg";

import RollQuarter from "../usd_icons/rolls/RollQuarter.svg";
import RollDime from "../usd_icons/rolls/RollDime.svg";
import RollNickel from "../usd_icons/rolls/RollNickel.svg";
import RollPenny from "../usd_icons/rolls/RollPenny.svg";

const FundsTransferPage = () => {
  // Authentication context
  const auth = useAuth();

  // Const to hold the POST request fund transfer URL (https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateFundTransfer)
  const FundTransferURL =
    "https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateFundTransfer";

  // Const to hold the form data
  const [formData, setFormData] = useState({
    user: auth.cookie.user.ID,
    name: auth.cookie.user.name,
    store: auth.cookie.user.viewingStoreID,
    storeName: auth.cookie.user.viewingStoreLocation,
    source: "",
    destination: "",
    amount: "",
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
    pennyRoll: 0,
  });

  const [arrSources, setArrSources] = useState([]); // Array to hold the source register names
  const [arrDestinations, setArrDestinations] = useState([]); // Array to hold the destination register names

  const [registerStatus, setRegisterStatus] = useState(""); // Status message to display on page load
  const [report, setReport] = useState(""); // Report message to display after form submission
  const [showReport, setShowReport] = useState(false); // Boolean to show/hide the report message

  const [showExtraChange, setShowExtraChange] = useState(false);

  const tableRef = useRef(null); // Reference to the table element

  // Loads the source options from the store
  useEffect(() => {
    function Initialize() {
      axios
        .get(
          `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStoreObjects?storeID=${formData.store}`
        )
        .then((response) => {
          // Extract register names and ID from the response and filter based on opened status
          const newSources = response.data
            .filter((register) => register.opened)
            .map((register) => ({ id: register.regID, name: register.name }));

          // If there are registers open for transfer, update the source options
          if (newSources.length > 0) {
            // Update the source options
            setArrSources(newSources);
          } else {
            setRegisterStatus("No registers are currently open for transfer.");
            setArrSources([]);
          }
        })
        .catch((error) => {
          console.error(error);
          setArrSources([]);
        });
    }

    Initialize();
  }, [formData.store]);

  // Set the destination options from arrSources
  useEffect(() => {
    setArrDestinations(arrSources);
  }, [arrSources]);

  // Calculate the total amount based on the denomination fields
  const CalculateAmount = (formData) => {
    // Object to hold the denominations and their values.
    const denominations = {
      hundred: 100,
      fifty: 50,
      twenty: 20,
      ten: 10,
      five: 5,
      two: 2,
      one: 1,
      dollarCoin: 1,
      halfDollar: 0.5,
      quarter: 0.25,
      dime: 0.1,
      nickel: 0.05,
      penny: 0.01,
      quarterRoll: 10,
      dimeRoll: 5,
      nickelRoll: 2,
      pennyRoll: 0.5,
    };

    // Variable to hold the total amount
    let total = 0;

    // Calculate the total amount based on the denomination fields by
    // multiplying the count with the value of the denomination
    // and adding it to the total amount.
    for (const [key, value] of Object.entries(formData)) {
      if (denominations[key]) {
        total += value * denominations[key];
      }
    }

    // Update the amount field in the form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      amount: total.toFixed(2),
    }));

    return total;
  };

  // Function to handle changes in the form fields
  const HandleChange = (event) => {
    const { name, value } = event.target;

    if (name === "source" || name === "destination") {
      // Directly use the string value for the source and destination dropdowns
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      // Remove the error class, if any, from the dropdowns
      document
        .getElementById("source_select")
        .classList.remove("select-input-error");
      document
        .getElementById("destination_select")
        .classList.remove("select-input-error");
    } else {
      // For numeric fields, parse the value to a number, defaulting to 0 for non-numeric or negative inputs
      let parsedValue = parseFloat(value);
      if (isNaN(parsedValue) || parsedValue < 0) {
        parsedValue = 0;
        event.target.value = "0"; // Update the input field value to "0"
      }
      // Update the form data for numeric inputs
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: parsedValue,
      }));
      // Calculate the amount based on the denomination fields
      CalculateAmount({
        ...formData,
        [name]: parsedValue,
      });
    }

    // Remove error class when the field is filled for other fields
    if (name !== "source" && name !== "destination" && value !== "")
      event.target.classList.remove("error");
  };

  // Function to filter out non-zero currency fields from the form data and return them
  function FilterDenominations(currencyFields) {
    // Filter out non-zero currency fields by reducing the currencyFields object to a new object
    // only including the non-zero fields. The reduce function iterates through each key-value pair
    // in the currencyFields object and adds the key-value pair to the new object if the value is non-zero.
    let nonZeroCurrencyFields = Object.keys(currencyFields).reduce(
      (acc, key) => {
        if (currencyFields[key] !== 0) acc[key] = currencyFields[key];
        return acc;
      },
      {}
    );

    return nonZeroCurrencyFields;
  }

  // Function to check if any field is invalid
  function CheckFields() {
    // blnError is true if any field is invalid
    let blnError = false;

    // Check if the source and destination are the same
    if (formData.source === formData.destination) {
      // Set the status message
      blnError = true;
      toast.warning("Source and destination cannot be the same.");

      // Highlight the source and destination fields with red border
      document
        .getElementById("source_select")
        .classList.add("select-input-error");
      document
        .getElementById("destination_select")
        .classList.add("select-input-error");
    }

    // Check if any field is empty
    if (
      formData.source === "" ||
      formData.destination === "" ||
      formData.amount === "0.00" ||
      formData.amount === ""
    ) {
      // Set the status message
      blnError = true;
      toast.warning("Please fill in all fields correctly.");

      // Highlight empty fields with red border
      if (formData.source === "")
        document
          .getElementById("source_select")
          .classList.add("select-input-error");

      if (formData.destination === "")
        document
          .getElementById("destination_select")
          .classList.add("select-input-error");

      if (formData.amount === "0.00" || formData.amount === "")
        document
          .getElementById("amount_input")
          .classList.add("amount-input-error");
    }

    // If any field is invalid, return true to stop form submission
    if (blnError) return true;
    else {
      // Remove error class from all fields
      document
        .getElementById("source_select")
        .classList.remove("select-input-error");
      document
        .getElementById("destination_select")
        .classList.remove("select-input-error");
      document
        .getElementById("amount_input")
        .classList.remove("amount-input-error");

      // Return to default class
      document.getElementById("source_select").classList.add("select-input");
      document
        .getElementById("destination_select")
        .classList.add("select-input");
      document.getElementById("amount_input").classList.add("amount-input");

      return false;
    }
  }

  // Const to handle form submission
  const HandleSubmit = async (event) => {
    event.preventDefault();

    // Check if any field is invalid
    if (CheckFields()) return;

    // Destructure the form data by extracting the fields from the form data object
    let {
      user,
      name,
      store,
      storeName,
      source,
      destination,
      amount: fltAmount,
      ...currencyFields
    } = formData;

    // Convert the amount to a float and format it to 2 decimal places
    fltAmount = parseFloat(formData.amount);
    let newCurrencyFields = FilterDenominations(currencyFields);

    // If the destination is BANK, show a confirmation dialog
    if (destination === "BANK") {
      if (
        !window.confirm(
          `You are about to transfer $${fltAmount} to BANK. Are you sure?`
        )
      )
        return;
    }

    // If the amount is greater than or equal to $1000, show a confirmation dialog
    if (fltAmount >= 1000.0) {
      if (
        !window.confirm(
          `You are about transfer $${fltAmount} or more from ${source} to ${destination}. Are you sure?`
        )
      )
        return;
    }

    // Get the source and destination register IDs
    const sourceRegisterID = arrSources.find(
      (register) => register.name === source
    ).id;
    const destinationRegisterID = arrDestinations.find(
      (register) => register.name === destination
    ).id;

    // Calls GetExpectedAmount to get the expected amount in the source and destination registers before transfer
    let expectedSource, expectedDestination;
    expectedSource = parseFloat(
      await GetExpectedAmount(sourceRegisterID)
    ).toFixed(2);
    expectedDestination = parseFloat(
      await GetExpectedAmount(destinationRegisterID)
    ).toFixed(2);

    // Format the expected amount in the source and destination registers before transfer
    const afterTransferSource = NegativeValueParantheses(
      parseFloat(expectedSource) - parseFloat(fltAmount)
    );
    const afterTransferDestination = NegativeValueParantheses(
      parseFloat(expectedDestination) + parseFloat(fltAmount)
    );

    // Submit the transfer
    if (
      await SubmitTransfer(
        event,
        user,
        source,
        destination,
        fltAmount,
        currencyFields // Includes zeroes
      )
    ) {
      // Resets the form fields
      setFormData({
        user: user,
        name: name,
        store: store,
        storeName: storeName,
        source: "",
        destination: "",
        amount: "",
        ...Object.keys(currencyFields).reduce((acc, key) => {
          acc[key] = 0;
          return acc;
        }, {}),
      });

      // Generate the report message
      setReport(
        await GenerateReport(
          source,
          destination,
          expectedSource,
          expectedDestination,
          afterTransferSource,
          afterTransferDestination,
          fltAmount,
          newCurrencyFields
        )
      );

      // Show the report message
      setShowReport(true);

      // Remove error class from all fields
      document
        .getElementById("source_select")
        .classList.remove("select-input-error");
      document
        .getElementById("destination_select")
        .classList.remove("select-input-error");
      document
        .getElementById("amount_input")
        .classList.remove("amount-input-error");
    }
  };

  // Axios post request to submit the transfer
  async function SubmitTransfer(
    event,
    user,
    strSource,
    strDestination,
    fltAmount,
    currencyFields
  ) {
    event.preventDefault();

    try {
      // Request object
      const request = {
        usrID: user,
        storeID: formData.store,
        origin: strSource,
        destination: strDestination,
        total: fltAmount,
        ...currencyFields,
      };

      console.log(request);

      // Submit the form data
      const response = await axios.post(FundTransferURL, request);

      // Check if the transfer was successful
      if (response.data.response === "Fund Transfer created successfully.") {
        toast.success("Successfully submitted transfer!");
        return true;
      } else if (
        response.data.response ===
        "Error in updating safe total: Error: Negative value detected in one or more fields."
      ) {
        toast.error(
          "Failed to submit transfer. Source has insufficient funds."
        );
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "A server error occurred during submission. Please try again later."
      );
      return false;
    }
  }

  // Function to handle form reset
  const HandleCancel = (event) => {
    // Reset the form fields
    setFormData({
      user: auth.cookie.user.ID,
      name: auth.cookie.user.name,
      store: auth.cookie.user.viewingStoreID,
      storeName: auth.cookie.user.viewingStoreLocation,
      source: "",
      destination: "",
      amount: "",
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
      pennyRoll: 0,
    });

    // If all fields are already empty, don't show a toast notification
    if (
      formData.source !== "" ||
      formData.destination !== "" ||
      formData.amount !== ""
    )
      toast.info("Fields have been reset.");

    // Remove error class from all fields
    document
      .getElementById("source_select")
      .classList.remove("select-input-error");
    document
      .getElementById("destination_select")
      .classList.remove("select-input-error");
    document
      .getElementById("amount_input")
      .classList.remove("amount-input-error");

    // Return to default class
    document.getElementById("source_select").classList.add("select-input");
    document.getElementById("destination_select").classList.add("select-input");
    document.getElementById("amount_input").classList.add("amount-input");
  };

  // Function to format negative values in parentheses
  function NegativeValueParantheses(transferValue) {
    if (transferValue < 0) return `($${Math.abs(transferValue)})`;
    else return `$${transferValue}`;
  }

  //toggles the variable that displays the niche changes, such as $2 bills and $1 coins
  function ToggleExtraChange() {
    setShowExtraChange(!showExtraChange);
  }

  // Function to get the expected amount in the source register before transfer with register ID from arrSources
  const GetExpectedAmount = async (registerID) => {
    try {
      // Get the expected amount in the source register before transfer
      const response = await axios.get(
        `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GetOpenCount?storeID=${formData.store}&registerID=${registerID}`
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  // Function to generate the PDF report
  function GeneratePDF() {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Get the table element (Required since by itself the table is not rendered in the DOM)
    const tableRef = document
      .getElementById("report")
      .getElementsByTagName("table")[0];

    // Generate the PDF report
    doc.autoTable({ html: tableRef });

    // Save the PDF report with the store name and current date
    doc.save(
      `${
        formData.storeName
      }_${new Date().toLocaleDateString()}_FundTransfer.pdf`
    );
  }

  // Generate the report message
  const GenerateReport = async (
    strSource,
    strDestination,
    expectedSource,
    expectedDestination,
    afterTransferSource,
    afterTransferDestination,
    fltAmount,
    newCurrencyFields
  ) => {
    // Get the current date and timestamp
    const currentDate = new Date().toLocaleString();

    // Array of denominations
    const denominations = {
      hundred: 100,
      fifty: 50,
      twenty: 20,
      ten: 10,
      five: 5,
      two: 2,
      one: 1,
      dollarCoin: 1,
      halfDollar: 0.5,
      quarter: 0.25,
      dime: 0.1,
      nickel: 0.05,
      penny: 0.01,
      quarterRoll: 10,
      dimeRoll: 5,
      nickelRoll: 2,
      pennyRoll: 0.5,
    };

    // Array to hold the denominations details
    const denominationsDetails = [];
    for (const [key, value] of Object.entries(newCurrencyFields)) {
      if (denominations[key]) {
        denominationsDetails.push({
          denomination: `${value} x ${denominations[key]}`,
        });
      }
    }

    // Report details
    return (
      <div>
        <DataTable
          id="report"
          ref={tableRef}
          value={[
            { field: "Store:", value: formData.storeName },
            { field: "User:", value: `${formData.user} (${formData.name})` },
            { field: "Date:", value: currentDate },
            { field: "Source:", value: strSource },
            { field: "Destination:", value: strDestination },
            { field: "Amount:", value: `$${fltAmount}` },
            {
              field: "Denominations:",
              value: (
                <table>
                  <tbody>
                    {denominationsDetails.map((item, index) => (
                      <tr key={index}>
                        <td>{item.denomination}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ),
            },
            {
              field: `Expected amount in ${strSource} before transfer:`,
              value: `$${expectedSource}`,
            },
            {
              field: `Expected amount in ${strSource} after transfer:`,
              value: afterTransferSource,
            },
            {
              field: `Expected amount in ${strDestination} before transfer:`,
              value: `$${expectedDestination}`,
            },
            {
              field: `Expected amount in ${strDestination} after transfer:`,
              value: afterTransferDestination,
            },
          ]}
          size="small"
          stripedRows
          scrollable
          scrollHeight="50vh"
          style={{ width: "90%", fontSize: ".9rem" }}
        >
          <Column
            field="field"
            header="Fund Transfer Report"
            style={{ width: "70%" }}
          />
          <Column field="value" style={{ width: "30%" }} />
        </DataTable>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-custom-accent">
      <Toaster
        richColors
        position="top-center"
        expand={true}
        duration={5000}
        pauseWhenPageIsHidden={true}
      />
      <SideBar currentPage={3} />
      <div className="flex flex-col w-full">
        <HorizontalNav />
        <div className="text-main-color float-left ml-8 mt-6">
          <h1 className="text-3xl font-bold">
            Transfer Funds for {formData.storeName}
          </h1>
          <br />
          <form onSubmit={HandleSubmit} onReset={HandleCancel}>
            <table>
              <tbody>
                <tr>
                  {/* Source selection */}
                  <td>
                    <div className="label-above-select">
                      <strong>
                        <label htmlFor="source_select">Source: </label>
                      </strong>
                      <select
                        name="source"
                        id="source_select"
                        className="select-input"
                        value={formData.source}
                        onChange={HandleChange}
                      >
                        <option value="">&lt;Please select a source&gt;</option>
                        <option value="BANK">BANK</option>
                        {arrSources.map((register, index) => {
                          return (
                            <option key={register.id} value={register.name}>
                              {register.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </td>

                  {/* Destination selection */}
                  <td>
                    <div className="label-above-select">
                      <strong>
                        <label htmlFor="destination_select" className="">
                          Destination:
                        </label>
                      </strong>
                      <select
                        name="destination"
                        id="destination_select"
                        className="select-input"
                        value={formData.destination}
                        onChange={HandleChange}
                      >
                        <option value="">
                          &lt;Please select a destination&gt;
                        </option>
                        <option value="BANK">BANK</option>
                        {arrDestinations.map((register, index) => {
                          return (
                            <option key={register.id} value={register.name}>
                              {register.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </td>

                  {/* Amount input */}
                  <td>
                    <div className="label-above-select">
                      <strong>
                        <label htmlFor="amount_input">Amount:</label>
                      </strong>
                      <CurrencyInput
                        name="amount"
                        id="amount_input"
                        prefix="$"
                        decimalSeparator="."
                        groupSeparator=","
                        placeholder="$0.00"
                        readOnly={true}
                        className="amount-input"
                        value={formData.amount}
                        onValueChange={(value, name) => {
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            amount: value,
                          }));
                        }}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
              <p className="text-red-500">{registerStatus}</p>
            </div>

            {/* Denominations */}
            <strong>
              <h2 style={{ fontSize: "1.1rem" }}>Denominations:</h2>
            </strong>
            <table>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Bills</th>
                  <th></th>
                  <th>Rolled Coins</th>
                  <th></th>
                  <th>Loose Coins</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* Bills Column */}
                  <td className="flex items-center">
                    <label htmlFor="hundred_input">
                      <img
                        src={BillHundred}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="hundred"
                      id="hundred_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.hundred}
                      onChange={HandleChange}
                      tabIndex={1}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.hundred * 100).toFixed(2)}
                    />
                  </td>
                  {/* Coins column */}
                  <td className="flex items-center">
                    <label htmlFor="quarterRoll_input">
                      <img
                        src={RollQuarter}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="quarterRoll"
                      id="quarterRoll_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.quarterRoll}
                      onChange={HandleChange}
                      tabIndex={7}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.quarterRoll * 10).toFixed(2)}
                    />
                  </td>
                  {/* Loose column */}
                  <td className="flex items-center">
                    <label htmlFor="quarter_input">
                      <img
                        src={CoinQuarter}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="quarter"
                      id="quarter_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.quarter}
                      onChange={HandleChange}
                      tabIndex={13}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.quarter * 0.25).toFixed(2)}
                    />
                  </td>
                </tr>
                <tr>
                  {/* Bills Column */}
                  <td className="flex items-center">
                    <label htmlFor="fifty_input">
                      <img
                        src={BillFifty}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="fifty"
                      id="fifty_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.fifty}
                      onChange={HandleChange}
                      tabIndex={2}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.fifty * 50).toFixed(2)}
                    />
                  </td>
                  {/* Coins column */}
                  <td className="flex items-center">
                    <label htmlFor="dimeRoll_input">
                      <img
                        src={RollDime}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="dimeRoll"
                      id="dimeRoll_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.dimeRoll}
                      onChange={HandleChange}
                      tabIndex={8}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.dimeRoll * 5).toFixed(2)}
                    />
                  </td>
                  {/* Loose Column */}
                  <td className="flex items-center">
                    <label htmlFor="dime_input">
                      <img
                        src={CoinDime}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="dime"
                      id="dime_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.dime}
                      onChange={HandleChange}
                      tabIndex={14}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.dime * 0.1).toFixed(2)}
                    />
                  </td>
                </tr>
                <tr>
                  {/* Bills Column */}
                  <td className="flex items-center">
                    <label htmlFor="twenty_input">
                      <img
                        src={BillTwenty}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="twenty"
                      id="twenty_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.twenty}
                      onChange={HandleChange}
                      tabIndex={3}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.twenty * 20).toFixed(2)}
                    />
                  </td>
                  {/* Coins Column */}
                  <td className="flex items-center">
                    <label htmlFor="nickelRoll_input">
                      <img
                        src={RollNickel}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="nickelRoll"
                      id="nickelRoll_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.nickelRoll}
                      onChange={HandleChange}
                      tabIndex={9}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.nickelRoll * 2).toFixed(2)}
                    />
                  </td>
                  {/* Loose Column */}
                  <td className="flex items-center">
                    <label htmlFor="nickel_input">
                      <img
                        src={CoinNickel}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="nickel"
                      id="nickel_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.nickel}
                      onChange={HandleChange}
                      tabIndex={15}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.nickel * 0.05).toFixed(2)}
                    />
                  </td>
                </tr>
                <tr>
                  {/* Bills Column */}
                  <td className="flex items-center">
                    <label htmlFor="ten_input">
                      <img
                        src={BillTen}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="ten"
                      id="ten_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.ten}
                      onChange={HandleChange}
                      tabIndex={4}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.ten * 10).toFixed(2)}
                    />
                  </td>
                  {/* Coins Column */}
                  <td className="flex items-center">
                    <label htmlFor="pennyRoll_input">
                      <img
                        src={RollPenny}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="pennyRoll"
                      id="pennyRoll_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.pennyRoll}
                      onChange={HandleChange}
                      tabIndex={10}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.pennyRoll * 0.5).toFixed(2)}
                    />
                  </td>
                  {/* Loose Column */}
                  <td className="flex items-center">
                    <label htmlFor="penny_input">
                      <img
                        src={CoinPenny}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="penny"
                      id="penny_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.penny}
                      onChange={HandleChange}
                      tabIndex={16}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.penny * 0.01).toFixed(2)}
                    />
                  </td>
                </tr>
                <tr>
                  {/* Bills Column */}
                  <td className="flex items-center">
                    <label htmlFor="five_input">
                      <img
                        src={BillFive}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="five"
                      id="five_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.five}
                      onChange={HandleChange}
                      tabIndex={5}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.five * 5).toFixed(2)}
                    />
                  </td>
                  {/* Extras Column */}
                  {showExtraChange == true && (
                    <>
                      <td className="flex items-center">
                        <label htmlFor="oneCoin_input">
                          <img
                            src={CoinOne}
                            className="inline-block align-middle w-12 h-12"
                          />
                        </label>
                        <input
                          type="number"
                          name="dollarCoin"
                          id="oneCoin_input"
                          step={1}
                          min={0}
                          className="denomination-input"
                          value={formData.dollarCoin}
                          onChange={HandleChange}
                          tabIndex={12}
                        />
                      </td>
                      <td>
                        <CurrencyInput
                          prefix="$"
                          decimalSeparator="."
                          groupSeparator=","
                          placeholder="0.00"
                          readOnly={true}
                          className="denomination"
                          value={(formData.dollarCoin * 1).toFixed(2)}
                        />
                      </td>
                      <td className="flex items-center">
                        <label htmlFor="">
                          <img
                            src={BillTwo}
                            className="inline-block align-middle w-12 h-12"
                          />
                        </label>
                        <input
                          type="number"
                          name="two"
                          id="two_input"
                          step={1}
                          min={0}
                          className="denomination-input"
                          value={formData.two}
                          onChange={HandleChange}
                          tabIndex={17}
                        />
                      </td>
                      <td>
                        <CurrencyInput
                          prefix="$"
                          decimalSeparator="."
                          groupSeparator=","
                          placeholder="0.00"
                          readOnly={true}
                          className="denomination"
                          value={(formData.two * 2).toFixed(2)}
                        />
                      </td>
                    </>
                  )}
                </tr>
                <tr>
                  {/* Bills Column */}
                  <td className="flex items-center">
                    <label htmlFor="one_input">
                      <img
                        src={BillOne}
                        className="inline-block align-middle w-12 h-12"
                      />
                    </label>
                    <input
                      type="number"
                      name="one"
                      id="one_input"
                      step={1}
                      min={0}
                      className="denomination-input"
                      value={formData.one}
                      onChange={HandleChange}
                      tabIndex={6}
                    />
                  </td>
                  <td>
                    <CurrencyInput
                      prefix="$"
                      decimalSeparator="."
                      groupSeparator=","
                      placeholder="0.00"
                      readOnly={true}
                      className="denomination"
                      value={(formData.one * 1).toFixed(2)}
                    />
                  </td>
                  {/* Extras Column */}
                  {showExtraChange == true && (
                    <>
                      <td className="flex items-center">
                        <label htmlFor="halfDollar_input">
                          <img
                            src={CoinHalf}
                            className="inline-block align-middle w-12 h-12"
                          />
                        </label>
                        <input
                          type="number"
                          name="halfDollar"
                          id="halfDollar_input"
                          step={1}
                          min={0}
                          className="denomination-input"
                          value={formData.halfDollar}
                          onChange={HandleChange}
                          tabIndex={12}
                        />
                      </td>
                      <td>
                        <CurrencyInput
                          prefix="$"
                          decimalSeparator="."
                          groupSeparator=","
                          placeholder="0.00"
                          readOnly={true}
                          className="denomination"
                          value={(formData.halfDollar * 0.5).toFixed(2)}
                        />
                      </td>
                    </>
                  )}
                </tr>
              </tbody>
            </table>
            <br />
            <div>
              <Button
                type="reset"
                label="Cancel"
                size="small"
                icon="pi pi-times"
                rounded
                className="p-button-secondary"
                style={{ width: "200px", marginRight: "1rem" }}
              />
              <Button
                type="submit"
                label="Submit"
                className="p-button-primary"
                size="small"
                icon="pi pi-check"
                rounded
                style={{ width: "200px", marginRight: "1rem" }}
              />
            </div>
            <br />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
              className="mb-4"
            >
              <ToggleButton
                checked={showExtraChange}
                onChange={ToggleExtraChange}
                onIcon="pi pi-eye"
                offIcon="pi pi-eye-slash"
                onLabel="Hide extras"
                offLabel="Show Extras"
              />
              <Button
                type="button"
                label="View Last Transaction"
                size="small"
                icon="pi pi-file"
                rounded
                disabled={report === ""}
                onClick={() => setShowReport(!showReport)}
                className="p-button-primary"
                style={{
                  width: "245px",
                  marginLeft: "1rem",
                  position: "absolute",
                  left: "155px",
                }}
              />
            </div>
          </form>

          {/* Shows report with successful submissions */}
          {showReport && (
            <div className="report-overlay">
              <div className="report-container">
                {report}
                <br />
                <Button
                  label="Close Report"
                  size="small"
                  icon="pi pi-times"
                  rounded
                  onClick={() => setShowReport(false)}
                  className="p-button-secondary"
                />
                <Button
                  label="Download PDF"
                  size="small"
                  icon="pi pi-download"
                  rounded
                  onClick={() => GeneratePDF(report.props.value)}
                  className="p-button-primary"
                  style={{ marginLeft: "1rem" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundsTransferPage;
