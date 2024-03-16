import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {CookiesProvider, useCookies} from "react-cookie";
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
            axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/AuthenticateUser', data)
            .then(response => {
            
                console.log(response.data);
                if (response.data.IsValid == true){
                    //setUser(response.data.user);
                    //setToken(response.token);
                    setCookie("user", response.data.user, {path: "/"});
                    localStorage.setItem("site", cookie);
                    //console.log(response.data.user);
                    console.log(cookie);
                    navigate(routes.home);
                    resolve(response.data);
                }else{
                    //invalid credentials
                    reject(new Error("Invalid credentials"));
                }
        })
        .catch(error => {
            console.error(error);
            reject(error);
        });
    })
    }

    //kill everything
    const logOut = () => {
        //setUser(null);
        removeCookie("user", {path: "/"});
        localStorage.removeItem("site");
        localStorage.removeItem("curStoreID");
        localStorage.removeItem("curStoreName");
        localStorage.removeItem("stores");
        navigate(routes.signout);
    }
    
    //exports our various variables and objects to be accessable on other pages that imports this
    //file
    return <AuthContext.Provider value={{cookie, loginAction, logOut}}>
        {children}
    </AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};

/**
 * This component is to be wrapped around the application to provide context to its child components
 */