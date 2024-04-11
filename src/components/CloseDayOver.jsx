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
import CoinQuarter from "../usd_icons/coins/CoinQuarter.svg";
import CoinDime from "../usd_icons/coins/CoinDime.svg";
import CoinNickel from "../usd_icons/coins/CoinNickel.svg";
import CoinPenny from "../usd_icons/coins/CoinPenny.svg";

import RollQuarter from "../usd_icons/rolls/RollQuarter.svg";
import RollDime from "../usd_icons/rolls/RollDime.svg";
import RollNickel from "../usd_icons/rolls/RollNickel.svg";
import RollPenny from "../usd_icons/rolls/RollPenny.svg";

const CloseDayOver = ({ onClose, details, isSafe }) => {
  return (
    <div className="text-navy-gray absolute top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white text-center p-8 rounded-lg shadow-lg">
        <h2>Rule: Limit Reached</h2>
        {isSafe ? (
          <>
            <div className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300">
              <h2>Safe has Reached a Limit.</h2>

              <h2>Please deposit the following to the bank:</h2>
            </div>
            <div className="box-border mb-2 text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300">
              <div className="flex flex-row justify-around">
                <ul>
                  <li>
                    <img
                      src={BillHundred}
                      className="inline-block align-middle w-12 h-12"
                    />{" "}
                    {details.hundred}
                  </li>
                  <li>
                    <img
                      src={BillFifty}
                      className="inline-block align-middle w-12 h-12"
                    />{" "}
                    {details.fifty}
                  </li>
                  <li>
                    <img
                      src={BillTwenty}
                      className="inline-block align-middle w-12 h-12"
                    />{" "}
                    {details.twenty}
                  </li>
                  <li>
                    <img
                      src={BillTen}
                      className="inline-block align-middle w-12 h-12"
                    />{" "}
                    {details.ten}
                  </li>
                  <li>
                    <img
                      src={BillFive}
                      className="inline-block align-middle w-12 h-12"
                    />{" "}
                    {details.five}
                  </li>
                  <li>
                    <img
                      src={BillOne}
                      className="inline-block align-middle w-12 h-12"
                    />{" "}
                    {details.one}
                  </li>
                </ul>
                <ul>
                  <li>
                    <img
                      src={RollQuarter}
                      className="inline-block align-middle w-12 h-12"
                    />{" "}
                    {details.quarterRoll}
                  </li>
                  <li>
                    <img
                      src={RollDime}
                      className="inline-block align-middle w-12 h-12"
                    />{" "}
                    {details.dimeRoll}
                  </li>
                  <li>
                    <img
                      src={RollNickel}
                      className="inline-block align-middle w-12 h-12"
                    />{" "}
                    {details.nickelRoll}
                  </li>
                  <li>
                    <img
                      src={RollPenny}
                      className="inline-block align-middle w-12 h-12"
                    />{" "}
                    {details.pennyRoll}
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <p>Register has Reached a Limit.</p>
            <p>Please move the following to the safe:</p>
            <p></p>
            <ul>
              <li>Hundreds: {details.hundred}</li>
              <li>Fifties: {details.fifty}</li>
              <li>Twenties: {details.twenty}</li>
            </ul>
          </>
        )}

        <Button
          onClick={onClose}
          label="Close"
          rounded
          icon="pi pi-times"
          size="small"
          className="p-button-secondary p-button-raised"
        />
      </div>
    </div>
  );
};

export default CloseDayOver;
