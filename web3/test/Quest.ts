import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Quest } from "../typechain-types";

describe("Quest", () => {
  let quest: Quest;

  beforeEach(async () => {
    const Quest = await ethers.getContractFactory("Quest");
    quest = await Quest.deploy();
  });
});
