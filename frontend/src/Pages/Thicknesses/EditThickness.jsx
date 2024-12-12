import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/Thicknesses/ThicknessForm.scss';

const EditThickness = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchThickness();
  }, []);

  const fetchThickness = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_ROUTE}/thicknesses/${id}`);
      const { name, code } = response.data;
      setName(name);
      setCode(code);
    } catch (error) {
      console.error('Error fetching thickness:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_ROUTE}/thicknesses/${id}`, { name, code });
      navigate('/manage/thicknessesList');
    } catch (error) {
      console.error('Error updating thickness:', error);
    }
  };

  return (
    <div className="thickness-form">
      <h1>Edit Thickness</h1>
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
        <button type="submit">Update Thickness</button>
      </form>
    </div>
  );
};

export default EditThickness;
