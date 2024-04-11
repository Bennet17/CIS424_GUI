//This is the UserManagement Component
//It is the parent of the Employee table, AddUserForm, and EditUser.js components
//Written by Brianna Kline
import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState, useLayoutEffect, useEffect } from "react";
import SideBar from "./SideBar.jsx";
import HorizontalNav from "./HorizontalNav";
import EmployeeTable from "./EmployeeTable.js";
import { useAuth } from "../AuthProvider.js";
import { useNavigate } from "react-router-dom";
import routes from "../routes.js";

const UserManagementPage = () => {
  //allows for user details to be applied throughout the website
  const auth = useAuth();
  const navigate = useNavigate();

  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing
  const curStoreName = auth.cookie.user.viewingStoreLocation; //stores the current Store we are viewing

  //useState variables for the current store name and for an array of stores to be saved
  const [storeArray, setStoreArray] = useState([]);

  //check the permissions of the logged in user on page load, passing in
  //the required permissions
  useLayoutEffect(() => {
    if (!auth.CheckAuthorization(["Team Leader", "Store Manager", "Owner"])) {
      navigate(routes.home);
    }
  });

  //UseEffect is a method that fires as soon as the component is loaded
  useEffect(() => {
    //this function will fetch all stores in the system for use in child components
    function fetchStores() {
      axios.get(
        `${process.env.REACT_APP_REQUEST_URL}ViewStores`,
        {
          headers: {
            [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY
          }
        }
      )
        .then((response) => {
          // Create an array to store the updated store array
          let updatedStoreArray = [];

          // Iterate over the response data to extract store information
          response.data.forEach(function (item) {
            // Store each store ID and location in local storage
            localStorage.setItem(item.ID, item.location);

            // Push each store object to the updated store array
            updatedStoreArray.push({
              ID: item.ID,
              location: item.location,
            });
          });

          setStoreArray(updatedStoreArray);
        })
        .catch((error) => {
        });
    }

    // Call the function to initiate the GET request with specific details
    fetchStores();
  }, [curStoreID]); // Include curStoreID in the dependency array so that useEffect runs whenever it changes

  //store the Array of stores to local storage to be used in
  localStorage.setItem("stores", JSON.stringify(storeArray));

  //return the pages child components
  return (
    <div className="flex mi-h-screen min-w-fit bg-custom-accent">
      <SideBar currentPage={8} />
      <div className="flex flex-col w-full">
        <HorizontalNav />
        <div className="flex flex-col mt-6  mx-8">
          <h1 className="text-3xl text-navy-gray font-bold ">
            Users at {curStoreName}
          </h1>
          <br />
          <div className="">
            {" "}
            <EmployeeTable storeArray={storeArray}></EmployeeTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
