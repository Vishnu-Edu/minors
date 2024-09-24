const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let db = null;

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Prabhas@123',
    port: 3305, // Correct port configuration
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Initial Database connection to create database if not exists
async function initializeDatabase() {
  try {
    // Create a connection pool without specifying the database
    const initialDb = await mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port, // Ensure port is included here
      waitForConnections: dbConfig.waitForConnections,
      connectionLimit: dbConfig.connectionLimit,
      queueLimit: dbConfig.queueLimit
    });

    // Create the database if it does not exist
    await initialDb.query(`CREATE DATABASE IF NOT EXISTS minors`);

    // Update the connection pool to include the database
    db = await mysql.createPool({ ...dbConfig, database: 'minors' });

    console.log('Connected to MySQL database and ensured database exists');

    const createMinorsTableQuery = `
      CREATE TABLE IF NOT EXISTS minors (
        RegisterNumber VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100),
        CGPA FLOAT,
        Choice1 VARCHAR(100),
        Choice2 VARCHAR(100)
      )
    `;

    const createEmployeesTableQuery = `
      CREATE TABLE IF NOT EXISTS employees (
        email VARCHAR(100) PRIMARY KEY,
        password VARCHAR(100)
      )
    `;

    await db.query(createMinorsTableQuery);
    await db.query(createEmployeesTableQuery);

    console.log('Tables checked/created successfully');
  } catch (err) {
    console.error('Error initializing MySQL database:', err);
  }
}

// Initialize the database
initializeDatabase();

// Endpoint to handle form submission
app.post('/submit', async (req, res) => {
  const { RegisterNumber, name, CGPA, Choice1, Choice2 } = req.body;

  const query = 'INSERT INTO minors (RegisterNumber, name, CGPA, Choice1, Choice2) VALUES (?, ?, ?, ?, ?)';

  try {
    await db.query(query, [RegisterNumber, name, CGPA, Choice1, Choice2]);
    res.status(200).json({ message: 'Congratulations! Form submitted successfully.' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ message: 'Error submitting form' });
  }
});

// Endpoint to handle employee login and fetch student details by department
app.post('/employee/login', async (req, res) => {
  console.log('Received login request:', req.body);
  const { email, password } = req.body;

  if (email && password) {
    let department = 'Unknown';
    if (/aiml.*hod/i.test(email)) {
      department = 'AIML';
    } else if (/civil.*hod/i.test(email)) {
      department = 'Civil';
    } else if (/aids.*hod/i.test(email)) {
      department = 'AIDS';
    } else if (/eee.*hod/i.test(email)) {
      department = 'EEE';
    } else if (/ece.*hod/i.test(email)) {
      department = 'ECE';
    } else if (/mech.*hod/i.test(email)) {
      department = 'Mechanical';
    } else if (/cse.*hod/i.test(email)) {
      department = 'CSE';
    } else if (/it.*hod/i.test(email)) {
      department = 'IT';
    } else if (/csbs.*hod/i.test(email)) {
      department = 'CSBS';
    }

    const queryInsert = 'INSERT INTO employees (email, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password=VALUES(password)';

    try {
      await db.query(queryInsert, [email, password]);

      // Fetch student details based on department
      let query = 'SELECT * FROM minors WHERE 1=1';
      switch (department) {
        case 'AIML':
          query += ' AND SUBSTRING(RegisterNumber, 7, 2) = "42"';
          break;
        case 'Civil':
          query += ' AND SUBSTRING(RegisterNumber, 7, 2) = "01"';
          break;
        case 'AIDS':
          query += ' AND SUBSTRING(RegisterNumber, 7, 2) = "45"';
          break;
        case 'EEE':
          query += ' AND SUBSTRING(RegisterNumber, 7, 2) = "02"';
          break;
        case 'ECE':
          query += ' AND SUBSTRING(RegisterNumber, 7, 2) = "04"';
          break;
        case 'Mechanical':
          query += ' AND SUBSTRING(RegisterNumber, 7, 2) = "03"';
          break;
        case 'CSE':
          query += ' AND SUBSTRING(RegisterNumber, 7, 2) = "05"';
          break;
        case 'IT':
          query += ' AND SUBSTRING(RegisterNumber, 7, 2) = "12"';
          break;
        case 'CSBS':
          query += ' AND SUBSTRING(RegisterNumber, 7, 2) = "57"';
          break;
        default:
          return res.status(400).json({ message: 'Invalid department' });
      }
      
      const [results] = await db.query(query);
      res.status(200).json({ students: results, department });
    } catch (err) {
      console.error('Error handling employee login:', err);
      res.status(500).json({ message: 'Error handling employee login' });
    }
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Endpoint to handle updating student details
app.put('/update/student', async (req, res) => {
  const { RegisterNumber, name, CGPA, Choice1, Choice2 } = req.body;

  const query = `
    UPDATE minors 
    SET name = ?, CGPA = ?, Choice1 = ?, Choice2 = ?
    WHERE RegisterNumber = ?`;

  try {
    await db.query(query, [name, CGPA, Choice1, Choice2, RegisterNumber]);
    res.status(200).json({ message: 'Student details updated successfully' });
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ message: 'Error updating student details' });
  }
});

// Endpoint to handle deleting student details
app.delete('/delete/student/:registerNumber', async (req, res) => {
  const { registerNumber } = req.params;

  const query = 'DELETE FROM minors WHERE RegisterNumber = ?';

  try {
    await db.query(query, [registerNumber]);
    res.status(200).json({ message: 'Student details deleted successfully' });
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ message: 'Error deleting student details' });
  }
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
