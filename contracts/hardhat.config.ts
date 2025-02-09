
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "@typechain/hardhat";  // Import TypeChain

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    airdao: {
      url: "https://network.ambrosus-test.io ",
      chainId: 22040,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {  // Example: Sepolia testnet
      url: `https://sepolia.infura.io/v3/c3ef40d32e24402fa423e317b1148f2b`,
      chainId: 11155111, 
      accounts: process.env.PRIVATE_KEY_S ? [process.env.PRIVATE_KEY_S] : [],
    },
    hardhat: {}, // Keep this for local testing
  },
  typechain: { // Add this TypeChain configuration
    outDir: "typechain-types", // Output directory for generated types
    target: "ethers-v6", // Target ethers.js version (v6 for ethers >= 6)
  },
}


export default config;
