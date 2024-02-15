import React from "react";
import logo from "../Logo.png";

const NavBar = ({ toOpenDay, yo_mama, testPermissions }) => {
  return (
    <div className="float-left border-box border-border-color h-dvh w-64 border-2 bg-nav-bg">
      <img src={logo} alt="logo" />

      <div
        onClick={toOpenDay}
        className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white"
      >
        <p className="text-xl text-left translate-x-4">Open Day</p>
      </div>

      <div
        onClick={yo_mama}
        className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white"
      >
        <p className="text-xl text-left translate-x-4">Close Day</p>
      </div>

      <div className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white">
        <p className="text-xl text-left translate-x-4">Transfer Funds</p>
      </div>

      <div className="group box-border border-border-color border-2 hover:bg-nav-bg bg-white">
        <p className="text-xl text-left translate-x-4 inline-block">
          Cash Manager
        </p>
        <p className="text-xl text-text-faded text-right translate-x-24 inline-block">
          \/
        </p>
        {testPermissions == 0 && (
          <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
            <p className="text-xl text-left translate-x-8">Safe Audit</p>
          </div>
        )}
        {testPermissions == 1 && (
          <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
            <p className="text-xl text-left translate-x-8">
              peepeepoopoodoodooballs
            </p>
          </div>
        )}
      </div>

      <div className="group box-border border-border-color border-2 hover:bg-nav-bg bg-white">
        <p className="text-xl text-left translate-x-4">Security</p>
        {testPermissions == 1 && (
          <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
            <p className="text-xl text-left translate-x-8">User management</p>
          </div>
        )}
        {testPermissions == 1 && (
          <div className="hidden group-hover:block cursor-pointer box-border border-border-color border-2 hover:bg-nav-bg bg-white">
            <p className="text-xl text-left translate-x-8">POS Management</p>
          </div>
        )}
      </div>

      <div className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white">
        <p className="text-xl text-left translate-x-4">Sign Out</p>
      </div>
    </div>
  );
};

export default NavBar;
