// src/pages/SlotSchedulingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
    FaHeadphones,
    FaLaptop,
    FaSnowflake,
    FaMobileAlt,
    FaTv,
} from "react-icons/fa";

/**
 * Decorative asset you uploaded — using local path provided.
 * The environment will translate this local path to a served URL.
 * (developer note: file path from conversation)
 */
const LOGO_URL = "/mnt/data/31139e21-fece-4d9c-abef-f65c1c8bd0d0.png";

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
        <div className="min-h-screen bg-[#E2F0C9] py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Decorative top area with logo */}
                <div className="flex items-center justify-between mb-8 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white p-2 shadow-sm flex items-center justify-center">
                            <img
                                src={LOGO_URL}
                                alt="Ecycle logo"
                                className="w-full h-full object-contain"
                                aria-hidden="true"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Slot Scheduling
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Choose the category you want to recycle — we'll guide you to schedule a pickup.
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-4">
                        <div className="text-sm px-3 py-2 rounded-md bg-white border border-gray-100 text-gray-700 shadow-sm">
                            Need help? <span className="font-medium">+91 12345 67890</span>
                        </div>
                        <a
                            href="/not-found"
                            className="text-sm text-[#5a8807] hover:underline focus:outline-none focus:ring-2 focus:ring-[#5a8807] rounded"
                        >
                            Pickup policy
                        </a>
                    </div>
                </div>

                {/* Intro / content */}
                <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-8">
                    <div className="md:flex md:items-center md:justify-between gap-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                                Choose what you want to recycle
                            </h2>
                            <p className="text-gray-600 mt-1 max-w-2xl">
                                Select a category to schedule a doorstep pickup. In the next step you'll
                                enter item details, preferred pickup date & time, and contact information.
                                We verify each item before collection.
                            </p>
                        </div>

                        <div className="mt-4 md:mt-0 flex items-center gap-3">
                            <div className="text-xs px-3 py-1 rounded-full bg-[#f0f7e6] text-[#5a8807] font-semibold">
                                Pickup window: 48–72 hrs
                            </div>
                            <div className="text-xs px-3 py-1 rounded-full bg-[#f8faf9] text-gray-700">
                                Free for small items
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.id}
                                to={category.link}
                                state={{ selectedCategory: category.id }}
                                aria-label={`Continue with ${category.name} for pickup`}
                                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5a8807] rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:translate-y-[-4px] transform transition-all duration-300 will-change-transform flex flex-col"
                            >
                                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="p-3 rounded-full bg-[#5a8807] text-white group-hover:bg-[#86c418] transition-colors flex items-center justify-center"
                                                aria-hidden="true"
                                            >
                                                <Icon className="w-5 h-5" />
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {category.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5">{category.description}</p>
                                            </div>
                                        </div>

                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 self-start">
                                            {category.badge}
                                        </span>
                                    </div>

                                    <div className="flex-1 mt-3">
                                        <p className="text-sm text-gray-600">
                                            {/* Short friendly microcopy */}
                                            We accept items in most conditions — for bulky or hazardous items our
                                            crew will advise the right pickup method.
                                        </p>
                                    </div>
                                </div>

                                <div className="px-4 pb-4 pt-2">
                                    <button
                                        type="button"
                                        className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium rounded-md bg-[#5a8807] text-white py-2.5 hover:bg-[#86c418] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5a8807] active:scale-95 transition-transform"
                                        aria-label={`Continue with ${category.name}`}
                                    >
                                        Continue with {category.name}
                                        <span className="ml-2 text-base transition-transform group-hover:translate-x-0.5">
                                            →
                                        </span>
                                    </button>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Secondary content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#f0f7e6] flex items-center justify-center text-[#5a8807]">
                            ✓
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-800">
                                Not sure which category to choose?
                            </div>
                            <div className="text-sm text-gray-600">
                                Choose the closest match — our team will verify items and handle them correctly at pickup.
                                You can also <a href="/contact" className="text-[#5a8807] underline">contact support</a>.
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm font-semibold text-gray-800 mb-1">Before pickup</div>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                            <li>Remove personal data from devices (factory reset recommended)</li>
                            <li>Keep batteries inside devices (we handle them safely)</li>
                            <li>Disassemble only if specified — otherwise leave intact</li>
                        </ul>
                    </div>
                </div>

                {/* Footer helper */}
                <div className="mt-8 text-center text-xs text-gray-500">
                    By scheduling a pickup you agree to our <a href="/not-found" className="underline text-[#5a8807]">terms & conditions</a>.
                </div>
            </div>
        </div>
    );
};

export default SlotSchedulingPage;
