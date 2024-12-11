import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../css/Finishes/FinishesList.scss";
import { useNavigate } from "react-router-dom";

const FinishesList = () => {
  const [finishes, setFinishes] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [finishToDelete, setFinishToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFinishes();
  }, []);

  const fetchFinishes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_ROUTE}/finishes`);
      setFinishes(response.data);
    } catch (error) {
      console.error("Error fetching finishes:", error);
    }
  };

  const handleDeleteClick = (finish) => {
    setFinishToDelete(finish);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_ROUTE}/finishes/${finishToDelete._id}`
      );
      setShowDeleteConfirm(false);
      fetchFinishes(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting finish:", error);
    }
  };

  return (
    <div className="finishes-list">
      <h1>Finishes</h1>
      <Link to="/add-finish" className="add-button">
        Add Finish
      </Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {finishes.map((finish) => (
            <tr key={finish._id}>
              <td>{finish.name}</td>
              <td>{finish.code}</td>
              <td>
                <button
                  onClick={() => navigate(`/edit-finish/${finish._id}`)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(finish)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-content">
            <p>Do you really want to delete {finishToDelete.name}?</p>
            <button
              className="confirm-delete-btn"
              onClick={handleDeleteConfirm}
            >
              Yes, Delete
            </button>
            <button
              className="cancel-delete-btn"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinishesList;