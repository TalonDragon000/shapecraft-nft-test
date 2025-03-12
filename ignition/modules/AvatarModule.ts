// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AvatarModule = buildModule("AvatarModule", (m) => {
  // Deploy Avatar contract
  const avatar = m.contract("Avatar", [], {
    id: "Avatar_v1"
  });

  // Get signers from configuration
  const owner = m.getAccount(0);    // First signer
  const addr1 = "YOUR_ADDRESS_HERE";    // Second signer

  // Mint NFTs to each address
  m.call(avatar, "ownerMint", [owner], {    // TokenId 0
    id: "mint_owner"
  });
  m.call(avatar, "mint", [], { from: addr1, id: `mint_addr1` }); {    // TokenId 1
    id: "mint_addr1"
  }

  return { avatar };
});

export default AvatarModule;
