// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./ERC20Taxable.sol";
import "../distribution/DistributionPool.sol";
import "../tge/TokenGeneration.sol";
import "./ERC20Blockable.sol";

contract Token is ERC20Taxable, ERC20Blockable {
    address private _owner;
    TokenGeneration public tgeContract;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 defaultBurnableTax_,
        uint256 defaultDistributionTax_,
        uint256 defaultLiquidityTax_,
        uint256 defaultFundTax_,
        uint256 initialSupply_,
        address liquidityPool_,
        address fundPool_
    )
        ERC20Taxable(
            name_,
            symbol_,
            defaultBurnableTax_,
            defaultDistributionTax_,
            defaultLiquidityTax_,
            defaultFundTax_,
            liquidityPool_,
            fundPool_
        )
    {
        _owner = msg.sender;

        tgeContract = new TokenGeneration();

        _mint(address(tgeContract), initialSupply_);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        _addressNotBlacklisted();
        super._beforeTokenTransfer(from, to, amount);
    }

    function transferOwnership(address ad_) public isOwner {
        _owner = ad_;
    }

    function mint(address ad_, uint256 amount) public isOwner {
        _mint(ad_, amount);
    }

    function burn(address ad_, uint256 amount) public isOwner {
        _burn(ad_, amount);
    }

    function blacklist(address ad_) public isOwner {
        _toggleBlacklist(ad_);
    }
}
