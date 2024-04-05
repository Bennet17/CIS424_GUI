import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../routes.js";
import { useAuth } from "../AuthProvider.js";
import Logo from "../newLogo.png";
import axios from "axios";

function SelectStore() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [selectedStoreID, setSelectedStoreID] = useState(0);
  const [selectedStoreName, setSelectedStoreName] = useState("");
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Fetch the list of stores from the API
    axios
      .get("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStores")
      .then((response) => {
        const allStores = response.data;
        // Filter stores based on user's storeID_CSV

        const filteredStores = allStores.filter((store) =>
          auth.cookie.user.storeID_CSV.includes(store.ID.toString())
        );

        // This is being done for render formatting
        if (filteredStores.length > 5) {
          // Declare emtpy two-dimensional array for user's stores
          const storeRows = Math.ceil(filteredStores.length / 5);
          let segmentedStores = new Array(storeRows);
          for (let i = 0; i < segmentedStores.length; i++) {
            segmentedStores[i] = new Array(5);
          }

          let counter = 0;
          for (let i = 0; i < segmentedStores.length; i++) {
            for (let j = 0; j < 5; j++) {
              if (filteredStores[counter]) {
                segmentedStores[i][j] = filteredStores[counter];
                counter++;
              }
            }
          }

          // Set formatted filtered stores
          setStores(segmentedStores);
        } else {
          // This bit's just for consistent object formatting, dynamic rendering and such
          let segmentedStores = new Array(1);
          segmentedStores[0] = filteredStores;
          setStores(segmentedStores);
        }
      })
      .catch((error) => {
        console.error("Error fetching stores:", error);
      });
  }, []); // Run only once on component mount

  function handleStoreSelection(storeID, storeName) {
    setSelectedStoreID(storeID);
    setSelectedStoreName(storeName);
  }

  function handleSubmit(event) {
    event.preventDefault();

    auth.setUserStores(selectedStoreID, selectedStoreID, selectedStoreName);
    navigate(routes.home);
  }

  return (
    <div className="flex bg-custom-accent min-h-screen flex-1 flex-col justify-center px-6 py-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto mb-12 h-30 w-auto"
          src={Logo}
          alt="Plato's Closet Logo"
        />
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Choose Location
        </h2>
        
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            {stores.map((col, colIndex) => (
              <div key={colIndex} className="mx-2">
                {col.map((store, index) => (
                  <div key={store.ID} className="flex items-center mb-4">
                    <input
                      type="radio"
                      id={store.ID}
                      name="store"
                      value={store.ID}
                      defaultChecked={colIndex === 0 && index === 0}
                      onChange={() =>
                        handleStoreSelection(store.ID, store.location)
                      }
                      className="mr-2"
                    />
                    <label htmlFor={store.ID} className="text-sm text-gray-900">
                      {store.location}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
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
