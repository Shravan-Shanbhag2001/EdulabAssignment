const express3 = require('express');
const router2 = express3.Router();
const pool3 = require('../db');
const { authenticate, authorizeRole } = require('../middleware/auth');


// POST /api/courses (admin only)
// body: { title, description, price }
router2.post('/', authenticate, authorizeRole('admin'), async (req, res) => {
    const { title, description, price } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });
    try {
        const [result] = await pool3.query('INSERT INTO courses (title, description, price) VALUES (?, ?, ?)', [title, description || null, price || 0]);
        const id = result.insertId;
        res.status(201).json({ id, title, description, price });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// GET /api/courses?page=1&limit=10 (public)
router2.get('/', async (req, res) => {
    // pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;


    try {
        const [[{ total }]] = await pool3.query('SELECT COUNT(*) as total FROM courses');
        const [rows] = await pool3.query('SELECT id, title, description, price, created_at FROM courses ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);


        res.json({ page, limit, total, pages: Math.ceil(total / limit), data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// GET /api/courses/:id
router2.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool3.query('SELECT id, title, description, price, created_at FROM courses WHERE id = ?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'Course not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router2;