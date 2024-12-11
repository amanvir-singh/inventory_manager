import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/Suppliers/SupplierForm.scss';

const EditSupplier = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSupplier();
  }, []);

  const fetchSupplier = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_ROUTE}/suppliers/${id}`);
      const { name, code } = response.data;
      setName(name);
      setCode(code);
    } catch (error) {
      console.error('Error fetching supplier:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_ROUTE}/suppliers/${id}`, { name, code });
      navigate('/manage/suppliersList');
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  return (
    <div className="supplier-form">
      <h1>Edit Supplier</h1>
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
        <button type="submit">Update Supplier</button>
      </form>
    </div>
  );
};

export default EditSupplier;
