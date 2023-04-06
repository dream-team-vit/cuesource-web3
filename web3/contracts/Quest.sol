//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//comment this if you don't want to use console.log
// import "hardhat/console.sol";

import "./Ownable.sol";

contract QuestCreator is Ownable {

	struct Bid {
		string iD;
		string developerID;
		address developerAddress;
		string proposal;
		uint16 bidAmmount;
	}

	struct Quest {
		address owner;
		string developerID;
		string description;
		uint minPrize;
		uint maxPrize;
		uint startingDate;
		uint endDate;
		uint deadlineDayCount;
		uint issueNumber;
		uint repoId;
		string selectedBid;
		bool accepted;
		uint selectedTime;
		uint deadlineTime;
		Bid[] bids;
	}

	mapping (uint => Quest) quests;

	uint public numberOfQuests = 0;
	uint private ammountInContract = 0;

	function getTotalContractAmmount() public view onlyOwner() returns (uint) {
		return ammountInContract;
	}

	function createQuest(address _owner, string memory _description, uint _minPrize, uint _maxPrize, uint _deadlineDayCount, uint _issueNumber, uint _repoId) public returns (uint) {
		Quest storage quest = quests[numberOfQuests];

		quest.owner = _owner;
		quest.issueNumber = _issueNumber;
		quest.repoId = _repoId;
		quest.deadlineDayCount = _deadlineDayCount;
		quest.minPrize = _minPrize;
		quest.maxPrize = _maxPrize;
		quest.description = _description;
		quest.accepted = false;

		numberOfQuests++;

		return numberOfQuests - 1;
	}

	function updateQuest(uint _questId, string memory _description, uint _minPrize, uint _maxPrize, uint16 _deadlineDayCount, uint16 _issueNumber) public returns (Quest memory) {
		Quest storage quest = quests[_questId];

		quest.issueNumber = _issueNumber;
		quest.deadlineDayCount = _deadlineDayCount;
		quest.minPrize = _minPrize;
		quest.maxPrize = _maxPrize;
		quest.description = _description;

		return quest;
	}

	function deleteQuest(uint _questId) public returns (uint) {
		delete quests[_questId];

		return _questId;
	}

	function getQuests() public view returns (Quest[] memory) {
		Quest[] memory allQuests = new Quest[](numberOfQuests);

		for (uint i = 0; i < numberOfQuests; i++) {
			Quest storage quest = quests[i];
			allQuests[i] = quest;
		}

		return allQuests;
	}

	function getQuest(uint _questId) public view returns (Quest memory) {
		Quest memory quest = quests[_questId];

		return quest;
	}

	function createBid(uint _questId, string memory _newBidId, string memory _developerID, address _developerAddress, string memory _proposal, uint16 _bidAmmount) public returns  (uint) {
		Bid memory bid;
		
		bid.iD = _newBidId;
		bid.developerID = _developerID;
		bid.developerAddress = _developerAddress;
		bid.proposal = _proposal;
		bid.bidAmmount = _bidAmmount;

		Quest storage quest = quests[_questId];

		quest.bids.push(bid);

		return _questId;
	}
	
	function updateBid(uint _questId, string memory _bidId, string memory _developerID, string memory _proposal, uint16 _bidAmmount) public returns  (string memory) {
		Quest storage quest = quests[_questId];

		for (uint i = 0; i < quest.bids.length; i++) {
			if (keccak256(bytes(quest.bids[i].iD)) == keccak256(bytes(_bidId))) {
				quest.bids[i].developerID = _developerID;
				quest.bids[i].proposal = _proposal;
				quest.bids[i].bidAmmount = _bidAmmount;
			}
		}

		return _bidId;
	}

	function deleteBid(uint _questId, string memory _bidId) public returns (string memory) {
		Quest storage quest = quests[_questId];
		
		for (uint i = 0; i < quest.bids.length; i++) {
			if (keccak256(bytes(quest.bids[i].iD)) == keccak256(bytes(_bidId))) {
				quest.bids[i] = quest.bids[quest.bids.length - 1];

				quest.bids.pop();
			}
		}

		return _bidId;
	}

	function selectBid(string memory _bidId, uint _questId) payable public returns (uint) {
		Quest storage quest = quests[_questId];
		Bid memory bid;

		for (uint i = 0; i < quest.bids.length; i++) {
			if (keccak256(bytes(quest.bids[i].iD)) == keccak256(bytes(_bidId))) {
				bid = quest.bids[i];
				require(msg.value == bid.bidAmmount, "Please deposit the selected bid ammount");
				ammountInContract += bid.bidAmmount;
			}
		}

		// setting the selected bid to the bid selected by the org
		quest.selectedBid = _bidId;

		// setting the selectedTime and deadlineTime on quest
		quest.selectedTime = block.timestamp;
		quest.deadlineTime = _getDeadline(quest.selectedTime, quest.deadlineDayCount);

		return _questId;
	}

	function _getDeadline(uint _selectedTime, uint _deadlineDayCount) private pure returns (uint) {
		// Number of seconds in a day is 86400
		uint deadlineDayCountSec = _deadlineDayCount * 86400;
		uint deadlineDayTime = _selectedTime + deadlineDayCountSec;

		return deadlineDayTime;
	}

	function getAccept(uint _questId) public view returns (bool) {
		Quest memory quest = quests[_questId];

		return quest.accepted;
	}

	function setAccept(bool newVal, uint _questId) public {
		Quest storage quest = quests[_questId];
		Bid memory selectedBid;

		quest.accepted = newVal;
		
		for (uint i = 0; i < quest.bids.length; i++) {
			if (keccak256(bytes(quest.bids[i].iD)) == keccak256(bytes(quest.selectedBid))) {
				selectedBid = quest.bids[i];
		}}

		// if the work is not accepted the money is to be transferred back to the org
		if (quest.accepted == false) {
			(bool success, ) = payable(quest.owner).call{value: selectedBid.bidAmmount}("");

			require(success, "The money should be transferred back to the organziation");
		} else { // if the work is accepted the money is to be sent to the developer address
			(bool success, ) = payable(selectedBid.developerAddress).call{value: selectedBid.bidAmmount}("");

			require (success, "The money should be tranferred to the developer's address");
		}
	}

	function viewBid(uint _questId, string memory _bidId) public view returns (Bid memory) {
		Quest memory quest = quests[_questId];
		Bid memory bid;

		for (uint i = 0; i < quest.bids.length; i++) {
			if (keccak256(bytes(quest.bids[i].iD)) == keccak256(bytes(_bidId))) {
				bid = quest.bids[i];
			}
		}

		return bid;
	}
}