# Simple Bank Staking Rewards Hardhat Project

This project demonstrates a basic interest bearing staking contract. In the contract the staking token is the token staked to earn the rewards tokens. The project goes further to demonstrate the tests conducted using dummy accounts charlie and david.

After staking the user will earn reward tokens at the rate of 1 reward token per second, this can be modidied to emit tokens per block.

The reward function also rewards the stakers, based on the percentage of their contribution to the total pot.

This contract is NOT PRODUCTION READY, and requires events and access control features, which have not been included to make this as simple as possible.

To clone, download the repo and run:

```npm i```
Also these functions are can be run from the root of the directory

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
