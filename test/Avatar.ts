import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Avatar Contract", function () {
  async function deployAvatarFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    const Avatar = await ethers.getContractFactory("Avatar");
    const avatar = await Avatar.deploy();

    return { avatar, owner, user1, user2 };
  }

  it("Should deploy with correct initial values", async function () {
    const { avatar } = await loadFixture(deployAvatarFixture);

    expect(await avatar.name()).to.equal("Avatar");
    expect(await avatar.symbol()).to.equal("AVATAR");
    expect(await avatar.getMintLimit()).to.equal(1);
    expect(await avatar.usingIndividualURIs()).to.be.true;
  });

  it("Should allow the owner to mint tokens", async function () {
    const { avatar, owner, user1 } = await loadFixture(deployAvatarFixture);

    const tokenURI = "https://example.com/token/1";
    const tx = await avatar.ownerMint(user1.address, tokenURI);
    await tx.wait();

    const tokenId = 0; // First token ID
    expect(await avatar.balanceOf(user1.address, tokenId)).to.equal(1);
    expect(await avatar.uri(tokenId)).to.equal(tokenURI);
  });

  it("Should allow users to mint within the limit", async function () {
    const { avatar, user1 } = await loadFixture(deployAvatarFixture);

    const tokenURI = "https://example.com/token/2";
    const tx = await avatar.connect(user1).mint(tokenURI);
    await tx.wait();

    const tokenId = 0; // First token ID for user1
    expect(await avatar.balanceOf(user1.address, tokenId)).to.equal(1);
    expect(await avatar.uri(tokenId)).to.equal(tokenURI);
  });

  it("Should enforce the mint limit", async function () {
    const { avatar, user1 } = await loadFixture(deployAvatarFixture);

    const tokenURI = "https://example.com/token/3";
    await avatar.connect(user1).mint(tokenURI);

    await expect(avatar.connect(user1).mint(tokenURI)).to.be.revertedWith(
      "Mint limit exceeded"
    );
  });

  it("Should allow the owner to update the max mint limit", async function () {
    const { avatar, owner, user1 } = await loadFixture(deployAvatarFixture);

    const newLimit = 2;
    const tx = await avatar.connect(owner).setMaxMintLimit(newLimit);
    await tx.wait();

    expect(await avatar.getMintLimit()).to.equal(newLimit);

    // User1 can now mint twice
    const tokenURI1 = "https://example.com/token/4";
    const tokenURI2 = "https://example.com/token/5";
    await avatar.connect(user1).mint(tokenURI1);
    await avatar.connect(user1).mint(tokenURI2);

    expect(await avatar.balanceOf(user1.address, 0)).to.equal(1);
    expect(await avatar.balanceOf(user1.address, 1)).to.equal(1);
  });

  it("Should allow the owner to toggle individual URIs", async function () {
    const { avatar, owner } = await loadFixture(deployAvatarFixture);

    const tx = await avatar.connect(owner).toggleIndividualURIs(false);
    await tx.wait();

    expect(await avatar.usingIndividualURIs()).to.be.false;
  });

  it("Should allow the owner to set a base URI", async function () {
    const { avatar, owner } = await loadFixture(deployAvatarFixture);

    const baseURI = "https://example.com/base/";
    const tx = await avatar.connect(owner).setBaseURI(baseURI);
    await tx.wait();

    expect(await avatar.uri(0)).to.equal(baseURI);
  });

  it("Should allow updating token URIs if individual URIs are enabled", async function () {
    const { avatar, owner, user1 } = await loadFixture(deployAvatarFixture);

    const tokenURI = "https://example.com/token/6";
    const tx1 = await avatar.ownerMint(user1.address, tokenURI);
    await tx1.wait();

    const tokenId = 0;
    const newTokenURI = "https://example.com/token/updated";
    const tx2 = await avatar.connect(user1).setTokenURI(tokenId, newTokenURI);
    await tx2.wait();

    expect(await avatar.uri(tokenId)).to.equal(newTokenURI);
  });

  it("Should revert when updating token URIs if individual URIs are disabled", async function () {
    const { avatar, owner, user1 } = await loadFixture(deployAvatarFixture);

    const tokenURI = "https://example.com/token/7";
    const tx1 = await avatar.ownerMint(user1.address, tokenURI);
    await tx1.wait();

    const tokenId = 0;
    await avatar.connect(owner).toggleIndividualURIs(false);

    const newTokenURI = "https://example.com/token/updated";
    await expect(
      avatar.connect(user1).setTokenURI(tokenId, newTokenURI)
    ).to.be.revertedWith("Individual URIs not enabled");
  });
});