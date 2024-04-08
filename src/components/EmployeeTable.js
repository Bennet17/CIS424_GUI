//this component displays a table of employees that work at the current store
//written by Brianna Kline
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDownloadExcel } from 'react-export-table-to-excel';
import EditUser from './EditUser'; 
import AddUserForm from './AddUserForm';
import {useAuth} from '../AuthProvider.js';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


function EmployeeTable() {

  //DECLARE VARIABLES

  const auth = useAuth();
  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing
  const curStoreName = auth.cookie.user.viewingStoreLocation; //stores the current Store we are viewing

  const [employees, setEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State variable to store selected user data
  const [showEditForm, setShowEditForm] = useState(false); // State variable to manage form visibility
  const [showAddForm, setShowAddForm] = useState(false); // State variable to manage form visibility
  const [showAllEmployees, setShowAllEmployees] = useState(false);
  const tableRef = useRef(null);

  //create date string
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${month}-${day}-${year}`;


  //this method handles downloads to a excel file
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: curStoreName+"_Employees_"+currentDate,
    sheet: curStoreName+"Employees"
  });

  //this method handled the employee table download to PDF
  function downloadPDF(){
    const employeeTablePDF = new jsPDF()
    autoTable(employeeTablePDF, { html: '#empTable' })
    employeeTablePDF.save(curStoreName+"_Employees_"+currentDate+".pdf")
  }

    //this function handles grabbing the corresponding employee object from a row click
    //we want to prevent non owners from editing the owner's information
    const handleRowClick = (employee) => {    

      //if the selected user in the table is an owner, by default prevent users from editing
      if(employee.position != "Owner"){
      setSelectedUser(employee); 
      setShowEditForm(true); 
      }

      //if the user is an owner, allow editing on all users
      else if(auth.cookie.user.position === "Owner"){
        setSelectedUser(employee); //pass the selected owner
        setShowEditForm(true); // Show the edit form button
      }

    };

  //useEffect will launch as soon as the component is loaded
  useEffect(() => {
    //this function will make a GET request to the API to return all employees in the store based on the currently viewed store
    function fetchEmployeeTable() {

      const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewUsersByStoreID?storeID=${curStoreID}`;
      axios.get(url)
        .then((response) => {
          console.log(response);
          //map the response of employee data onto an array of employees
          setEmployees(response.data.map(employee => ({
            ID: employee.ID,
            username: employee.username,
            name: employee.name,
           // password: employee.password,
            position: employee.position,
            storeID_CSV: employee.storeID_CSV, //get storename from local storage
            enabled: employee.enabled

          })));

          //this counts how many active owners there are to prevent disabling all owners
            let numActiveOwners = 0;
            //iterate through person data and count number of active owners
            response.data.forEach(person => {
              if(person.position ==="Owner" && person.enabled == true){
                numActiveOwners++;
              }

          });
          //save the number of active owners in local storage
          localStorage.setItem("numberOfActiveOwners", numActiveOwners);
        })
        .catch((error) => {
          //if the API request errored
          console.error('Error fetching data:', error);
        });
    }

    fetchEmployeeTable();
  }, []);
  
  return (
    <div>
      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        <table id='empTable' ref={tableRef} className="min-w-full text-center text-navy-gray">
          <thead>
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .filter(employee => showAllEmployees || employee.enabled)
              .map(employee => (
                <tr
                  key={employee.ID}
                  onClick={() => handleRowClick(employee)}
                  className={`cursor-pointer hover:bg-gray-100 ${employee.enabled ? '' : 'bg-gray-300'}`}
                >
                  <td className="border px-4 py-2 text-left">{employee.username}</td>
                  <td className="border px-4 py-2 text-left">{employee.name}</td>
                  <td className="border px-4 py-2">{employee.position}</td>
                  <td className="border px-4 py-2">{employee.enabled ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    
      {/* Buttons for exporting and adding users */}
      <div className="flex flex-row-reverse my-4 text-navy-gray">
      <label className="mt-2 ml-4">
            <input
              type="checkbox"
              onChange={() => setShowAllEmployees(!showAllEmployees)}
              className="mr-2 text-lg"
            />
            Show Disabled Employees
          </label>
        <div className="bg-button-gray hover:bg-button-gray-light text-white font-bold py-2 px-4 ml-5 rounded-full border-2 border-button-gray ">
          <button onClick={onDownload}>Export to Excel</button>
        </div>
        <div className="bg-button-gray hover:bg-button-gray-light text-white font-bold py-2 px-4 ml-5 rounded-full border-2 border-button-gray ">
          <button onClick={downloadPDF}>Export to PDF</button>
        </div>
        <div><AddUserForm></AddUserForm></div>
        <div>{showEditForm && <EditUser user={selectedUser} />}</div>
      </div>
    </div>
  );
  
}

export default EmployeeTable;