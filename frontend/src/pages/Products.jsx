import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const { addToCart } = useCart();

    useEffect(() => {
        api.getProducts()
            .then(setProducts)
            .catch(() => setError('Failed to load products. Make sure the backend server is running.'))
            .finally(() => setLoading(false));
    }, []);

    const categories = ['All', ...new Set(products.map(p => p.category))];
    const filtered = products.filter(p =>
        (category === 'All' || p.category === category) &&
        (p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--danger-color)', padding: '1.5rem', background: 'rgba(239,68,68,0.1)', borderRadius: '12px' }}>
                    ⚠️ {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem 4rem' }}>
            <h2 className="text-responsive-h2" style={{ fontWeight: 800, marginBottom: '0.5rem' }}>All Products</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                {filtered.length} item{filtered.length !== 1 ? 's' : ''} available
            </p>

            {/* Search + Category Filter */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        flex: 1, minWidth: '200px', padding: '0.75rem 1rem',
                        borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)', color: 'white',
                    }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem',
                                fontWeight: 600, cursor: 'pointer',
                                background: category === cat ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                color: category === cat ? 'white' : 'var(--text-secondary)',
                                border: `1px solid ${category === cat ? 'var(--primary-color)' : 'var(--glass-border)'}`,
                                transition: 'all 0.25s',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                    No products found. Try seeding the database from the Admin Dashboard.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {filtered.map(product => (
                        <div key={product.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <Link to={`/products/${product.id}`}>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'; }}
                                />
                            </Link>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                    {product.category}
                                </span>
                                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                                        {product.title}
                                    </h3>
                                </Link>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1, lineHeight: 1.5 }}>
                                    {product.description?.slice(0, 80)}...
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.75rem 0' }}>
                                    <Star size={14} fill="var(--warning-color)" color="var(--warning-color)" />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{product.rating}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                                        ${product.price?.toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="btn-primary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                    >
                                        <ShoppingCart size={16} /> Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
