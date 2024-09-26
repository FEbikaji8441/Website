// Importing required modules
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
const port = 3000;

// Enable CORS to allow requests from other origins
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a MySQL connection using environment variables
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'Jawan'  // Use the "Jawan" database
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the MySQL database Jawan.');
    }
});

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
};
// Route to handle login requests
app.post('/login', (req, res) => {
    console.log('Request Body:', req.body);  // Log incoming request body to see if username and password are correctly sent
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please enter both username and password.' });
    }
    try {
        // Query the database for the username
        const query = 'SELECT * FROM registration WHERE Email = ?';
        db.query(query, [username], async (err, results) => {
            if (err) {
                console.error('Database error during login:', err);
                return res.status(500).json({ success: false, message: 'Database error.' });
            }
            // If no user is found
            if (results.length === 0) {
                return res.status(400).json({ success: false, message: 'User not found.' });
            }

            const user = results[0];

            // Compare the input password with the stored password
            if (user.NewPassword === password) {
                // Passwords match
                return res.status(200).json({ success: true, message: 'Login successful.' });
            } else {
                // Passwords do not match
                return res.status(400).json({ success: false, message: 'Incorrect password.' });
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: 'An error occurred during login.' });
    }
});

// Route to handle registration requests
app.post('/register', async (req, res) => {
    const { name, email, newpassword, confirmpassword, year } = req.body;

    // Simple validation
    if (!name || !email || !newpassword || !confirmpassword || !year) {
        return res.status(400).json({ success: false, message: 'Please fill in all the fields.' });
    }

    if (newpassword !== confirmpassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(newpassword)) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long and contain both letters and numbers.' });
    }

    try {
        // Hash the password
        const plainPassword = newpassword;

        // Insert user data into the "registration" table in the "Jawan" database
        const query = 'INSERT INTO registration (Name, Email, NewPassword, ConfirmPassword, Year) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, plainPassword, plainPassword, year], (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

            // Return success response if registration is successful
            return res.status(200).json({ success: true, message: 'Registration successful.' });
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ success: false, message: 'An error occurred during registration.' });
    }
});



app.use(express.static(path.join(__dirname, 'public')));

// Serve JawanCF.html as the default page for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'JawanCF.html'));
});
// Use error handler
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



