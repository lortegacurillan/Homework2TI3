import { useState, useEffect } from 'react';
import Web3 from 'web3';

export function useMetamask() {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum.on('accountsChanged', (accounts) => {
        setConnectedAccount(accounts.length > 0 ? accounts[0] : null);
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const connectMetamask = async () => {
    if (typeof window.ethereum === 'undefined') {
      console.error('Please install MetaMask!');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await (web3 ? web3.eth.getAccounts() : []);
      setConnectedAccount(accounts.length > 0 ? accounts[0] : null);
    } catch (error) {
      console.error('Failed to connect MetaMask', error);
    }
  };

  return { connectedAccount, connectMetamask };
}