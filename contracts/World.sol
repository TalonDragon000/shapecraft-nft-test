// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract World is ERC1155Holder {

    // let's keep track of the original owner of the NFT to collection to the tokenId
    mapping(address => mapping(uint256 => address)) public tokenOwners;

    event ItemImported(address indexed avatar, uint256 indexed tokenId);
    event ItemExported(address indexed avatar, uint256 indexed tokenId);

    // Create a function called importItem, which will transferFrom the Avatar to the contract
    function importItem(address avatar,uint256 tokenId) public {
        IERC1155(avatar).safeTransferFrom(msg.sender, address(this), tokenId, 1, "");
        // let's keep track of the original owner of the avatar
        // it should map the address of the owner to the NFT to the tokenId
        tokenOwners[avatar][tokenId] = msg.sender;
        emit ItemImported(avatar, tokenId); 
    }

    // Create a function called exportItem, which will transferFrom the contract to the caller
    function exportItem(address avatar, uint256 tokenId) public {
        require(tokenOwners[avatar][tokenId] == msg.sender, "You are not the owner of this item");
        IERC1155(avatar).safeTransferFrom(address(this), tokenOwners[avatar][tokenId], tokenId, 1, "");
        delete tokenOwners[avatar][tokenId];
        emit ItemExported(avatar, tokenId);
    }
}