import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState, useEffect} from 'react';
import SideBar from './SideBar';
import HorizontalNav from "./HorizontalNav";
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import {useAuth} from '../AuthProvider.js';

const SafeAuditPage = () =>{
    const auth = useAuth();
    const navigate = useNavigate();

    const [startDay, setStartDay] = useState();
    const [endDay, setEndDay] = useState();
    const [currentDay, setCurrentDay] = useState(Date.toString(Date.now));

    //changes the start day, end day, and current day
    function changeDayStart(){
    }
    function changeDayEnd(){
    }
    function changeDayCurrent(){
    }

    //check the permissions of the logged in user on page load, passing in
    //the required permissions
    useEffect(() => {
        if (!auth.CheckAuthorization(["Manager", "District Manager", "CEO"])){
            navigate(routes.signout);
        }
    })

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
        <div className="flex h-screen bg-custom-accent">
            <SideBar currentPage={5} />
            <div className="flex flex-col w-full">
                <HorizontalNav />
                <div className="float-left ml-10 mt-12">
                    <label className="text-main-color text-2xl">Start Date:</label>
                    <input onChange={changeDayStart} 
                        className="box-border text-center  ml-4 mr-12 w-32 border-border-color border-2 hover:bg-nav-bg bg-white" 
                        type="date" 
                        name="start">
                    </input>
                </div>
                <div className="float-left ml-10 mt-4">
                    <label className="text-main-color text-2xl ">End Date:</label>
                    <input 
                        onChange={changeDayEnd} 
                        className="box-border text-center ml-4 mr-12 w-32 border-border-color border-2 hover:bg-nav-bg bg-white" 
                        type="date" 
                        name="start">
                    </input>
                </div>
                <div className="float-left ml-32 mt-8">
                    <div>
                        <div onClick="" className=""></div>
                        <p className="text-center w-252">{currentDay}</p>
                        <table className="box-border border-border-color border-2">
                            <tbody>
                                <tr>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">
                                        Date
                                    </td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">
                                        Cash Tendered
                                    </td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">
                                        Cash Buys
                                    </td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">
                                        Petty Cash
                                    </td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">
                                        MasterCard Sale
                                    </td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">
                                        Visa Sale
                                    </td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">
                                        American Express Sale
                                    </td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">
                                        Discover Sale
                                    </td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">
                                        Debit Sales
                                    </td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">
                                        Other Card Sales
                                    </td>
                                </tr>
                                <tr>
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
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
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
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
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
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
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
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
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
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
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
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
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
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
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
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
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">Total Date</td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">Total Cash Tendered</td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">Total Cash Buys</td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">Total Petty Cash</td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">Total MasterCard Sale</td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">Total Visa Sale</td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">Total American Express Sale</td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">Total Discover Sale</td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">Total Debit Sales</td>
                                    <td className="box-border border-border-color border-2 text-center w-28 h-12">Total Other Card Sales</td>
                                </tr>
                                <tr>
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                    <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
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
                                        <label className="text-main-color">Cash Tendered:</label>
                                        <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </td>
                                    <td>
                                        <label className="text-main-color">Cash Buys:</label>
                                        <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </td>
                                    <td>
                                        <div className="text-main-color ml-6 mr-12">
                                            <p>Save Safe Audit</p>
                                            <img onClick={""} src="" alt="download" className=""/>
                                        </div>
                                    </td>
                                    <td>
                                        <button type="submit" value="submit" className="flex w-36 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label className="text-main-color">Petty Cash:</label>
                                        <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </td>
                                    <td>
                                        <label className="text-main-color">Credit Sales:</label>
                                        <input defaultValue="0" className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SafeAuditPage;