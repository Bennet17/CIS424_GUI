//this component is used to reset a user's password
//written by brianna kline
import { useState } from "react";
import axios from "axios";
import routes from "../routes.js";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {

  //DEFINE VARIABLES
  const navigate = useNavigate();
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [username, setUsername] = useState('');
  const [usernameFound, setUsernameFound] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validPassword, setValidPassword] = useState('');
  const [userValidated, setUserValidated] = useState(false);

  //This method is used to validate a password by ensureing it has 8 characters, 1 symbol and 1 number 
  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*+=?><:;'"|~`-])[a-zA-Z0-9!@#$%^&*+=?><:;'"|~`-]{8,}$/;
    const isValid = regex.test(password);
   
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


  //this method handles when a chancel button is pressed at any point in the form. It will send the user back to the login screen
  function handleCancel(event) {
    event.preventDefault(); //prevent default refresh
    navigate(routes.signout); //route user back to login screen
    //reset variables
    setErrorMessage("");
    setMessage('');
  }

  //this function handles the post request for a new password.
  //the user must have already answered the security question correctly to reach this point
  function handleNewPasswordSubmit(event) {
    event.preventDefault(); //prevent refresh
    //handle new password post request
    axios
      .post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/UpdateUserPassword',
        {
          "username": username,
          "password": newPassword
        })
      .then(response => {
        if (response.data.Message === 'Password updated successfully.') {
          setMessage('Password Updated!');
          setPasswordUpdated(true);
        }

      })
      .catch(error => {
        console.error(error);
        setMessage("There was an error. Try again.")
      });
  }

  //this function handles when a user types in their username to retrieve a new password.
  //the request will return the security question associated to the username
  function handleUsernameSubmit(event) {
    event.preventDefault();
    setMessage('');
    axios
      .post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GetQuestionByUsername',
        {
          "username": username
        })
      .then(response => {

        setSecurityQuestion(response.data.Question); //set the security quesiton variable to the the one returned by the request
        setUsernameFound(true); //unlocks next conditional part of the form
      })
      .catch(error => {
        console.error(error);
        setMessage("Username was not found.") //alert user of no username was found
        setUsernameFound(false)
      });

  }

  //this method is a helper method to allow the setting of the password variable as well as calling the validate method
  const handleChange = (e) => {
    // Update the password state with the new value
    setNewPassword(e.target.value);

    // Call validatePassword with the new password value
    validatePassword(e.target.value);
  };

  //this function handles the validation of a user by sending the user's answer to the security question.
  function handleAnswerSubmit(event) {
    event.preventDefault();
    setMessage('');

    axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/AuthenticateQuestion', {

      "username": username,
      "answer": securityAnswer

    })
      .then(response => {
        //if the response isValid, the user is now validated and the next part of the conditional form will render
        if (response.data.IsValid == true) {
          setUserValidated(true);
        }
        else {
          //keep the user on this page
          setUserValidated(false);
          setMessage("Incorrect Answer. Try Again"); //alert the user if the security answer was incorrect
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
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
              {userValidated ? (
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
                      className={`py-2 px-4 font-bold rounded focus:outline-none focus:shadow-outline ${validPassword ? 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold' : 'bg-gray-400 cursor-not-allowed text-gray-600'
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
                        <label className="block text-gray-700 text-sm font-bold mb-2">Security Question: {securityQuestion}</label>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Security Answer:</label>
                        <input
                          onChange={(e) => setSecurityAnswer(e.target.value)}
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
                          onClick={handleAnswerSubmit}
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