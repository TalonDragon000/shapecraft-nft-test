import { ethers } from "hardhat";

async function main() {
  // Constants
  const AVATAR_ADDRESS = "0x5a3330376851c016EF6f5B3b756FBDbc98777804";
  const WORLD_ADDRESS = "0xC361b5d9388994B85690A83B5AF798A952bE58b9";
  const TOKEN_ID = 0;

  // Get the Avatar contract
  const Avatar = await ethers.getContractAt("Avatar", AVATAR_ADDRESS);
  
  // Get the World contract
  const World = await ethers.getContractAt("World", WORLD_ADDRESS);

  console.log("Approving World contract to transfer Avatar NFT...");
  // First approve the World contract to handle the NFT
  const approveTx = await Avatar.setApprovalForAll(WORLD_ADDRESS, true);
  await approveTx.wait();
  console.log("Approval granted!");

  console.log(`Importing Avatar NFT (Token ID: ${TOKEN_ID}) into World...`);
  // Then import the item into the World contract
  const importTx = await World.importItem(AVATAR_ADDRESS, TOKEN_ID);
  await importTx.wait();
  console.log("Import successful!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});