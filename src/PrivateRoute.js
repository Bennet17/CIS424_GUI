import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import routes from "./routes.js";

//checks for authentication. If the user is not logged in,
//reroute to login page, otherwise, passthrough route
const PrivateRoute = () => {
  const user = useAuth();
  console.log(user.cookie);
  if (!user.cookie || Object.keys(user.cookie).length === 0) return <Navigate to={routes.signout} />;
  return <Outlet />;
};

export default PrivateRoute;