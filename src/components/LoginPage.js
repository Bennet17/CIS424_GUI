import axios from "axios";
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import routes from "../routes.js";
import Logo from '../Logo.png'; // Adjust the path accordingly

//creates a function that returns the login page area
function LoginPage() {

  //used to navigate to a new route page
  const navigate = useNavigate();

  //stores variables set from various controls. Call "setItem" to change item value, and reference
  //"item" to get the value. Default values can be set in the "useState()" parentheses
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);

  //performs an axios post request to verify that a user exists in the database, and performs logic
  //based on if the user exists or not, or errors
  function Submit(event){
    event.preventDefault();

    axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/AuthenticateUser', {
      "username": username,
      "password": password,
    })
    .then(response => {
      console.log(response);
      //see discord behind-the-scenes channel for test username/passwords to use
      //if we return true as our response, route the user to the main screen
      if (response.data.IsValid == true){
        navigate(routes.home);
      }else{
        //do logic for invalid user, i dunno can't test this yet cuz back-end people are
        //sending truthy responses for both valid/invalid user possibilities
      }
    })
    .catch(error => {
      console.error(error);
    });
  }  

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"> 
    
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-48 w-auto"
          src={Logo}
          alt="Plato's Closet Logo"
        />
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign In
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={Submit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 text-left">
              Employee ID
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                value={username}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 ">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              value="login"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
    

  );
}

export default LoginPage;