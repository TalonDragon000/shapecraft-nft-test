import { ethers } from "hardhat";
import { Avatar } from "../typechain-types";
import * as dotenv from 'dotenv';

async function main() {
  dotenv.config();

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  // Get the Avatar contract instance at the specified address
  const AVATAR_ADDRESS = process.env.AVATAR_ADDRESS || "0xf6e224cCF996Ab01d089e1cA43aD1F5dD47344B4";
  const avatar = await ethers.getContractAt("Avatar", AVATAR_ADDRESS) as Avatar;
  console.log("Connected to Avatar contract at:", AVATAR_ADDRESS);

  try {
    // Mint a new NFT
    console.log("\nMinting new NFT...");
    const tx = await avatar.mint();
    console.log("Transaction hash:", tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt?.blockNumber);
    
    // Get the token ID from the event logs
    const mintEvent = receipt?.logs.find(log => {
      try {
        const parsedLog = avatar.interface.parseLog(log as any);
        return parsedLog?.name === "TransferSingle";
      } catch (e) {
        return false;
      }
    });
    
    let tokenId: { add: (arg0: number) => any; };
    if (mintEvent) {
      const parsedLog = avatar.interface.parseLog(mintEvent as any);
      tokenId = parsedLog?.args[3]; // The token ID is the 4th argument in TransferSingle
      console.log(`Successfully minted token ID: ${tokenId}`);
    } else {
      console.log("Minted successfully, but couldn't determine token ID from logs");
    }

    // List all tokens and their owners
    console.log("\n=== Listing all tokens and their owners ===");
    
    // Get the next token ID to know how many tokens exist
    const nextTokenId = await avatar.getFunction("_nextTokenId")().catch(() => {
      // If _nextTokenId is not directly accessible, we'll estimate based on recent mint
      return tokenId ? tokenId.add(1) : 10; // Fallback to checking first 10 tokens
    });
    
    console.log(`Total tokens minted: ${nextTokenId}`);
    
    // Track unique owners
    const ownerMap = new Map<string, number[]>();
    
    // Check each token
    for (let i = 0; i < nextTokenId; i++) {
      // For ERC1155, we need to check balances for each address that might own the token
      // This is a simplified approach - in a real scenario, you'd need transfer events
      const signerBalance = await avatar.balanceOf(signer.address, i);
      
      if (signerBalance > 0) {
        if (!ownerMap.has(signer.address)) {
          ownerMap.set(signer.address, []);
        }
        ownerMap.get(signer.address)?.push(i);
      }
      
      // Check if contract owner has any tokens (if different from signer)
      const contractOwner = await avatar.owner();
      if (contractOwner.toLowerCase() !== signer.address.toLowerCase()) {
        const ownerBalance = await avatar.balanceOf(contractOwner, i);
        if (ownerBalance > 0) {
          if (!ownerMap.has(contractOwner)) {
            ownerMap.set(contractOwner, []);
          }
          ownerMap.get(contractOwner)?.push(i);
        }
      }
    }
    
    // Display the results
    console.log("\nOwners and their tokens:");
    for (const [owner, tokens] of ownerMap.entries()) {
      console.log(`${owner}: Token IDs [${tokens.join(', ')}]`);
    }
    
    // If no tokens were found
    if (ownerMap.size === 0) {
      console.log("No tokens found or ownership information is not accessible");
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });