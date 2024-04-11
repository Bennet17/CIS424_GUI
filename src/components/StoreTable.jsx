//this component displays a table of employees that work at the current store
//written by Brianna Kline
//this is a parent to AddStore and EditStore componenets
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDownloadExcel } from "react-export-table-to-excel";
import { Trash2, Pencil, Pen } from "lucide-react";
import EditUser from "./EditUser";
import AddUserForm from "./AddUserForm";
import { useAuth } from "../AuthProvider.js";
import AddStore from "./AddStore";
import EditStore from "./EditStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import "primeicons/primeicons.css";

function StoreTable() {
  //DECLARE VARIABLES
  const auth = useAuth();
  const [selectedRow, setSelectedRow] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null); // State variable to store selected user data
  const [showEditForm, setShowEditForm] = useState(false); // State variable to manage form visibility
  const [showAddForm, setShowAddForm] = useState(false); // State variable to manage form visibility
  const tableRef = useRef(null);
  //date variables
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${month}-${day}-${year}`;

  //this method handles downloads to a excel file
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Plato's_Closet_Stores_" + currentDate,
    sheet: "Store Locations",
  });

  //this function havdles table download to PDF
  function downloadPDF() {
    const storeTablePDF = new jsPDF();
    autoTable(storeTablePDF, { html: "#storeTable" });
    storeTablePDF.save("Plato's_Closet_Stores_" + currentDate + ".pdf");
  }

  //this table handles grabbing the corresponding employee object from a row click
  const handleRowClick = (store) => {
    setSelectedStore(store); // Set the selected user data
    setShowEditForm(true); // Show the edit form button
    setSelectedRow(store.ID);
  };

//useEffect will launch as soon as the component is loaded
useEffect(() => {
  //this function will make a GET request to the API to return all employees in the store based on the currently viewed store
  function fetchStoreTable() {
    axios.get(
      process.env.REACT_APP_REQUEST_URL+`ViewStores`,
      {
        headers: {
          [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY
        }
      }
    )
    .then((response) => {
      setStores(
        response.data.map((store) => ({
          ID: store.ID,
          location: store.location,
          enabled: store.enabled,
          opened: store.opened,
          hundredRegisterMax: store.hundredRegisterMax,
          fiftyRegisterMax: store.fiftyRegisterMax,
          twentyRegisterMax: store.twentyRegisterMax,
          hundredMax: store.hundredMax,
          fiftyMax: store.fiftyMax,
          twentyMax: store.twentyMax,
          tenMax: store.tenMax,
          fiveMax: store.fiveMax,
          twoMax: store.twoMax,
          oneMax: store.oneMax,
          quarterRollMax: store.quarterRollMax,
          dimeRollMax: store.dimeRollMax,
          nickelRollMax: store.nickelRollMax,
          pennyRollMax: store.pennyRollMax,
        }))
      );
    })
    .catch((error) => {
      //if the API request errored
    });    
  }
  fetchStoreTable();
}, []);


  return (
    <div className="min-w-full">
      <div style={{ maxHeight: "450px", overflowY: "auto" }}>
        <table
          id="storeTable"
          ref={tableRef}
          className="min-w-full text-center text-navy-gray"
        >
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">In Business</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr
                key={store.ID}
                onClick={() => handleRowClick(store)}
                //className={`cursor-pointer hover:bg-gray-100 ${store.enabled ? '' : 'bg-gray-300'}`}
                className={`cursor-pointer ${
                  selectedRow === store.ID
                    ? "bg-gray-100"
                    : store.enabled
                    ? "hover:bg-gray-100"
                    : "bg-gray-300"
                }`}
              >
                <td className="border px-4 py-2 text-left">{store.location}</td>
                <td className="border px-4 py-2">
                  {store.opened ? "Open" : "Closed"}
                </td>
                <td className="border px-4 py-2">
                  {store.enabled ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row-reverse my-4">
        <Button
          label="Export to Excel"
          className="p-button-secondary p-button-raised"
          rounded
          icon="pi pi-file-excel"
          size="small"
          onClick={onDownload}
        />
        <Button
          label="Export to PDF"
          className="p-button-secondary p-button-raised"
          rounded
          icon="pi pi-file-pdf"
          size="small"
          onClick={downloadPDF}
          style={{ marginRight: "1rem" }}
        />
        <div>
          <AddStore> </AddStore>
        </div>
        <div> {showEditForm && <EditStore store={selectedStore} />} </div>
      </div>
    </div>
  );
}

export default StoreTable;
