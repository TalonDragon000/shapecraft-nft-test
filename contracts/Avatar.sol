// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Avatar is ERC1155, Ownable {
    string public name = "Avatar";
    string public symbol = "AVATAR";
    uint256 private _nextTokenId;
    uint256 private maxMintLimit = 1;
    string private baseURI;
    bool private _useIndividualURIs = true;

    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256) private _mintedTokens;

    error MintLimitExceeded(address owner, uint256 currentBalance);

    event TokenURIUpdated(uint256 indexed tokenId, string oldURI, string newURI);

    constructor() ERC1155("") Ownable(msg.sender) {}

    function setTokenURI(uint256 tokenId, string memory newuri) external {
        require(bytes(newuri).length > 0, "URI cannot be empty");
        require(_useIndividualURIs, "Individual URIs not enabled");
        require(tokenId < _nextTokenId, "Token does not exist");
        require(balanceOf(msg.sender, tokenId) > 0, "Caller must own token");

        string memory oldURI = _tokenURIs[tokenId];
        _tokenURIs[tokenId] = newuri;

        emit TokenURIUpdated(tokenId, oldURI, newuri);
        emit URI(newuri, tokenId);
    }

    function toggleIndividualURIs(bool useIndividual) external onlyOwner {
        _useIndividualURIs = useIndividual;
    }

    function usingIndividualURIs() external view returns (bool) {
        return _useIndividualURIs;
    }

    function setBaseURI(string memory newuri) external onlyOwner {
        baseURI = newuri;
        emit URI(newuri, 0);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (_useIndividualURIs && bytes(_tokenURIs[tokenId]).length > 0) ? _tokenURIs[tokenId] : baseURI;
    }

    function ownerMint(address to, string memory _TokenURI) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId, 1, "");
        if (bytes(_TokenURI).length > 0) {
            _tokenURIs[tokenId] = _TokenURI;
        }
        return tokenId;
    }

    function mint(string memory _TokenURI) external returns (uint256) {
        require(_mintedTokens[msg.sender] < maxMintLimit, "Mint limit exceeded");

        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId, 1, "");
        _mintedTokens[msg.sender]++;

        if (bytes(_TokenURI).length > 0) {
            _tokenURIs[tokenId] = _TokenURI;
        }
        return tokenId;
    }

    function setMaxMintLimit(uint256 newLimit) external onlyOwner {
        maxMintLimit = newLimit;
    }

    function getMintLimit() external view returns (uint256) {
        return maxMintLimit;
    }
}
