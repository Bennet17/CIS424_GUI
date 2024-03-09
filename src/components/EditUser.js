import React, { useState } from 'react';
import axios from 'axios';

const EditUser = (user) => {



    console.log(user.user.name);
    const name = user.user.name;
    const nameArray = name.split(", ");
    const lastName = nameArray[0];
  const firstName = nameArray[1];


  const [lastname, setLastName] = useState('');
  const [firstname, setFirstName] = useState('');
  const [username, setUsername] = useState(user.user.username);
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState(user.user.position);
  const [storeIDs, setStoreID] = useState(user.user.storeID);
  const[managerStoreIDs, setManagerStores] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState("");


    const curStore = localStorage.getItem('curStore');
    const curStoreName = localStorage.getItem('curStoreName');

    //console.log(curStore +'in form');
    // Retrieve the serialized string from local storage
    const storedArrayString = localStorage.getItem('stores');
  
    // Parse the string back into an array
    const storeArray = JSON.parse(storedArrayString);


  const [isOpen, setIsOpen] = useState(false);



  const handleCheckboxChange = (e, storeID) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setStoreID(storeID);
      //setStoreID([storeIDs, storeID]); // Add the store ID to the selectedStores array
    } else {
      setStoreID(storeIDs.filter(id => id !== storeID)); // Remove the store ID from the selectedStores array
    }
  };
  


  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setLastName('')
    setFirstName('')
    setUsername('')
    setPosition('')
    setManagerStores('')
    setStoreID('')
    
  };

  const handleSubmit = (event) => {
    event.preventDefault();

      //create an axios POST request to create a new user with inputs from the form
      axios
      .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/EditUser", 
        {
         "ID": user.user.ID,
         "storeID": storeIDs,
         "username": username,
         "name": lastName+", "+firstName,
         "position": position,
         "managerCSV": managerStoreIDs
        })
   
   
   
      .then((response) => {
        //console.log(response.data.response);
        
        //if the response data was not an API error
        //the following line indicates a successful entry
        if (response.data.response == "User Updated successfully.") {
          //console.log("User was created!");
           closeModal();
             setResult("User Successfully Created.")
            window.location.reload(); // This will refresh the page
   
        } else {
          //a valid API request but user was not created because there was already a user with that username
          console.error("Failed to create user");
          setResult("Username already taken. Try again")
   
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
    <div className="relative ">
      <button
        onClick={openModal}
       className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 ml-5 rounded focus:outline-none focus:shadow-outline"

      >
        Edit User: {user.user.name}
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md w-auto">
            <span onClick={closeModal} className="absolute top-0 right-0 cursor-pointer text-gray-700 hover:text-gray-900">&times;</span>
            <h2 className="text-2xl font-bold mb-4">Edit User Information</h2>
            <h2 className="text-lg font-bold mb-4">{result}</h2>
           <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <div className="grid grid-cols-3 gap-4">
    <div className="mb-4">
      <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First Name:</label>
      <input
        required
        id="firstName"
        type="text"
        defaultValue={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Last Name:</label>
      <input
        required
        id="lastName"
        type="text"
        defaultValue={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
      <input
        required
        id="username"
        type="text"
        defaultValue={user.user.username}
        onChange={(e) => setUsername(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  </div>

  <div className="grid grid-cols-3 gap-4 mb-4">
    <div>
      <legend className="block text-gray-700 font-bold mb-2">Role:</legend>
      <div className="flex items-center">
        <input
          type="radio"
          id="employee"
          name="role"
          value="Employee"
          defaultChecked={user.user.position === "Employee"}
          onChange={(e) => setPosition(e.target.value)}
          className="mr-2"
        />
        <label htmlFor="employee" className="mr-4">Employee</label>
        <input
          type="radio"
          id="manager"
          name="role"
          value="Manager"
          defaultChecked={user.user.position === "Manager"}
          onChange={(e) => setPosition(e.target.value)}
          className="mr-2"
        />
        <label htmlFor="manager">Manager</label>
      </div>
    </div>

    <div>
      <legend className="block text-gray-700 font-bold mb-2 ">Store:</legend>
      {storeArray.map(item => (
        <div key={item.ID} className="mb-2 flex items-center">
          <input
            type="checkbox"
            id={`store${item.ID}`}
            name="store"
            value={item.ID}
            defaultChecked={item.location === curStoreName}
            onChange={(e) => setStoreID(e.target.value)}
            className="mr-2"
          />
          <label htmlFor={`store${item.ID}`}>{item.location}</label>
        </div>
      ))}
    </div>
  </div>
  <div className="flex justify-between">
    <button
      type="button"
      onClick={closeModal}
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Cancel
    </button>

    <button
      type="submit"
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Save
    </button>

    <button
      type="submit"
      className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Disable User
    </button>
  </div>
</form>

          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;