import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { api } from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Register: backend creates Firebase Auth user + Firestore profile, then we sign in on client.
     */
    const register = async (email, password, name, role = 'CUSTOMER', metadata = {}) => {
        // 1. Create user + save profile via backend
        await api.register({ email, password, name, role: role.toLowerCase(), metadata });
        // 2. Sign in on client to get an ID token
        await signInWithEmailAndPassword(auth, email, password);
    };

    /**
     * Login: standard Firebase Auth, then fetch profile from backend.
     */
    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

    /**
     * Logout: Firebase sign out.
     */
    const logout = () => signOut(auth);

    /**
     * Listen to Firebase Auth state changes. On login, fetch the user profile from the backend.
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    const profile = await api.getMe();
                    setUserData(profile);
                } catch {
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, userData, register, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
