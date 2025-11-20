// src/pages/LandingPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiCpu, FiDollarSign, FiMapPin, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import heroBanner from "../assets/hero-ewaste.avif";

const features = [
    {
        title: "AI Classifier",
        desc: "Snap a photo — our model identifies device type & recyclability in seconds.",
        icon: <FiCpu size={20} />,
        to: "/classifier",
        protected: false,
    },
    {
        title: "Facility Locator",
        desc: "Find certified recycling centers near you with directions and contact info.",
        icon: <FiMapPin size={20} />,
        to: "/facility-locator",
        protected: false,
    },
    {
        title: "Value Estimator",
        desc: "Get instant price estimates for your e-waste items — sell or recycle smarter.",
        icon: <FiDollarSign size={20} />,
        to: "/cost-estimator",
        protected: false,
    },
    {
        title: "Marketplace",
        desc: "Buy, sell or donate reusable electronics to extend product lifecycles.",
        icon: <FiSearch size={20} />,
        to: "/ewaste-marketplace",
        protected: true,
    },
];

const workflow = [
    { title: "Upload", desc: "Take a photo or upload an image of the device." },
    { title: "Classify", desc: "AI analyzes and suggests reuse/recycle/hazardous status." },
    { title: "Recycle", desc: "Schedule pickup or list the item on the marketplace." },
];


const LandingPage = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleNavigate = (to, protectedRoute = false) => {
        if (protectedRoute && !isLoggedIn) {
            navigate("/sign-in", { state: { from: { pathname: to } } });
            return;
        }
        navigate(to);
    };

    return (
        <div className="text-gray-800 antialiased">
            {/* HERO */}
            <section className="bg-[#E2F0C9] py-20 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col-reverse md:flex-row items-center gap-10">
                        {/* Left - Text + Facts */}
                        <div className="w-full md:w-1/2">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                                ECycle — Smarter, kinder e-waste management
                            </h1>

                            <p className="text-lg text-gray-700 mb-6 max-w-xl">
                                Discover certified recycling facilities, classify e-waste using AI, estimate value,
                                and schedule pickups — all in one modern, easy-to-use platform.
                            </p>

                            <div className="flex flex-wrap gap-4 items-center">
                                <button
                                    onClick={() => handleNavigate("/facility-locator")}
                                    className="inline-flex items-center gap-2 bg-[#BBC863] hover:bg-[#a6b554] text-white px-5 py-3 rounded-full shadow-md transition"
                                >
                                    <FiMapPin />
                                    Find Facility
                                    <FiChevronRight />
                                </button>

                                <button
                                    onClick={() => handleNavigate("/classifier")}
                                    className="inline-flex items-center gap-2 bg-white border border-green-200 text-[#30502A] px-5 py-3 rounded-full hover:bg-green-50 transition"
                                >
                                    Try Classifier
                                </button>

                                <button
                                    onClick={() => handleNavigate("/ewaste-marketplace", true)}
                                    className="text-sm text-gray-700 underline px-3 py-2 rounded"
                                >
                                    Visit Marketplace
                                </button>
                            </div>


                            {/* Improved Facts inside hero */}
                            <div className="mt-8">


                                {/* New layout: left column facts + right small infographic strip on larger screens */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                                    {/* Facts cards (left) */}


                                    {/* Right - compact infographic (visible md+) */}
                                    <div className="hidden md:flex flex-col justify-center gap-3">
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-white/60 flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[#BBC863] text-white flex items-center justify-center font-bold">50M+</div>
                                            <div>
                                                <div className="text-xs font-semibold text-gray-800">Annual e-waste</div>
                                                <div className="text-sm text-gray-600">tons generated worldwide</div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-white/60 flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[#30502A] text-white flex items-center justify-center font-bold">17%</div>
                                            <div>
                                                <div className="text-xs font-semibold text-gray-800">Properly recycled</div>
                                                <div className="text-sm text-gray-600">rate of global e-waste</div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-white/60 flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold">300×</div>
                                            <div>
                                                <div className="text-xs font-semibold text-gray-800">Gold concentration</div>
                                                <div className="text-sm text-gray-600">phones vs ore</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Circular Image */}
                        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
                            {/* Outer ring (size + ring thickness via padding) */}
                            <div
                                className="
                                    relative
                                    w-[22rem] h-[22rem]
                                    md:w-[32rem] md:h-[32rem]
                                    rounded-full
                                    bg-white/95
                                    -ml-4 md:-ml-16
                                    flex items-center justify-center
                                    shadow-2xl
                                    p-6
                                "
                                aria-hidden="true"
                            >
                                {/* Inner circle that clips the image */}
                                <div className="w-full h-full rounded-full overflow-hidden">
                                    <img
                                        src={heroBanner}
                                        alt="E-Waste Hero"
                                        className="w-full h-full object-cover object-center block"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Quick action card overlapping the ring */}
                            <div
                                className="
                                    absolute
                                    -bottom-6
                                    left-4 md:left-10
                                    -translate-y-1/2
                                    bg-white/95 backdrop-blur
                                    rounded-lg shadow-lg px-4 py-3 border
                                "
                            >
                                <div className="text-xs text-gray-600">Quick actions</div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleNavigate("/classifier")}
                                        className="text-sm bg-[#EAF3E0] px-3 py-2 rounded-md font-medium"
                                    >
                                        Classify an item
                                    </button>
                                    <button
                                        onClick={() => handleNavigate("/cost-estimator")}
                                        className="text-sm bg-white border px-3 py-2 rounded-md"
                                    >
                                        Estimate value
                                    </button>
                                </div>
                            </div>

                            {/* Decorative small circle top-right */}
                            <div className="hidden md:block absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/60 shadow-md border" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-14 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">What ECycle offers</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f) => (
                            <article
                                key={f.title}
                                className="rounded-2xl p-5 bg-[#F9FFF3] hover:bg-white transition shadow-sm hover:shadow-md border border-white/60"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-700 shadow-sm">
                                        {f.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{f.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        onClick={() => handleNavigate(f.to, f.protected)}
                                        className="text-sm text-[#30502A] font-medium underline"
                                    >
                                        {f.protected ? "Open (requires sign in)" : "Open"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* WORKFLOW */}
            <section className="py-14 bg-[#EFF9EE]">
                <div className="container mx-auto px-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">How it works</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {workflow.map((w, i) => (
                            <div
                                key={w.title}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-white/60"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#BBC863] text-white font-bold flex items-center justify-center">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{w.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{w.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MISSION / CTA */}
            <section className="py-12 bg-[#E2F0C9]">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-xl font-bold">Our mission</h4>
                        <p className="text-gray-700 max-w-xl mt-2">
                            To make e-waste recycling accessible, transparent and rewarding — for people,
                            communities and the planet.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => handleNavigate("/sign-up")}
                            className="bg-[#BBC863] text-white px-5 py-3 rounded-full shadow hover:bg-[#a6b554] transition"
                        >
                            Create account
                        </button>
                        <Link
                            to="/about"
                            className="bg-white border px-5 py-3 rounded-full flex items-center justify-center"
                        >
                            Learn more
                        </Link>
                    </div>
                </div>
            </section>

            <div className="h-12" />
        </div>
    );
};

export default LandingPage;
