import "../styles/PageStyles.css";
import Navbar from "./Navbar.jsx";
import OSBarChart from "./OSBarChart.jsx";
import HorizontalNav from "./HorizontalNav.js";

const pageName = "HomePage";

const HomePage = () => {
  return (
    <div className="flex h-screen bg-custom-accent">
      <Navbar currentPage={pageName} />

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
