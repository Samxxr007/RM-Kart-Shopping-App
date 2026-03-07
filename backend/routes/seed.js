const express = require('express');
const router = express.Router();
const { adminDb } = require('../firebase-admin');
const { verifyToken } = require('../middleware/auth');

const DEMO_PRODUCTS = [
    {
        title: 'Apple AirPods Pro',
        price: 249.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?w=400',
        description: 'Active noise cancellation, transparency mode, and spatial audio.',
        stock: 50,
        rating: 4.8,
    },
    {
        title: 'Leather Bifold Wallet',
        price: 49.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
        description: 'Premium genuine leather with RFID protection and slim profile.',
        stock: 120,
        rating: 4.5,
    },
    {
        title: 'Mechanical Keyboard',
        price: 129.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400',
        description: 'TKL layout, tactile switches, programmable RGB backlighting.',
        stock: 30,
        rating: 4.7,
    },
    {
        title: 'Running Shoes Pro',
        price: 89.99,
        category: 'Footwear',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        description: 'Lightweight breathable mesh upper with responsive cushioned sole.',
        stock: 80,
        rating: 4.6,
    },
    {
        title: 'Minimalist Wrist Watch',
        price: 199.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        description: 'Sapphire crystal glass, Japanese quartz movement, stainless steel case.',
        stock: 25,
        rating: 4.9,
    },
    {
        title: 'Portable Bluetooth Speaker',
        price: 79.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        description: 'IP67 waterproof, 20-hour battery, 360° immersive sound.',
        stock: 45,
        rating: 4.4,
    },
    {
        title: 'Travel Backpack 30L',
        price: 59.99,
        category: 'Bags',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        description: 'Ergonomic design with USB charging port and padded laptop compartment.',
        stock: 60,
        rating: 4.3,
    },
    {
        title: 'Polarised Sunglasses',
        price: 149.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        description: 'UV400 polarised lenses with titanium alloy frame.',
        stock: 35,
        rating: 4.7,
    },
    {
        title: 'Programmable Coffee Maker',
        price: 99.99,
        category: 'Kitchen',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
        description: '12-cup capacity, programmable timer, keep-warm plate.',
        stock: 20,
        rating: 4.5,
    },
    {
        title: 'Premium Yoga Mat',
        price: 39.99,
        category: 'Sport',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        description: 'Non-slip eco-friendly TPE, 6mm thick with alignment lines.',
        stock: 100,
        rating: 4.6,
    },
];

/**
 * POST /api/seed
 * Admin: Seed database with demo products.
 */
router.post('/', verifyToken, async (req, res) => {
    try {
        const batch = adminDb.batch();
        const timestamp = new Date().toISOString();

        DEMO_PRODUCTS.forEach(product => {
            const ref = adminDb.collection('products').doc();
            batch.set(ref, { ...product, createdAt: timestamp });
        });

        await batch.commit();
        res.json({ message: `✅ Seeded ${DEMO_PRODUCTS.length} products successfully!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * DELETE /api/seed
 * Admin: Clear all products and orders from database.
 */
router.delete('/', verifyToken, async (req, res) => {
    try {
        const collectionsToWipe = ['products', 'orders'];
        let totalDeleted = 0;

        for (const colName of collectionsToWipe) {
            const snapshot = await adminDb.collection(colName).get();
            if (!snapshot.empty) {
                const batch = adminDb.batch();
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
                totalDeleted += snapshot.size;
            }
        }

        res.json({ message: `🗑️ Cleared database. Removed ${totalDeleted} documents.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
