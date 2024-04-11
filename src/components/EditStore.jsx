//this component provides a form interface for editing store name and money settings
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import "primeicons/primeicons.css";

const EditStore = (store) => {

  //declare variables
  const [storeID, setStoreID] = useState(store.store.ID);
  const [location, setLocation] = useState(store.store.location);
  const [hundredRegisterMax, setHundredRegisterMax] = useState('');
  const [twentyRegisterMax, setTwentyRegisterMax] = useState('');
  const [fiftyRegisterMax, setFiftyRegisterMax] = useState('');
  const [hundredMax, setHundredMax] = useState('');
  const [fiftyMax, setFiftyMax] = useState('');
  const [twentyMax, setTwentyMax] = useState('');
  const [tenMax, setTenMax] = useState('');
  const [fiveMax, setFiveMax] = useState('');
  const [twoMax, setTwoMax] = useState('');
  const [oneMax, setOneMax] = useState('');
  const [quarterRollMax, setQuarterRollMax] = useState('');
  const [nickelRollMax, setNickelRollMax] = useState('');
  const [dimeRollMax, setDimeRollMax] = useState('');
  const [pennyRollMax, setPennyRollMax] = useState('');
  const [result, setResult] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  //this form handles pre-populating the the variables / input boxes with the stores current settings that are passed in by StoreTable selection
  const openModal = () => {
    setIsOpen(true);
    setLocation(store.store.location);
    setHundredRegisterMax(store.store.hundredRegisterMax);
    setTwentyRegisterMax(store.store.twentyRegisterMax);
    setFiftyRegisterMax(store.store.fiftyRegisterMax);
    setHundredMax(store.store.hundredMax);
    setFiftyMax(store.store.fiftyMax);
    setTwentyMax(store.store.twentyMax);
    setTenMax(store.store.tenMax);
    setFiveMax(store.store.fiveMax);
    setTwoMax(store.store.twoMax);
    setOneMax(store.store.oneMax);
    setQuarterRollMax(store.store.quarterRollMax);
    setNickelRollMax(store.store.nickelRollMax);
    setDimeRollMax(store.store.dimeRollMax);
    setPennyRollMax(store.store.pennyRollMax);
  };

  //this method handles closing the edit form when a user wants to cancel or does not submit
  //it resets all state variables for the next time the modal is opened
  const closeModal = () => {
    setIsOpen(false);
    setLocation('');
    setStoreID('');
    setLocation('');
    setHundredRegisterMax('');
    setTwentyRegisterMax('');
    setFiftyRegisterMax('');
    setHundredMax('');
    setFiftyMax('');
    setTwentyMax('');
    setTenMax('');
    setFiveMax('');
    setTwoMax('');
    setOneMax('');
    setQuarterRollMax('');
    setNickelRollMax('');
    setDimeRollMax('');
    setPennyRollMax('');
    setResult('');

  };
  //this method handles the enable/disable functionality for a store
  const toggleAbility = (event) => {
    event.preventDefault(); //prevent the default refresh 

    //this store is currently enabled. lets disable it
    if (store.store.enabled == true) {
      //first check if the store has been opened for the day
      if (store.store.opened == true) {
        setResult("You cannot deactivate an open store. Please close day and try again."); //alert user
      }
      else {
        //store is closed; create a disable POS request
        axios.post(
          process.env.REACT_APP_REQUEST_URL+`DisableStore`,
          {
            "ID": store.store.ID,
          },
          {
            headers: {
              [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY
            }
          }
        )
        .then((response) => {
          if (response.data.response === "Disabled") {
            setResult("Store successfully deactivated");
            window.location.reload(); // This will refresh the page
          } else {
            setResult("Failed to deactivate store");
          }
        })
        .catch((error) => {
          setResult("Request Failed. Try again.");
        });
        
      }
    }
    if (store.store.enabled == false) {
      //create a enable POS request if the store is disabled; pass the store ID to the DB
      axios.post(
        process.env.REACT_APP_REQUEST_URL+`EnableStore`,
        {
          "ID": store.store.ID,
        },
        {
          headers: {
            [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY
          }
        }
      )
        .then((response) => {
          if (response.data.response == "Enabled") {
            setResult("Store enabled");
            window.location.reload(); // This will refresh the page
          } else {
            setResult("Failed to enable user");
          }


        })
        .catch((error) => {
           setResult("Request Failed. Try again.")
        });
    }
  }

  //this method handled the store edit updates
  const handleSubmit = (event) => {
    event.preventDefault(); //prevent auto refresh

    axios.post(
      process.env.REACT_APP_REQUEST_URL+`UpdateMaximums`,
      {
        "StoreId": store.store.ID,
        "location": location,
        "Enabled": store.store.enabled,
        "Opened": store.store.opened,
        "Hundred_Register": parseInt(hundredRegisterMax),
        "Fifty_Register": parseInt(fiftyRegisterMax),
        "Twenty_Register": parseInt(twentyRegisterMax),
        "Hundred": parseInt(hundredMax),
        "Fifty": parseInt(fiftyMax),
        "Twenty": parseInt(twentyMax),
        "Ten": parseInt(tenMax),
        "Five": parseInt(fiveMax),
        "Two": parseInt(twoMax),
        "One": parseInt(oneMax),
        "QuarterRoll": parseInt(quarterRollMax),
        "DimeRoll": parseInt(dimeRollMax),
        "NickelRoll": parseInt(nickelRollMax),
        "PennyRoll": parseInt(pennyRollMax)
      },
      {
        headers: {
          [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY
        }
      }
    )
    .then((response) => {
      if (response.data.Message === "Store and Totals updated successfully.") {
        //successful edit
        closeModal();
        window.location.reload(); // This will refresh the page
      } else {
        //a valid API request but some error
        setResult("Failed to Update Store")
      }
    })
    //error if the API request failed
    .catch((error) => {
      setResult("Request Failed. Try again.")
    });
    
  };


  return (
    <div className="relative ml-5">
      <Button
        onClick={openModal}
        label={`Edit ${store.store.location}`}
        rounded
        size="small"
        icon="pi pi-plus"
        className="p-button-primary p-button-raised"
        style={{ marginRight: '0.15rem' }}
      />

      {isOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-md w-auto">
            <span
              onClick={closeModal}
              className="absolute top-0 right-0 cursor-pointer text-gray-700 hover:text-gray-900"
            >
              &times;
            </span>
            <h2 className="text-2xl font-bold mb-2">Edit Store Information: {store.store.location} </h2>
            <h2 className="text-lg font-bold mb-2">{result}</h2>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-2">
              <div className="grid grid-cols-3 gap-4">
                <div className="mb-2 col-span-1">
                  <label htmlFor="location" className="block text-gray-700 font-bold mb-2">Store Name:</label>
                  <input
                    required
                    id="location"
                    defaultValue={store.store.location}
                    type="text"
                    onChange={(e) => setLocation(e.target.value)}
                    className="box-border text-center py-1 px-1 mb-4 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <p className='text font-bold mb-3'>Maximum Denominations in Registers:</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="mb-2 col-span-1">
                  <label htmlFor="hundredRegisterMax" className="block text-gray-700 font-bold mb-2">Hundred:</label>
                  <input
                    required
                    id="hundredRegisterMax"
                    type="number"
                    defaultValue={store.store.hundredRegisterMax}
                    min="0" 
                    step="1" 
                    onChange={(e) => setHundredRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="fiftyRegisterMax" className="block text-gray-700 font-bold mb-2">Fifty:</label>
                  <input
                    required
                    id="fiftyRegisterMax"
                    type="number"
                    min="0" 
                    step="1" 
                    defaultValue={store.store.fiftyRegisterMax}
                    onChange={(e) => setFiftyRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="twentyRegisterMax" className="block text-gray-700 font-bold mb-2">Twenty:</label>
                  <input
                    required
                    id="twentyRegisterMax"
                    type="number"
                    min="0" 
                    step="1" 
                    defaultValue={store.store.twentyRegisterMax}

                    onChange={(e) => setTwentyRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>

                <div className="mb-2 col-span-3">
                  <p className="text font-bold ">Maximum Denominations in Safe:</p>
                </div>


                <div className="mb-2 col-span-1">

                  <label htmlFor="hundredMax" className="block text-gray-700 font-bold mb-2">Hundred:</label>
                  <input
                    required
                    id="hundredMax"
                    type="number"
                    min="0" 
                    step="1" 
                    defaultValue={store.store.hundredMax}
                    onChange={(e) => setHundredMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="fiftyMax" className="block text-gray-700 font-bold mb-2">Fifty:</label>
                  <input
                    required
                    id="fiftyMax"
                    type="number"
                    min="0" 
                    step="1" 
                    defaultValue={store.store.fiftyMax}
                    onChange={(e) => setFiftyMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="twentyMax" className="block text-gray-700 font-bold mb-2">Twenty:</label>
                  <input
                    required
                    id="twentyMax"
                    type="number"
                    min="0" 
                    step="1" 
                    defaultValue={store.store.twentyMax}
                    onChange={(e) => setTwentyMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="tenMax" className="block text-gray-700 font-bold mb-2">Ten:</label>
                  <input
                    required
                    id="tenMax"
                    type="number"
                    defaultValue={store.store.tenMax}
                    min="0" 
                    step="1" 
                    onChange={(e) => setTenMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="fiveMax" className="block text-gray-700 font-bold mb-2">Five:</label>
                  <input
                    required
                    id="fiveMax"
                    type="number"
                    min="0" 
                    step="1" 
                    defaultValue={store.store.fiveMax}
                    onChange={(e) => setFiveMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="twoMax" className="block text-gray-700 font-bold mb-2">Two:</label>
                  <input
                    required
                    id="twoMax"
                    type="number"
                    defaultValue={store.store.twoMax}
                    min="0" 
                    step="1" 
                    onChange={(e) => setTwoMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="oneMax" className="block text-gray-700 font-bold mb-2">One:</label>
                  <input
                    required
                    id="oneMax"
                    type="number"
                    defaultValue={store.store.oneMax}
                    min="0" 
                    step="1" 
                    onChange={(e) => setOneMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="quarterRollMax" className="block text-gray-700 font-bold mb-2">Quarter Rolls:</label>
                  <input
                    required
                    id="quarterRollMax"
                    type="number"
                    defaultValue={store.store.quarterRollMax}
                    min="0" 
                    step="1" 
                    onChange={(e) => setQuarterRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="nickelRollMax" className="block text-gray-700 font-bold mb-2">Nickel Rolls:</label>
                  <input
                    required
                    id="nickelRollMax"
                    defaultValue={store.store.nickelRollMax}
                    min="0" 
                    step="1" 
                    type="number"
                    onChange={(e) => setNickelRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="dimeRollMax" className="block text-gray-700 font-bold mb-2">Dime Rolls:</label>
                  <input
                    required
                    id="dimeRollMax"
                    type="number"
                    min="0" 
                    step="1" 
                    defaultValue={store.store.dimeRollMax}
                    onChange={(e) => setDimeRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="pennyRollMax" className="block text-gray-700 font-bold mb-2">Penny Rolls:</label>
                  <input
                    required
                    id="pennyRollMax"
                    type="number"
                    min="0" 
                    step="1" 
                    defaultValue={store.store.pennyRollMax}
                    onChange={(e) => setPennyRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  label="Cancel"
                  onClick={closeModal}
                  className="p-button-secondary p-button-raised"
                  rounded
                  size="medium"
                  icon="pi pi-times"
                />
                <Button
                  label="Submit"
                  type="submit"
                  className="p-button-primary p-button-raised"
                  rounded
                  size="medium"
                  icon="pi pi-check"
                  style={{ width: '200px' }}
                />
                <Button
                  onClick={toggleAbility}
                  label={store.store.enabled ? 'Deactivate Store' : 'Activate Store'}
                  className={store.store.enabled ? "p-button-danger p-button-raised" : "p-button-success p-button-raised"}
                  rounded
                  size="medium"
                  icon={store.store.enabled ? "pi pi-times" : "pi pi-check"}
                />
                {/* <button
                  onClick={toggleAbility}
                  className="flex-1 bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {store.store.enabled ? 'Deactivate Store' : 'Activate Store'}

                </button> */}
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditStore;