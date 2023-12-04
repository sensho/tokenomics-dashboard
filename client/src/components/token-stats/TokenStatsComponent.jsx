import React, { useState, useEffect } from "react";
import { NumberConverter } from "../../helpers/number-helper";
import { Token } from "../../helpers/token-helper";

const TokenStatsComponent = () => {
  const [totalSupply, setTotalSupply] = useState("");

  useEffect(() => {
    (async () => {
      setTotalSupply(await new Token().getTotalSupply());
    })();
  }, []);

  return (
    <div className="border border-black rounded-md px-10 py-3 mx-16 mt-5">
      <div className="mb-3 font-bold text-xl text-center">Token Statistics</div>
      <div className="flex justify-between mt-5">
        <div>
          <div className="text-lg font-medium">Total Tokens</div>
          <div className="my-2">
            {Number(totalSupply).toLocaleString()} Tokens
          </div>
          <div>({NumberConverter(totalSupply)})</div>
        </div>
        <div>
          <div className="text-lg font-medium">Tokens Distributed</div>
          <div className="my-2">
            {Number(16000000000).toLocaleString()} Tokens
          </div>
          <div>({NumberConverter(16000000000)})</div>
        </div>
        <div>
          <div className="text-lg font-medium">Tokens Remaining</div>
          <div className="my-2">
            {Number(15000000000).toLocaleString()} Tokens
          </div>
          <div>({NumberConverter(15000000000)})</div>
        </div>
      </div>
    </div>
  );
};

export default TokenStatsComponent;
