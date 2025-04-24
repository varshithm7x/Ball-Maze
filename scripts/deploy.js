const hre = require("hardhat");

async function main() {
  console.log("Deploying BallMazeNFT contract...");

  // Get the contract factory
  const BallMazeNFT = await hre.ethers.getContractFactory("BallMazeNFT");

  // Deploy the contract
  const ballMazeNFT = await BallMazeNFT.deploy();
  await ballMazeNFT.waitForDeployment();

  const address = await ballMazeNFT.getAddress();
  console.log("BallMazeNFT deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 