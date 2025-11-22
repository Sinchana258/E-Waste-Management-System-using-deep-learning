// src/components/ResultCard.jsx
import React, { useMemo } from "react";
import { ClipboardIcon, XMarkIcon } from "@heroicons/react/24/outline";
import placeholderImg from "../assets/Elogo.png";

const CATEGORY_DEFS = {
    hazardous: {
        title: "Hazardous",
        color: "bg-red-600",
        textColorClass: "text-red-600",
        // keywords (many variants). Hazardous gets higher weight
        keywords: [
            "battery",
            "li-ion",
            "li ion",
            "lithium",
            "lead acid",
            "capacitor",
            "pcb",
            "printed circuit",
            "transformer",
            "mercury",
            "cfl",
            "fluorescent",
            "acid",
            "chemical",
            "brominated",
            "hazardous",
            "explosive",
            "tox",
            "toxicity",
            "pcbboard",
            "power supply",
            "solder"
        ],
        weight: 2.4,
        suggestion:
            "This item may contain hazardous materials (batteries, mercury, capacitors, PCBs). Do NOT throw it in regular trash. Use a certified e-waste facility for safe disposal.",
        ctas: [
            { label: "Find Safe Facility", href: "/facility-locator", style: "bg-red-600 text-white" },
            { label: "Safety Tips", href: "/safety", style: "border border-red-200 text-red-700 bg-white" }
        ],
    },
    reusable: {
        title: "Reusable",
        color: "bg-blue-600",
        textColorClass: "text-blue-600",
        keywords: [
            "phone",
            "smartphone",
            "laptop",
            "tablet",
            "monitor",
            "tv",
            "television",
            "camera",
            "printer",
            "speaker",
            "console",
            "router",
            "keyboard",
            "mouse",
            "hard drive",
            "ssd",
            "macbook",
            "iphone",
            "galaxy",
            "imac",
            "workstation"
        ],
        weight: 1.6,
        suggestion:
            "This device looks reusable or resellable. Consider donating, listing it in the marketplace, or selling to extend the device's life.",
        ctas: [
            { label: "Post to Marketplace", href: "/marketplace", style: "bg-blue-600 text-white" },
            { label: "Estimate Value", href: "/value-estimator", style: "border border-blue-200 text-blue-700 bg-white" }
        ],
    },
    recyclable: {
        title: "Recyclable",
        color: "bg-emerald-600",
        textColorClass: "text-emerald-600",
        keywords: [
            "cable",
            "charger",
            "adapter",
            "keyboard",
            "headphone",
            "earbuds",
            "plastic",
            "metal",
            "pcb scrap",
            "motherboard",
            "case",
            "frame",
            "fan",
            "heat sink",
            "accessory",
            "power cord",
            "speaker cone"
        ],
        weight: 1.0,
        suggestion:
            "This item can be recycled. Drop it at a certified e-waste recycling center so materials are recovered responsibly.",
        ctas: [
            { label: "Find Facility", href: "/facility-locator", style: "bg-emerald-600 text-white" },
            { label: "Estimate Value", href: "/value-estimator", style: "border border-emerald-200 text-emerald-700 bg-white" }
        ],
    },
};

// helper: normalize string for matching
const norm = (s = "") => s.toLowerCase().replace(/[^a-z0-9\s\-]/g, " ").trim();

const decideCategory = (predictions = [], backendCategory = null) => {
    // If backend explicitly returned a category, prefer it (trust backend)
    if (backendCategory && ["hazardous", "reusable", "recyclable"].includes(backendCategory)) {
        return backendCategory;
    }

    // use top N predictions
    const topN = predictions.slice(0, 6);
    if (!topN.length) return "recyclable";

    // initialize scores
    const scores = { hazardous: 0, reusable: 0, recyclable: 0 };

    // loop predictions and increment scores by confidence * weight when keyword matches
    topN.forEach((p) => {
        const label = norm(p.label || "");
        const conf = Number(p.confidence || 0);
        if (!label) return;

        Object.entries(CATEGORY_DEFS).forEach(([key, def]) => {
            def.keywords.forEach((kw) => {
                // word boundary match or substring match if kw has spaces (e.g. "printed circuit")
                const k = kw.toLowerCase();
                if (k.includes(" ")) {
                    if (label.includes(k)) {
                        scores[key] += conf * def.weight;
                    }
                } else {
                    // match whole word or substring (covers variants)
                    if (label.split(/\s+/).some((tok) => tok.includes(k) || k.includes(tok)) || label.includes(k)) {
                        scores[key] += conf * def.weight;
                    }
                }
            });
        });
    });

    // If all scores are zero (no keywords matched), try heuristics:
    const allZero = Object.values(scores).every((v) => v === 0);
    if (allZero) {
        // some heuristics based on single-label hints
        const label = norm(topN[0].label || "");
        if (label.includes("battery") || label.includes("pcb") || label.includes("capacitor") || label.includes("mercury")) {
            return "hazardous";
        }
        if (label.includes("phone") || label.includes("laptop") || label.includes("tablet") || label.includes("monitor")) {
            return "reusable";
        }
        return "recyclable";
    }

    // pick max score
    const sortedKeys = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const winner = sortedKeys[0];

    // tie-breaker: if top two are close (<10% difference) and one is hazardous, pick hazardous
    const [first, second] = sortedKeys;
    const firstScore = scores[first];
    const secondScore = scores[second];
    if (firstScore > 0 && secondScore > 0) {
        const diff = (firstScore - secondScore) / Math.max(1, firstScore);
        if (diff < 0.1 && (first === "recyclable" || second === "recyclable")) {
            // if hazardous present among top two, pick hazardous
            if (first === "hazardous" || second === "hazardous") return "hazardous";
        }
    }

    return winner;
};

const ResultCard = ({ imageUrl, predictions = [], speed = "", onClear, loading = false, backendCategory = null }) => {
    const sorted = (predictions || []).slice().sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

    const top = sorted[0] || null;

    // determine category using new decision function (prefers backendCategory if provided)
    const categoryKey = useMemo(() => decideCategory(sorted, backendCategory), [sorted, backendCategory]);

    const categoryInfo = CATEGORY_DEFS[categoryKey] || CATEGORY_DEFS.recyclable;

    return (
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        {loading ? (
                            <div className="w-full h-full animate-pulse bg-gray-200" />
                        ) : (
                            <img
                                src={imageUrl || placeholderImg}
                                alt="uploaded"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = placeholderImg;
                                    e.currentTarget.onerror = null;
                                }}
                            />
                        )}
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-xl font-semibold text-gray-800">Classification Summary</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {speed ? `Processed in ${speed}` : "Confidence scores and suggestions shown below"}
                        </p>

                        {!loading && top && (
                            <div className="mt-3">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryInfo.textColorClass} border ${categoryKey === "hazardous"
                                            ? "border-red-200"
                                            : categoryKey === "reusable"
                                                ? "border-blue-200"
                                                : "border-emerald-200"
                                            } bg-white`}
                                    >
                                        {categoryInfo.title}
                                    </div>

                                    <div className="px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                                        Top: <span className="font-medium">{top.label}</span>
                                    </div>

                                    <div className="text-xs text-gray-500 ml-2">
                                        {Math.round((top.confidence || 0) * 100)}% confidence
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            if (sorted.length) navigator.clipboard?.writeText(sorted[0].label || "");
                        }}
                        title="Copy top label"
                        className="p-2 rounded-md hover:bg-gray-100 transition"
                    >
                        <ClipboardIcon className="w-5 h-5 text-gray-600" />
                    </button>

                    <button
                        onClick={() => onClear && onClear()}
                        title="Clear"
                        className="p-2 rounded-md hover:bg-gray-100 transition"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="my-4 border-t" />

            <div className="space-y-4">
                {loading ? (
                    <>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
                    </>
                ) : sorted.length ? (
                    sorted.map((p, idx) => (
                        <div key={`${p.label}-${idx}`} className="w-full">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-medium text-gray-800">{p.label}</div>
                                    <div className="text-xs text-gray-500">
                                        Confidence: {Math.round((p.confidence || 0) * 100)}%
                                    </div>
                                </div>

                                <div className="w-48">
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-2 rounded-full transition-all"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.round((p.confidence || 0) * 100)
                                                )}%`,
                                                background:
                                                    categoryKey === "hazardous"
                                                        ? "linear-gradient(90deg,#f56565,#fc8181)"
                                                        : categoryKey === "reusable"
                                                            ? "linear-gradient(90deg,#2563eb,#60a5fa)"
                                                            : "linear-gradient(90deg,#16a34a,#34d399)",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-500">No predictions available.</div>
                )}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-gray-50 border">
                <div className="flex items-start gap-4">
                    <div>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${categoryInfo.color} text-white`}>
                            {categoryInfo.title}
                        </div>
                    </div>

                    <div className="flex-1">
                        <p className="text-gray-700">{categoryInfo.suggestion}</p>

                        <div className="mt-4 flex flex-wrap gap-3">
                            {categoryInfo.ctas.map((c, i) => (
                                <a
                                    key={i}
                                    href={c.href}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${c.style} hover:opacity-95 transition`}
                                >
                                    {c.label}
                                </a>
                            ))}

                            {categoryKey === "hazardous" && (
                                <button
                                    onClick={() => window.open("/safety#handling", "_blank")}
                                    className="px-4 py-2 rounded-md text-sm border border-gray-200 bg-white"
                                >
                                    Handling tips
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
