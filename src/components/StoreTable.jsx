//this component displays a table of employees that work at the current store
//written by Brianna Kline
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDownloadExcel } from 'react-export-table-to-excel';
import {Trash2, Pencil, Pen} from "lucide-react";
import EditUser from './EditUser'; 
import AddUserForm from './AddUserForm';
import {useAuth} from '../AuthProvider.js';
import AddStore from './AddStore';
import EditStore from './EditStore';


function StoreTable() {

  const auth = useAuth();


  //useState variables for employees array
  const [stores, setStores] = useState([]);


  const [selectedStore, setSelectedStore] = useState(null); // State variable to store selected user data
  const [showEditForm, setShowEditForm] = useState(false); // State variable to manage form visibility
  const [showAddForm, setShowAddForm] = useState(false); // State variable to manage form visibility

  const tableRef = useRef(null);



  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  
  // This arrangement can be altered based on how we want the date's format to appear.
  let currentDate = `${month}-${day}-${year}`;
  console.log(currentDate); // "17-6-2022"

  //this method handles downloads to a excel file
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Plato's_Closet_Stores_"+currentDate,
    sheet: 'Store Locations'
  });

    //this table handles grabbing the corresponding employee object from a row click
    const handleRowClick = (store) => {
      setSelectedStore(store); // Set the selected user data
      //console.log(employee);
      setShowEditForm(true); // Show the edit form button
    };

  //useEffect will launch as soon as the component is loaded
  useEffect(() => {
    //this function will make a GET request to the API to return all employees in the store based on the currently viewed store
    function fetchStoreTable() {

      const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStores`;
      axios.get(url)
        .then((response) => {
          console.log(response);
          //map the response of employee data onto an array of employees
          setStores(response.data.map(store => ({
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
            pennyRollMax: store.pennyRollMax
            

          })));
        })
        .catch((error) => {
          //if the API request errored
          console.error('Error fetching data:', error);
        });
    }

    fetchStoreTable();
  }, []);

  return (
    <div className='min-w-full'> 
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table ref={tableRef} className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Today's Status</th>
              <th className="px-4 py-2">In Business</th>
              {/* <th className="px-4 py-2">Enabled</th> */}

            </tr>
          </thead>
          <tbody>
          {stores.map((store) => (
            <tr 
              key={store.ID} 
              onClick={() => handleRowClick(store)} 
              className={`cursor-pointer hover:bg-gray-100 ${store.enabled ? '' : 'bg-gray-300'}`}
            >
              <td className="border px-4 py-2">{store.location}</td>
              <td className="border px-4 py-2">{store.opened ? 'Open' : 'Closed'}</td>
              <td className="border px-4 py-2">{store.enabled ? 'In Business' : 'Closed Indefinitely'}</td>
            </tr>
          ))}

          </tbody>
        </table>
      </div>
      <div className="flex flex-row-reverse mt-3">
        
      <div className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-5 rounded focus:outline-none focus:shadow-outline">
          <button onClick={onDownload}>Export to Excel</button>
        </div>
        <div><AddStore> </AddStore></div>
        <div>        {showEditForm && <EditStore store={selectedStore}  />}  </div>

          </div>   

    </div>
  );
}

export default StoreTable;