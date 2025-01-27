import { ethers } from "hardhat";
import dotenv from "dotenv";

async function main() {
  // Load environment variables
  dotenv.config();
  
  const PINATA_IMAGE_CID = process.env.PINATA_IMAGE_CID;
  
  console.log("Deploying Avatar contract with CID:", PINATA_IMAGE_CID);

  const Avatar = await ethers.getContractFactory("Avatar");
  const avatar = await Avatar.deploy();

  await avatar.deployed();
  
  // Set the initial URI with the PINATA_IMAGE_CID
  const initialURI = `ipfs://${PINATA_IMAGE_CID}/{id}.json`;
  await avatar.setURI(initialURI);

  console.log("Avatar deployed to:", avatar.address);
  console.log("Metadata URI set to:", await avatar.uri(0));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 