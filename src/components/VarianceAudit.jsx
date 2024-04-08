import "../styles/PageStyles.css";
import axios from "axios";
import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import CurrencyInput from "react-currency-input-field";
import SideBar from "./SideBar";
import HorizontalNav from "./HorizontalNav";
import { useNavigate } from "react-router-dom";
import routes from "../routes.js";
import { useAuth } from "../AuthProvider.js";
import { Toaster, toast } from "sonner";
import { Button } from "primereact/button";
import { format, set } from "date-fns";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import "primeicons/primeicons.css";
import { classNames } from "primereact/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { InputNumber } from "primereact/inputnumber";

const VarianceAuditPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  // API URL for the Variance Audit (https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/VarianceAudit)
  const VarianceAuditURL =
    "https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/VarianceAudit";

  // Set the start date to 7 days ago and the end date to today
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Set the initial state of the form data
  const [formData, setFormData] = useState({
    user: auth.cookie.user.ID,
    name: auth.cookie.user.name,
    store: auth.cookie.user.viewingStoreID,
    storeName: auth.cookie.user.viewingStoreLocation,
    registerID: -1,
    startDate: weekAgo,
    endDate: today,
  });

  // Fields for variances
  const [cashOverShort, setCashOverShort] = useState("$0.00");
  const [ccOverShort, setCCOverShort] = useState("$0.00");
  const [totalOverShort, setTotalOverShort] = useState("$0.00");

  // Input fields for cash, cc, and other
  const [cashTendered, setCashTendered] = useState(0);
  const [cashBuys, setCashBuys] = useState(0);
  const [pettyCash, setPettyCash] = useState(0);
  const [mastercard, setMastercard] = useState(0);
  const [visa, setVisa] = useState(0);
  const [amex, setAmex] = useState(0);
  const [discover, setDiscover] = useState(0);
  const [debit, setDebit] = useState(0);
  const [other, setOther] = useState(0);
  const [total, setTotal] = useState(0);

  //check the permissions of the logged in user on page load, passing in
  //the required permissions
  useLayoutEffect(() => {
    if (!auth.CheckAuthorization(["Team Leader", "Store Manager", "Owner"])) {
      navigate(routes.home);
    }
  });

  // Function to update the input dates to the correct format
  const UpdateInputDates = useCallback(() => {
    // Set the start and end date to the correct format
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");

    if (startDateInput && endDateInput) {
      // Create Date objects with the timezone offset
      const startDate = new Date(
        formData.startDate.getTime() -
          formData.startDate.getTimezoneOffset() * 60000
      );
      const endDate = new Date(
        formData.endDate.getTime() -
          formData.endDate.getTimezoneOffset() * 60000
      );

      // Set the input values
      startDateInput.valueAsDate = startDate;
      endDateInput.valueAsDate = endDate;
    }
  }, [formData.startDate, formData.endDate]);

  // Updates total when any of the input fields change
  useEffect(() => {
    UpdateInputDates();
    setTotal(
      cashTendered +
        cashBuys +
        pettyCash +
        mastercard +
        visa +
        amex +
        discover +
        debit +
        other
    );
  }, [
    cashTendered,
    cashBuys,
    pettyCash,
    mastercard,
    visa,
    amex,
    discover,
    debit,
    other,
    UpdateInputDates,
  ]);

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
    const formattedValue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(value));

    // Return the formatted value in parentheses if it's negative
    return value < 0 ? `(${formattedValue})` : formattedValue;
  };

  // Handles the change of the input fields
  const HandleChange = (event) => {
    // Get the name and value of the input field
    const { name, value } = event.target;

    if (value !== "") {
      // Update the form data
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  async function SubmitAudit(request) {
    // Make a POST request to the API
    try {
      const response = await axios.post(VarianceAuditURL, request);

      // Check if the request was successful
      if (response.status === 200) {
        toast.success("Variance Audit submitted.");

        // Update variance fields
        setCashOverShort(
          FormatCurrency(parseFloat(response.data.cashVariance).toFixed(2))
        );
        setCCOverShort(
          FormatCurrency(parseFloat(response.data.creditVariance).toFixed(2))
        );
        setTotalOverShort(
          FormatCurrency(parseFloat(response.data.totalVariance).toFixed(2))
        );

        return true;
      } else {
        toast.error("Failed to submit the Variance Audit.");
        return false;
      }
    } catch (error) {
      toast.error("Failed to submit the Variance Audit.");
      return false;
    }
  }

  // Handles the submit button
  const HandleSubmit = async (event) => {
    event.preventDefault();

    // Destructure the form data
    const { store, startDate, endDate } = formData;

    // Create request object
    const request = {
      storeID: store,
      startDate: FormatDate(startDate),
      endDate: FormatDate(endDate),
      cashTendered: cashTendered,
      cashBuys: cashBuys,
      pettyCash: pettyCash,
      mastercard: mastercard,
      visa: visa,
      americanExpress: amex,
      discover: discover,
      debit: debit,
      other: other,
    };

    // Submit the audit
    if (await SubmitAudit(request)) {
      // Reset the form data
      setFormData({
        user: auth.cookie.user.ID,
        name: auth.cookie.user.name,
        store: auth.cookie.user.viewingStoreID,
        storeName: auth.cookie.user.viewingStoreLocation,
        registerID: -1,
        startDate: startDate,
        endDate: endDate,
      });
    }
  };

  // Handles the cancel button
  const HandleCancel = (event) => {
    event.preventDefault();

    if (total !== 0) toast.info("Fields have been reset.");

    // Reset the form data
    setFormData({
      user: auth.cookie.user.ID,
      name: auth.cookie.user.name,
      store: auth.cookie.user.viewingStoreID,
      storeName: auth.cookie.user.viewingStoreLocation,
      registerID: -1,
      startDate: weekAgo,
      endDate: today,
      cashOverShort: 0,
      ccOverShort: 0,
      totalOverShort: 0,
    });

    // Reset the variance fields
    setCashOverShort("$0.00");
    setCCOverShort("$0.00");
    setTotalOverShort("$0.00");

    // Reset the input fields
    setCashTendered(0);
    setCashBuys(0);
    setPettyCash(0);
    setMastercard(0);
    setVisa(0);
    setAmex(0);
    setDiscover(0);
    setDebit(0);
    setOther(0);
    setTotal(0);
  };

  // Function to style the variance fields based on the value
  const VarianceStyling = (value) => {
    // If the value contains parentheses, make the number negative
    if (value.includes("(")) {
      value = parseFloat(value.replace(/[^0-9.-]+/g, "")) * -1;
    } else {
      value = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    }

    // Return the color based on the value
    // green: text-green-500, red: text-red-500
    if (value < 0) return "text-red-500";
    else if (value > 0) return "text-green-500";
    else return "";
  };

  const InputNumberProps = {
    mode: "currency",
    currency: "USD",
    locale: "en-US",
    required: true,
    unstyled: true,
    inputClassName: "variance-input",
  };

  return (
    <div className="flex min-h-screen bg-custom-accent variance-audit-page">
      <Toaster
        richColors
        position="top-center"
        expand={true}
        duration={5000}
        pauseWhenPageIsHidden={true}
      />
      <SideBar currentPage={5} />
      <div className="flex flex-col w-full">
        <HorizontalNav />
        <div className="text-main-color float-left ml-8 mt-6">
          <h1 className="text-3xl font-bold">
            Variance Audit for {formData.storeName}
          </h1>
          {/* Cash/CC/Total Results */}
          <div className="mt-5">
            <table>
              <tbody>
                <tr>
                  <td>
                    {/* Cash Over/Short Result */}
                    <div className="label-above-select">
                      <strong>
                        <label htmlFor="cashOverShort">Cash Over/Short:</label>
                      </strong>
                      <input
                        type="text"
                        id="cashOverShort"
                        name="cashOverShort_input"
                        className={`text-2xl safe-amount-input ${VarianceStyling(
                          cashOverShort
                        )}`}
                        value={cashOverShort}
                        readOnly={true}
                        placeholder="$0.00"
                      />
                    </div>
                  </td>
                  <td>
                    {/* CC Over/Short Result */}
                    <div className="label-above-select">
                      <strong>
                        <label htmlFor="ccOverShort">CC Over/Short:</label>
                      </strong>
                      <input
                        type="text"
                        id="ccOverShort"
                        name="ccOverShort_input"
                        className={`text-2xl safe-amount-input ${VarianceStyling(
                          ccOverShort
                        )}`}
                        value={ccOverShort}
                        readOnly={true}
                        placeholder="$0.00"
                      />
                    </div>
                  </td>
                  <td>
                    {/* Total Over/Short Result */}
                    <div className="label-above-select">
                      <strong>
                        <label htmlFor="totalOverShort">
                          Total Over/Short:
                        </label>
                      </strong>
                      <input
                        type="text"
                        id="totalOverShort"
                        name="totalOverShort_input"
                        className={`text-2xl safe-amount-input ${VarianceStyling(
                          totalOverShort
                        )}`}
                        value={totalOverShort}
                        readOnly={true}
                        placeholder="$0.00"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="flex items-center space-x-4">
              {/* Left arrow button */}
              <Button
                onClick={HandlePreviousDay}
                icon="pi pi-arrow-left"
                iconPos="left"
                size="small"
                text
                rounded
                aria-label="Previous Day"
                style={{ marginTop: "6px", boxShadow: "none" }}
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
                style={{
                  marginTop: "6px",
                  boxShadow: "none",
                  marginRight: "2.5rem",
                }}
              />
            </div>
            <form action onSubmit={HandleSubmit} onReset={HandleCancel}>
              <strong>
                <h2 style={{ fontSize: "1.1rem" }}>Variance Audit</h2>
              </strong>
              <div>
                <table>
                  <tbody>
                    <tr>
                      {/* Cash Tendered */}
                      <td>
                        <label htmlFor="cashTendered_input">
                          Cash Tendered
                        </label>
                        <InputNumber
                          inputId="cashTendered_input"
                          name="cashTendered"
                          value={cashTendered}
                          onValueChange={(e) => setCashTendered(e.value)}
                          {...InputNumberProps}
                          tabIndex={1}
                        />
                      </td>
                      {/* Mastercard */}
                      <td>
                        <label htmlFor="mastercard_input">Mastercard</label>
                        <InputNumber
                          inputId="mastercard_input"
                          name="mastercard"
                          value={mastercard}
                          onValueChange={(e) => setMastercard(e.value)}
                          {...InputNumberProps}
                          tabIndex={5}
                        />
                      </td>
                      {/* Total */}
                      <td>
                        <label htmlFor="total_input">Total</label>
                        <CurrencyInput
                          id="total_input"
                          name="total_input"
                          prefix="$"
                          decimalSeparator="."
                          groupSeparator=","
                          placeholder="$0.00"
                          readOnly={true}
                          className="variance-input"
                          value={parseFloat(total).toFixed(2)}
                          onValueChange={(value, name) => {
                            setTotal(value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      {/* Cash Buys */}
                      <td>
                        <label htmlFor="cashBuys_input">Cash Buys</label>
                        <InputNumber
                          inputId="cashBuys_input"
                          name="cashBuys"
                          value={cashBuys}
                          onValueChange={(e) => setCashBuys(e.value)}
                          {...InputNumberProps}
                          tabIndex={2}
                        />
                      </td>
                      {/* Visa */}
                      <td>
                        <label htmlFor="visa_input">Visa</label>
                        <InputNumber
                          inputId="visa_input"
                          name="visa"
                          value={visa}
                          onValueChange={(e) => setVisa(e.value)}
                          {...InputNumberProps}
                          tabIndex={6}
                        />
                      </td>
                    </tr>
                    <tr>
                      {/* Petty Cash */}
                      <td>
                        <label htmlFor="pettyCash_input">Petty Cash</label>
                        <InputNumber
                          inputId="pettyCash_input"
                          name="pettyCash"
                          value={pettyCash}
                          onValueChange={(e) => setPettyCash(e.value)}
                          {...InputNumberProps}
                          tabIndex={3}
                        />
                      </td>
                      {/* Amex */}
                      <td>
                        <label htmlFor="amex_input">Amex</label>
                        <InputNumber
                          inputId="amex_input"
                          name="amex"
                          value={amex}
                          onValueChange={(e) => setAmex(e.value)}
                          {...InputNumberProps}
                          tabIndex={7}
                        />
                      </td>
                    </tr>
                    <tr>
                      {/* Other */}
                      <td>
                        <label htmlFor="other_input">Other</label>
                        <InputNumber
                          inputId="other_input"
                          name="other"
                          value={other}
                          onValueChange={(e) => setOther(e.value)}
                          {...InputNumberProps}
                          tabIndex={3}
                        />
                      </td>
                      {/* Discover */}
                      <td>
                        <label htmlFor="discover_input">Discover</label>
                        <InputNumber
                          inputId="discover_input"
                          name="discover"
                          value={discover}
                          onValueChange={(e) => setDiscover(e.value)}
                          {...InputNumberProps}
                          tabIndex={8}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      {/* Debit */}
                      <td>
                        <label htmlFor="debit_input">Debit</label>
                        <InputNumber
                          inputId="debit_input"
                          name="debit"
                          value={debit}
                          onValueChange={(e) => setDebit(e.value)}
                          {...InputNumberProps}
                          tabIndex={9}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br />
              <div>
                <Button
                  type="reset"
                  label="Cancel"
                  icon="pi pi-times"
                  size="small"
                  rounded
                  className="p-button-secondary"
                  style={{ width: "200px", marginRight: "1rem" }}
                />
                <Button
                  type="submit"
                  label="Submit"
                  icon="pi pi-check"
                  size="small"
                  rounded
                  className="p-button-primary"
                  style={{ width: "200px", marginRight: "1rem" }}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VarianceAuditPage;
