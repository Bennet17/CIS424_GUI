import "../styles/PageStyles.css";
import { useNavigate } from "react-router-dom";
import routes from "../routes.js";
import NavBar from "./NavBar.jsx";
import OSBarChart from "./OSBarChart.jsx";
import HorizontalNav from './HorizontalNav.js';

//test variables
let testPermissions = 0;
let username = "ZippyDee";
let ranking = "(<employee ranking>)";

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

  return (
    <div className="flex h-screen">
      <NavBar
        toOpenDay={toOpenDay}
        yo_mama={yo_mama}
        testPermissions={testPermissions}
      />

      <div className="flex flex-col w-full">
      <div><HorizontalNav></HorizontalNav></div>
        <div>
          <p className="text-2xl text-main-color">
            PLATO'S CLOSET - {username} {ranking}
          </p>
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
