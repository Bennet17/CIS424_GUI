import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import HorizontalNav from "./HorizontalNav";
import { useAuth } from "../AuthProvider.js";
import classNames from 'classnames';

const OpenDayPage = () =>{
    const auth = useAuth();

    //sample data to demonstrate how this all works. In reality, we would get all the POS data with a post get request to the db and store it in an array
    const [poss, setPoss] = useState([]);
    const [showExtraChange, setShowExtraChange] = useState(false);
    const [showExtraChangeTxt, setShowExtraChangeTxt] = useState("show extras ▼");
    let currentPos = null;

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
        ) / 100;

    const [expectedAmount, setExpectedAmount] = useState(0);

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
            'text-black': totalAmount == expectedAmount,
        }
    );

    //Stores the general styling for the pos system label/radio buttons.
    //here, we simply change the text color based on whether the pos is open
    /*const posLabelStyle = classNames(
        '',
        {
            'text-green-500': currentPos.open == true,
            'text-rose-600': currentPos.open == false,
        }
    );*/

    function clamp(value, min = 0){
        if (value < min){
            return min;
        }
        return value;
    }

    //changes the currently-selected pos
    function changeCurrentPos(id){
        currentPos = poss[id - 1];
        console.log(currentPos);
    }

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

    //make this call immediately on component load
    useEffect(() => {
        function Initialize(){
            axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewRegistersByStoreID?storeID=${auth.cookie.user.storeID}`)
            .then(response => {
                console.log(response);
                if (true){
                    //set the pos information data
                    setPoss(response.data);

                    //update current pos
                    changeCurrentPos(response.data[0].ID);
                }else{
                    //something broke, oh no
                }
            })
            .catch(error => {
                console.error(error);
            });
        }

        Initialize();
    }, []);

    function Submit(event){
        //prevents default behavior of sending data to current URL And refreshing page
        event.preventDefault();

        axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateCashCount', {
            "usrID": auth.cookie.user.ID,
            "itemCounted": currentPos.ID,
            "total": totalAmount,
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
            "pennyRoll": elmPenniesRolled
        })
        .then(response => {
            console.log(response);
            if (true){
                //open POS
            }else{
                //close POS
            }
        })
        .catch(error => {
            console.error(error);
        });
    }



    return (
        <div className="flex h-screen bg-custom-accent">
            <SideBar currentPage={1} />
            <div className="w-full">
                <HorizontalNav />
                <div className="text-main-color float-left ml-8 mt-12">
                    <p className="text-2xl mb-2">Select a POS to open</p>
                    {poss.map(item => (
                        <>
                            <label>
                                <input 
                                    key={item.name} 
                                    defaultChecked={item.ID == 1 ? true : false}
                                    onChange={(e) => changeCurrentPos(item.ID)} 
                                    type="radio" 
                                    name="pos" 
                                    value={item.name} 
                                />
                                {item.name} - {item.opened ? "Open" : "Closed"}
                            </label>
                            <br/>
                        </>
                    ))}
                </div>
                <div className="text-main-color float-left ml-16 mt-12">
                    {currentPos && <p className="text-2xl" >Enter denominations for {currentPos.name}</p>}
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
                                {showExtraChange == true &&<tr>
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
                                {showExtraChange == true &&<tr>
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
                                        <button type="submit" value="submit" min="0" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Open POS</button>
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
                                value={"$" + totalAmount} 
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
                                min="0" 
                                className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                                type="number" 
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpenDayPage;
