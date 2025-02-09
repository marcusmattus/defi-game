// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const AirDAODeFiGame = await ethers.getContractFactory("AirDAODeFiGame");

  // *** HARDCODE THE ADDRESSES HERE ***
  const ambTokenAddress = "0x1234567890123456789012345678901234567890"; // Replace!
  const airDAOAddress = "0xabcdef1234567890abcdef1234567890abcdef12";   // Replace!

  const game = await AirDAODeFiGame.deploy(ambTokenAddress, airDAOAddress);

  await game.waitForDeployment();
  const deployedAddress = await game.getAddress()

  console.log(`AirDAODeFiGame deployed to: ${deployedAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });