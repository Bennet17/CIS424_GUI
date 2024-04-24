import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import HorizontalNav from "./HorizontalNav";
import { useAuth } from "../AuthProvider.js";
import { Toaster, toast } from "sonner";
import classNames from "classnames";
import { Vault, CreditCard, Package, PackageOpen } from "lucide-react";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import "primeicons/primeicons.css";
import { clamp } from "../clamp.js";

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

const OpenDayPage = () => {
  const auth = useAuth();

  //pos-related data
  const [posHasLoaded, SetPosHasLoaded] = useState(false);
  const [IsFirstPos, SetIsFistPos] = useState(false);
  const [poss, setPoss] = useState([]);
  const [currentPosIndex, SetCurrentPosIndex] = useState(-1);
  const [showExtraChange, setShowExtraChange] = useState(false);
  const [showExtraChangeTxt, setShowExtraChangeTxt] = useState("Show Extras ▼");

  // TM: Title will change with entity selection
  const [titleText, setTitleText] = useState(
    `Open Day for ${auth.cookie.user.viewingStoreLocation}`
  );

  //dom fields
  const [elmPennies, setElmPennies] = useState(0);
  const [elmNickles, setElmNickles] = useState(0);
  const [elmDimes, setElmDimes] = useState(0);
  const [elmQuarters, setElmQuarters] = useState(0);
  const [elmPenniesRolled, setElmPenniesRolled] = useState(0);
  const [elmNicklesRolled, setElmNicklesRolled] = useState(0);
  const [elmDimesRolled, setElmDimesRolled] = useState(0);
  const [elmQuartersRolled, setElmQuartersRolled] = useState(0);
  const [elm1Dollar, setElm1Dollar] = useState(0);
  const [elm5Dollar, setElm5Dollar] = useState(0);
  const [elm10Dollar, setElm10Dollar] = useState(0);
  const [elm20Dollar, setElm20Dollar] = useState(0);
  const [elm50Dollar, setElm50Dollar] = useState(0);
  const [elm100Dollar, setElm100Dollar] = useState(0);
  const [elm1DollarCoin, setElm1DollarCoin] = useState(0);
  const [elm2Dollar, setElm2Dollar] = useState(0);
  const [elmHalfDollarCoin, setElmHalfDollarCoin] = useState(0);

  //i hate this
  const [elmPenniesExpected, setElmPenniesExpected] = useState(0);
  const [elmNicklesExpected, setElmNicklesExpected] = useState(0);
  const [elmDimesExpected, setElmDimesExpected] = useState(0);
  const [elmQuartersExpected, setElmQuartersExpected] = useState(0);
  const [elmPenniesRolledExpected, setElmPenniesRolledExpected] = useState(0);
  const [elmNicklesRolledExpected, setElmNicklesRolledExpected] = useState(0);
  const [elmDimesRolledExpected, setElmDimesRolledExpected] = useState(0);
  const [elmQuartersRolledExpected, setElmQuartersRolledExpected] = useState(0);
  const [elm1DollarExpected, setElm1DollarExpected] = useState(0);
  const [elm5DollarExpected, setElm5DollarExpected] = useState(0);
  const [elm10DollarExpected, setElm10DollarExpected] = useState(0);
  const [elm20DollarExpected, setElm20DollarExpected] = useState(0);
  const [elm50DollarExpected, setElm50DollarExpected] = useState(0);
  const [elm100DollarExpected, setElm100DollarExpected] = useState(0);
  const [elm1DollarCoinExpected, setElm1DollarCoinExpected] = useState(0);
  const [elm2DollarExpected, setElm2DollarExpected] = useState(0);
  const [elmHalfDollarCoinExpected, setElmHalfDollarCoinExpected] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false);

  const colorChangeThreshold = 2;

  //calculates the total of all denominations with rounding
  const totalAmount =
    Math.round(
      (elmPennies * 0.01 +
        elmNickles * 0.05 +
        elmDimes * 0.1 +
        elmQuarters * 0.25 +
        elmPenniesRolled * 0.5 +
        elmNicklesRolled * 2 +
        elmDimesRolled * 5 +
        elmQuartersRolled * 10 +
        elm1Dollar * 1 +
        elm5Dollar * 5 +
        elm10Dollar * 10 +
        elm20Dollar * 20 +
        elm50Dollar * 50 +
        elm100Dollar * 100 +
        elm1DollarCoin * 1 +
        elm2Dollar * 2 +
        elmHalfDollarCoin * 0.5) *
        100
    ) / 100;
  const [expectedAmount, setExpectedAmount] = useState(0);
  const [postSuccess, SetPostSuccess] = useState(null);
  const [possSuccessTxt, SetPosSuccessTxt] = useState("");

  //Stores the general styling for the actual/current total denominations text field.
  //here, we simply change the text & bg color based on if we're over, under, or at expected value
  //with a 2 dollar margin
  const actualAmountStyle = classNames(
    "box-border",
    "text-center",
    "mb-4",
    "ml-6",
    "mr-12",
    "w-24",
    "float-right",
    "border-border-color",
    "border-2",
    "bg-white",
    {
      "bg-yellow-200": CurrentIsPastThreshold() === 1,
      "text-yellow-600": CurrentIsPastThreshold() === 1,

      "bg-rose-200": CurrentIsPastThreshold() === -1,
      "text-rose-700": CurrentIsPastThreshold() === -1,

      "bg-green-200": CurrentIsPastThreshold() === 0,
      "text-green-700": CurrentIsPastThreshold() === 0,
    }
  );

  function CurrentIsPastThreshold() {
    if (totalAmount > expectedAmount + colorChangeThreshold) {
      return 1;
    } else if (totalAmount < expectedAmount - colorChangeThreshold) {
      return -1;
    } else if (
      totalAmount <= expectedAmount + colorChangeThreshold &&
      totalAmount >= expectedAmount - colorChangeThreshold
    ) {
      return 0;
    }
  }

  //call on component load AND when the currently-selected pos has refreshed
  useEffect(() => {
    //update the expected total amount
    GetExpectedCount();
  }, [currentPosIndex]);

  // TM: Title change useEffect to update on entity selection
  useEffect(() => {
    if (posHasLoaded) {
      setTitleText(
        `Open Day for ${auth.cookie.user.viewingStoreLocation} - Counting ${poss[currentPosIndex].name} Denominations`
      );
    }
  }, [posHasLoaded]);

  //toggles the variable that displays the niche changes, such as $2 bills and $1 coins
  //(also change arrow text thing)
  function ToggleExtraChange() {
    setShowExtraChange(!showExtraChange);
    if (!showExtraChange) {
      setShowExtraChangeTxt("Hide Extras ▲");
    } else {
      setShowExtraChangeTxt("Show Extras ▼");
    }
  }

  //clears all the inpout fields to default values
  function ClearAllFields() {
    setElmPennies(0);
    setElmNickles(0);
    setElmDimes(0);
    setElmQuarters(0);
    setElmPenniesRolled(0);
    setElmNicklesRolled(0);
    setElmDimesRolled(0);
    setElmQuartersRolled(0);
    setElm1Dollar(0);
    setElm5Dollar(0);
    setElm10Dollar(0);
    setElm20Dollar(0);
    setElm50Dollar(0);
    setElm100Dollar(0);
    setElm1DollarCoin(0);
    setElm2Dollar(0);
    setElmHalfDollarCoin(0);

    toast.info("Fields have been reset.");
  }

  //call on component load AND when poss state has refreshed
  useEffect(() => {
    if (poss.length > 0) {
      //update current pos. Initialize it to the first pos that is closed, otherwise, default to safe
      let posIndex = FirstPosIndexEnabled();
      if (posIndex < 0) {
        posIndex = 0;
      }
      SetCurrentPosIndex(posIndex);
      SetPosHasLoaded(true);
    }
  }, [poss]);

  //call on component load AND when postSuccess is updated
  useEffect(() => {
    function Initialize() {
      axios
        .get(
          process.env.REACT_APP_REQUEST_URL +
            `ViewStoreObjects?storeID=${auth.cookie.user.viewingStoreID}`,
          {
            headers: {
              [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY,
            },
          }
        )
        .then((response) => {
          //set the pos information data
          setPoss(response.data);
          SetPostSuccess(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    Initialize();
  }, [postSuccess]);

  //gets the expected count for this pos
  function GetExpectedCount() {
    //wait until we have our pos data before attempting to execute
    if (poss.length > 0 && poss[currentPosIndex]) {
      axios
        .get(
          process.env.REACT_APP_REQUEST_URL +
            `GetOpenCount?storeID=${auth.cookie.user.viewingStoreID}&registerID=${poss[currentPosIndex].regID}`,
          {
            headers: {
              [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY,
            },
          }
        )
        .then((response) => {
          setExpectedAmount(response.data.total);
          setElm100DollarExpected(response.data.hundred);
          setElm50DollarExpected(response.data.fifty);
          setElm20DollarExpected(response.data.twenty);
          setElm10DollarExpected(response.data.ten);
          setElm5DollarExpected(response.data.five);
          setElm1DollarExpected(response.data.one);
          setElmQuartersRolledExpected(response.data.quarterRoll);
          setElmDimesRolledExpected(response.data.dimeRoll);
          setElmNicklesRolledExpected(response.data.nickelRoll);
          setElmPenniesRolledExpected(response.data.pennyRoll);
          setElmQuartersExpected(response.data.quarter);
          setElmDimesExpected(response.data.dime);
          setElmNicklesExpected(response.data.nickel);
          setElmPenniesExpected(response.data.penny);
          setElm1DollarCoinExpected(response.data.dollarCoin);
          setElm2DollarExpected(response.data.two);
          setElmHalfDollarCoinExpected(response.data.halfDollar);
          SetIsFistPos(response.data.first);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  //prevents the user from pressing enter on accident to submit on the form by disallowing the behavior altogether
  function PreventKeyDown(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }

  function Submit(event) {
    //prevents default behavior of sending data to current URL And refreshing page
    event.preventDefault();

    //check if our currently-selected pos is open
    if (!poss[currentPosIndex].opened) {
      axios
        .post(
          process.env.REACT_APP_REQUEST_URL + "CreateCashCount",
          {
            storeID: auth.cookie.user.viewingStoreID,
            usrID: auth.cookie.user.ID,
            total: totalAmount,
            type: "OPEN",
            itemCounted: poss[currentPosIndex].name,
            amountExpected: expectedAmount,
            hundred: elm100Dollar,
            fifty: elm50Dollar,
            twenty: elm20Dollar,
            ten: elm10Dollar,
            five: elm5Dollar,
            two: elm2Dollar,
            one: elm1Dollar,
            dollarCoin: elm1DollarCoin,
            halfDollar: elmHalfDollarCoin,
            quarter: elmQuarters,
            dime: elmDimes,
            nickel: elmNickles,
            penny: elmPennies,
            quarterRoll: elmQuartersRolled,
            dimeRoll: elmDimesRolled,
            nickelRoll: elmNicklesRolled,
            pennyRoll: elmPenniesRolled,
          },
          {
            headers: {
              [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            //open POS
            SetPostSuccess(true);
            SetPosHasLoaded(false);
            toast.success(poss[currentPosIndex].name + " opened successfully!");
          } else {
            //send toast saying that the pos could not be opened
            SetPostSuccess(false);
            toast.error("Error trying to open" + poss[currentPosIndex].name);
          }

          setShowConfirm(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Unknown error occured");
        });
    } else {
      //prevent users from opening an already-opened pos
      toast.error(poss[currentPosIndex].name + " is already open!");
    }
  }

  // gets the first pos index in the poss array that should be selectable
  function FirstPosIndexEnabled() {
    for (let i = 0; i < poss.length; i++) {
      if (!poss[i].opened) {
        return i;
      }
    }
    return -1;
  }

  return (
    <div className="flex min-h-screen min-w-fit bg-custom-accent">
      <Toaster
        richColors
        position="top-center"
        expand={true}
        duration={5000}
        pauseWhenPageIsHidden={true}
      />
      <SideBar currentPage={1} />
      <div className="w-full">
        <HorizontalNav />

        <div className="text-main-color float-left ml-8 mt-6">
          <h1 className="text-3xl font-bold">{titleText}</h1>
          <br />
          <div>
            {posHasLoaded ? (
              <>
                {poss.map((item, index) => (
                  <>
                    <label className="flex items-center space-x-2 my-0">
                      <input
                        key={item.name}
                        defaultChecked={
                          FirstPosIndexEnabled() >= 0
                            ? FirstPosIndexEnabled() === index
                            : index === 0
                        }
                        onChange={(e) => {
                          SetCurrentPosIndex(index);
                          ClearAllFields();
                        }}
                        disabled={
                          item.opened ||
                          ((poss[0].opened ? false : true) && index > 0)
                        }
                        type="radio"
                        name={"POS"}
                        value={item.name}
                        className="h-4 w-4 my-2"
                      />
                      {item.name === "SAFE" ? (
                        <Vault className="h-6 w-6" />
                      ) : (
                        <CreditCard className="h-6 w-6" />
                      )}
                      <div className="flex flex-row">
                        {item.name} -{" "}
                        {item.opened ? (
                          <div className="pl-1 flex flex-row items-center">
                            Open
                            <PackageOpen className="ml-1 h-5 w-5 text-button-blue-light" />
                          </div>
                        ) : (
                          <div className="pl-1 flex flex-row items-center">
                            Closed
                            <Package className="ml-1 h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </label>
                  </>
                ))}
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        <div className="text-main-color float-left ml-16 mt-4">
          {posHasLoaded ? (
            <div className="flex flex-row justify-left ml-32">
              <div>
                <label className="text-xl">
                  {" "}
                  Current Total:
                  <input
                    value={"$" + totalAmount}
                    className={actualAmountStyle + " rounded-md"}
                    type="text"
                    disabled={true}
                  />
                </label>
              </div>
              <div>
                <label className="text-xl">
                  {" "}
                  Expected Total:
                  <input
                    value={"$" + expectedAmount}
                    disabled={true}
                    className="box-border rounded-md text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                    type="text"
                  />
                </label>
              </div>
            </div>
          ) : (
            <p className="text-xl mb-2">Waiting for POS data...</p>
          )}
          <hr />
          <form
            className="mt-2"
            onKeyDown={PreventKeyDown}
            onSubmit={(e) =>
              CurrentIsPastThreshold() === 0 ? Submit(e) : setShowConfirm(true)
            }
          >
            <table>
              <tbody>
                <tr>
                  <td className="text-2xl">Bills</td>
                  <td className="text-2xl pl-6">Expected</td>
                  <td className="text-2xl pl-6">Actual</td>
                  <td className="text-2xl">Coins</td>
                  <td className="text-2xl pl-6">Expected</td>
                  <td className="text-2xl pl-6">Actual</td>
                  {showExtraChange === true ? (
                    <>
                      <td className="text-2xl">Other</td>
                      <td className="text-2xl pl-6">Expected</td>
                      <td className="text-2xl pl-6">Actual</td>
                    </>
                  ) : (
                    <>
                      <td></td>
                      <td></td>
                      <td></td>
                    </>
                  )}
                </tr>
                <tr>
                  <td>
                    <label>
                      <img
                        src={BillHundred}
                        //alt="100's"
                        className="inline-block align-middle w-12 h-12"
                        alt="100 Dollar Bill"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elm100DollarExpected}
                      //onChange={e => setElm100DollarExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border rounded-md text-center ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elm100Dollar}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElm100Dollar(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={1}
                    />
                  </td>
                  <td>
                    <label>
                      <img
                        src={RollQuarter}
                        //alt="Quarter Rolls"
                        className="inline-block align-middle w-12 h-12"
                        alt="Quarter Roll"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elmQuartersRolledExpected}
                      //onChange={e => setElmQuartersRolledExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elmQuartersRolled}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElmQuartersRolled(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={7}
                    />
                  </td>
                  {showExtraChange === true && (
                    <>
                      <td>
                        <label>
                          <img
                            src={CoinOne}
                            //alt="Dollar Coins"
                            className="inline-block align-middle w-12 h-12"
                            alt="1 Dollar Coin"
                          />
                        </label>
                      </td>
                      <td>
                        <input
                          value={elm1DollarCoinExpected}
                          //onChange={e => setElm1DollarCoinExpected(clamp(e.target.value))}
                          min="0"
                          className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                          type="text"
                          disabled={true}
                        />
                      </td>
                      <td>
                        <input
                          value={elm1DollarCoin}
                          onChange={(e) => {
                            const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                            setElm1DollarCoin(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                          }}
                          min={0}
                          max={100000}
                          className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                          type="number"
                          disabled={IsFirstPos}
                          tabIndex={15}
                        />
                      </td>
                    </>
                  )}
                </tr>
                <tr>
                  <td>
                    <label>
                      <img
                        src={BillFifty}
                        //alt="50's"
                        className="inline-block align-middle w-12 h-12"
                        alt="50 Dollar Bill"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elm50DollarExpected}
                      //onChange={e => setElm50DollarExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elm50Dollar}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElm50Dollar(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={2}
                    />
                  </td>
                  <td>
                    <label>
                      <img
                        src={RollDime}
                        //alt="Dime Rolls"
                        className="inline-block align-middle w-12 h-12"
                        alt="Dime Roll"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elmDimesRolledExpected}
                      //onChange={e => setElmDimesRolledExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elmDimesRolled}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElmDimesRolled(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={8}
                    />
                  </td>
                  {showExtraChange === true && (
                  <>
                    <td>
                      <label>
                        <img
                          src={BillTwo}
                          //alt="2's"
                          className="inline-block align-middle w-12 h-12"
                          alt="2 Dollar Bill"
                        />
                      </label>
                    </td>
                    <td>
                      <input
                        value={elm2DollarExpected}
                        //onChange={e => setElm2DollarExpected(clamp(e.target.value))}
                        min="0"
                        className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                        type="text"
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        value={elm2Dollar}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                          setElm2Dollar(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                        }}
                        min={0}
                        max={100000}
                        className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                        type="number"
                        disabled={IsFirstPos}
                        tabIndex={16}
                      />
                    </td>
                  </>
                )}
                </tr>
                <tr>
                  <td>
                    <label>
                      <img
                        src={BillTwenty}
                        //alt="20's"
                        className="inline-block align-middle w-12 h-12"
                        alt="20 Dollar Bill"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elm20DollarExpected}
                      //onChange={e => setElm20DollarExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elm20Dollar}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElm20Dollar(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={3}
                    />
                  </td>
                  <td>
                    <label>
                      <img
                        src={RollNickel}
                        //alt="Nickel Rolls"
                        className="inline-block align-middle w-12 h-12"
                        alt="Nickel Roll"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elmNicklesRolledExpected}
                      //onChange={e => setElmNicklesRolledExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elmNicklesRolled}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElmNicklesRolled(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={9}
                    />
                  </td>
                  {showExtraChange === true && (
                  <>
                    <td>
                      <label>
                        <img
                          src={CoinHalf}
                          //alt="Half Dollar Coins"
                          className="inline-block align-middle w-12 h-12"
                          alt="Half Dollar Coin"
                        />
                      </label>
                    </td>
                    <td>
                      <input
                        value={elmHalfDollarCoinExpected}
                        //onChange={e => setElmHalfDollarCoinExpected(clamp(e.target.value))}
                        min="0"
                        className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                        type="text"
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        value={elmHalfDollarCoin}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                          setElmHalfDollarCoin(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                        }}
                        min={0}
                        max={100000}
                        className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                        type="number"
                        disabled={IsFirstPos}
                        tabIndex={17}
                      />
                    </td>
                  </>
                )}
                </tr>
                <tr>
                  <td>
                    <label>
                      <img
                        src={BillTen}
                        //alt="10's"
                        className="inline-block align-middle w-12 h-12"
                        alt="10 Dollar Bill"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elm10DollarExpected}
                      //onChange={e => setElm10DollarExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elm10Dollar}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElm10Dollar(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={4}
                    />
                  </td>
                  <td>
                    <label>
                      <img
                        src={RollPenny}
                        //alt="Penny Rolls"
                        className="inline-block align-middle w-12 h-12"
                        alt="Penny Roll"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elmPenniesRolledExpected}
                      //onChange={e => setElmPenniesRolledExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elmPenniesRolled}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElmPenniesRolled(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={10}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>
                      <img
                        src={BillFive}
                        //alt="5's"
                        className="inline-block align-middle w-12 h-12"
                        alt="5 Dollar Bill"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elm5DollarExpected}
                      //onChange={e => setElm5DollarExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elm5Dollar}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElm5Dollar(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={5}
                    />
                  </td>
                  <td>
                    <label>
                      <img
                        src={CoinQuarter}
                        //alt="Quarters"
                        className="inline-block align-middle w-12 h-12"
                        alt="Quarter Coin"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elmQuartersExpected}
                      //onChange={e => setElmQuartersExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elmQuarters}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElmQuarters(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={11}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>
                      <img
                        src={BillOne}
                        //alt="1's"
                        className="inline-block align-middle w-12 h-12"
                        alt="1 Dollar Bill"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elm1DollarExpected}
                      //onChange={e => setElm1DollarExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elm1Dollar}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElm1Dollar(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={6}
                    />
                  </td>
                  <td>
                    <label>
                      <img
                        src={CoinDime}
                        //alt="Dimes"
                        className="inline-block align-middle w-12 h-12"
                        alt="Dime Coin"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elmDimesExpected}
                      //onChange={e => setElmDimesExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elmDimes}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElmDimes(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={12}
                    />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <label>
                      <img
                        src={CoinPenny}
                        //alt="Pennies"
                        className="inline-block align-middle w-12 h-12"
                        alt="Penny Coin"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elmPenniesExpected}
                      //onChange={e => setElmPenniesExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elmPennies}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElmPennies(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={13}
                    />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <label>
                      <img
                        src={CoinNickel}
                        //alt="Nickels"
                        className="inline-block align-middle w-12 h-12"
                        alt="Nickel Coin"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      value={elmNicklesExpected}
                      //onChange={e => setElmNicklesExpected(clamp(e.target.value))}
                      min="0"
                      className="box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 bg-gray-300"
                      type="text"
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      value={elmNickles}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                        setElmNickles(newValue === '' ? '0' : newValue); // If newValue is empty, set it to '0'
                      }}
                      min={0}
                      max={100000}
                      className={`box-border text-center my-2 rounded-md ml-6 mr-12 w-24 float-right border-border-color border-2 ${IsFirstPos ? "bg-gray-300" : "hover:bg-nav-bg bg-white"}`}
                      type="number"
                      disabled={IsFirstPos}
                      tabIndex={14}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mb-4">
              <Button
                type="button"
                value="button"
                label="Clear"
                rounded
                icon="pi pi-times"
                size="small"
                className="p-button-raised p-button-secondary"
                onClick={ClearAllFields}
              />
              <Button
                type="submit"
                value="submit"
                label="Open"
                rounded
                icon="pi pi-check"
                size="small"
                className="p-button-raised p-button-primary"
                style={{
                  width: "125px",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
              />
              <ToggleButton
                checked={showExtraChange}
                onChange={ToggleExtraChange}
                onIcon="pi pi-eye"
                offIcon="pi pi-eye-slash"
                onLabel="Hide extras"
                offLabel="Show Extras"
              />
            </div>
          </form>
        </div>
        {showConfirm && (
          <div className="report-overlay">
            <div className="report-container">
              You are about to perform an open day with more than a $
              {colorChangeThreshold} variance. Are you sure?
              <br />
              <br />
              <Button
                type="button"
                value="button"
                label="Cancel"
                rounded
                icon="pi pi-times"
                size="small"
                className="p-button-secondary p-button-raised"
                onClick={() => setShowConfirm(false)}
                style={{ marginRight: "1rem" }}
              />
              <Button
                type="button"
                value="button"
                label="Confirm"
                rounded
                icon="pi pi-check"
                size="small"
                className="p-button-primary p-button-raised"
                onClick={Submit}
                style={{ marginRight: "1rem" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenDayPage;
