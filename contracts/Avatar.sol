// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Avatar is ERC1155, Ownable {
    string public name;
    string public symbol;
    uint256 private _nextTokenId;
    uint256 private maxMintLimit = 1; 
    string private baseURI;

    // Mapping for individual token URIs
    mapping(uint256 => string) private _tokenURIs;
    bool private _useIndividualURIs;

    error MintLimitExceeded(address owner, uint256 currentBalance);
    error UnauthorizedAccess(address caller);

    // Custom event for tracking URI updates
    event TokenURIUpdated(uint256 indexed tokenId, string oldURI, string newURI);

    constructor() ERC1155("") Ownable(msg.sender) {
        name = "Avatar";
        symbol = "AVATAR";
        baseURI = ""; // initialize empty URI, will set after deployment
        _useIndividualURIs = false; // Default to baseURI
    }

    // Modified setTokenURI to check token ownership
    function setTokenURI(uint256 tokenId, string memory newuri) public {
        require(bytes(newuri).length > 0, "URI cannot be empty");
        require(_useIndividualURIs, "Individual URIs not enabled");
        require(tokenId < _nextTokenId, "Token does not exist");
        
        // Allow both token owner and contract owner to update
        require(
            balanceOf(msg.sender, tokenId) > 0 || msg.sender == owner(),
            "Caller must own token or be contract owner"
        );

        string memory oldURI = _tokenURIs[tokenId];
        _tokenURIs[tokenId] = newuri;
        
        emit TokenURIUpdated(tokenId, oldURI, newuri);
        emit URI(newuri, tokenId);
    }

    // Toggle between using individual URIs or baseURI
    function toggleIndividualURIs(bool useIndividual) public onlyOwner {
        _useIndividualURIs = useIndividual;
    }

    // Check if using individual URIs
    function usingIndividualURIs() public view returns (bool) {
        return _useIndividualURIs;
    }

    // Original setURI function now renamed to setBaseURI for clarity
    function setBaseURI(string memory newuri) public onlyOwner {
        baseURI = newuri;
        emit URI(newuri, 0);
    }

    // URI function to handle individual tokenId URIs
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        if (_useIndividualURIs && bytes(_tokenURIs[tokenId]).length > 0) {
            return _tokenURIs[tokenId];
        }
        return baseURI;
    }

    // Only owner can update the baseURI
    function setURI(string memory newuri) public onlyOwner {
        baseURI = newuri;
        emit URI(newuri, 0);
    }
 
    // Contract owner can mint without restrictions
    function ownerMint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId, 1, "");
        return tokenId;
    }

    // Public mint function with restrictions
    function mint() public returns (uint256) {
        if (msg.sender != owner()) {
            uint256 currentBalance = 0;
            for(uint256 i = 0; i < _nextTokenId; i++) {
                currentBalance += balanceOf(msg.sender, i);
            }
            
            // Check if mint limit is exceeded for non-owners
            if(currentBalance >= maxMintLimit) {
                revert MintLimitExceeded(msg.sender, currentBalance);
            }
        }
        
        // Else, proceed to mint the token
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId, 1, "");
        return tokenId;
    }

    // Only contract owner can update mint limit
    function setMaxMintLimit(uint256 newLimit) external onlyOwner {
        maxMintLimit = newLimit;
    }

    // View function to check current mint limit
    function getMintLimit() public view returns (uint256) {
        return maxMintLimit;
    }
}