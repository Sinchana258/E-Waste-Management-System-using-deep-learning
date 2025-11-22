import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { fetchProfile, updateProfile } from "../api/user";
import { getOrdersByUser } from "../api/orders";
import { useToast } from "../../context/ToastContext";
import { FiUser, FiPackage, FiShoppingCart } from "react-icons/fi";


const UserProfile = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const email = user?.email;

    const [form, setForm] = useState({
        email: "",
        name: "",
        phone: "",
        address: "",
    });

    const [orders, setOrders] = useState([]);
    const [orderCount, setOrderCount] = useState(0);

    const [activeTab, setActiveTab] = useState("profile"); // "profile" | "orders"
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!email) return;

        const load = async () => {
            try {
                const [profile, userOrders] = await Promise.all([
                    fetchProfile(email),
                    getOrdersByUser(email),
                ]);

                setForm(profile);
                setOrders(userOrders || []);
                setOrderCount(userOrders?.length || 0);
            } catch (err) {
                console.error("Failed to load profile or orders", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [email]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateProfile(form);
            showToast({ message: "Profile updated successfully!" });
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating profile", err);
            showToast({ message: "Error updating profile" });
        } finally {
            setSaving(false);
        }
    };

    const initials = (() => {
        if (form.name && form.name.trim().length > 0) {
            const parts = form.name.trim().split(" ");
            const first = parts[0][0] || "";
            const second = parts[1]?.[0] || "";
            return (first + second).toUpperCase();
        }
        if (email && email.length > 0) {
            return email[0].toUpperCase();
        }
        return "?";
    })();

    if (!email) {
        return <div className="p-6">Please sign in to view your profile.</div>;
    }

    if (loading) {
        return <div className="p-6">Loading profile...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">

                {/* Sidebar with React Icons */}
                <aside className="w-full md:w-1/3 lg:w-1/4 bg-white rounded shadow p-4">

                    {/* Avatar */}
                    <div className="flex flex-col items-center text-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-[#5a8807] text-white flex items-center justify-center text-2xl font-semibold mb-2">
                            {initials}
                        </div>
                        <p className="font-semibold text-sm">{form.name || "Your Name"}</p>
                        <p className="text-xs text-gray-500 break-all">{form.email}</p>
                    </div>

                    <div className="border-t pt-3 mt-3 space-y-2 text-sm">

                        {/* Profile Tab */}
                        <button
                            type="button"
                            onClick={() => setActiveTab("profile")}
                            className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${activeTab === "profile"
                                ? "bg-[#5a8807] text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            <FiUser size={16} />
                            Profile Info
                        </button>

                        {/* Orders Tab */}
                        <button
                            type="button"
                            onClick={() => setActiveTab("orders")}
                            className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${activeTab === "orders"
                                ? "bg-[#5a8807] text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            <FiPackage size={16} />
                            Order History
                            <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                                {orderCount}
                            </span>
                        </button>

                        {/* My Cart */}
                        <button
                            type="button"
                            onClick={() => (window.location.href = "/cart")}
                            className="w-full text-left px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-100"
                        >
                            <FiShoppingCart size={16} />
                            My Cart
                        </button>

                    </div>
                </aside>


                {/* Main content: Profile tab OR Orders tab */}
                <section className="flex-1 bg-white rounded shadow p-6">
                    {activeTab === "profile" && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-xl font-semibold">Profile Details</h1>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing((prev) => !prev)}
                                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-black"
                                >
                                    <span className="text-lg">✏️</span>
                                    <span>{isEditing ? "Cancel" : "Edit"}</span>
                                </button>
                            </div>

                            {/* When NOT editing: show read-only view */}
                            {!isEditing && (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Full Name</p>
                                        <p className="font-medium">
                                            {form.name || "Not set"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-medium break-all">{form.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Phone</p>
                                        <p className="font-medium">
                                            {form.phone || "Not set"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Address</p>
                                        <p className="font-medium whitespace-pre-wrap">
                                            {form.address || "Not set"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* When editing: show editable form */}
                            {isEditing && (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <label className="block text-gray-600 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            name="name"
                                            className="w-full border px-3 py-2 rounded"
                                            value={form.name || ""}
                                            onChange={handleChange}
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 mb-1">
                                            Email
                                        </label>
                                        <input
                                            disabled
                                            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                                            value={form.email}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            name="phone"
                                            className="w-full border px-3 py-2 rounded"
                                            value={form.phone || ""}
                                            onChange={handleChange}
                                            placeholder="+91 9876543210"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 mb-1">
                                            Address
                                        </label>
                                        <textarea
                                            name="address"
                                            className="w-full border px-3 py-2 rounded"
                                            value={form.address || ""}
                                            onChange={handleChange}
                                            placeholder="House No, Area, City..."
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-[#5a8807] text-white px-4 py-2 rounded text-sm hover:brightness-95 disabled:opacity-60"
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div>
                            <h1 className="text-xl font-semibold mb-4">
                                Order History
                            </h1>

                            {orders.length === 0 ? (
                                <p className="text-sm text-gray-600">
                                    You have not placed any orders yet.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border rounded">
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
                                                <tr
                                                    key={order.id}
                                                    className="border-t hover:bg-gray-50"
                                                >
                                                    <td className="p-2 font-mono text-xs">
                                                        #{order.id.slice(-6)}
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
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default UserProfile;
