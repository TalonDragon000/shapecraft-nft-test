# ShapeCraft NFT Collection Test for Hom3Town

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

This contract is deployed on the following networks:

- Sepolia testnet at contract address: [0xf6e224cCF996Ab01d089e1cA43aD1F5dD47344B4](https://sepolia.etherscan.io/address/0xf6e224cCF996Ab01d089e1cA43aD1F5dD47344B4)

- Shape Mainnet at contract address: [0x2a5A365Ff81067D761F4BBD314C52976A8789EA8](https://shapescan.xyz/address/0x2a5A365Ff81067D761F4BBD314C52976A8789EA8)

Steps to run the project:

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Run the project

``` 
// Environment variables
ALCHEMY_API_KEY, PINATA_METADATA_CID, PINATA_IMAGE_CID, PINATA_GATEWAY_URL

// Start the Hardhat network
npx hardhat node

// Deploy the contracts
npx hardhat ignition deploy ignition/modules/<file.ts> 
npx hardhat ignition deploy ignition/modules/<file.ts> --network <network_name>

// Run the scripts
npx hardhat run scripts/<scripts_file.ts> 
npx hardhat run scripts/<scripts_file.ts> --network <network_name>

// Run the tests
npx hardhat test <test_file.ts> 
npx hardhat test <test_file.ts> --network <network_name>

// For more help
npx hardhat help 
```

## Features

### Contracts

- Avatar.sol

    Avatar.sol is the contract that implements the ERC1155 standard and includes the following features:

  - Owner Roles:

    ```
    Owner can mint past max mint limits --> ownerMint()
    Owner can mint tokens to any address --> ownerMint(<EOA_ADDRESS>)
    Owner can update the mint limit --> setMintLimit()
    ```

  - Public Mint:

    ```
    There is no set price, so minting is FREE
    Anyone can mint an NFT --> mint()
    Default mint limit is 1 NFT per address --> maxMintLimit
    Each NFT has a unique ID# --> tokenId
    Each NFT has a unique base image --> baseURI
    ```

  - NFT Info:

    ```
    Each NFT is assigned to the address that minted it --> _mintedTokens[msg.sender]
    Only the NFT owner can update the image metadata --> setTokenURI()
    ```

- World.sol

    World.sol is the contract that implements the ERC1155 standard and includes the following features:

      ```
      NFT can import into other worlds --> "importNFT()"
      NFT can be exported from other worlds --> "exportNFT()"
      Transactions can be gas sponsored by the Contract Owner
      ```
