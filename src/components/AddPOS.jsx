import axios from "axios";
import { useState } from "react";
import { useAuth } from "../AuthProvider.js";



function AddPOS() {

  const auth = useAuth();
  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing


  const [name, setPosName] = useState("");
  const [store, setStore] = useState("");
  const [result, setResult] = useState("");


  function handleSubmit(event) {
    event.preventDefault();

    
    axios
      .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateRegister", 
        {
          "name": name,
          "storeID": curStoreID 
        })
      .then((response) => {
        setResult("POS created successfully");
        console.log(response.data.response);
        window.location.reload(); // This will refresh the page
  
      })
      .catch((error) => {
        console.error("API request failed:", error);
       setResult("Request Failed. Try again.")
      });
  }

  return (
   
   

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-8 mb-4">
        <h2 className="text-lg font-bold mb-6">Create a New POS</h2>
        <div className="mb-6">
          <label htmlFor="posName" className="block text-gray-700 font-bold mb-2">POS Register Name:</label>
          <input
            id="posName"
            type="text"
            value={name}
            onChange={(e) => setPosName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="flex justify-between">
        <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              setPosName(''); // Clear the input value
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Add POS Register
          </button>

        </div>
      </form>
    );
    


}

export default AddPOS;