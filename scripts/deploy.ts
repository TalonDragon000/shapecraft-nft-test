import { ethers } from "hardhat";
import dotenv from "dotenv";

async function main() {
  // Load environment variables
  dotenv.config();
  
  const PINATA_IMAGE_CID = process.env.PINATA_IMAGE_CID;
  const PINATA_METADATA_CID = process.env.PINATA_METADATA_CID;
  
  console.log("Deploying Avatar Metadata CID:", PINATA_METADATA_CID);

  const Avatar = await ethers.getContractFactory("Avatar");
  const avatar = await Avatar.deploy();

  await avatar.waitForDeployment();

  const address = await avatar.getAddress();
  console.log("Avatar deployed to:", address);
  
  // Set the initial URI with the PINATA_METADATA_CID
  const initialURI = `ipfs://${PINATA_METADATA_CID}.json`;
  await avatar.setURI(initialURI);

  console.log("Avatar CID:", PINATA_IMAGE_CID);
  console.log("Metadata URI set to:", await avatar.uri(0));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 