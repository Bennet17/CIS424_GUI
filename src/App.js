import './App.css';
import LoginPage from './components/LoginPage'
// Base is a solid example of a simple component use
// Import Base from the components directory
import BaseLayout from './components/BaseLayout';

//Just for gigs while we haven't started the GUI
import FunSpinnyLogo from './components/FunSpinnyLogo'

function App() {
  return (
    <div className="App">
      {/* Use it inside your App component */}
      <BaseLayout>
        <FunSpinnyLogo/>
        {/*Below is the commented out Login Component. Uncomment to check it out */}
        {<LoginPage/> }
      </BaseLayout>
    </div>
  );
}

export default App;
