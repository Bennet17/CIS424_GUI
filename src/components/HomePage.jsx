import "../styles/PageStyles.css";
import Navbar from "./Navbar.jsx";
import OSBarChart from "./OSBarChart.jsx";
import HorizontalNav from "./HorizontalNav.js";

const HomePage = () => {
  //used to navigate to a new route page when calling a function
  const navigate = useNavigate();

  //functions to navigate user through pages. See html code below for calling these
  function toOpenDay() {
    navigate(routes.openday);
  }

  function yo_mama() {
    navigate(routes.closeday);
  }

  function toTransferFunds() {
    navigate(routes.fundstransfer);
  }
  function toUserManagement(){
    navigate(routes.usermanagement);
  }

  return (
    <div className="flex h-screen bg-custom-accent">
      <Navbar/>
      <NavBar
        toOpenDay={toOpenDay}
        yo_mama={yo_mama}
        testPermissions={testPermissions}
        toUserManagement={toUserManagement}
      />

      <div className="flex flex-col w-full">
        <div>
          <HorizontalNav></HorizontalNav>
        </div>


        {/* Content area */}
        <div className="flex flex-grow justify-center items-center">
          <OSBarChart />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
