import "../styles/PageStyles.css";
import axios from "axios";
import React, {useState} from 'react';
import HomePage from './HomePage';

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

    //changes the currently-selected pos to either open or close
    function changeCurrentPos(id){
        console.log(id - 1);
        setCurrentPos(poss[id - 1]);
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
            <HomePage />
            <div className="text-main-color float-left ml-8 mt-32">
                <p className="text-2xl mb-2">Select a POS to open</p>
                {poss.map(item => (
                    <>
                        <input key={"pos" + item.id} onChange={(e) => changeCurrentPos(item.id)} type="radio" name="pos" value="POS {item.id}" />
                        <label key={"lbl" + item.id} >POS {item.id} - {item.open}</label>
                        <br/>
                    </>
                ))}
            </div>
            <div className="text-main-color float-left ml-16 mt-32">
                <p className="text-3xl" >Enter denominations for POS # {currentPos.id}</p>
                <br/><hr/><br/>
                <form onSubmit={Submit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label>Pennies</label>
                                    <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>$1's</label>
                                    <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Nickles</label>
                                    <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>$5's</label>
                                    <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Dimes</label>
                                    <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>$10s</label>
                                    <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Quarters</label>
                                    <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                                <td>
                                    <label>$20s</label>
                                    <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                </td>
                                <td>
                                    <label>$50s</label>
                                    <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                </td>
                                <td>
                                    <label>$100s</label>
                                    <input className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white" type="number"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button type="submit" value="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
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