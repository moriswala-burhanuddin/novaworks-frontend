import React, { createContext, useContext, useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

type Currency = 'USD' | 'INR';

interface CurrencyContextType {
    currency: Currency;
    symbol: string;
    formatPrice: (priceInr: number, priceUsd: number) => string;
    refreshCurrency: () => Promise<void>;
    loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [loading, setLoading] = useState(true);

    // Helper to get symbol
    const symbol = currency === 'INR' ? '₹' : '$';

    const refreshCurrency = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const res = await usersAPI.getProfile();
                const country = res.data.country?.toLowerCase();
                if (country === 'india') {
                    setCurrency('INR');
                } else {
                    setCurrency('USD');
                }
            } else {
                setCurrency('USD'); // Default for guests
            }
        } catch (error) {
            console.error("Failed to determine currency", error);
            setCurrency('USD');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshCurrency();
    }, []);

    const formatPrice = (priceInr: number, priceUsd: number) => {
        const val = currency === 'INR' ? priceInr : priceUsd;
        // Safety check for undefined/null
        const safeVal = val || 0;
        return `${symbol}${safeVal.toLocaleString()}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, symbol, formatPrice, refreshCurrency, loading }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
