import "../styles/PageStyles.css";
import { useNavigate } from "react-router-dom";
import routes from "../routes.js";
import NavBar from "./NavBar.jsx";
import OSBarChart from "./OSBarChart.jsx";

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

  return (
    <div>
      {/* I believe this is where the header will go */}
      <p className="translate-x-72 translate-y-24 text-2xl text-main-color">
        PLATO'S CLOSET - {username} {ranking}
      </p>

      <NavBar
        toOpenDay={toOpenDay}
        yo_mama={yo_mama}
        testPermissions={testPermissions}
      />

      <OSBarChart />
    </div>
  );
};

export default HomePage;
