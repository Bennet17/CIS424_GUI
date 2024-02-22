import "../styles/PageStyles.css";
import SideBar from "./SideBar.jsx";
import OSBarChart from "./OSBarChart.jsx";
import HorizontalNav from "./HorizontalNav.js";

const HomePage = () => {
  return (
    <div className="flex h-screen bg-custom-accent">
      <SideBar currentPage={0} />

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
