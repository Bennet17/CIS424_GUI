import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState} from 'react';
import Navbar from './Navbar';
import HorizontalNav from "./HorizontalNav";
import classNames from 'classnames';

const DepositHistory = () => {

    const statusStyle = classNames(
        'box-border',
        'border-border-color',
        'border-2',
        'text-center',
        'w-12',
        'h-8',
        {
            'bg-border-color': status.OPEN,
            'bg-nav-bg': status.PENDING,
            'bg-main-color': status.CLOSED,
        }
    );
    
    const status = {
        OPEN: 0,
        PENDING: 1,
        CLOSED: 2,
    }

    return (
        <div>
            <Navbar />
            <HorizontalNav />
            <div className="float-left ml-20">
                <p className="text-main-color text-center text-3xl mb-4">Deposit History Report</p>
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
                        <tr>
                            <td className="text-right w-28 h-8"></td>
                            <td className={statusStyle}></td>
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
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DepositHistory;