//This component was written by Brianna KLine
//This componenet serves as an interface to edit user information in the DB
//The main purpose is to retrieve user information, parse it out, and post it back if edits have been made
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthProvider.js';


const EditUser = (user) => {

  const auth = useAuth();

  //DECLARE VARIABLES
  //parse out the entire name into a first and last name field for editing
  const name = user.user.name;
  const nameArray = name.split(", ");
  let lastName = nameArray[0];
  let firstName = nameArray[1];

  const [lastname, setLastName] = useState('');
  const [firstname, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [storeIDs, setStoreID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStores, setSelectedStores] = useState([]);


  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing
  const curStoreName = auth.cookie.user.viewingStoreLocation; //stores the current Store we are viewing


  // Retrieve the serialized string from local storage
  const storedArrayString = localStorage.getItem('stores');

  // Parse the string back into an array
  const storeArray = JSON.parse(storedArrayString);



  //this method is used to make at least one checkbox checked
  const handleCheckboxChange = (e, id) => {
    const isChecked = e.target.checked;

    // Get all checkbox elements
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    let count = 0;

    // Iterate through checkboxes
    checkboxes.forEach((checkbox) => {
      // Check if the checkbox is checked
      if (checkbox.checked) {
        count++;
      }
    });

    // Ensure at least one checkbox is checked
    if (!isChecked && count < 1) {
      // Display an error message or prevent the action
      alert("At least one store must be selected.");
      // Check the current checkbox again
      e.target.checked = true;

    }
  };


  //this method is used to capture the checkboxes that are selected on submit and creates a csv
  function getCSV() {
    let temp = "";

    // Get all checkbox elements
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Iterate through checkboxes
    checkboxes.forEach((checkbox) => {
      // Check if the checkbox is checked
      if (checkbox.checked) {
        console.log(`Checkbox with value ${checkbox.value} is selected.`);
        temp += checkbox.value + ","

      }
    });
    //chop off the last comma
    let csv = temp.substring(0, temp.length - 1);

    return csv;
  }
  // retrieve active owners to prevent disable of owner
  let numActiveOwners = localStorage.getItem("numberOfActiveOwners");

  //this handles default values for the user's information to populate each input box for first name, last name, and username
  const openModal = () => {
    setIsOpen(true);
    setUsername(user.user.username);
    setPosition(user.user.position);
    const name = user.user.name;
    const nameArray = name.split(", ");
    setLastName(nameArray[0]);
    setFirstName(nameArray[1]);
  };

  //this handles the closing of the modal when a user doesnt submit to clear the text boxes and data
  const closeModal = () => {
    setIsOpen(false);
    setLastName('');
    setFirstName('');
    setUsername('');
    setPosition('');
    setStoreID('');
    setErrorMessage('');
    setPosition('');
    setResult('');

  };

  //this method handled the enableing and disableing of users
  const toggleAbility = (event) => {
    event.preventDefault(); //prevent default refresh until requests have been made

    //this pos is currently enabled. lets disable it
    if (user.user.enabled == true) {
      if (user.user.position === "Owner" && numActiveOwners <= 1) {
        setResult("Cannot disable the only active owner.");
      }
      else {
        //this post request sends the userID to be disabled in the DB
        axios
          .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/DisableUser",
            {
              "ID": user.user.ID,
            })
          .then((response) => {
            if (response.data.response == "Disabled") {
              window.location.reload(); // This will refresh the page
            }
            else {
              console.error("Failed to disable user");
            }
          })
          .catch((error) => {
            console.error("API request failed:", error);
            setResult("Request Failed. Try again.")
          });
      }
    }
    //this user is disables, re-enable
    if (user.user.enabled == false) {
      //this post request sends the userID to be disabled in the DB
      axios
        .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/EnableUser",
          {
            "ID": user.user.ID,
          })
        .then((response) => {

          console.log(response.data.response);

          if (response.data.response == "Enabled") {
            console.log("User enabled");
            window.location.reload(); // This will refresh the page
          } else {
            console.error("Failed to enable user");
          }
        })
        .catch((error) => {
          console.error("API request failed:", error);
          setResult("Request Failed. Try again.")
        });
    }

  }

  //this method handles editing user details
  const handleSubmit = (event) => {
    event.preventDefault();

    //create an axios POST request to create a new user with inputs from the form
    axios
      .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/EditUser",
        {
          "ID": user.user.ID,
          "username": username,
          "name": lastname + ", " + firstname,
          "storeCSV": getCSV(),
          "position": position
        })



      .then((response) => {

        //if the response data was not an API error
        //the following line indicates a successful entry
        if (response.data.response === "User Updated successfully.") {
          closeModal();
          setResult("User Successfully edited.")
          window.location.reload(); // This will refresh the page
        }
        //if this response comes in, the user tried to change their username to a different username
        else if (response.data.response === "Please choose a different username.") {
          setResult("This username is taken. Please choose a different one.");

        } else {
          // a valid api request but error occurred          
          setResult("Request Failed. Try again.")
        }
      })
      //error if the API request failed
      .catch((error) => {
        console.error("API request failed:", error);
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
            <h2 className="text-lg text-red-500 font-bold mb-4">{result}</h2>
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
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <input
                        required
                        type="radio"
                        id="Team Leader"
                        name="role"
                        value="Team Leader"
                        defaultChecked={user.user.position === "Team Leader"}
                        onChange={(e) => setPosition(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor="Team Leader" className="mr-4">Team Leader</label>
                    </div>
                    {auth.cookie.user.position == "Owner" && (
                      <div>
                        <div className="flex items-center">
                          <input
                            required
                            type="radio"
                            id="Store Manager"
                            name="role"
                            value="Store Manager"
                            defaultChecked={user.user.position === "Store Manager"}
                            onChange={(e) => setPosition(e.target.value)}
                            className="mr-2"
                          />
                          <label htmlFor="Store Manager">Store Manager</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            required
                            type="radio"
                            id="owner"
                            name="role"
                            value="Owner"
                            defaultChecked={user.user.position === "Owner"}
                            onChange={(e) => setPosition(e.target.value)}
                            className="mr-2"
                          />
                          <label htmlFor="owner">Owner</label>
                        </div>
                      </div>
                    )}
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
                        defaultChecked={user.user.storeID_CSV.includes(item.ID.toString())}
                        onChange={handleCheckboxChange}
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
                  onClick={toggleAbility}
                  className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {user.user.enabled ? 'Deactivate User' : 'Activate User'}
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