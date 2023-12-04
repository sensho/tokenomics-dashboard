import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Metamask.svg";
import InputComponent from "../input/InputComponent";

const NavbarComponent = () => {
  const [wallet, setWallet] = useState("");
  const navigate = useNavigate();

  const onSearch = () => {
    navigate(`/wallets/${wallet}`);
  };

  return (
    <div className="shadow-lg py-3 flex items-center justify-around">
      <div>
        <Link to="/" className="flex  items-center">
          <img className="w-10" src={Logo} alt="Logo" />
          <div className="ml-3 text-xl font-bold">Metamask</div>
        </Link>
      </div>
      <div className="flex items-center">
        <InputComponent
          label={"Search Wallet"}
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
        <button
          onClick={onSearch}
          className="ml-3 text-white px-5 mt-7 py-1 font-semibold rounded bg-blue-600"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default NavbarComponent;
