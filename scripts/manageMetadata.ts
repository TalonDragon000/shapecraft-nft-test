import { ethers } from "hardhat";
import { Avatar } from "../typechain-types";
import * as dotenv from "dotenv";

async function main() {
  dotenv.config();

  // Contract address - you can set this in .env or pass as argument
  const AVATAR_ADDRESS = process.env.AVATAR_ADDRESS;
  
  // Connect to contract
  const avatar = await ethers.getContractAt("Avatar", AVATAR_ADDRESS as string) as Avatar;
  const [owner, addr1] = await ethers.getSigners();


  console.log("\nConnected to Avatar contract at:", AVATAR_ADDRESS);
  console.log("Connected with address:", [
    owner.address,
    //addr1.address
  ]);

  // Enhanced function to check current URI
  async function checkCurrentURI(tokenId: number) {
    try {
      const usingIndividual = await avatar.usingIndividualURIs();
      const currentURI = await avatar.uri(tokenId);
      const contractOwner = await avatar.owner();
      
      console.log(`\nToken ${tokenId} Metadata Status:`);
      console.log(`Using Individual URIs: ${usingIndividual}`);
      console.log(`URI: ${currentURI}`);
      console.log(`Contract Owner: ${contractOwner}`);
      return currentURI;
    } catch (error) {
      console.error(`Error checking URI for token ${tokenId}:`, error);
      return null;
    }
  }

  // Enhanced function to update URI with support for individual tokens
  async function updateURI(newURI: string, tokenId?: number) {
    try {
      console.log("\nInitiating URI update...");
      console.log("New URI:", newURI);
      
      // Verify caller is owner
      const contractOwner = await avatar.owner();
      if (contractOwner.toLowerCase() !== owner.address.toLowerCase()) {
        throw new Error("Only the contract owner can update the URI");
      }

      let tx;
      if (tokenId !== undefined) {
        // Enable individual URIs if not already enabled
        const usingIndividual = await avatar.usingIndividualURIs();
        if (!usingIndividual) {
          console.log("Enabling individual URI support...");
          await avatar.toggleIndividualURIs(true);
        }
        
        console.log(`Updating URI for token ${tokenId}`);
        tx = await avatar.setTokenURI(tokenId, newURI);
      } else {
        console.log("Updating base URI for all tokens");
        tx = await avatar.setBaseURI(newURI);
      }

      console.log("Transaction hash:", tx.hash);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt?.blockNumber);

      // Verify the update
      const updatedURI = await avatar.uri(tokenId || 0);
      console.log("\nVerification Results:");
      console.log("New URI:", updatedURI);
      console.log("Update Success:", updatedURI === newURI);

      return updatedURI === newURI;
    } catch (error) {
      console.error("Error updating URI:", error);
      return false;
    }
  }

  // Add function to toggle individual URI mode
  async function toggleIndividualURIs(enable: boolean) {
    try {
      const tx = await avatar.toggleIndividualURIs(enable);
      await tx.wait();
      const status = await avatar.usingIndividualURIs();
      console.log(`Individual URIs ${status ? 'enabled' : 'disabled'}`);
      return true;
    } catch (error) {
      console.error("Error toggling individual URIs:", error);
      return false;
    }
  }

  // Updated command handling
  const args = process.argv.slice(2);
  const command = args[0];
  const param = args[1];
  const tokenId = args[2] ? parseInt(args[2]) : undefined;

  switch (command) {
    case "check":
      // Check current URI for specific token or all tokens
      if (param) {
        await checkCurrentURI(parseInt(param));
      } else {
        console.log("\nChecking first 5 token IDs:");
        for (let i = 0; i < 5; i++) {
          await checkCurrentURI(i);
        }
      }
      break;

    case "update":
      if (!param) {
        console.error("Please provide new URI");
        process.exit(1);
      }

    case "toggle":
      if (!param) {
        console.error("Please specify 'on' or 'off'");
        process.exit(1);
      }
      await toggleIndividualURIs(param.toLowerCase() === 'on');
      break;

    default:
      console.log("\nAvailable commands:");
      console.log("check [tokenId] - Check current URI (optional: specify tokenId)");
      console.log("update <newURI> [tokenId] - Update URI to new value (optional: specify tokenId)");
      console.log("toggle <on|off> - Toggle individual URI support");
      break;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });