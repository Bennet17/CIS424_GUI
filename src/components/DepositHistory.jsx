import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState, useLayoutEffect, useEffect} from 'react';
import SideBar from './SideBar';
import HorizontalNav from "./HorizontalNav";
import classNames from 'classnames';
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import {useAuth} from '../AuthProvider.js';

const DepositHistory = () => {

    const [records, setRecords] = useState([]);
    const [hasRecords, setHasRecords] = useState(false);
    const [date, setDate] = useState(GetTodaysDate());

    //sample data, which populates the table based on each store location
    const dummyData = [
        {date: new Date().toLocaleDateString(), amount: 100, location: 1, user: 5, status: "open"}, 
        {date: new Date().toLocaleDateString(), amount: 120, location: 1, user: 1, status: "closed"},
        {date: new Date().toLocaleDateString(), amount: 80, location: 1, user: 3, status: "pending"},
        {date: new Date().toLocaleDateString(), amount: 30, location: 1, user: 4, status: "open"},
        {date: new Date().toLocaleDateString(), amount: 3000, location: 1, user: 2, status: "closed"},
    ];
    const [selectedRow, SetSelectedRow] = useState(null);

    const auth = useAuth();
    const navigate = useNavigate();

    //build todays date as a string that our input field will accept because i hate js why doesn't it have this built-in what the fuck
    function GetTodaysDate(){
        const date = new Date();
        let y = date.getFullYear().toString();

        let m = date.getMonth().toString();
        if (m.length < 2) m = "0" + m;

        let d = date.getDay().toString();
        if (d.length < 2) d = "0" + d;

        return y + "-" + m + "-" + d;
    }

    //check the permissions of the logged in user on page load, passing in
    //the required permissions
    useLayoutEffect(() => {
        if (!auth.CheckAuthorization(["Manager", "District Manager", "CEO"])){
            navigate(routes.home);
        }
    })

    //render custom fields based on condition
    function FieldStatus({data}){
        //set default css
        let cssTxt = "font-bold text-right w-28 h-8 pr-2";
        let cssBg = "box-border border-border-color border-2 text-center w-12 h-8";
        
        //set css based on data
        if (data == "open" || data == "OPEN"){
            cssTxt = "text-green-600 " + cssTxt;
            cssBg = "bg-green-500 " + cssBg;
        }else if (data == "pending" || data == "PENDING"){
            cssTxt = "text-yellow-700 " + cssTxt;
            cssBg = "bg-yellow-500 " + cssBg;
        }else if (data == "closed" || data == "CLOSED"){
            cssTxt = "text-red-600 " + cssTxt;
            cssBg = "bg-red-500 " + cssBg;
        }

        //return fields
        return (
            <>
                <td className={cssTxt}>{data}</td>
                <td className={cssBg}></td>
            </>
        );
    }

    //selects the row's index
    function SelectRow(fieldIndex){
        if (selectedRow != fieldIndex){
            SetSelectedRow(fieldIndex);
            console.log("Selected row index " + fieldIndex); 
        }else{
            SetSelectedRow(null);
            console.log("Deselected row index " + fieldIndex); 
        }     
    }

    //call on component load AND when we attempt to retrieve new records
    useEffect(() => {
        if (records != undefined && records.length > 0){
            setHasRecords(true);
        }else{
            setHasRecords(false);
        }
    }, [records])

    //call on component load AND when we change our date
    useEffect(() => {
        console.log(date);
        function Initialize(){
            axios.get(`https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/GetFundTransfersForStore?storeID=${auth.cookie.user.viewingStoreID}&startDate=${date}&endDate=${date}`)
            .then(response => {
                console.log(response.data);
                //set the transfer history information data
                var dataArr = [];
                for (var i = 0; i < response.data.length; i ++){
                    if (response.data[i].destination == "BANK"){
                        dataArr.push(response.data[i]);
                    }
                }
                
                //set our records array after we have all of our deposits to bank
                console.log(dataArr);
                setRecords(dataArr);
            })
            .catch(error => {
                console.error(error);
            });
        }

        Initialize();
    }, [date]);
    
    function Submit(event){
        //prevents default behavior of sending data to current URL And refreshing page
        event.preventDefault();

        axios.post('', {
        })
        .then(response => {
            console.log(response);
            
        })
        .catch(error => {
            console.error(error);
        });
    }

    function Abort(event){
        //prevents default behavior of sending data to current URL And refreshing page
        event.preventDefault();

        axios.post('', {
        })
        .then(response => {
            console.log(response);
            
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <div className="flex h-screen bg-custom-accent">
            <SideBar currentPage={6} />
            <div className="w-full">
                <HorizontalNav />
                <div className="text-main-color w-64 text-2xl float-left ml-8 mt-32">
                    <p>Select an open deposit to mark as pending or closed</p>
                    <br/>
                    <label>Date:
                        <input 
                            value={date} 
                            onChange={e => setDate(e.target.value)}  
                            className="box-border text-center text-base mb-4 ml-6 mr-12 w-32 float-right border-border-color border-2 hover:bg-nav-bg bg-white" 
                            type="date"
                        />
                    </label>
                </div>
                <div className="float-left ml-4">
                    <p className="text-main-color text-center text-3xl mt-4 mb-4">Deposit History Report</p>
                    <table>
                        <tbody>
                            <tr>
                                <td className="text-right w-28 h-12"></td>
                                <td className="text-center w-12 h-12"></td>
                                <td className="box-border border-border-color border-2 text-center w-28 h-12">Date</td>
                                <td className="box-border border-border-color border-2 text-center w-28 h-12">Deposit Amount</td>
                                <td className="box-border border-border-color border-2 text-center w-28 h-12">Location</td>
                                <td className="box-border border-border-color border-2 text-center w-28 h-12">Opened By</td>
                            </tr>
                            {hasRecords === true &&
                                records.map((item, index) => (
                                    <tr onClick={() => SelectRow(index)} className={`${selectedRow == index && "bg-amber-200"}`} >
                                        <FieldStatus data={item.status} />
                                        <td className={`${selectedRow == index ? "bg-amber-200" : "bg-nav-bg"} box-border border-border-color border-2 text-left w-52 h-8 pl-2`}>{item.date}</td>
                                        <td className={`${selectedRow == index ? "bg-amber-200" : "bg-nav-bg"} box-border border-border-color border-2 text-left w-28 h-8 pl-2`}>{"$" + item.total}</td>
                                        <td className={`${selectedRow == index ? "bg-amber-200" : "bg-nav-bg"} box-border border-border-color border-2 text-left w-28 h-8 pl-2`}>{item.destination}</td>
                                        <td className={`${selectedRow == index ? "bg-amber-200" : "bg-nav-bg"} box-border border-border-color border-2 text-left w-48 h-8 pl-2`}>{item.name}</td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td>
                                </td>
                                <td>
                                </td>
                                <td colSpan="2">
                                    <button type="submit" value="submit" className={`flex w-full justify-center rounded-md ${selectedRow == null ? "" : "hover:bg-indigo-500"} ${selectedRow == null ? "bg-gray-400" : "bg-indigo-600"} px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm ${selectedRow == null ? "text-black" : "text-white"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`} onClick={Submit}>Submit</button>
                                </td>
                                <td colSpan="2">
                                    <button type="submit" value="submit" className={`flex w-full justify-center rounded-md ${selectedRow == null ? "" : "hover:bg-indigo-500"} ${selectedRow == null ? "bg-gray-400" : "bg-indigo-600"} px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm ${selectedRow == null ? "text-black" : "text-white"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`} onClick={Abort}>Abort Deposit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DepositHistory;