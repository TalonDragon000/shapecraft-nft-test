# ShapeCraft NFT Collection Test for Hom3Town

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test <test_file.ts>
npx hardhat test <test_file.ts> --network <network_name>
npx hardhat node
npx hardhat ignition deploy ignition/modules/<file.ts>
npx hardhat ignition deploy ignition/modules/<file.ts> --network <network_name>
npx hardhat run scripts <scripts_file.ts>
npx hardhat run scripts <scripts_file.ts> --network <network_name>
npx hardhat run dev
```

# Features

## Contracts

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
