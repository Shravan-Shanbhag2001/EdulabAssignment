const express4 = require('express');
const router3 = express4.Router();
const pool4 = require('../db');
const { authenticate, authorizeRole } = require('../middleware/auth');


// POST /api/courses/:id/enroll (student)
router3.post('/courses/:id/enroll', authenticate, authorizeRole('student'), async (req, res) => {
    const courseId = req.params.id;
    const userId = req.user.id;
    try {
        // check course exists
        const [courses] = await pool4.query('SELECT id FROM courses WHERE id = ?', [courseId]);
        if (!courses.length) return res.status(404).json({ error: 'Course not found' });


        // check already enrolled
        const [enrolled] = await pool4.query('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [userId, courseId]);
        if (enrolled.length) return res.status(409).json({ error: 'Already enrolled' });


        const [result] = await pool4.query('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)', [userId, courseId]);
        res.status(201).json({ id: result.insertId, user_id: userId, course_id: courseId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// GET /api/users/me/enrollments (student) - list enrolled courses
router3.get('/users/me/enrollments', authenticate, async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await pool4.query(`
SELECT c.id AS course_id, c.title, c.description, c.price, e.created_at AS enrolled_at
FROM enrollments e
JOIN courses c ON c.id = e.course_id
WHERE e.user_id = ?
ORDER BY e.created_at DESC
`, [userId]);
        res.json({ data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router3;