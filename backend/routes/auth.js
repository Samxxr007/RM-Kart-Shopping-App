const express = require('express');
const router = express.Router();
const { adminAuth, adminDb } = require('../firebase-admin');
const { verifyToken } = require('../middleware/auth');

/**
 * POST /api/auth/register
 * Creates a Firebase Auth user and saves their role profile to Firestore.
 * Body: { email, password, name, role, metadata? }
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role = 'customer', metadata = {} } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'email, password and name are required' });
        }

        // 1. Create user in Firebase Authentication
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: name,
        });

        // 2. Set custom role claim on the token (used for role-based auth checks)
        await adminAuth.setCustomUserClaims(userRecord.uid, { role: role.toLowerCase() });

        // 3. Save full user profile to Firestore
        const userProfile = {
            uid: userRecord.uid,
            email,
            name,
            role: role.toLowerCase(),
            ...metadata,
            createdAt: new Date().toISOString(),
        };
        await adminDb.collection('users').doc(userRecord.uid).set(userProfile);

        res.status(201).json({ message: 'User registered successfully', user: userProfile });
    } catch (err) {
        // Firebase auth errors have a helpful code
        if (err.code === 'auth/email-already-exists') {
            return res.status(409).json({ error: 'Email is already in use' });
        }
        res.status(400).json({ error: err.message });
    }
});

/**
 * GET /api/auth/me
 * Returns the authenticated user's full profile from Firestore.
 */
router.get('/me', verifyToken, async (req, res) => {
    try {
        const doc = await adminDb.collection('users').doc(req.user.uid).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'User profile not found' });
        }
        res.json(doc.data());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
