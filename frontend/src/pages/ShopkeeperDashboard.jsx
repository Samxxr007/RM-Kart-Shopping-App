import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Package, Plus, TrendingUp, ShoppingBag, Clock } from 'lucide-react';

const ShopkeeperDashboard = () => {
    const { currentUser, userData } = useAuth();
    const [myProducts, setMyProducts] = useState([]);
    const [shopOrders, setShopOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShopData = async () => {
            if (!currentUser) return;
            try {
                // Fetch products owned by this shopkeeper
                const q = query(collection(db, 'products'), where('shopkeeperId', '==', currentUser.uid));
                const snapshot = await getDocs(q);
                setMyProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch orders containing products from this shopkeeper
                // For now, simpler: fetch orders where this shopkeeper is mentioned (placeholder logic)
                const oq = query(collection(db, 'orders'));
                const osnap = await getDocs(oq);
                setShopOrders(osnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchShopData();
    }, [currentUser]);

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Shop Manager</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {userData?.shopName || 'Partner'}. Manage your inventory and fulfill orders.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Shop Sales</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>$0.00</h3>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Listings</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{myProducts.length}</h3>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Inventory Status</h3>
                {myProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        <ShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>You haven't added any products yet.</p>
                        <button className="btn-primary" style={{ marginTop: '1rem' }}>Add First Product</button>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Product</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Stock</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myProducts.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>{p.title}</td>
                                    <td style={{ padding: '1rem' }}>{p.stock}</td>
                                    <td style={{ padding: '1rem' }}>${p.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ShopkeeperDashboard;
