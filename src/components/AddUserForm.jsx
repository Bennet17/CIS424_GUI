import axios from "axios";
import { useState } from "react";

function AddUser() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [storeID, setStoreID] = useState("");
  const [result, setResult] = useState("");


  function handleSubmit(event) {
    event.preventDefault();

    const name = lastname + ", "+firstname;
    
    axios
      .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateUser", 
        {
          "username": username,
          "name": name,
          "password": password,
          "position": position,
          "storeID": 0
        })
      .then((response) => {

        console.log(response.data.response);

        if (response.data.response == "User created successfully.") {
          console.log("User was created!");
          setResult("User Successfully Created.")

        } else {
          console.error("Failed to create user");
          setResult("Username already taken. Try again")

        }


      })
      .catch((error) => {
        console.error("API request failed:", error);
       // console.error( username+ " "+ name+ " "+password+ " "+ position +" " +storeID);
       setResult("Request Failed. Try again.")
      });
  }

  return (
<form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <h2 className="text-lg font-bold mb-4">Add User</h2>
  <h2 className="text-lg font-bold mb-4">{result}</h2>
  <div className="grid grid-cols-3 gap-4">
    <div className="mb-4">
      <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First Name:</label>
      <input
        id="firstName"
        type="text"
        value={firstname}
        onChange={(e) => setFirstName(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Last Name:</label>
      <input
        id="lastName"
        type="text"
        value={lastname}
        onChange={(e) => setLastName(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
      <input
        id="username"
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  </div>
  <div className="grid grid-cols-3 gap-4">
    <div className="mb-4">
      <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
      <input
        id="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="role" className="block text-gray-700 font-bold mb-2">Role:</label>
      <select
        id="role"
        onChange={(e) => setPosition(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="Employee">Employee</option>
        <option value="Manager">Manager</option>
      </select>
    </div>
    <div className="mb-4">
      <label htmlFor="storeID" className="block text-gray-700 font-bold mb-2">Store ID:</label>
      <select
        id="storeID"
        multiple
        onChange={(e) => setStoreID(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="0">Store 1</option>
        <option value="1">Store 2</option>
      </select>
    </div>
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
      Add Employee
    </button>
  </div>
</form>



  );
}

export default AddUser;
