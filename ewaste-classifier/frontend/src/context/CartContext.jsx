import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load from localStorage on first render
    useEffect(() => {
        const stored = localStorage.getItem("ewaste_cart");
        if (stored) {
            try {
                setCartItems(JSON.parse(stored));
            } catch {
                setCartItems([]);
            }
        }
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem("ewaste_cart", JSON.stringify(cartItems));
        console.log("Cart updated:", cartItems);
    }, [cartItems]);

    const addToCart = (listing) => {
        if (!listing) return;

        const id = listing.id || listing._id;
        if (!id) {
            console.warn("Tried to add item without id to cart:", listing);
            return;
        }

        const normalized = { ...listing, id };

        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === id);
            if (existing) {
                return prev.map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...normalized, quantity: 1 }];
        });

        console.log("Added to cart:", normalized);
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCartItems([]);

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0
    );

    const totalCount = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) {
        console.error("useCart called outside CartProvider");
    }
    return ctx || {
        cartItems: [],
        addToCart: () => { },
        removeFromCart: () => { },
        updateQuantity: () => { },
        clearCart: () => { },
        totalAmount: 0,
        totalCount: 0,
    };
};
