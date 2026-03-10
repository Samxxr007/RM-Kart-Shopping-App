import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, ChevronRight, X } from 'lucide-react';
import './index.css';

// Context Hooks
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

// Pages
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';

// API service
import { api } from './services/api';

// ─── Protected Route ───────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Please sign in</h2>
        <Link to="/login" className="btn-primary" style={{ display: 'inline-block' }}>Sign In</Link>
      </div>
    );
  }

  if (adminOnly) {
    const isAdmin = userData?.role === 'admin' || currentUser?.email?.includes('admin');
    if (!isAdmin) {
      return (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>You need admin privileges to view this page.</p>
        </div>
      );
    }
  }

  return children;
};

// ─── Home ─────────────────────────────────────────────────────────────────────
const Home = () => (
  <div className="container animate-fade-in" style={{ padding: 'clamp(4rem, 15vh, 8rem) 1.5rem', textAlign: 'center' }}>
    <h1 className="text-responsive-h1" style={{ fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.05em', color: 'white' }}>
      Shop<span style={{ color: 'var(--primary-color)' }}>Sphere</span>
    </h1>
    <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 3vw, 1.25rem)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
      The ultimate destination for premium lifestyle products. Discover quality, elegance, and innovation in every click.
    </p>
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <Link to="/products" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1rem' }}>
        Explore Collection <ChevronRight size={20} />
      </Link>
    </div>
  </div>
);

// ─── Cart ─────────────────────────────────────────────────────────────────────
const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const cardData = { number: '**** **** **** 4242', exp: '12/26', cvc: '123' };

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    if (!currentUser) { navigate('/login'); return; }
    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await api.placeOrder({ items: cartItems, total: cartTotal, paymentMethod: 'STRIPE_DEMO_CARD' });
      clearCart();
      alert('Payment Successful! Your order has been placed.');
      navigate('/orders');
    } catch (err) {
      alert('Failed to place order. Make sure you are logged in and the backend server is running.');
    } finally {
      setLoading(false);
      setShowPayment(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your cart is empty</h2>
        <Link to="/products" className="btn-primary" style={{ display: 'inline-block' }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem 4rem' }}>
      <h2 className="text-responsive-h2" style={{ fontWeight: 800, marginBottom: '2rem' }}>Your Shopping Bag</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cartItems.map(item => (
            <div key={item.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                onError={e => e.target.style.display = 'none'} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>${item.price.toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '2px' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '24px', height: '24px', color: 'white' }}>-</button>
                  <span style={{ fontSize: '0.85rem' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '24px', height: '24px', color: 'white' }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--danger-color)' }}><X size={16} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Order Summary</h3>
          {!showPayment ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>Shipping</span><span>Free</span>
              </div>
              <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>
                <span>Total</span><span>${cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={() => setShowPayment(true)} className="btn-primary" style={{ width: '100%' }}>Checkout</button>
            </>
          ) : (
            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)' }}>Secure Payment</h4>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Card Number</label>
                <input readOnly value={cardData.number} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '0.9rem' }} />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Exp</label>
                    <input readOnly value={cardData.exp} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '0.9rem' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>CVC</label>
                    <input readOnly value={cardData.cvc} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '0.9rem' }} />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
              </button>
              <button type="button" onClick={() => setShowPayment(false)} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
import { Menu } from 'lucide-react';

const Navbar = () => {
  const { currentUser, userData, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHomePage = location.pathname === '/';

  const getDashboardLink = () => {
    if (!userData) return '/';
    const role = userData.role?.toLowerCase();
    if (role === 'admin') return '/admin';
    if (role === 'shopkeeper') return '/shopkeeper';
    if (role === 'delivery') return '/delivery';
    return '/';
  };

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.025em' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>S</div>
          <span>ShopSphere</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {!isHomePage && <Link to="/products" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Products</Link>}
          <Link to="/cart" style={{ color: 'var(--text-primary)', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-10px', background: 'var(--accent-color)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                {cartCount}
              </span>
            )}
          </Link>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link to={getDashboardLink()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                  <User size={18} strokeWidth={1.5} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{userData?.name?.split(' ')[0] || 'Account'}</span>
              </Link>
              <button onClick={logout} style={{ color: 'var(--text-secondary)' }}><LogOut size={20} /></button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.85rem' }}>Sign In</Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', position: 'relative' }}>
            <ShoppingBag size={22} />
            {cartCount > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-10px', background: 'var(--accent-color)', color: 'white', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '10px' }}>{cartCount}</span>}
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: 'white' }}>
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="animate-fade-in" style={{ position: 'fixed', top: '70px', left: 0, right: 0, bottom: 0, background: 'var(--bg-color)', z_index: 90, padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>Products</Link>
            {currentUser && (
              <>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>My Orders</Link>
                <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dashboard</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--danger-color)', textAlign: 'left' }}>Logout</button>
              </>
            )}
            {!currentUser && (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary" style={{ textAlign: 'center', fontSize: '1.2rem' }}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// ─── App Root ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/shopkeeper" element={<ProtectedRoute><ShopkeeperDashboard /></ProtectedRoute>} />
                <Route path="/delivery" element={<ProtectedRoute><DeliveryDashboard /></ProtectedRoute>} />
              </Routes>
            </main>
            <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '2rem 0', marginTop: 'auto' }}>
              <div className="container" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
