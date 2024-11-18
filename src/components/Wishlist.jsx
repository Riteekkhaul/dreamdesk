import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [inputData, setInputData] = useState({
    name: '',
    amount: '',
    deadline: '',
    status: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null); // To track the ID of the item being edited

  // Fetch wishlist items from the API on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/wishlist');
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);

  const handleVerification = () => {
    setIsVerified(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleAddOrUpdateItem = async () => {
    if (!inputData.name || !inputData.amount || !inputData.deadline || !inputData.status) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      if (editIndex !== null) {
        // Update item
        const response = await axios.put(`http://localhost:5000/api/wishlist/${editId}`, inputData);
        const updatedWishlist = [...wishlist];
        updatedWishlist[editIndex] = response.data;

        setWishlist(updatedWishlist);
        setEditIndex(null);
        setEditId(null);
      } else {
        // Add new item
        const response = await axios.post('http://localhost:5000/api/wishlist', inputData);
        setWishlist([...wishlist, response.data]);
      }

      setInputData({ name: '', amount: '', deadline: '', status: '' });
    } catch (error) {
      console.error('Error adding/updating item:', error);
    }
  };

  const handleEditItem = (index) => {
    setInputData(wishlist[index]);
    setEditIndex(index);
    setEditId(wishlist[index]._id); // Assuming MongoDB provides an `_id` field
  };

  const handleDeleteItem = async (id, index) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${id}`);
      const updatedWishlist = wishlist.filter((_, i) => i !== index);
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      {!isVerified ? (
        <Modal secretCode="Ultron@1419" onVerified={handleVerification} />
      ) : (
        <div className="wishlist-container">
          <h1>My Wishlist</h1>

          <div className="input-section">
            <input
              type="text"
              name="name"
              value={inputData.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <input
              type="number"
              name="amount"
              value={inputData.amount}
              onChange={handleInputChange}
              placeholder="Amount"
            />
            <input
              type="date"
              name="deadline"
              value={inputData.deadline}
              onChange={handleInputChange}
              placeholder="Deadline"
            />
            <select
              name="status"
              value={inputData.status}
              onChange={handleInputChange}
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <button onClick={handleAddOrUpdateItem}>
              {editIndex !== null ? 'Update' : 'Add'}
            </button>
          </div>

          <ul className="wishlist">
            {wishlist.map((item, index) => (
              <li key={item._id} className="wishlist-item">
                <div>
                  <strong>Name:</strong> {item.name}
                </div>
                <div>
                  <strong>Amount:</strong> ${item.amount}
                </div>
                <div>
                  <strong>Deadline:</strong> {item.deadline.split('T')[0]}
                </div>
                <div>
                  <strong>Status:</strong> {item.status}
                </div>
                <div className="actions">
                  <button onClick={() => handleEditItem(index)}>Edit</button>
                  <button onClick={() => handleDeleteItem(item._id, index)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
