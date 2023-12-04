import React, { useState, useEffect } from "react";
import SystemFunctionsComponent from "../../components/sys-funcs/SystemFunctionsComponent";

import TokenStatsComponent from "../../components/token-stats/TokenStatsComponent";
import TransactionTax from "../../components/default-tax/TransactionTaxComponent";
import { Token } from "../../helpers/token-helper";

const HomeComponent = () => {
  const [transactionTax, setTransactionTax] = useState({
    distributionTax: 4,
    burnableTax: 2,
    liquidityTax: 3,
    fundTax: 1,
  });

  useEffect(() => {
    (async () => {
      const token = new Token();

      const burnableTax = await token.getDefaultBurnableTax();
      const liquidityTax = await token.getDefaultLiquidityTax();
      const fundTax = await token.getDefaultFundTax();
      const distributionTax = await token.getDefaultDistributionTax();

      setTransactionTax({
        burnableTax,
        liquidityTax,
        fundTax,
        distributionTax,
      });
    })();
  }, []);

  return (
    <div className="">
      <TokenStatsComponent />
      <TransactionTax
        transactionTax={transactionTax}
        heading={"Default Transaction Tax Rate"}
      />
      <SystemFunctionsComponent />
    </div>
  );
};

export default HomeComponent;
