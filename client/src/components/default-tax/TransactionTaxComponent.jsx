import React, { useEffect, useState } from "react";
import InputComponent from "../input/InputComponent";
import { Token } from "../../helpers/token-helper";

const TransactionTax = ({ heading, transactionTax, wallet }) => {
  const [values, setValues] = useState({
    distributionTax: transactionTax.distributionTax,
    burnableTax: transactionTax.burnableTax,
    liquidityTax: transactionTax.liquidityTax,
    fundTax: transactionTax.fundTax,
  });

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (
      Object.values(values).join("") !== Object.values(transactionTax).join("")
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [values, transactionTax]);

  useEffect(() => {
    setValues(transactionTax);
  }, [transactionTax]);

  const handleUpdateTax = async () => {
    const token = new Token();

    if (!wallet) {
      if (values.distributionTax !== transactionTax.distributionTax) {
        await token.setDefaultDistributionTax(values.distributionTax);
      }
      if (values.burnableTax !== transactionTax.burnableTax) {
        await token.setDefaultBurnableTax(values.burnableTax);
      }
      if (values.liquidityTax !== transactionTax.liquidityTax) {
        await token.setDefaultLiquidityTax(values.liquidityTax);
      }
      if (values.fundTax !== transactionTax.fundTax) {
        await token.setDefaultFundTax(values.fundTax);
      }
    } else {
      if (values.distributionTax !== transactionTax.distributionTax) {
        await token.setIndividualDistributionTax(
          wallet,
          values.distributionTax
        );
      }
      if (values.burnableTax !== transactionTax.burnableTax) {
        await token.setIndividualBurnableTax(wallet, values.burnableTax);
      }
      if (values.liquidityTax !== transactionTax.liquidityTax) {
        await token.setIndividualLiquidityTax(wallet, values.liquidityTax);
      }
      if (values.fundTax !== transactionTax.fundTax) {
        await token.setIndividualFundTax(wallet, values.fundTax);
      }
    }
  };

  const onChange = (e) => {
    setValues((oldval) => ({
      ...oldval,
      [e.target.name]: parseInt(e.target.value),
    }));
  };

  return (
    <div className="border border-black rounded-md  px-10 py-3 mx-16 mt-5">
      <div className="text-center font-bold text-xl">{heading}</div>
      <div className="mt-5 flex justify-between">
        <InputComponent
          onChange={onChange}
          name={"distributionTax"}
          type={"number"}
          value={values.distributionTax}
          label={"Tax for Token Holders"}
        />
        <InputComponent
          onChange={onChange}
          name={"burnableTax"}
          type={"number"}
          value={values.burnableTax}
          label={"Burn Rate"}
        />
        <InputComponent
          onChange={onChange}
          name={"liquidityTax"}
          type={"number"}
          value={values.liquidityTax}
          label={"Liquidity Pool"}
        />
        <InputComponent
          onChange={onChange}
          name={"fundTax"}
          type={"number"}
          value={values.fundTax}
          label={"Ecosystem"}
        />
      </div>
      <div className="flex justify-end mt-5">
        <button
          onClick={handleUpdateTax}
          disabled={isDisabled}
          className={` text-white px-5 py-1 font-semibold rounded ${
            isDisabled ? "bg-gray-700" : "bg-blue-600"
          } `}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default TransactionTax;
