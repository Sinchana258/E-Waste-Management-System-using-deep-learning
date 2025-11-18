import React, { useEffect, useState } from "react";

// ✅ Each feature has a title + description
const solutions = [
    {
        title: "E-Waste Classification",
        description:
            "Upload images to identify and categorize your e-waste instantly using AI.",
    },
    {
        title: "Marketplace for E-Waste",
        description:
            "Buy, sell, or donate reusable electronic items safely and responsibly.",
    },
    {
        title: "Value Estimation",
        description:
            "Get instant price estimates for your e-waste items before recycling or reselling.",
    },
    {
        title: "Educational Content",
        description:
            "Learn about sustainable disposal practices through curated articles and tips.",
    },
];

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % solutions.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="bg-green-50 py-20">
            <div className="container mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        ECycle: Smarter E-Waste Management
                    </h1>
                    <p className="text-gray-700 mb-6">
                        Discover nearby recycling facilities, learn sustainable disposal
                        practices, and manage e-waste responsibly.
                    </p>

                    {/* Rotating feature */}
                    <div className="bg-white rounded-lg shadow-md p-4 transition duration-500">
                        <h2 className="text-green-600 font-semibold text-xl">
                            {solutions[currentIndex].title}
                        </h2>
                        <p className="text-gray-700 mt-1">
                            {solutions[currentIndex].description}
                        </p>
                    </div>
                </div>

                {/* Right side placeholder */}
                <div className="flex-1 h-64 md:h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Hero Image</span>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
