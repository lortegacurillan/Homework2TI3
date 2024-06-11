import ApartmentRental from '../../build/contracts/ApartmentRental.json';
<<<<<<< HEAD
import { useState, useEffect } from 'react';
import Web3 from 'web3';

export function useContract() {
    const [contract, setContract] = useState(null);
    
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        const networkId = window.ethereum.networkVersion;
        const contractAddress = ApartmentRental.networks[networkId].address;
        const contractInstance = new web3.eth.Contract(ApartmentRental.abi, contractAddress);
        setContract(contractInstance);
        }
    }, []);
    
    return [ contract, setContract];
    }
=======
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

>>>>>>> 958edbeee32ef46f57074e3d15b1fc6c7c1f450a
