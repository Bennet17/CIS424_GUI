import axios from "axios";
import { useState } from "react";
import { useAuth } from "../AuthProvider.js";


//page function definition
const Sampletext = () => {
    
    const auth = useAuth();
    console.log(auth.user.name);
    
    //return page data
    return (
      <p>{auth.user.name}</p>
      
    )
  }

function AddPOS() {

  const [name, posName] = useState("");
  const [store, setStore] = useState("");
  const [result, setResult] = useState("");


  function handleSubmit(event) {
    event.preventDefault();

    
    axios
      .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateRegister", 
        {
          "name": name,
          "storeID": 0 //get Store ID
        })
      .then((response) => {

        console.log(response.data.response);

        /*
        if (response.data.response == "User created successfully.") {
          console.log("User was created!");
          setResult("User Successfully Created.")

        } else {
          console.error("Failed to create user");
          setResult("Username already taken. Try again")

        }
*/
      })
      .catch((error) => {
        console.error("API request failed:", error);
       // console.error( username+ " "+ name+ " "+password+ " "+ position +" " +storeID);
       setResult("Request Failed. Try again.")
      });
  }

  return (
<form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <h2 className="text-lg font-bold mb-4">Create a New POS</h2>
  <h2 className="text-lg font-bold mb-4">{result}</h2>
  <div className="grid grid-cols-3 gap-4">
    <div className="mb-4">
      <label htmlFor="posName" className="block text-gray-700 font-bold mb-2"> POS Register Name:</label>
      <input
        id="posName"
        type="text"
        value={name}
        onChange={(e) => posName(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="store" className="block text-gray-700 font-bold mb-2">Store:</label>
      <input
        id="store"
        readOnly
        type="text"
        value={store}
        onChange={(e) => setStore(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  </div>
  <div className="grid grid-cols-3 gap-4">

  </div>
  <div className="flex justify-between">
    <button
      type="button"
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Add POS Register
    </button>
  </div>
</form>



  );
}

export default AddPOS;