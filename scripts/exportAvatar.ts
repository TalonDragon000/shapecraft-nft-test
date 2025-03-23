import { ethers } from "hardhat";
import * as dotenv from "dotenv";

async function main() {

  dotenv.config();

  // Constants
  const AVATAR_ADDRESS = process.env.AVATAR_ADDRESS;
  const WORLD_ADDRESS = process.env.WORLD_ADDRESS;
  const TOKEN_ID = process.env.TOKEN_ID;

  // Get the World contract
  const World = await ethers.getContractAt("World", WORLD_ADDRESS as string);

  console.log(`Exporting Avatar NFT (Token ID: ${TOKEN_ID}) from World...`);
  // Then export the item from the World contract
  const exportTx = await World.exportItem(AVATAR_ADDRESS as string, TOKEN_ID as string);
  await exportTx.wait();
  console.log("Export successful!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});