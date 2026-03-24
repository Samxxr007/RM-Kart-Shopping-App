const admin = require('firebase-admin');
require('dotenv').config();

// Helper to format the private key correctly from environment variables
const formatPrivateKey = (key) => {
    if (!key) return undefined;
    // Remove surrounding quotes if they exist (common issue in Vercel/Docker)
    let k = key.trim();
    if (k.startsWith('"') && k.endsWith('"')) {
        k = k.substring(1, k.length - 1);
    }
    // Handle escaped newlines
    return k.replace(/\\n/g, '\n');
};

// Initialize Firebase Admin SDK once
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
        }),
    });
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

module.exports = { adminDb, adminAuth, admin };
