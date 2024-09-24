import React, { useState } from 'react';
import axios from 'axios';

function AdminDatabase() {
  const [dbDetails, setDbDetails] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    port: 3305 // Default port, can be changed if needed
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDbDetails({ ...dbDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dbDetails.host || !dbDetails.user || !dbDetails.password || !dbDetails.database) {
      alert('Please fill out all fields.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      // Send the database details to the Flask backend
      const response = await axios.post('http://localhost:5000/create-tables', dbDetails, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error connecting to the database:', error.response?.data?.error || error.message);
      setMessage('Failed to connect to the database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Admin Database</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="host"
          placeholder="Host (e.g., localhost or 127.0.0.1)"
          value={dbDetails.host}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="user"
          placeholder="User"
          value={dbDetails.user}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={dbDetails.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="database"
          placeholder="Database"
          value={dbDetails.database}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="port"
          placeholder="Port"
          value={dbDetails.port}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminDatabase;
