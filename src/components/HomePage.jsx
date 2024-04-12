import "../styles/PageStyles.css";
import SideBar from "./SideBar.jsx";
import OSBarChart from "./OSBarChart.jsx";
import HorizontalNav from "./HorizontalNav.js";
import { useAuth } from "../AuthProvider.js";

const HomePage = () => {
  return (
    <div className="flex min-h-screen min-w-fit bg-custom-accent">
      {/* Left-side vertical site navigation menu */}
      <SideBar currentPage={0} />

      <div className="flex flex-col w-full">
        {/* Top horizontal status & location navigation header */}
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
