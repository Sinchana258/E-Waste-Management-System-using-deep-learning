import React from "react";
// import heroBanner from "../assets/ewaste-project-hero.png";
import heroBanner from "../assets/e-waste(hero).png";




const LandingPage = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="bg-green-50 py-20">
                <div className="container mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                            Ecycle: Smarter E-Waste Management
                        </h1>
                        <p className="text-gray-700 text-lg mb-6">
                            Discover nearby recycling facilities, learn sustainable disposal
                            practices, and manage e-waste responsibly with Ecycle.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
                                Find Nearest Facility
                            </button>
                            <button className="bg-white border border-green-500 text-green-500 px-6 py-3 rounded-lg hover:bg-green-100 transition">
                                Start Recycling
                            </button>
                        </div>
                    </div>

                    {/* Hero Banner Image */}
                    <div className="flex-1">
                        <img
                            src={heroBanner}
                            alt="E-Waste Recycling Banner"
                            className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
                        />
                    </div>
                </div>
            </section>

            {/* Other Sections */}
        </>
    );
};

export default LandingPage;
