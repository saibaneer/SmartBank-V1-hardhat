pragma solidity ^0.8.4 ;

import "./RewardsToken.sol";
import "./StakingToken.sol";


contract SmartBank {
    RewardsToken rewardsToken;
    StakingToken stakingToken;

    uint public rewardRate = 1;
    uint public lastUpdateTime;
    uint public rewardPerTokenStored;

    uint public totalSupply;

    mapping(address => uint) public balances;
    mapping(address => uint) public rewards;
    mapping(address => uint) public userRewardPerTokenPaid;

    

    constructor(address _stakingToken, address _rewardsToken) {
        stakingToken = StakingToken(_stakingToken);
        rewardsToken = RewardsToken(_rewardsToken);
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
        _;
    }

    function rewardPerToken() public view returns (uint) {
        if(totalSupply == 0){
            return 0;
        }
        return rewardPerTokenStored + (
            rewardRate * (block.timestamp - lastUpdateTime) * 1e18 / totalSupply
        );
    }

    function earned(address account) public view returns (uint) {
        return (balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account]) / 1e18
        ) + rewards[account];
    }

    function stake(uint _amount) external updateReward(msg.sender) {
        totalSupply += _amount;
        balances[msg.sender] += _amount;
        stakingToken.approve(address(this), _amount);
        stakingToken.transferFrom(msg.sender, address(this), _amount);
    }

    
    function getReward() public updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        //rewardsToken.approve(msg.sender, reward);
        rewardsToken.transfer(msg.sender, reward);
    }

    function withdraw(uint _amount) external updateReward(msg.sender) {
        totalSupply -= _amount;
        balances[msg.sender] -= _amount;
        stakingToken.transfer(msg.sender, _amount);
        
    }

}