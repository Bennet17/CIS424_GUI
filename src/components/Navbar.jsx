import "../styles/PageStyles.css";
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import logo from '../Logo.png';

//test variables
let testPermissions = 1;

const Navbar = () =>{
    //used to navigate to a new route page when calling a function
    const navigate = useNavigate();

    //functions to navigate user through pages. See html code below for calling these
    function toHome(){
        navigate(routes.home);
    }
    function toOpenDay() {
        navigate(routes.openday);
    }
    function toCloseDay() {
        navigate(routes.closeday);
    }
    function toTransferFunds() {
        navigate(routes.fundstransfer);
    }
    function toSafeAudit() {
        navigate(routes.safeaudit);
    }
    function toUserManagement(){
        navigate (routes.usermanagement);
    }
    function signOut(){
        navigate(routes.signout);
    }

    return (
        <div>
            <div className="float-left border-box border-border-color h-dvh w-64 border-2 bg-nav-bg">
                <img src={logo} alt="logo" />
                <div onClick={toHome} className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Return To Home</p>
                </div>
                <div onClick={toOpenDay} className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Open Day</p>
                </div>
                <div  onClick={toCloseDay} className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Close Day</p>
                </div>
                <div onClick={toTransferFunds} className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Transfer Funds</p>
                </div>
                <div className="group box-border border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4 inline-block">Cash Manager</p><p className="text-xl text-text-faded text-right translate-x-24 inline-block">\/</p>
                    {testPermissions == 1 && <div onClick={toSafeAudit} className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">Safe Audit</p>
                    </div>}
                    {testPermissions == 1 && <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">peepeepoopoodoodoofart</p>
                    </div>}
                </div>
                <div className="group box-border border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4 inline-block">Security</p><p className="text-xl text-text-faded text-right translate-x-36 inline-block">\/</p>
                    {testPermissions == 1 && <div onClick={toUserManagement} className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">User management</p>
                    </div>}
                    {testPermissions == 1 && <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">POS Management</p>
                    </div>}
                </div>
                <div  onClick={signOut} className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Sign Out</p>
                </div>
            </div>
        </div>
    );
}

export default Navbar;