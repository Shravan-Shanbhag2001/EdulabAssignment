const jwt = require('jsonwebtoken');
const dotenv3 = require('dotenv');
dotenv3.config();


const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { id, email, role }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};


const authorizeRole = (role) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
};


module.exports = { authenticate, authorizeRole };