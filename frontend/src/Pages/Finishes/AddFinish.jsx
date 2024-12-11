import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/Finishes/FinishForm.scss';

const AddFinish = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_ROUTE}/finishes/add`, { name, code });
      navigate('/manage/finishesList');
    } catch (error) {
      console.error('Error adding finish:', error);
    }
  };

  return (
    <div className="finish-form">
      <h1>Add Finish</h1>
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
        <button type="submit">Add Finish</button>
      </form>
    </div>
  );
};

export default AddFinish;
