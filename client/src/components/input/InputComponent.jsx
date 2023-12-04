import React from "react";

const InputComponent = ({ label, name, type, onChange, value }) => {
  return (
    <div>
      <div className="font-medium">{label}</div>
      <input
        className=" border mt-1 border-black rounded p-1 px-2"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputComponent;
