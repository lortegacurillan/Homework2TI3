const ApartmentRentalLibrary = artifacts.require("ApartmentRentalLibrary");
module.exports = function(deployer) {
  deployer.deploy(ApartmentRentalLibrary);
};