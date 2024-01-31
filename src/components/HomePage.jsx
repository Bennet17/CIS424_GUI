import "../styles/PageStyles.css";
import logo from '../Logo.png';

let testPermissions = 1;
let username = "ZippyDee";

const HomePage = () =>{
    return (
        <div>
            <p className="absolute -translate-x-60 translate-y-24 text-2xl text-main-color">PLATO'S CLOSET - {"ZippyDee (<employee ranking>)"}</p>
            <div className="float-left border-box border-border-color h-dvh w-64 border-2 bg-nav-bg">

                <img src={logo} alt="logo" />
                <div className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Open Day</p>
                </div>
                <div className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Close Day</p>
                </div>
                <div className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">Transfer Funds</p>
                </div>
                <div className="group box-border border-border-color border-2 hover:bg-nav-bg bg-white" >
                    <p className="text-xl text-left translate-x-4">yo mama </p>
                    <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">chungus</p>
                    </div>
                    <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">amongus</p>
                    </div>
                    {testPermissions == 0 && <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">sus</p>
                    </div>}
                    {testPermissions == 1 && <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
                        <p className="text-xl text-left translate-x-8">peepeepoopoodoodooballs</p>
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