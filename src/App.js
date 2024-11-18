import React from 'react';
import { Routes, Route } from "react-router-dom"
import Sidebar from './components/Sidebar';
import Watchlist from './components/Watchlist';
import Wishlist from './components/Wishlist';
import BucketList from './components/Bucketlist';
import JobsApplied from './components/JobsApplied';
import Freesites from './components/Freesites';
import './App.css';

const App = () => {
  return (
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/bucketlist" element={<BucketList />} />
            <Route path="/jobs-applied" element={<JobsApplied />} />
            <Route path='free-sites' element={<Freesites />} />
            <Route exact path="/" element={<Watchlist />} /> {/* Default page */}
          </Routes>
        </div>
      </div>
  );
};

export default App;
