import { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider.js";
import routes from "../routes.js";
import { Store, Eye, MapPinned, Shirt } from "lucide-react";
import axios from "axios";

export default function HorizotalNav() {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const navigate = useNavigate();
  const auth = useAuth();

  const [storeMenuOn, setStoreMenu] = useState(false);
  const [userAssociatedStores, setUserAssociatedStores] = useState([]);

  const handleSwitchviewClick = (storeID, storeName) => {
    auth.setUserStores(auth.cookie.user.workingStoreID, storeID, storeName);
    //console.log("");
    navigate(routes.home);
  };

  useEffect(() => {
    // Fetch all store objects
    axios
      .get(`${process.env.REACT_APP_REQUEST_URL}ViewStores`, {
        headers: {
          [process.env.REACT_APP_HEADER]: process.env.REACT_APP_API_KEY,
        },
      })
      .then((response) => {
        // Extract user's store IDs from the CSV stored in the cookie
        const userStoreIDs = auth.cookie.user.storeID_CSV;

        // Filter out the user's stores from the fetched store list
        let userStores = response.data.filter((store) =>
          userStoreIDs.includes(store.ID.toString())
        );

        // If there is not a store location in cookies yet, put it there
        if (!auth.cookie.user.viewingStoreLocation) {
          const tempStore = userStores[0];
          auth.setUserStores(tempStore.ID, tempStore.ID, tempStore.location);
        }

        setUserAssociatedStores(userStores); // Set the user's stores in the state
      })
      .catch((error) => {
        console.error("Error fetching stores:", error);
      });
  }, []); // Run this effect only on component mount

  return (
    <Disclosure as="nav" className="bg-gray-500 shadow">
      {({ open }) => (
        <>
          <p className="float-left translate-x-6 translate-y-4 text-2xl text-custom-accent flex items-center">
            <Shirt className="text-custom-accent mx-1.5 w-7 h-7" />
            Plato's Closet - {auth.cookie.user.name} (
            {auth.cookie.user.position})
          </p>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center"></div>
              </div>
              <div
                onClick={() => {
                  setStoreMenu(!storeMenuOn);
                }}
                className="bg-gray-500 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
              >
                {/* Stores dropdown */}
                <Menu as="div" className=" relative ml-3">
                  <div>
                    <Menu.Button
                      tabIndex="-1"
                      className={`relative p-2 rounded-md flex ${
                        storeMenuOn
                          ? "bg-gradient-to-tr from-gray-800 to-gray-600"
                          : "hover:bg-gradient-to-tr from-gray-800 to-gray-600"
                      }`}
                    >
                      <Store className="text-custom-accent mx-3 w-7 h-7" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    show={storeMenuOn}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    style={{ zIndex: 999 }}
                  >
                    <Menu.Items className="min-w-56 absolute right-0 z-10 mt-2  origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {
                        <Menu.Item key={"title"}>
                          {({ active }) => (
                            <a className="block font-medium px-4 py-2 text-sm text-gray-700">
                              {"Storeview"}
                            </a>
                          )}
                        </Menu.Item>
                      }
                      <hr className="mx-3 border-gray-300 " />
                      {/* User stores list */}
                      <div className="max-h-80 overflow-y-auto">
                        {userAssociatedStores.map((store) => (
                          <Menu.Item key={store.ID}>
                            {({ active }) => (
                              <a
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block rounded-md px-4 py-2 text-sm text-gray-700 flex justify-between mx-3 my-1 cursor-pointer"
                                )}
                                onClick={() =>
                                  handleSwitchviewClick(
                                    store.ID,
                                    store.location
                                  )
                                }
                              >
                                <div className="flex flex-row justify-between w-full items-center">
                                  <p className="max-w-48">{store.location}</p>
                                  {store.ID ===
                                    auth.cookie.user.viewingStoreID && (
                                    <Eye className="min-h-6 min-w-6 ml-2 text-gray-500 h-5 w-5" />
                                  )}
                                </div>
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </div>

                      {auth.cookie.user.position === "Owner" && (
                        <hr className="mx-3 border-gray-300 " />
                      )}
                      {/* Store management button */}
                      {auth.cookie.user.position === "Owner" && (
                        <Menu.Item key={"manage"}>
                          {({ active }) => (
                            <a
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block rounded-md px-4 py-2 text-sm text-gray-700 flex m-1 cursor-pointer"
                              )}
                              onClick={() => navigate(routes.storemanagement)}
                            >
                              <MapPinned className="text-gray-500 h-5 w-5 mr-2" />
                              {"Manage Stores"}
                            </a>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
