// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrowdfundingWithTrust {
    address public owner;
    address public startup;
    uint public goal;
    bool public isProjectStarted;

    mapping(address => uint) public contributions;

    event Contributed(address indexed contributor, uint amount);
    event ProjectStarted();
    event FundsReleased(uint amount);

    constructor(address _startup, uint _goal) {
        require(_startup != address(0), "Startup address cannot be zero");
        require(_goal > 0, "Goal must be greater than 0");

        owner = msg.sender;
        startup = _startup;
        goal = _goal;
        isProjectStarted = false;
    }

    function contribute() external payable {
        require(msg.value > 0, "Contribution must be > 0");

        contributions[msg.sender] += msg.value;

        emit Contributed(msg.sender, msg.value);
    }

    function markProgress() external {
        require(msg.sender == startup, "Only startup can mark progress");
        require(!isProjectStarted, "Project already started");

        isProjectStarted = true;
        emit ProjectStarted();
    }

    function releaseFunds() external {
        require(msg.sender == startup, "Only startup can withdraw");
        require(isProjectStarted, "Project hasn't started");

        uint balance = address(this).balance;
        require(balance > 0, "No funds to release");

        payable(startup).transfer(balance);
        emit FundsReleased(balance);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function goalReached() public view returns (bool) {
        return address(this).balance >= goal;
    }
}
