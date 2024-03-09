import React, { useState } from 'react';

const EditUser = (user) => {

    console.log(user.user.name);

    const curStore = localStorage.getItem('curStore');
    //console.log(curStore +'in form');
    // Retrieve the serialized string from local storage
    const storedArrayString = localStorage.getItem('stores');
  
    // Parse the string back into an array
    const storeArray = JSON.parse(storedArrayString);

    // const userId = user.user.ID;
    // const userName = user.user.name;
    // const userPassword = user.user.password;
    // const userPosition = user.user.position;
    // const userStoreName = user.user.storeName;
    // const userUsername = user.user.username;
    

  const [isOpen, setIsOpen] = useState(false);






  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform form submission logic here
    console.log('Form submitted');
    closeModal();
  };

  const toggleAbility = () =>{

  }

  return (
    <div className="relative ">
      <button
        onClick={openModal}
       className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 ml-5 rounded focus:outline-none focus:shadow-outline"

      >
        Edit User: {user.user.name}
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md w-auto">
            <span onClick={closeModal} className="absolute top-0 right-0 cursor-pointer text-gray-700 hover:text-gray-900">&times;</span>
            <h2 className="text-2xl font-bold mb-4">Edit User Information</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <div className="grid grid-cols-3 gap-4">
    <div className="mb-4">
      <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First Name:</label>
      <input
      required
        id="firstName"
        type="text"
        value={user.user.name}
      //  onChange={(e) => setFirstName(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Last Name:</label>
      <input
      required
        id="lastName"
        type="text"
        value={user.user.name}
      //  onChange={(e) => setLastName(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
      <input
      required
        id="username"
        type="text"
        value={user.user.username}

      //  onChange={(e) => setUsername(e.target.value)}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  </div>

  <div className="grid grid-cols-3 gap-4">
    <div className="mb-4">
      <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
      <div>
      <input
      required
        type="password"
        value={user.user.password}
      
        //onChange={handleChange}
        className="box-border text-center py-1 px-1 w-full border border-border-color border-2 hover:bg-nav-bg bg-white rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
    </div>
    <div className="mb-4">
                    <legend className="block text-gray-700 font-bold mb-2">Role:</legend>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="employee"
                        name="role"
                        value="Employee"
                        defaultChecked
                      //  checked={position === "Employee"} // Assuming position is the state variable for the selected role
                       // onChange={(e) => setPosition(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor="employee" className="mr-4">Employee</label>
                      <input
                        type="radio"
                        id="manager"
                        name="role"
                        value="Manager"
                       // checked={position === "Manager"} // Assuming position is the state variable for the selected role
                      //  onChange={(e) => setPosition(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor="manager">Manager</label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <legend className="block text-gray-700 font-bold mb-2">Store:</legend>
                    {storeArray.map(item => (
                      <div key={item.ID} className="mb-2">
                        <input
                          type="checkbox"
                          id={`store${item.ID}`}
                          name="store"
                          value={item.ID}
                          //checked={item.ID ===curStore}
                         // onChange={(e) => handleCheckboxChange(e, item.ID)}
                          className="mr-2"
                        />
                        <label htmlFor={`store${item.ID}`}>{item.location}</label>
                      </div>
                    ))}
    </div>
  </div>
  <div className="flex justify-between">
    <button
      type="button"
      onClick={closeModal}
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Cancel
      
    </button>


    <button
      type="submit"
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Save
    
    </button>

    <button
      type="submit"
      className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Disable User
    
    </button>

  </div>
  
</form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;