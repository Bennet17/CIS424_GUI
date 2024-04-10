//This component is an input form that allows a new store entity to be created
//Written By Brianna Kline
import axios from "axios";
import { useState } from "react";
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import "primeicons/primeicons.css";

// USD Icon imports
import BillHundred from "../usd_icons/bills/BillHundred.svg";
import BillFifty from "../usd_icons/bills/BillFifty.svg";
import BillTwenty from "../usd_icons/bills/BillTwenty.svg";
import BillTen from "../usd_icons/bills/BillTen.svg";
import BillFive from "../usd_icons/bills/BillFive.svg";
import BillOne from "../usd_icons/bills/BillOne.svg";
import BillTwo from "../usd_icons/bills/BillTwo.svg";

import CoinOne from "../usd_icons/coins/CoinOne.svg";
import CoinHalf from "../usd_icons/coins/CoinHalf.svg";
import CoinHalfDollar from "../usd_icons/coins/CoinHalf_Dollar.svg";
import CoinQuarter from "../usd_icons/coins/CoinQuarter.svg";
import CoinDime from "../usd_icons/coins/CoinDime.svg";
import CoinNickel from "../usd_icons/coins/CoinNickel.svg";
import CoinPenny from "../usd_icons/coins/CoinPenny.svg";

import RollQuarter from "../usd_icons/rolls/RollQuarter.svg";
import RollDime from "../usd_icons/rolls/RollDime.svg";
import RollNickel from "../usd_icons/rolls/RollNickel.svg";
import RollPenny from "../usd_icons/rolls/RollPenny.svg";

const AddStoreForm = () => {
  //DECLARE VARIABLES
  //most of these are settings for denominations
  const [location, setLocation] = useState("");
  const [hundredRegisterMax, setHundredRegisterMax] = useState("");
  const [twentyRegisterMax, setTwentyRegisterMax] = useState("");
  const [fiftyRegisterMax, setFiftyRegisterMax] = useState("");
  const [hundredMax, setHundredMax] = useState("");
  const [fiftyMax, setFiftyMax] = useState("");
  const [twentyMax, setTwentyMax] = useState("");
  const [tenMax, setTenMax] = useState("");
  const [fiveMax, setFiveMax] = useState("");
  const [twoMax, setTwoMax] = useState("");
  const [oneMax, setOneMax] = useState("");
  const [quarterRollMax, setQuarterRollMax] = useState("");
  const [nickelRollMax, setNickelRollMax] = useState("");
  const [dimeRollMax, setDimeRollMax] = useState("");
  const [pennyRollMax, setPennyRollMax] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  //this function handles when the add form is open on the screen
  const openModal = () => {
    setIsOpen(true);
  };

  //this function handles closing the form when a submit doesnt happen and the user presses cancel
  const closeModal = () => {
    setIsOpen(false);
  };

  //this function handles when the store is added and sends the post request
  const handleSubmit = (event) => {
    event.preventDefault(); //prevent default refresh until after request is done

    axios
      .post(
        "https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateStore",
        {
          location: location,
          hundredRegisterMax: hundredRegisterMax,
          fiftyRegisterMax: fiftyRegisterMax,
          twentyRegisterMax: twentyRegisterMax,
          hundredMax: hundredMax,
          fiftyMax: fiftyMax,
          twentyMax: twentyMax,
          tenMax: tenMax,
          fiveMax: fiveMax,
          twoMax: twoMax,
          oneMax: oneMax,
          quarterRollMax: quarterRollMax,
          dimeRollMax: dimeRollMax,
          nickelRollMax: nickelRollMax,
          pennyRollMax: pennyRollMax,
        }
      )
      .then((response) => {
        //successful post
        window.location.reload(); // This will refresh the page
      })
      .catch((error) => {
        console.error("API request failed:", error);
      });
  };

  return (
    <div className="relative ml-5">
      <Button
        onClick={openModal}
        label="Add Store"
        rounded
        size="small"
        icon="pi pi-plus"
        className="p-button-primary p-button-raised"
        style={{ marginRight: "1rem" }}
      />

      {isOpen && (
        <div className="fixed text-navy-gray z-50 inset-0 flex items-center justify-center bg-gray-900 w-30 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-auto">
            <span
              onClick={closeModal}
              className="absolute top-0 right-0 cursor-pointer text-gray-700 hover:text-gray-900"
            >
              &times;
            </span>
            <h2 className="text-2xl font-bold mb-2">Add New Store </h2>
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-2"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="mb-2 col-span-1">
                  <label htmlFor="location" className="block font-bold mb-3">
                    Store Name:
                  </label>
                  <input
                    required
                    id="location"
                    type="text"
                    onChange={(e) => setLocation(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <p className="text font-bold mb-3">
                Register Denomination Maximums:
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="hundredRegisterMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={BillHundred}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="hundredRegisterMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setHundredRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="fiftyRegisterMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={BillFifty}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="fiftyRegisterMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setFiftyRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="twentyRegisterMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={BillTwenty}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="twentyRegisterMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setTwentyRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>

                <div className="mb-2 col-span-3">
                  <p className="text font-bold ">Safe Denomination Maximums:</p>
                </div>

                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="hundredMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={BillHundred}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="hundredMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setHundredMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="fiftyMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={BillFifty}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="fiftyMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setFiftyMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="twentyMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={BillTwenty}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="twentyMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setTwentyMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="tenMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={BillTen}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="tenMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setTenMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="fiveMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={BillFive}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="fiveMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setFiveMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="twoMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={BillTwo}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="twoMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setTwoMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="oneMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={BillOne}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="oneMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setOneMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="quarterRollMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={RollQuarter}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="quarterRollMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setQuarterRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="nickelRollMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={RollNickel}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="nickelRollMax"
                    min="0"
                    step="1"
                    type="number"
                    onChange={(e) => setNickelRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="dimeRollMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={RollDime}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="dimeRollMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setDimeRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1 text-center">
                  <label
                    htmlFor="pennyRollMax"
                    className="block text-gray-700 font-bold"
                  >
                    <img
                      src={RollPenny}
                      className="inline-block align-middle w-12 h-12"
                    />
                  </label>
                  <input
                    required
                    id="pennyRollMax"
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => setPennyRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  label="Cancel"
                  onClick={closeModal}
                  className="p-button-secondary p-button-raised"
                  rounded
                  icon="pi pi-times"
                  style={{ marginRight: "1rem" }}
                />
                <Button
                  label="Add Store"
                  type="submit"
                  className="p-button-primary p-button-raised"
                  icon="pi pi-check"
                  rounded
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStoreForm;
