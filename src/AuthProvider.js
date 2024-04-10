import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";
import routes from "./routes.js";
const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  //const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //username and password details are to be passed into here which will be stored in "data"
  //and used for validation. Then handle tokens n stuff
  const loginAction = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          "https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/AuthenticateUser",
          data
        )
        .then((response) => {
          if (response.data.IsValid == true && response.data.user.enabled == true ) {
            //setUser(response.data.user);
            //setToken(response.token);
            //setCookie("user", response.data.user, { path: "/" });
            //localStorage.setItem("site", cookie);
            
            if (response.data.user.storeID_CSV.length === 1) {
              setCookie(
                "user",
                {
                  ...response.data.user,
                  workingStoreID: parseInt(response.data.user.storeID_CSV[0]),
                  viewingStoreID: parseInt(response.data.user.storeID_CSV[0]),
                },
                { path: "/" }
              );
              // Update cookie.user with viewing and working store ID
              localStorage.setItem("site", cookie);
              navigate(routes.home);
            } else {
              setCookie("user", response.data.user, { path: "/" });
              localStorage.setItem("site", cookie);
              navigate(routes.selectstore);
            }

            resolve(response.data);
          } else {
            //invalid credentials
            reject(new Error("Invalid credentials"));
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };

  const setUserStores = (
    workingStoreID,
    viewingStoreID,
    viewingStoreLocation
  ) => {
    setCookie(
      "user",
      {
        ...cookie.user,
        workingStoreID: workingStoreID,
        viewingStoreID: viewingStoreID,
        viewingStoreLocation: viewingStoreLocation,
      },
      { path: "/" }
    );
  };

  //use for when loading into a route. This just verifies the user's position
  //and returns if they should be allowed to have access to the page
  const CheckAuthorization = (position) => {

    //scan the array of allowed positions
    for (let i = 0; i < position.length; i++) {
      //check if any of them match our current position
      if (position[i] == cookie.user.position) {
        return true;
      }
    }

    //otherwise, we are not authorized
    return false;
  };

  //kill everything
  const logOut = () => {
    //setUser(null);
    removeCookie("user", { path: "/" });
    localStorage.removeItem("site");
    localStorage.removeItem("curStoreID");
    localStorage.removeItem("curStoreName");
    localStorage.removeItem("stores");
    localStorage.removeItem("numberOfActiveOwners");
    navigate(routes.signout);
  };

  //exports our various variables and objects to be accessable on other pages that imports this
  //file
  return (
    <AuthContext.Provider
      value={{ cookie, CheckAuthorization, loginAction, logOut, setUserStores }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * This component is to be wrapped around the application to provide context to its child components
 */
