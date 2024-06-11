import ApartmentRental from '../../build/contracts/ApartmentRental.json';
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