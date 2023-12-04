import { ethers_signer } from "./ethers-helper";
import contract_interface from "../abi/token-abi.json";
import config from "../config.json";
import { ethers } from "ethers";

const formatNumber = (val) => {
  return ethers.utils.formatUnits(val, 18);
};

export class Token {
  constructor(address = config.contract_address, abi = contract_interface.abi) {
    this.contract_address = address;
    this.abi = abi;

    this.contract = new ethers.Contract(address, abi, ethers_signer);
  }

  async getTokenName() {
    return await this.contract.name();
  }

  async getTokenSymbol() {
    return await this.contract.symbol();
  }

  async getMyBalance() {
    return formatNumber(
      await this.contract.balanceOf(await ethers_signer.getAddress())
    );
  }

  async getBalance(address) {
    return formatNumber(await this.contract.balanceOf(address));
  }

  async getTotalSupply() {
    return formatNumber(await this.contract.totalSupply());
  }

  async getDefaultBurnableTax() {
    return formatNumber(await this.contract.defaultBurnableTax()) * 100;
  }

  async getDefaultLiquidityTax() {
    return formatNumber(await this.contract.defaultLiquidityTax()) * 100;
  }

  async getDefaultFundTax() {
    return formatNumber(await this.contract.defaultFundTax()) * 100;
  }

  async getDefaultDistributionTax() {
    return formatNumber(await this.contract.defaultDistributionTax()) * 100;
  }

  async getBurnableTax(address) {
    return formatNumber(await this.contract.getBurnableTax(address)) * 100;
  }

  async getLiquidityTax(address) {
    return formatNumber(await this.contract.getLiquidityTax(address)) * 100;
  }

  async getFundTax(address) {
    return formatNumber(await this.contract.getFundTax(address)) * 100;
  }

  async getDistributionTax(address) {
    return formatNumber(await this.contract.getDistributionTax(address)) * 100;
  }

  async getDistributionPoolAddress() {
    return await this.contract.distributionPool();
  }

  async setDefaultBurnableTax(val) {
    const bigVal = ethers.utils.parseUnits((val / 100).toString(), 18);

    const tr = await this.contract.setDefaultBurnableTax(bigVal);

    await tr.wait();

    window.location.reload();
  }

  async setDefaultLiquidityTax(val) {
    const bigVal = ethers.utils.parseUnits((val / 100).toString(), 18);

    const tr = await this.contract.setDefaultLiquidityTax(bigVal);

    await tr.wait();

    window.location.reload();
  }

  async setDefaultFundTax(val) {
    const bigVal = ethers.utils.parseUnits((val / 100).toString(), 18);

    const tr = await this.contract.setDefaultFundTax(bigVal);

    await tr.wait();

    window.location.reload();
  }

  async setDefaultDistributionTax(val) {
    const bigVal = ethers.utils.parseUnits((val / 100).toString(), 18);

    const tr = await this.contract.setDefaultDistributionTax(bigVal);

    await tr.wait();

    window.location.reload();
  }

  async setIndividualBurnableTax(address, val) {
    const bigVal = ethers.utils.parseUnits((val / 100).toString(), 18);

    const tr = await this.contract.setIndividualBurnableTax(address, bigVal);

    await tr.wait();

    window.location.reload();
  }

  async setIndividualLiquidityTax(address, val) {
    const bigVal = ethers.utils.parseUnits((val / 100).toString(), 18);

    const tr = await this.contract.setIndividualLiquidityTax(address, bigVal);

    await tr.wait();

    window.location.reload();
  }

  async setIndividualFundTax(address, val) {
    const bigVal = ethers.utils.parseUnits((val / 100).toString(), 18);

    const tr = await this.contract.setIndividualFundTax(address, bigVal);

    await tr.wait();

    window.location.reload();
  }

  async setIndividualDistributionTax(address, val) {
    const bigVal = ethers.utils.parseUnits((val / 100).toString(), 18);

    const tr = await this.contract.setIndividualDistributionTax(
      address,
      bigVal
    );

    await tr.wait();

    window.location.reload();
  }

  async getIsPaused() {
    return await this.contract.paused();
  }

  async togglePause() {
    const tr = await this.contract.togglePause();

    await tr.wait();

    window.location.reload();
  }

  async mint(address, amount) {
    const bigAmount = ethers.utils.parseUnits(amount, 18);
    const tr = await this.contract.mint(address, bigAmount);

    await tr.wait();

    window.location.reload();
  }

  async isAddressBlackListed(address) {
    return await this.contract.isAddressBlackListed(address);
  }

  async blacklist(address) {
    const tr = await this.contract.blacklist(address);

    await tr.wait();

    window.location.reload();
  }

  async burn(address, amount) {
    const bigAmount = ethers.utils.parseUnits(amount, 18);
    const tr = await this.contract.burn(address, bigAmount);

    await tr.wait();

    window.location.reload();
  }
}
