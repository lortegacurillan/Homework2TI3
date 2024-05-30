const rentapartment = artifacts.require("ApartmentRental");
module.exports = function(deployer) {
  deployer.deploy(rentapartment);
};