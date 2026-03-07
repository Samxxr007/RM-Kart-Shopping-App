const express = require('express');
const router = express.Router();
const { adminDb } = require('../firebase-admin');
const { verifyToken } = require('../middleware/auth');

/**
 * GET /api/products
 * Returns all products. Public route.
 */
router.get('/', async (req, res) => {
    try {
        const snapshot = await adminDb.collection('products').orderBy('createdAt', 'desc').get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(products);
    } catch (err) {
        // orderBy fails if no index — fall back to simple get
        try {
            const snap = await adminDb.collection('products').get();
            res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
});

/**
 * GET /api/products/:id
 * Returns a single product by ID. Public route.
 */
router.get('/:id', async (req, res) => {
    try {
        const doc = await adminDb.collection('products').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /api/products
 * Add a new product. Admin/Shopkeeper only.
 */
router.post('/', verifyToken, async (req, res) => {
    try {
        const product = {
            ...req.body,
            createdBy: req.user.uid,
            createdAt: new Date().toISOString(),
        };
        const ref = await adminDb.collection('products').add(product);
        res.status(201).json({ id: ref.id, ...product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * PUT /api/products/:id
 * Update a product. Admin/Shopkeeper only.
 */
router.put('/:id', verifyToken, async (req, res) => {
    try {
        await adminDb.collection('products').doc(req.params.id).update({
            ...req.body,
            updatedAt: new Date().toISOString(),
        });
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * DELETE /api/products/:id
 * Remove a product. Admin only.
 */
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await adminDb.collection('products').doc(req.params.id).delete();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
