import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../routes.js";
import { useAuth } from "../AuthProvider.js";
import Logo from "../newLogo.png";
import axios from "axios";
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import "primeicons/primeicons.css";

function SelectStore() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [selectedStoreID, setSelectedStoreID] = useState(0);
  const [selectedStoreName, setSelectedStoreName] = useState("");
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Fetch the list of stores from the API
    axios
      .get(`${process.env.REACT_APP_REQUEST_URL}ViewStores`, {
        headers: {
          [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY,
        },
      })
      .then((response) => {
        const allStores = response.data;
        // Filter stores based on user's storeID_CSV

        const filteredStores = allStores.filter((store) =>
          auth.cookie.user.storeID_CSV.includes(store.ID.toString())
        );

        // This is being done for render formatting
        if (filteredStores.length > 5) {
          // Declare emtpy two-dimensional array for user's stores
          const storeCols = Math.ceil(filteredStores.length / 5);
          let segmentedStores = new Array(storeCols);
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

  // Maintain record of the store selected
  function handleStoreSelection(storeID, storeName) {
    setSelectedStoreID(storeID);
    setSelectedStoreName(storeName);
  }

  // Change store-relevant info in the cookie and proceed to homepage
  function handleSubmit(event) {
    event.preventDefault();

    auth.setUserStores(selectedStoreID, selectedStoreID, selectedStoreName);
    navigate(routes.home);
  }

  return (
    <div className="flex bg-custom-accent min-h-screen min-w-fit flex-1 flex-col justify-center px-6 py-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto mb-12 h-30 w-auto"
          src={Logo}
          alt="Plato's Closet Logo"
        />
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-navy-gray">
          Choose Location
        </h2>
      </div>

      <div className="mt-10 flex flex-wrap justify-center">
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
                    <label
                      htmlFor={store.ID}
                      className="text-sm text-navy-gray"
                    >
                      {store.location}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              label="Continue"
              rounded
              icon="pi pi-arrow-right"
              size="small"
              className="p-button-raised p-button-primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default SelectStore;
