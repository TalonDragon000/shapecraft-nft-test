import { expect } from "chai";
import { ethers } from "hardhat";
import { Avatar } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Avatar", function () {
  let avatar: Avatar;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const AvatarFactory = await ethers.getContractFactory("Avatar");
    avatar = await AvatarFactory.deploy();
  });

  describe("Minting Functions", function () {
    it("Should allow the Owner to mint past max mint limits", async function () {
      const limit = await avatar.getMintLimit();
      expect(limit).to.equal(1);
      console.log("Max mint limit:", limit.toString());

      // Owner mints 2 tokens
      console.log("Contract Owner:", owner.address);
      await avatar.ownerMint(owner.address);
      await avatar.ownerMint(owner.address);
      const balance0 = await avatar.balanceOf(owner.address, 0);
      const balance1 = await avatar.balanceOf(owner.address, 1);
      expect(balance0).to.equal(1);
      expect(balance1).to.equal(1);
      console.log("Owner minted 2 tokens");
      // Verify balance
      for(let i = 0; i < 3; i++) {
        const balance = await avatar.balanceOf(owner.address, i);
        if(balance > 0) {
          console.log(`TokenID ${i} owned by Owner (${owner.address})`);
        }
      } console.log("Owner minted multiple tokens successfully");
    });

    it("Public may mint within limits", async function () {
      const limit = await avatar.getMintLimit();
      expect(limit).to.equal(1);
      console.log("Initial mint limit:", limit.toString());

      // Owner mints 1 token
      console.log("Contract Owner:", owner.address);
      await avatar.ownerMint(owner.address);
      const balance0 = await avatar.balanceOf(owner.address, 0);
      expect(balance0).to.equal(1);
      console.log("Owner minted 1 token");

      // Non-owner(Addr1) public mints 1 token
      console.log("Addr1 Owner:", addr1.address);
      await avatar.connect(addr1).mint();
      const balance1 = await avatar.balanceOf(addr1.address, 1);
      expect(balance1).to.equal(1);
      console.log("Addr1 minted 1 token");

      // Non-owner(Addr1) tries to mint 2 tokens - should fail
      try { 
        await avatar.connect(addr1).mint();
        expect(false).to.be.true;
      } catch (error: any) {
        console.log("Non-owner mint limit exceeded");
      }
      
      // Verify Addr1 token balance
      console.log("\nAddr1's Tokens:");
      for(let i = 0; i < 3; i++) {
        const balance = await avatar.balanceOf(addr1.address, i);
        if(balance > 0) {
          console.log(`TokenID ${i} owned by Address1 (${addr1.address})`);
        }
      } 
    });

    it("Only the Owner can update mint limit", async function () {
      // Owner updates limit to 3
      await avatar.setMaxMintLimit(3);
      const newLimit = await avatar.getMintLimit();
      console.log(`Mint limit updated to ${newLimit.toString()}`);
      expect(newLimit).to.equal(3);

      // Non-owner (addr1) tries to update limit to 4 - should fail
      try {
        await avatar.connect(addr1).setMaxMintLimit(4);
        expect(false).to.be.true; // Should not reach here
      } catch (error: any) {
        console.log("Non-owner prevented from updating mint limit");
      }

      // Verify limit is still 3
      const finalLimit = await avatar.getMintLimit();
      expect(finalLimit).to.equal(3);
      console.log(`Mint limit is still set to ${finalLimit.toString()}`);
    });

    it("Should allow owner to mint to other addresses", async function () {
      await avatar.ownerMint(owner.address);
      await avatar.ownerMint(addr1.address);
      console.log("Owner minted to other addresses successfully");
    
      console.log("\nOwner's Tokens:");
      for(let i = 0; i < 3; i++) {
        const balance = await avatar.balanceOf(owner.address, i);
        if(balance > 0) {
          console.log(`TokenID ${i} owned by Owner (${owner.address})`);
        }
      }
      console.log("\nAddr1's Tokens:");
      for(let i = 0; i < 3; i++) {
        const balance = await avatar.balanceOf(addr1.address, i);
        if(balance > 0) {
          console.log(`TokenID ${i} owned by Address1 (${addr1.address})`);
        }
      }
    });
  });
});
