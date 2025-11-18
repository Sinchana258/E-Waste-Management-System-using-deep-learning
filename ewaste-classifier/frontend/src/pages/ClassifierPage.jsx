
// src/pages/LandingPage.jsx
import React, { useState } from "react";
import axios from "axios";
import UploadForm from "../components/UploadForm";
import ResultCard from "../components/ResultCard";

const ClassifyPage = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [speed, setSpeed] = useState("");         // NEW
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (file) => {
        setUploadedFile(file);
        setImageUrl(URL.createObjectURL(file));
        setLoading(true);
        setError("");
        setPredictions([]);
        setSpeed("");                                // NEW

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                "http://localhost:8000/classify",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setPredictions(response.data.predictions || []);
            setSpeed(response.data.speed || "");     // NEW
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        // free object URL
        if (imageUrl) {
            try { URL.revokeObjectURL(imageUrl); } catch (e) { }
        }
        setUploadedFile(null);
        setImageUrl(null);
        setPredictions([]);
        setSpeed("");
        setError("");
        setLoading(false);
    };



    return (
        <>
            {/* Hero Section */}
            <section className="bg-green-50 py-20">
                <div className="container mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center gap-12">

                    {/* Left Area */}
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

                    {/* Upload Section */}
                    <div className="flex-1">
                        <div className="w-full h-[700px] md:h-[720px] rounded-lg flex items-center justify-center bg-gray-100 p-4">

                            {!uploadedFile ? (
                                <UploadForm onUpload={handleUpload} />

                            ) : loading ? (
                                <p className="text-gray-700">Classifying image...</p>

                            ) : error ? (
                                <p className="text-red-500">{error}</p>

                            ) : (
                                <ResultCard
                                    imageUrl={imageUrl}
                                    predictions={predictions}
                                    speed={speed}
                                    onClear={handleClear}   // NEW
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Placeholder Sections */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6 text-center">Our Solutions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Solution 1 */}
                        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                            <h3 className="text-xl font-semibold mb-3">E-Waste Classification</h3>
                            <p className="text-gray-700">
                                Upload your e-waste image and instantly identify its category
                                (recyclable, hazardous, reusable) with AI-powered classification.
                            </p>
                        </div>

                        {/* Solution 2 */}
                        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                            <h3 className="text-xl font-semibold mb-3">Marketplace</h3>
                            <p className="text-gray-700">
                                Buy, sell, or donate used electronics safely through our curated
                                e-waste marketplace, giving devices a second life.
                            </p>
                        </div>

                        {/* Solution 3 */}
                        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                            <h3 className="text-xl font-semibold mb-3">Value Estimation</h3>
                            <p className="text-gray-700">
                                Get instant estimates of your e-waste’s resale or recycling value,
                                helping you make informed disposal decisions.
                            </p>
                        </div>
                    </div>

                    {/* Educational Content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        <div className="bg-white shadow-lg rounded-lg p-6 text-center md:col-span-3">
                            <h3 className="text-xl font-semibold mb-3">Educational Content</h3>
                            <p className="text-gray-700">
                                Learn about sustainable disposal practices, environmental impact,
                                and government guidelines through our curated articles and blogs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-green-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">How It Works</h2>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        Brief description about how users can upload their e-waste,
                        classify it, and find recycling options.
                    </p>
                </div>
            </section>
        </>
    );
};

export default ClassifyPage;
