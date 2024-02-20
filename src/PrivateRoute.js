import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import routes from "./routes.js";

//checks for authentication. If the user is not logged in,
//reroute to login page, otherwise, passthrough route
const PrivateRoute = () => {
  const user = useAuth();
  if (!user.token) return <Navigate to={routes.signout} />;
  return <Outlet />;
};

export default PrivateRoute;