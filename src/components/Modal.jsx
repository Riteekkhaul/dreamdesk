import React, { useState } from 'react';
import './modal.css'; // Add styling for your modal

const Modal = ({ secretCode, onVerified }) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (inputCode === secretCode) {
      onVerified(); // Trigger the callback when the user is verified
    } else {
      setError('Incorrect code. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Enter Secret Code</h2>
        <input
          type="password"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Enter the secret code"
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleVerify}>Verify</button>
      </div>
    </div>
  );
};

export default Modal;
