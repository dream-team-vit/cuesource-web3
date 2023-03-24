//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//comment this if you don't want to use console.log
// import "hardhat/console.sol";

contract QuestCreator {

	struct Bid {
		string iD;
		string developerID;
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
		uint16 deadlineDayCount;
		uint16 issueId;
		string selectedBid;
		Bid[] bids;
	}


	mapping (uint => Quest) quests;

	uint public numberOfQuests = 0;

	function createQuest(string memory _description, uint _minPrize, uint _maxPrize, uint16 _deadlineDayCount, uint16 _issueId) public returns (uint) {
		Quest storage quest = quests[numberOfQuests];

		quest.issueId = _issueId;
		quest.deadlineDayCount = _deadlineDayCount;
		quest.minPrize = _minPrize;
		quest.maxPrize = _maxPrize;
		quest.description = _description;

		numberOfQuests++;

		return numberOfQuests - 1;
	}

	function updateQuest(uint _questId, string memory _description, uint _minPrize, uint _maxPrize, uint16 _deadlineDayCount, uint16 _issueId) public returns (Quest memory) {
		Quest storage quest = quests[_questId];

		quest.issueId = _issueId;
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

	function createBid(uint _questId, string memory _newBidId, string memory _developerID, string memory _proposal, uint16 _bidAmmount) public returns  (uint) {
		Bid memory bid;
		
		bid.iD = _newBidId;
		bid.developerID = _developerID;
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

	function selectBid(string memory _bidId, uint _questId) public returns (uint) {
		Quest storage quest = quests[_questId];

		quest.selectedBid = _bidId;

		return _questId;
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