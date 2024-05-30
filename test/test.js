const rentapartment = artifacts.require("ApartmentRental");
contract ("ApartmentRental", async accounts => {
    let instance;
    beforeEach(async () => {
        instance = await rentapartment.new();
    });
    it("should have the correct name", async () => {
        let name = await instance.name();
        assert.equal(name, "ApartmentRentalToken", "The name is not correct");
    });
    it("should have the correct symbol", async () => {
        let symbol = await instance.symbol();
        assert.equal(symbol, "ART", "The symbol is not correct");
    });
    it("should mint a aparment", async () => {
        const toAddress = accounts[1];
        const rentAmmount = 2;
        const securityDeposit = 1;
        const leaseStart = 1717038981;
        const leaseEnd = 1719717381;

        const receipt= await instance.safeMintApartment(toAddress, rentAmmount, securityDeposit, leaseStart, leaseEnd);
        const tokenId = receipt.logs[0].args.tokenId.toNumber();

        const getRentAmmount = await instance.getRentAmount(tokenId);
        const getSecurityDeposit = await instance.getSecurityDeposit(tokenId);
        const getLeaseStart = await instance.getLeaseStart(tokenId);
        const getLeaseEnd = await instance.getLeaseEnd(tokenId);

        assert.equal(getRentAmmount, rentAmmount, "The rent ammount is not correct");
        assert.equal(getSecurityDeposit, securityDeposit, "The security deposit is not correct");
        assert.equal(getLeaseStart, leaseStart, "The lease start is not correct");
        assert.equal(getLeaseEnd, leaseEnd, "The lease end is not correct");
    })
})



