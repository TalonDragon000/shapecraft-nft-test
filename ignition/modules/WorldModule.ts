import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WorldModule = buildModule("WorldModule", (m) => {
    // Deploy World contract
    const world = m.contract("World", []);
  
  return { world };
});

export default WorldModule;
