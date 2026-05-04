import React from "react";
import { Navigate } from "react-router-dom";
import { NavLink } from "react-router";

const TopBar = ({ isLoginVisible }) => {
  return (
    <div className="bg-[#FCF5EB] h-15 flex items-center justify-between px-10">
      <NavLink to={"/"} className="text-4xl">Whatsapp</NavLink>
      {isLoginVisible && (
        <div className="flex">
          <NavLink
            to={"/login"}
            className={
              "flex items-center justify-center duration-750 border h-12 w-35 rounded-3xl bg-white hover:bg-black hover:text-white"
            }
          >
            Log in
          </NavLink>
          <NavLink
            to={"/login"}
            className={
              "flex items-center justify-center duration-750 border h-12 w-35 rounded-3xl bg-black text-white hover:bg-white hover:text-black"
            }
          >
            Register
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default TopBar;
