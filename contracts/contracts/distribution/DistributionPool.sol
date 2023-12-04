// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "../token/ERC20Taxable.sol";

contract DistributionPool {
    address[] private _tokenHolders;
    address private _owner;
    ERC20Taxable private _token;

    constructor(address owner_, ERC20Taxable token_) {
        _owner = owner_;
        _token = token_;
    }

    modifier isOwner() {
        require(
            msg.sender == _owner || msg.sender == address(_token),
            "Not Authorised"
        );
        _;
    }

    function getActiveWalletNumber() public view returns (uint256) {
        return _tokenHolders.length;
    }

    function removeHolder(address element) external isOwner {
        uint256 index;

        for (uint256 i = 0; i < _tokenHolders.length - 1; i++) {
            if (_tokenHolders[i] == element) {
                index = i;
                break;
            }
        }

        for (uint256 i = index; i < _tokenHolders.length - 1; i++) {
            _tokenHolders[i] = _tokenHolders[i + 1];
        }

        _tokenHolders.pop();
    }

    function addHolder(address element) external isOwner {
        _tokenHolders.push(element);
    }

    function distributeTokens() external isOwner {
        uint256 totalAmount = _token.balanceOf(address(this));

        uint256 _length = _tokenHolders.length;

        uint256 amountPerHolder = totalAmount / _length;

        for (uint256 i = 0; i < _length; i += 1) {
            _token.transfer(_tokenHolders[i], amountPerHolder);
        }
    }
}
