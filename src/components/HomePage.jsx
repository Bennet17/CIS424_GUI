import "../styles/PageStyles.css";
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import logo from '../Logo.png';

//test variables
let testPermissions = 0;
let username = "ZippyDee";
let ranking = "(<employee ranking>)";

const HomePage = () =>{
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
        <div>
            <p className="translate-x-72 translate-y-24 text-2xl text-main-color">PLATO'S CLOSET - {username} {ranking}</p>
            <div className="float-left border-box border-border-color h-dvh w-64 border-2 bg-nav-bg">
                <img src={logo} alt="logo" />
                <div onClick={toOpenDay} className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Open Day</p>
                </div>
                <div onClick={yo_mama} className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Close Day</p>
                </div>
                <div onClick={toTransferFunds} className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Transfer Funds</p>
                </div>
                <div className="group box-border border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4 inline-block">Cash Manager</p><p className="text-xl text-text-faded text-right translate-x-24 inline-block">\/</p>
                    {testPermissions == 0 && <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">Safe Audit</p>
                    </div>}
                    {testPermissions == 1 && <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">peepeepoopoodoodooballs</p>
                    </div>}
                </div>
                <div className="group box-border border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Security</p>
                    {testPermissions == 1 && <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">User management</p>
                    </div>}
                    {testPermissions == 1 && <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">POS Management</p>
                    </div>}
                </div>
                <div className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Sign Out</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;