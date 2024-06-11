// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ApartmentRentalLibrary is ERC721 {
    // Estructura para almacenar la información del arrendamiento
    struct RentalInfo {
        uint256 rentAmount;
        uint256 securityDeposit;
        uint256 startTime;
        uint256 endTime;
        address tenant;
    }

    // Mapping de tokenId a información de arrendamiento
    mapping(uint256 => RentalInfo) private rentals;

    // Evento para depuración
    event RentalCreated(uint256 tokenId, uint256 rentAmount, uint256 securityDeposit, uint256 startTime, uint256 endTime, address tenant);

    constructor() ERC721("ApartmentRentalToken", "ART") {}

    function safeMintApartment(
        address to,
        uint256 tokenId,
        uint256 rentAmount,
        uint256 securityDeposit,
        uint256 startTime,
        uint256 endTime,
        address tenant
    ) public {
        require(rentAmount > 0, "Error: Invalid Rent Amount");
        require(securityDeposit > 0, "Error: Invalid Security Deposit");
        require(endTime > startTime, "Error: Invalid Times");

        // Guardar la información del arrendamiento en el mapping
        rentals[tokenId] = RentalInfo({
            rentAmount: rentAmount,
            securityDeposit: securityDeposit,
            startTime: startTime,
            endTime: endTime,
            tenant: tenant
        });

        _safeMint(to, tokenId);

        // Emitir evento
        emit RentalCreated(tokenId, rentAmount, securityDeposit, startTime, endTime, tenant);
    }

    // Funciones de vista para obtener la información del arrendamiento
    function getRentAmount(uint256 tokenId) public view returns (uint256) {
        return rentals[tokenId].rentAmount;
    }

    function getSecurityDeposit(uint256 tokenId) public view returns (uint256) {
        return rentals[tokenId].securityDeposit;
    }

    function getRentalStart(uint256 tokenId) public view returns (uint256) {
        return rentals[tokenId].startTime;
    }

    function getRentalEnd(uint256 tokenId) public view returns (uint256) {
        return rentals[tokenId].endTime;
    }

    function getTenant(uint256 tokenId) public view returns (address) {
        return rentals[tokenId].tenant;
    }
}
