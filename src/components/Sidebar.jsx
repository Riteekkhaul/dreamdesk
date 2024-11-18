import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css'; // We'll create a simple CSS for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to="/watchlist">Watchlist</Link>
        </li>
        <li>
          <Link to="/wishlist">Wishlist</Link>
        </li>
        <li>
          <Link to="/bucketlist">Bucket List</Link>
        </li>
        <li>
          <Link to="/jobs-applied">Jobs Applied</Link>
        </li>
        <li>
          <Link to="/free-sites">Free Sites</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
