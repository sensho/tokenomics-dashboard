// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "../distribution/DistributionPool.sol";

contract ERC20Taxable is ERC20Pausable {
    address private _owner;

    DistributionPool public distributionPool;
    address public liquidityPool;
    address public fundPool;

    mapping(address => uint256) public individualBurnableTax;
    mapping(address => bool) private isIndividualBurnableSet;
    uint256 public defaultBurnableTax;
    mapping(address => uint256) public individualDistributionTax;
    mapping(address => bool) private isIndividualDistributionSet;
    uint256 public defaultDistributionTax;
    mapping(address => uint256) public individualLiquidityTax;
    mapping(address => bool) private isIndividualLiquiditySet;
    uint256 public defaultLiquidityTax;
    mapping(address => uint256) public individualFundTax;
    mapping(address => bool) private isIndividualFundSet;
    uint256 public defaultFundTax;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 defaultBurnableTax_,
        uint256 defaultDistributionTax_,
        uint256 defaultLiquidityTax_,
        uint256 defaultFundTax_,
        address liquidityPool_,
        address fundPool_
    ) ERC20(name_, symbol_) {
        _owner = msg.sender;
        distributionPool = new DistributionPool(msg.sender, this);

        defaultBurnableTax = defaultBurnableTax_;
        defaultDistributionTax = defaultDistributionTax_;
        defaultLiquidityTax = defaultLiquidityTax_;
        defaultFundTax = defaultFundTax_;
        liquidityPool = liquidityPool_;
        fundPool = fundPool_;
    }

    modifier isOwner() {
        require(msg.sender == _owner, "Not Authorised!");
        _;
    }

    function getBurnableTax(address ad_) public view returns (uint256) {
        return _getBurnableTax(ad_);
    }

    function _getBurnableTax(address ad_) internal view returns (uint256) {
        if (isIndividualBurnableSet[ad_]) return individualBurnableTax[ad_];
        else return defaultBurnableTax;
    }

    function getDistributionTax(address ad_) public view returns (uint256) {
        return _getDistributionTax(ad_);
    }

    function _getDistributionTax(address ad_) internal view returns (uint256) {
        if (isIndividualDistributionSet[ad_])
            return individualDistributionTax[ad_];
        else return defaultDistributionTax;
    }

    function getLiquidityTax(address ad_) public view returns (uint256) {
        return _getLiquidityTax(ad_);
    }

    function _getLiquidityTax(address ad_) internal view returns (uint256) {
        if (isIndividualLiquiditySet[ad_]) return individualLiquidityTax[ad_];
        else return defaultLiquidityTax;
    }

    function getFundTax(address ad_) public view returns (uint256) {
        return _getFundTax(ad_);
    }

    function _getFundTax(address ad_) internal view returns (uint256) {
        if (isIndividualFundSet[ad_]) return individualFundTax[ad_];
        else return defaultFundTax;
    }

    function _handleTransferFee(
        address from,
        address to,
        uint256 amount
    ) internal returns (bool) {
        if (from == address(distributionPool)) {
            _transfer(from, to, amount);
            return true;
        }

        uint256 distributionTax = _getDistributionTax(from);

        uint256 burnableTax = _getBurnableTax(from);

        uint256 liquidityTax = _getLiquidityTax(from);

        uint256 fundTax = _getFundTax(from);

        uint256 distributionAmount = (amount * distributionTax) / (10**18);

        uint256 burnableAmount = (amount * burnableTax) / (10**18);

        uint256 liquidityAmount = (amount * liquidityTax) / (10**18);

        uint256 fundAmount = (amount * fundTax) / (10**18);

        _transfer(from, address(distributionPool), distributionAmount);

        _transfer(from, address(liquidityPool), liquidityAmount);

        _transfer(from, address(fundPool), fundAmount);

        _burn(from, burnableAmount);

        uint256 finalAmount = amount -
            distributionAmount -
            burnableAmount -
            liquidityAmount -
            fundAmount;

        _transfer(from, to, finalAmount);

        return true;
    }

    function transfer(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        return _handleTransferFee(msg.sender, to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        return _handleTransferFee(from, to, amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (
            balanceOf(from) == 0 &&
            from != address(distributionPool) &&
            from != address(0)
        ) {
            distributionPool.removeHolder(from);
        }

        if (
            balanceOf(to) == amount &&
            to != address(distributionPool) &&
            to != address(0)
        ) {
            distributionPool.addHolder(to);
        }

        super._afterTokenTransfer(from, to, amount);
    }

    function setDefaultBurnableTax(uint256 defaultBurnableTax_)
        external
        isOwner
    {
        defaultBurnableTax = defaultBurnableTax_;
    }

    function setDefaultDistributionTax(uint256 defaultDistributionTax_)
        external
        isOwner
    {
        defaultDistributionTax = defaultDistributionTax_;
    }

    function setDefaultLiquidityTax(uint256 defaultLiquidityTax_)
        external
        isOwner
    {
        defaultLiquidityTax = defaultLiquidityTax_;
    }

    function setDefaultFundTax(uint256 defaultFundTax_) external isOwner {
        defaultFundTax = defaultFundTax_;
    }

    function setIndividualBurnableTax(
        address ad_,
        uint256 individualBurnableTax_
    ) external isOwner {
        isIndividualBurnableSet[ad_] = true;
        individualBurnableTax[ad_] = individualBurnableTax_;
    }

    function setIndividualDistributionTax(
        address ad_,
        uint256 individualDistributionTax_
    ) external isOwner {
        isIndividualDistributionSet[ad_] = true;
        individualDistributionTax[ad_] = individualDistributionTax_;
    }

    function setIndividualLiquidityTax(
        address ad_,
        uint256 individualLiquidityTax_
    ) external isOwner {
        isIndividualLiquiditySet[ad_] = true;
        individualLiquidityTax[ad_] = individualLiquidityTax_;
    }

    function setIndividualFundTax(address ad_, uint256 individualFundTax_)
        external
        isOwner
    {
        isIndividualFundSet[ad_] = true;
        individualFundTax[ad_] = individualFundTax_;
    }

    function togglePause() public isOwner {
        if (paused()) {
            _unpause();
        } else {
            _pause();
        }
    }

    // function isBlocked() {}

    // function blacklist(address ad_) {}
}
