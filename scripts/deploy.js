async function main() {
  const [deployer] = await ethers.getSigners();

  const startupAddress = deployer.address; // адрес, куда будут отправляться средства
  const goal = ethers.utils.parseEther("5"); // цель — 5 ETH

  const Crowdfunding = await ethers.getContractFactory("CrowdfundingWithTrust");
  const contract = await Crowdfunding.deploy(startupAddress, goal);

  await contract.deployed();

  console.log("✅ Contract deployed to:", contract.address);
  console.log("📬 Startup address:", startupAddress);
  console.log("🎯 Goal (in wei):", goal.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
