import React, { createContext, useContext, useState, useEffect } from 'react';
import { usersAPI, authAPI } from '../services/api';

interface User {
    email: string;
    username: string;
    full_name?: string;
    avatar?: string;
    is_superuser?: boolean;
    is_staff?: boolean;
    // add other fields as needed
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, userData?: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    // Verify token by fetching profile
                    const res = await usersAPI.getProfile();
                    setUser(res.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Token invalid or expired", error);
                    localStorage.removeItem('authToken');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (token: string, userData?: User) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
        if (userData) {
            setUser(userData);
        } else {
            // Fetch user data if not provided
            usersAPI.getProfile()
                .then(res => setUser(res.data))
                .catch(err => console.error("Failed to fetch user on login", err));
        }
    };

    const logout = () => {
        authAPI.logout().catch(err => console.error("Logout API failed", err)); // Call API but proceed to clear local state
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
