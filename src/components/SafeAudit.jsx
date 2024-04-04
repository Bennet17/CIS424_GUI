import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import SideBar from "./SideBar";
import HorizontalNav from "./HorizontalNav";
import { useAuth } from "../AuthProvider.js";
import { Toaster, toast } from 'sonner';
import { Button } from "primereact/button";
import { ToggleButton } from 'primereact/togglebutton';
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import 'primeicons/primeicons.css';

const SafeAuditPage = () => {
    // Authentication context
    const auth = useAuth();

	// Const for POST CreateCashCount request (https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateCashCount)
	const CreateCashCountURL = "https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateCashCount";

	// Const to hold the form data
    const [formData, setFormData] = useState({
        user: auth.cookie.user.ID,
        name: auth.cookie.user.name,
        store: auth.cookie.user.viewingStoreID,
        storeName: auth.cookie.user.viewingStoreLocation,
        currentAmount: "",
		expectedAmount: 0,
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
		expectedHundred: 0,
		expectedFifty: 0,
		expectedTwenty: 0,
		expectedTen: 0,
		expectedFive: 0,
		expectedTwo: 0,
		expectedOne: 0,
		expectedDollarCoin: 0,
		expectedHalfDollar: 0,
		expectedQuarter: 0,
		expectedDime: 0,
		expectedNickel: 0,
		expectedPenny: 0,
		expectedQuarterRoll: 0,
		expectedDimeRoll: 0,
		expectedNickelRoll: 0,
		expectedPennyRoll: 0,
    });

	// Safe open/close status
	const [safeStatus, setSafeStatus] = useState(false);

    const [showExtraChange, setShowExtraChange] = useState(false);
    const [showExtraChangeTxt, setShowExtraChangeTxt] = useState("▼ Show extras");

	// Loads expected count on page load
	useEffect(() => {
		function GetExpectedSafeCount() {
			axios.get(
				`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStoreObjects?storeID=${formData.store}`
			)
			.then((response) => {
				// Get the safe ID from the response based on the name property
				const safeObject = response.data.find((obj) => obj.name === "SAFE");
				if (safeObject) {
					setSafeStatus(safeObject.opened)
					if (safeObject.opened === true) {
						axios.get(
							`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GetCloseCount?storeID=${formData.store}`
						)
						.then((response) => {
							// Update the expected amount in the form data
							setFormData((prevFormData) => ({
								...prevFormData,
								expectedAmount: response.data,
							}));
						})
						.catch((error) => {
							console.log(error);
						});
					}
					else {
						// Display a warning message if the safe is not open
						toast.warning("Safe is not open. Expected amount cannot be retrieved.");
					}
				} else {
					toast.warning("Safe not found.");
				}
			})
			.catch((error) => {
				console.log(error);
			});
		}

		GetExpectedSafeCount();
	}, []);

	// Function to check if amount fields are empty
	function CheckFields() {
		// Check if safe status is false
		if (safeStatus === false) {
			toast.warning("Safe is not open. Please open the safe to count the amount.");
			return true;
		}
		else if (formData.currentAmount === "" || formData.currentAmount === 0) {
			// Update the status message
            toast.warning("Please fill in all fields correctly.");

			// Adds error class to fields
			document.getElementById("currentAmount_input").classList.add("safe-amount-input-error");

			// Return true to prevent form submission
			return true;
		}
		else {
			// Removes error class from fields
			document.getElementById("currentAmount_input").classList.remove("safe-amount-input-error");

			// Return to default class
			document.getElementById("currentAmount_input").classList.add("safe-amount-input");

			// Return false to allow form submission
			return false;
		}
	}

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
            currentAmount: total.toFixed(2),
        }));

        return total;
    };

	// Function to handle changes in the form fields
    const HandleChange = (event) => {
        // Get the field name and value
        const { name, value } = event.target;

		// Removes error class from fields
		document.getElementById("currentAmount_input").classList.remove("safe-amount-input-error");

        // Parse the value to a float or default to 0 if not a valid number
		const parsedValue = parseFloat(value) || 0;

		// Update the form data
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: parsedValue,
		}));

		// Calculate the amount based on the denomination fields
		CalculateAmount({
			...formData,
			[name]: parsedValue,
		});
    };

	// Function to submit the cash count to the server
	function SubmitCashCount(
		event,
		user,
		currentAmount,
		expectedAmount,
		currencyFields
	) {
		event.preventDefault();

		// Create the cash count object and ignores expected denominations
		const request = {
			usrID: user,
			storeID: formData.store,
			itemCounted: "SAFE",
			amountExpected: parseFloat(expectedAmount),
			total: parseFloat(currentAmount),
			type: "MID",
			...currencyFields,
		};

		console.log(request);

		// POST the cash count to the server
		axios.post(CreateCashCountURL, request).then((response) => {
			console.log(response);

			 // Check if the count was successful
			if (response.status == 200)
				toast.success("Safe count submitted successfully.");
			else 
				toast.error("Failed to submit safe count.");
		})
		.catch((error) => {
			console.error(error);
			toast.error("A server error occurred during submission. Please try again later.");
		});
	}

	// Function to handle the form submission
	const HandleSubmit = async (event) => {
		event.preventDefault();

        // Check if any field is invalid
        if (CheckFields())
            return;

		// Provides alert if actual amount is less than expected amount by more than two and if they want to proceed
		if (parseFloat(formData.currentAmount) < parseFloat(formData.expectedAmount) - 2) {
			if (!window.confirm("The actual amount is less than the expected amount. Do you want to proceed?"))
				return;
		}

		// Provides alert if actual amount is more than expected amount by more than two and if they want to proceed
		if (parseFloat(formData.currentAmount) > parseFloat(formData.expectedAmount) + 2) {
			if (!window.confirm("The actual amount is more than the expected amount. Do you want to proceed?"))
				return;
		}

		let {
			user,
			name,
			store,
			currentAmount: fltCurrentAmount,
			expectedAmount: fltExpectedAmount,
			storeName
		} = formData;

		// Stores form data to be passed to SubmitCashCount, ignore all other expected denominations (expectedHundred, expectedFifty, etc.)
		const currencyFields = {
			hundred: formData.hundred,
			fifty: formData.fifty,
			twenty: formData.twenty,
			ten: formData.ten,
			five: formData.five,
			two: formData.two,
			one: formData.one,
			dollarCoin: formData.dollarCoin,
			halfDollar: formData.halfDollar,
			quarter: formData.quarter,
			dime: formData.dime,
			nickel: formData.nickel,
			penny: formData.penny,
			quarterRoll: formData.quarterRoll,
			dimeRoll: formData.dimeRoll,
			nickelRoll: formData.nickelRoll,
			pennyRoll: formData.pennyRoll,
		};

		// Parse the form data to floats
		fltCurrentAmount = parseFloat(formData.currentAmount);
		fltExpectedAmount = parseFloat(formData.expectedAmount);

		// Submit the cash count
		SubmitCashCount(
			event,
			user,
			fltCurrentAmount,
			fltExpectedAmount,
			currencyFields
		);
	}

	// Function to handle the cancel button and resets the form data
	const HandleCancel = (event) => {
		event.preventDefault();

		// Reset the form data
		setFormData({
			user: auth.cookie.user.ID,
			name: auth.cookie.user.name,
			store: auth.cookie.user.viewingStoreID,
			storeName: auth.cookie.user.viewingStoreLocation,
			currentAmount: "",
			expectedAmount: formData.expectedAmount,
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

		if (formData.currentAmount !== "") 
			toast.info("Fields have been reset.");
	}

	//toggles the variable that displays the niche changes, such as $2 bills and $1 coins
    function ToggleExtraChange() {
        setShowExtraChange(!showExtraChange);
    }

	return (
		<div className="flex min-h-screen bg-custom-accent">
			<Toaster 
				richColors 
                position="top-center"
				expand={true}
				duration={5000}
				pauseWhenPageIsHidden={true}
			/>
			<SideBar currentPage={4} />
			<div className="flex flex-col w-full">
				<HorizontalNav />
				<div className="text-main-color float-left ml-8 mt-6">
					<h1 className="text-3xl font-bold">Safe Audit for {formData.storeName}</h1>
					{/* Current Amount input */}
					<div className="mt-5">
						<table>
							<tbody>
								<tr>
									<td>
										{/* Expected Amount */}
										<div className="label-above-select">
											<strong>
												<label htmlFor="expectedAmount_input">Expected Safe Total:</label>
											</strong>
											<CurrencyInput
												name="expectedAmount"
												id="expectedAmount_input"
												prefix="$"
												decimalSeparator="."
												groupSeparator=","
												placeholder="$0.00"
												readOnly={true}
												className="text-2xl safe-amount-input"
												value={parseFloat(formData.expectedAmount).toFixed(2)}
												onValueChange={(value, name) => {
													setFormData((prevFormData) => ({
														...prevFormData,
														expectedAmount: value,
													}));
												}}
											/>
										</div>
									</td>
									<td>
										{/* Actual Amount */}
										<div className="label-above-select">
											<strong>
												<label htmlFor="currentAmount_input">Actual Safe Count:</label>
											</strong>
											<CurrencyInput
												name="currentAmount"
												id="currentAmount_input"
												prefix="$"
												decimalSeparator="."
												groupSeparator=","
												placeholder="$0.00"
												readOnly={true}
												className="text-2xl safe-amount-input"
												value={formData.currentAmount}
												onValueChange={(value, name) => {
													setFormData((prevFormData) => ({
														...prevFormData,
														currentAmount: value,
													}));
												}}
											/>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					{/* Denominations */}
					<div>
						<form action onSubmit={HandleSubmit} onReset={HandleCancel}>
							<strong>
								<h2 style={{fontSize: '1.1rem'}}>Denominations:</h2>
							</strong>
							<table>
								<thead>
									<tr>
										<th>Bills</th>
										<th>Expected</th>
										<th>Actual</th>
										<th></th>
										<th>Coins</th>
										<th>Expected</th>
										<th>Actual</th>
										<th></th>
										<th>Loose</th>
										<th>Expected</th>
										<th>Actual</th>
									</tr>
								</thead>
								<tbody>
									{/* 100s, Quarter Rolled, Quarter */}
									<tr>
										{/* Bills Label Column */}
										<td>
											<label htmlFor="hundred_input">$100's</label>
										</td>
										{/* Expected Hundred Column */}
										<td>
											<input
												type="text"
												name="expectedHundred"
												id="expectedHundred_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedHundred}
											/>
										</td>
										{/* Actual Hundred Column */}
										<td>
											<input
												type="number"
												name="hundred"
												id="hundred_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.hundred}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Hundred Total Column */}
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
										{/* Coins Label Column */}
										<td>
											<label htmlFor="quarterRoll_input">Quarters (rolled)</label>
										</td>
										{/* Expected Quarter Rolled Column */}
										<td>
											<input
												type="text"
												name="expectedQuarterRoll"
												id="expectedQuarterRoll_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedQuarterRoll}
											/>
										</td>
										{/* Actual Quarter Rolled Column */}
										<td>
											<input
												type="number"
												name="quarterRoll"
												id="quarterRoll_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.quarterRoll}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Quarter Rolled Total Column */}
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
										{/* Loose Label Column */}
										<td>
											<label htmlFor="quarter_input">Quarters</label>
										</td>
										{/* Expected Quarter Column */}
										<td>
											<input
												type="text"
												name="expectedQuarter"
												id="expectedQuarter_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedQuarter}
											/>
										</td>
										{/* Actual Quarter Column */}
										<td>
											<input
												type="number"
												name="quarter"
												id="quarter_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.quarter}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Quarter Total Column */}
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
									{/* 50s, Dimes Rolled, Dimes */}
									<tr>
										{/* Bills Label Column */}
										<td>
											<label htmlFor="fifty_input">$50's</label>
										</td>
										{/* Expected Fifty Column */}
										<td>
											<input
												type="text"
												name="expectedFifty"
												id="expectedFifty_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedFifty}
											/>
										</td>
										{/* Actual Fifty Column */}
										<td>
											<input
												type="number"
												name="fifty"
												id="fifty_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.fifty}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Fifty Total Column */}
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
										{/* Coins Label Column */}
										<td>
											<label htmlFor="dimeRoll_input">Dimes (rolled)</label>
										</td>
										{/* Expected Dime Rolled Column */}
										<td>
											<input
												type="text"
												name="expectedDimeRoll"
												id="expectedDimeRoll_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedDimeRoll}
											/>
										</td>
										{/* Actual Dime Rolled Column */}
										<td>
											<input
												type="number"
												name="dimeRoll"
												id="dimeRoll_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.dimeRoll}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Dime Rolled Total Column */}
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
										{/* Loose Label Column */}
										<td>
											<label htmlFor="dime_input">Dimes</label>
										</td>
										{/* Expected Dime Column */}
										<td>
											<input
												type="text"
												name="expectedDime"
												id="expectedDime_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedDime}
											/>
										</td>
										{/* Actual Dime Column */}
										<td>
											<input
												type="number"
												name="dime"
												id="dime_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.dime}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Dime Total Column */}
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
									{/* 20s, Nickels Rolled, Nickels */}
									<tr>
										{/* Bills Column */}
										<td>
											<label htmlFor="twenty_input">$20's</label>
										</td>
										{/* Expected Twenty Column */}
										<td>
											<input
												type="text"
												name="expectedTwenty"
												id="expectedTwenty_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedTwenty}
											/>
										</td>
										{/* Actual Twenty Column */}
										<td>
											<input
												type="number"
												name="twenty"
												id="twenty_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.twenty}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Twenty Total Column */}
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
										{/* Coins Label Column */}
										<td>
											<label htmlFor="nickelRoll_input">Nickels (rolled)</label>
										</td>
										{/* Expected Nickel Rolled Column */}
										<td>
											<input
												type="text"
												name="expectedNickelRoll"
												id="expectedNickelRoll_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedNickelRoll}
											/>
										</td>
										{/* Actual Nickel Rolled Column */}
										<td>
											<input
												type="number"
												name="nickelRoll"
												id="nickelRoll_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.nickelRoll}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Nickel Rolled Total Column */}
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
										{/* Loose Label Column */}
										<td>
											<label htmlFor="nickel_input">Nickels</label>
										</td>
										{/* Expected Nickel Column */}
										<td>
											<input
												type="text"
												name="expectedNickel"
												id="expectedNickel_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedNickel}
											/>
										</td>
										{/* Actual Nickel Column */}
										<td>
											<input
												type="number"
												name="nickel"
												id="nickel_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.nickel}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Nickel Total Column */}
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
									{/* 10s, Pennies Rolled, Pennies */}
									<tr>
										{/* Bills Label Column */}
										<td>
											<label htmlFor="ten_input">$10's</label>
										</td>
										{/* Expected Ten Column */}
										<td>
											<input
												type="text"
												name="expectedTen"
												id="expectedTen_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedTen}
											/>
										</td>
										{/* Actual Ten Column */}
										<td>
											<input
												type="number"
												name="ten"
												id="ten_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.ten}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Ten Total Column */}
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
										{/* Coins Label Column */}
										<td>
											<label htmlFor="pennyRoll_input">Pennies (rolled)</label>
										</td>
										{/* Expected Penny Rolled Column */}
										<td>
											<input
												type="text"
												name="expectedPennyRoll"
												id="expectedPennyRoll_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedPennyRoll}
											/>
										</td>
										{/* Actual Penny Rolled Column */}
										<td>
											<input
												type="number"
												name="pennyRoll"
												id="pennyRoll_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.pennyRoll}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Penny Rolled Total Column */}
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
										{/* Loose Label Column */}
										<td>
											<label htmlFor="penny_input">Pennies</label>
										</td>
										{/* Expected Penny Column */}
										<td>
											<input
												type="text"
												name="expectedPenny"
												id="expectedPenny_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedPenny}
											/>
										</td>
										{/* Actual Penny Column */}
										<td>
											<input
												type="number"
												name="penny"
												id="penny_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.penny}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Penny Total Column */}
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
									{/* 5s, extras */}
									<tr>
										{/* Bills Label Column */}
										<td>
											<label htmlFor="five_input">$5's</label>
										</td>
										{/* Expected Five Column */}
										<td>
											<input
												type="text"
												name="expectedFive"
												id="expectedFive_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedFive}
											/>
										</td>
										{/* Actual Five Column */}
										<td>
											<input
												type="number"
												name="five"
												id="five_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.five}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual Five Total Column */}
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
										<><td>
											<label htmlFor="oneCoin_input">$1 coin</label>
										</td>
										{/* Expected Dollar Coin Column */}
										<td>
											<input
												type="text"
												name="expectedDollarCoin"
												id="expectedDollarCoin_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedDollarCoin}
											/>
										</td>
										{/* Actual Dollar Coin Column */}
										<td>
											<input
												type="number"
												name="dollarCoin"
												id="oneCoin_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.dollarCoin}
												onChange={HandleChange} 
											/>
										</td>
										{/* Actual Dollar Coin Total Column */}
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
										{/* 2s Label Column */}
										<td>
											<label htmlFor="">$2's</label>
										</td>
										{/* Expected Two Column */}
										<td>
											<input
												type="text"
												name="expectedTwo"
												id="expectedTwo_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedTwo}
											/>
										</td>
										{/* Actual Two Column */}
										<td>
											<input
												type="number"
												name="two"
												id="two_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.two}
												onChange={HandleChange} 
											/>
										</td>
										{/* Actual Two Total Column */}
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
										</td></>
										)}
									</tr>
									{/* 1s, extras */}
									<tr>
										{/* Bills Label Column */}
										<td>
											<label htmlFor="one_input">$1's</label>
										</td>
										{/* Expected One Column */}
										<td>
											<input
												type="text"
												name="expectedOne"
												id="expectedOne_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedOne}
											/>
										</td>
										{/* Actual One Column */}
										<td>
											<input
												type="number"
												name="one"
												id="one_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.one}
												onChange={HandleChange}
											/>
										</td>
										{/* Actual One Total Column */}
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
										<><td>
											<label htmlFor="halfDollar_input">$1/2 coin</label>
										</td>
										{/* Expected Half Dollar Column */}
										<td>
											<input
												type="text"
												name="expectedHalfDollar"
												id="expectedHalfDollar_input"
												readOnly={true}
												className="denomination-expected"
												value={formData.expectedHalfDollar}
											/>
										</td>
										{/* Actual Half Dollar Column */}
										<td>
											<input
												type="number"
												name="halfDollar"
												id="halfDollar_input"
												step={1}
												min={0}
												className="denomination-input"
												value={formData.halfDollar}
												onChange={HandleChange} />
										</td>
										{/* Actual Half Dollar Total Column */}
										<td>
											<CurrencyInput
												prefix="$"
												decimalSeparator="."
												groupSeparator=","
												placeholder="0.00"
												readOnly={true}
												className="denomination"
												value={(formData.halfDollar * 0.5).toFixed(2)} />
										</td></>
										)}
									</tr>
								</tbody>
							</table>
							<div>
								<br />
								{/* Submit and Cancel Buttons */}
								<Button
									type="reset"
									label="Cancel"
									size="small"
									icon="pi pi-times"
									rounded
									className="p-button-secondary"
									style={{ width: '200px', marginRight: '1rem' }}
								/>
								<Button
									type="submit"
									label="Submit"
									className="p-button-primary"
									size="small"
									icon="pi pi-check"
									rounded
									style={{ width: '200px', marginRight: '1rem' }}
								/>
							</div>
						</form>
					</div>
					
					<br />
					<div>
						{/* Extra Change Button */}
						<ToggleButton
							checked={showExtraChange}
							onChange={ToggleExtraChange}
							onIcon="pi pi-eye"
							offIcon="pi pi-eye-slash"
							onLabel="Hide extras"
							offLabel="Show extras"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SafeAuditPage;
