import React, { useEffect, useState } from "react";
import { getOrdersByUser } from "../api/orders";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            if (!user?.email) return;
            try {
                const data = await getOrdersByUser(user.email);
                setOrders(data);
            } catch (err) {
                console.error("Failed to load orders", err);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [user]);

    if (loading) return <div className="p-6">Loading your orders...</div>;

    if (orders.length === 0)
        return <div className="p-6 text-center text-gray-600">No orders yet.</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">Order History</h1>

            <div className="overflow-x-auto">
                <table className="w-full bg-white border rounded shadow-sm text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-2 text-left">Order ID</th>
                            <th className="p-2 text-left">Items</th>
                            <th className="p-2 text-left">Total (₹)</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t hover:bg-gray-50">
                                <td className="p-2 font-mono text-xs">
                                    <Link
                                        to={`/orders/${order.id}`}
                                        className="underline text-blue-600"
                                    >
                                        #{order.id.slice(-6)}
                                    </Link>
                                </td>
                                <td className="p-2">
                                    {order.items.map((i) => (
                                        <div key={i.listing_id}>
                                            {i.title} × {i.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td className="p-2 font-semibold text-green-700">
                                    ₹{order.total_amount}
                                </td>
                                <td className="p-2">{order.status}</td>
                                <td className="p-2">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderHistory;
