const express = require('express');
const router = express.Router();
const { adminDb } = require('../firebase-admin');
const { verifyToken } = require('../middleware/auth');

/**
 * GET /api/orders/my
 * Customer: get their own orders, newest first.
 */
router.get('/my', verifyToken, async (req, res) => {
    try {
        const snapshot = await adminDb.collection('orders')
            .where('userId', '==', req.user.uid)
            .get();

        // Sort in JS to avoid needing a composite Firestore index
        const orders = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/orders
 * Admin/Delivery: get all orders, newest first.
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const snapshot = await adminDb.collection('orders').get();
        const orders = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /api/orders
 * Customer places an order.
 * Body: { items: [...], total: number, paymentMethod?: string }
 */
router.post('/', verifyToken, async (req, res) => {
    try {
        const { items, total, paymentMethod = 'CARD' } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must have at least one item' });
        }

        const order = {
            userId: req.user.uid,
            userEmail: req.user.email,
            items,
            total,
            paymentMethod,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
        };

        const ref = await adminDb.collection('orders').add(order);
        res.status(201).json({ id: ref.id, ...order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * PUT /api/orders/:id/status
 * Admin/Delivery: update order status.
 * Body: { status: 'PENDING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' }
 */
router.put('/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['PENDING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        await adminDb.collection('orders').doc(req.params.id).update({
            status,
            updatedAt: new Date().toISOString(),
        });

        res.json({ message: 'Order status updated', status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
