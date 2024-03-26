import React, { useState } from 'react';
import axios from 'axios';
import {useAuth} from '../AuthProvider.js';

const EditStore = (store) => {

    //console.log(store.store.location);


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


  const openModal = () => {
    setIsOpen(true);
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

  const closeModal = () => {
    setIsOpen(false);
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

  const toggleAbility = (event) =>{
    event.preventDefault();
          //this pos is currently enabled. lets disable it
          if(store.store.enabled == true ){
            if(store.store.opened == true){
              setResult("You cannot disable an open store. Please close day and try again.");
            }
            else{
            //create a disable POS request
            axios
            .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/DisableStore", 
              {
                "ID": store.store.ID,
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
        }
        if(store.store.enabled == false){
                  //create a disable POS request
                  axios
                  .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/EnableStore", 
                    {
                      "ID": store.store.ID,
                    })
                  .then((response) => {
            
                    console.log(response.data.response);
            
                    if (response.data.response == "Enabled") {
                      console.log("Store enabled");
                      window.location.reload(); // This will refresh the page
    
          
                    } else {
                      console.error("Failed to enable user");
            
                    }
            
            
                  })
                  .catch((error) => {
                    console.error("API request failed:", error);
                   // console.error( username+ " "+ name+ " "+password+ " "+ position +" " +storeID);
                  // setResult("Request Failed. Try again.")
                  });
        }
    
  }



  const handleSubmit = (event) => {
    event.preventDefault();

      //create an axios POST request to create a new user with inputs from the form
      axios
      .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/UpdateMaximums", 
        {
         "StoreId": store.store.ID,
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

   
        })
      .then((response) => {
        console.log(response.data.Message);
        if (response.data.Message === "Store and Totals updated successfully.") {
           closeModal();
            window.location.reload(); // This will refresh the page
        } else {
          //a valid API request but user was not created because there was already a user with that username
          console.error("Failed to update store");
          setResult("Failed to Update Store")
        }
      })
      //error if the API request failed
      .catch((error) => {
        console.error("API request failed:", error);
      // console.error( username+ " "+ name+ " "+password+ " "+ position +" " +storeID);
        setResult("Request Failed. Try again.")
      });
   
   
  };



  return (
    <div className="relative ml-5">
      <button
        onClick={openModal}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Edit Store: {store.store.location}
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-md w-auto">
            <span
              onClick={closeModal}
              className="absolute top-0 right-0 cursor-pointer text-gray-700 hover:text-gray-900"
            >
              &times;
            </span>
            <h2 className="text-2xl font-bold mb-4">Edit Store Information: {store.store.location} </h2>
            <h2 className="text-lg font-bold mb-4">{result}</h2>

            <form  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <p className='text font-bold mb-3'>Maximum Denominations in Registers:</p>
              <div className="grid grid-cols-3 gap-4">
              
                <div className="mb-4 col-span-1">
                  <label htmlFor="hundredRegisterMax" className="block text-gray-700 font-bold mb-2">Hundred:</label>
                  <input
                    required
                    id="hundredRegisterMax"
                    type="number"
                    defaultValue={store.store.hundredRegisterMax}

                    onChange={(e) => setHundredRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="twentyRegisterMax" className="block text-gray-700 font-bold mb-2">Twenty:</label>
                  <input
                    required
                    id="twentyRegisterMax"
                    type="number"
                    defaultValue={store.store.twentyRegisterMax}

                    onChange={(e) => setTwentyRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="fiftyRegisterMax" className="block text-gray-700 font-bold mb-2">Fifty:</label>
                  <input
                    required
                    id="fiftyRegisterMax"
                    type="number"
                   defaultValue={store.store.fiftyRegisterMax}
                    onChange={(e) => setFiftyRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>

                <div className="mb-4 col-span-3">
                    <p className="text font-bold ">Maximum Denominations in Safe:</p>
                </div>
               

                <div className="mb-4 col-span-1">
    
                  <label htmlFor="hundredMax" className="block text-gray-700 font-bold mb-2">Hundred:</label>
                  <input
                    required
                    id="hundredMax"
                    type="number"
                    defaultValue={store.store.hundredMax}

                    onChange={(e) => setHundredMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="fiftyMax" className="block text-gray-700 font-bold mb-2">Fifty:</label>
                  <input
                    required
                    id="fiftyMax"
                    type="number"
                    defaultValue={store.store.fiftyMax}

                    onChange={(e) => setFiftyMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="twentyMax" className="block text-gray-700 font-bold mb-2">Twenty:</label>
                  <input
                    required
                    id="twentyMax"
                    type="number"
                    defaultValue={store.store.twentyMax}

                    onChange={(e) => setTwentyMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="tenMax" className="block text-gray-700 font-bold mb-2">Ten:</label>
                  <input
                    required
                    id="tenMax"
                    type="number"
                    defaultValue={store.store.tenMax}

                    onChange={(e) => setTenMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="fiveMax" className="block text-gray-700 font-bold mb-2">Five:</label>
                  <input
                    required
                    id="fiveMax"
                    type="number"
                    defaultValue={store.store.fiveMax}
                    onChange={(e) => setFiveMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="twoMax" className="block text-gray-700 font-bold mb-2">Two:</label>
                  <input
                    required
                    id="twoMax"
                    type="number"
                    defaultValue={store.store.twoMax}

                    onChange={(e) => setTwoMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="oneMax" className="block text-gray-700 font-bold mb-2">One:</label>
                  <input
                    required
                    id="oneMax"
                    type="number"
                    defaultValue={store.store.oneMax}

                    onChange={(e) => setOneMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="quarterRollMax" className="block text-gray-700 font-bold mb-2">Quarter Rolls:</label>
                  <input
                    required
                    id="quarterRollMax"
                    type="number"
                    defaultValue={store.store.quarterRollMax}

                  
                    onChange={(e) => setQuarterRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="nickelRollMax" className="block text-gray-700 font-bold mb-2">Nickel Rolls:</label>
                  <input
                    required
                    id="nickelRollMax"
                    defaultValue={store.store.nickelRollMax}

                    type="number"
                   
                    onChange={(e) => setNickelRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="dimeRollMax" className="block text-gray-700 font-bold mb-2">Dime Rolls:</label>
                  <input
                    required
                    id="dimeRollMax"
                    type="number"
                    defaultValue={store.store.dimeRollMax}

                   
                    onChange={(e) => setDimeRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4 col-span-1">
                  <label htmlFor="pennyRollMax" className="block text-gray-700 font-bold mb-2">Penny Rolls:</label>
                  <input
                    required
                    id="pennyRollMax"
                    type="number"
                    defaultValue={store.store.pennyRollMax}
               
                    onChange={(e) => setPennyRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                    onClick={closeModal}
                    type="button"
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                    Save
                </button>
                <button
                    onClick={toggleAbility}
                    className="flex-1 bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {store.store.enabled ? 'Disable Store' : 'Enable Store'}

                </button>
                </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditStore;