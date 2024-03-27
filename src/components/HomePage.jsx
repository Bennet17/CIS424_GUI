import "../styles/PageStyles.css";
import SideBar from "./SideBar.jsx";
import OSBarChart from "./OSBarChart.jsx";
import HorizontalNav from "./HorizontalNav.js";
import { useAuth } from "../AuthProvider.js";

const HomePage = () => {
  const auth = useAuth();

  return (
    <div className="flex h-screen bg-custom-accent">
      <SideBar currentPage={0} />

      <div className="flex flex-col w-full">
        <div>
          <HorizontalNav />
        </div>

        {/* Content area */}
        <div className="flex flex-grow justify-center items-center">
          {auth.CheckAuthorization(["Manager", "District Manager", "Owner"]) && <OSBarChart />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
