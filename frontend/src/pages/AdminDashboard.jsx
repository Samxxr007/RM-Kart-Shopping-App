import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Users, BarChart2, Plus, Edit2, Trash2, X, Check, Database, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const TABS = ['Overview', 'Products', 'Orders', 'Users'];
const ORDER_STATUSES = ['PENDING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const AdminDashboard = () => {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({ title: '', price: '', category: '', description: '', image: '', stock: '' });
    const [message, setMessage] = useState('');

    const isAdmin = userData?.role === 'admin' || currentUser?.email?.includes('admin');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        loadAll();
    }, [isAdmin]);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [p, o, u] = await Promise.all([api.getProducts(), api.getAllOrders(), api.getUsers()]);
            setProducts(p);
            setOrders(o);
            setUsers(u);
        } catch (err) {
            setMessage('⚠️ Failed to load data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 4000);
    };

    const handleSeed = async () => {
        if (!confirm('Seed database with 10 demo products?')) return;
        setSeeding(true);
        try {
            const res = await api.seedData();
            showMsg(res.message);
            loadAll();
        } catch (err) {
            showMsg('❌ ' + err.message);
        } finally {
            setSeeding(false);
        }
    };

    const handleUnseed = async () => {
        if (!confirm('⚠️ This will DELETE all products and orders! Are you sure?')) return;
        if (!confirm('Last chance — permanently clear the database?')) return;
        setSeeding(true);
        try {
            const res = await api.unseedData();
            showMsg(res.message);
            loadAll();
        } catch (err) {
            showMsg('❌ ' + err.message);
        } finally {
            setSeeding(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await api.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
            showMsg('✅ Product deleted');
        } catch (err) {
            showMsg('❌ ' + err.message);
        }
    };

    const handleSaveProduct = async () => {
        // Validate required fields
        if (!newProduct.title.trim()) return showMsg('❌ Please enter a product name');
        if (!newProduct.price || isNaN(parseFloat(newProduct.price))) return showMsg('❌ Please enter a valid price');
        if (!newProduct.category.trim()) return showMsg('❌ Please enter a category');
        if (!newProduct.stock || isNaN(parseInt(newProduct.stock))) return showMsg('❌ Please enter a stock number');

        try {
            const data = {
                title: newProduct.title.trim(),
                price: parseFloat(newProduct.price),
                category: newProduct.category.trim(),
                description: newProduct.description.trim(),
                image: newProduct.image.trim(),
                stock: parseInt(newProduct.stock),
                rating: 4.5,
            };
            if (editingProduct) {
                await api.updateProduct(editingProduct.id, data);
                setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...data } : p));
                showMsg('✅ Product updated');
            } else {
                const created = await api.createProduct(data);
                setProducts([created, ...products]);
                showMsg('✅ Product added');
            }
            setEditingProduct(null);
            setShowAddProduct(false);
            setNewProduct({ title: '', price: '', category: '', description: '', image: '', stock: '' });
        } catch (err) {
            showMsg('❌ ' + (err.message || 'Failed to save product. Check backend is running.'));
        }
    };


    const handleUpdateOrderStatus = async (id, status) => {
        try {
            await api.updateOrderStatus(id, status);
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            showMsg('✅ Order status updated');
        } catch (err) {
            showMsg('❌ ' + err.message);
        }
    };

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const stats = [
        { icon: <ShoppingBag />, label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'var(--primary-color)' },
        { icon: <Package />, label: 'Total Orders', value: orders.length, color: 'var(--success-color)' },
        { icon: <BarChart2 />, label: 'Products', value: products.length, color: 'var(--warning-color)' },
        { icon: <Users />, label: 'Users', value: users.length, color: '#a78bfa' },
    ];

    const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', marginBottom: '0.75rem' };

    if (loading) return <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>Loading dashboard...</div>;

    return (
        <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleSeed} disabled={seeding} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Database size={16} /> {seeding ? '...' : 'Seed Data'}
                    </button>
                    <button onClick={handleUnseed} disabled={seeding} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger-color)', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 600 }}>
                        <Trash2 size={16} /> {seeding ? '...' : 'Unseed'}
                    </button>
                    <button onClick={loadAll} style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {message && (
                <div style={{ padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: 'white' }}>
                    {message}
                </div>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map(s => (
                    <div key={s.label} className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ color: s.color, marginBottom: '0.75rem' }}>{s.icon}</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.value}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px' }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        flex: 1, padding: '0.6rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
                        background: activeTab === tab ? 'var(--primary-color)' : 'transparent',
                        color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                    }}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Products Tab */}
            {activeTab === 'Products' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Products ({products.length})</h2>
                        <button onClick={() => { setShowAddProduct(true); setEditingProduct(null); setNewProduct({ title: '', price: '', category: '', description: '', image: '', stock: '' }); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={16} /> Add Product
                        </button>
                    </div>

                    {(showAddProduct || editingProduct) && (
                        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                            <input style={inputStyle} placeholder="Product Name" value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="Price (e.g. 29.99)" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                                <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                            </div>
                            <input style={inputStyle} placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
                            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={handleSaveProduct} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Save</button>
                                <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); }} style={{ padding: '0.6rem 1.25rem', color: 'var(--text-secondary)' }}>Cancel</button>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {products.map(p => (
                            <div key={p.id} className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <img src={p.image} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 600, color: 'white' }}>{p.title}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.category} · Stock: {p.stock}</p>
                                </div>
                                <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>${p.price?.toFixed(2)}</span>
                                <button onClick={() => { setEditingProduct(p); setShowAddProduct(false); setNewProduct({ title: p.title, price: p.price, category: p.category, description: p.description, image: p.image, stock: p.stock }); }} style={{ color: 'var(--text-secondary)', padding: '0.4rem' }}><Edit2 size={16} /></button>
                                <button onClick={() => handleDeleteProduct(p.id)} style={{ color: 'var(--danger-color)', padding: '0.4rem' }}><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'Orders' && (
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Orders ({orders.length})</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.map(order => (
                            <div key={order.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <p style={{ fontWeight: 700 }}>#{order.id.slice(-8).toUpperCase()}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.userEmail || 'Unknown'} · {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>${order.total?.toFixed(2)}</span>
                                        <select
                                            value={order.status}
                                            onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                                            style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.85rem' }}
                                        >
                                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {order.items?.map((item, i) => (
                                        <span key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px' }}>
                                            {item.title} ×{item.quantity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'Users' && (
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Users ({users.length})</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {users.map(u => (
                            <div key={u.uid || u.id} className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                    <p style={{ fontWeight: 600, color: 'white' }}>{u.name}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</p>
                                </div>
                                <span style={{
                                    padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                                    background: u.role === 'admin' ? 'rgba(239,68,68,0.15)' : u.role === 'shopkeeper' ? 'rgba(245,158,11,0.15)' : u.role === 'delivery' ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                                    color: u.role === 'admin' ? 'var(--danger-color)' : u.role === 'shopkeeper' ? 'var(--warning-color)' : u.role === 'delivery' ? 'var(--success-color)' : 'var(--primary-color)',
                                }}>
                                    {u.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'Overview' && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Recent Orders</h3>
                        {orders.slice(0, 5).map(order => (
                            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>#{order.id.slice(-8).toUpperCase()}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 700, color: 'var(--primary-color)' }}>${order.total?.toFixed(2)}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
