import { ethers_signer } from "./ethers-helper";
import contract_interface from "../abi/distribution-pool-abi.json";
import { ethers } from "ethers";

const formatNumber = (val) => {
  return ethers.utils.formatUnits(val, 18);
};

export class DistributionPool {
  constructor(address, abi = contract_interface.abi) {
    this.contract_address = address;
    this.abi = abi;

    this.contract = new ethers.Contract(address, abi, ethers_signer);
  }

  async distribute() {
    const tr = await this.contract.distributeTokens();
    await tr.wait();
  }
}
