import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BeGreen", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const BeGreen = await ethers.getContractFactory("BeGreen");
    const beGreen = await BeGreen.deploy();
    const Greenwards = await ethers.getContractFactory("Greenwards");
    const greenwards = await Greenwards.deploy();

    return { greenwards, beGreen, owner, otherAccount };
  }

  describe("Integration", function () {
    it("Should perform the whole scenario", async function () {
      const { greenwards, beGreen, otherAccount } = await loadFixture(deployFixture);

      // sets the contract addresses
      await greenwards.setBeGreen(beGreen.address);
      await beGreen.setGreenwards(greenwards.address);
      
      // mints a NFT to the other account
      await beGreen.safeMint(otherAccount.address,"level0")

      // checks other account's balance
      expect(await beGreen.balanceOf(otherAccount.address)).to.equal(1)
      // checks we can only mint one token per address
      await expect(beGreen.safeMint(otherAccount.address,"level0")).to.be.revertedWith("Account already created")
      // admin deposits 20 kgs of waste to the other account
      await beGreen.depositWaste(otherAccount.address,20);
      // checks the other account's current waste
      expect(await beGreen.accumulatedWaste(otherAccount.address,0)).to.equal(20)
      // checks the other account's accumulated greenwards
      expect(await beGreen.accumulatedWaste(otherAccount.address,1)).to.equal(0)
      // deposit more waste
      await beGreen.depositWaste(otherAccount.address,100);
      // checks the other account's current waste
      expect(await beGreen.accumulatedWaste(otherAccount.address,0)).to.equal(120)
      // checks total deposited waste by all users
      expect(await beGreen.totalAccumulatedWaste()).to.equal(120)

      // mints rewards and airdrop them
      await greenwards.mint(10)

      expect(await beGreen.tokenURI(0)).to.not.equal("level0")
      // checks the other account's updated tokenURI
      expect(await beGreen.tokenURI(0)).to.equal("https://silver-sound-gamefowl-947.mypinata.cloud/ipfs/QmYVbQLNNGxQ8QaabFBtuFrU8KHmcPRUfDBQvrN4czMZBV?_gl=1*1kd1uk8*rs_ga*MTMxMjk0MzE1Ny4xNjg3NjM5NzY2*rs_ga_5RMPXG14TE*MTY4NzY0MjQ2Ni4yLjEuMTY4NzY0MjUxMi4xNC4wLjA");
      // checks the other account's updated accumulated greenwards
      expect(await greenwards.balanceOf(otherAccount.address)).to.be.equal(10)
    });
  });
});
