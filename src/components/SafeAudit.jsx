import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState } from "react";
import SideBar from "./SideBar";
import HorizontalNav from "./HorizontalNav";

const SafeAuditPage = () => {
  const [startDay, setStartDay] = useState();
  const [endDay, setEndDay] = useState();
  const [currentDay, setCurrentDay] = useState();

  //changes the start day, end day, and current day
  function changeDayStart() {}
  function changeDayEnd() {}
  function changeDayCurrent() {}

  function Submit(event) {
    event.preventDefault();

    axios
      .post("", {
        username: "username",
      })
      .then((response) => {
        console.log(response);
        if (response.data.IsValid == true) {
          //navigate(routes.home);
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="flex h-screen bg-custom-accent">
      <SideBar currentPage={4} />
      <div className="flex flex-col w-full">
        <HorizontalNav />
        <div className="float-left ml-32 mt-12">
          <label className="text-main-color text-2xl mb-2">Start Date:</label>
          <input
            onChange={changeDayStart}
            className="box-border text-center mb-4 ml-4 mr-12 w-32 border-border-color border-2 hover:bg-nav-bg bg-white"
            type="date"
            name="start"
          ></input>
        </div>
        <div className="float-left ml-10 mt-12">
          <label className="text-main-color text-2xl mb-2">End Date:</label>
          <input
            onChange={changeDayEnd}
            className="box-border text-center mb-4 ml-4 mr-12 w-32 border-border-color border-2 hover:bg-nav-bg bg-white"
            type="date"
            name="start"
          ></input>
        </div>
        <div className="float-left ml-32 mt-8">
          <div>
            <div onClick="" className=""></div>
            <p className="text-center w-252">{currentDay}</p>
            <table className="box-border border-border-color border-2">
              <tbody>
                <tr>
                  <td className="box-border border-border-color border-2 text-center w-28 h-12">
                    Name
                  </td>
                  <td className="box-border border-border-color border-2 text-center w-28 h-12">
                    Prev. Day Strap Amount
                  </td>
                  <td className="box-border border-border-color border-2 text-center w-28 h-12">
                    Prev. Day Loose Amount
                  </td>
                  <td className="box-border border-border-color border-2 text-center w-28 h-12">
                    Prev. Day Total Value
                  </td>
                  <td className="box-border border-border-color border-2 text-center w-28 h-12">
                    Current Day Strap Amount
                  </td>
                  <td className="box-border border-border-color border-2 text-center w-28 h-12">
                    Strap Amount
                  </td>
                  <td className="box-border border-border-color border-2 text-center w-28 h-12">
                    Current Day Loose Amount
                  </td>
                  <td className="box-border border-border-color border-2 text-center w-28 h-12">
                    Loose Amount
                  </td>
                  <td className="box-border border-border-color border-2 text-center w-28 h-12">
                    Current Day Total Value
                  </td>
                </tr>
                <tr>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8">
                    1s
                  </td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                </tr>
                <tr>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8">
                    5s
                  </td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                </tr>
                <tr>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8">
                    10s
                  </td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                </tr>
                <tr>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8">
                    20s
                  </td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                </tr>
                <tr>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8">
                    50s
                  </td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                </tr>
                <tr>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8">
                    100s
                  </td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                </tr>
                <tr>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8">
                    Pennies
                  </td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                </tr>
                <tr>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8">
                    Nickles
                  </td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                </tr>
                <tr>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8">
                    Dimes
                  </td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                </tr>
                <tr>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8">
                    Quarters
                  </td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                  <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table className="mt-4">
              <tbody>
                <tr>
                  <td>
                    <label className="text-main-color">Petty cash:</label>
                    <input
                      defaultValue="0"
                      className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white"
                      type="number"
                    />
                  </td>
                  <td>
                    <label className="text-main-color">Over/Short:</label>
                    <input
                      defaultValue="0"
                      className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white"
                      type="number"
                    />
                  </td>
                  <td></td>
                  <td>
                    <button
                      type="submit"
                      value="submit"
                      className="flex w-36 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Submit
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label className="text-main-color">Safe Expected:</label>
                    <input
                      defaultValue="0"
                      className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white"
                      type="number"
                    />
                  </td>
                  <td>
                    <label className="text-main-color">Safe Total:</label>
                    <input
                      defaultValue="0"
                      className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white"
                      type="number"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeAuditPage;
