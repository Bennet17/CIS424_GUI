
import EditUser from "./EditUser"
import React, { useState } from 'react';
function EmployeeTable() {
{/*}
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);


    
      // Function to close the edit form
      const handleCloseEditForm = () => {
        setIsEditFormOpen(false);
        setSelectedUser(null);
      };

    */}

    const handleRowClick = (user) => {
        //setSelectedUser(user);
        //setIsEditFormOpen(true);
      };

  const employees = [
    { id: 1, firstName: 'John', lastName: 'Doe', phoneNumber: '123-456-7890', employeeId: 1, storeId: 101, role:'Standard' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', phoneNumber: '987-654-3210', employeeId: 2, storeId: 102, role:'Manager'},
    // Add more employee objects here if needed
  ];





  return (
    <div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Phone Number</th>
            <th className="px-4 py-2">Employee ID</th>
            <th className="px-4 py-2">Store ID</th>
            <th className="px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} onClick={() => handleRowClick(employee.employeeId)} className="cursor-pointer hover:bg-gray-100">
              <td className="border px-4 py-2">{employee.firstName}</td>
              <td className="border px-4 py-2">{employee.lastName}</td>
              <td className="border px-4 py-2">{employee.phoneNumber}</td>
              <td className="border px-4 py-2">{employee.employeeId}</td>
              <td className="border px-4 py-2">{employee.storeId}</td>
              <td className="border px-4 py-2">{employee.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
        
      <div class="flex flex-row-reverse">
   
      </div>
    </div>
  );
}

export default EmployeeTable;
