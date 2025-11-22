import React, { useState } from "react";
import axios from "axios";
import UploadForm from "../components/UploadForm";
import ResultCard from "../components/ResultCard";

const PRIMARY = "#5a8807";
const BG_LIGHT = "#E7F5D2";
const BG_Lighter = "#F6FAEC";

const ClassifyPage = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [speed, setSpeed] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [backendCategory, setBackendCategory] = useState(null);
    const handleUpload = async (file) => {
        setUploadedFile(file);
        setImageUrl(URL.createObjectURL(file));
        setLoading(true);
        setError("");
        setPredictions([]);
        setSpeed("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                "http://localhost:8000/classify",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setPredictions(response.data.predictions || []);
            setSpeed(response.data.speed || "");
            setBackendCategory(response.data.category || null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        if (imageUrl) {
            try { URL.revokeObjectURL(imageUrl); } catch (e) { }
        }
        setUploadedFile(null);
        setImageUrl(null);
        setPredictions([]);
        setSpeed("");
        setError("");
    };

    return (
        <>
            {/* Hero Section */}
            <section
                className="py-20"
                style={{ backgroundColor: BG_LIGHT }}
            >
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">

                    {/* Text Area */}
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a2b0d] mb-6">
                            AI-Powered E-Waste Classification
                        </h1>

                        <p className="text-gray-700 text-lg mb-6 max-w-lg">
                            Upload an image of your e-waste and get instant, accurate
                            classification — recyclable, reusable, or hazardous.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => (window.location.href = "/about")}
                                className="px-6 py-3 rounded-lg text-white"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                Learn How It Works
                            </button>
                            <a
                                href="/facility-locator"
                                className="px-6 py-3 rounded-lg border"
                                style={{ borderColor: PRIMARY, color: PRIMARY }}
                            >
                                Find Facility
                            </a>
                        </div>
                    </div>

                    {/* Upload Box */}
                    <div className="flex-1">
                        <div
                            className="w-full rounded-xl shadow-lg flex items-center justify-center p-6"
                            style={{ backgroundColor: BG_Lighter, minHeight: "480px" }}
                        >
                            {!uploadedFile ? (
                                <UploadForm onUpload={handleUpload} />
                            ) : loading ? (
                                <p className="text-gray-700 text-xl">Analyzing...</p>
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <ResultCard
                                    imageUrl={imageUrl}
                                    predictions={predictions}
                                    speed={speed}
                                    backendCategory={backendCategory}
                                    onClear={handleClear}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Solutions Section */}
            <section className="py-16" style={{ backgroundColor: "#ffffff" }}>
                <div className="container mx-auto px-4">
                    <h2
                        className="text-3xl font-bold text-center mb-10"
                        style={{ color: PRIMARY }}
                    >
                        What Ecycle Offers
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white shadow-md p-6 rounded-xl border border-green-100">
                            <h3 className="text-xl font-semibold mb-3" style={{ color: PRIMARY }}>
                                E-Waste Classification
                            </h3>
                            <p className="text-gray-600">
                                Upload your e-waste and get instant AI-powered category detection.
                            </p>
                        </div>

                        <div className="bg-white shadow-md p-6 rounded-xl border border-green-100">
                            <h3 className="text-xl font-semibold mb-3" style={{ color: PRIMARY }}>
                                Marketplace
                            </h3>
                            <p className="text-gray-600">
                                Sell, buy, or donate old electronic devices safely.
                            </p>
                        </div>

                        <div className="bg-white shadow-md p-6 rounded-xl border border-green-100">
                            <h3 className="text-xl font-semibold mb-3" style={{ color: PRIMARY }}>
                                Value Estimation
                            </h3>
                            <p className="text-gray-600">
                                Get accurate price estimates for your old electronics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20" style={{ backgroundColor: BG_LIGHT }}>
                <div className="container mx-auto px-4 text-center">
                    <h2
                        className="text-3xl font-bold mb-4"
                        style={{ color: PRIMARY }}
                    >
                        How It Works
                    </h2>

                    <p className="max-w-3xl mx-auto text-gray-700 text-lg">
                        Upload → AI Classifies → View Results → Explore Recycling Options
                    </p>
                </div>
            </section>
        </>
    );
};

export default ClassifyPage;
