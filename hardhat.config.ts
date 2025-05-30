import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "shapeSepolia",
  networks: {
    shapeSepolia: {
      url: `https://shape-sepolia.g.alchemy.com/v2/${process.env.SHAPE_API_KEY}`,
      chainId: 11011,
      accounts: [
        process.env.SHAPE_PRIVATE_KEY || ""
      ],
    },
  },
};

export default config;
