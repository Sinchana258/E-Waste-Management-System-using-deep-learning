import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchListingById } from "../api/listings";
import { useToast } from "../../context/ToastContext";

const ListingDetails = () => {
    const { id } = useParams();
    const { showToast } = useToast();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadListing = async () => {
            try {
                const data = await fetchListingById(id);
                setListing(data);
            } catch (err) {
                console.error("Failed to fetch listing details", err);
            } finally {
                setLoading(false);
            }
        };
        loadListing();
    }, [id]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!listing) return <div className="p-6">Listing not found.</div>;

    const {
        image_url,
        title,
        price,
        category,
        condition,
        description,
        stock = 0,
    } = listing;

    const handleAddToCart = () => {
        if (stock <= 0) {
            showToast({ message: "This item is out of stock" });
            return;
        }

        try {
            const raw = localStorage.getItem("ewaste_cart");
            const cart = raw ? JSON.parse(raw) : [];

            const index = cart.findIndex((item) => item.id === id);

            if (index !== -1) {
                if (cart[index].quantity >= stock) {
                    showToast({ message: "You've added maximum available stock!" });
                    return;
                }
                cart[index].quantity += 1;
            } else {
                cart.push({
                    id,
                    title,
                    price,
                    image_url,
                    category,
                    condition,
                    quantity: 1,
                    stock,
                });
            }

            localStorage.setItem("ewaste_cart", JSON.stringify(cart));
            showToast({ message: "Item added to cart" });
        } catch (err) {
            console.error("Add to cart failed", err);
            showToast({ message: "Error adding item to cart" });
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
                <img
                    src={
                        image_url ||
                        "https://via.placeholder.com/400x300?text=E-waste+Item"
                    }
                    alt={title}
                    className={`w-full md:w-1/2 h-64 object-cover rounded ${stock <= 0 ? "opacity-50" : ""
                        }`}
                />

                <div className="flex-1 space-y-4">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    <p className="text-gray-600">{category}</p>
                    <p className="font-medium">Condition: {condition}</p>

                    <p className="text-2xl font-bold text-green-700">₹{price}</p>

                    {/* Stock Info */}
                    {stock <= 0 ? (
                        <span className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                            Out of Stock
                        </span>
                    ) : (
                        <span className="text-sm text-gray-700 font-medium">
                            {stock <= 2
                                ? `Hurry! Only ${stock} left`
                                : `In stock: ${stock}`}
                        </span>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={stock <= 0}
                        className={`w-full md:w-auto px-6 py-2 rounded text-white text-sm ${stock > 0
                            ? "bg-[#5a8807] hover:brightness-95"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {stock > 0 ? "Add to Cart" : "Unavailable"}
                    </button>

                    {description && <p className="text-gray-700">{description}</p>}
                </div>
            </div>
        </div>
    );
};

export default ListingDetails;
