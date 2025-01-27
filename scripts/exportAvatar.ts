import { ethers } from "hardhat";

async function main() {
  // Constants
  const AVATAR_ADDRESS = "0x5a3330376851c016EF6f5B3b756FBDbc98777804";
  const WORLD_ADDRESS = "0xC361b5d9388994B85690A83B5AF798A952bE58b9";
  const TOKEN_ID = 0;

  // Get the World contract
  const World = await ethers.getContractAt("World", WORLD_ADDRESS);

  console.log(`Exporting Avatar NFT (Token ID: ${TOKEN_ID}) from World...`);
  // Then export the item from the World contract
  const exportTx = await World.exportItem(AVATAR_ADDRESS, TOKEN_ID);
  await exportTx.wait();
  console.log("Export successful!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});