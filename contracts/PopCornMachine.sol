//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;


contract PopCornMachine {

    address public owner;
    mapping (address => uint) public popCornsEachUser;
    uint public popCornBalance;
    uint immutable public price;

    constructor(uint initialBalance, uint _price){
        popCornBalance = initialBalance;
        popCornsEachUser[address(this)] = initialBalance;
        price = _price;
        owner = msg.sender;
    }

    function topUp (uint amount) public onlyOwner{
        popCornsEachUser [address(this)] += amount;
        popCornBalance += amount;
    }

    function buyPopCorn (uint amount) public payable{
        require(msg.value == amount * price , "Please, deposit correct amount to get popcorns.");
        require(popCornsEachUser[address(this)] >=  amount, "Insuficient Pop Corns in stock.");
        popCornBalance -= amount;
        popCornsEachUser[address(this)] -= amount;
        popCornsEachUser[msg.sender] += amount;
    }

    function givePopCorn() public{
        require(popCornsEachUser[msg.sender] >= 1, "You have no more pop corns.");
        popCornBalance -= 1;
        popCornsEachUser[msg.sender] -= 1;
    }

    function getAmountPopCorn() public view returns (uint){
        return popCornsEachUser[msg.sender];
    }

    function getBalanceWei() public view returns (uint){
        return address(this).balance;
    }

    function machineBalance() public onlyOwner view returns (uint){
        return popCornBalance;
    }

    modifier onlyOwner(){
      require(msg.sender == owner, "Only owner");
      _;
    }
}