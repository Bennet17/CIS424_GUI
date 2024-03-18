
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getValue } from '@testing-library/user-event/dist/utils';
import {useAuth} from '../AuthProvider.js';

function StoreTable() {

  const auth = useAuth();
//  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing


    const toggleActivity = (store)=> {
      //this store is currently enabled. lets disable it
      if(store.enabled == true){
        //create a disable POS request
        axios
        .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/DisableStore", 
          {
            "ID": store.ID,
          })
        .then((response) => {
  
          console.log(response.data.response);
  
          if (response.data.response == "Disabled") {
              console.log("Store successfully disabled");
              window.location.reload(); // This will refresh the page

          } else {
            console.error("Failed to disable store");
  
          }
  
  
        })
        .catch((error) => {
          console.error("API request failed:", error);
         // console.error( username+ " "+ name+ " "+password+ " "+ position +" " +storeID);
         //setResult("Request Failed. Try again.")
        });
    }
    if(store.enabled == false){
              //create a disable POS request
              axios
              .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/EnableStore", 
                {
                  "ID": pos.ID,
                })
              .then((response) => {
        
                console.log(response.data.response);
        
                if (response.data.response == "Enabled") {
                  console.log("Register enabled");
                  window.location.reload(); // This will refresh the page

      
                } else {
                  console.error("Failed to enable store");
        
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
    const [stores, setStoresArray] = useState([]);

    const handleRowClick = (user) => {

      };


      
  useEffect(() => {
    function  fetchPosTable()    {
      const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStores`;

      axios.get(url)
        .then((response) => {
          console.log('Data:', response.data);

          // Update the state variable 'pos' with the fetched data
          setStoresArray(response.data.map(stores => ({
            ID: stores.ID,
            location: stores.name,
            enabled:stores.enabled,
            opened:stores.opened
            
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
            {/* <th className="px-4 py-2"></th> */}


          </tr>
        </thead>
        <tbody>
        {stores.map((store) => (
            <tr 
              key={store.location} 
              onClick={() => handleRowClick(store.location)} 
              className={`cursor-pointer hover:bg-gray-100 ${pos.enabled ? '' : 'bg-gray-300'}`}
            >
              <td className="border px-4 py-2">{store.location}</td>
              <td className="border px-4 py-2">{store.opened ? 'Open' : 'Closed'}</td>
              <td className="border px-4 py-2">
                <button onClick={() => toggleActivity(store)} className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                  {pos.enabled ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}


        </tbody>
      </table>
        
    </div>
  );
}

export default StoreTable;