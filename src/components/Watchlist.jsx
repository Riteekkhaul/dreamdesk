import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './watchlist.css';

const Watchlist = () => {
  const [activeTab, setActiveTab] = useState('Movies');
  const [items, setItems] = useState([]);
  const [input, setInput] = useState({ name: '', releaseDate: '' });
  const [editId, setEditId] = useState(null); // To track the item ID for editing

  // Fetch all items from the API when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`https://dreamdeskserver.onrender.com/api/watchlist`);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setInput({ name: '', releaseDate: '' });
    setEditId(null);
  };

  const handleAddItem = async () => {
    if (input.name.trim() === '' || input.releaseDate.trim() === '') return;

    try {
      if (editId !== null) {
        // Update item
        const response = await axios.put(`https://dreamdeskserver.onrender.com/api/watchlist/${editId}`, { ...input, category: activeTab });
        setItems((prevItems) =>
          prevItems.map((item) => (item._id === editId ? response.data : item))
        );
        setEditId(null);
      } else {
        // Add new item
        const response = await axios.post('https://dreamdeskserver.onrender.com/api/watchlist', { ...input, category: activeTab });
        setItems([...items, response.data]);
      }

      setInput({ name: '', releaseDate: '' });
    } catch (error) {
      console.error('Error adding/updating item:', error);
    }
  };

  const handleEditItem = (id) => {
    const itemToEdit = items.find((item) => item._id === id);
    if (itemToEdit) {
      setInput({ name: itemToEdit.name, releaseDate: itemToEdit.releaseDate });
      setEditId(id); // Track the specific item ID for editing
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`https://dreamdeskserver.onrender.com/api/watchlist/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Filter items based on the active tab's category
  const filteredItems = items.filter((item) => item.category === activeTab);

  // Sort items by releaseDate in descending order before displaying them
  const sortedItems = [...filteredItems].sort(
    (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
  );

  return (
    <div className="watchlist-container">
      <h1>My Watchlist</h1>
      <div className="tabs">
        {['Movies', 'Web-series', 'Anime'].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <h2>{activeTab}</h2>
        <div className="input-section">
          <input
            type="text"
            name="name"
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            placeholder={`Add a ${activeTab}`}
          />
          <input
            type="date"
            name="releaseDate"
            value={input.releaseDate}
            onChange={(e) => setInput({ ...input, releaseDate: e.target.value })}
          />
          <button onClick={handleAddItem}>{editId !== null ? 'Update' : 'Add'}</button>
        </div>
        <ul className="item-list">
          {sortedItems.map((item) => (
            <li key={item._id} className="item">
            <div className="name">
              <strong>Name:</strong> {item.name}
            </div>
            <div className="right-section">
              <div className="release-date">
                <strong>Release Date:</strong> {item.releaseDate.split('T')[0]}
              </div>
              <div className="actions">
                <button onClick={() => handleEditItem(item._id)}>Edit</button>
                <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
              </div>
            </div>
          </li>          
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Watchlist;
