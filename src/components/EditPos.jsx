import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/mira/theme.css";
import "primeicons/primeicons.css";

function EditPOS(pos) {
    //console.log(pos.pos.alias);

    const [isOpen, setIsOpen] = useState(false);
    const [nickname, setNickname] = useState("");

     //this method handles editing user details
  const handleSubmit = (event) => {
    event.preventDefault();

    //create an axios POST request to create a new user with inputs from the form
    axios.post(
      `${process.env.REACT_APP_REQUEST_URL}UpdateRegisterAlias`,
      {
        "ID": pos.pos.ID,
        "alias": nickname
      },
      {
        headers: {
          [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY
        }
      }
    )
      .then((response) => {
        setIsOpen(false);
        window.location.reload(); // This will refresh the page


      })
      //error if the API request failed
      .catch((error) => {

      });
  };

    //this handles the closing of the modal when a user doesnt submit to clear the text boxes and data
    const closeModal = () => {
        setIsOpen(false);
        setNickname('');
    
      };
          //this handles the closing of the modal when a user doesnt submit to clear the text boxes and data
    const openModal = () => {
        setIsOpen(true);
        setNickname(pos.pos.alias);
    
      };



      return (
            <div className="relative ">
              <Button
                onClick={openModal}
                label={`Edit POS Register: ${pos.pos.name}`}
                className="p-button-primary p-button-raised"
                size="small"
                rounded
                style={{ marginRight: '1rem' }}
              />
              {isOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
        
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                  </span>
        
                  <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                  >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-left sm:mt-0 sm:ml-4 sm:text-left w-full">
                          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                            Edit POS Nickname
                          </h3>
                          <div className="mt-3">
                            <input
                              type="text"
                              value={nickname}
                              onChange={(e) => setNickname(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 text-bold px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <Button
                        onClick={handleSubmit}
                        label="Confirm POS Nickname"
                        className="p-button-primary p-button-raised"
                        size="small"
                        rounded
                        icon="pi pi-check"
                      />
                      <Button
                        onClick={closeModal}
                        label="Cancel"
                        className="p-button-secondary p-button-raised"
                        size="small"
                        rounded
                        icon="pi pi-times"
                        style={{ marginRight: '1rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        };

export default EditPOS;