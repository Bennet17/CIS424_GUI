import axios from "axios";
import { useState } from "react";

const AddStoreForm = () => {
  const [location, setLocation] = useState('');
  const [hundredRegisterMax, setHundredRegisterMax] = useState('');
  const [twentyRegisterMax, setTwentyRegisterMax] = useState('');
  const [fiftyRegisterMax, setFiftyRegisterMax] = useState('');
  const [hundredMax, setHundredMax] = useState('');
  const [fiftyMax, setFiftyMax] = useState('');
  const [twentyMax, setTwentyMax] = useState('');
  const [tenMax, setTenMax] = useState('');
  const [fiveMax, setFiveMax] = useState('');
  const [twoMax, setTwoMax] = useState('');
  const [oneMax, setOneMax] = useState('');
  const [quarterRollMax, setQuarterRollMax] = useState('');
  const [nickelRollMax, setNickelRollMax] = useState('');
  const [dimeRollMax, setDimeRollMax] = useState('');
  const [pennyRollMax, setPennyRollMax] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

        
    axios
      .post("https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/CreateStore", 
        {
            "location": location,
            "hundredRegisterMax": hundredRegisterMax,
            "fiftyRegisterMax": fiftyRegisterMax,
            "twentyRegisterMax": twentyRegisterMax,
            "hundredMax": hundredMax,
            "fiftyMax": fiftyMax,
            "twentyMax": twentyMax,
            "tenMax": tenMax,
            "fiveMax": fiveMax,
            "twoMax": twoMax,
            "oneMax": oneMax,
            "quarterRollMax": quarterRollMax,
            "dimeRollMax": dimeRollMax,
            "nickelRollMax": nickelRollMax,
            "pennyRollMax": pennyRollMax
        })
      .then((response) => {
        console.log(response.data.response);
        window.location.reload(); // This will refresh the page
  
      })
      .catch((error) => {
        console.error("API request failed:", error);
     
      });
    
  };

  return (
    <div className="relative ml-5">
      <button
        onClick={openModal}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Store
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 w-30 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-md w-auto">
            <span
              onClick={closeModal}
              className="absolute top-0 right-0 cursor-pointer text-gray-700 hover:text-gray-900"
            >
              &times;
            </span>
            <h2 className="text-2xl font-bold mb-2">Add a New Store </h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="mb-2 col-span-1">
                  <label htmlFor="location" className="block text-gray-700 font-bold mb-4">Store Name:</label>
                  <input
                    required
                    id="location"
                    type="text"
                    onChange={(e) => setLocation(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                </div>
            <p className='text font-bold mb-3'>Maximum Denominations in Registers:</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="mb-2 col-span-1">
                  <label htmlFor="hundredRegisterMax" className="block text-gray-700 font-bold mb-2">Hundred:</label>
                  <input
                    required
                    id="hundredRegisterMax"
                    type="number"

                    onChange={(e) => setHundredRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="twentyRegisterMax" className="block text-gray-700 font-bold mb-2">Twenty:</label>
                  <input
                    required
                    id="twentyRegisterMax"
                    type="number"

                    onChange={(e) => setTwentyRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="fiftyRegisterMax" className="block text-gray-700 font-bold mb-2">Fifty:</label>
                  <input
                    required
                    id="fiftyRegisterMax"
                    type="number"
                    onChange={(e) => setFiftyRegisterMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>

                <div className="mb-2 col-span-3">
                    <p className="text font-bold ">Maximum Denominations in Safe:</p>
                </div>
               

                <div className="mb-2 col-span-1">
    
                  <label htmlFor="hundredMax" className="block text-gray-700 font-bold mb-2">Hundred:</label>
                  <input
                    required
                    id="hundredMax"
                    type="number"

                    onChange={(e) => setHundredMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="fiftyMax" className="block text-gray-700 font-bold mb-2">Fifty:</label>
                  <input
                    required
                    id="fiftyMax"
                    type="number"

                    onChange={(e) => setFiftyMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="twentyMax" className="block text-gray-700 font-bold mb-2">Twenty:</label>
                  <input
                    required
                    id="twentyMax"
                    type="number"

                    onChange={(e) => setTwentyMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="tenMax" className="block text-gray-700 font-bold mb-2">Ten:</label>
                  <input
                    required
                    id="tenMax"
                    type="number"

                    onChange={(e) => setTenMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="fiveMax" className="block text-gray-700 font-bold mb-2">Five:</label>
                  <input
                    required
                    id="fiveMax"
                    type="number"
                    onChange={(e) => setFiveMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="twoMax" className="block text-gray-700 font-bold mb-2">Two:</label>
                  <input
                    required
                    id="twoMax"
                    type="number"

                    onChange={(e) => setTwoMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="oneMax" className="block text-gray-700 font-bold mb-2">One:</label>
                  <input
                    required
                    id="oneMax"
                    type="number"

                    onChange={(e) => setOneMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="quarterRollMax" className="block text-gray-700 font-bold mb-2">Quarter Rolls:</label>
                  <input
                    required
                    id="quarterRollMax"
                    type="number"
                  
                    onChange={(e) => setQuarterRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="nickelRollMax" className="block text-gray-700 font-bold mb-2">Nickel Rolls:</label>
                  <input
                    required
                    id="nickelRollMax"

                    type="number"
                   
                    onChange={(e) => setNickelRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="dimeRollMax" className="block text-gray-700 font-bold mb-2">Dime Rolls:</label>
                  <input
                    required
                    id="dimeRollMax"
                    type="number"

                   
                    onChange={(e) => setDimeRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2 col-span-1">
                  <label htmlFor="pennyRollMax" className="block text-gray-700 font-bold mb-2">Penny Rolls:</label>
                  <input
                    required
                    id="pennyRollMax"
                    type="number"
               
                    onChange={(e) => setPennyRollMax(e.target.value)}
                    className="box-border text-center py-1 px-1 w-full border border-gray-300 hover:bg-white bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStoreForm;
