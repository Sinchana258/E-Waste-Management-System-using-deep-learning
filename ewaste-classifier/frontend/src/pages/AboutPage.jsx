import React from "react";
import heroImage from "../assets/features/banner.svg";

// React Icons
import { FaShieldAlt, FaLock, FaRecycle, FaBolt } from "react-icons/fa";

const PRIMARY = "#5A8807";          // Dark green
const PRIMARY_LIGHT = "#E8F4D7";    // Soft light green

const About = () => {
    return (
        <section
            id="features"
            aria-labelledby="features-title"
            className="section bg-white py-12"
        >
            <div className="container mx-auto px-4">

                {/* Intro Section */}
                <header className="max-w-4xl mx-auto text-center mb-10 md:mb-14">
                    <p
                        className="section-subtitle font-semibold text-sm mb-2 tracking-widest"
                        style={{ color: PRIMARY }}
                    >
                        — Discover ECycle —
                    </p>

                    <h2
                        id="features-title"
                        className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight"
                    >
                        Pioneering the future of e-waste management & sustainability
                    </h2>

                    <p className="mt-4 text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
                        India generates millions of tonnes of e-waste each year. ECycle bridges the gap
                        between citizens and certified recycling partners — making safe disposal,
                        responsible reuse and resource recovery simple and trustworthy.
                    </p>
                </header>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    {/* Left Text Section */}
                    <article className="order-2 md:order-1 md:pl-6">
                        <p className="text-gray-700 text-lg md:text-xl mb-6 leading-relaxed">
                            Our platform connects you to certified collection facilities, offers
                            AI-assisted classification, and helps you estimate the value of old devices —
                            all while ensuring data security and environmental compliance.
                        </p>

                        {/* Features Grid */}
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                            {/* Feature Card 1 */}
                            <li className="flex items-start gap-3 rounded-lg p-4 shadow-sm"
                                style={{ backgroundColor: PRIMARY_LIGHT }}>
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow"
                                    style={{ color: PRIMARY }}>
                                    <FaShieldAlt size={22} />
                                </span>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Certified Facilities</h4>
                                    <p className="text-sm text-gray-600">Verified recyclers with proper protocols.</p>
                                </div>
                            </li>

                            {/* Feature Card 2 */}
                            <li className="flex items-start gap-3 rounded-lg p-4 shadow-sm"
                                style={{ backgroundColor: PRIMARY_LIGHT }}>
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow"
                                    style={{ color: PRIMARY }}>
                                    <FaLock size={22} />
                                </span>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Data Security</h4>
                                    <p className="text-sm text-gray-600">Secure data wiping and handling guidance.</p>
                                </div>
                            </li>

                            {/* Feature Card 3 */}
                            <li className="flex items-start gap-3 rounded-lg p-4 shadow-sm"
                                style={{ backgroundColor: PRIMARY_LIGHT }}>
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow"
                                    style={{ color: PRIMARY }}>
                                    <FaRecycle size={22} />
                                </span>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Resource Recovery</h4>
                                    <p className="text-sm text-gray-600">Recover valuable metals, reduce waste.</p>
                                </div>
                            </li>

                            {/* Feature Card 4 */}
                            <li className="flex items-start gap-3 rounded-lg p-4 shadow-sm"
                                style={{ backgroundColor: PRIMARY_LIGHT }}>
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow"
                                    style={{ color: PRIMARY }}>
                                    <FaBolt size={22} />
                                </span>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Easy Booking</h4>
                                    <p className="text-sm text-gray-600">Fast pickups & seamless scheduling.</p>
                                </div>
                            </li>
                        </ul>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="/contact"
                                className="inline-block px-6 py-3 rounded-full text-white font-semibold shadow transition"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                Connect With Us
                            </a>

                            <a
                                href="/recycle"
                                className="inline-block px-6 py-3 rounded-full bg-white font-semibold transition"
                                style={{
                                    border: `2px solid ${PRIMARY}`,
                                    color: PRIMARY,
                                }}
                            >
                                Explore Recycling Solutions
                            </a>
                        </div>
                    </article>

                    {/* Right Image Section */}
                    <figure className="order-1 md:order-2 flex items-center justify-center">
                        <div
                            className="relative rounded-2xl overflow-hidden shadow-xl p-6"
                            style={{
                                background: `linear-gradient(to bottom right, ${PRIMARY_LIGHT}, white)`,
                                width: "28rem",
                                height: "28rem",
                                display: "grid",
                                placeItems: "center",
                            }}
                        >
                            <div
                                className="absolute inset-0 rounded-2xl pointer-events-none"
                                style={{
                                    boxShadow: `inset 0 0 0 14px rgba(90,136,7,0.15)`
                                }}
                            />

                            <img
                                src={heroImage}
                                alt="Sustainable e-waste recycling illustration"
                                className="relative w-full h-full object-contain transform transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    </figure>
                </div>

                {/* Tiny Footer Note */}
                <div className="mt-10 text-center text-sm text-gray-500">
                    Built for sustainability — certified partners, secure handling, and practical e-waste solutions.
                </div>
            </div>
        </section>
    );
};

export default About;
