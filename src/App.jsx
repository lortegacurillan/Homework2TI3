import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Web3 from 'web3';
import ApartmentRental from '../build/contracts/ApartmentRental.json';
import { useMetamask } from './hooks/useMetamask';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { connectedAccount, connectMetamask } = useMetamask();
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);

<<<<<<< HEAD
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = ApartmentRental.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            ApartmentRental.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);
        } catch (error) {
          console.error('Error connecting to Metamask', error);
        }
      } else {
        console.error('Metamask not found');
=======
    const handleReserve = async (dept) => {
      if(!connectedAccount) {
          console.log('Conéctese con Metamask para realizar la reserva');
          connectMetamask();
          return;
      }
      if(!contract) {
          console.log('No se ha podido cargar el contrato');
          return;
      }
      const start = startDate.getTime();
      const end = endDate.getTime();
      const price = dept.precio;
      const securityDeposit = dept.precio * 0.1;
      const account = connectedAccount;
      const id = dept.id;
      try {
        // console.log(contract.methods);
          const id = await contract.methods.safeMintApartment(connectedAccount,price,securityDeposit, start, end, {from: account});
          await contract.methods.rentApartment();
          console.log('Reserva realizada con éxito');
      } catch (error) {
          console.error('Error al realizar la reserva: ', error);
>>>>>>> 958edbeee32ef46f57074e3d15b1fc6c7c1f450a
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    fetch('/utils/db.json')
      .then((response) => response.json())
      .then((data) => setDepartments(data))
      .catch((error) => console.error('Error fetching data: ', error));
  }, []);

  const handleReserve = async (dept) => {
    if (!connectedAccount) {
      console.log('Conéctese con Metamask para realizar la reserva');
      connectMetamask();
      return;
    }
    if (!contract) {
      console.log('No se ha podido cargar el contrato');
      return;
    }
    const start = Math.floor(startDate.getTime() / 1000); // Convertir a timestamp Unix
    const end = Math.floor(endDate.getTime() / 1000); // Convertir a timestamp Unix
    const price = dept.precio;
    const account = connectedAccount;
    const id = dept.id;

    try {
      await contract.methods
        .safeMintApartment(
          account,
          id,
          price,
          price / 2, // Suponiendo que el depósito de seguridad es la mitad del precio de la renta
          start,
          end,
          account
        )
        .send({ from: account });
      console.log('Reserva realizada con éxito');
    } catch (error) {
      console.error('Error al realizar la reserva: ', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="mb-8">
        <button
          onClick={connectMetamask}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Conectar con Metamask
        </button>
        {connectedAccount && (
          <p className="mt-2">Conectado con la cuenta: {connectedAccount}</p>
        )}
      </div>
      <div className="flex flex-wrap justify-center items-center">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white max-w-xs rounded-lg overflow-hidden shadow-lg m-4"
          >
            <img
              className="w-full h-48 object-cover"
              src={dept.imagen}
              alt="Imagen del departamento"
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{dept.nombre}</div>
              <p className="text-gray-700 text-base">
                Dirección: {dept.direccion}
                <br />
                Precio: ${dept.precio}
                <br />
                Capacidad: {dept.capacidad} personas
              </p>
              <div className="mt-4">
                <DatePicker
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
                <DatePicker
                  className="w-full border border-gray-300 rounded px-2 py-1 mt-2"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </div>
              <button
                onClick={() => handleReserve(dept)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
              >
                Reservar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsPage;
