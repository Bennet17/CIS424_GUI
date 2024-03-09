//This is the UserManagement Component
//It is the parent of the Employee table, AddUserForm, and EditUser.js components
//Written by Brianna Kline
import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar.jsx";
import HorizotalNav from "./HorizontalNav";
import EmployeeTable from "./EmployeeTable.js";
import AddUserForm from "./AddUserForm.jsx"
import {useAuth} from '../AuthProvider.js';



const UserManagementPage = () => {

  //allows for user details to be applied throughout the website
  const auth = useAuth();

  //console.log(auth.cookie.user.storeID);

  
  const curStoreID = auth.cookie.user.storeID; //stores the current Store we are viewing
  localStorage.setItem('curStore', curStoreID); //sets current store into local storage 

  
  //useState variables for the current store name and for an array of stores to be saved
  const [curStoreName, setCurStoreName] = useState(null); // Initialize curStoreName as null
  const[storeArray,setStoreArray] = useState([]);

  //UseEffect is a method that fires as soon as the component is loaded
  useEffect(() => {
    //this function will fetch all stores in the system for use in child components
    function fetchStores() {
      const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStores`;

      axios.get(url)
        .then((response) => {
         
          //create an Array of stores from the JSON response, containing store ID and store Location
          const updatedStoreArray = response.data.map(store => ({
            ID: store.ID,
            location: store.location
        }));

         setStoreArray(updatedStoreArray); //use usestate function to set storeArray to equal array from API request

          //this loop stores the currentStore Name based on the current store ID
          response.data.forEach(function(item) {
            if(item.ID === curStoreID){
              setCurStoreName(item.location); 
              console.log(curStoreName);
              localStorage.setItem('curStoreName', curStoreName); 

            }
            localStorage.setItem(item.ID, item.location);
          });


        })
        .catch((error) => {
          //could not get Store Data from API
          console.error('Error fetching data:', error);
        });
    }


    // Call the function to initiate the GET request with specific details
    fetchStores();
  }, [curStoreID]); // Include curStoreID in the dependency array so that useEffect runs whenever it changes


            //store the Array of stores to local storage to be used in 
            localStorage.setItem('stores', JSON.stringify(storeArray)); 

  //return the pages child components
  return (
    <div className="flex h-screen bg-custom-accent">
      <SideBar currentPage={7} />
      <div className="flex flex-col w-full">
        <HorizotalNav />
          <div class="flex flex-col mt-4 px-6">
          <h2 className="text-lg font-bold mt-4 px-10 ">Users at Plato's Closet: {curStoreName}</h2>

              <div> <EmployeeTable storeArray={storeArray}></EmployeeTable></div>

           </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
