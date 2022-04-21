pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakingToken is ERC20 {
    constructor(uint initialSupply) ERC20("Staking", "STK") {
        _mint(msg.sender, initialSupply);
    }
}