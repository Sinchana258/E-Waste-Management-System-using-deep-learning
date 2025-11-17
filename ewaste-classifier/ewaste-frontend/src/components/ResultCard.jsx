import React, { useEffect, useRef, useState } from "react";

/**
 * ResultCard
 * Props:
 *  - imageUrl: object URL of uploaded image
 *  - predictions: [{ class_id, class_name, confidence, bbox: [x1,y1,x2,y2] }]
 *  - speed: optional string from backend (speed info)
 */

const DEFAULT_COLORS = {
    Recyclable: "rgba(34,197,94,0.95)",
    Hazardous: "rgba(239,68,68,0.95)",
    Reusable: "rgba(59,130,246,0.95)",
    default: "rgba(168,85,247,0.95)",
};

function pickColor(className) {
    if (!className) return DEFAULT_COLORS.default;
    const key = Object.keys(DEFAULT_COLORS).find(
        (k) => k.toLowerCase() === className.toLowerCase()
    );
    return DEFAULT_COLORS[key] || DEFAULT_COLORS.default;
}

export default function ResultCard({ imageUrl, predictions = [], speed = "", onClear }) {
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);

    const [showJson, setShowJson] = useState(false);

    // NEW: Zoom state
    const [zoom, setZoom] = useState(1);

    const zoomIn = () => setZoom((z) => Math.min(2, z + 0.25));
    const zoomOut = () => setZoom((z) => Math.max(0.5, z - 0.25));
    const resetZoom = () => setZoom(1);

    // Draw boxes when image loads or predictions change
    useEffect(() => {
        const img = imgRef.current;
        const canvas = canvasRef.current;
        if (!img || !canvas) return;

        function fitCanvas() {
            if (!wrapperRef.current) return;

            // match canvas to wrapper (scaled area)
            const rect = wrapperRef.current.getBoundingClientRect();
            canvas.width = Math.round(rect.width);
            canvas.height = Math.round(rect.height);
            draw();
        }

        function draw() {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!predictions || predictions.length === 0) return;

            const naturalW = img.naturalWidth || img.width;
            const naturalH = img.naturalHeight || img.height;

            // scaled (zoomed) wrapper dims
            const dispW = canvas.width;
            const dispH = canvas.height;

            const scaleX = dispW / naturalW;
            const scaleY = dispH / naturalH;

            const maxVal = predictions.reduce((acc, p) => Math.max(acc, ...p.bbox), 0);
            const normalized = maxVal <= 1.0;

            predictions.forEach((p) => {
                let [x1, y1, x2, y2] = p.bbox.map(Number);

                if (normalized) {
                    x1 *= naturalW;
                    x2 *= naturalW;
                    y1 *= naturalH;
                    y2 *= naturalH;
                }

                const dx1 = x1 * scaleX;
                const dy1 = y1 * scaleY;
                const dx2 = x2 * scaleX;
                const dy2 = y2 * scaleY;

                const w = Math.max(1, dx2 - dx1);
                const h = Math.max(1, dy2 - dy1);

                const color = pickColor(p.class_name);
                ctx.lineWidth = Math.max(2, Math.round((dispW / 640) * 3));
                ctx.strokeStyle = color;

                ctx.globalAlpha = 0.08;
                ctx.fillStyle = color;
                ctx.fillRect(dx1, dy1, w, h);
                ctx.globalAlpha = 1.0;

                ctx.strokeRect(dx1, dy1, w, h);

                const label = `${p.class_name} ${(p.confidence * 100).toFixed(1)}%`;
                ctx.font = `${Math.max(12, Math.round(dispW / 64))}px sans-serif`;
                const textWidth = ctx.measureText(label).width;
                const padding = 6;
                const labelHeight = parseInt(ctx.font, 10) + 6;

                ctx.globalAlpha = 0.9;
                ctx.fillStyle = color;
                ctx.fillRect(dx1, Math.max(0, dy1 - labelHeight), textWidth + padding * 2, labelHeight);
                ctx.globalAlpha = 1.0;

                ctx.fillStyle = "#fff";
                ctx.fillText(label, dx1 + padding, Math.max(12, dy1 - 6));
            });
        }

        fitCanvas();
        window.addEventListener("resize", fitCanvas);

        return () => window.removeEventListener("resize", fitCanvas);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageUrl, predictions, zoom]);

    return (
        <div className="w-full h-full flex flex-col">

            {/* Zoom Controls */}
            <div className="flex gap-2 mb-2">
                <button onClick={zoomOut} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">−</button>
                <button onClick={resetZoom} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Reset</button>
                <button onClick={zoomIn} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">+</button>
            </div>

            <div
                ref={wrapperRef}
                className="relative rounded-md shadow-md bg-white overflow-hidden"
                style={{
                    minHeight: 350,
                    transform: `scale(${zoom})`,
                    transformOrigin: "top center",
                    transition: "transform 0.25s ease",
                }}
            >
                <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Uploaded e-waste"
                    onLoad={() => {
                        const evt = new Event("resize");
                        setTimeout(() => window.dispatchEvent(evt), 50);
                    }}
                    className="w-full object-contain bg-gray-50"
                    style={{ maxHeight: 600 }}
                />

                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        pointerEvents: "none",
                        width: "100%",
                        height: "100%",
                    }}
                />
            </div>

            {/* Predictions list */}
            <div className="mt-4 bg-white p-4 rounded-md shadow-sm max-h-56 overflow-auto">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Predictions</h4>

                    <div className="flex items-center gap-2">
                        <button
                            className="text-sm text-gray-600 hover:text-gray-800"
                            on={() => setShowJson((s) => !s)}
                        >
                            {showJson ? "Hide JSON" : "Show JSON"}
                        </button>

                        <button
                            className="text-sm text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
                            onClick={() => { if (onClear) onClear(); }}
                            title="Clear image & predictions"
                        >
                            Clear
                        </button>
                    </div>
                </div>


                <div className="mt-3">
                    {predictions && predictions.length ? (

                        (() => {
                            // Sort predictions (High → Low confidence)
                            const sorted = [...predictions].sort(
                                (a, b) => b.confidence - a.confidence
                            );

                            // Helper: Recommendation based on class
                            const getRecommendation = (cls) => {
                                switch (cls.toLowerCase()) {
                                    case "recyclable":
                                        return "This item is recyclable. Dispose at an authorised e-waste collection center.";
                                    case "hazardous":
                                        return "This item contains hazardous components. Handle with caution & follow safety guidelines.";
                                    case "reusable":
                                        return "This item seems reusable. Consider repairing, reselling, or donating it.";
                                    default:
                                        return "No recommendation available.";
                                }
                            };

                            return (
                                <ul className="space-y-4">
                                    {sorted.map((p, i) => (
                                        <li key={i} className="p-3 rounded-md border border-gray-200 bg-gray-50">

                                            {/* Class Badge */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <span
                                                    className="px-2 py-0.5 text-xs text-white rounded"
                                                    style={{ background: pickColor(p.class_name) }}
                                                >
                                                    {p.class_name}
                                                </span>

                                                <span className="text-xs text-gray-600">
                                                    {(p.confidence * 100).toFixed(1)}%
                                                </span>
                                            </div>

                                            {/* Confidence Bar */}
                                            <div className="w-full bg-gray-200 h-2 rounded">
                                                <div
                                                    className="h-2 rounded"
                                                    style={{
                                                        background: pickColor(p.class_name),
                                                        width: `${p.confidence * 100}%`,
                                                    }}
                                                ></div>
                                            </div>

                                            {/* BBox */}
                                            <div className="text-xs text-gray-600 mt-2">
                                                bbox: {p.bbox.map((n) => Number(n).toFixed(2)).join(", ")}
                                            </div>

                                            {/* Recommendation */}
                                            <div className="mt-2 text-sm text-gray-700">
                                                <strong>Suggestion:</strong> {getRecommendation(p.class_name)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            );
                        })()

                    ) : (
                        <p className="text-gray-500 text-sm">No objects detected.</p>
                    )}
                </div>

                {/* JSON Viewer */}
                {showJson && (
                    <pre className="mt-3 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(predictions, null, 2)}
                    </pre>
                )}

                {/* Speed */}
                {speed && (
                    <div className="mt-3 text-xs text-gray-600">
                        <strong>Speed:</strong> {speed}
                    </div>
                )}


                {showJson && (
                    <pre className="mt-3 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(predictions, null, 2)}
                    </pre>
                )}

                {speed && (
                    <div className="mt-3 text-xs text-gray-600">
                        <strong>Speed:</strong> {speed}
                    </div>
                )}
            </div>
        </div>
    );
}
