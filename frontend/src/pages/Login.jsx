import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck, ShoppingBag, Truck, User } from 'lucide-react';

const Login = () => {
    const { login, userData } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('CUSTOMER');

    const getRedirectPath = (profile) => {
        if (!profile) return '/';
        const r = profile.role?.toLowerCase();
        if (r === 'admin' || email.includes('admin')) return '/admin';
        if (r === 'shopkeeper') return '/shopkeeper';
        if (r === 'delivery') return '/delivery';
        return '/';
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // Wait a moment for AuthContext to fetch the user profile
            await new Promise(resolve => setTimeout(resolve, 800));
            // userData may not be updated yet in this closure, so derive from role tab or re-fetch
            // Use email-based fallback
            const r = role.toLowerCase();
            if (email.includes('admin') || r === 'admin') navigate('/admin');
            else if (r === 'shopkeeper') navigate('/shopkeeper');
            else if (r === 'delivery') navigate('/delivery');
            else navigate('/');
        } catch (err) {
            setError(err.message?.replace('Firebase: ', '') || 'Failed to sign in. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in as {role.charAt(0) + role.slice(1).toLowerCase()}</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-color)', color: 'var(--danger-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Role Selection Tabs */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', marginBottom: '0.5rem' }}>
                        {[
                            { id: 'CUSTOMER', icon: <User size={14} />, label: 'Customer' },
                            { id: 'SHOPKEEPER', icon: <ShoppingBag size={14} />, label: 'Shop' },
                            { id: 'DELIVERY', icon: <Truck size={14} />, label: 'Delivery' },
                            { id: 'ADMIN', icon: <ShieldCheck size={14} />, label: 'Admin' },
                        ].map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id)}
                                style={{
                                    flex: 1, padding: '0.5rem', borderRadius: '8px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                                    fontSize: '0.65rem', fontWeight: 600,
                                    background: role === r.id ? 'var(--primary-color)' : 'transparent',
                                    color: role === r.id ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {r.icon}
                                {r.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                        />
                    </div>

                    <button disabled={loading} type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '1rem', justifyContent: 'center' }}>
                        {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to={`/register?role=${role}`} style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Create One</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
