//this component displays a table of employees that work at the current store
//written by Brianna Kline
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDownloadExcel } from 'react-export-table-to-excel';
import {Trash2, Pencil, Pen} from "lucide-react";
import EditUser from './EditUser'; 
import AddUserForm from './AddUserForm';
import {useAuth} from '../AuthProvider.js';


function EmployeeTable() {

  const auth = useAuth();
  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing
  const curStoreName = auth.cookie.user.viewingStoreLocation; //stores the current Store we are viewing


  //useState variables for employees array
  const [employees, setEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State variable to store selected user data
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
    filename: curStoreName+"_Employees_"+currentDate,
    sheet: curStoreName+"Employees"
  });

    //this table handles grabbing the corresponding employee object from a row click
    const handleRowClick = (employee) => {

      //console.log(employee.position);
      



      if(employee.position != "Owner"){
      setSelectedUser(employee); // Set the selected user data
      setShowEditForm(true); // Show the edit form button
      }
      else if(auth.cookie.user.position === "Owner"){
        setSelectedUser(employee); // Set the selected user data
        console.log(employee);
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

          let numOwners = 0;
           // console.log(response.data);
            response.data.forEach(person => {
              console.log(person.position);
              if(person.position ==="Owner"){
                numOwners++;
              }

          });
          localStorage.setItem("numberOfOwners", numOwners);
          console.log(numOwners);


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
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table ref={tableRef} className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Status</th>

            </tr>
          </thead>
          <tbody>
          {employees.map((employee) => (
            <tr 
              key={employee.ID} 
              onClick={() => handleRowClick(employee)} 
              className={`cursor-pointer hover:bg-gray-100 ${employee.enabled ? '' : 'bg-gray-300'}`}
            >
              <td className="border px-4 py-2">{employee.username}</td>
              <td className="border px-4 py-2">{employee.name}</td>
              <td className="border px-4 py-2">{employee.position}</td>
              <td className="border px-4 py-2">{employee.enabled ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}

          </tbody>
        </table>
      </div>
      <div className="flex flex-row-reverse mt-3">
        
      <div className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-5 rounded focus:outline-none focus:shadow-outline">
          <button onClick={onDownload}>Export to Excel</button>
        </div>
        
        <div><AddUserForm > </AddUserForm></div>
        <div>        {showEditForm && <EditUser user={selectedUser}  />}  </div>

           </div>   

    </div>
  );
}

export default EmployeeTable;