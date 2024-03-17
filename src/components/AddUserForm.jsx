//this component serves as a form to add a user from
//written by brianna kline
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";



const AddUserForm = () => {

  const auth = useAuth();
  const curStoreID = auth.cookie.user.viewingStoreID; //stores the current Store we are viewing



  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setLastName('')
    setFirstName('')
    setUsername('')
    setPosition('')
    setPassword('')
    setStoreID('')
    setErrorMessage('')
    setValidPassword(false);
  };






  // Retrieve the serialized string from local storage
  const storedArrayString = localStorage.getItem('stores');

  // Parse the string back into an array
  const storeArray = JSON.parse(storedArrayString);

  //TEST FOR STORE ARRAY
  // storeArray.forEach(item => {
  //   console.log(`ID: ${item.ID}, Name: ${item.location}`);
  // });


  //use state variables for the input of user data
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [storeIDs, setStoreID] = useState(curStoreID);
  const [result, setResult] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  //const [selectedStores, setSelectedStores] = useState([])
  const[validPassword, setValidPassword] = useState(false);

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
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
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


      setErrorMessage(''); //make error disappear when valid
      setValidPassword(true);
    }

 
  };


  const handleCheckboxChange = (e, storeID) => {
    const isChecked = e.target.checked; // Get the new checked state from the event
    // Do something with the checked state and item ID
    if (isChecked) {
      console.log(`Checkbox with ID ${storeID} is checked`);
      // Additional logic when the checkbox is checked
    } else {
      //console.log(`Checkbox with ID ${storeID} is unchecked`);
      // Additional logic when the checkbox is unchecked
      if(storeID == curStoreID){
        e.target.checked = true;
      }
    }
  };
  
 


  //this method handles the submit button click on the add user form
  function handleSubmit(event) {
    if(validPassword == true){
      event.preventDefault(); //prevent refresh TEST THIS

      //concantenate last name and first name entry
      const name = lastname + ", "+firstname;

      console.log(username,name,password,position,storeIDs)
      
      //create an axios POST request to create a new user with inputs from the form
      axios
        .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateUser", 
          {
            "username": username,
            "name": name,
            "password": password,
            "position": position,
            "storeID": storeIDs,

          })
        .then((response) => {
          console.log(response.data.response);
          
          //if the response data was not an API error
          //the following line indicates a successful entry
          if (response.data.response == "User created successfully.") {
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
    }

  }

  return (

<div className="relative ml-5 ">
      <button
        onClick={openModal}
        
       className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      > Add User</button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-md w-auto">
          <span onClick={closeModal} className="absolute top-0 right-0 cursor-pointer text-gray-700 hover:text-gray-900">&times;</span>
            <h2 className="text-2xl font-bold mb-4">Add User Information</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-lg font-bold mb-4">{result}</h2>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="mb-4">
                        <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First Name:</label>
                        <input
                        required
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
                        required
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
                        required
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
                        <div>
                        <input
                        required
                          type="password"
                                                  
                          onChange={(e) => handleChange(e)} // Pass the entire event object 'e'
                          className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                        {errorMessage && <div className="text-red-500 text-sm mt-1 ">{errorMessage}</div>}
                      </div>
                      </div>
                      <div className="mb-4">
                    <legend className="block text-gray-700 font-bold mb-2">Role:</legend>
                    <div className="flex items-center">
                      <input
                        required
                        type="radio"
                        id="employee"
                        name="role"
                        value="Employee"
                        defaultChecked={position === "Employee"} // Assuming position is the state variable for the selected role
                        onChange={(e) => setPosition(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor="employee" className="mr-4">Employee</label>
                      <input
                        
                        type="radio"
                        id="manager"
                        name="role"
                        value="Manager"
                       // checked={position === "Manager"} // Assuming position is the state variable for the selected role
                        onChange={(e) => setPosition(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor="manager">Manager</label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <legend className="block text-gray-700 font-bold mb-2">Store:</legend>
                    {storeArray.map(item => (
                     
                      <div key={item.ID} className="mb-2">
                        <input
                          type="checkbox"
                          id={`store${item.ID}`}
                          name="store"
                          value={item.ID}
                          defaultChecked={item.ID == curStoreID}
                          onChange={(e) => handleCheckboxChange(e, item.ID)}
                          className="mr-2"
                        />
                        <label htmlFor={`store${item.ID}`}>{item.location}</label>
                      </div>
                    ))}
                  </div>

                    </div>
                    <div className="flex justify-between">
                      <button
                      onClick={closeModal}
                        type="button"
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={validPassword}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Add User
                      </button>
                    </div>
                    
                  </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AddUserForm;














