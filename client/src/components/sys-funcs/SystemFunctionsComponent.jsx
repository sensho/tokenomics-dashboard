import React, { useEffect, useState } from "react";
import Confirm from "../modal/ConfirmModal";
import InputComponent from "../input/InputComponent";
import { Token } from "../../helpers/token-helper";
import { DistributionPool } from "../../helpers/distribution-pool-helper";

const CONSTANTS = {
  sytem_toggle: "SYSTEM_TOGGLE",
  distribute_tokens: "DISTRIBUTE_TOKENS",
};

const SystemFunctionsComponent = () => {
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [distributionPoolAddress, setDistributionPoolAddress] = useState();
  const [distributionPoolBalance, setDistributionPoolBalance] = useState();
  const [confirmModal, setconfirmModal] = useState({
    display: false,
    event: "",
  });

  useEffect(() => {
    (async () => {
      setIsPaused(await new Token().getIsPaused());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const token = new Token();
      const poolAddress = await token.getDistributionPoolAddress();

      setDistributionPoolAddress(poolAddress);
      setDistributionPoolBalance(await token.getBalance(poolAddress));
    })();
  }, []);

  const confirmModalSelection = (event) => {
    if (event === CONSTANTS.sytem_toggle) {
      console.log("System toggle");
    }
    if (event === CONSTANTS.distribute_tokens) {
      console.log("Distribute tokens");
    }
    toggleConfirmationModal();
  };

  const toggleConfirmationModal = (event = "") => {
    const temp = { ...confirmModal };
    temp.display = !confirmModal.display;
    temp.event = event;
    setconfirmModal(temp);
  };

  const handleTogglePause = async () => {
    await new Token().togglePause();
    window.location.reload();
  };

  const handleDistribute = async () => {
    const distributionPool = new DistributionPool(distributionPoolAddress);

    await distributionPool.distribute();

    window.location.reload();
  };

  const handleMint = async () => {
    await new Token().mint(mintAddress, mintAmount);

    window.location.reload();
  };

  return (
    <div className="border border-black rounded-md px-10 py-3 mx-16 mt-5">
      <div className="text-center font-bold text-xl">System Functions</div>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center">
            <span className="font-medium">System</span> :{" "}
            <Chip isPaused={isPaused} />
          </div>
          <button
            onClick={handleTogglePause}
            className=" text-white px-5 mt-3 py-1 font-semibold rounded bg-blue-600"
          >
            {isPaused ? "Unpause" : "Pause"}
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-row ">
            <InputComponent
              onChange={(e) => setMintAmount(e.target.value)}
              type={"number"}
              value={mintAmount}
              label={"Number of Tokens to Mint"}
            />
            <InputComponent
              onChange={(e) => setMintAddress(e.target.value)}
              value={mintAddress}
              label={"Target Address"}
            />
          </div>
          <button
            onClick={handleMint}
            className="text-white px-5 mt-3 py-1 font-semibold rounded bg-blue-600"
          >
            Mint Tokens
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div>Distribution Pool Balance : {distributionPoolBalance}</div>
          <button
            onClick={handleDistribute}
            className="text-white px-5 mt-3 py-1 font-semibold rounded bg-blue-600"
          >
            Distribute
          </button>
        </div>
      </div>
      {confirmModal.display && (
        <Confirm
          onConfirm={confirmModalSelection}
          onClose={toggleConfirmationModal}
          event={confirmModal.event}
        />
      )}
    </div>
  );
};

const Chip = ({ isPaused }) => {
  if (!isPaused)
    return (
      <div className="ml-2 border flex px-3 items-center border-green-500 rounded w-24">
        <div className="w-3 h-3 rounded-full  bg-green-500"></div>
        <div className="ml-2">Active</div>
      </div>
    );

  return (
    <div className="ml-2 border flex px-3 items-center border-red-500 rounded w-24">
      <div className="w-3 h-3 rounded-full  bg-red-500"></div>
      <div className="ml-2">Paused</div>
    </div>
  );
};

export default SystemFunctionsComponent;
