const express = require('express');
const dotenv2 = require('dotenv');
dotenv2.config();
const authRoutes = require('./routes/auth_route');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollment');
const pool = require('./db');


const app = express();
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', enrollmentRoutes); // enrollments route uses /api/courses/:id/enroll and user-specific endpoints


app.get('/', (req, res) => res.json({ ok: true, message: 'Course API running' }));


const PORT = process.env.PORT || 3000;


// Ensure DB connection then start
(async () => {
    try {
        await pool.getConnection();
        console.log('Connected to MySQL');
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (err) {
        console.error('Unable to connect to DB', err);
        process.exit(1);
    }
})();