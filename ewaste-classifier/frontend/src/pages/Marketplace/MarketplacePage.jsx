import React, { useEffect, useState } from "react";
import { fetchListings } from "../api/listings";
import ListingCard from "../../components/ListingCard";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Marketplace = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const { user, logout } = useAuth(); // auth info

    const categories = [
        "all",
        ...Array.from(new Set(listings.map((l) => l.category))).filter(Boolean),
    ];

    const filteredListings =
        selectedCategory === "all"
            ? listings
            : listings.filter((l) => l.category === selectedCategory);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchListings();
                setListings(data || []);
            } catch (err) {
                console.error("Failed to load listings", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div className="p-6">Loading marketplace...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Top Header + User Actions */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold">E-Waste Marketplace</h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Buy reusable e-waste items instead of sending them to landfills.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    {user && (
                        <span className="text-xs md:text-sm text-gray-600 mr-1">
                            Signed in as <span className="font-semibold">{user.email}</span>
                        </span>
                    )}

                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 bg-[#5a8807] text-white px-3 py-1.5 rounded text-xs md:text-sm hover:brightness-95"
                    >
                        View Cart
                    </Link>

                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-3 py-1.5 rounded text-xs md:text-sm hover:bg-gray-50"
                    >
                        Profile
                    </Link>

                    <button
                        onClick={logout}
                        className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded text-xs md:text-sm hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <hr className="mb-4" />

            {/* Category Filter */}
            <div className="flex items-center gap-3 mb-6">
                <label className="text-sm text-gray-600">Category:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat === "all" ? "All" : cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Grid */}
            {filteredListings.length === 0 ? (
                <p>No items available right now.</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {filteredListings
                        ?.filter(Boolean)
                        .map((listing) => (
                            <ListingCard
                                key={listing.id || listing._id}
                                listing={listing}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

export default Marketplace;
