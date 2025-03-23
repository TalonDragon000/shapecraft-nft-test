import { ethers } from "hardhat";
import { Avatar } from "../typechain-types";
import * as dotenv from 'dotenv';

async function main() {
  dotenv.config();

  // Define variables for the token update
  const TOKEN_ID = parseInt(process.env.TOKEN_ID || "1"); // Token ID to update
  const CALLER_ADDRESS = process.env.CALLER_ADDRESS || "YOUR_ADDRESS_HERE"; // Address of the caller
  const NEW_TOKEN_URI = process.env.NEW_TOKEN_URI || "ipfs://NEW_METADATA_URI_HERE"; // New URI for the token

  // Get the Avatar contract instance
  const AVATAR_ADDRESS = process.env.AVATAR_ADDRESS;
  if (!AVATAR_ADDRESS) {
    throw new Error("AVATAR_ADDRESS not found in .env file");
  }
  
  const avatar = await ethers.getContractAt("Avatar", AVATAR_ADDRESS) as Avatar;
  console.log("Connected to Avatar contract at:", AVATAR_ADDRESS);

  // Get the signer
  const signer = await ethers.getSigner(CALLER_ADDRESS);
  console.log("Using account:", signer.address);

  try {
    // Check if the caller owns the token
    const balance = await avatar.balanceOf(signer.address, TOKEN_ID);
    if (balance > 0) {
        console.log(`Caller owns token ID ${TOKEN_ID}. Proceeding with update...`);
    } else {
        throw new Error("You do not have permission to update this NFT");
    }

    // Enable individual URIs if not already enabled
    const tokenURI = await avatar.uri(TOKEN_ID);
    if (tokenURI !== NEW_TOKEN_URI) {
      const usingIndividual = await avatar.usingIndividualURIs();
      if (!usingIndividual) {
        console.log("Enabling individual URI support...");
        await avatar.toggleIndividualURIs(true);
      }
    }
    // Update the token URI
    let tx = await avatar.connect(signer).setTokenURI(TOKEN_ID, NEW_TOKEN_URI);
    console.log("Transaction hash:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt?.blockNumber);

    // Verify the update
    const updatedURI = await avatar.uri(TOKEN_ID);
    console.log("\nVerification:");
    console.log(`New URI for token ${TOKEN_ID}: ${updatedURI}`);
    console.log("URI Update Success:", updatedURI === NEW_TOKEN_URI);

    // Check for TokenURIUpdated event
    const event = receipt?.logs.find((log: any) => {
      try {
        const parsedLog = avatar.interface.parseLog(log as any);
        return parsedLog?.name === "TokenURIUpdated";
      } catch (e) {
        return false;
      }
    });

    if (event) {
      const parsedEvent = avatar.interface.parseLog(event as any);
      console.log("\nTokenURIUpdated Event Details:");
      console.log("Token ID:", parsedEvent?.args[0]);
      console.log("Old URI:", parsedEvent?.args[1]);
      console.log("New URI:", parsedEvent?.args[2]);
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