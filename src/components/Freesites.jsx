import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './freesites.css';

const API_BASE_URL = 'http://localhost:5000/api/sites';

const Freesites = () => {
  const [sites, setSites] = useState([]);
  const [input, setInput] = useState({ name: '', link: '' });
  const [editId, setEditId] = useState(null);

  // Fetch sites from the API on component mount
  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setSites(response.data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const handleAddOrUpdateSite = async () => {
    if (input.name.trim() === '' || input.link.trim() === '') {
      alert('Please fill in both fields.');
      return;
    }

    try {
      if (editId) {
        // Update site
        await axios.put(`${API_BASE_URL}/${editId}`, input);
        setEditId(null);
      } else {
        // Add new site
        await axios.post(API_BASE_URL, input);
      }
      setInput({ name: '', link: '' });
      fetchSites(); // Refresh the list
    } catch (error) {
      console.error('Error saving site:', error);
    }
  };

  const handleEditSite = (site) => {
    setInput({ name: site.name, link: site.link });
    setEditId(site._id);
  };

  const handleDeleteSite = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchSites(); // Refresh the list
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  return (
    <div className="freesites-container">
      <h1>Free Sites</h1>

      <div className="freesites-input-section">
        <input
          type="text"
          placeholder="Site Name"
          value={input.name}
          onChange={(e) => setInput({ ...input, name: e.target.value })}
        />
        <input
          type="url"
          placeholder="Site Link"
          value={input.link}
          onChange={(e) => setInput({ ...input, link: e.target.value })}
        />
        <button onClick={handleAddOrUpdateSite}>
          {editId ? 'Update' : 'Add'}
        </button>
      </div>

      <div className="sites-list">
        {sites.map((site) => (
          <div key={site.id} className="site-item">
            <button
              className="site-button"
              onClick={() => window.open(site.link, '_blank')}
            >
              {site.name}
            </button>
            <div className="site-actions">
              <button onClick={() => handleEditSite(site)}>Edit</button>
              <button onClick={() => handleDeleteSite(site._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Freesites;
