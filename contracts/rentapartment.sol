// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ApartmentRental is ERC721 {
    uint256 private _currentTokenId;

    struct Apartment {
        uint256 rentAmount;
        uint256 securityDeposit;
        uint256 leaseStart;
        uint256 leaseEnd;
        address tenant;
        bool exists;
    }

    mapping(uint256 => Apartment) private _apartments;

    address public landlord;

    modifier onlyLandlord() {
        require(msg.sender == landlord, "Only the landlord can perform this action.");
        _;
    }

    modifier onlyTenant(uint256 tokenId) {
        require(_apartments[tokenId].tenant == msg.sender, "Only the tenant can perform this action.");
        _;
    }

    modifier onlyWhenRented(uint256 tokenId) {
        require(_apartments[tokenId].tenant != address(0), "The apartment is not currently rented.");
        _;
    }

    constructor() ERC721("ApartmentRentalToken", "ART") {
        landlord = msg.sender;
        _currentTokenId = 0;
    }

function safeMintApartment(
    address to,
    uint256 rentAmount,
    uint256 securityDeposit,
    uint256 leaseStart,
    uint256 leaseEnd
) public {
    require(leaseEnd > leaseStart, "Lease end time must be after lease start time");

    uint256 tokenId = _currentTokenId++;
    _apartments[tokenId] = Apartment({
        rentAmount: rentAmount,
        securityDeposit: securityDeposit,
        leaseStart: leaseStart,
        leaseEnd: leaseEnd,
        tenant: address(0),
        exists: true
    });

    _safeMint(to, tokenId);
    return tokenId;
}


    function rentApartment(uint256 tokenId) public payable {
        require(_apartments[tokenId].exists, "Apartment does not exist");
        require(_apartments[tokenId].tenant == address(0), "Apartment is already rented");
        require(msg.value == _apartments[tokenId].securityDeposit, "Incorrect security deposit amount");

        _apartments[tokenId].tenant = msg.sender;
    }

    function payRent(uint256 tokenId) public payable onlyTenant(tokenId) onlyWhenRented(tokenId) {
        require(msg.value == _apartments[tokenId].rentAmount, "Incorrect rent amount");
        require(block.timestamp <= _apartments[tokenId].leaseEnd, "Lease has ended");

        payable(landlord).transfer(msg.value);
    }

    function endLease(uint256 tokenId) public onlyLandlord onlyWhenRented(tokenId) {
        require(block.timestamp >= _apartments[tokenId].leaseEnd, "Lease period has not ended yet");

        payable(_apartments[tokenId].tenant).transfer(_apartments[tokenId].securityDeposit);
        _apartments[tokenId].tenant = address(0);
    }

    function evictTenant(uint256 tokenId) public onlyLandlord onlyWhenRented(tokenId) {
        payable(_apartments[tokenId].tenant).transfer(_apartments[tokenId].securityDeposit);
        _apartments[tokenId].tenant = address(0);
    }

    function terminateLeaseEarly(uint256 tokenId) public onlyTenant(tokenId) onlyWhenRented(tokenId) {
        require(block.timestamp < _apartments[tokenId].leaseEnd, "Lease period has already ended");

        payable(_apartments[tokenId].tenant).transfer(_apartments[tokenId].securityDeposit);
        _apartments[tokenId].tenant = address(0);
    }

    // View functions to get apartment information
    function getRentAmount(uint256 tokenId) public view returns (uint256) {
        require(_apartments[tokenId].exists, "Token does not exist");
        return _apartments[tokenId].rentAmount;
    }

    function getSecurityDeposit(uint256 tokenId) public view returns (uint256) {
        require(_apartments[tokenId].exists, "Token does not exist");
        return _apartments[tokenId].securityDeposit;
    }

    function getLeaseStart(uint256 tokenId) public view returns (uint256) {
        require(_apartments[tokenId].exists, "Token does not exist");
        return _apartments[tokenId].leaseStart;
    }

    function getLeaseEnd(uint256 tokenId) public view returns (uint256) {
        require(_apartments[tokenId].exists, "Token does not exist");
        return _apartments[tokenId].leaseEnd;
    }

    function getTenant(uint256 tokenId) public view returns (address) {
        require(_apartments[tokenId].exists, "Token does not exist");
        return _apartments[tokenId].tenant;
    }
}
