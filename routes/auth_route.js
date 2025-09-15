const express2 = require('express');
const router = express2.Router();
const pool2 = require('../db');
const bcrypt = require('bcrypt');
const jwt2 = require('jsonwebtoken');
require('dotenv').config();
// dotenv.config(); // Already configured in middleware/auth.js

// POST /api/auth/register
// body: { name, email, password, role } role: 'student' or 'admin'
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
    const userRole = role === 'admin' ? 'admin' : 'student';


    try {
        const [existing] = await pool2.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length) return res.status(409).json({ error: 'Email already registered' });


        const hashed = await bcrypt.hash(password, 10);
        const [result] = await pool2.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, userRole]);
        const userId = result.insertId;


        const token = jwt2.sign({ id: userId, email, role: userRole }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
        res.status(201).json({ id: userId, name, email, role: userRole, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// POST /api/auth/login
// body: { email, password }
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    try {
        const [rows] = await pool2.query('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);
        if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: 'Invalid credentials' });


        const token = jwt2.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;