import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState, useLayoutEffect} from 'react';
import SideBar from './SideBar';
import HorizontalNav from "./HorizontalNav";
import classNames from 'classnames';
import {useNavigate} from 'react-router-dom';
import routes from '../routes.js';
import {useAuth} from '../AuthProvider.js';

const DepositHistory = () => {

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

    const buttonStyle = classNames(
        'flex w-full',
        'justify-center',
        'rounded-md',
        'bg-gray-400',
        'px-3',
        'py-1.5',
        'text-sm',
        'font-semibold',
        'leading-6',
        'shadow-sm',
        'text-black',
        'focus-visible:outline',
        'focus-visible:outline-2',
        'focus-visible:outline-offset-2',
        'focus-visible:outline-indigo-600',
        {
            'bg-indigo-600': selectedRow != null,
            'hover:bg-indigo-500': selectedRow != null,
            'text-white': selectedRow != null,
        }
    );

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
        if (data == "open"){
            cssTxt = "text-green-600 " + cssTxt;
            cssBg = "bg-green-500 " + cssBg;
        }else if (data == "pending"){
            cssTxt = "text-yellow-700 " + cssTxt;
            cssBg = "bg-yellow-500 " + cssBg;
        }else if (data == "closed"){
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
    
    const status = {
        OPEN: 0,
        PENDING: 1,
        CLOSED: 2,
    }

    return (
        <div className="flex h-screen bg-custom-accent">
            <SideBar currentPage={6} />
            <div className="w-full">
                <HorizontalNav />
                <div className="text-main-color w-64 text-2xl float-left ml-8 mt-32">
                    <p>Select an open deposit to mark as pending or closed</p>
                    <br/>
                </div>
                <div className="float-left ml-8">
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
                            {dummyData.map((item, index) => (
                                <tr onClick={() => SelectRow(index)} className={`${selectedRow == index && "bg-amber-200"}`} >
                                    <FieldStatus data={item.status} />
                                    <td className={`${selectedRow == index ? "bg-amber-200" : "bg-nav-bg"} box-border border-border-color border-2 text-left w-28 h-8 pl-2`}>{item.date}</td>
                                    <td className={`${selectedRow == index ? "bg-amber-200" : "bg-nav-bg"} box-border border-border-color border-2 text-left w-28 h-8 pl-2`}>{item.amount}</td>
                                    <td className={`${selectedRow == index ? "bg-amber-200" : "bg-nav-bg"} box-border border-border-color border-2 text-left w-28 h-8 pl-2`}>{item.location}</td>
                                    <td className={`${selectedRow == index ? "bg-amber-200" : "bg-nav-bg"} box-border border-border-color border-2 text-left w-28 h-8 pl-2`}>{item.user}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="text-right w-28 h-8"></td>
                                <td className="box-border border-border-color border-2 text-center w-12 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                            </tr>
                            <tr>
                                <td className="text-right w-28 h-8"></td>
                                <td className="box-border border-border-color border-2 text-center w-12 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                            </tr>
                            <tr>
                                <td className="text-right w-28 h-8"></td>
                                <td className="box-border border-border-color border-2 text-center w-12 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                            </tr>
                            <tr>
                                <td className="text-right w-28 h-8"></td>
                                <td className="box-border border-border-color border-2 text-center w-12 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                            </tr>
                            <tr>
                                <td className="text-right w-28 h-8"></td>
                                <td className="box-border border-border-color border-2 text-center w-12 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                            </tr>
                            <tr>
                                <td className="text-right w-28 h-8"></td>
                                <td className="box-border border-border-color border-2 text-center w-12 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                                <td className="bg-nav-bg box-border border-border-color border-2 text-center w-28 h-8"></td>
                            </tr>
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