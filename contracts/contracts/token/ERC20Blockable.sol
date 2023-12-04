// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "../distribution/DistributionPool.sol";

contract ERC20Blockable {
    mapping(address => bool) private _blacklist;

    function isAddressBlackListed(address ad_) public view returns (bool) {
        return _blacklist[ad_];
    }

    function _toggleBlacklist(address ad_) internal {
        if (_blacklist[ad_]) _blacklist[ad_] = false;
        else _blacklist[ad_] = true;
    }

    function _addressNotBlacklisted() internal view {
        require(!_blacklist[msg.sender], "ERC20Blockable: User BlackListed");
    }
}
