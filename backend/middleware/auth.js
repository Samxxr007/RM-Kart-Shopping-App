const { adminAuth } = require('../firebase-admin');

/**
 * Middleware to verify a Firebase ID token from the Authorization header.
 * Sets req.user = { uid, email, role, ... } on success.
 */
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decoded = await adminAuth.verifyIdToken(token);
        req.user = decoded; // contains uid, email, role (custom claim), etc.
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
};

/**
 * Middleware factory: restrict access to specific roles.
 * Use after verifyToken.
 * Example: router.get('/admin-only', verifyToken, requireRole('admin'), handler)
 */
const requireRole = (...roles) => (req, res, next) => {
    const userRole = req.user?.role?.toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: `Forbidden: requires one of [${roles.join(', ')}] role` });
    }
    next();
};

module.exports = { verifyToken, requireRole };
