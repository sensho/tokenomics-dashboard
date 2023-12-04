// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers } = hre;

const name = "STFU";
const symbol = "STFU";

const defaultBurnableTax = ethers.utils.parseUnits("2", 16);
const defaultDistributionTax = ethers.utils.parseUnits("4", 16);
const defaultLiquidityTax = ethers.utils.parseUnits("3", 16);
const defaultFundTax = ethers.utils.parseUnits("1", 16);

const initialSupply = ethers.utils.parseUnits("36000000000", 18);

const tokenParameters = [
  name,
  symbol,
  defaultBurnableTax,
  defaultDistributionTax,
  defaultLiquidityTax,
  defaultFundTax,
  initialSupply,
  "0x141c6F06243De0EFd9C8E4B629526EAE06AA8432",
  "0x02091aCF7d3BBF924B7B5526964AEf7cBDC27876",
];

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(...tokenParameters);

  await token.deployed();

  console.log("Token deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
