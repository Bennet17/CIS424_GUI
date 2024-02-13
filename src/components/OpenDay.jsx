import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState} from 'react';
import Navbar from './Navbar';
import HorizontalNav from "./HorizontalNav";

const OpenDayPage = () =>{
    //sample data to demonstrate how this all works. In reality, we would get all the POS data with a post get request to the db and store it in an array
    const poss = [
        {id: 1, open: "Closed"},
        {id: 2, open: "Closed"},
        {id: 3, open: "Closed"},
        {id: 4, open: "Closed"},
        {id: 5, open: "Closed"},
    ];
    const [currentPos, setCurrentPos] = useState(poss[0]);
    const [showExtraChange, setShowExtraChange] = useState(false);
    const [showExtraChangeTxt, setShowExtraChangeTxt] = useState("show extras \\/");

    //changes the currently-selected pos to either open or close
    function changeCurrentPos(id){
        console.log(id - 1);
        setCurrentPos(poss[id - 1]);
    }

    //toggles the variable that displays the niche changes, such as $2 bills and $1 coins
    //(also change arrow text thing)
    function ToggleExtraChange(){
        setShowExtraChange(!showExtraChange);
        if (!showExtraChange){
            setShowExtraChangeTxt("hide extras /\\");
        }else{
            setShowExtraChangeTxt("show extras \\/");
        }
    }

    function Submit(event){
        event.preventDefault();

        axios.post('', {
            "username": "username",
        })
        .then(response => {
            console.log(response);
            if (response.data.IsValid == true){
            //navigate(routes.home);
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
                        <input key={"pos" + item.id} onChange={(e) => changeCurrentPos(item.id)} type="radio" name="pos" value={"POS "+ item.id} />
                    :
                        <input key={"pos" + item.id} onChange={(e) => changeCurrentPos(item.id)} type="radio" name="pos" value={"POS "+ item.id} />
                    }
                        <label key={"lbl" + item.id} >POS {item.id} - {item.open}</label>
                        <br/>
                    </>
                ))}
            </div>
            <div className="text-main-color float-left ml-16 mt-12">
                <p className="text-3xl" >Enter denominations for POS # {currentPos.id}</p>
                <br/><hr/><br/>
                <form onSubmit={Submit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label>Pennies</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>$1's</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Nickles</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>$5's</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Dimes</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>$10s</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Quarters</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>$20s</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Pennies (rolled)</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>$50s</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Nickles (rolled)</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>$100s</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Dimes (rolled)</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>Quarters (rolled)</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            {showExtraChange == true &&<tr>
                                <td>
                                    <label>$1 coin</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>$2's</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>}
                            {showExtraChange == true &&<tr>
                                <td>
                                    <label>$1/2 coin</label>
                                    <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
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
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    )
}

export default OpenDayPage;