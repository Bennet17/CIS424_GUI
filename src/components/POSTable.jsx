
import EditUser from "./EditUser"
import React, { useState } from 'react';
function POSTable() {
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

  const POS = [
    {  City: 'Flint', State: 'MI', Postal_Code: '48507', district: 1,address:'3192 S. Linden Road' , storeId: '00001', posID:'681' },
    {  City: 'Flint', State: 'MI', Postal_Code: '48507', district: 1,address:'3192 S. Linden Road' , storeId: '00001', posID:'682' },
    // Add more POS objects here if needed
  ];





  return (
    <div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">City</th>
            <th className="px-4 py-2">State</th>
            <th className="px-4 py-2">Postal Code</th>
            <th className="px-4 py-2">District</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Store ID</th>
            <th className="px-4 py-2">POS ID</th>

          </tr>
        </thead>
        <tbody>
          {POS.map((pos) => (
            <tr key={pos.posID} onClick={() => handleRowClick(POS.posID)} className="cursor-pointer hover:bg-gray-100">
              <td className="border px-4 py-2">{pos.City}</td>
              <td className="border px-4 py-2">{pos.State}</td>
              <td className="border px-4 py-2">{pos.Postal_Code}</td>
              <td className="border px-4 py-2">{pos.district}</td>
              <td className="border px-4 py-2">{pos.address}</td>
              <td className="border px-4 py-2">{pos.storeId}</td>
              <td className="border px-4 py-2">{pos.posID}</td>

            </tr>
          ))}
        </tbody>
      </table>
        
      <div class="flex flex-row-reverse">
   
      </div>
    </div>
  );
}

export default POSTable;