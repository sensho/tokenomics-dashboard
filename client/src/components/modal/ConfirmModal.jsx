import React from "react";
import Modal from ".";

const Confirm = ({ onClose, onConfirm }) => {
  return (
    <Modal>
      <div>Do you Confirm this action as this is not reversible</div>
      <div className="flex justify-end mt-3">
        <button
          onClick={onConfirm}
          className="mr-5 bg-green-500 rounded text-white font-medium px-5 py-1"
        >
          Confirm
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 rounded text-white font-medium px-5 py-1"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default Confirm;
