
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getValue } from '@testing-library/user-event/dist/utils';
import {useAuth} from '../AuthProvider.js';
import { useDownloadExcel } from 'react-export-table-to-excel';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function POSTable() {

  const tableRef = useRef(null);





  
  const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${month}-${day}-${year}`;
console.log(currentDate); // "17-6-2022"

  const auth = useAuth();
  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing
  const curStoreName = auth.cookie.user.viewingStoreLocation; //stores the current Store we are viewing


      //do a get request to get all the POS's for the current store
  const [pos, setPosRegisters] = useState([]);
  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState(null);

  function downloadPDF(){
    const POSTablePDF = new jsPDF()
    autoTable(POSTablePDF, { html: '#posTable' })
    //autoTable.default(employeeTablePDF, { html: '#empTable' })
    POSTablePDF.save(curStoreName+"_POS_Systems_"+currentDate+".pdf")
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setNickname('');
  };

  const handleOpenForm = () =>{
      setShowModal(true);
  }

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: curStoreName+"_POS_Systems_"+currentDate,
    sheet: "POS Registers"
  });


  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateRegister", 
        {
          "storeID": parseInt(curStoreID),
          "alias": nickname
        })
      .then((response) => {
        //setResult("POS created successfully");
        console.log(response.data.response);
        setShowModal(false);
        window.location.reload(); // This will refresh the page
  
      })
      .catch((error) => {
        console.error("API request failed:", error);
       setResult("Request Failed. Try again.")
      });
  }


    const toggleActivity = (pos)=> {
      //this pos is currently enabled. lets disable it
      if(pos.enabled == true ){
        if(pos.opened == true){
          setResult("Cannot disable an open register. Please close and try again.")
        }
        else{
              //create a disable POS request
              axios
              .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/DisableRegister", 
                {
                  "ID": pos.ID,
                })
              .then((response) => {
        
                console.log(response.data.response);
        
                if (response.data.response == "Disabled") {
                    console.log("Register successfully disabled");
                    window.location.reload(); // This will refresh the page

                } else {
                  console.error("Failed to disable register");
                  
        
                }
        
        
              })
              .catch((error) => {
                console.error("API request failed:", error);
              // console.error( username+ " "+ name+ " "+password+ " "+ position +" " +storeID);
              //setResult("Request Failed. Try again.")
              });
            }
    }

    if(pos.enabled == false){
              //create a disable POS request
              axios
              .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/EnableRegister", 
                {
                  "ID": pos.ID,
                  "alias": nickname
                })
              .then((response) => {
        
                console.log(response.data.response);
        
                if (response.data.response == "Enabled") {
                  console.log("Register enabled");
                  window.location.reload(); // This will refresh the page

      
                } else {
                  console.error("Failed to enable register");
        
                }
        
        
              })
              .catch((error) => {
                console.error("API request failed:", error);
               // console.error( username+ " "+ name+ " "+password+ " "+ position +" " +storeID);
              // setResult("Request Failed. Try again.")
              });
    }

    }
    
      
  useEffect(() => {
    function  fetchPosTable()    {
      const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewRegistersByStoreID?storeID=${curStoreID}`;

      axios.get(url)
        .then((response) => {
          console.log('Data:', response.data);

          // Update the state variable 'pos' with the fetched data
          setPosRegisters(response.data.map(pos => ({
            ID: pos.ID,
            name: pos.name,
            alias: pos.alias,
            storeID: pos.storeID,
            enabled:pos.enabled,
            opened:pos.opened
            
          })));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    // Call the function to initiate the GET request with specific details
    fetchPosTable();
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount


  return ( 
    <div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                      Would you like to create a nickname for this register?
                    </h3>
                    <div className="mb-3 mt-3">
                      <input
                        type="text"
                        value={nickname}
                        placeholder='Enter nickname'
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 text-bold px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
            type="submit"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center  rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Confirm New POS
            </button>
            <button
              onClick={handleCloseModal}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-300 text-base font-bold text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
              </div>
            </div>
          </div>
        </div>
      )}

     
      <h2 className="text-lg text-red-500 font-bold mb-2">{result}</h2>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <table id='posTable' ref={tableRef} className="min-w-full text-center">
        <thead>
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
              className={`cursor-pointer hover:bg-gray-100 ${pos.enabled ? '' : 'bg-gray-300'}`}
            >
              <td className="border px-4 py-2">{pos.name}</td>
              <td className="border px-4 py-2">{pos.alias}</td>
              <td className="border px-4 py-2">{pos.opened ? 'Open' : 'Closed'}</td>
              <td className="border px-4 py-2">
            
                <button onClick={() => toggleActivity(pos)} className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-32'>
                  {pos.enabled ? 'Deactivate' : 'Activate'}
                </button>
                   </td>
      
            </tr>
          ))}


        </tbody>
      </table>
      </div>
      <div className='flex flex-row-reverse mt-4 '> 
      <div className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-5 rounded focus:outline-none focus:shadow-outline">
          <button onClick={onDownload}>Export to Excel</button>
        </div>
      <div className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-5 rounded focus:outline-none focus:shadow-outline">
          <button onClick={downloadPDF}>Export to PDF</button>
        </div>
        <button
            onClick={handleOpenForm}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Add POS Register
          </button>

          </div>
        
    </div>
  );
}

export default POSTable;

























