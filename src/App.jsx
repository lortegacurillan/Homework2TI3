import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMetamask } from './hooks/useMetamask';
import { useContract } from './hooks/useContract';
const DepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [account, setAccount] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [contract, setContract] = useState(null);
    const {connectedAccount, connectMetamask} = useMetamask();
    const useinit= async () => {
     const contractload = await useContract();
     if (contractload) {
       setContract(contractload);
     }
    };
    useEffect(() => {
      useinit();
    }, []);
    useEffect(() => {
        fetch('/utils/db.json')
            .then(response => response.json())
            .then(data => setDepartments(data))
            .catch(error => console.error('Error fetching data: ', error));

    }, []);

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
      }
    };

    return (
      <div>
        <div>
          <button onClick={connectMetamask}className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Conectar con Metamask</button>
          {connectedAccount && <p>Conectado con la cuenta: {connectedAccount}</p>}
          </div>
          <div className="flex flex-wrap justify-center items-center">
            {departments.map((dept) => (
                <div key={dept.id} className="max-w-sm rounded overflow-hidden shadow-lg m-4">
                    <img className="w-full" src="https://climalit.es/blog/wp-content/uploads/2018/05/edificios-eficientes-scaled.jpg" alt="Imagen del departamento" />
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{dept.nombre}</div>
                        <p className="text-gray-700 text-base">
                            Dirección: {dept.direccion}<br/>
                            Precio: ${dept.precio}<br/>
                            Capacidad: {dept.capacidad} personas
                        </p>
                        <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                        <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                        <button onClick={() => handleReserve(dept)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Reservar</button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
}

export default DepartmentsPage;
