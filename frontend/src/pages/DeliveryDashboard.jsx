import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Truck, MapPin, CheckCircle, Clock, Navigation } from 'lucide-react';

const DeliveryDashboard = () => {
    const { currentUser, userData } = useAuth();
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!currentUser) return;
            try {
                // Fetch orders assigned to this delivery partner
                const q = query(collection(db, 'orders'), where('deliveryId', '==', currentUser.uid));
                const snapshot = await getDocs(q);
                setAssignedOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [currentUser]);

    const updateStatus = async (orderId, status) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status });
            // Refresh local state
            setAssignedOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Delivery Portal</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Hello {userData?.name || 'Driver'}. Vehicle: {userData?.vehicleNumber || 'Standard'}.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Navigation size={24} color="var(--primary-color)" /> Active Shipments
                </h3>

                {assignedOrders.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <Truck size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                        <p>No orders assigned to you at the moment.</p>
                    </div>
                ) : (
                    assignedOrders.map(order => (
                        <div key={order.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Order #{order.id.slice(-6).toUpperCase()}</span>
                                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-color)' }}>{order.status}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <MapPin size={16} /> 123 Main St, Apartment 4B
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {order.status === 'SHIPPED' && (
                                    <button onClick={() => updateStatus(order.id, 'OUT_FOR_DELIVERY')} className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}>
                                        Out for Delivery
                                    </button>
                                )}
                                {order.status === 'OUT_FOR_DELIVERY' && (
                                    <button onClick={() => updateStatus(order.id, 'DELIVERED')} style={{ background: 'var(--success-color)', color: 'white', padding: '0.6rem 1rem', borderRadius: 'var(--border-radius-full)', border: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                                        Mark Delivered
                                    </button>
                                )}
                                <button style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', color: 'white' }}>
                                    <MapPin size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DeliveryDashboard;
