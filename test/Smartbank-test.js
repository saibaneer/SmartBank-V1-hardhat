const { expect } = require("chai");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("SmartBank Contract", function () {
  let stakingToken;
  let rewardsToken;
  let smartBank;
  let alice;
  let bob;
  let charlie;
  let david;
  let charlie_rewardBalance_old;
  let charlie_rewardBalance_new;
  let charlie_stakingBalance_before_withdrawal;
  let charlie_stakingBalance_after_withdrawal;

  before(async function(){
    [alice, bob, charlie, david] = await ethers.getSigners();
    const staking = await ethers.getContractFactory('StakingToken', alice);
    stakingToken = await staking.deploy(1000000000);
    await stakingToken.deployed()

    const rewardsT = await ethers.getContractFactory("RewardsToken", bob);
    rewardsToken = await rewardsT.deploy(1000000000);
    await rewardsToken.deployed();

    const bank = await ethers.getContractFactory("SmartBank");
    smartBank = await bank.deploy(stakingToken.address, rewardsToken.address);
    await smartBank.deployed();
  })
  it("Should confirm that Staking and Rewards Token balances are as given", async function () {
    expect(await stakingToken.balanceOf(alice.address)).to.equal(1000000000);
    expect(await rewardsToken.balanceOf(bob.address)).to.equal(1000000000);
  });
  describe("Testing core contract functions", ()=>{
    before(async function(){
      await stakingToken.connect(alice).transfer(charlie.address, 1000);
      await stakingToken.connect(alice).transfer(david.address, 1000);
      await rewardsToken.connect(bob).transfer(smartBank.address, 500000)
    })
    it("Should confirm that Charlie and David received 1000 staking tokens", async function(){
      //console.log(charlie.address);
      //0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
      expect(await stakingToken.balanceOf(charlie.address)).to.equal(1000);
      expect(await stakingToken.balanceOf(david.address)).to.equal(1000);
    })
    it("Should confirm that SmartBank has received the rewards tokens", async function(){
      expect(await rewardsToken.balanceOf(smartBank.address)).to.equal(500000);
    })
    it("Should confirm that deposit has been made into the contract", async function(){
      //await stakingToken.connect(alice).approve(charlie.address, 500)
      await stakingToken.connect(charlie).approve(smartBank.address, 100);
      await smartBank.connect(charlie).stake(100);
      charlie_rewardBalance_old = await smartBank.connect(charlie).rewards(charlie.address);
      expect(await smartBank.balances(charlie.address)).to.equal(100);
      expect(await rewardsToken.balanceOf(charlie.address)).to.equal(0);
    })
    describe("Testing interest based functions after 1 day", function(){
      before(async function(){
        await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 1]);
        await ethers.provider.send("evm_mine");
      })
      it("Should test that the new reward balance is greater than the old balance", async function(){
       // await rewardsToken.approve(charlie.address)
       await stakingToken.connect(charlie).approve(smartBank.address, 1);
        await smartBank.connect(charlie).stake(1);
        charlie_rewardBalance_new = await smartBank
          .connect(charlie)
          .rewards(charlie.address);
          //console.log(charlie_rewardBalance_new.toString())
          assert(
            charlie_rewardBalance_new.toString() >
              charlie_rewardBalance_old.toString()
          );
      })
      it("Should allow withdrawal of staked tokens", async function(){
        charlie_stakingBalance_before_withdrawal = await stakingToken.balanceOf(charlie.address)
        //console.log(charlie_stakingBalance_before_withdrawal.toString())
        await smartBank.connect(charlie).withdraw(51)
        charlie_stakingBalance_after_withdrawal = await stakingToken.balanceOf(
          charlie.address
        );
        //console.log(charlie_stakingBalance_after_withdrawal.toString());
        const diff = charlie_stakingBalance_after_withdrawal - charlie_stakingBalance_before_withdrawal;
        assert.equal(diff.toString(), 51);
      });
      it("Should allow for the withdrawal of reward tokens", async function(){
        await smartBank.connect(charlie).getReward();
        charlie_rewardBalance_new = await rewardsToken.connect(charlie).balanceOf(charlie.address);
        assert(
          charlie_rewardBalance_new.toString() >
            charlie_rewardBalance_old.toString()
        );
        
      })
    })
  })
});
