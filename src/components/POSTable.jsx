
import React, { useState, useEffect } from 'react';
import axios from 'axios';
function POSTable() {

    //do a get request to get all the POS's for the current store
    const [pos, setPosRegisters] = useState([]);

    const handleRowClick = (user) => {
        //setSelectedUser(user);
        //setIsEditFormOpen(true);
      };


      
  useEffect(() => {
    function  fetchPosTable()    {
      const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewRegistersByStoreID?storeID=0`;

      axios.get(url)
        .then((response) => {
          console.log('Data:', response.data);

          // Update the state variable 'pos' with the fetched data
          setPosRegisters(response.data.map(pos => ({
            ID: pos.ID,
            name: pos.name,
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
      <table className="w-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">POS Name</th>
            <th className="px-4 py-2">POS Current Status</th>
            <th className="px-4 py-2"></th>


          </tr>
        </thead>
        <tbody>
        {pos.map((pos) => (
  <tr key={pos.name} onClick={() => handleRowClick(pos.name)} className="cursor-pointer hover:bg-gray-100">
    <td className="border px-4 py-2">{pos.name}</td>
    <td className="border px-4 py-2">{pos.opened ? 'Open' : 'Closed'}</td>
    <td className="border px-4 py-2">{pos.enabled ? 'Enabled' : 'Disabled'}</td>
  </tr>
))}

        </tbody>
      </table>
        
    </div>
  );
}

export default POSTable;