import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import HorizontalNav from "./HorizontalNav";
import CloseDayOver from "./CloseDayOver.jsx";
import { useAuth } from "../AuthProvider.js";
import { Toaster, toast } from 'sonner';
import classNames from 'classnames';

const CloseDayPage = () =>{
    const auth = useAuth();

    //pos-related data
    const [posHasLoaded, setPosHasLoaded] = useState(false);
    const [poss, setPoss] = useState([]);
    const [currentPosIndex, setCurrentPosIndex] = useState(-1);
    const [showExtraChange, setShowExtraChange] = useState(false);
    const [creditExpected, setCreditExpected] = useState(0);
    const [creditActual, setCreditActual] = useState(0);
    const [showExtraChangeTxt, setShowExtraChangeTxt] = useState("show extras ▼");
    //let currentPosIndex = -1;

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

    //threshold fields
    const [showPopup, setShowPopup] = useState(false);
    const [popupInfo, setPopupInfo] = useState({});
    const [isSafe, setIsSafe] = useState(false);

    

    //calculates the total of all denominations with rounding
    const totalAmount = 
        Math.round(
            (
                (elmPennies * 0.01) + 
                (elmNickles * 0.05) +
                (elmDimes * 0.1) +
                (elmQuarters * 0.25) +
                (elmPenniesRolled * 0.5) +
                (elmNicklesRolled * 2) +
                (elmDimesRolled * 5) +
                (elmQuartersRolled * 10) +
                (elm1Dollar * 1) +
                (elm5Dollar * 5) +
                (elm10Dollar * 10) +
                (elm20Dollar * 20) +
                (elm50Dollar * 50) +
                (elm100Dollar * 100) +
                (elm1DollarCoin * 1) +
                (elm2Dollar * 2) +
                (elmHalfDollarCoin * 0.5)
            ) * 100
        ) / 100
    ;

    const [expectedAmount, setExpectedAmount] = useState(0);
    const [postSuccess, setPostSuccess] = useState(null);
    const [possSuccessTxt, setPosSuccessTxt] = useState("");
    

    //Stores the general styling for the current total denominations text field.
    //here, we simply change the text color based on if we're over, under, or at expected value
    const totalAmountStyle = classNames(
        'box-border',
        'text-center',
        'mb-4',
        'ml-6',
        'mr-12',
        'w-24',
        'float-right',
        'border-border-color',
        'border-2',
        'bg-white',
        {
            'text-yellow-500': totalAmount > expectedAmount,
            'text-rose-600': totalAmount < expectedAmount,
            'text-black': totalAmount === expectedAmount,
        }
    );

    function clamp(value, min = 0){
        if (value < min){
            return min;
        }
        return value;
    }

    //call on component load AND when the currently-selected pos has refreshed
    useEffect(() => {
        console.log("setting pos array index to " + currentPosIndex + ", see below");
        console.log(poss[currentPosIndex]);

        //update the expected total amount
        GetExpectedCount();
    }, [currentPosIndex]);

    //toggles the variable that displays the niche changes, such as $2 bills and $1 coins
    //(also change arrow text thing)
    function ToggleExtraChange(){
        setShowExtraChange(!showExtraChange);
        if (!showExtraChange){
            setShowExtraChangeTxt("hide extras ▲");
        }else{
            setShowExtraChangeTxt("show extras ▼");
        }
    }

    //clears all the inpout fields to default values
    function ClearAllFields(){
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
        setElm2Dollar(0);
        setElm5Dollar(0);
        setElm10Dollar(0);
        setElm1DollarCoin(0);
        setElm2Dollar(0);
        setElmHalfDollarCoin(0);
    }

    //call on component load AND when poss state has refreshed
    useEffect(() => {
        if (poss.length > 0){
            //update current pos
            setCurrentPosIndex(0);
            setPosHasLoaded(true);
        }
    }, [poss]);

    //call on component load AND when postSuccess is updated
    useEffect(() => {
        function Initialize(){
            axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStoreObjects?storeID=${auth.cookie.user.viewingStoreID}`)
            .then(response => {
                console.log(response);
                //set the pos information data
                setPoss(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }

        Initialize();
    }, [postSuccess]);

    //gets the expected count for this pos
    function GetExpectedCount() {
        // Wait until we have our pos data before attempting to execute
        if (poss.length > 0 && poss[currentPosIndex]) {
          const posName = poss[currentPosIndex].name;
      
          // Check if currentPosIndex is not 0
          if (currentPosIndex !== 0) {
            setExpectedAmount(0);
            return; // Exit the function early since expectedAmount is set to 0
          }
      
          axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GetCloseCount?storeID=${auth.cookie.user.viewingStoreID}`)
            .then(response => {
              console.log("Getting cash count for " + posName);
              console.log(response);
              setExpectedAmount(response.data);
            })
            .catch(error => {
              console.error(error);
            });
        }
      }
    

    const Submit = async (event) => {
        //prevents default behavior of sending data to current URL And refreshing page
        event.preventDefault();

        const thresholdsResponse = await axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewStoreThresholds?storeID=${auth.cookie.user.viewingStoreID}`);
        const thresholds = thresholdsResponse.data;
        console.log(thresholds);

        let info = {
            hundred: 0,
            fifty: 0,
            twenty: 0,
            ten: 0,
            five: 0,
            two: 0,
            one: 0,
            quarterRoll: 0,
            dimeRoll: 0,
            nickelRoll: 0,
            pennyRoll: 0,
        };
        let over = false;

        if (currentPosIndex !== 0) {
            if (elm100Dollar > thresholds.hundredRegisterMax) {
                info.hundred = elm100Dollar - thresholds.hundredRegisterMax;
                over = true;
            }
            if (elm50Dollar > thresholds.fiftyRegisterMax) {
                info.fifty = elm50Dollar - thresholds.fiftyRegisterMax;
                over = true;
            }
            if (elm20Dollar > thresholds.twentyRegisterMax) {
                info.twenty = elm20Dollar - thresholds.twentyRegisterMax;
                over = true;
            }
        } else {
            if (elm100Dollar > thresholds.hundredMax) {
                info.hundred = elm100Dollar - thresholds.hundredMax;
                over = true;
            }
            if (elm50Dollar > thresholds.fiftyMax) {
                info.fifty = elm50Dollar - thresholds.fiftyMax;
                over = true;
            }
            if (elm20Dollar > thresholds.twentyMax) {
                info.twenty = elm20Dollar - thresholds.twentyMax;
                over = true;
            }
            if (elm10Dollar > thresholds.tenMax) {
                info.ten = elm10Dollar - thresholds.tenMax;
                over = true;
            }
            if (elm5Dollar > thresholds.fiveMax) {
                info.five = elm5Dollar - thresholds.fiveMax;
                over = true;
            }
            if (elm2Dollar > thresholds.twoMax) {
                info.two = elm2Dollar - thresholds.twoMax;
                over = true;
            }
            if (elm1Dollar > thresholds.oneMax) {
                info.one = elm1Dollar - thresholds.oneMax;
                over = true;
            }
            if (elmQuartersRolled > thresholds.quarterRollMax) {
                info.quarterRoll = elmQuartersRolled - thresholds.quarterRollMax;
                over = true;
            }
            if (elmDimesRolled > thresholds.dimeRollMax) {
                info.dimeRoll = elmDimesRolled - thresholds.dimeRollMax;
                over = true;
            }
            if (elmNicklesRolled > thresholds.nickelRollMax) {
                info.nickelRoll = elmNicklesRolled - thresholds.nickelRollMax;
                over = true;
            }
            if (elmPenniesRolled > thresholds.pennyRollMax) {
                info.pennyRoll = elmPenniesRolled - thresholds.pennyRollMax;
                over = true;
            }
        }

        let totalTransferAmount = 
        (info.hundred * 100) + 
        (info.fifty * 50) + 
        (info.twenty * 20) + 
        (info.ten * 10) + 
        (info.five * 5) + 
        (info.two * 2) + 
        (info.one * 1) + 
        (info.quarterRoll * 10) + 
        (info.dimeRoll * 5) + 
        (info.nickelRoll * 2) + 
        (info.pennyRoll * 0.50);
    
        // Round the total value to the nearest cent
        totalTransferAmount = Math.round(totalTransferAmount * 100) / 100;

        if (currentPosIndex === 0){
            axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateCashCount', {
            "storeID": auth.cookie.user.viewingStoreID,
            "usrID": auth.cookie.user.ID,
            "total": totalAmount,
            "type": "CLOSE",
            "itemCounted": poss[currentPosIndex].name,
            "amountExpected": expectedAmount,
            "hundred": elm100Dollar,
            "fifty": elm50Dollar,
            "twenty": elm20Dollar,
            "ten": elm10Dollar,
            "five": elm5Dollar,
            "two": elm2Dollar,
            "one": elm1Dollar,
            "dollarCoin": elm1DollarCoin,
            "halfDollar": elmHalfDollarCoin,
            "quarter": elmQuarters,
            "dime": elmDimes,
            "nickel": elmNickles,
            "penny": elmPennies,
            "quarterRoll": elmQuartersRolled,
            "dimeRoll": elmDimesRolled,
            "nickelRoll": elmNicklesRolled,
            "pennyRoll": elmPenniesRolled,
            "cashToBankTotal": totalTransferAmount,
            "hundredToBank": info.hundred,
            "fiftyToBank": info.fifty,
            "twentyToBank": info.twenty,
            "tenToBank": info.ten,
            "fiveToBank": info.five,
            "twoToBank": info.two,
            "oneToBank": info.one,
            "quarterRollToBank": info.quarterRoll,
            "dimeRollToBank": info.dimeRoll,
            "nickelRollToBank": info.nickelRoll,
            "pennyRollToBank": info.pennyRoll
            })
            .then(response => {
                console.log(response);
                if (response.status === 200){
                    //close POS
                    setPostSuccess(true);
                    toast.success(poss[currentPosIndex].name + " closed successfully!");
                }else{
                    setPostSuccess(false);
                    toast.error(poss[currentPosIndex].name + " failed to close!");
                }
            })
            .catch(error => {
                toast.error("Network or server error on: " + poss[currentPosIndex].name);
            });

            if (totalTransferAmount > 0) {
                setShowPopup(true);
                setIsSafe(true);
                setPopupInfo({
                    hundred: info.hundred,
                    fifty: info.fifty,
                    twenty: info.twenty,
                    ten: info.ten,
                    five: info.five,
                    two: info.two,
                    one: info.one,
                    quarterRoll: info.quarterRoll,
                    dimeRoll: info.dimeRoll,
                    nickelRoll: info.nickelRoll,
                    pennyRoll: info.pennyRoll,
                });
            }

        }else {
            axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateCashCount', {
                "storeID": auth.cookie.user.viewingStoreID,
                "usrID": auth.cookie.user.ID,
                "total": totalAmount,
                "type": "CLOSE",
                "itemCounted": poss[currentPosIndex].name,
                "amountExpected": expectedAmount,
                "hundred": elm100Dollar,
                "fifty": elm50Dollar,
                "twenty": elm20Dollar,
                "ten": elm10Dollar,
                "five": elm5Dollar,
                "two": elm2Dollar,
                "one": elm1Dollar,
                "dollarCoin": elm1DollarCoin,
                "halfDollar": elmHalfDollarCoin,
                "quarter": elmQuarters,
                "dime": elmDimes,
                "nickel": elmNickles,
                "penny": elmPennies,
                "quarterRoll": elmQuartersRolled,
                "dimeRoll": elmDimesRolled,
                "nickelRoll": elmNicklesRolled,
                "pennyRoll": elmPenniesRolled,
                "creditExpected": creditExpected,
                "creditActual": creditActual,
                "cashToSafeTotal": totalTransferAmount,
                "hundredToSafe": info.hundred,
                "fiftyToSafe": info.fifty,
                "twentyToSafe": info.twenty
            })
            .then(response => {
                console.log(response);
                if (response.status === 200){
                    //close POS
                    setPostSuccess(true);
                    toast.success(poss[currentPosIndex].name + " closed successfully!");
                }else{
                    setPostSuccess(false);                                      
                    toast.error(poss[currentPosIndex].name + " failed to close!");
                }
            })
            .catch(error => {
                console.error(error);
                setPostSuccess(false);                                  
                toast.error("Network or server error on: " + poss[currentPosIndex].name);
            });

            if (totalTransferAmount > 0) {
                setShowPopup(true);
                setIsSafe(false);
                setPopupInfo({
                    hundred: info.hundred,
                    fifty: info.fifty,
                    twenty: info.twenty,
                });
            }
        }
    }

    return (
        <div className="flex h-screen bg-custom-accent">
            <Toaster 
                richColors 
                position="bottom-right"
                expand={true}
                duration={5000}
                pauseWhenPageIsHidden={true}
            />
            <SideBar currentPage={2} />
            <div className="w-full">
                <HorizontalNav />
                <div className="text-main-color float-left ml-8 mt-12">
                    <p className="text-2xl mb-2">Select a POS to close</p>
                    {posHasLoaded ? 
                        <>
                            {poss.map((item, index) => (
                                <>
                                    <label>
                                        <input 
                                            key={item.name} 
                                            defaultChecked={index === 0 ? true : false}
                                            onChange={(e) => setCurrentPosIndex(index)} 
                                            disabled={!item.opened}
                                            type="radio" 
                                            name="POS" 
                                            value={item.name} 
                                        />
                                        {item.name} - {item.opened ? "Open" : "Closed"}
                                    </label>
                                    <br/>
                                </>
                            ))}
                        </>
                    : <p>Loading...</p>}
                </div>
                <div className="text-main-color float-left ml-16 mt-12">
                    {
                        posHasLoaded ? 
                        <p className="text-2xl" >Enter denominations for {poss[currentPosIndex].name}</p>
                        :
                        <p className="text-2xl" >Waiting for POS data...</p>
                    }
                    <br/><hr/><br/>
                    <form onSubmit={Submit}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label>Pennies
                                            <input 
                                                value={elmPennies} 
                                                onChange={e => setElmPennies(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                    <td>
                                        <label>$1's
                                            <input 
                                                value={elm1Dollar} 
                                                onChange={e => setElm1Dollar(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Nickles
                                            <input 
                                                value={elmNickles} 
                                                onChange={e => setElmNickles(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                    <td>
                                        <label>$5's
                                            <input 
                                                value={elm5Dollar} 
                                                onChange={e => setElm5Dollar(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Dimes
                                            <input 
                                                value={elmDimes} 
                                                onChange={e => setElmDimes(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                    <td>
                                        <label>$10s
                                            <input 
                                                value={elm10Dollar} 
                                                onChange={e => setElm10Dollar(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Quarters
                                            <input 
                                                value={elmQuarters} 
                                                onChange={e => setElmQuarters(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                    <td>
                                        <label>$20s
                                            <input 
                                                value={elm20Dollar} 
                                                onChange={e => setElm20Dollar(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Pennies (rolled)
                                            <input 
                                                value={elmPenniesRolled} 
                                                onChange={e => setElmPenniesRolled(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                    <td>
                                        <label>$50s
                                            <input 
                                                value={elm50Dollar} 
                                                onChange={e => setElm50Dollar(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Nickles (rolled)
                                            <input 
                                            value={elmNicklesRolled} 
                                            onChange={e => setElmNicklesRolled(clamp(e.target.value))} 
                                            min="0" 
                                            className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                            type="number"
                                        />
                                        </label>
                                    </td>
                                    <td>
                                        <label>$100s
                                            <input 
                                                value={elm100Dollar} 
                                                onChange={e => setElm100Dollar(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Dimes (rolled)
                                            <input 
                                                value={elmDimesRolled} 
                                                onChange={e => setElmDimesRolled(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                    <td>
                                        <label>Quarters (rolled)
                                            <input 
                                                value={elmQuartersRolled} 
                                                onChange={e => setElmQuartersRolled(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                </tr>
                                {showExtraChange === true &&<tr>
                                    <td>
                                        <label>$1 coin
                                            <input 
                                                value={elm1DollarCoin} 
                                                onChange={e => setElm1DollarCoin(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                    <td>
                                        <label>$2's
                                            <input 
                                                value={elm2Dollar} 
                                                onChange={e => setElm2Dollar(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                </tr>}
                                {showExtraChange === true &&<tr>
                                    <td>
                                        <label>$1/2 coin
                                            <input 
                                                value={elmHalfDollarCoin} 
                                                onChange={e => setElmHalfDollarCoin(clamp(e.target.value))} 
                                                min="0" 
                                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                                type="number"
                                            />
                                        </label>
                                    </td>
                                    <td>
                                    </td>
                                </tr>}
                                <tr>
                                    <td colSpan="2"><p className="cursor-pointer w-full mb-4 text-center hover:bg-nav-bg bg-white text-xl" onClick={ToggleExtraChange}>{showExtraChangeTxt}</p></td>
                                </tr>
                                <tr>
                                    <td>
                                        <button type="submit" value="submit" min="0" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Close POS</button>
                                    </td>
                                    <td>
                                        <button onClick={ClearAllFields} type="button" value="button" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Clear all fields</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className="text-main-color text-2xl float-left ml-16 mt-12">
                    <div>
                        <label> Current Total:
                            <input 
                                value={totalAmount} 
                                className={totalAmountStyle} 
                                type="text" 
                                disabled={true}
                            />
                        </label>
                    </div>
                    <br/>
                    <div>
                        <label> Expected Total:
                            <input 
                                value={expectedAmount} 
                                onChange={e => setExpectedAmount(clamp(e.target.value))} 
                                disabled={currentPosIndex === 0}
                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-white" 
                                type="number" 
                            />
                        </label>
                    </div>
                    <br/>
                        { currentPosIndex !== 0 && (<div>
                            <div>
                                <label> Credit Actual:
                                    <input
                                        value={creditActual} 
                                        onChange={e => setCreditActual(clamp(e.target.value))}  
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-white" 
                                        type="number" 
                                    />
                                </label>
                            </div>
                            <br/>
                            <div>
                                <label> Credit Expected:
                                    <input 
                                        value={creditExpected} 
                                        onChange={e => setCreditExpected(clamp(e.target.value))} 
                                        className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 bg-white" 
                                        type="number" 
                                    />
                                </label>
                            </div>
                        </div>)}
                    <div>
                        {postSuccess === true && <p className="text-base font-bold text-green-500">{possSuccessTxt}</p>}
                        {postSuccess === false && <p className="text-base font-bold text-red-500">{possSuccessTxt}</p>}
                    </div>
                </div>
                {showPopup && (
                    <CloseDayOver
                        onClose={() => {
                            setShowPopup(false);
                        }}
                        details={popupInfo}
                        isSafe={isSafe}
                    />
                )}
            </div>
        </div>
    )
}

export default CloseDayPage;
