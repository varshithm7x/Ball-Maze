require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    monad: {
      url: "https://testnet-rpc.monad.xyz",
      chainId: 10143,
      accounts: [process.env.PRIVATE_KEY || ""]
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545/",
    },
    // Add a local network configuration for testing
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 1000
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 