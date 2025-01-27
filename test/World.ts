import { expect } from "chai";
import { ethers } from "hardhat";
import { World, Avatar } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("World", function () {
  let world: World;
  let avatar: Avatar;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    // Deploy Avatar contract
    const AvatarFactory = await ethers.getContractFactory("Avatar");
    avatar = await AvatarFactory.deploy();
    
    // Deploy World contract
    const WorldFactory = await ethers.getContractFactory("World");
    world = await WorldFactory.deploy();
  });

  describe("Item Import/Export", function () {
    it("Should import item and verify ownership transfer", async function () {
      // First mint an item to owner
      const mintTx = await avatar.ownerMint(owner.address);
      await mintTx.wait();
      const tokenId = 0;
      
      // Approve World contract to handle the token
      await avatar.setApprovalForAll(await world.getAddress(), true);
      
      // Import the item to World
      await world.importItem(await avatar.getAddress(), tokenId);
      
      // Verify owner no longer has the token in Avatar contract
      const balanceAfterImport = await avatar.balanceOf(owner.address, tokenId);
      expect(balanceAfterImport).to.equal(0);
      
      // Verify World contract now has the token
      const worldBalance = await avatar.balanceOf(await world.getAddress(), tokenId);
      expect(worldBalance).to.equal(1);
    });

    it("Should prevent unauthorized export and allow owner to export", async function () {
      // First mint and import an item
      const mintTx = await avatar.ownerMint(owner.address);
      await mintTx.wait();
      const tokenId = 0;
      await avatar.setApprovalForAll(await world.getAddress(), true);
      await world.importItem(await avatar.getAddress(), tokenId);
      
      // Try to export with unauthorized address
      await expect(
        world.connect(addr1).exportItem(await avatar.getAddress(), tokenId)
      ).to.be.revertedWith("You are not the owner of this item");
      
      // Verify token is still in World
      const worldBalance = await avatar.balanceOf(await world.getAddress(), tokenId);
      expect(worldBalance).to.equal(1);
      
      // Owner exports the item
      await world.exportItem(await avatar.getAddress(), tokenId);
      
      // Verify owner has the token back
      const ownerBalance = await avatar.balanceOf(owner.address, tokenId);
      expect(ownerBalance).to.equal(1);
      
      // Verify World no longer has the token
      const worldBalanceAfter = await avatar.balanceOf(await world.getAddress(), tokenId);
      expect(worldBalanceAfter).to.equal(0);
    });
  });
});