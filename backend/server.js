// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'swee090104',
  database: 'employee_db',
});

// Establish connection
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected.');
});

// Add employee endpoint
app.post('/add-employee', (req, res) => {
  const {
    firstName,
    lastName,
    employeeId,
    email,
    phone,
    department,
    dateOfJoining,
    role,
  } = req.body;

  // Validation: Check if Employee ID, Email, or duplicate Name and Phone exists
  const duplicateCheckQuery =
    'SELECT * FROM employees WHERE employeeId = ? OR email = ? OR (firstName = ? AND lastName = ? AND phone = ?)';

  db.query(
    duplicateCheckQuery,
    [employeeId, email, firstName, lastName, phone],
    (err, results) => {
      if (err) {
        return res.status(500).send({ message: 'Database error.' });
      }
      if (results.length > 0) {
        return res
          .status(400)
          .send({
            message: 'Duplicate entry detected: Employee ID, Email, or Name and Phone already exist.',
          });
      }

      // Insert new employee
      const insertQuery =
        'INSERT INTO employees (firstName, lastName, employeeId, email, phone, department, dateOfJoining, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(
        insertQuery,
        [
          firstName,
          lastName,
          employeeId,
          email,
          phone,
          department,
          dateOfJoining,
          role,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).send({ message: 'Failed to add employee.' });
          }
          res.status(200).send({ message: 'Employee added successfully.' });
        }
      );
    }
  );
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});