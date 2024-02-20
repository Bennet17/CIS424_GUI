import "../styles/PageStyles.css";
import Navbar from "./Navbar.jsx";
import OSBarChart from "./OSBarChart.jsx";
import HorizontalNav from "./HorizontalNav.js";

const HomePage = () => {

  return (
    <div className="flex h-screen bg-custom-accent">
      <Navbar/>

      <div className="flex flex-col w-full">
        <div>
          <HorizontalNav />
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
