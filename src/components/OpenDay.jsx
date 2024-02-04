import "../styles/PageStyles.css";
import React, {useState} from 'react';

const OpenDayPage = () =>{
    const poss = [
        {id: 1, open: "Closed"},
        {id: 2, open: "Closed"},
        {id: 3, open: "Closed"},
        {id: 4, open: "Closed"},
        {id: 5, open: "Closed"},
    ];

    return (
        <div>
            <div className="text-main-color float-left ml-4">
                <p>Select a POS to open</p>
                {poss.map(item => (
                    <>
                        <input type="radio" name="pos" value="POS {item.id}" />
                        <label for="POS {item.id}" >POS {item.id} - {item.open}</label>
                        <br/>
                    </>
                ))}
            </div>
            <div className="text-main-color float-left ml-8 ">
                <form>
                    <table className="">
                        <tr className="m-4">
                            <td>
                                <label>Pennies</label>
                                <input className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                            </td>
                            <td>
                                <label>$1's</label>
                                <input className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Nickles</label>
                                <input className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                            </td>
                            <td>
                                <label>$5's</label>
                                <input className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Dimes</label>
                                <input className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Quarters</label>
                                <input className="box-border cursor-pointer border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                            </td>
                            <td>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    )
}

export default OpenDayPage;