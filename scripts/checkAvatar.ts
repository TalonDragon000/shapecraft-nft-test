import { ethers } from "hardhat";
import { Avatar } from "../typechain-types";
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Get multiple signers
  const [owner, addr1, addr2] = await ethers.getSigners();
  const signers = [owner, addr1, addr2];

  // Get the Avatar contract instance at the specified address
  const avatarAddress = "0x5a3330376851c016EF6f5B3b756FBDbc98777804";
  const worldAddress = "0xC361b5d9388994B85690A83B5AF798A952bE58b9";
  const avatar = await ethers.getContractAt("Avatar", avatarAddress) as Avatar;

  const address = owner.address;
  console.log("Address:", address);

  // Check balances for each signer
  for (const signer of signers) {
  console.log("Checking NFT balance for account:", signer.address);
 
  // Since this is an ERC1155 with sequential token IDs, we'll check the first few tokens
  for (let tokenId = 0; tokenId < 3; tokenId++) {
    const balance = await avatar.balanceOf(signer.address, tokenId);
    if (balance > 0) {
        console.log(`Token ID ${tokenId}: ${balance.toString()} tokens`)
    }
    else {
        console.log(`Token ID ${tokenId}: 0 tokens`)
    }
  }
  }

  // Check world NFT balances
  for (let tokenId = 0; tokenId < 5; tokenId++) {
   const worldBalance = await avatar.balanceOf(worldAddress, tokenId);
    if (worldBalance > 0) {
        console.log("Checking NFT balance for world:", worldAddress);
        console.log(`Token ID ${tokenId}: ${worldBalance.toString()} tokens`);
    }
  }
}


// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });