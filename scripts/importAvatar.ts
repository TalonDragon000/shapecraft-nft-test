import { ethers } from "hardhat";
import * as dotenv from "dotenv";

async function main() {

  dotenv.config();

  // Constants
  const AVATAR_ADDRESS = process.env.AVATAR_ADDRESS;
  const WORLD_ADDRESS = process.env.WORLD_ADDRESS;
  const TOKEN_ID = process.env.TOKEN_ID;

  // Get the Avatar contract
  const Avatar = await ethers.getContractAt("Avatar", AVATAR_ADDRESS as string);
  
  // Get the World contract
  const World = await ethers.getContractAt("World", WORLD_ADDRESS as string);

  console.log("Approving World contract to transfer Avatar NFT...");
  // First approve the World contract to handle the NFT
  const approveTx = await Avatar.setApprovalForAll(WORLD_ADDRESS as string, true);
  await approveTx.wait();
  console.log("Approval granted!");

  console.log(`Importing Avatar NFT (Token ID: ${TOKEN_ID}) into World...`);
  // Then import the item into the World contract
  const importTx = await World.importItem(AVATAR_ADDRESS as string, TOKEN_ID as string);
  await importTx.wait();
  console.log("Import successful!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});