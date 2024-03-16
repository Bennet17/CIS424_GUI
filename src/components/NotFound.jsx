import "../styles/PageStyles.css";
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';

const HomePage = () => {
    //used to navigate to a new route page when calling a function
    const navigate = useNavigate();

    function toHome(){
        navigate(routes.home);
    }

  return (
    <div className="mt-48 grid grid-cols-1 grid-rows-2 gap-1 content-center">
        <p className="text-center w-full mt-16 text-8xl font-bold text-custom-primary">404 - page not found</p>
        <p className="text-center w-full mt-32 text-2xl">Unknown page</p>
        <button className="flex mt-8 w-64 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={toHome}>Return to home</button>
    </div>
  );
};

export default HomePage;
