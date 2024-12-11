import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/Finishes/FinishForm.scss';

const EditFinish = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFinish();
  }, []);

  const fetchFinish = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_ROUTE}/finishes/${id}`);
      const { name, code } = response.data;
      setName(name);
      setCode(code);
    } catch (error) {
      console.error('Error fetching finish:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_ROUTE}/finishes/${id}`, { name, code });
      navigate('/manage/finishesList');
    } catch (error) {
      console.error('Error updating finish:', error);
    }
  };

  return (
    <div className="finish-form">
      <h1>Edit Finish</h1>
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
        <button type="submit">Update Finish</button>
      </form>
    </div>
  );
};

export default EditFinish;
