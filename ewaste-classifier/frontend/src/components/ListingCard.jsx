import React from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const ListingCard = ({ listing }) => {
    const { showToast } = useToast();

    if (!listing) return null;

    const id = listing.id || listing._id || "";
    const imageUrl =
        listing.image_url || "https://via.placeholder.com/300x200?text=E-waste";
    const title = listing.title || "Untitled item";
    const category = listing.category || "Unknown";
    const condition = listing.condition || "N/A";
    const price = listing.price ?? 0;
    const stock = listing.stock ?? 0; // <-- stock support

    const handleAddToCart = () => {
        if (stock <= 0) {
            showToast({ message: "This item is out of stock" });
            return;
        }

        try {
            const raw = localStorage.getItem("ewaste_cart");
            const current = raw ? JSON.parse(raw) : [];

            const existingIndex = current.findIndex((item) => item.id === id);

            if (existingIndex !== -1) {
                // still respect stock limit (optional)
                if (current[existingIndex].quantity >= stock) {
                    showToast({ message: "You've added maximum available stock!" });
                    return;
                }
                current[existingIndex].quantity += 1;
            } else {
                current.push({
                    id,
                    title,
                    price,
                    image_url: imageUrl,
                    category,
                    condition,
                    quantity: 1,
                    stock,
                });
            }

            localStorage.setItem("ewaste_cart", JSON.stringify(current));
            showToast({ message: "Item added to cart" });
        } catch (e) {
            console.error("Failed to add to cart", e);
            showToast({ message: "Error adding item to cart" });
        }
    };

    return (
        <div className="border rounded-lg shadow-sm p-4 bg-white flex flex-col relative">

            {/* Stock Badge */}
            {stock <= 0 && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                </span>
            )}

            <img
                src={imageUrl}
                alt={title}
                className={`w-full h-40 object-cover rounded ${stock <= 0 ? "opacity-50" : ""
                    }`}
            />
            <h3 className="mt-3 font-semibold text-lg">{title}</h3>
            <p className="text-sm text-gray-600">
                {category} • {condition}
            </p>
            <p className="mt-1 font-bold text-green-700">₹{price}</p>

            <div className="mt-3 flex gap-2">
                <Link
                    to={`/marketplace/${id}`}
                    className={`flex-1 text-center bg-gray-100 text-gray-800 py-2 rounded text-sm hover:bg-gray-200 ${stock <= 0 ? "pointer-events-none opacity-60" : ""
                        }`}
                >
                    View
                </Link>

                <button
                    onClick={handleAddToCart}
                    disabled={stock <= 0}
                    className={`flex-1 py-2 rounded text-sm ${stock > 0
                            ? "bg-[#5a8807] text-white hover:brightness-95"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {stock > 0 ? "Add to Cart" : "Unavailable"}
                </button>
            </div>
        </div>
    );
};

export default ListingCard;
