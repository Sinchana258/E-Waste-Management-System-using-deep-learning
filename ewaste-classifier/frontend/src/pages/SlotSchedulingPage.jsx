import React from "react";
import { Link } from "react-router-dom";
import {
    FaHeadphones,
    FaLaptop,
    FaSnowflake,
    FaMobileAlt,
    FaTv,
} from "react-icons/fa";

const SlotSchedulingPage = () => {
    const categories = [
        {
            id: "accessories",
            name: "Accessories",
            description: "Headphones, chargers, power banks, smartwatches & more.",
            icon: FaHeadphones,
            link: "/recycle/accessories",
            badge: "Small Gadgets",
        },
        {
            id: "laptop",
            name: "Laptops",
            description: "Old or damaged laptops, notebooks, ultrabooks.",
            icon: FaLaptop,
            link: "/recycle/laptop",
            badge: "High Value",
        },
        {
            id: "refrigerator",
            name: "Refrigerators",
            description: "Double door, single door & mini fridges.",
            icon: FaSnowflake,
            link: "/recycle/refrigerator",
            badge: "Bulk Pickup",
        },
        {
            id: "smartphone",
            name: "Smartphones",
            description: "Android phones, iPhones & other mobile devices.",
            icon: FaMobileAlt,
            link: "/recycle/smartphone",
            badge: "Most Common",
        },
        {
            id: "television",
            name: "Televisions",
            description: "LED, LCD, smart TVs & older models.",
            icon: FaTv,
            link: "/recycle/television",
            badge: "Large Appliance",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-sm uppercase tracking-wide text-bg[#5a8807] font-semibold mb-2">
                        Slot Scheduling
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        Choose what you want to recycle
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Select a category to schedule a doorstep pickup for your e-waste.
                        You’ll be able to enter item details, pickup date & time in the next step.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.id}
                                to={category.link}
                                className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 hover:border-[#5a8807] transition-all duration-200 flex flex-col"
                            >
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-full bg-[#5a8807] text-white group-hover:bg-[#afe157] transition-colors">
                                                <Icon className="text-xl" />
                                            </div>

                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {category.name}
                                            </h2>
                                        </div>

                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                            {category.badge}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 flex-1">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="px-5 pb-4 pt-2">
                                    <button
                                        type="button"
                                        className="w-full inline-flex items-center justify-center text-sm font-medium rounded-lg bg-[#5a8807] text-white py-2.5 group-hover:bg-[#86c418] transition-colors"
                                    >
                                        Continue with {category.name}
                                        <span className="ml-2 text-base group-hover:translate-x-0.5 transition-transform">
                                            →
                                        </span>
                                    </button>
                                </div>
                            </Link>
                        );
                    })}
                </div>


                {/* Helper text */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    Not sure which category to choose? Start with the closest match –
                    our team will verify and handle it correctly during pickup.
                </div>
            </div>
        </div>
    );
};

export default SlotSchedulingPage;
