import { expect } from "chai";
import { ethers } from "hardhat";
import { Avatar } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Avatar", function () {
  let avatar: Avatar;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  // URI addresses for testing
  const INITIAL_IPFS_URI = "ipfs://bafkreidsjpffdkeuzrlqci6k24rr5sitvzu4ndqsy22rvwoejl4pagk4g4";
  const NEW_IPFS_URI = "ipfs://bafkreicsmiwadxmc2gk22fhbxaa5dfm2mhcd6hf4tqdd3d4pztqmq36api";

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const AvatarFactory = await ethers.getContractFactory("Avatar");
    avatar = await AvatarFactory.deploy();

    // Set initial URI after deployment
    await avatar.setBaseURI(INITIAL_IPFS_URI);
    });

  describe("Metadata URI Management", function () {
    it("Should have correct initial URI", async function () {
      const currentURI = await avatar.uri(0);
      console.log("Initial metadata URI:", currentURI);
      expect(currentURI).to.equal(INITIAL_IPFS_URI);
    });

    it("Should allow ONLY the Owner to update metadata URI", async function () {
      // Log current state
      const initialURI = await avatar.uri(0);
      console.log("Owner:", owner.address);
      console.log("Non-owner:", addr1.address);
      console.log("Initial URI:", initialURI);

      // Owner updates URI
      console.log("Updating URI to:", NEW_IPFS_URI);
      const updateTx = await avatar.setURI(NEW_IPFS_URI);
      const receipt = await updateTx.wait();
      
      // Check new URI
      const updatedURI = await avatar.uri(0);
      expect(updatedURI).to.equal(NEW_IPFS_URI);
      console.log("Updated metadata URI:", updatedURI);

      // Check for URI event
      const event = receipt?.logs.find(
        (log: any) => log.fragment?.name === "URI"
      );

      if (event) {
        const parsedEvent = avatar.interface.parseLog(event);
        console.log("\nURI Update Event Details:");
        console.log("New URI:", parsedEvent?.args?.value);
        console.log("Token ID:", parsedEvent?.args?.id);
      }
    });

    it("Should prevent non-owner from updating metadata URI", async function () {
        // Mint a token for addr1
        await avatar.connect(addr1).mint();

        // Log current state
        console.log("Current URI:", await avatar.uri(0));
        console.log("Non-owner address:", addr1.address);
        
        // Non-owner attempts to update URI
        await expect(
            avatar.connect(addr1).setURI(NEW_IPFS_URI)
            ).to.be.revertedWithCustomError(avatar, "OwnableUnauthorizedAccount")
            .withArgs(addr1.address);
        
        // Verify URI hasn't changed
        const finalURI = await avatar.uri(0);
        expect(finalURI).to.equal(INITIAL_IPFS_URI);
        console.log("URI remained unchanged after unauthorized update attempt");
    });
  
    it("Should maintain consistent URI across all token IDs", async function () {
        // Update URI first
        await avatar.setBaseURI(NEW_IPFS_URI);
        
        // Check multiple token IDs
        const uri0 = await avatar.uri(0);
        const uri1 = await avatar.uri(1);
        const uri99 = await avatar.uri(99);
        
        expect(uri0).to.equal(NEW_IPFS_URI);
        expect(uri1).to.equal(NEW_IPFS_URI);
        expect(uri99).to.equal(NEW_IPFS_URI);
        console.log("URI is consistent across all token IDs");
    });

    it("Should allow token owners to update their token's individual URI when enabled", async function () {
        // Mint initial tokens 
        await avatar.connect(owner).mint(); 
        await avatar.connect(addr1).mint();
        console.log("Token minted for owner");
        console.log("Token minted for addr1");

        // Get token ID by checking balances from 0 up to current
        let tokenId;
        for (let i = 0; i < 10; i++) {
            const balance = await avatar.balanceOf(addr1.address, i);
            if (balance > 0) {
                tokenId = i;
                break;
            }
        }
        console.log("Addr1 Token ID assigned:", tokenId);
        
        // Enable individual URIs
        await avatar.toggleIndividualURIs(true);
        
        // addr1 tries to update their token's URI
        await avatar.connect(addr1).setTokenURI(tokenId as number, NEW_IPFS_URI);
        
        // Verify the specific token URI was updated
        const balance = await avatar.balanceOf(`${addr1.address}`, `${tokenId}`);
        expect(balance).to.equal(1);
        const updatedURI = await avatar.uri(`${tokenId}`);
        expect(updatedURI).to.equal(NEW_IPFS_URI);
        console.log("Updated URI:", updatedURI);
        
        // Verify other token URIs remain unchanged
        const baseURI = await avatar.uri(99);
        expect(baseURI).to.equal(INITIAL_IPFS_URI);

      });
  });
});