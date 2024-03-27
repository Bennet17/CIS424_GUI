import { useState } from "react";
import axios from "axios";
import routes from "../routes.js";
import { useNavigate } from "react-router-dom";




function ForgotPassword() {

  const navigate = useNavigate();






  const [username, setUsername] = useState('');
  const [usernameFound, setUsernameFound] = useState(false);
  const [managerUsername, setManagerUsername] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [managerFound, setManagerFound] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const[passwordUpdated, setPasswordUpdated] = useState(false);
const[userPosition, setUserPosition] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const[validPassword, setValidPassword] = useState('');


  

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
      setErrorMessage(''); //make error disappear when valid
      setValidPassword(true);
    }
  };



  function handleCancel(event){
    event.preventDefault();
     navigate(routes.signout);
     setErrorMessage("");
     setMessage('');
  }


  function handleNewPasswordSubmit(event){
     event.preventDefault();
  
      //handle new password post request
      axios
      .post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/UpdateUserPassword',
      {
        "username": username,
        "password": newPassword
      })
        .then(response => {
          //console.log(response.data.Message);
          if (response.data.Message === 'Password updated successfully.'){
              //console.log(response.data + "hello");
              setMessage('Password Updated!');
              setPasswordUpdated(true);
  
          }
  
        })
        .catch(error => {
          console.error(error);
          setMessage("There was an error. Try again.")
    
        });
  

  }

  function handleUsernameSubmit(event) {
    event.preventDefault();
    setMessage('');

    // e.preventDefault();
    const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewUsers`;
    axios.get(url)
      .then((response) => {
        //console.log(response.data);
        // Using forEach method
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i];
          if (username === item.username) {
            setMessage('');
            setManagerUsername('');
            setUserPosition(item.position);
            setUsernameFound(true);
            break;
          } else {
            setMessage("Invalid username");
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  const handleChange = (e) => {
    // Update the password state with the new value
    setNewPassword(e.target.value);
  
    // Call validatePassword with the new password value
    validatePassword(e.target.value);
  };

  function handleManagerSubmit(event) {
    event.preventDefault();
    setMessage(' ');
    // e.preventDefault();
    const data = {
      "username": managerUsername,
      "password": managerPassword,
    };

    axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/AuthenticateUser', data)
      .then(response => {
        console.log(response.data);
        if (response.data.IsValid == true){
            console.log(response.data + "Look here");
            console.log(response.data.user.position);
            if(userPosition == "Employee" && (response.data.user.position == "Manager" || response.data.user.position == "Owner")) {
              setMessage('');
              setManagerFound(true);
            }
            else if(userPosition == "Manager" && response.data.user.position == "Owner"){
              setMessage('');
              setManagerFound(true);
            }
            else{
              console.log("Invalid credentials");
              setMessage("Invalid Manager Credentials");
            }
        }
      else{
          //invalid credentials
          console.log("Invalid credentials");
         setMessage("Invalid Manager Credentials");
      }
      })
      .catch(error => {
        console.error(error);
  
      });
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
          <h2 className="text-red-500 font-semibold mb-4">{message}</h2>
          {passwordUpdated ? (
            <button
              onClick={handleCancel}
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Go To Login
            </button>
          ) : (
            <>
              {managerFound ? (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password:</label>
                    <input
                      type="password"
                      onChange={(e) => handleChange(e)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                   {errorMessage && <div className="text-red-500 text-sm mt-1 ">{errorMessage}</div>}

                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={validPassword === false} 
                      onClick={handleNewPasswordSubmit}
                      className={`py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                        validPassword ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-400 cursor-not-allowed text-gray-600'
                      }`}
                      >
                      Submit
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {!usernameFound ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Enter your username:</label>
                        <input
                          placeholder="Enter your username"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={handleCancel}
                          type="button"
                          className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUsernameSubmit}
                          type="submit"
                          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Submit
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Manager's Username:</label>
                        <input
                          value={managerUsername}
                          onChange={(e) => setManagerUsername(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Manager's Password:</label>
                        <input
                          type="password"
                          onChange={(e) => setManagerPassword(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={handleCancel}
                          type="button"
                          className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleManagerSubmit}
                          type="submit"
                          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Submit
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
                  }
  export default ForgotPassword;