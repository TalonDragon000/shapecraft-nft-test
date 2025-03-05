// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";
import { Avatar } from "../../typechain-types";

const AvatarModule = buildModule("AvatarModule", (m) => {
  // Deploy Avatar contract
  const avatar = m.contract("Avatar", [], {
    id: "Avatar_v1"
  });

  // Get signers from configuration
  const owner = m.getAccount(0);    // First signer
  //const addr1 = m.getAccount(1);    // Second signer
//  const addr2 = m.getAccount(2);    // Third signer

  // Mint NFTs to each address
  m.call(avatar, "ownerMint", [owner], {    // TokenId 0
    id: "mint_owner"
  });
  //m.call(avatar, "mint", [], { from: addr1, id: `mint_addr1` }); {    // TokenId 1
  //  id: "mint_addr1"
  //}
//  m.call(avatar, "mint", [], { from: addr2, id: `id2` }); {    // TokenId 2
//    id: "Avatar_v3"
//  }

  return { avatar };
});

export default AvatarModule;
