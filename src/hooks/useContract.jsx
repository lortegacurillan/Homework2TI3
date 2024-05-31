import ApartmentRental from '../../build/contracts/ApartmentRental.json';
import contract from '@truffle/contract';

export const useContract = async () => {
    const myContract = contract(ApartmentRental);
    myContract.setProvider(window.ethereum);

    try {
        const contractDeployed = await myContract.deployed();
        return contractDeployed;
    } catch (error) {
        console.error('Failed to connect MetaMask', error);
        return null;
    }
};
