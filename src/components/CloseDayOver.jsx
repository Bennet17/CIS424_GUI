
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import "primeicons/primeicons.css";

const CloseDayOver = ({ onClose, details, isSafe }) => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2>Rule: Limit Reached</h2>
                {isSafe ? (
                    <>
                        <div className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                            <p>Safe has Reached a Limit.</p>
                        
                            <p>Please deposit the following to the bank:</p>
                        </div>
                        <div className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300">

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
                        </div>
                    </>
                ) : (
                    <>
                        <p>Register has Reached a Limit.</p>
                        <p>Please move the following to the safe:</p>
                        <p></p>
                        <ul>
                            <li>Hundreds: {details.hundred}</li>
                            <li>Fifties: {details.fifty}</li>
                            <li>Twenties: {details.twenty}</li>
                        </ul>
                    </>
                )}

                <Button
                    onClick={onClose}
                    label="Close"
                    rounded
                    icon="pi pi-times"
                    size="small"
                    className="p-button-secondary p-button-raised"
                />
            </div>
        </div>
    );
};

export default CloseDayOver;