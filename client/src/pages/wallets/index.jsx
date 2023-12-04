import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InputComponent from "../../components/input/InputComponent";
import TransactionTax from "../../components/default-tax/TransactionTaxComponent";
import { Token } from "../../helpers/token-helper";

const User = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [balance, setBalance] = useState(0);

  const [burnAmount, setBurnAmount] = useState(0);

  const { id: wallet } = useParams();

  const [transactionTax, setTransactionTax] = useState({
    distributionTax: 4,
    burnableTax: 2,
    liquidityTax: 3,
    fundTax: 1,
  });

  useEffect(() => {
    (async () => {
      const token = new Token();

      const burnableTax = await token.getBurnableTax(wallet);
      const liquidityTax = await token.getLiquidityTax(wallet);
      const fundTax = await token.getFundTax(wallet);
      const distributionTax = await token.getDistributionTax(wallet);

      setTransactionTax({
        burnableTax,
        liquidityTax,
        fundTax,
        distributionTax,
      });

      setBalance(await token.getBalance(wallet));
      setIsBlocked(await token.isAddressBlackListed(wallet));
    })();
  }, [wallet]);

  const handleBlock = async () => {
    await new Token().blacklist(wallet);
  };

  const handleBurn = async () => {
    await new Token().burn(wallet, burnAmount);
  };

  return (
    <div>
      <div className="text-center mt-3 text-xl font-medium">
        Wallet Address : <span className="font-bold">{wallet}</span>
      </div>
      <div className="flex justify-between border border-black rounded-md px-10 py-3 mx-16 mt-5">
        <div className="flex">
          <div>Wallet Balance : </div>
          <div className="ml-1 font-medium">
            {Number(balance).toLocaleString()}
          </div>
        </div>
        <div>
          <div className="flex items-center">
            User Status : <Chip isBlocked={isBlocked} />
          </div>
          <button
            onClick={handleBlock}
            className="text-white px-5 mt-3 py-1 font-semibold rounded bg-blue-600"
          >
            {!isBlocked ? "Block" : "Unblock"}
          </button>
        </div>
        <div>
          <InputComponent
            onChange={(e) => {
              setBurnAmount(e.target.value);
            }}
            value={burnAmount}
            label={"Tokens to Burn"}
          />
          <button
            onClick={handleBurn}
            className="text-white px-5 mt-3 py-1 font-semibold rounded bg-blue-600"
          >
            Burn
          </button>
        </div>
      </div>
      <TransactionTax
        wallet={wallet}
        transactionTax={transactionTax}
        heading={"Transaction Tax for Specific User"}
      />
    </div>
  );
};

const Chip = ({ isBlocked }) => {
  if (!isBlocked) {
    return (
      <div className="ml-2 border flex px-3 items-center border-green-500 rounded w-24">
        <div className="w-3 h-3 rounded-full  bg-green-500"></div>
        <div className="ml-2">Active</div>
      </div>
    );
  }
  return (
    <div className="ml-2 border flex px-3 items-center border-red-500 rounded w-24">
      <div className="w-3 h-3 rounded-full  bg-red-500"></div>
      <div className="ml-2">Blocked</div>
    </div>
  );
};

export default User;
