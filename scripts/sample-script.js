// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  let alice;
  let bob;
  [alice, bob] = await ethers.getSigners();
  const staking = await ethers.getContractFactory("StakingToken", alice);
  stakingToken = await staking.deploy(1000000000);
  await stakingToken.deployed();

  const rewardsT = await ethers.getContractFactory("RewardsToken", bob);
  rewardsToken = await rewardsT.deploy(1000000000);
  await rewardsToken.deployed();

  const bank = await ethers.getContractFactory("SmartBank");
  smartBank = await bank.deploy(stakingToken.address, rewardsToken.address);
  await smartBank.deployed();

  console.log("SmartBank is deployed to:", smartBank.address);
  console.log("Staking Token is deployed to:", stakingToken.address);
  console.log("Reward Token is deployed to:", rewardsToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
