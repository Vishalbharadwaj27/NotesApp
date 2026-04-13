// src/controllers/authController.js
const db = require('../db/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key for signing tokens (in production, put this in .env file)
const JWT_SECRET = process.env.JWT_SECRET;

// 1. REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password (encrypt it)
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, password_hash]
    );

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      code: error.code
    });
  }
};

// 2. LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' }); // User not found
    }

    const user = users[0];

    // Compare password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Wrong password
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Payload (data inside token)
      JWT_SECRET,                             // Secret key
      { expiresIn: '1h' }                     // Options (expires in 1 hour)
    );

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login };