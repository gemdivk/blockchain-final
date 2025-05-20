const CONTRACT_ADDRESS = "0x8abd02Cb9c5d0D9158e73a48c86184F676c7D8b1";
const CONTRACT_ABI = [
  "function contribute() payable",
  "function markProgress()",
  "function releaseFunds()",
  "function getBalance() view returns (uint)",
  "function goal() view returns (uint)",
  "function isProjectStarted() view returns (bool)"
];

let provider, signer, contract;

async function connect() {
  if (!window.ethereum) return alert("Please install MetaMask");

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const address = await signer.getAddress();
  document.getElementById("account").textContent = address;

  const bal = await contract.getBalance();
  const g = await contract.goal();
  const started = await contract.isProjectStarted();

  document.getElementById("balance").textContent = ethers.formatEther(bal);
  document.getElementById("goal").textContent = ethers.formatEther(g);
  document.getElementById("started").textContent = started ? "Yes" : "No";
}

async function contribute() {
  const amount = document.getElementById("amount").value;
  if (!amount) return alert("Enter ETH amount");
  const tx = await contract.contribute({ value: ethers.parseEther(amount) });
  await tx.wait();
  alert("Contribution successful!");
}

async function markProgress() {
  const tx = await contract.markProgress();
  await tx.wait();
  alert("Progress marked!");
}

async function releaseFunds() {
  const tx = await contract.releaseFunds();
  await tx.wait();
  alert("Funds released!");
}