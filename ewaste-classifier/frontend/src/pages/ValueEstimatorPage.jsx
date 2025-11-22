import React, { useMemo, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const USE_SERVER = process.env.REACT_APP_USE_SERVER_VALUATION === "true";

// if you have a logo in src/assets, replace this with: import logo from "../assets/ecycle-logo.png";
// and use <img src={logo} .../>
const LOGO_URL = "/logo192.png"; // temporary placeholder logo

const categories = [
    { value: "phone", label: "Mobile Phone" },
    { value: "laptop", label: "Laptop" },
    { value: "tablet", label: "Tablet" },
    { value: "tv", label: "Television" },
    { value: "desktop", label: "Desktop PC" },
    { value: "other", label: "Other" },
];

const conditions = [
    { value: "working", label: "Fully Working" },
    { value: "minor_issues", label: "Minor Issues" },
    { value: "major_issues", label: "Major Issues" },
    { value: "dead", label: "Not Working / Dead" },
];

const currency = (v) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(v);

/**
 * Rule-based baseline prices (base per-unit "like-new" price).
 */
const BASE_PRICES = {
    phone: 15000,
    laptop: 45000,
    tablet: 20000,
    tv: 30000,
    desktop: 25000,
    other: 5000,
};

/**
 * Depreciation rate per year, by category.
 */
const YEARLY_DEP_RATE = {
    phone: 0.72,
    laptop: 0.8,
    tablet: 0.76,
    tv: 0.78,
    desktop: 0.8,
    other: 0.85,
};

/**
 * Condition multipliers.
 */
const CONDITION_MULTIPLIER = {
    working: 1.0,
    minor_issues: 0.7,
    major_issues: 0.35,
    dead: 0.0,
};

/**
 * Scrap fractions.
 */
const SCRAP_FRACTION = {
    phone: 0.06,
    laptop: 0.12,
    tablet: 0.05,
    tv: 0.08,
    desktop: 0.09,
    other: 0.04,
};

/**
 * Brand premium.
 */
const BRAND_PREMIUM = {
    apple: 1.12,
    samsung: 1.03,
    xiaomi: 0.9,
    oneplus: 1.0,
    default: 1.0,
    dell: 0.98,
    hp: 0.9,
    lenovo: 0.95,
    asus: 0.95,
    acer: 0.85,
    apple_mac: 1.18,
};

function brandKeyFrom(str = "") {
    if (!str) return "default";
    const s = str.toLowerCase();

    if (s.includes("mac") || s.includes("macbook")) return "apple_mac";
    if (s.includes("apple")) return "apple";
    if (s.includes("samsung")) return "samsung";
    if (s.includes("xiaomi") || s.includes("redmi") || s.includes("mi")) return "xiaomi";
    if (s.includes("oneplus")) return "oneplus";
    if (s.includes("dell")) return "dell";
    if (s.includes("hp")) return "hp";
    if (s.includes("lenovo")) return "lenovo";
    if (s.includes("asus")) return "asus";
    if (s.includes("acer")) return "acer";

    return "default";
}

/**
 * Client-side rule-based estimator.
 * Expected item shape:
 * {
 *   category: "phone" | "laptop" | ...
 *   condition: "working" | "minor_issues" | "major_issues" | "dead"
 *   age_years: number
 *   brand?: string
 *   quantity: number
 * }
 */
function estimateClient(items = []) {
    const out = {
        items: [],
        total_min_value: 0,
        total_max_value: 0,
    };

    for (const it of items) {
        const category = it.category || "other";
        const condition = it.condition || "working";
        const age = Math.max(0, Number(it.age_years) || 0);
        const qty = Math.max(1, Number(it.quantity) || 1);
        const brandKey = brandKeyFrom(it.brand);

        const base = BASE_PRICES[category] || BASE_PRICES.other;
        const depRate = YEARLY_DEP_RATE[category] || 0.8;

        // price after age
        const afterAge = base * Math.pow(depRate, age);

        // brand premium
        const brandMul = BRAND_PREMIUM[brandKey] ?? BRAND_PREMIUM.default;

        // resale per unit (min..max)
        const resaleNominal = afterAge * (CONDITION_MULTIPLIER[condition] ?? 1) * brandMul;
        const resaleMin = Math.max(0, resaleNominal * 0.88);
        const resaleMax = resaleNominal * 1.12;

        // scrap per unit
        const scrapPerUnit = Math.max(0, base * (SCRAP_FRACTION[category] ?? 0.05));

        // decide resale vs scrap
        const useResale = condition !== "dead" && resaleNominal > scrapPerUnit * 1.2;

        const estimated_min_total = qty * (useResale ? resaleMin : scrapPerUnit);
        const estimated_max_total = qty * (useResale ? resaleMax : scrapPerUnit);

        const suggestion = useResale
            ? {
                type: "resell",
                message:
                    "Good candidate for resale — consider selling on the marketplace or trade-in programs.",
            }
            : {
                type: "recycle",
                message:
                    "Better to recycle/scrap — take it to a certified e-waste collection center.",
            };

        const itemOut = {
            ...it,
            category,
            condition,
            age_years: age,
            quantity: qty,
            base_price: Math.round(base),
            resale_value_per_unit: Math.round(resaleNominal),
            resale_min_per_unit: Math.round(resaleMin),
            resale_max_per_unit: Math.round(resaleMax),
            scrap_value_per_unit: Math.round(scrapPerUnit),
            estimated_min_total: Math.round(estimated_min_total),
            estimated_max_total: Math.round(estimated_max_total),
            suggestion,
            useResale,
        };

        out.total_min_value += itemOut.estimated_min_total;
        out.total_max_value += itemOut.estimated_max_total;
        out.items.push(itemOut);
    }

    return out;
}

export default function ValueEstimatorPage() {
    const [form, setForm] = useState({
        category: "phone",
        condition: "working",
        age_years: 1,
        brand: "",
        quantity: 1,
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const formValid = useMemo(() => {
        if (!form.category) return false;
        if (!form.condition) return false;
        if (Number(form.age_years) < 0) return false;
        if (Number(form.quantity) < 1) return false;
        return true;
    }, [form]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                name === "age_years" || name === "quantity"
                    ? value === ""
                        ? value
                        : Number(value)
                    : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setResult(null);

        if (!formValid) {
            setError("Please correct the form fields.");
            return;
        }

        setLoading(true);

        try {
            if (USE_SERVER) {
                // IMPORTANT: this matches FastAPI schema: ValueEstimateRequest(items=[...])
                const payload = {
                    items: [
                        {
                            category: form.category,
                            condition: form.condition,
                            age_years: form.age_years,
                            brand: form.brand || null,
                            quantity: form.quantity,
                        },
                    ],
                };

                const resp = await axios.post(
                    `${API_BASE_URL}/valuation/estimate`,
                    payload,
                    { timeout: 15000 }
                );

                // expected response: { total_min_value, total_max_value, items: [...] }
                setResult(resp.data);
            } else {
                const r = estimateClient([form]);
                setResult(r);
            }
        } catch (err) {
            console.error("valuation error:", err);
            setError(
                "Could not compute valuation using server. Showing client-side estimate instead."
            );

            try {
                const r = estimateClient([form]);
                setResult(r);
            } catch (fallbackErr) {
                console.error("fallback failed:", fallbackErr);
                setError("Failed to estimate value.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#E2F0C9] pt-8 pb-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-8">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#F4F8E8] p-2 flex items-center justify-center">
                        <img
                            src={LOGO_URL}
                            alt="Ecycle logo"
                            className="object-contain w-full h-full"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                            E-Waste Value Estimator
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Quickly estimate resale & scrap value (INR) — approximate guidance
                            only.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-4 md:grid-cols-2 md:gap-6 mt-6"
                    aria-label="Value estimator form"
                >
                    {/* Category */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="category"
                            className="text-sm font-medium text-gray-700 mb-1"
                        >
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
                        >
                            {categories.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Condition */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="condition"
                            className="text-sm font-medium text-gray-700 mb-1"
                        >
                            Condition
                        </label>
                        <select
                            id="condition"
                            name="condition"
                            value={form.condition}
                            onChange={handleChange}
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
                        >
                            {conditions.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Age */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="age_years"
                            className="text-sm font-medium text-gray-700 mb-1"
                        >
                            Age (years)
                        </label>
                        <input
                            id="age_years"
                            name="age_years"
                            type="number"
                            min="0"
                            step="0.5"
                            value={form.age_years}
                            onChange={handleChange}
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
                        />
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="quantity"
                            className="text-sm font-medium text-gray-700 mb-1"
                        >
                            Quantity
                        </label>
                        <input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            value={form.quantity}
                            onChange={handleChange}
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
                        />
                    </div>

                    {/* Brand */}
                    <div className="flex flex-col md:col-span-2">
                        <label
                            htmlFor="brand"
                            className="text-sm font-medium text-gray-700 mb-1"
                        >
                            Brand (optional)
                        </label>
                        <input
                            id="brand"
                            name="brand"
                            type="text"
                            placeholder="e.g., Samsung, Dell, Apple"
                            value={form.brand}
                            onChange={handleChange}
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a8807]"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Brand improves the estimate (premium/discount applied).
                        </p>
                    </div>

                    <div className="md:col-span-2 mt-2">
                        <button
                            type="submit"
                            disabled={loading || !formValid}
                            className="w-full md:w-auto px-6 py-2.5 rounded-full bg-[#5a8807] text-white font-semibold text-sm shadow-md hover:bg-[#86c418] transition disabled:opacity-60"
                            aria-disabled={loading || !formValid}
                        >
                            {loading ? "Calculating…" : "Estimate Value"}
                        </button>
                    </div>
                </form>

                {error && (
                    <p className="text-red-600 text-sm mt-4" role="alert">
                        {error}
                    </p>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="mt-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                        <div className="h-28 bg-gray-200 rounded mb-3" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="h-20 bg-gray-200 rounded" />
                            <div className="h-20 bg-gray-200 rounded" />
                        </div>
                    </div>
                )}

                {/* Results */}
                {result && (
                    <section
                        className="mt-6 bg-[#F4F8E8] rounded-2xl p-4 md:p-5"
                        aria-live="polite"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Estimated Value
                        </h2>
                        <p className="text-sm text-gray-700 mb-3">
                            Approximate total value of your items:
                        </p>

                        <div className="flex items-baseline gap-4">
                            <div className="text-2xl font-bold text-gray-900">
                                {currency(result.total_min_value)}
                            </div>
                            <div className="text-sm text-gray-700">—</div>
                            <div className="text-xl font-semibold text-gray-900">
                                {currency(result.total_max_value)}
                            </div>
                        </div>

                        <div className="space-y-3 mt-4">
                            {result.items.map((it, idx) => (
                                <article
                                    key={idx}
                                    className="bg-white rounded-xl p-3 text-sm shadow-sm"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium capitalize">
                                                {it.category} × {it.quantity}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {it.brand
                                                    ? `Brand: ${it.brand}`
                                                    : "Brand: -"}{" "}
                                                • Age: {it.age_years} yr • Condition:{" "}
                                                {String(it.condition).replace("_", " ")}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="font-semibold">
                                                {currency(it.estimated_min_total)} –{" "}
                                                {currency(it.estimated_max_total)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                per unit:{" "}
                                                {currency(it.resale_min_per_unit)} –{" "}
                                                {currency(it.resale_max_per_unit)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                        <div className="text-xs text-gray-600">
                                            Resale:{" "}
                                            <strong>
                                                {currency(it.resale_value_per_unit)}
                                            </strong>{" "}
                                            / unit • Scrap:{" "}
                                            <strong>
                                                {currency(it.scrap_value_per_unit)}
                                            </strong>{" "}
                                            / unit
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {it.useResale ? (
                                                <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                                                    Resell
                                                </span>
                                            ) : (
                                                <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                                                    Recycle
                                                </span>
                                            )}

                                            <div className="text-xs text-gray-700">
                                                {it.suggestion?.message}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <p className="text-[11px] text-gray-500 mt-3">
                            Note: Estimates are indicative. Final valuation depends on
                            physical inspection, parts condition, and market demand.
                        </p>

                        <div className="mt-4 flex gap-3 flex-col sm:flex-row">
                            <a
                                className="inline-block rounded-md px-4 py-2 text-sm bg-white border hover:bg-gray-50 shadow-sm"
                                href="/facilities"
                            >
                                Find nearby collection centers
                            </a>

                            <a
                                className="inline-block rounded-md px-4 py-2 text-sm bg-[#5a8807] text-white hover:bg-[#86c418]"
                                href="/marketplace"
                            >
                                Post on Marketplace
                            </a>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
