import React, {useState, useEffect} from 'react';
import axios from 'axios';

import './App.css';

// page components
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

function App() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.get('')
      .then(response => {
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
