// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LW3Punks is ERC721Enumerable, Ownable {
	using Strings for uint256;
	/**
	* @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
	* token will be the concatenation of the `baseURI` and the `tokenId`.
	*/
	string _baseTokenURI;

	uint256 public _price = 0.005 ether;

	bool public _paused;

	uint256 public maxTokenIds = 10;

	uint256 public tokenIds;

	modifier onlyWhenNotPaused {
		require(!_paused, "Contract currently paused");
		_;
	}

	/**
	 * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
	 * name in our case is `LW3Punks` and symbol is `LW3P`.
	 * Constructor for LW3P takes in the baseURI to set _baseTokenURI for the collection.
	*/
	constructor (string memory baseURI) ERC721("LW3Punks", "LW3P") Ownable(msg.sender) {
		_baseTokenURI = baseURI;
	}

	/**
	* @dev mint allows an user to mint 1 NFT per transaction.
	*/
	function mint() public payable onlyWhenNotPaused {
		require(tokenIds < maxTokenIds, "Exceed maximum LW3Punks supply");
		require(msg.value >= _price, "Ether sent is not correct");
		tokenIds += 1;
		_safeMint(msg.sender, tokenIds);
	}

	/**
	 * @dev _baseURI overrides the Openzeppelin's ERC721 implementation which by default
	 * returned an empty string for the baseURI
	*/
	function _baseURI() internal view virtual override returns (string memory) {
		return _baseTokenURI;
	}

	/**
	 * @dev tokenURI overrides the Openzeppelin's ERC721 implementation for tokenURI function
	 * This function returns the URI from where we can extract the metadata for a given tokenId
	*/
	function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
		require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");

		string memory baseURI = _baseURI();
		return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
	}

	/**
	 * @dev setPaused makes the contract paused or unpaused
	*/
	function setPaused(bool val) public onlyOwner {
		_paused = val;
	}

	/**
	 * @dev withdraw sends all the ether in the contract
	 * to the owner of the contract
	*/
	function withdraw() public onlyOwner  {
		address _owner = owner();
		uint256 amount = address(this).balance;
		(bool sent, ) =  _owner.call{value: amount}("");
		require(sent, "Failed to send Ether");
	}
	receive() external payable {}

	fallback() external payable {}
}
