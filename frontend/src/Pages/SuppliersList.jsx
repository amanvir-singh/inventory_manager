import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/SuppliersList.scss';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  return (
    <div className="supplier-list">
      <h1>Suppliers</h1>
      <Link to="/add-supplier" className="add-button">Add Supplier</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td>{supplier.name}</td>
              <td>{supplier.code}</td>
              <td>
                <Link to={`/edit-supplier/${supplier._id}`} className="edit-button">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierList;
