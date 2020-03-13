import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import voting_artifacts from '../../build/contracts/Voting.json';

var Voting = contract(voting_artifacts);

let candidates = { "Rema": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3" }

let account;

window.voteForCandidate = function (candidate) {
	let candidateName = $('#candidate').val();

	try {
		$("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
		$("#candidate").val("");

		Voting.deployed().then(function (contractInstance) {
			contractInstance.voteForCandidate(candidateName, { gas: 140000, from: account }).then(function () {
				let div_id = candidates[candidateName];
				return contractInstance.totalVotesFor.call(web.utils.fromAscii(candidateName)).then(function (v) {
					$("#" + div_id).html(v.toString());
					$("#msg").html("");
				});
			});
		});
	} catch (err) {
		console.log(error);
	}
}

$(document).ready(function () {
	if (typeof web3 !== 'undefined') {
		console.warn("Using web3 detected from external source like Metamask")
		window.web3 = new Web3(web3.currentProvider);
	} else {
		console.warn("No web3 detected. Falling back to http://localhost:8545. You remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
		window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	}

	web3.eth.getAccounts(function (err, accs) {
		if (err != null) {
			alert('There was an error fetching your accounts.')
			return
		}

		if (accs.length === 0) {
			alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
			return
		}

		account = accs[0]
	})

	Voting.setProvider(web3.currentProvider);
	let candidateNames = Object.keys(candidates);
	for (var i = 0; i < candidateNames.length; i++) {
		let name = candidateNames[i];
		Voting.deployed().then(function (contractInstance) {
			contractInstance.totalVotesFor.call(web3.utils.fromAscii(name)).then(function (v) {
				$("#" + candidates[name]).html(v.toString());
			});
		})
	}
});
