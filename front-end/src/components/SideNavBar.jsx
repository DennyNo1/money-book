import React, { useState } from "react";

const SideNavBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleClick = () => {
    setShowMenu(!showMenu);
  };
  return (
    <div>
      <div
        onClick={handleClick}
        className="bg-gray-100 p-2 rounded inline-flex hover:bg-gray-200 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95 cursor-pointer m-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>
      <div>
        {showMenu ? (
          <div className="fixed left-0  h-full w-60 bg-gray-900 text-white shadow-lg flex flex-col rounded ">
            <div className="text-xl font-bold p-4 border-b border-gray-700">
              Menu
            </div>
            <ul className="flex-grow p-4 space-y-4">
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
                Home
              </li>
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
                MoneyBook
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default SideNavBar;
