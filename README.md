# ShapeCraft NFT Collection Test for Hom3Town

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Steps to run the project:

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Run the project

``` 
// Run the project

ALCHEMY_API_KEY, PINATA_METADATA_CID, PINATA_IMAGE_CID, PINATA_GATEWAY_URL
// Environment variables

npx hardhat node // This will start the Hardhat network

npx hardhat ignition deploy ignition/modules/<file.ts> // This will deploy the contracts

npx hardhat ignition deploy ignition/modules/<file.ts> --network <network_name> // This will deploy the contracts to a specific network

npx hardhat run scripts/<scripts_file.ts> // This will run the scripts

npx hardhat run scripts/<scripts_file.ts> --network <network_name> // This will run the scripts on a specific network

npx hardhat test <test_file.ts> // This will run the tests

npx hardhat test <test_file.ts> --network <network_name> // This will run the tests on a specific network

npx hardhat help // For more help
```

## Features

### Contracts

- Avatar.sol

    Avatar.sol is the contract that implements the ERC1155 standard and includes the following features:

  - Owner Roles:

    ```
    Owner can mint past max mint limits --> "ownerMint()"
    Owner can mint tokens to any address --> "ownerMint(<EOA_ADDRESS>)"
    Owner can update the mint limit --> "setMintLimit()"
    Owner can udpate the metadata URI for the entire collection --> "setBaseURI()"
    Owner can update the metadata URI for a specific tokenId --> "setTokenURI(tokenId, newURI)"
    ```

  - Public Mint:

    ```
    Public can mint up to the mint limit --> "mint()" "avatar.connect(<YOUR_ADDRESS>).mint()"
    Public can update the metadata URI for their own NFT --> "setTokenURI(tokenId, newURI)"
    ```

  - NFT Info:

    ```
    Free NFT automatically minted when an account is created
    There is a default image and metadata URI for each NFT --> baseURI()
    Each NFT has a unique ID assigned to it --> tokenId()
    Each NFT is assigned to the address that minted it --> ownerOf()
    Default mint limit is 1 NFT per address
    ```

- World.sol

    World.sol is the contract that implements the ERC1155 standard and includes the following features:

      ```
      NFT can import into other worlds --> "importNFT()"
      NFT can be exported from other worlds --> "exportNFT()"
      Transactions can be gas sponsored by the Contract Owner
      ```
