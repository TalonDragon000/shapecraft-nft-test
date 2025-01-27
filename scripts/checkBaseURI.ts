import { ethers } from "hardhat";
import { Avatar } from "../typechain-types";
import * as dotenv from "dotenv";
import path from "path";

async function main() {
  // Load environment variables
  dotenv.config();
  
  // Contract address on Shape Sepolia
  const AVATAR_ADDRESS = process.env.AVATAR_ADDRESS;
  
  // Get the baseURI from .env
  const PINATA_METADATA_CID = process.env.PINATA_METADATA_CID;
  
  if (!PINATA_METADATA_CID) {
    throw new Error("PINATA_METADATA_CID not found in .env file");
  }

  console.log("\nChecking environment setup:");
  console.log("Working directory:", process.cwd());
  console.log(".env path:", path.resolve(process.cwd(), '.env'));
  console.log("PINATA_METADATA_CID:", PINATA_METADATA_CID);

  try {
    // Connect to contract
    const avatar = await ethers.getContractAt("Avatar", AVATAR_ADDRESS as string) as Avatar;
    const [owner] = await ethers.getSigners();
    
    console.log("\nContract Connection:");
    console.log("Avatar Contract:", AVATAR_ADDRESS);
    console.log("Connected Address:", owner.address);

    // Check current URI
    const currentURI = await avatar.uri(0);
    console.log("\nCurrent baseURI:", currentURI);

    // If URI is empty or different from .env, update it
    if (currentURI !== `ipfs://${PINATA_METADATA_CID}`) {
      console.log("\nUpdating baseURI...");
      
      // Verify caller is owner
      const contractOwner = await avatar.owner();
      if (contractOwner.toLowerCase() !== owner.address.toLowerCase()) {
        throw new Error("Connected address is not the contract owner");
      }

      // Update URI
      const newURI = `ipfs://${PINATA_METADATA_CID}`;
      const tx = await avatar.setURI(newURI);
      console.log("Transaction hash:", tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt?.blockNumber);

      // Verify the update
      const updatedURI = await avatar.uri(0);
      console.log("\nVerification:");
      console.log("New baseURI:", updatedURI);
      console.log("Expected URI:", newURI);
      console.log("URI Update Success:", updatedURI === newURI);
    } else {
      console.log("\nbaseURI is already set correctly");
    }

  } catch (error) {
    console.error("\nError:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });