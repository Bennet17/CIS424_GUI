import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {CookiesProvider, useCookies} from "react-cookie";
import axios from "axios";
import routes from "./routes.js";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [cookie, setCookie, removeCookie] = useCookies(["user"]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();

    //username and password details are to be passed into here which will be stored in "data"
    //and used for validation. Then handle tokens n stuff
    const loginAction = (data) => {
        axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/AuthenticateUser', data)
        .then(response => {
            if (response.data.IsValid == true){
                setUser(response.data.user);
                //setToken(response.token);
                setCookie("user", data.username, {path: "/"});
                localStorage.setItem("site", cookie);
                console.log(response.data);
                navigate(routes.home);
            }else{
                //invalid credentials
            }
        })
        .catch(error => {
            console.error(error);
        });
    }

    //kill everything
    const logOut = () => {
        setUser(null);
        removeCookie("user", {path: "/"});
        localStorage.removeItem("site");
        navigate(routes.signout);
    }
    
    return <AuthContext.Provider value={{cookie, user, loginAction, logOut}}>
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