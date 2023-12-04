import React from "react";
import { Route, Routes } from "react-router-dom";
import NavbarComponent from "../components/navbar/NavbarComponent";
import HomeComponent from "./home";
import WalletComponent from "./wallets";

const Layout = (Element) => {
  return (
    <>
      <NavbarComponent />
      <div className="p-3">
        <Element />
      </div>
    </>
  );
};

const MainComponent = () => {
  return (
    <Routes>
      <Route path="/" element={Layout(HomeComponent)} />
      <Route path="/wallets/:id" element={Layout(WalletComponent)} />
    </Routes>
  );
};

export default MainComponent;
