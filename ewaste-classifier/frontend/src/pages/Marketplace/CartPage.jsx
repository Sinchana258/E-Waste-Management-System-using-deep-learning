
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const [placing, setPlacing] = useState(false);
    const navigate = useNavigate();

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem("ewaste_cart");
            const parsed = raw ? JSON.parse(raw) : [];
            setCartItems(Array.isArray(parsed) ? parsed : []);
            console.log("CartPage loaded items:", parsed);

            const savedEmail = localStorage.getItem("ewaste_user_email");
            if (savedEmail) setUserEmail(savedEmail);
        } catch (e) {
            console.error("Failed to load cart", e);
            setCartItems([]);
        }
    }, []);

    const syncAndSet = (items) => {
        setCartItems(items);
        localStorage.setItem("ewaste_cart", JSON.stringify(items));
    };

    const handleRemove = (id) => {
        const updated = cartItems.filter((item) => item.id !== id);
        syncAndSet(updated);
    };

    const handleQuantityChange = (id, quantity) => {
        const qty = Number(quantity);
        if (Number.isNaN(qty) || qty <= 0) return;

        const updated = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: qty } : item
        );
        syncAndSet(updated);
    };

    const handleClearCart = () => {
        syncAndSet([]);
    };

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0
    );

    const handlePlaceOrder = async () => {
        if (!userEmail) {
            alert("Please enter your email for booking confirmation.");
            return;
        }
        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const ok = window.confirm(
            "Confirm booking these items? (No online payment, just a booking record)"
        );
        if (!ok) return;

        try {
            setPlacing(true);
            const order = await createOrder({ userEmail, items: cartItems });

            // save email for future
            localStorage.setItem("ewaste_user_email", userEmail);

            // clear cart
            syncAndSet([]);

            // Go to success page
            navigate("/order-success", {
                state: {
                    orderId: order.id,
                    amount: order.total_amount,
                    title: `Order with ${order.items.length} item(s)`,
                    userEmail: order.user_email,
                },
            });
        } catch (err) {
            console.error("Failed to place order", err);
            alert("Something went wrong while placing your order.");
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="grid gap-4 mb-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between border rounded p-3 bg-white"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            item.image_url ||
                                            "https://via.placeholder.com/80x60?text=E-waste"
                                        }
                                        alt={item.title}
                                        className="w-20 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-sm text-gray-600">
                                            ₹{item.price} × {item.quantity} = ₹
                                            {Number(item.price || 0) * item.quantity}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(item.id, e.target.value)
                                        }
                                        className="w-16 border rounded px-2 py-1 text-sm"
                                    />
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border rounded p-4 bg-white flex flex-col gap-3 max-w-md">
                        <p className="font-semibold">
                            Total: <span className="text-green-700">₹{totalAmount}</span>
                        </p>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email for booking confirmation
                            </label>
                            <input
                                type="email"
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={placing}
                            className="bg-[#5a8807] text-white px-4 py-2 rounded text-sm hover:brightness-95 disabled:opacity-60"
                        >
                            {placing ? "Placing order..." : "Place Order"}
                        </button>

                        <button
                            onClick={handleClearCart}
                            className="bg-gray-100 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-200"
                        >
                            Clear Cart
                        </button>

                        <p className="text-xs text-gray-500 mt-2">
                            Note: Online payment is not integrated. This creates a booking
                            record in the system using your email.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
