//This component displays the the table of POS registers and allows a popup to create a new POS for the store being viewed
//written by Brianna Kline
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../AuthProvider.js";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import "primeicons/primeicons.css";

import EditPOS from './EditPos.jsx';
import { Toaster, toast } from "sonner";


function POSTable() {
  //DECLARE VARIABLES
  const tableRef = useRef(null);
  const auth = useAuth();

  //get date
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${month}-${day}-${year}`;

  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing
  const curStoreName = auth.cookie.user.viewingStoreLocation; //stores the current Store we are viewing
  const [pos, setPosRegisters] = useState([]);
  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [selectedPOS, setSelectedPOS] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  //this handles the close and clear of the POS create popup
  const handleCloseModal = () => {
    setShowModal(false);
    setNickname("");
  };

  //this handles the open of the Create POS popup
  const handleOpenForm = () => {
    setShowModal(true);
  };

  //this method handles the download table in excel
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: curStoreName + "_POS_Systems_" + currentDate,
    sheet: "POS Registers",
  });

  //this function handles the table download PDF
  function downloadPDF() {
    const POSTablePDF = new jsPDF();
    autoTable(POSTablePDF, { html: "#posTable" });
    POSTablePDF.save(curStoreName + "_POS_Systems_" + currentDate + ".pdf");
  }

  const handleRowClick = (pos) => {
    setSelectedPOS(pos);
    // console.log(pos);
    setShowEditForm(true);
    setSelectedRow(pos.ID);
  };

  //this funciton handles a create of a new register.
  function handleSubmit(event) {
    event.preventDefault(); //prevent the default refresh until the post request is done
    //send the store ID and alias if needed
    axios
      .post(
        "https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateRegister",
        {
          storeID: parseInt(curStoreID),
          alias: nickname,
        }
      )
      .then((response) => {

       // console.log(response.data.response);
        if(response.data.response === "Register limit (15) reached"){
          toast.error("Register Limit Reached. Cannot create new POS register.");
          setShowModal(false);
        }
        else{
          toast.success("POS created successfully");
          setShowModal(false);
          window.location.reload(); // This will refresh the page
        }

      })
      .catch((error) => {
        console.error("API request failed:", error);
        toast.error("Request Failed. Try again.")
      });
  }

  //this function handles enable and disable of POS
  const toggleActivity = (pos) => {
    //this pos is currently enabled. lets disable it
    if (pos.enabled == true) {
      //first, check if the register is open
      if (pos.opened == true) {
        toast.error("Cannot disable an open register. Please close and try again.")
      }
      else {

        //create a disable POS request; send POS ID to disable
        axios
          .post(
            "https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/DisableRegister",
            {
              ID: pos.ID,
            }
          )
          .then((response) => {
            if (response.data.response == "Disabled") {
              //toast.success("Register successfully disabled");
              window.location.reload(); // This will refresh the page
            } else {
              toast.error("Disable failed");
              console.error("Failed to disable register");
            }
          })
          .catch((error) => {
            console.error("API request failed:", error);

            toast.error("Request Failed. Try again.")

          });
      }
    }
    //this POS is disables, lets enable
    if (pos.enabled == false) {
      //create a disable POS request
      axios
        .post(
          "https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/EnableRegister",
          {
            ID: pos.ID,
            alias: nickname,
          }
        )
        .then((response) => {
          if (response.data.response == "Enabled") {
            //toast.success("Register enabled");
            window.location.reload(); // This will refresh the page
          } else {
            console.error("Failed to enable register");
            toast.error("Failed to enable the register. Try Again");
          }
        })
        .catch((error) => {
          console.error("API request failed:", error);

          toast.error("Request Failed. Try again.")

        });
    }
  };

  //this useEffect method will fire on load, it gets the POS data for the current store
  useEffect(() => {
    function fetchPosTable() {
      const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewRegistersByStoreID?storeID=${curStoreID}`;

      axios
        .get(url)
        .then((response) => {
          // Update the state variable 'pos' with the fetched data into an array to display in table
          setPosRegisters(
            response.data.map((pos) => ({
              ID: pos.ID,
              name: pos.name,
              alias: pos.alias,
              storeID: pos.storeID,
              enabled: pos.enabled,
              opened: pos.opened,
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }

    // Call the function to initiate the GET request with specific details
    fetchPosTable();
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount

  return (
    <div>
         <Toaster
        richColors
        position="top-center"
        expand={true}
        duration={5000}
        pauseWhenPageIsHidden={true}
      />

      {showModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Would you like to create a nickname for this register?
                    </h3>
                    <div className="mb-3 mt-3">
                      <input
                        type="text"
                        value={nickname}
                        placeholder="Enter nickname"
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 text-bold px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={handleSubmit}
                  label="Confirm New POS"
                  className="p-button-primary p-button-raised"
                  size="small"
                  rounded
                  icon="pi pi-check"
                />
                <Button
                  onClick={handleCloseModal}
                  label="Cancel"
                  className="p-button-secondary p-button-raised"
                  size="small"
                  rounded
                  icon="pi pi-times"
                  style={{ marginRight: "1rem" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <h2 className="text-lg text-red-500 font-bold mb-2">{result}</h2>
      )}
      <div style={{ maxHeight: "450px", overflowY: "auto" }}>
        <table
          id="posTable"
          ref={tableRef}
          className="min-w-full text-center text-navy-gray"
        >
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-4 py-2">POS Name</th>
              <th className="px-4 py-2">POS Nickname</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">In Use</th>
            </tr>
          </thead>
          <tbody>
            {pos.map((pos) => (
              <tr
                key={pos.name}
                onClick={() => handleRowClick(pos)}
                // className={`cursor-pointer hover:bg-gray-100 ${pos.enabled ? '' : 'bg-gray-300'}`}
                className={`cursor-pointer ${
                  selectedRow === pos.ID
                    ? "bg-gray-100"
                    : pos.enabled
                    ? "hover:bg-gray-100"
                    : "bg-gray-300"
                }`}
              >
                <td className="border px-4 py-2">{pos.name}</td>
                <td className="border px-4 py-2">{pos.alias}</td>
                <td className="border px-4 py-2">
                  {pos.opened ? "Open" : "Closed"}
                </td>
                <td className="border px-4 py-2">
                  <Button
                    onClick={() => toggleActivity(pos)}
                    label={pos.enabled ? "Active" : "Inactive"}
                    className={
                      pos.enabled ? "p-button-success" : "p-button-danger"
                    }
                    size="small"
                    rounded
                    icon={pos.enabled ? "pi pi-check" : "pi pi-times"}
                    style={{ width: "125px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row-reverse my-4 ">
        <Button
          onClick={onDownload}
          label="Export to Excel"
          className="p-button-secondary p-button-raised"
          size="small"
          rounded
          icon="pi pi-file-excel"
        />
        <Button
          onClick={downloadPDF}
          label="Export to PDF"
          className="p-button-secondary p-button-raised"
          size="small"
          rounded
          icon="pi pi-file-pdf"
          style={{ marginRight: "1rem" }}
        />
        <Button
          onClick={handleOpenForm}
          label="Add POS Register"
          className="p-button-primary p-button-raised"
          size="small"
          rounded
          icon="pi pi-plus"
          style={{ marginRight: "1rem" }}
        />
        <div>{showEditForm && <EditPOS pos={selectedPOS} />}</div>
      </div>
    </div>
  );
}

export default POSTable;
