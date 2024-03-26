import React, { useEffect } from "react";


const CloseDayOver = ({ onClose, details, isSafe }) => {
    console.log(isSafe)
    useEffect(() => {
        console.log(isSafe)
    }, []);
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2>Threshold Exceeded</h2>
                {isSafe ? (
                    <>
                        <p>Safe has exceeded the threshold.</p>
                        <p>Please deposit the following to the bank:</p>
                        <ul>
                            <li>Hundreds: {details.hundred}</li>
                            <li>Fifties: {details.fifty}</li>
                            <li>Twenties: {details.twenty}</li>
                            <li>Tens: {details.ten}</li>
                            <li>Fives: {details.five}</li>
                            <li>Ones: {details.one}</li>
                            <li>Quarter Rolls: {details.quarterRoll}</li>
                            <li>Dime Rolls: {details.dimeRoll}</li>
                            <li>Nickel Rolls: {details.nickelRoll}</li>
                            <li>Penny Rolls: {details.pennyRoll}</li>
                        </ul>
                    </>
                ) : (
                    <>
                        <p>Register has exceeded the threshold.</p>
                        <p>Please move the following to the safe:</p>
                        <ul>
                            <li>Hundreds: {details.hundred}</li>
                            <li>Fifties: {details.fifty}</li>
                            <li>Twenties: {details.twenty}</li>
                        </ul>
                    </>
                )}
                <button onClick={onClose} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default CloseDayOver;