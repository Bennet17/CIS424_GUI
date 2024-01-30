import './App.css';
// Base is a solid example of a simple component use
// Import Base from the components directory
import Base from './components/Base';
import HomePage from './components/HomePage';

//Just for gigs while we haven't started the GUI
import FunSpinnyLogo from './components/FunSpinnyLogo'

function App() {
  return (
    <div className="App">
      {/* Use it inside your App component */}
      {/*<Base />
      <FunSpinnyLogo />*/}
      <HomePage />
    </div>
  );
}

export default App;
