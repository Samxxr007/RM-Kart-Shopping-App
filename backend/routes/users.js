const express = require('express');
const router = express.Router();
const { adminDb } = require('../firebase-admin');
const { verifyToken } = require('../middleware/auth');

/**
 * GET /api/users
 * Admin: list all users.
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const snapshot = await adminDb.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/users/:id
 * Get a specific user's profile. User can only get their own unless admin.
 */
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const doc = await adminDb.collection('users').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * PUT /api/users/:id
 * Update own profile. Users can only update their own profile.
 */
router.put('/:id', verifyToken, async (req, res) => {
    try {
        // Users can only update their own profile
        if (req.user.uid !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: you can only update your own profile' });
        }

        // Don't allow overriding uid or role
        const { uid, role, ...updates } = req.body;

        await adminDb.collection('users').doc(req.params.id).update({
            ...updates,
            updatedAt: new Date().toISOString(),
        });

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
