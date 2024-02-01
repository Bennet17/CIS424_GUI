import React, {useState, useEffect} from 'react';
import axios from 'axios';

import './App.css';

// page components
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

let username, password = "";

function App() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.post('http://10.8.30.57:80/SVSU_CIS424/AuthenticateUser', {username, password})
      .then(response => {
        console.log(response);
        setPosts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  });

  return (
    <div className="App">
      {/*posts.map(post => (
        <></>
      ))*/}

      {/*<LoginPage />*/}
      {<HomePage />}
    </div>
  );
}

export default App;
