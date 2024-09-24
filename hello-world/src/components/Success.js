import React from 'react';
import { useLocation } from 'react-router-dom';
import './Success.css'; // Import the CSS file

function Success() {
  const location = useLocation();
  const message = location.state?.message || 'Form submitted successfully.';

  return (
    <div className="success-container">
      <div className="stars"></div> {/* Container for animated stars */}
      <div className="success-message">
        <h1>{message}</h1>
      </div>
    </div>
  );
}

export default Success;
