import React, { Component } from 'react';
import './Welcome.css';

class Welcome extends Component {
  render() {
    return (
      <div className="welcome-container">
        <h1>Welcome to this Website</h1>
        <h2>Select Your Option</h2>
        <div className="button-group">
          <button className="option-button">Minors</button>
          <button className="option-button">Honors</button>
        </div>
      </div>
    );
  }
}

export default Welcome;
