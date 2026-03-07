import { auth } from '../firebase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Get request headers including the Firebase Auth JWT token if the user is logged in.
 */
async function getHeaders() {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

/**
 * Core fetch wrapper. Throws on non-OK responses.
 */
async function request(method, path, body) {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
    }

    return data;
}

// ─── Exported API ─────────────────────────────────────────────────────────────
export const api = {
    // Auth
    register: (data) => request('POST', '/auth/register', data),
    getMe: () => request('GET', '/auth/me'),

    // Products
    getProducts: () => request('GET', '/products'),
    getProduct: (id) => request('GET', `/products/${id}`),
    createProduct: (data) => request('POST', '/products', data),
    updateProduct: (id, data) => request('PUT', `/products/${id}`, data),
    deleteProduct: (id) => request('DELETE', `/products/${id}`),

    // Orders
    getMyOrders: () => request('GET', '/orders/my'),
    getAllOrders: () => request('GET', '/orders'),
    placeOrder: (data) => request('POST', '/orders', data),
    updateOrderStatus: (id, status) => request('PUT', `/orders/${id}/status`, { status }),

    // Users
    getUsers: () => request('GET', '/users'),
    getUser: (id) => request('GET', `/users/${id}`),
    updateUser: (id, data) => request('PUT', `/users/${id}`, data),

    // Database seed
    seedData: () => request('POST', '/seed'),
    unseedData: () => request('DELETE', '/seed'),
};
