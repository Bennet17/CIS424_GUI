import "../styles/PageStyles.css";
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import HorizotalNav from "./HorizontalNav";
import AddPOS from "./AddPOS.jsx";
import POSTable from "./POSTable.jsx";
import {useAuth} from '../AuthProvider.js';
import axios from "axios";

const POSManagementPage = () => {
  const auth = useAuth();
  console.log(auth.cookie.user.storeID);
  const curStoreID = auth.cookie.user.storeID_CSV[0]; //stores the current Store we are viewing
  const [curStoreName, setCurStoreName] = useState(null); // Initialize curStoreName as null


  localStorage.setItem('curStore', curStoreID); //sets current store into local storage 

  useEffect(() => {
    function fetchStoreName() {
      const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStores`;

      axios.get(url)
        .then((response) => {
          console.log('Data:', response.data);
          var jsonData = response.data;
          // Using forEach method
          jsonData.forEach(function(item) {
            if(item.ID == curStoreID){
              setCurStoreName(item.location); // Update curStoreName in the state
              console.log(item.location);
            }
            console.log(item.ID, item.location);
          });
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    // Call the function to initiate the GET request with specific details
    fetchStoreName();
  }, [curStoreID]); // Include curStoreID in the dependency array so that useEffect runs whenever it changes

  return (
    <div className="flex h-screen bg-custom-accent">
      <SideBar currentPage={8} />
      <div className="flex flex-col w-full">
        <HorizotalNav />
        <div className="flex flex-col mt-8 px-6">
          <div>
            <h2 className="text-lg font-bold mt-4 px-10 ">POS Registers at Plato's Closet: {curStoreName}</h2>
            <div className="flex mt-8 px-6"> 
              <div className="w-1/2 mr-4"> 
                <POSTable />
              </div>
              <div className="w-1/2 mt-4"> 
                <AddPOS />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default POSManagementPage;
