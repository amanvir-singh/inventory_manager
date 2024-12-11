import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/Suppliers/SupplierForm.scss';

const AddSupplier = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_ROUTE}/suppliers/add`, { name, code });
      navigate('/manage/suppliersList');
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  return (
    <div className="supplier-form">
      <h1>Add Supplier</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="code">Code:</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Supplier</button>
      </form>
    </div>
  );
};

export default AddSupplier;
