import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../routes.js";
import { useAuth } from "../AuthProvider.js";
import Logo from "../newLogo.png";
import axios from "axios";

function SelectStore() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [selectedStoreID, setSelectedStoreID] = useState(null);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Fetch the list of stores from the API
    axios
      .get("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStores")
      .then((response) => {
        const allStores = response.data;
        // Filter stores based on user's storeID_CSV
        console.log(auth.cookie.user.storeID_CSV);
        console.log(allStores);
        const filteredStores = allStores.filter((store) => {
          // Check if any of the store IDs in storeID_CSV matches the current store's ID
          return auth.cookie.user.storeID_CSV.some((storeID) => {
              const [storeIdValue] = storeID.split("-"); // Extract the store ID part
              return storeIdValue === store.ID.toString(); // Check if the store ID matches
          });
      });
        // Set filtered stores
        //console.log(filteredStores);
        setStores(filteredStores);
      })
      .catch((error) => {
        console.error("Error fetching stores:", error);
      });
  }, []); // Run only once on component mount

  function handleStoreSelection(storeID) {
    setSelectedStoreID(storeID);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (selectedStoreID) {
      // Set viewing and working store with store selection
      auth.setUserStores(selectedStoreID);
      navigate(routes.home); // Navigate to home page after store selection
    } else {
      // Show an error message if no store is selected
      alert("Please select a store.");
    }
  }

  return (
    <div className="flex bg-custom-accent min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto mb-12 h-30 w-auto"
          src={Logo}
          alt="Plato's Closet Logo"
        />
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Choose Your Shift Location
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            {stores.map((store) => (
              <div key={store.ID} className="flex items-center w-1/4 mb-4">
                <input
                  type="radio"
                  id={store.ID}
                  name="store"
                  value={store.ID}
                  checked={selectedStoreID === store.ID}
                  onChange={() => handleStoreSelection(store.ID)}
                  className="mr-2"
                />
                <label htmlFor={store.ID} className="text-sm text-gray-900">
                  {store.location}
                </label>
              </div>
            ))}
            <button
              type="submit"
              className="w-3/4 mt-6 bg-indigo-600 py-2 text-sm font-semibold text-white rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SelectStore;
