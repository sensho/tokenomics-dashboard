import React from "react";
import Metamask from "../../assets/Metamask.svg";
import Modal from ".";

function MetamaskModal({ message, connect }) {
  return (
    <Modal>
      <button onClick={connect} className="flex bg-gray-600 items-center p-3 ">
        <img src={Metamask} className="w-12" alt="Metamask" />
        <span className="text-white ml-3">{message}</span>
      </button>
    </Modal>
  );
}

export default MetamaskModal;
