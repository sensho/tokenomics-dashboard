const { expect } = require("chai");
const { ethers } = require("hardhat");

const name = "TEST";
const symbol = "TST";

const defaultBurnableTax = ethers.utils.parseUnits("2", 16);
const defaultDistributionTax = ethers.utils.parseUnits("4", 16);
const defaultLiquidityTax = ethers.utils.parseUnits("3", 16);
const defaultFundTax = ethers.utils.parseUnits("1", 16);

const totalTax = defaultBurnableTax
  .add(defaultDistributionTax)
  .add(defaultLiquidityTax)
  .add(defaultFundTax);

const initialSupply = ethers.utils.parseUnits("36000000000", 18);

const tokenParameters = [
  name,
  symbol,
  defaultBurnableTax,
  defaultDistributionTax,
  defaultLiquidityTax,
  defaultFundTax,
  initialSupply,
];

describe("Token Deploy and Owner Functions", function () {
  let token, accounts;

  beforeEach(async () => {
    accounts = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(
      ...[...tokenParameters, accounts[2].address, accounts[3].address]
    );

    await token.deployed();
  });

  it("Initial Parameters are set correctly", async function () {
    expect(await token.name()).to.equal(name);
    expect(await token.symbol()).to.equal(symbol);
    expect(await token.totalSupply()).to.equal(initialSupply);
  });

  it("Token minting works", async function () {
    const mintAmount = ethers.utils.parseUnits("1000000", 18);

    const mintTr = await token.mint(accounts[0].address, mintAmount);

    await mintTr.wait();

    expect(await token.balanceOf(accounts[0].address)).to.equal(mintAmount);

    expect(await token.totalSupply()).to.equal(mintAmount.add(initialSupply));
  });

  it("Token burn works", async function () {
    const mintAmount = ethers.utils.parseUnits("1000000", 18);

    const mintTr = await token.mint(accounts[0].address, mintAmount);

    await mintTr.wait();

    const burnAmount = ethers.utils.parseUnits("500000", 18);

    const burnTr = await token.burn(accounts[0].address, burnAmount);

    await burnTr;

    expect(await token.balanceOf(accounts[0].address)).to.equal(
      mintAmount.sub(burnAmount)
    );

    expect(await token.totalSupply()).to.equal(
      mintAmount.add(initialSupply).sub(burnAmount)
    );
  });

  it("Pause sets the value correctly", async () => {
    expect(await token.paused()).to.equal(false);

    const tr = await token.togglePause();

    await tr.wait();

    expect(await token.paused()).to.equal(true);
  });

  it("User is blacklisted", async () => {
    expect(await token.isAddressBlackListed(accounts[1].address)).to.equal(
      false
    );

    const blacklistTr = await token.blacklist(accounts[1].address);

    await blacklistTr.wait();

    expect(await token.isAddressBlackListed(accounts[1].address)).to.equal(
      true
    );
  });

  it("Individual Burnable Tax is set", async () => {
    expect(await token.getBurnableTax(accounts[1].address)).to.equal(
      defaultBurnableTax
    );

    const changeTaxTr = await token.setIndividualBurnableTax(
      accounts[1].address,
      0
    );

    await changeTaxTr.wait();

    expect(await token.getBurnableTax(accounts[1].address)).to.equal(0);
  });

  it("Individual Distribution Tax is set", async () => {
    expect(await token.getDistributionTax(accounts[1].address)).to.equal(
      defaultDistributionTax
    );

    const changeTaxTr = await token.setIndividualDistributionTax(
      accounts[1].address,
      0
    );

    await changeTaxTr.wait();

    expect(await token.getDistributionTax(accounts[1].address)).to.equal(0);
  });

  it("Individual Liquidity Tax is set", async () => {
    expect(await token.getLiquidityTax(accounts[1].address)).to.equal(
      defaultLiquidityTax
    );

    const changeTaxTr = await token.setIndividualLiquidityTax(
      accounts[1].address,
      0
    );

    await changeTaxTr.wait();

    expect(await token.getLiquidityTax(accounts[1].address)).to.equal(0);
  });

  it("Individual Fund Tax is set", async () => {
    expect(await token.getFundTax(accounts[1].address)).to.equal(
      defaultFundTax
    );

    const changeTaxTr = await token.setIndividualFundTax(
      accounts[1].address,
      0
    );

    await changeTaxTr.wait();

    expect(await token.getFundTax(accounts[1].address)).to.equal(0);
  });

  // Owner Authorisation

  // Individual Transaction Tax
});

describe("Token Transactions", () => {
  let token, accounts;
  const mintAmount = ethers.utils.parseUnits("1000000", 18);

  beforeEach(async () => {
    accounts = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(
      ...[...tokenParameters, accounts[2].address, accounts[3].address]
    );

    await token.deployed();

    const mintTr = await token.mint(accounts[0].address, mintAmount);

    await mintTr.wait();
  });

  it("Transfer Fee is distributed correctly", async function () {
    const transferAmount = ethers.utils.parseUnits("500000", 18);

    const totalTaxAmount = transferAmount
      .mul(totalTax)
      .div(ethers.utils.parseUnits("1", 18));

    const burnableTaxAmount = transferAmount
      .mul(defaultBurnableTax)
      .div(ethers.utils.parseUnits("1", 18));

    const transfer = await token.transfer(accounts[1].address, transferAmount);

    await transfer.wait();

    expect(await token.balanceOf(accounts[0].address)).to.equal(
      mintAmount.sub(transferAmount)
    );

    expect(await token.balanceOf(accounts[1].address)).to.equal(
      transferAmount.sub(totalTaxAmount)
    );

    expect(await token.totalSupply()).to.equal(
      initialSupply.add(mintAmount).sub(burnableTaxAmount)
    );
  });

  it("Transactions are paused correctly", async () => {
    const tr = await token.togglePause();

    await tr.wait();

    try {
      const transfer = await token.transfer(
        accounts[1].address,
        ethers.utils.parseUnits("500000", 18)
      );

      await transfer.wait();

      throw Error("Transaction went through successfully");
    } catch (err) {
      expect(err.message).to.equal(
        "VM Exception while processing transaction: reverted with reason string 'ERC20Pausable: token transfer while paused'"
      );
    }
  });

  it("Transactions are blocked when user is blacklisted", async () => {
    const tr = await token.blacklist(accounts[0].address);

    await tr.wait();

    try {
      const transfer = await token.transfer(
        accounts[1].address,
        ethers.utils.parseUnits("500000", 18)
      );

      await transfer.wait();

      throw Error("Transaction went through successfully");
    } catch (err) {
      expect(err.message).to.equal(
        "VM Exception while processing transaction: reverted with reason string 'ERC20Blockable: User BlackListed'"
      );
    }
  });
});
