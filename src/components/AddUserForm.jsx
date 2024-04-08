//this component serves as a form to add a new user
//written by brianna kline
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { Tooltip } from 'primereact/tooltip';
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import "primeicons/primeicons.css";

const AddUserForm = () => {

  const auth = useAuth();
  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing

  //DECLARE VARIABLES
  const [selectedStores, setSelectedStores] = useState([curStoreID.toString()]);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("Team Leader");
  const [storeIDs, setStoreID] = useState(curStoreID);
  const [result, setResult] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  //This method handles when the add user modal is first opened. 
  const openModal = () => {
    setIsOpen(true);
    //include the current store as a default checked
    if (!selectedStores.includes(curStoreID.toString())) {
      setSelectedStores([...selectedStores, curStoreID.toString()]);
    }
    //create Team Leader as the selected radio button default
    setPosition("Team Leader");
  };

  //This method handles the closing of the modal when the user DOESNT submit an add.
  const closeModal = () => {
    //reset/clear all state variables that may have been populated from a previous type in the input boxes
    setIsOpen(false);
    setLastName("")
    setFirstName("")
    setUsername("")
    setPosition("")
    setPassword("")
    setStoreID("")
    setErrorMessage("")
    setValidPassword(false);
    setSelectedStores([]); //dump selected stored, the default will be added in OPENMODAL()
  };


  // Retrieve the serialized string from local storage
  const storedArrayString = localStorage.getItem('stores');

  // Parse the string back into an array
  const storeArray = JSON.parse(storedArrayString);

  //this method is called as a helper for when a user enters a password.
  //it calls setPassword, which changes the password variable
  //it calls validate password which runs the below method for password strength check
  // Define the handleChange function
  const handleChange = (e) => {
    // Update the password state with the new value
    setPassword(e.target.value);

    // Call validatePassword with the new password value
    validatePassword(e.target.value);
  };



  //this method will validate a password and prevent a user from entering a weak password
  //check functionaloity
  //REGEX tests for 8 characters, 1 captial, and 1 symbol
  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*+=?><:;'"|~`-])[a-zA-Z0-9!@#$%^&*+=?><:;'"|~`-]{8,}$/;
    const isValid = regex.test(password);
    console.log(isValid);

    //if its not valid, set the error message to appear conditionally
    if (!isValid) {
      setValidPassword(false);
      setErrorMessage(
        <>
          Include 8 characters,<br />
          1 number, and 1 symbol.
        </>
      );
    }
    else {
      setErrorMessage(""); //make error disappear when valid
      setValidPassword(true);
    }

  };


  //this method forces a minimum of 1 checkbox to be checked at any time
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

  //this function is called on submit to capture the checkboxes that are checked and it will format them in the CSV to be sent to DB
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

    let csv = temp.substring(0, temp.length - 1);  //removes the ending comma

    return csv;
  }


  //this method handles the submit button click on the add user form
  const handleSubmit = (event) => {
    event.preventDefault(); //prevent refresh TEST THIS

    //concantenate last name and first name entry
    const name = lastname + ", " + firstname;

    //create an axios POST request to create a new user with inputs from the form
    axios
      .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateUser",
        {
          "username": username,
          "name": name,
          "password": password,
          "position": position,
          "storeCSV": getCSV(),
          "question": securityQuestion,
          "answer": securityAnswer

        })
      .then((response) => {
        //if the response data was not an API error
        //the following line indicates a successful entry
        if (response.data.response == "User created successfully.") {
          //successful creation
          setResult("User Successfully Created.")
          closeModal();
          window.location.reload(); // This will refresh the page

        } else {
          //a valid API request but user was not created because there was already a user with that username
          setResult("Username already taken. Try again");
        }
      })
      //error if the API request failed
      .catch((error) => {
        console.error("API request failed:", error);
        // console.error( username+ " "+ name+ " "+password+ " "+ position +" " +storeID);
        setResult("Request Failed. Try again.")
      });
  }

  return (

    <div className="relative ml-5 ">
      <Button
        onClick={openModal}
        label="Add User"
        className="p-button-primary p-button-raised"
        size="small"
        rounded
        icon="pi pi-plus"
      />
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-md w-auto">
            <span onClick={closeModal} className="absolute top-0 right-0 cursor-pointer text-gray-700 hover:text-gray-900">&times;</span>
            <h2 className="text-2xl font-bold mb-4">Add User Information</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-lg font-bold mb-4">{result}</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First Name:</label>
                  <input
                    required
                    id="firstName"
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Last Name:</label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    onChange={(e) => setLastName(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
                  <input
                    id="username"
                    type="text"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
                  <input
                    required
                    type="password"
                    onChange={(e) => handleChange(e)}
                    className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                  {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="mb-4">
                  <label htmlFor="securityQuestion" className="block text-gray-700 font-bold mb-2">Security Question:</label>
                  <input
                    required
                    id="securityQuestion"
                    type="text"
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="securityAnswer" className="block text-gray-700 font-bold mb-2">Security Answer:</label>
                  <input
                    required
                    id="securityAnswer"
                    type="text"
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="mb-4">
                  <legend className="block text-gray-700 font-bold mb-2">Role:</legend>
                  <div className="flex flex-col">
                    <Tooltip target=".TeamLeaderRDB" content={"Team Leader: \n1. Open & Close Days \n2. Transfer Funds\n3. Auditing & Reporting"} />
                    <Tooltip target=".StoreManagerRDB" content={"Store Manager:\n1. Add new Team Leaders \n2. Open & Close Days \n3. Transfer Funds \n4. Auditing & Reporting"} />
                    <Tooltip target=".ownerRDB" content={"Owner:\n1. Add new/promote users to Store Manager & Owner \n2. Open & Close Days \n3. Transfer Funds \n4. Auditing & Reporting \n5. POS Register Management \n6. Store Management"} />

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="Team Leader"
                        name="role"
                        value="Team Leader"
                        required
                        defaultChecked={"Team Leader"}
                        onChange={(e) => setPosition(e.target.value)}
                        className="TeamLeaderRDB mr-2"
                      />
                      <label htmlFor="Team Leader" className="mr-4">Team Leader</label>
                    </div>
                    {auth.cookie.user.position === "Owner" && (
                      <div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="Store Manager"
                            name="role"
                            required
                            value="Store Manager"

                            onChange={(e) => setPosition(e.target.value)}
                            className="StoreManagerRDB mr-2"
                          />
                          <label htmlFor="StoreManager">Store Manager</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="owner"
                            name="role"
                            value="Owner"
                            required
                            onChange={(e) => setPosition(e.target.value)}
                            className="ownerRDB mr-2"
                          />
                          <label htmlFor="owner">Owner</label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  <legend className="block text-gray-700 font-bold mb-2">Store:</legend>
                  {storeArray.map(item => (
                    <div key={item.ID} className="mb-2">
                      <input
                        type="checkbox"
                        id={`store${item.ID}`}
                        name="store"
                        value={item.ID}
                        defaultChecked={item.ID === curStoreID}
                        onChange={(e) => handleCheckboxChange(e, item.ID)}
                        className="mr-2"
                      />
                      <label htmlFor={`store${item.ID}`}>{item.location}</label>
                    </div>
                  ))}
                </div>

              </div>

              <div className="flex justify-between">
                <Button
                  label="Cancel"
                  className="p-button-secondary p-button-raised"
                  rounded
                  size="small"
                  icon="pi pi-times"
                  onClick={closeModal}
                />
                <Button
                  label="Add User"
                  className="p-button-primary p-button-raised"
                  rounded
                  size="small"
                  icon="pi pi-check"
                  type="submit"
                  disabled={validPassword === false}
                />
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default AddUserForm;














