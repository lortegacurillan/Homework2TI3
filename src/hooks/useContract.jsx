import ApartmentRental from '../../build/contracts/ApartmentRental.json';
import Web3 from 'web3';

export const useContract = async () => {
  try {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = ApartmentRental.networks[networkId];
    const instance = new web3.eth.Contract(
      ApartmentRental.abi,
      deployedNetwork && deployedNetwork.address,
    );
    return instance;
  } catch (error) {
    console.error('Error loading contract: ', error);
  }
}

