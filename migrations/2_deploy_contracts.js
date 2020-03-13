var Voting = artifacts.require('./Voting.sol');

module.exports = function (deployer) {
	deployer.deploy(Voting, [web3.utils.fromAscii('Rama'), web3.utils.fromAscii('Nick'), web3.utils.fromAscii('Jose')], { gas: 6700000 });
};