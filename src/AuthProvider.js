import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import routes from "./routes.js";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();

    //username and password details are to be passed into here which will be stored in "data"
    //and used for validation. Then handle tokens n stuff
    const loginAction = (data) => {
        console.log(data);
        axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/AuthenticateUser', {data})
        .then(response => {
            if (response.data.IsValid == true){
                console.log(response.data);
                setUser(response.data.user);
                setToken(response.token);
                localStorage.setItem("site", response.token);
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
        setToken("");
        localStorage.removeItem("site");
        navigate(routes.signout);
    }
    
    return <AuthContext.Provider value={{token, user, loginAction, logOut}}>
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