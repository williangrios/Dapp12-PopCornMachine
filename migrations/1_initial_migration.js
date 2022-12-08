const PopCornMachine = artifacts.require("PopCornMachine");

module.exports = function (deployer) {
  deployer.deploy(PopCornMachine, 10, 25);
};
