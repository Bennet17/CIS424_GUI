//This component contains the LOGIN page form

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider.js";
import Logo from "../newLogo.png"; // Adjust the path accordingly

//creates a function that returns the login page area
function LoginPage() {
  //used to navigate to a new route page
  const navigate = useNavigate();

  //stores variables set from various controls. Call "setItem" to change item value, and reference
  //"item" to get the value. Default values can be set in the "useState()" parentheses
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);

   //this useState variable allows for conditional message to be displayed if invalid credentials are entered
  const [invalidCredential, setInvalidCredential] = useState('');

  //import the authentication function from AuthProvider.js
  const auth = useAuth();

  //function to handle Submit button pressed logic
  function Submit(event) {
    event.preventDefault();

      //pass in the object with username and password values to authentication method
      //LoginAction method will return an error promise if the user credentials are invalid
    auth.loginAction({
      "username": username,
      "password": password,
    })
    .then(response => {

    })
    .catch(error => {
      //use state variable to set conditional message to invalid alert
      setInvalidCredential("Invalid Credentials. Try Again.") ;
    });

  }  

  return (
    <div className="flex bg-custom-accent min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto mb-12 h-30 w-auto"
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
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900 text-left"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                value={username}
                required
                autoFocus
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 "
                >
                  Forgot Password?
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
              Sign In
            </button>
          </div>
        </form>
        {invalidCredential && <p className="block text-sm font-medium leading-6 text-red-600">{invalidCredential}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
