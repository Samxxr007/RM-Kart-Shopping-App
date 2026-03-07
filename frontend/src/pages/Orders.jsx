import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const TRACKING_STEPS = [
    { label: 'Pending', status: 'PENDING' },
    { label: 'Shipped', status: 'SHIPPED' },
    { label: 'Out for Delivery', status: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', status: 'DELIVERED' },
];

const OrderTracker = ({ status }) => {
    const stepStatuses = TRACKING_STEPS.map(s => s.status);
    const currentIndex = stepStatuses.indexOf(status);

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {TRACKING_STEPS.map((step, i) => {
                    const done = i <= currentIndex || status === 'DELIVERED';
                    return (
                        <div key={step.status} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: done ? 'var(--primary-color)' : 'rgba(255,255,255,0.08)',
                                border: `2px solid ${done ? 'var(--primary-color)' : 'var(--glass-border)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: done ? 'white' : 'var(--text-secondary)',
                                marginBottom: '0.5rem', zIndex: 2,
                                transition: 'all 0.3s',
                            }}>
                                {done
                                    ? <CheckCircle size={16} />
                                    : <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />}
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: done ? 'white' : 'var(--text-secondary)', textAlign: 'center' }}>
                                {step.label}
                            </span>
                            {i < TRACKING_STEPS.length - 1 && (
                                <div style={{
                                    position: 'absolute', top: 16, left: 'calc(50% + 16px)',
                                    width: 'calc(100% - 32px)', height: 2,
                                    background: i < currentIndex ? 'var(--primary-color)' : 'var(--glass-border)',
                                    zIndex: 1,
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Orders = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentUser) return;
        api.getMyOrders()
            .then(setOrders)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [currentUser]);

    if (loading) return (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading your orders...
        </div>
    );

    if (error) return (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--danger-color)', padding: '1.5rem', background: 'rgba(239,68,68,0.1)', borderRadius: '12px' }}>
                ⚠️ {error}
            </div>
        </div>
    );

    if (orders.length === 0) return (
        <div className="container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
            <Package size={64} style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', opacity: 0.4 }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No orders yet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>When you place an order, it will appear here.</p>
            <Link to="/products" className="btn-primary" style={{ display: 'inline-block' }}>Start Shopping</Link>
        </div>
    );

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>Your Orders</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {orders.map(order => (
                    <div key={order.id} className="glass-panel" style={{ padding: '2rem' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Order ID
                                </p>
                                <h3 style={{ fontWeight: 700 }}>#{order.id.slice(-8).toUpperCase()}</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Tracking Timeline */}
                        <OrderTracker status={order.status} />

                        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1.5rem 0' }} />

                        {/* Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {order.items?.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <img src={item.image} alt="" onError={e => e.target.style.display = 'none'}
                                            style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                                        <div>
                                            <p style={{ fontWeight: 600, color: 'white' }}>{item.title}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1.5rem 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700 }}>Total</span>
                            <span style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '1.25rem' }}>
                                ${order.total?.toFixed(2)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
