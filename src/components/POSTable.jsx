
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getValue } from '@testing-library/user-event/dist/utils';
function POSTable() {

  const curStoreID = localStorage.getItem('curStore');

  


    const toggleActivity = (pos)=> {
      //this pos is currently enabled. lets disable it
      if(pos.enabled == true){
        //create a disable POS request
        axios
        .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/DisableRegister", 
          {
            "ID": pos.ID,
            "name": pos.name,
            "storeID": pos.storeID,
            "enabled": pos.enabled,
            "opened": pos.opened

          })
        .then((response) => {
  
          console.log(response.data.response);
  
          if (response.data.isValid) {

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
    if(pos.enabled == false){
              //create a disable POS request
              axios
              .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/EnableRegister", 
                {
                  "ID": pos.ID,
                  "name": pos.name,
                  "storeID": pos.storeID,
                  "enabled": pos.enabled,
                  "opened": pos.opened
      
                })
              .then((response) => {
        
                console.log(response.data.response);
        
                if (response.data.isValid) {
      
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
    

    //do a get request to get all the POS's for the current store
    const [pos, setPosRegisters] = useState([]);

    const handleRowClick = (user) => {
        //setSelectedUser(user);
        //setIsEditFormOpen(true);
      };


      
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
    <td className="border px-4 py-2"><button onClick={() => toggleActivity(pos)} className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>{pos.enabled ? 'Disable' : 'Enable'}</button></td>
  </tr>
))}

        </tbody>
      </table>
        
    </div>
  );
}

export default POSTable;