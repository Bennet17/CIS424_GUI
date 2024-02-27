import axios from "axios";
import { useState,useEffect } from "react";

const AddUserForm = () => {

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [storeID, setStoreID] = useState([]);
  const [result, setResult] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const[storeArray,setStoreArray] = useState([]);
  const handleChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    const isValid = regex.test(password);
    if (!isValid) {
      setErrorMessage(
        <>
          Include 8 characters,<br />
          1 number, and 1 symbol.
        </>
      );    } else {
      setErrorMessage('');
    }
  };




  useEffect(() => {
    function fetchAllStores() {
      const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStores`;

      axios.get(url)
        .then((response) => {
          console.log('Data:', response.data);
          console.log(response);
          const updatedStoreArray = response.data.map(item => ({
            ID: item.ID,
            location: item.location
        }));
        setStoreArray(updatedStoreArray);
        console.log(storeArray);
        
          
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    // Call the function to initiate the GET request with specific details
    fetchAllStores();
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount




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
        value={password}
      
        onChange={handleChange}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
      {errorMessage && <div className="text-red-500 text-sm mt-1 ">{errorMessage}</div>}
    </div>
    </div>
    <div className="mb-4">
      <label htmlFor="role" className="block text-gray-700 font-bold mb-2">Role:</label>
      <select
        id="role"
        required
        onChange={(e) => setPosition(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="Employee">Employee</option>
        <option value="Manager">Manager</option>
      </select>
    </div>
    <div className="mb-4">
      <label htmlFor="storeID" className="block text-gray-700 font-bold mb-2">Store:</label>
      <select
        id="storeID"
        multiple
        required
        onChange={(e) => setStoreID(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      >
        {storeArray.map(item => (
            <option key={item.ID} value={item.ID}>{item.location}</option>
          ))}
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

export default AddUserForm;
