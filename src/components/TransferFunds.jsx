import "../styles/PageStyles.css";
import axios from "axios";
import React, { useState } from "react";
import SideBar from "./SideBar";

const TransferFunds = () => {
  //sample data to demonstrate how this all works. In reality, we would get all the POS data with a post get request to the db and store it in an array
  const poss = [
    { id: 1, open: "Closed" },
    { id: 2, open: "Closed" },
    { id: 3, open: "Closed" },
    { id: 4, open: "Closed" },
    { id: 5, open: "Closed" },
  ];
  const [currentPosSource, setCurrentPosSource] = useState(poss[0]);
  const [currentPosDestination, setCurrentPosDestination] = useState(poss[0]);

  //changes the source pos to either open or close
  function changeCurrentPosSource(id) {
    console.log(id - 1);
    setCurrentPosSource(poss[id - 1]);
  }
  function changeCurrentPosDestination(id) {
    console.log(id - 1);
    setCurrentPosDestination(poss[id - 1]);
  }

  function Submit(event) {
    event.preventDefault();

    axios
      .post("", {
        username: "username",
      })
      .then((response) => {
        console.log(response);
        if (response.data.IsValid == true) {
          //navigate(routes.home);
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <SideBar currentPage={3} />
      <div className="text-main-color float-left ml-8 mt-32">
        <p className="text-2xl mb-2">Source:</p>
        {poss.map((item) => (
          <>
            {item.id == 1 ? (
              <input
                key={"pos" + item.id}
                onChange={(e) => changeCurrentPosSource(item.id)}
                type="radio"
                name="pos"
                value={"POS " + item.id}
              />
            ) : (
              <input
                key={"pos" + item.id}
                onChange={(e) => changeCurrentPosSource(item.id)}
                type="radio"
                name="pos"
                value={"POS " + item.id}
              />
            )}
            <label key={"lbl" + item.id}>
              POS {item.id} - {item.open}
            </label>
            <br />
          </>
        ))}
      </div>
      <div className="text-main-color float-left ml-16 mt-32">
        <p className="text-2xl mb-2">Destination:</p>
        {poss.map((item) => (
          <>
            {item.id == 1 ? (
              <input
                key={"pos" + item.id}
                onChange={(e) => changeCurrentPosDestination(item.id)}
                type="radio"
                name="pos"
                value={"POS " + item.id}
              />
            ) : (
              <input
                key={"pos" + item.id}
                onChange={(e) => changeCurrentPosDestination(item.id)}
                type="radio"
                name="pos"
                value={"POS " + item.id}
              />
            )}
            <label key={"lbl" + item.id}>
              POS {item.id} - {item.open}
            </label>
            <br />
          </>
        ))}
      </div>
      <div className="text-main-color float-left ml-16 mt-32">
        <label className="text-2xl mb-2">Amount:</label>
        <input
          defaultValue="0"
          className="box-border text-center mb-4 ml-6 mr-12 w-24 float-right border-border-color border-2 hover:bg-nav-bg bg-white"
          type="number"
        />
        <button
          onClick={Submit}
          type="submit"
          value="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TransferFunds;
