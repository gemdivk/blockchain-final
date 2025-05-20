const { expect } = require("chai");

describe("CrowdfundingWithTrust", function () {
  let contract, owner, addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const Crowdfunding = await ethers.getContractFactory("CrowdfundingWithTrust");
    contract = await Crowdfunding.deploy(owner.address, ethers.utils.parseEther("5"));
    await contract.deployed();
  });

  it("should accept contributions", async () => {
    await contract.connect(addr1).contribute({ value: ethers.utils.parseEther("1") });
    const balance = await contract.getBalance();
    expect(balance.toString()).to.equal(ethers.utils.parseEther("1").toString());
  });

  it("should not release funds without progress", async () => {
    try {
      await contract.releaseFunds();
      throw new Error("Expected revert not received");
    } catch (err) {
      expect(err.message).to.include("Project hasn't started");
    }
  });

  it("should release funds after progress", async () => {
    await contract.connect(addr1).contribute({ value: ethers.utils.parseEther("2") });
    await contract.markProgress();

    const balanceBefore = await ethers.provider.getBalance(owner.address);
    const tx = await contract.releaseFunds();
    await tx.wait();
    const balanceAfter = await ethers.provider.getBalance(owner.address);

    expect(balanceAfter.gt(balanceBefore)).to.be.true;
  });
});
