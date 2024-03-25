import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState, useLayoutEffect, useEffect} from 'react';
import SideBar from './SideBar';
import HorizontalNav from "./HorizontalNav";
import classNames from 'classnames';
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import {useAuth} from '../AuthProvider.js';
import { Toaster, toast } from 'sonner';

const DepositHistory = () => {

    const [records, setRecords] = useState([]);
    const [hasRecords, setHasRecords] = useState(false);
    const [date, setDate] = useState(GetTodaysDate());
    const [selectedRow, SetSelectedRow] = useState(null);
    const [postSuccess, setPostSuccess] = useState(false);

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
        if (!auth.CheckAuthorization(["Manager", "District Manager", "Owner"])){
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

    //call on component load AND when we select a new row
    useEffect(() => {
        if (selectedRow != null){
            console.log("Selected row index " + selectedRow);
            console.log(records[selectedRow]);
        }else{
            console.log("Deselected row"); 
        }
    }, [selectedRow]);

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
    }, [date, postSuccess]);
    
    function Submit(event){
        //prevents default behavior of sending data to current URL And refreshing page
        event.preventDefault();

        //don't let the user try and submit or abort closed/aborted records or when no records are selected
        if (selectedRow == null || records[selectedRow].status == "CLOSED" || records[selectedRow].status == "ABORTED"){
            toast.error("Cannot change status of closed or aborted deposit!");
        }else if (auth.cookie.user.viewingStoreID !== auth.cookie.user.workingStoreID){
            toast.error("Cannot perform action when page is view-only");
        }else{
            axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/UpdateDepositStatus', {
                "ID": records[selectedRow].fID
            })
            .then(response => {
                console.log(response);
                if (response.status == 200){
                    toast.success("Deposit successfully updated!");
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Unknown error occured");
            });
        }
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
            <Toaster 
                richColors 
                position="bottom-right"
                expand={true}
                duration={5000}
                pauseWhenPageIsHidden={true}
            />
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
                                    <tr onClick={() => (selectedRow == index) ? SetSelectedRow(null) : SetSelectedRow(index)} className={`${selectedRow == index && "bg-amber-200"}`} >
                                        <FieldStatus data={item.status} />
                                        <td className={`${selectedRow == index ? "bg-amber-200" : "bg-nav-bg"} box-border border-border-color border-2 text-left w-52 h-8 pl-2`}>{item.date.split("T")[0]}</td>
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
                                    <button type="submit" value="submit" className={`flex w-full justify-center rounded-md ${(selectedRow == null || records[selectedRow].status == "CLOSED") ? "" : "hover:bg-indigo-500"} ${(selectedRow == null || records[selectedRow].status == "CLOSED") ? "bg-gray-400" : "bg-indigo-600"} px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm ${(selectedRow == null || records[selectedRow].status == "CLOSED") ? "text-black" : "text-white"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`} onClick={Submit}>Submit</button>
                                </td>
                                <td colSpan="2">
                                    <button type="submit" value="submit" className={`flex w-full justify-center rounded-md ${(selectedRow == null || records[selectedRow].status == "CLOSED") ? "" : "hover:bg-indigo-500"} ${(selectedRow == null || records[selectedRow].status == "CLOSED") ? "bg-gray-400" : "bg-indigo-600"} px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm ${(selectedRow == null || records[selectedRow].status == "CLOSED") ? "text-black" : "text-white"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`} onClick={Abort}>Abort Deposit</button>
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