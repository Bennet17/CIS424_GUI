import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import SideBar from "./SideBar";
import HorizontalNav from "./HorizontalNav";
import { useAuth } from "../AuthProvider.js";

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
    });

    const [status, setStatus] = useState(""); // Status message to display after form submission
    const successClass = "text-green-500"; // CSS class for success
    const errorClass = "text-red-500"; // CSS class for error

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
				const safeID = response.data.find((obj) => obj.name === "SAFE").regID;

				// If the safe ID is found, get the expected amount from the server
				if (safeID != null) {
					axios.get(
						`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GetOpenCount?storeID=${formData.store}&registerID=${safeID}`
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
					console.log("Safe not found");
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
		if (formData.currentAmount === "" || formData.currentAmount === 0) {
			// Update the status message
			setStatus("Please fill out the current amount field.");

			// Adds error class to fields
			document.getElementById("currentAmount_input").classList.add("safe-amount-input-error");


			// Return true to prevent form submission
			return true;
		}
		else {
			// Removes error class from fields
			document.getElementById("currentAmount_input").classList.remove("safe-amount-input-error");
			setStatus("");

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

        // Stores value to be parsed back to number after form change
        let parsedValue = parseFloat(value);

		// If current amount was changed, remove error class
		if (value !== "") {
			document.getElementById("currentAmount_input").classList.remove("safe-amount-input-error");
			setStatus("");
		}

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

		// Create the cash count object
		const request = {
			usrID: user,
			storeID: formData.store,
			itemCounted: "SAFE",
			amountExpected: parseFloat(expectedAmount),
			total: parseFloat(currentAmount),
			...currencyFields,
		};

		console.log(request)

		// POST the cash count to the server
		axios.post(CreateCashCountURL, request).then((response) => {
			console.log(response);

			 // Check if the count was successful
			if (response.data.IsValid == true)
				console.log("Successfully submitted safe count");
			else 
				console.log("Failed to submit safe count");
		})
		.catch((error) => {
			console.error(error);
		});
	}

	// Function to handle the form submission
	const HandleSubmit = async (event) => {
		event.preventDefault();

        // Check if any field is invalid
        if (CheckFields())
            return;
		

		// Stores form data to be passed to SubmitCashCount
		let {
			user,
			name,
			store,
			currentAmount: fltCurrentAmount,
			expectedAmount: fltExpectedAmount,
			...currencyFields
		} = formData;

		// Parse the form data to floats
		fltCurrentAmount = parseFloat(formData.currentAmount).toFixed(2);
		fltExpectedAmount = parseFloat(formData.expectedAmount).toFixed(2);

        // Set the status message
        setStatus("Successfully submitted mid day cash count!");

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
		});
	}

	//toggles the variable that displays the niche changes, such as $2 bills and $1 coins
    //(also change arrow text thing)
    function ToggleExtraChange() {
        setShowExtraChange(!showExtraChange);

        if (!showExtraChange)
            setShowExtraChangeTxt("▲ Hide extras");
        else
            setShowExtraChangeTxt("▼ Show extras");
    }

    // Determine the class based on the status
    const statusClass = status.startsWith("Successfully") ? successClass : errorClass;

	return (
		<div className="flex h-screen bg-custom-accent">
			<SideBar currentPage={4} />
			<div className="flex flex-col w-full">
				<HorizontalNav />
				<div className="text-main-color float-left ml-8 mt-12">
					<h1 className="text-3xl font-bold">Safe Audit for {formData.storeName}</h1>
					<br />
					<form onSubmit={HandleSubmit} onReset={HandleCancel} className="tables-container">
                        {/* Denominations */}
						<div>
							<strong>
								<label>Denominations:</label>
							</strong>
							<table className="table-denominations">
								<tbody>
									<tr>
										<td>
											<label htmlFor="penny_input">Pennies</label>
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
										<td>
											<label htmlFor="one_input">$1's</label>
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
												className="denomination-input"
												value={formData.nickel}
												onChange={HandleChange}
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
										<td>
											<label htmlFor="five_input">$5's</label>
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
												className="denomination-input"
												value={formData.dime}
												onChange={HandleChange}
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
										<td>
											<label htmlFor="ten_input">$10's</label>
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
												className="denomination-input"
												value={formData.quarter}
												onChange={HandleChange}
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
										<td>
											<label htmlFor="twenty_input">$20's</label>
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
												className="denomination-input"
												value={formData.pennyRoll}
												onChange={HandleChange}
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
										<td>
											<label htmlFor="fifty_input">$50's</label>
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
												className="denomination-input"
												value={formData.nickelRoll}
												onChange={HandleChange}
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
										<td>
											<label htmlFor="hundred_input">$100's</label>
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
												className="denomination-input"
												value={formData.dimeRoll}
												onChange={HandleChange}
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
										<td>
											<label htmlFor="quarterRoll_input">Quarters (rolled)</label>
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
									</tr>
									{/* Extra denominations */}
									{showExtraChange == true && (
									<tr>
										<td>
										<label htmlFor="oneCoin_input">$1 coin</label>
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
										<td>
										<label htmlFor="">$2's</label>
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
									</tr>
									)}
									{showExtraChange == true && (
									<tr>
										<td>
										<label htmlFor="halfDollar_input">$1/2 coin</label>
										<input
											type="number"
											name="halfDollar"
											id="halfDollar_input"
											step={1}
											min={0}
											className="denomination-input"
											value={formData.halfDollar}
											onChange={HandleChange}
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
									</tr>
									)}
									<tr>
										<td colSpan="3">
											<p
												className="showextra"
												onClick={ToggleExtraChange}
											>
												{showExtraChangeTxt}
											</p>
										</td>
									</tr>
									<tr>
										<td>
											<button
												type="reset"
												className="flex w-5/6  justify-center rounded-md bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
											>
												Cancel
											</button>
										</td>
										<td></td>
										<td>
											<button
												type="submit"
												className="flex w-5/6  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
											>
												Submit
											</button>
										</td>
										<td></td>
									</tr>
								</tbody>
							</table>
						</div>

						{/* Current Amount input */}
						<div>
							<div className="label-above-select">
								<strong>
									<label htmlFor="currentAmount_input">Current Safe Count:</label>
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
							<br />
							
							{/* Expected Amount input*/}
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
						</div>
					</form>
                    {/* Shows submission status */}
                    <p className={`mt-4 ml-6 ${statusClass}`}>{status}</p>
				</div>
			</div>
		</div>
	);
};

export default SafeAuditPage;
