import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDownloadExcel } from 'react-export-table-to-excel';

function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Employees table',
    sheet: 'Employees'
  });

  const handleRowClick = (employeeID) => {
    console.log("Clicked employee ID:", employeeID);
    // You can implement your logic for handling row clicks here
  };

  useEffect(() => {
    function fetchEmployeeTable() {
      const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewUsersByStoreID?storeID=0`;

      axios.get(url)
        .then((response) => {
          console.log('Data:', response.data);

          // Update the state variable 'employees' with the fetched data
          setEmployees(response.data.map(employee => ({
            ID: employee.ID,
            username: employee.username,
            name: employee.name,
            password: employee.password,
            position: employee.position,
            storeID: employee.storeID
          })));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    // Call the function to initiate the GET request with specific details
    fetchEmployeeTable();
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount

  return (
    <div>
    <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
      <table ref={tableRef} className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2"> User ID</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Password</th>
            <th className="px-4 py-2">Position</th>
            <th className="px-4 py-2">Store ID</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.ID} onClick={() => handleRowClick(employee.ID)} className="cursor-pointer hover:bg-gray-100">
              <td className="border px-4 py-2">{employee.ID}</td>
              <td className="border px-4 py-2">{employee.username}</td>
              <td className="border px-4 py-2">{employee.name}</td>
              <td className="border px-4 py-2">{employee.password}</td>
              <td className="border px-4 py-2">{employee.position}</td>
              <td className="border px-4 py-2">{employee.storeID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex flex-row-reverse">
      <div className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              <button onClick={onDownload}>Export to Excel</button></div>
    
    </div>
    </div>
    
  );
}

export default EmployeeTable;



