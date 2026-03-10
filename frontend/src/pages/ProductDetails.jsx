import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        api.getProduct(id)
            .then(setProduct)
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading product...
        </div>
    );

    if (!product) return (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Product not found.</p>
            <button onClick={() => navigate('/products')} className="btn-primary" style={{ marginTop: '1.5rem' }}>
                Back to Products
            </button>
        </div>
    );

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem 4rem' }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <ArrowLeft size={18} /> Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(1.5rem, 5vw, 4rem)' }}>
                <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '16px', aspectRatio: '1', maxHeight: '400px', margin: '0 auto', width: '100%' }}>
                    <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600'; }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>
                        {product.category}
                    </span>
                    <h1 className="text-responsive-h2" style={{ fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
                        {product.title}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill={i < Math.round(product.rating) ? 'var(--warning-color)' : 'transparent'} color="var(--warning-color)" />
                        ))}
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({product.rating})</span>
                    </div>

                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
                        ${product.price?.toFixed(2)}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {product.description}
                    </p>

                    <div style={{ height: '1px', background: 'var(--glass-border)' }} />

                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <ShieldCheck size={20} color="var(--success-color)" /> Secure Checkout
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <Truck size={20} color="var(--primary-color)" /> Free Shipping
                        </div>
                    </div>

                    <div style={{ fontWeight: 600, color: product.stock > 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                        {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✕ Out of stock'}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || added}
                        className="btn-primary"
                        style={{ padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: product.stock === 0 ? 0.5 : 1 }}
                    >
                        <ShoppingCart size={20} />
                        {added ? 'Added to Bag!' : 'Add to Bag'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
