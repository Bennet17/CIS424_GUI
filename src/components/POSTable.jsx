
import React, { useState } from 'react';
function POSTable() {

    //do a get request to get all the POS's for the current store

    const handleRowClick = (user) => {
        //setSelectedUser(user);
        //setIsEditFormOpen(true);
      };

  const POS = [
    {  City: 'Flint', State: 'MI', Postal_Code: '48507', district: 1,address:'3192 S. Linden Road' , name: 'POS 1 ', posID:'681' },
    {  City: 'Flint', State: 'MI', Postal_Code: '48507', district: 1,address:'3192 S. Linden Road' , name: 'POS 2', posID:'682' },
    // Add more POS objects here if needed
  ];


  return (
    <div>
  <h2 className="text-lg font-bold mb-4">POS Registers at: -insert current store</h2>
      <table className="w-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">POS Name</th>
     

          </tr>
        </thead>
        <tbody>
          {POS.map((pos) => (
            <tr key={pos.name} onClick={() => handleRowClick(POS.name)} className="cursor-pointer hover:bg-gray-100">
              <td className="border px-4 py-2">{pos.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
        
    </div>
  );
}

export default POSTable;