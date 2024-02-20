import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState} from 'react';
import Navbar from './Navbar';
import HorizontalNav from "./HorizontalNav";

const OpenDayPage = () =>{
    //sample data to demonstrate how this all works. In reality, we would get all the POS data with a post get request to the db and store it in an array
    const poss = [
        {id: 0, open: "Closed"},
        {id: 1, open: "Closed"},
        {id: 2, open: "Closed"},
        {id: 3, open: "Closed"},
        {id: 4, open: "Closed"},
        {id: 5, open: "Closed"},
    ];
    const [currentPos, setCurrentPos] = useState(poss[0]);
    const [showExtraChange, setShowExtraChange] = useState(false);
    const [showExtraChangeTxt, setShowExtraChangeTxt] = useState("show extras ▼");

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

    //changes the currently-selected pos to either open or close
    function changeCurrentPos(id){
        console.log(id);
        setCurrentPos(poss[id]);
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

    function Submit(event){
        //prevents default behavior of sending data to current URL And refreshing page
        event.preventDefault();

        axios.post('', {
            "username": "username",
        })
        .then(response => {
            console.log(response);
            if (response.data.IsValid == true){
                
            }else{

            }
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <div>
            <Navbar />
            <HorizontalNav />
            <div className="text-main-color float-left ml-8 mt-12">
                <p className="text-2xl mb-2">Select a POS to open</p>
                {poss.map(item => (
                    <>
                    {item.id == 1 ?
                        <>
                            <label>
                                <input key={"pos" + item.id} defaultChecked={true} onChange={(e) => changeCurrentPos(item.id)} type="radio" name="pos" value={"POS "+ item.id} />
                                POS {item.id} - {item.open}
                            </label>
                        </>
                    :
                        <>
                            <label>
                                <input key={"pos" + item.id} onChange={(e) => changeCurrentPos(item.id)} type="radio" name="pos" value={"POS "+ item.id} />
                                POS {item.id} - {item.open}
                            </label>
                        </>
                    }
                        <br/>
                    </>
                ))}
            </div>
            <div className="text-main-color float-left ml-16 mt-12">
                {currentPos.id == 0 ?
                    <p className="text-3xl" >Enter denominations for Safe</p>
                :
                    <p className="text-3xl" >Enter denominations for POS # {currentPos.id}</p>
                }
                <br/><hr/><br/>
                <form onSubmit={Submit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label>Pennies
                                        <input value={elmPennies} onChange={e => setElmPennies(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                                <td>
                                    <label>$1's
                                        <input value={elm1Dollar} onChange={e => setElm1Dollar(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Nickles
                                        <input value={elmNickles} onChange={e => setElmNickles(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                                <td>
                                    <label>$5's
                                        <input value={elm5Dollar} onChange={e => setElm5Dollar(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Dimes
                                        <input value={elmDimes} onChange={e => setElmDimes(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                                <td>
                                    <label>$10s
                                        <input value={elm10Dollar} onChange={e => setElm10Dollar(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Quarters
                                        <input value={elmQuarters} onChange={e => setElmQuarters(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                                <td>
                                    <label>$20s
                                        <input value={elm20Dollar} onChange={e => setElm20Dollar(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Pennies (rolled)
                                        <input value={elmPenniesRolled} onChange={e => setElmPenniesRolled(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                                <td>
                                    <label>$50s
                                        <input value={elm50Dollar} onChange={e => setElm50Dollar(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Nickles (rolled)
                                        <input value={elmNicklesRolled} onChange={e => setElmNicklesRolled(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                                <td>
                                    <label>$100s
                                        <input value={elm100Dollar} onChange={e => setElm100Dollar(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Dimes (rolled)
                                        <input value={elmDimesRolled} onChange={e => setElmDimesRolled(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                                <td>
                                    <label>Quarters (rolled)
                                        <input value={elmQuartersRolled} onChange={e => setElmQuartersRolled(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                            </tr>
                            {showExtraChange == true &&<tr>
                                <td>
                                    <label>$1 coin
                                        <input value={elm1DollarCoin} onChange={e => setElm1DollarCoin(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                                <td>
                                    <label>$2's
                                        <input value={elm2Dollar} onChange={e => setElm2Dollar(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </label>
                                </td>
                            </tr>}
                            {showExtraChange == true &&<tr>
                                <td>
                                    <label>$1/2 coin
                                        <input value={elmHalfDollarCoin} onChange={e => setElmHalfDollarCoin(e.target.value)} className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
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
                                    <button type="submit" value="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Open Register</button>
                                </td>
                                <td>
                                    <button onClick={ClearAllFields} type="button" value="button" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Clear all fields</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    )
}

export default OpenDayPage;