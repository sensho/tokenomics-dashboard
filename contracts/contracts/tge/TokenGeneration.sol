// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract TokenGeneration {
    mapping(address => bool) private _whitelist;

    constructor() {
        _whitelist[msg.sender] = true;
    }
}
