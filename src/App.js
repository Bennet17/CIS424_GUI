import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import routes from "./routes.js";
// page components
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import OpenDayPage from "./components/OpenDay";

let username,
  password = "";

function App() {
  return (
    <BrowserRouter className="App">
      <Routes>
        {/* this is how we structure our routes. Each new route is a new page that renders a new element.
        Currently, all routes will have the url of "localhost:3000/<path>". Routes can also be nested,
        allowing for routes in inherit from another route, which will affect the url accordingly:
        "localhost:3000/<path>/<nested path>". Structure as appropriately as we make new pages.
        Lastly, note the index property for the login page instead of a path. This means that the path
        for this page will be on the root "localhost:3000" url */}
        <Route index element={<LoginPage />} />
        <Route path={routes.home} element={<HomePage />} />
        <Route path={routes.openday} element={<OpenDayPage />} />
        {/* below could be an idea for a 404 error page, but depends if we actually need it.
        Notice how the path is *. This means it will show this element if any other url is entered
        that is not explicitly defined */}
        {/*<Route path="*" element={<NoPage />} />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
