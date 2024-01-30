import './App.css';

// page components
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <div className="App">
      {<HomePage />}
      {/*<LoginPage />*/}
    </div>
  );
}

export default App;
