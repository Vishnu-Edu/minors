// DatabaseTables.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DatabaseTables.css';

function DatabaseTables() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/admin/tables');
        setTables(response.data);
      } catch (error) {
        setError('Error fetching tables.');
        console.error('Error fetching tables:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleManageCgpaRows = async () => {
    try {
      await axios.post('/api/admin/manage-cgpa-rows');
      alert('CGPA rows managed successfully.');
    } catch (error) {
      console.error('Error managing CGPA rows:', error);
      alert('Error managing CGPA rows.');
    }
  };

  const handleAllotBranches = async () => {
    try {
      await axios.post('/api/admin/allot-branches');
      alert('Branches allotted successfully.');
    } catch (error) {
      console.error('Error allotting branches:', error);
      alert('Error allotting branches.');
    }
  };

  return (
    <div className="database-tables-container">
      <h1>Database Tables</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p className="error">{error}</p>}
          {tables.length > 0 ? (
            <ul>
              {tables.map((table) => (
                <li key={table}>{table}</li>
              ))}
            </ul>
          ) : (
            <p>No tables found.</p>
          )}
          <button onClick={handleManageCgpaRows}>Manage CGPA Rows</button>
          <button onClick={handleAllotBranches}>Allot Branches</button>
        </>
      )}
    </div>
  );
}

export default DatabaseTables;
