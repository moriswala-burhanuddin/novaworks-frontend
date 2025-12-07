import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI, Cart } from '../services/api';
import { toast } from 'sonner';

interface CartContextType {
    cart: Cart | null;
    count: number;
    loading: boolean;
    addToCart: (projectId: number, quantity?: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);

    const getSessionId = () => {
        let sessionId = localStorage.getItem('cart_session');
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('cart_session', sessionId);
        }
        return sessionId;
    };

    const refreshCart = async () => {
        try {
            const res = await cartAPI.getCart();
            setCart(res.data);
        } catch (error) {
            // console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Add interceptor for Session ID
        const sessionId = getSessionId();
        // Assuming we handled header injection in api.ts or we do it here?
        // Let's proceed with refreshing.
        refreshCart();
    }, []);

    const addToCart = async (projectId: number, quantity: number = 1) => {
        try {
            const sessionId = getSessionId();
            await cartAPI.addToCart(projectId, quantity, sessionId);
            toast.success('Added to cart');
            await refreshCart();
        } catch (error) {
            toast.error('Failed to add to cart');
            throw error;
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await cartAPI.removeFromCart(itemId);
            toast.success("Item removed");
            await refreshCart();
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const updateItemQuantity = async (itemId: number, quantity: number) => {
        try {
            await cartAPI.updateCartItem(itemId, quantity);
            await refreshCart();
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    return (
        <CartContext.Provider value={{ cart, count: cart?.count || 0, loading, addToCart, removeItem, updateItemQuantity, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
