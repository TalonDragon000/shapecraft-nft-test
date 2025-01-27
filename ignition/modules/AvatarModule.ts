// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AvatarModule = buildModule("AvatarModule", (m) => {
  // Deploy Avatar contract
  const avatar = m.contract("Avatar", [], {
    id: "Avatar_v2"
  });

  // Get signers from configuration
  const owner = m.getAccount(0);    // First signer
  const addr1 = m.getAccount(1);    // Second signer
//  const addr2 = m.getAccount(2);    // Third signer

  // Mint NFTs to each address
  m.call(avatar, "ownerMint", [owner], {    // TokenId 0
    id: "Avatar_v2"
  });
  m.call(avatar, "mint", [], { from: addr1, id: `id1` }); {    // TokenId 1
    id: "Avatar_v2"
  }
//  m.call(avatar, "mint", [], { from: addr2, id: `id2` }); {    // TokenId 2
//    id: "Avatar_v3"
//  }

  return { avatar };
});

export default AvatarModule;
